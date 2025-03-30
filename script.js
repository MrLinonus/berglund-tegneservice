// === Last inn HTML-filer ===
function loadHTML(selector, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (typeof callback === "function") callback();
    });
}

// === Lightbox-funksjon ===
function setupLightbox() {
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

      overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
      });
    });
  });
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
  const existing = localStorage.getItem("cookieConsent");
  if (!existing && banner) {
    banner.style.display = "flex";
  }

  // Håndter tidligere samtykke
  try {
    const consent = JSON.parse(existing);
    if (consent?.analytics) injectAnalytics();
    // ...legg evt. til flere scripts for "marketing"
  } catch (e) {}

  // === Event handlers ===
  acceptAll?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      analytics: true,
      marketing: true
    }));
    banner.style.display = "none";
    modal.style.display = "none";
    injectAnalytics();
  });

  essentialOnly?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      analytics: false,
      marketing: false
    }));
    banner.style.display = "none";
    modal.style.display = "none";
  });

  customize?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  saveCustom?.addEventListener("click", () => {
    const consent = {
      analytics: analyticsCheckbox?.checked || false,
      marketing: marketingCheckbox?.checked || false
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    modal.style.display = "none";
    banner.style.display = "none";
    if (consent.analytics) injectAnalytics();
  });

  closeModal?.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// === Inject Google Analytics ===
function injectAnalytics() {
  if (document.getElementById("ga-script")) return;
  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = "https://www.googletagmanager.com/gtag/js?id=GA-ID"; // ← erstatt GA-ID
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA-ID'); // ← erstatt GA-ID
}

// === Form fallback (kan brukes i forms) ===
function handleSubmit(e) {
  e.preventDefault();
  alert("Takk! Forespørselen din er sendt.");
}

// === INIT ===
window.addEventListener("DOMContentLoaded", () => {
  // Header
  loadHTML("#header", "partials/header.html", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
      });
    }
  });

  // Footer
  loadHTML("#footer", "partials/footer.html");

  // Cookie banner – kun hvis det ikke er samtykket
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) {
    loadHTML("#cookie", "partials/cookies.html", setupCookieBanner);
  } else {
    try {
      const parsed = JSON.parse(consent);
      if (parsed?.analytics) injectAnalytics();
    } catch (e) {}
  }

  // Lightbox
  setupLightbox();
});
