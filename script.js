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
