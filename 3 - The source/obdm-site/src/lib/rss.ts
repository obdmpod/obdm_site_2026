import { XMLParser } from "fast-xml-parser";

export interface Chapter {
  time: string;
  seconds: number;
  label: string;
}

export interface Episode {
  episodeNumber: number | null;
  title: string;
  cleanTitle: string;
  link: string;
  guid: string;
  pubDate: string;
  duration: string | null;
  audioUrl: string | null;
  audioBytes: number | null;
  audioType: string | null;
  imageUrl: string | null;
  chapters: Chapter[];
  summary: string;
}

interface RawItem {
  title?: string;
  link?: string;
  pubDate?: string;
  guid?: string | { "#text"?: string };
  description?: string;
  "content:encoded"?: string;
  "itunes:episode"?: number | string;
  "itunes:duration"?: number | string;
  "itunes:image"?: { "@_href"?: string };
  "itunes:summary"?: string;
  enclosure?: { "@_url"?: string; "@_length"?: string; "@_type"?: string };
}

const TITLE_NUMBER = /^\s*(?:OB[DM]M?|not-OBDM)\s*#?(\d{2,4})\b/i;
const TITLE_PREFIX_STRIP = /^\s*(?:OB[DM]M?|not-OBDM)\s*#?\d{2,4}\s*[-–—:]\s*/i;
const CHAPTER_LINE = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*[–—-]\s*(.+)$/;

function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .trim();
}

function parseChapters(description: string | undefined): Chapter[] {
  if (!description) return [];
  // Chapter lines are separated by <br/>, but the trailing disclaimer/contact
  // block that follows the last chapter only has a paragraph break — treat
  // paragraph boundaries as line breaks too so that text doesn't bleed in.
  const fragments = description.split(/<br\s*\/?>|<\/?p[^>]*>/i);
  const chapters: Chapter[] = [];
  for (const fragment of fragments) {
    const text = decodeEntities(fragment.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
    const match = text.match(CHAPTER_LINE);
    if (!match) continue;
    const [, time, label] = match;
    chapters.push({ time, seconds: timeToSeconds(time), label: label.trim() });
  }
  return chapters;
}

// Every episode description ends with a boilerplate copyright disclaimer and
// a "CONTACT LINKS" block — cut those before deriving a summary from what's left.
function stripBoilerplate(html: string): string {
  return html.split(/Copyright Disclaimer/i)[0].split(/CONTACT LINKS/i)[0];
}

function parseSummary(description: string | undefined): string {
  if (!description) return "";
  const content = stripBoilerplate(description);
  const text = decodeEntities(content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
  if (!text || CHAPTER_LINE.test(text)) return "";
  return text;
}

function normalize(raw: RawItem): Episode {
  const title = decodeEntities(raw.title ?? "");
  const numberMatch = title.match(TITLE_NUMBER);
  const episodeNumber = numberMatch
    ? Number(numberMatch[1])
    : raw["itunes:episode"]
      ? Number(raw["itunes:episode"])
      : null;
  const cleanTitle = title.replace(TITLE_PREFIX_STRIP, "").trim() || title;
  // Prefer `description`: Libsyn separates chapter lines with literal <br/> tags
  // there, but collapses them to spaces in `content:encoded`.
  const description = raw.description ?? raw["content:encoded"] ?? "";
  const guid = typeof raw.guid === "string" ? raw.guid : (raw.guid?.["#text"] ?? "");

  return {
    episodeNumber,
    title,
    cleanTitle,
    link: raw.link ?? "",
    guid,
    pubDate: raw.pubDate ?? "",
    duration: raw["itunes:duration"] ? String(raw["itunes:duration"]) : null,
    audioUrl: raw.enclosure?.["@_url"] ?? null,
    audioBytes: raw.enclosure?.["@_length"] ? Number(raw.enclosure["@_length"]) : null,
    audioType: raw.enclosure?.["@_type"] ?? null,
    imageUrl: raw["itunes:image"]?.["@_href"] ?? null,
    chapters: parseChapters(description),
    summary: parseSummary(description),
  };
}

/** Extract the newest item from Libsyn's newest-first feed. */
export function parseLatestEpisode(xml: string): Episode {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false,
    isArray: (_name, path) => path === "rss.channel.item",
  });
  const first = parser.parse(xml)?.rss?.channel?.item?.[0];
  if (!first) throw new Error("Libsyn RSS contains no episodes");
  const episode = normalize(first);
  if (!episode.title || !episode.guid || !Number.isFinite(Date.parse(episode.pubDate)) ||
      !/^https?:\/\//i.test(episode.link) || !/^https?:\/\//i.test(episode.audioUrl ?? "")) {
    throw new Error("Incomplete latest episode; keeping the previous snapshot");
  }
  return episode;
}
