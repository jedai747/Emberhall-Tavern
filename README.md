# Emberhall Tavern link page

A lightweight, responsive link page for Emberhall Tavern.

## Preview locally

Open `index.html` directly in a browser, or run a local static server from this folder:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Publish free on Cloudflare Pages

Upload this folder as a static site or connect a Git repository. No build command is required; the output directory is the project root.

The included image and all styles are local, so the page has no external runtime dependencies.

## Telegram visit notifications

The Pages Function at `functions/api/visit.js` sends a notification on every page entry.
Configure these encrypted secrets in the Cloudflare Pages project before deploying:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Also configure the plain-text environment variable `TELEGRAM_LOGS_ENABLED`:

- `True` enables notifications.
- `False` disables notifications.

The value is case-insensitive. Redeploy the Pages project after changing it so the new binding takes effect.

Never commit their values to this repository.
