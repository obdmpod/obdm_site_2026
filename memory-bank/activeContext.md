# Active Context: OBDM Website 2026

Writer: Codex
Date: 2026-09-27
Origin: Mac M4 / macOS / Codex desktop
Project: obdm_site_2026
Purpose: Record repository import, initial review, and deployment baseline.
Source: User statements and repository URL, `READ ME FIRST.md`, and inspected local Astro source/configuration.

## Snapshot

This is the local handoff package for a new OBDM website. The user initially reported no deployment, GitHub repository, or host. On 2026-09-27 the user reported creating the project's GitHub repository: https://github.com/obdmpod/obdm_site_2026. No host or deployment has been established in this chat.

The handoff README claims older GitHub repositories, collaborator permissions, and a Netlify preview. Those claims remain unverified and do not establish current infrastructure. The new repository name includes underscores (`obdm_site_2026`), unlike the inherited remote name (`obdmsite2026`).

## Status

Current state: planning and initial review.

- Read the handoff README, nested source README and AGENTS.md, package/configuration files, and selected source components.
- Project memory initialization was explicitly approved by the user.
- No application files have been changed in this session.
- No dependency install, build, browser review, or deployment has been performed.
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

- `package.json` declares Astro `^7.0.6`, Node `>=22.12.0`, and dev/build/preview scripts. Dependencies were not installed or validated.
- The handoff says Node 20+, which conflicts with the declared package requirement.
- `netlify.toml` specifies `npm run build` and output folder `dist`; this configuration does not establish a host or deployment.
- `astro.config.mjs` sets the site URL to `https://obdmpod.com`; domain configuration/ownership and the current public site have not been checked.
- The archived nested Git metadata retains the old `obdmsite2026` remotes for provenance. Active root Git uses the new `obdm_site_2026` repository.
- Initial source Git diff showed executable-bit changes across most files and `CLAUDE.md` changed from a symlink to an empty regular file. Preserve supplied file contents; use ordinary file modes in the root index except shell scripts and the `.command` launcher.
- Episode data is fetched from Libsyn RSS at build time in `src/lib/rss.ts`; published static episode content needs a rebuild to refresh.
- Live status currently follows the Eastern Time show schedule. A Twitch helper exists, but the inspected implementation has no wired verification endpoint.
- Newsletter forms have no connected signup provider.
- Source displays hotline `513-461-2175`. The handoff reports a conflicting `614-388-9109` in episode descriptions; that external feed claim has not been independently verified and the correct number remains a user decision.

## Decisions To Preserve

- Use the existing implementation as the starting point for the new OBDM website.
- Use https://github.com/obdmpod/obdm_site_2026 as the user-designated repository for this project.
- No host or deployment has been selected or created in this session.
- Preserve the distinction between packaged preview/export files and editable Astro source.
- Keep observed local configuration separate from confirmed external service state.

## Next Steps

Proposed follow-up work, not yet performed:

1. Review both designs in a local browser with the user.
2. Correct handoff documentation to reflect the actual project baseline.
3. Install dependencies and validate the source build in the local environment.
4. Resolve hotline and newsletter behavior, and decide how episode content should refresh.
5. Choose and establish hosting/deployment infrastructure when requested; the initial repository push is complete.

## Commands / Guidance

Run source commands from `3 - The source/obdm-site/`.

- Package scripts: `npm run dev`, `npm run build`, `npm run preview`.
- Nested `AGENTS.md` instructs background development-server operation using `astro dev --background`, with `astro dev stop/status/logs`. Read that file before development; these commands have not been tested here.
- The nested source `README.md` is still the generic Astro starter README.
