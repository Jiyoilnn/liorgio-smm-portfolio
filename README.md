# Liorgio Ilanan · Social Media & Community Manager

Portfolio site for Liorgio Ilanan, a Philippines-based Social Media & Community Manager.
It covers Friesta (Facebook and TikTok), DDTank Haven, Newborn Vape Lounge and the
AI-assisted Friesta POS, with figures taken from Meta Business Suite and TikTok Studio.

Live site: https://liorgio-smm-portfolio.netlify.app

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` | The whole site: markup, styles and scripts in one file |
| `img/` | Portrait, work screenshots, graphics and certificates (WebP) |
| `og-image.png` | Preview image shown when the link is shared |
| `favicon.svg` | Browser tab icon |
| `404.html` | Page shown for broken links |
| `netlify.toml` | Netlify settings (no build step, publish the repo root) |

No build tools or dependencies. Fonts load from Google Fonts.

## Edit the site

- **Text and numbers:** search `index.html` for the words you want to change.
- **Images:** add the file to `img/`, then point an `<img src="img/...">` at it.
- **Colors:** change the tokens at the top of the `<style>` block (`--sun`, `--ink`, `--bg`, and so on).
- **Preview locally:** open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy on Netlify

1. Sign in at https://app.netlify.com with GitHub.
2. **Add new project → Import an existing project → GitHub**, then pick this repository.
3. Leave the build command empty and the publish directory as `.` (both come from `netlify.toml`), then click **Deploy**.
4. Under **Project configuration → Change project name**, set the name to `liorgio-smm-portfolio` so the URL matches the share-preview tags in `index.html`.

Every push to `main` redeploys the site automatically.
