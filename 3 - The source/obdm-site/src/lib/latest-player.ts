import type { Episode } from "./rss";

function clock(n: number) {
  const seconds = Math.floor(Number.isFinite(n) ? n : 0);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds / 60) % 60;
  return (hrs ? hrs + ":" + String(mins).padStart(2, "0") : String(mins)) + ":" + String(seconds % 60).padStart(2, "0");
}

function init(section: HTMLElement) {
  const audio = section.querySelector<HTMLAudioElement>("[data-audio]")!;
  const play = section.querySelector<HTMLButtonElement>("[data-play]")!;
  const seek = section.querySelector<HTMLInputElement>("[data-seek]")!;
  const chapters = section.querySelector<HTMLOListElement>("[data-chapters]")!;
  const current = section.querySelector<HTMLElement>("[data-current]")!;
  const duration = section.querySelector<HTMLElement>("[data-duration]")!;
  const template = section.querySelector<HTMLTemplateElement>("[data-chapter-template]")!;
  let interacted = false;
  let dragging = false;
  play.onclick = () => {
    interacted = true;
    if (audio.paused) void audio.play(); else audio.pause();
  };
  for (const event of ["play", "pause"]) audio.addEventListener(event, () => {
    play.classList.toggle("is-playing", !audio.paused);
    play.setAttribute("aria-label", audio.paused ? "Play latest episode" : "Pause");
  });
  audio.onloadedmetadata = () => {
    seek.max = String(Math.floor(audio.duration));
    duration.textContent = clock(audio.duration);
  };
  chapters.onclick = (event) => {
    const button = (event.target as Element).closest<HTMLElement>("[data-seconds]");
    if (!button) return;
    interacted = true;
    audio.currentTime = Number(button.dataset.seconds);
    void audio.play();
  };
  seek.onpointerdown = () => { dragging = true; interacted = true; };
  seek.onpointerup = seek.onpointercancel = () => { dragging = false; };
  seek.oninput = () => {
    interacted = true;
    audio.currentTime = Number(seek.value);
    current.textContent = clock(audio.currentTime);
  };
  audio.ontimeupdate = () => {
    if (!dragging) seek.value = String(Math.floor(audio.currentTime));
    current.textContent = clock(audio.currentTime);
    const buttons = Array.from(chapters.querySelectorAll<HTMLElement>("[data-seconds]"));
    const active = buttons.filter(b => Number(b.dataset.seconds) <= audio.currentTime).pop();
    buttons.forEach(b => b.classList.toggle("is-active", b === active));
  };

  async function refresh() {
    const response = await fetch("/api/latest-episode");
    if (!response.ok) return;
    const episode: Episode = await response.json();
    // A slow response must not interrupt someone listening to the fallback.
    if (interacted || !episode.audioUrl || Date.parse(episode.pubDate) < Date.parse(section.dataset.episodeDate!)) return;
    const rows = document.createDocumentFragment();
    for (const chapter of episode.chapters) {
      const row = template.content.cloneNode(true) as DocumentFragment;
      row.querySelector<HTMLElement>("[data-seconds]")!.dataset.seconds = String(chapter.seconds);
      row.querySelector(".t")!.textContent = clock(chapter.seconds);
      row.querySelector(".d")!.textContent = chapter.label;
      rows.append(row);
    }
    section.querySelector("[data-episode-title]")!.textContent = episode.cleanTitle;
    const prefix = section.classList.contains("v2sec") ? "" : "▚ ";
    section.querySelector("[data-episode-number]")!.textContent = prefix + (episode.episodeNumber ? "EPISODE " + episode.episodeNumber : "SPECIAL BROADCAST");
    const link = section.querySelector<HTMLAnchorElement>("[data-episode-link]");
    if (link) link.href = episode.link;
    if (audio.src !== episode.audioUrl) audio.src = episode.audioUrl;
    chapters.replaceChildren(rows);
    chapters.hidden = !episode.chapters.length;
    const summary = section.querySelector<HTMLElement>("[data-episode-summary]")!;
    summary.textContent = episode.summary;
    summary.hidden = !!episode.chapters.length;
  }
  void refresh().catch(() => { /* Keep the server-rendered playable episode. */ });
}

const latest = document.querySelector<HTMLElement>("#latest");
if (latest?.querySelector("[data-player]")) init(latest);
