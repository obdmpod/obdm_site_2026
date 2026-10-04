# OBDM Deployment and Squarespace Migration Plan

Writer: Codex
Date: 2026-10-04
Origin: Mac M4 / macOS / Codex desktop
Project: obdm_site_2026
Purpose: Proposed deployment plan; no hosting, DNS, billing, or production changes are authorized by this document alone.
Source: User request, local source inspection, public OBDM website, public DNS lookup, and official provider documentation linked below.

## Target Setup — Proposed

- GitHub: `obdmpod/obdm_site_2026`, already pushed and verified.
- Selected host: Cloudflare Pages. Preview deployed by the user at https://obdm-site-2026.pages.dev/ on 2026-10-04. Independent HTTPS fetch returned HTTP 200 and the expected OBDM title; full functional/visual QA remains pending. The comparison below is retained as planning background.
- Primary domain confirmed by user on 2026-10-04: `https://ourbigdumbmouth.com/`. Configure the `www` alias to redirect to it, preserving paths and queries. Handling/ownership of `obdmpod.com` remains unconfirmed; do not configure it without clarification.
- Keep Libsyn audio/RSS, external video services, Patreon, and Fourthwall separate from the website migration.
- Deploy from the editable source, not the supplied prebuilt export.
- No server or database is required for the current static implementation. There will be no newsletter, per user decision on 2026-10-04. Verified live status remains a separate integration decision.

## Host Comparison

