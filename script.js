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

    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const isOpen = navLinks.classList.contains("active");
        menuToggle.textContent = isOpen ? "✕" : "☰";
      });
    }
  });

  // Footer
  loadHTML("#footer", "partials/footer.html");

  // Cookie-banner
  loadHTML("#cookie", "partials/cookies.html", setupCookieBanner);

  // Lightbox
  document.querySelectorAll(".lightbox").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (!href) return;

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
        if (e.target === overlay) overlay.remove();
      });
    });
  });
});

// === Formspree fallback ===
function handleSubmit(e) {
  e.preventDefault();
  alert("Takk! Forespørselen din er sendt.");
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

  // Hvis allerede valgt – ikke vis igjen
  const cookiePrefs = localStorage.getItem("cookieConsent");
  if (!cookiePrefs && banner) {
    banner.style.display = "flex";
  }

  const consent = JSON.parse(localStorage.getItem("cookieConsent"));
  if (consent?.analytics) {
    injectAnalytics();
  }


  // === Event handlers ===
  if (acceptAll) {
    acceptAll.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", JSON.stringify({
        analytics: true,
        marketing: true
      }));
      banner.style.display = "none";
      modal.style.display = "none";
    });
  }

  if (essentialOnly) {
    essentialOnly.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", JSON.stringify({
        analytics: false,
        marketing: false
      }));
      banner.style.display = "none";
      modal.style.display = "none";
    });
  }

  if (customize) {
    customize.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  if (saveCustom) {
    saveCustom.addEventListener("click", () => {
      const consent = {
        analytics: analyticsCheckbox?.checked || false,
        marketing: marketingCheckbox?.checked || false
      };
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
      modal.style.display = "none";
      banner.style.display = "none";
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
}
function injectAnalytics() {
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=GA-ID";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-ID');
}

