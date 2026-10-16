# McCormack Lab — Hugo site

Converted from the original vanilla HTML/JS/JSON site to Hugo. Same design,
same content, same `admin.html` editing workflow — but nav/footer/data now
render at **build time** instead of being fetched by JavaScript in the
browser. That means: faster page loads, no CORS/local-server requirement to
preview correctly, and no risk of a flash of "Loading…" text.

## What changed from the original

- **Nav and footer** (`partials/nav.html`, `partials/footer.html`) are now
  Hugo partials (`layouts/partials/header.html`, `footer.html`) rendered
  server-side. `js/partials.js` is gone — no longer needed.
- **People, Publications, and homepage News** now render from
  `data/*.json` at build time via Hugo templates, instead of `js/render.js`
  fetching them client-side. `js/render.js` is gone.
- **Research areas** are now individual content files
  (`content/research/*.md`) instead of hardcoded HTML — add a new research
  area by creating a new file, no template editing needed.
- **Fixed a bug**: the original nav linked to `equipment.html` and
  `outreach.html`, which never existed, and their `data-page` attributes
  pointed at `contact.html` (so they'd have wrongly highlighted "Contact" as
  active). Both pages now exist for real, with correct active-state
  highlighting.
- **`admin.html` still works exactly as before** — untouched, still fetches
  `data/*.json` client-side and lets you download updated files. See below
  for the one thing to remember when using it.
- `js/main.js` (the cubic lattice hero animation) is unchanged.

## Local development

```bash
hugo server -D
```

Visit http://localhost:1313.

## Editing content

**People / Publications / News** — same as before:

1. Open `/admin.html` on your local server (or once deployed, on the live site)
2. Edit, then click the "Download updated ___.json" button
3. **Important — this now needs to go in two places** (the original only had one):
   - `data/<file>.json` — this is what Hugo actually builds the site from
   - `static/data/<file>.json` — this is what `admin.html` itself reads from
     when you next open it

   Both files need to match, or `admin.html` will show stale data next time
   you open it even though the live site is current (or vice versa). Simplest
   habit: whenever you replace one, replace the other with the same file.

**Research areas** — add/edit files in `content/research/`:

```bash
hugo new content research/my-new-area.md
```

Front matter fields: `title`, `weight` (controls order), `icon` (`dipper`,
`crux`, or `cassiopeia` — the three constellation motifs), `summary` (shown
on the homepage card), `techniques`. Body text is the fuller description
shown on the Research page and the area's own page.

**Equipment / Outreach / Contact / Research intro** — edit the front matter
in the relevant `content/<section>/_index.md` file directly (lede text,
callout text, address, etc.) — these are simple enough that they don't need
`admin.html`.

## Deploying

This repo now includes `.github/workflows/hugo.yml` — pushing to `main`
automatically builds the site with Hugo and deploys it to GitHub Pages. To
turn this on:

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. That's it — every push to `main` rebuilds and redeploys automatically.

**`static/CNAME`** is included but currently **empty** — this is the file
GitHub Pages reads to know a custom domain is in use. Once MSE IT tells you
the actual subdomain (e.g. `group.mse.berkeley.edu`), put that one line in
`static/CNAME` (no `https://`, no trailing slash — just the bare domain),
update `baseURL` in `hugo.toml` to match, and push. Until then, leaving it
empty means the site just serves from the default
`https://<org-or-user>.github.io/<repo>/` GitHub Pages URL — nothing breaks
either way.

If MSE IT instead gives you SFTP/SSH access to a directory rather than
pointing DNS at a host you control, ignore all of the above and use the
original rsync approach from the source README instead — run `hugo --gc
--minify` locally to generate `public/`, then rsync that folder's contents
up.

## Accessibility & campus requirements

Same as original — Berkeley's web guidelines apply. This template keeps
visible focus states and respects `prefers-reduced-motion`. Add meaningful
`alt` text to any images you add.
