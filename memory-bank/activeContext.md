# Active Context: OBDM Website 2026

Writer: Codex
Date: 2026-10-04
Origin: Mac M4 / macOS / Codex desktop
Project: obdm_site_2026
Purpose: Record repository import and proposed migration from the existing Squarespace website.
Source: User statements and repository URL, `READ ME FIRST.md`, and inspected local Astro source/configuration.

## Snapshot

This is the local handoff package for a new OBDM website. The user initially reported no deployment, GitHub repository, or host. On 2026-09-27 the user reported creating the project's GitHub repository: https://github.com/obdmpod/obdm_site_2026. On 2026-10-04 the user deployed the replacement to Cloudflare Pages at https://obdm-site-2026.pages.dev/. The user identified the existing production site as https://ourbigdumbmouth.com/, hosted by Squarespace, and wants to move away from Squarespace.

The handoff README claims older GitHub repositories, collaborator permissions, and a Netlify preview. Those claims remain unverified and do not establish current infrastructure. The new repository name includes underscores (`obdm_site_2026`), unlike the inherited remote name (`obdmsite2026`).

## Status

Current state: preview deployed; production-domain migration pending. Cloudflare Pages is selected and the preview URL responds successfully. See `deploymentPlan.md`.

- Read the handoff README, nested source README and AGENTS.md, package/configuration files, and selected source components.
- Project memory initialization was explicitly approved by the user.
- Removed newsletter cards and form-specific styles from `JoinSignal.astro` and `v2.astro`, and expanded the remaining support card to full width on 2026-10-04.
- On Mac (Node v25.4.0), `npm ci`, `npm run build`, and `npm run astro -- check` passed (0 errors/warnings/hints). Both generated pages were checked for absence of newsletter/email forms and retention of support/Discord links. Full browser QA remains pending. User screenshots show successful Cloudflare Pages deployment on 2026-10-04. An independent HTTPS request returned HTTP 200 and the expected OBDM page title. This does not verify audio, visual layout, forms, or all assets.
- User confirmed `ourbigdumbmouth.com` as the primary domain on 2026-10-04. Canonical and structured-data URLs now derive from that primary domain. Local build and Astro checks passed, and both generated pages have the expected canonical/Open Graph/organization URLs. Production DNS cutover remains pending.
- Setup screenshots showed Astro preset, `npm run build`, output `dist`, and root `3 - The source/obdm-site`. Cloudflare initially presented Workers setup; Pages was accessed using the bottom “Continue to Pages” link.
- No DNS changes, custom-domain attachment, or Squarespace cancellation were performed in this chat.
- The user explicitly authorized pushing to the new repository. `git ls-remote` verified access and returned no refs (empty repository) before import. GitHub visibility and account permissions were not separately queried.
- Initialized Git at the workspace root on `main`, retaining the inherited source commit history through `119f85c`. The original nested Git metadata was moved intact to `.git/inherited-source.git` as a local backup; it is not published.
- Root `origin` is `git@github.com:obdmpod/obdm_site_2026.git`. Initial import commit `d23c8a6` was pushed to `main`; `git ls-remote` confirmed the remote hash matched local HEAD and the working tree was clean. `main` tracks `origin/main`.
- HTTPS push failed because credentials were unavailable. Existing `~/.ssh/config` authenticated successfully as `obdmpod`; SSH completed the push. This authentication result is scoped to this Mac.
- Added a current root README and ignore rules. File contents were preserved; executable bits were normalized to match the index, retaining the launch/build scripts as executable.
- File scan found no matching private-key, GitHub-token, or AWS-access-key patterns in the current package. Largest file is 8,299,407 bytes. This was a limited credential check, not a security audit.
- Import commit author is Codex; the inherited repository had Joe configured and there was no global Git author identity.

## Project Layout

Workspace: `/Users/maxmini/git/obdm_site_2026` (Mac).

- `READ ME FIRST.md`: handoff overview; contains deployment assumptions that need correction.
- `1 - Look at it/`: packaged local preview, including an alternative design under `v2/`.
- `2 - Put it online/`: packaged static website export; freshness relative to source has not been verified.
- `3 - The source/obdm-site/`: editable Astro project with its own `AGENTS.md`; now tracked by workspace-root Git.
- `README.md`: current repository overview and deployment baseline.
- `memory-bank/`: active project continuity at the workspace root.

## Confirmed Local Findings

