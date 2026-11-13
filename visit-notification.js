(() => {
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    return;
  }

  const notify = async (event, service) => {
    try {
      await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          service,
          path: location.pathname,
          referrer: document.referrer || "Direct visit",
        }),
        keepalive: true,
      });
    } catch {
      // Notifications must never interrupt navigation.
    }
  };

  window.addEventListener("pageshow", () => {
    window.setTimeout(() => void notify("visit"), 300);
  });

  const notifyAboutClick = (event) => {
    if (event.defaultPrevented || (event.type === "auxclick" && event.button !== 1)) {
      return;
    }

    const link = event.target.closest?.("a[data-service]");
    if (link) {
      void notify("click", link.dataset.service);
    }
  };

  document.addEventListener("click", notifyAboutClick);
  document.addEventListener("auxclick", notifyAboutClick);
})();
