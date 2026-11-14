# Verify a production release

Cloudflare Pages builds this directory on pushes to `main`. In Workers & Pages → obdm-site-2026 → Deployments, match the production commit to GitHub before checking the live site.

Open [the episode endpoint](https://ourbigdumbmouth.com/api/latest-episode). It should return JSON containing `episodeNumber`, `audioUrl`, and `chapters`. An HTTP 200 response containing the homepage HTML means the endpoint is not serving episode data. Compare the returned episode to the first item in [Libsyn RSS](https://ourbigdumbmouth.libsyn.com/rss) and the [public player](https://ourbigdumbmouth.com/#latest).

The daily feed check updates episode data without a new build. If a code push has no deployment entry at all, inspect the GitHub app installation, branch settings and watch paths before debugging the Astro build.
