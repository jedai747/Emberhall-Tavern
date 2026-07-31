(() => {
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    return;
  }

  const notifyAboutVisit = () => {
    window.setTimeout(async () => {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: location.pathname,
            referrer: document.referrer || "Direct visit",
          }),
          keepalive: true,
        });
      } catch {
        // Notifications must never interrupt the visitor's experience.
      }
    }, 300);
  };

  window.addEventListener("pageshow", notifyAboutVisit);
})();
