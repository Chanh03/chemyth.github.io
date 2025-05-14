document.addEventListener("DOMContentLoaded", () => {
  // ================== 1. DOM Elements ==================
  const menuToggle = document.querySelector(".menu-toggle");
  const fullscreenMenu = document.querySelector(".fullscreen-menu");
  const closeMenu = document.querySelector(".close-menu");
  const themeToggle = document.querySelector(".theme-toggle");
  const menuLinks = document.querySelectorAll(".menu-links li");
  const quote = document.getElementById("quote");
  const quoteGen = document.getElementById("quote-gen");
  const quoteStep = document.getElementById("quote-step");
  const goToTopButton = document.getElementById("back-to-top");

  // ================== 2. Biến toàn cục ==================
  const steps = [
    "% loading...",
    "% rendering...",
    "% generating...",
    "> done!",
  ];
  let isDarkMode = false;

  // ================== 3. Ẩn Loading Screen ==================

  window.addEventListener("load", function () {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
  });

  // ================== 4. Menu toàn màn hình ==================
  if (menuToggle && fullscreenMenu) {
    menuToggle.addEventListener("click", () => {
      fullscreenMenu.classList.add("active");
      menuLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.transitionDelay = `${index * 0.1}s`;
        }, 0);
      });
    });
  }

  if (closeMenu && fullscreenMenu) {
    closeMenu.addEventListener("click", () => {
      fullscreenMenu.classList.remove("active");
      menuLinks.forEach((link) => (link.style.transitionDelay = "0s"));
    });
  }

  // ================== 5. Giao diện (dark/light mode) ==================
  const savedTheme = localStorage.getItem("theme");
  const savedTime = localStorage.getItem("themeTime");

  if (savedTheme && savedTime && Date.now() - savedTime < 24 * 60 * 60 * 1000) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    isDarkMode = savedTheme === "dark";
  } else {
    localStorage.removeItem("theme");
    localStorage.removeItem("themeTime");
    document.documentElement.setAttribute("data-theme", "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      const theme = isDarkMode ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      localStorage.setItem("themeTime", Date.now());
    });
  }

  // ================== 6. Scroll shrink navbar ==================
  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (nav) {
      nav.classList.toggle("shrink", window.scrollY > 100);
    }
  });

  // ================== 7. Nút scroll lên đầu ==================
  if (goToTopButton) {
    window.addEventListener("scroll", () => {
      goToTopButton.style.display = window.scrollY > 100 ? "block" : "none";
    });

    goToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ================== 8. Quote Generator ==================
  if (quoteGen && quote && quoteStep) {
    quoteGen.addEventListener("click", async () => {
      quote.textContent = "";
      quoteGen.disabled = true;
      try {
        for (let step of steps) {
          quoteStep.textContent = step;
          await delay(500);
        }
        quoteStep.textContent = "";
        const data = await fetchQuotes();
        const randomQuote = generateRandomQuote(data);
        await typeWriterEffect(randomQuote);
      } catch (e) {
        quote.textContent = "Error: " + e;
      } finally {
        quoteGen.disabled = false;
      }
    });
  }

  // ================== 9. GSAP Scroll animation ==================
  gsap.utils.toArray(".card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.05,
      ease: "power2.out",
    });
  });
  gsap.utils.toArray("main img").forEach((img, i) => {
    gsap.from(img, {
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 0.4,
      delay: i * 0.05,
      ease: "power2.out",
    });
  });
  gsap.utils.toArray("main p").forEach((cardContent, i) => {
    gsap.from(cardContent, {
      scrollTrigger: {
        trigger: cardContent,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      duration: 0.6,
      delay: i * 0.05,
      ease: "power2.out",
    });
  });

  // ================== 10. Tạo hiệu ứng square nền ==================
  setInterval(createSquare, 200);

  function createSquare(options = {}) {
    const {
      minSize = 10,
      maxSize = 100,
      maxOpacity = 0.5,
      lifetime = 3000,
      fadeDuration = 1000,
      container = document.querySelector(".square-container"),
    } = options;

    if (!container) return;

    const square = document.createElement("div");
    const size = Math.random() * (maxSize - minSize) + minSize;
    const opacity = Math.random() * maxOpacity;
    const x = Math.random() * (container.offsetWidth - size);
    const y = Math.random() * (container.offsetHeight - size);

    Object.assign(square.style, {
      width: `${size}px`,
      height: `${size}px`,
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      border: "2px solid rgba(255, 50, 50, 0.8)",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgb(255, 7, 7) 10%, transparent 10%)",
      zIndex: -1,
      opacity: opacity,
      boxShadow: "0 0 8px rgba(255, 50, 50, 0.5)",
      animation: "pulse 1.5s ease-in-out infinite",
      transition: `opacity ${fadeDuration}ms ease`,
    });

    container.appendChild(square);

    setTimeout(() => {
      square.style.opacity = 0;
      setTimeout(() => square.remove(), fadeDuration);
    }, lifetime);
  }

  // ================== 12. Hàm phụ trợ ==================
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchQuotes() {
    try {
      const res = await fetch("quotes.json");
      if (!res.ok) throw new Error("Failed to fetch quotes");
      return res.json();
    } catch (e) {
      throw new Error("Could not load quotes: " + e.message);
    }
  }

  function generateRandomQuote(data) {
    const randomQuote = data[Math.floor(Math.random() * data.length)].quote;
    const randomAuthor = data[Math.floor(Math.random() * data.length)].author;
    return `${randomQuote} - ${randomAuthor}`;
  }

  async function typeWriterEffect(text) {
    for (let char of text) {
      quote.textContent += char;
      await delay(50);
    }
  }
  // ===== Magnet Hover Effect =====
  const magnetRadius = 150;
  let mouseX = 0,
    mouseY = 0,
    ticking = false;

  const resetMagnet = (el, text) => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 1.5,
      ease: "elastic.out(1.2, 0.4)",
    });
    if (text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  };

  const isMobile = window.innerWidth <= 768; // Kiểm tra xem màn hình có phải di động không

  if (!isMobile) {
    // Chỉ áp dụng nếu không phải màn hình di động
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        requestAnimationFrame(() => {
          document.querySelectorAll(".card").forEach((card) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.hypot(dx, dy);

            const text = card.querySelector("span");

            if (distance < magnetRadius) {
              gsap.to(card, {
                x: dx * 0.3,
                y: dy * 0.3,
                duration: 0.4,
                ease: "power2.out",
              });
              if (text) {
                gsap.to(text, {
                  x: dx * 0.15,
                  y: dy * 0.15,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }
            } else {
              resetMagnet(card, text);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ================== 14. Typed.js ==================
  var typing = new Typed("#intro-highlight", {
    strings: ["", "Java Backend Developer", "Web Designer.", "AI"],
    typeSpeed: 100,
    backSpeed: 40,
    loop: true,
    showCursor: false,
  });
});
