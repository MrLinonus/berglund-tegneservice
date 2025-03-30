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
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  if (!banner || localStorage.getItem("cookieConsent")) return;

  banner.style.display = "flex";

  acceptBtn?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    banner.style.display = "none";

    // Eksempel: Aktiver Google Analytics her hvis ønskelig
    // loadGoogleAnalytics();
  });

  rejectBtn?.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "rejected");
    banner.style.display = "none";
  });
}
