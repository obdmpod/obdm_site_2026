# OBDM Website 2026

Local website handoff and editable Astro source for the new Our Big Dumb Mouth website.

Repository: https://github.com/obdmpod/obdm_site_2026

## Current status

Cloudflare Pages preview: https://obdm-site-2026.pages.dev/. The production-domain migration from Squarespace is still pending. The original `READ ME FIRST.md` is retained as handoff documentation, but its claims about previous GitHub repositories, collaborator access, and a Netlify preview are unverified. Use this README and `memory-bank/` for the current project state.

## Layout

- `1 - Look at it/`: packaged local preview, with an alternative design under `v2/`.
- `2 - Put it online/`: supplied static export; not yet checked against a fresh source build.
- `3 - The source/obdm-site/`: editable Astro application.
- `memory-bank/`: project continuity and unresolved decisions.

Git tracks the full package from this repository root and retains the inherited source history. The Astro application remains in its original subdirectory.

## Development

The package declares Node.js **22.12.0 or newer**. From the repository root:

```sh
cd "3 - The source/obdm-site"
npm install
npm run build
```

Read the application's `AGENTS.md` before development. The locked dependencies, production build, and Astro checks passed on Mac on 2026-10-04. A future host must run the build from the application subdirectory and publish its `dist/` output.

## Before launch

- Review both designs and confirm the hotline number.
- No newsletter is planned; signup UI has been removed from both source designs.
- Decide how to trigger rebuilds so the latest Libsyn episode stays current.
- Review the schedule-based live indicator; it does not currently verify the actual stream.
- Select hosting and validate the production build before deployment or domain changes.
