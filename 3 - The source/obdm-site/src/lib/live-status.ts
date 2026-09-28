/**
 * Schedule-based live status, computed from the America/New_York wall clock
 * (DST-safe via Intl, no date library needed). Runs client-side so it stays
 * accurate between builds — this is the fallback tier and works on pure
 * static hosting with zero backend.
 *
 * The real-time Twitch check (checkTwitchLive below) is the upgrade tier:
 * it requires a server endpoint because Twitch's Helix API needs a
 * server-side app access token (client-credentials flow) that can't be
 * exposed to the browser. It's inert until an adapter (Netlify/Vercel/
 * Cloudflare) is chosen for the site — see obdm-site/README or CH-06 of
 * the rebuild handoff. Wire it up at src/pages/api/live-status.ts with
 * `export const prerender = false` once that decision lands.
 */

export interface ScheduleStatus {
  live: boolean;
  /** Human-readable next showtime, e.g. "Wed 7:00 PM ET" */
  next: string;
}

const SHOWS = [
  { day: 3, startMin: 19 * 60, endMin: 22 * 60, label: "Wed 7:00 PM ET" }, // Wednesday 7–10pm
  { day: 6, startMin: 10 * 60 + 30, endMin: 13 * 60, label: "Sat 10:30 AM ET" }, // Saturday 10:30am–1pm
];

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function nowInET(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const day = WEEKDAY_INDEX[map.weekday] ?? 0;
  // Intl reports midnight as "24" with hour12: false in some engines — normalize.
  const hour = Number(map.hour) % 24;
  const minute = Number(map.minute);
  return { day, minutesOfDay: hour * 60 + minute };
}

export function getScheduleStatus(date: Date = new Date()): ScheduleStatus {
  const { day, minutesOfDay } = nowInET(date);

  const current = SHOWS.find((s) => s.day === day && minutesOfDay >= s.startMin && minutesOfDay < s.endMin);
  if (current) return { live: true, next: current.label };

  // find the next upcoming show, walking forward day by day
  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7;
    const candidates = SHOWS.filter((s) => s.day === d && (offset > 0 || minutesOfDay < s.startMin));
    if (candidates.length) return { live: false, next: candidates[0].label };
  }
  return { live: false, next: SHOWS[0].label };
}

export interface LiveStatus {
  live: boolean;
  next: string;
  source: "twitch" | "schedule";
}

/**
 * Server-side only. Requires TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET env vars
 * and an Astro adapter with prerender=false on the route that calls this.
 */
export async function checkTwitchLive(clientId: string, clientSecret: string): Promise<boolean | null> {
  try {
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: "POST" },
    );
    if (!tokenRes.ok) return null;
    const { access_token } = await tokenRes.json();

    const streamsRes = await fetch("https://api.twitch.tv/helix/streams?user_login=obdmpod", {
      headers: { "Client-Id": clientId, Authorization: `Bearer ${access_token}` },
    });
    if (!streamsRes.ok) return null;
    const { data } = await streamsRes.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return null;
  }
}
