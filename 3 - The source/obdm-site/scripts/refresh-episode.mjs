import { readFile, writeFile } from "node:fs/promises";
import { parseLatestEpisode } from "../src/lib/rss.ts";

const snapshot = new URL("../src/data/latest-episode.json", import.meta.url);
const response = await fetch("https://ourbigdumbmouth.libsyn.com/rss", {
  signal: AbortSignal.timeout(60_000),
});
if (!response.ok) throw new Error(`Libsyn returned HTTP ${response.status}`);
const episode = parseLatestEpisode(await response.text());
const previous = await readFile(snapshot, "utf8").catch((error) => {
  if (error.code === "ENOENT") return "";
  throw error;
});
if (previous && Date.parse(episode.pubDate) < Date.parse(JSON.parse(previous).pubDate)) {
  throw new Error("Libsyn returned an older episode; keeping the current snapshot");
}
const next = JSON.stringify(episode, null, 2) + "\n";
if (previous !== next) await writeFile(snapshot, next);
console.log(previous === next ? "Latest episode unchanged." : `Updated: ${episode.title}`);