Cloudflare Pages documents free/unlimited static-asset requests, 500 builds per month on Free, and a 25 MiB per-file limit. The supplied largest asset is about 8.3 MB, within that file limit. Keep podcast audio on Libsyn. Functions and other services have separate limits. Sources: [pricing](https://developers.cloudflare.com/pages/functions/pricing/), [limits](https://developers.cloudflare.com/pages/platform/limits/).

Netlify supports static Astro deployment without an adapter. Its current pricing lists Free with 300 monthly credits, Personal at $9/month with 1,000 credits, production deploys at 15 credits each, and bandwidth at 20 credits/GB. The homepage video and RSS rebuild frequency make usage budgeting material. These are published rates checked during planning, not an account quote. Sources: [Astro support](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/), [pricing](https://www.netlify.com/pricing/).

Cloudflare Pages requires Cloudflare nameservers for the apex domain (`ourbigdumbmouth.com`); an external-DNS subdomain can use a CNAME. DNS management and domain registration are separate decisions. Source: [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## 1. Inventory and Preserve the Existing Site

- User identified GoDaddy as the domain registrar/provider. Keep registration and renewal there for this migration. User confirmed GoDaddy DNS account access and no use of `@ourbigdumbmouth.com` email. No domain-email migration is needed. Confirm Squarespace admin access, billing dates, and domain renewal.
- Current DNS observation: `ns03.domaincontrol.com`, `ns04.domaincontrol.com`; `www` points to `ext-cust.squarespace.com`. Do not infer registrar ownership from nameservers alone.
- Export/snapshot the complete DNS zone from the dashboard, including website records, email/verification records, subdomains, CAA, and DNSSEC status. A public lookup is not a full backup.
- Export Squarespace content where supported and save required images/files separately. Inventory subscribers, forms, analytics, and any paid/member features before cancellation.
- Crawl sitemap and internal links. Initial observed routes: `/`, `/about`, `/podcast`, `/join-us`, `/contact`, `/podcast-segments`. Preserve useful content and map each old URL to its replacement or a relevant permanent redirect. Do not redirect every missing page to the homepage.
- Public contact page shows a Gmail address and newsletter form. User confirmed no domain email is used; newsletter backend and any subscriber list remain unconfirmed.

Exit condition: content/URL inventory and DNS backup exist; account dependencies are understood.

## 2. Prepare the Source

- Install from the lockfile, validate dependency availability, run Astro checks and the production build. Local install, production build, and Astro checks passed on Mac on 2026-10-04 (Node v25.4.0; 0 diagnostics).
- Pin a supported Node version satisfying the package's `>=22.12.0` requirement, using the same major version locally and on the host.
- Primary domain is confirmed: update canonical and structured-data URLs to `ourbigdumbmouth.com`. Design choice remains open.
- Confirm hotline and schedule. Current public site uses `614.388.9109`; new source uses `513-461-2175`. The two sites also differ on Saturday showtime.
- Newsletter signup has been removed from both source designs and validated in generated output. User confirmed no newsletter on 2026-10-04; no provider or subscriber migration is planned.
- Retain a clearly labeled schedule-based live indicator unless actual stream verification is implemented.
- Add preserved pages, route-specific redirects, a useful 404, sitemap, and robots configuration. Keep staging out of search indexing; verify production indexing is allowed.
- Test mobile layout, keyboard navigation, audio playback, external links, motion preferences, video loading, and social previews. Optimize the large background video as needed.
- Establish RSS refresh: a deploy hook after episode publishing, or a scheduled workflow (for example four builds daily) with manual retry. Choose frequency against host limits. No automation has been created.
- Avoid publishing a blank latest-episode section when Libsyn is temporarily unavailable: decide on last-known-good data or failing the build so the prior deploy remains live. Current source catches the fetch error and proceeds with null episode data.

Exit condition: reproducible build and reviewed launch content.

## 3. Deploy a Preview

Create the chosen host account/project under OBDM ownership and authorize GitHub access to this repository.

| Setting | Proposed value |
| --- | --- |
| Repository | `obdmpod/obdm_site_2026` |
| Production branch | `main` |
| Root/base directory | `3 - The source/obdm-site` |
| Build command | `npm run build` |
| Output directory | `dist` relative to the application directory |
| Node | Pin the version validated in phase 2 |

Use the provider URL to review the deployed build while Squarespace remains production. Set up future pull-request previews and confirm main-branch publishing behavior. Check output in a browser and test redirects on the deployed platform; a successful build alone is insufficient. [Cloudflare Astro deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

Exit condition: user has reviewed the replacement at a working preview URL.

## 4. Prepare DNS and Switch the Website

For Cloudflare apex hosting, first copy the complete DNS zone and migrate nameservers while keeping the existing Squarespace website targets. Handle DNSSEC according to the current providers' instructions; verify the existing website still works after the DNS-service move. No domain-email migration is required per the user. This separates the DNS migration from the website switch.

Once ready, add the apex and `www` domains in the host dashboard, follow its exact record/SSL instructions, and change the website targets. Configure one primary address and permanent redirects from the other hostname. Do not invent IP addresses or reuse values from old deployment notes.

Preserve unrelated DNS records and verify certificate issuance, apex/www behavior, important old URLs, audio, and external service links. Keep original website targets available for rollback. DNS rollback is subject to caches and host domain reactivation; it is not guaranteed instant.

Exit condition: replacement serves the real domain over HTTPS and functional checks pass.

## 5. Observe and Retire Squarespace

- Keep Squarespace available through DNS propagation and a proposed 7–14 day observation window; coordinate with the billing date.
- Monitor missing pages, uptime, forms, traffic, and latest-episode refresh, including at least one new episode publication.
- Document how to redeploy the last good version and how to restore the old website targets if necessary.
- Cancel the Squarespace website subscription only after backups, migration checks, and any email/newsletter dependencies are resolved. Keep domain registration/renewal active.
- Domain provider is GoDaddy per the user. No registrar transfer is proposed; retain GoDaddy registration/renewal after canceling Squarespace website hosting.

## Open Decisions

1. Any secondary domains, including ownership and handling of `obdmpod.com`. Primary is confirmed as `ourbigdumbmouth.com`.
2. Design, hotline, show schedule, and retained pages. Newsletter is excluded by user decision.
3. Episode refresh trigger and cutover date.

Progress as of 2026-10-04: the user completed Cloudflare Pages deployment. No DNS cutover, custom-domain attachment, or Squarespace cancellation was performed in this chat. Primary-domain metadata now uses `ourbigdumbmouth.com`; local build/check and generated HTML validation passed. Custom-domain activation/DNS remains pending. The plan was committed and pushed with newsletter removal (`21d4248`). Both deployed pages were subsequently checked over HTTPS and no longer contain newsletter forms.
