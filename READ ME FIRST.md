# OBDM site — handoff

Three folders. Start at the top.

---

## 1 — Look at it

Double-click **`index.html`**. It opens in your browser. Nothing to install, and it
works with no internet.

    index.html   the site
    v2/          a bolder alternative concept, for comparison

Two things do need internet, because they stream from elsewhere: the episode audio
player (hosted by Libsyn) and the outbound links. Everything else — fonts, hero video,
all images — is in the folder.

If your browser blocks something when opening the file directly, double-click
`Open OBDM Site.command` instead. It serves the folder locally at
http://localhost:8777.

---

## 2 — Put it online

This folder **is** the finished website. It's plain HTML, CSS, images and video — no
server, no database, no build step. Any host that serves static files will run it.

### Fastest way (about two minutes, no account juggling)

1. Go to **https://app.netlify.com/drop**
2. Drag the **`2 - Put it online`** folder onto the page
3. Netlify gives you a live URL immediately

That URL is real and shareable. You can rename it or attach a domain later.

### The existing Netlify project

There's already a preview project on your Netlify team:

    Team     TL  (info-fanxjm8)
    Project  obdm-preview
    Site ID  bed4add0-2221-4b39-9a11-b6592334a04e
    URL      https://obdm-preview.netlify.app

You can drop this folder onto that project instead of making a new one, under
**Deploys → drag and drop**.

### The better long-term setup

Connect the GitHub repo to Netlify so it rebuilds itself whenever the site changes.
Netlify reads `netlify.toml` from the repo and already knows what to do:

    build command    npm run build
    publish folder   dist

See folder 3 for where the code lives.

---

## 3 — The source

The full project, minus `node_modules` (which npm reinstalls). Git history is included.

To run it locally you need **Node 20 or newer**:

    cd obdm-site
    npm install
    npm run dev      # http://localhost:4321
    npm run build    # writes the site to dist/

`package-preview.sh` rebuilds the offline version in folder 1 — it bundles the Google
Fonts locally and rewrites the asset paths so it runs from a file rather than a server.

---

## Things only you can do

**1. Give Joe write access to the repo.**
`github.com/obdmpod/obdmsite2026` is yours, and `yojoeco` currently has **Read**.
Pushing anything — even a branch — needs Write. Settings → Collaborators and teams →
change `yojoeco` to **Write**. Until then the latest code lives at
`github.com/yojoeco/obdmsite2026`, which is a full copy, not a fork.

**2. Decide about the domain.**
The live site is still on Squarespace. Nothing here touches it, and nothing should
until you say so. Squarespace can't host these files — at most it can link to them.
When you're ready, pointing `obdmpod.com` at Netlify is a DNS change on your side.

**3. Check the hotline number.**
The site says **513·461·2175**. The show notes on **801 episodes, including the most
recent one**, say 614-388-9109. One of those is wrong and it isn't obvious which —
513 appears in exactly one episode from May 2025. If 513 is right, the Libsyn
description template needs fixing, because that's what listeners read.

---

## What's on the page

Live products, pulled from the Fourthwall store and linked to it:

| | Price |
|---|---|
| Tippy Top Supersoft Tee | $26 |
| Tippy Top Mug (black) | from $13.95 |
| Data Center Coolant | $25 |
| Fox N' Sons — partner slot | code PISS, 15% off orders over $30 |

Show details on the page: Wednesdays 7:00 PM ET, Saturdays 10:30 AM ET, hotline,
Discord via Patreon, and the newsletter sign-up.

**The newsletter form isn't connected to anything yet.** It looks right and collects
nothing. It needs an email provider (Mailchimp, Buttondown, ConvertKit) before launch,
or the field should come off the page.
