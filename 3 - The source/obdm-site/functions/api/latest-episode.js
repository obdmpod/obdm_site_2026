import { parseLatestEpisode } from "../../src/lib/rss.ts";

const day = 86400;
const feed = "https://ourbigdumbmouth.libsyn.com/rss";

// Libsyn lists newest first. Stop after one item rather than downloading and
// parsing the multi-megabyte archive on a small edge worker.
async function latestFromLibsyn() {
  const response = await fetch(feed, { signal: AbortSignal.timeout(15000) });
  if (!response.ok || !response.body) throw new Error("Libsyn unavailable");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let xml = "";
  try {
    while (xml.length < 256 * 1024) {
      const { done, value } = await reader.read();
      if (done) break;
      xml += decoder.decode(value, { stream: true });
      const end = xml.indexOf("</item>");
      if (end >= 0) return parseLatestEpisode(xml.slice(0, end + 7) + "</channel></rss>");
    }
    throw new Error("No complete first episode");
  } finally {
    void reader.cancel().catch(() => {});
  }
}

export async function onRequestGet({ request }) {
  const cache = caches.default;
  const key = new Request(new URL("/api/latest-episode", request.url));
  const cached = await cache.match(key);
  // 12:00 UTC is 7am Eastern in winter, 8am in summer. Each edge location
  // refreshes on its first request after this cutoff; a daily timer warms it.
  const now = Date.now();
  const cutoff = Math.floor((now / 1000 - 43200) / day) * day + 43200;
  const saved = cached && await cached.json();
  function json(episode) {
    return Response.json(episode, { headers: { "Cache-Control": "public, max-age=300" } });
  }
  if (saved && saved.checked >= cutoff) return json(saved.episode);
  try {
    const episode = await latestFromLibsyn();
    if (saved && Date.parse(episode.pubDate) < Date.parse(saved.episode.pubDate)) {
      throw new Error("Libsyn returned an older episode");
    }
    // Retain the last success beyond the refresh window for feed outages.
    await cache.put(key, Response.json({ checked: Math.floor(now / 1000), episode }, {
      headers: { "Cache-Control": "public, max-age=2592000" },
    }));
    return json(episode);
  } catch (error) {
    console.error("Latest episode refresh failed:", error.message);
    return saved ? json(saved.episode) : new Response("Episode temporarily unavailable", {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
