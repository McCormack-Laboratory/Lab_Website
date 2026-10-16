# McCormack Lab — Hugo site

Site is made with Hugo and Claude. 
Leverages `admin.html` editing workflow for non comp sci inclined editing.
Nav/footer/data render at **build time** instead of being fetched by JS in the
browser. 

## Local development

```bash
hugo server -D
```

Visit http://localhost:1313.

## Editing content

**People / Publications / News** — same as before:

1. Open `/admin.html` on your local server (or once deployed, on the live site)
2. Edit, then click the "Download updated ___.json" button
3. **Important — this goes in two places**:
   - `data/<file>.json` —  what Hugo builds from
   - `static/data/<file>.json` — this is what `admin.html` uses

   Both files need to match, or `admin.html` will show stale data next time
   you open it even though the live site is current (or vice versa). Whenever you replace one, replace the other with the same file.

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

Or just open in code viewer and copy exisiting md's to make new ones.

## Deploying

Repo uses a github actions workflow via `.github/workflows/hugo.yml`. 
A push to `main` auto rebuilds the updated site with Hugo and deploys it to GitHub Pages. 

T ensure it's on: 

1. Push repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. View Actions tab for errorss and warnings.

**`static/CNAME`** is included and has **MSE dept page CNAME**
If changing, no `https://`, no trailing slash — just the bare domain and
update `baseURL` in `hugo.toml` to match, and push.

## Accessibility & campus requirements

Berkeley's web guidelines apply. This template keeps
visible focus states and respects `prefers-reduced-motion` and uses high contract white text and black backgrounds. Add `alt` text to any images added.
