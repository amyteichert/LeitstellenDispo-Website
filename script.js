const menuButton =
  document.getElementById("menuButton");

const menuOverlay =
  document.getElementById("menuOverlay");


function setMenu(open) {

  menuOverlay.classList.toggle(
    "open",
    open
  );

  menuButton.classList.toggle(
    "open",
    open
  );

  menuButton.setAttribute(
    "aria-expanded",
    String(open)
  );

  menuButton.setAttribute(
    "aria-label",
    open
      ? "Menü schließen"
      : "Menü öffnen"
  );

  menuOverlay.setAttribute(
    "aria-hidden",
    String(!open)
  );

  document.body.classList.toggle(
    "menu-open",
    open
  );
}


/* Menü öffnen / schließen */

menuButton.addEventListener(
  "click",
  () => {

    setMenu(
      !menuOverlay.classList.contains("open")
    );

  }
);


/* Klick auf dunklen Hintergrund */

menuOverlay.addEventListener(
  "click",
  (event) => {

    if (
      event.target === menuOverlay
    ) {

      setMenu(false);

    }

  }
);


/* Aufklappbare Karten */

document
  .querySelectorAll(".menu-card-toggle")
  .forEach((toggle) => {

    toggle.addEventListener(
      "click",
      () => {

        const card =
          toggle.closest(".menu-card");

        const isOpen =
          card.classList.toggle("open");

        toggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

  });


/* Menü nach Link-Klick schließen */

document
  .querySelectorAll(".menu-links a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        setMenu(false);

      }
    );

  });


/* ESC schließt das Menü */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      setMenu(false);

    }

  }
);


/* Besucherstatistik – anonym, ohne Cookies und ohne Speicherung im Browser.
   Meldet Seitenaufruf, Herkunft, Verweildauer, Scrolltiefe und Klicks an den Spiel-Server.
   Details: datenschutz.html, Abschnitt „Cookies und Besucherstatistik“. */

(function () {

  const API = "https://spiel.leitstellendispo.de/api/website";

  // Lokal (Entwicklung, Datei geöffnet) nichts melden
  if (!/(^|\.)leitstellendispo\.de$/.test(location.hostname)) return;

  const id = Array.from(
    crypto.getRandomValues(new Uint8Array(12)),
    (b) => b.toString(36).padStart(2, "0")
  ).join("").slice(0, 20);

  const senden = (pfad, daten) => {
    const text = JSON.stringify(daten);
    // Text statt JSON-Typ: so braucht der Browser keine Vorab-Anfrage an die andere Domain
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API + pfad, new Blob([text], { type: "text/plain" }));
    } else {
      fetch(API + pfad, { method: "POST", mode: "no-cors", keepalive: true, body: text });
    }
  };

  senden("/aufruf", {
    id,
    bereich: "info",
    seite: location.pathname,
    referrer: document.referrer,
    von: new URLSearchParams(location.search).get("von")
  });

  // Aktive Zeit nur zählen, solange die Seite sichtbar ist
  let aktivSeit = document.visibilityState === "visible" ? Date.now() : null;
  let aktivMs = 0;
  let maxScroll = 0;
  let interaktion = false;
  let ziel = null;
  const ZIEL_RANG = { intern: 1, extern: 2, discord: 3, spielen: 4 };

  const merkeScroll = () => {
    const hoehe = document.documentElement.scrollHeight - window.innerHeight;
    const anteil = hoehe <= 0 ? 100 : Math.round((window.scrollY / hoehe) * 100);
    maxScroll = Math.max(maxScroll, Math.min(100, anteil));
  };
  window.addEventListener("scroll", merkeScroll, { passive: true });
  merkeScroll();

  document.addEventListener("click", (event) => {
    const element = event.target.closest("a, button");
    if (!element) return;
    interaktion = true;
    const href = element.getAttribute("href") || "";
    let neu = null;
    if (/spiel\.leitstellendispo\.de/.test(href)) neu = "spielen";
    else if (/discord\.(gg|com)/.test(href)) neu = "discord";
    else if (/^https?:/.test(href) && !/leitstellendispo\.de/.test(href)) neu = "extern";
    else if (href && !href.startsWith("#") && !href.startsWith("mailto:")) neu = "intern";
    if (neu && (!ziel || ZIEL_RANG[neu] > ZIEL_RANG[ziel])) ziel = neu;
  }, true);

  const ende = () => {
    if (aktivSeit !== null) {
      aktivMs += Date.now() - aktivSeit;
      aktivSeit = null;
    }
    senden("/ende", { id, dauer: Math.round(aktivMs / 1000), scroll: maxScroll, interaktion, ziel });
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") ende();
    else aktivSeit = Date.now();
  });
  window.addEventListener("pagehide", ende);

})();
