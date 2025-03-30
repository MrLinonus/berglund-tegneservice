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
  const customizeBtn = document.getElementById("customize-cookies");

  const saveCustomBtn = document.getElementById("save-custom-cookies");
  const closeModalBtn = document.getElementById("close-modal");

  const analyticsCheckbox = document.getElementById("analytics-cookies");
  const marketingCheckbox = document.getElementById("marketing-cookies");

  const storedConsent = localStorage.getItem("cookieConsent");
  if (storedConsent) return; // Ikke vis på nytt

  banner.style.display = "flex";

  // Godta alt
  acceptAll?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true
    }));
    banner.remove();
    modal.remove();
  });

  // Kun nødvendige
  essentialOnly?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false
    }));
    banner.remove();
    modal.remove();
  });

  // Åpne modal
  customizeBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Lukk modal
  closeModalBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Lagre tilpassede valg
  saveCustomBtn?.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: analyticsCheckbox.checked,
      marketing: marketingCheckbox.checked
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    modal.style.display = "none";
    banner.remove();
  });
}
const consent = JSON.parse(localStorage.getItem("cookieConsent") || "{}");

if (consent.analytics) {
  // Last inn Google Analytics f.eks.
}

if (consent.marketing) {
  // Last inn Facebook Pixel
}

