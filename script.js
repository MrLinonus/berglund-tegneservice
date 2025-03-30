// === Last inn HTML-filer ===
function loadHTML(selector, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (typeof callback === "function") callback();
    });
}

window.addEventListener("DOMContentLoaded", () => {
  // Header + burger-meny
  loadHTML("#header", "partials/header.html", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) {
      console.error("Menu toggle or nav links not found");
      return;
    }

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isOpen = navLinks.classList.contains("active");
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });
  });

  // Footer
  loadHTML("#footer", "partials/footer.html");

  // Cookie-banner
  loadHTML("#cookie", "partials/cookies.html", setupCookieBanner);

  // Lightbox-funksjon
  document.querySelectorAll(".lightbox").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const href = link.getAttribute("href");
      if (!href) {
        console.error("Invalid link href");
        return;
      }

      const overlay = document.createElement("div");
      overlay.classList.add("lightbox-overlay");

      const img = document.createElement("img");
      img.src = href;
      img.alt = "Forstørret bilde";
      img.classList.add("lightbox-img");

      const closeBtn = document.createElement("span");
      closeBtn.textContent = "✕";
      closeBtn.className = "lightbox-close";
      closeBtn.addEventListener("click", () => overlay.remove());

      overlay.appendChild(closeBtn);
      overlay.appendChild(img);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    });
  });
});

// === Fallback hvis Formspree feiler ===
function handleSubmit(e) {
  e.preventDefault();
  alert("Takk! Forespørselen din er sendt.");
  // Her kan du evt. sende med fetch til Formspree
}

// === Cookie-banner logikk ===
function setupCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");

  const acceptAll = document.getElementById("accept-all");
  const essentialOnly = document.getElementById("essential-only");
  const customize = document.getElementById("customize-cookies");

  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  const saveCustom = document.getElementById("save-custom-cookies");
  const closeModal = document.getElementById("close-modal");

  const cookiePrefs = localStorage.getItem("cookieConsent");

  if (!cookiePrefs) {
    banner.style.display = "flex";
  }

  // Godta alt
  acceptAll.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      analytics: true,
      marketing: true
    }));
    banner.style.display = "none";
    modal.style.display = "none";
  });

  // Kun nødvendige
  essentialOnly.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      analytics: false,
      marketing: false
    }));
    banner.style.display = "none";
    modal.style.display = "none";
  });

  // Vis tilpasningsmodal
  customize.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Lagre tilpasning
  saveCustom.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      analytics: analyticsCheckbox.checked,
      marketing: marketingCheckbox.checked
    }));
    modal.style.display = "none";
    banner.style.display = "none";
  });

  // Avbryt modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
