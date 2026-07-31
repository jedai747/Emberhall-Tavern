const jsonResponse = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const cleanText = (value, fallback) => {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 240) || fallback;
};

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const requestOrigin = request.headers.get("Origin");

  if (requestOrigin && requestOrigin !== requestUrl.origin) {
    return jsonResponse({ ok: false }, 403);
  }

  const logsEnabled = String(env.TELEGRAM_LOGS_ENABLED || "")
    .trim()
    .toLowerCase() === "true";

  if (!logsEnabled) {
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return jsonResponse({ ok: false, error: "Notifications are not configured" }, 503);
  }

  let visit = {};

  try {
    visit = await request.json();
  } catch {
    // Missing optional visit metadata does not prevent a notification.
  }

  const country = cleanText(request.cf?.country, "Unknown");
  const path = cleanText(visit.path, "/");
  const referrer = cleanText(visit.referrer, "Direct visit");
  const timestamp = new Date().toISOString().replace("T", " ").replace(".000Z", " UTC");

  const message = [
    "🔥 New guest at Emberhall Tavern",
    "",
    `Time: ${timestamp}`,
    `Country: ${country}`,
    `Page: ${path}`,
    `Source: ${referrer}`,
  ].join("\n");

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        disable_web_page_preview: true,
      }),
    },
  );

  if (!telegramResponse.ok) {
    console.error("Telegram notification failed", telegramResponse.status);
    return jsonResponse({ ok: false }, 502);
  }

  return jsonResponse({ ok: true });
}
