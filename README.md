# Liorgio Ilanan · Social Media & Community Manager

Portfolio site for Liorgio Ilanan, a Philippines-based Social Media & Community Manager.
It covers Friesta (Facebook and TikTok), DDTank Haven and Newborn Vape Lounge, with
figures taken from Meta Business Suite and TikTok Studio. A Certifications section features the Meta Certified Digital Marketing Associate credential (verified on Credly) and links each Meta
(Coursera), Google and Udemy certificate to its verification page. A Graphic design section shows 40 picks from the Friesta post design library.

Live site: https://liorgioilanan.com

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | The whole site: markup, styles and scripts in one file |
| `img/` | Portrait, work screenshots, ads, strategy slides and certificates (WebP) |
| `og-image.jpg` | Preview image shown when the link is shared (linked from GitHub's raw file host so it loads even while the domain is changing) |
| `favicon.svg`, `apple-touch-icon.png` | Browser tab and home-screen icons |
| `sitemap.xml`, `robots.txt` | Tell search engines what to index. Update `<lastmod>` in the sitemap after a big change |
| `404.html` | Page shown for broken links |

The `<head>` of `index.html` holds the search and sharing details: title, description,
canonical URL, Open Graph tags and JSON-LD structured data (Person with credentials and
profile links, ProfilePage and FAQPage). If you edit the FAQ, update the FAQPage answers too.
| `netlify.toml` | Netlify settings (no build step, publish the repo root) |

No build tools or dependencies. Fonts load from Google Fonts.

## Edit the site

- **Text and numbers:** search `index.html` for the words you want to change.
- **Images:** add the file to `img/`, then point an `<img src="img/...">` at it.
- **Colors:** change the tokens at the top of the `<style>` block (`--sun`, `--ink`, `--bg`, and so on).
- **Preview locally:** open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Hosting

The site is served by **GitHub Pages** from the `main` branch (repository root).
`CNAME` holds the custom domain and `.nojekyll` tells Pages to serve the files as they are.

1. **Settings → Pages → Build and deployment:** Source = Deploy from a branch, Branch = `main`, folder `/ (root)`.
2. **Custom domain:** `liorgioilanan.com`, then tick **Enforce HTTPS** once it becomes available.
3. **DNS at the registrar:** four `A` records on `@` → `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`, and a `CNAME` on `www` → `jiyoilnn.github.io`.

Every push to `main` republishes the site. `netlify.toml` is kept only in case the site moves back to Netlify.
