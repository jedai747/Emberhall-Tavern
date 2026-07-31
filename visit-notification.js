(() => {
  const notificationKey = "emberhall-visit-notified-at";
  const notificationInterval = 24 * 60 * 60 * 1000;

  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    return;
  }

  try {
    const lastNotification = Number(localStorage.getItem(notificationKey) || 0);

    if (Date.now() - lastNotification < notificationInterval) {
      return;
    }
  } catch {
    // Continue without browser-side deduplication when storage is unavailable.
  }

  window.addEventListener(
    "load",
    () => {
      window.setTimeout(async () => {
        try {
          const response = await fetch("/api/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: location.pathname,
              referrer: document.referrer || "Direct visit",
            }),
            keepalive: true,
          });

          if (response.ok) {
            try {
              localStorage.setItem(notificationKey, String(Date.now()));
            } catch {
              // The notification succeeded; unavailable storage is non-fatal.
            }
          }
        } catch {
          // Notifications must never interrupt the visitor's experience.
        }
      }, 800);
    },
    { once: true },
  );
})();
