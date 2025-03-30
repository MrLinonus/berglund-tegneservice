// Funksjon for å laste inn HTML fra fil
function loadHTML(selector, file, callback) {
    fetch(file)
      .then(res => res.text())
      .then(data => {
        document.querySelector(selector).innerHTML = data;
        if (typeof callback === "function") callback(); // Kjør ekstra logikk etterpå
      });
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    // Last inn header og koble til burger-meny etterpå
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
  
    // Last inn footer
    loadHTML("#footer", "partials/footer.html");
  
    // Lightbox-funksjon
    document.querySelectorAll(".lightbox").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
  
        const href = link.getAttribute("href");
        if (!href) {
          console.error("Invalid link href");
          return;
        }
  
        // Opprett overlay
        const overlay = document.createElement("div");
        overlay.classList.add("lightbox-overlay");
  
        // Opprett bilde
        const img = document.createElement("img");
        img.src = href;
        img.alt = "Forstørret bilde";
        img.classList.add("lightbox-img");
  
        // Lukkeknapp
        const closeBtn = document.createElement("span");
        closeBtn.textContent = "✕";
        closeBtn.className = "lightbox-close";
        closeBtn.addEventListener("click", () => overlay.remove());
  
        // Legg til alt
        overlay.appendChild(closeBtn);
        overlay.appendChild(img);
        document.body.appendChild(overlay);
  
        // Klikk utenfor bildet lukker også
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.remove();
          }
        });
      });
    });
  });
  
  // Form submit fallback
  function handleSubmit(e) {
    e.preventDefault();
    alert("Takk! Forespørselen din er sendt.");
    // Her kan du sende videre til Formspree
  }
document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "flex";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
  });
});

  