- `package.json` declares Astro `^7.0.6`, Node `>=22.12.0`, and dev/build/preview scripts. Locked dependencies installed successfully on this Mac during the newsletter-removal change.
- The handoff says Node 20+, which conflicts with the declared package requirement.
- `netlify.toml` specifies `npm run build` and output folder `dist`; this configuration does not establish a host or deployment.
- Primary domain is confirmed as `https://ourbigdumbmouth.com/`. Configure it in `astro.config.mjs` and derive structured-data site URLs from `Astro.site`. Ownership and desired handling of `obdmpod.com` remain unconfirmed; no redirects for that domain have been configured.
- The user identified GoDaddy as the domain registrar/provider. The user confirmed access to GoDaddy DNS settings and that they do not use email addresses at `@ourbigdumbmouth.com`. No domain-email migration is needed. Proposed approach: retain registration at GoDaddy while migrating website hosting; if Cloudflare Pages is chosen for the apex, move DNS management separately.
- Public DNS lookup on this Mac returned `ns03.domaincontrol.com` / `ns04.domaincontrol.com`; `www` CNAME points to `ext-cust.squarespace.com`. No MX answer was returned. These observations do not establish registrar identity, account access, or whether email is used.
- Public site navigation includes `/about`, `/podcast`, `/join-us`, `/contact`, and `/podcast-segments`. This is a starting URL inventory, not a complete crawl.
- Current public contact page lists `ourbigdumbmouth@gmail.com`, `614.388.9109`, and a newsletter signup form; signup backend and subscriber list have not been inspected.
- The archived nested Git metadata retains the old `obdmsite2026` remotes for provenance. Active root Git uses the new `obdm_site_2026` repository.
- Initial source Git diff showed executable-bit changes across most files and `CLAUDE.md` changed from a symlink to an empty regular file. Preserve supplied file contents; use ordinary file modes in the root index except shell scripts and the `.command` launcher.
- Episode data is fetched from Libsyn RSS at build time in `src/lib/rss.ts`; published static episode content needs a rebuild to refresh.
- Live status currently follows the Eastern Time show schedule. A Twitch helper exists, but the inspected implementation has no wired verification endpoint.
- User decision (2026-10-04): no newsletter. Remove signup UI from both designs; do not add a provider or subscriber migration requirement.
- Source displays hotline `513-461-2175`. The handoff reports a conflicting `614-388-9109` in episode descriptions; that external feed claim has not been independently verified and the correct number remains a user decision.

## Decisions To Preserve

- Use the existing implementation as the starting point for the new OBDM website.
- Use https://github.com/obdmpod/obdm_site_2026 as the user-designated repository for this project.
- Cloudflare Pages hosts the preview at https://obdm-site-2026.pages.dev/. Keep the existing Squarespace production website until preview review and migration preparations are complete.
- Preserve the distinction between packaged preview/export files and editable Astro source.
- Keep observed local configuration separate from confirmed external service state.

## Next Steps

Proposed follow-up work, not yet performed:

1. Review both designs in a local browser with the user.
2. Correct handoff documentation to reflect the actual project baseline.
3. Local build and Astro checks passed; complete visual/functional review of the deployed site.
4. Resolve hotline and decide how episode content should refresh. Newsletter has been removed from scope per user.
5. Review the Cloudflare preview, correct launch blockers, and prepare the DNS backup and route migration. GoDaddy DNS access and absence of domain email are confirmed.
6. Validate a preview deployment before DNS cutover; retain Squarespace during verification and rollback window.

## Commands / Guidance

Run source commands from `3 - The source/obdm-site/`.

- Package scripts: `npm run dev`, `npm run build`, `npm run preview`.
- Nested `AGENTS.md` instructs background development-server operation using `astro dev --background`, with `astro dev stop/status/logs`. Read that file before development; these commands have not been tested here.
- The nested source `README.md` is still the generic Astro starter README.

## Newsletter Removal Delivery

- Source and generated output validated on 2026-10-04. Commit `21d4248` pushed to `main`; after Cloudflare rebuilt, HTTPS fetches of `/` and `/v2/` confirmed newsletter forms absent and support content retained. Browser visual QA was not performed for this change.
- Original handoff preview/export folders are historical snapshots and were not regenerated; Cloudflare builds the edited Astro source.

## Domain Connection — 2026-10-04

- Canonical host confirmed by user: `ourbigdumbmouth.com` (without www). Proposed alias: `www.ourbigdumbmouth.com` redirects to the primary, preserving paths and queries; not yet configured.
- Public DNS still uses `ns03.domaincontrol.com` and `ns04.domaincontrol.com`. Apex A records: `198.49.23.145`, `198.185.159.145`, `198.49.23.144`, `198.185.159.144`. `www` CNAME: `ext-cust.squarespace.com`. DS query returned no answer. This is a partial public snapshot, not a full zone backup or conclusive account-level DNSSEC check.
- Next external step: Pages project → Custom domains → Set up a domain → `ourbigdumbmouth.com`. Follow Cloudflare onboarding to import/review DNS and obtain the assigned nameservers. Back up GoDaddy DNS and review imported records before switching nameservers. GoDaddy retains registration.
