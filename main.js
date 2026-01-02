document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".category-btn");

  // مراقبة ظهور أقسام الصفحة الرئيسية في منتصف الشاشة
  if ("IntersectionObserver" in window && buttons.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const btn = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            btn.classList.add("in-view");
          } else {
            btn.classList.remove("in-view");
          }
        });
      },
      {
        root: null,
        threshold: [0.6],
      }
    );

    buttons.forEach((btn) => observer.observe(btn));
  } else {
    // في حال عدم دعم المتصفح لـ IntersectionObserver اجعل أول قسم نشطاً
    if (buttons[0]) {
      buttons[0].classList.add("in-view");
    }
  }

  // شاشة ترحيب في البداية مع كتابة حرف حرف
  const introOverlay = document.querySelector(".intro-overlay");
  const introTextEl = document.querySelector(".intro-text");
  const introSkipBtn = document.querySelector(".intro-skip-btn");
  const appRoot = document.querySelector(".app-root");
  const bodyEl = document.body;

  let typingTimeoutId = null;
  let introFooterTimeoutId = null;

  function stopIntroFooterTyping() {
    if (introFooterTimeoutId) {
      clearTimeout(introFooterTimeoutId);
      introFooterTimeoutId = null;
    }
  }

  function startIntroFooterTyping() {
    const footerEl = document.querySelector(".intro-footer-text");
    if (!footerEl) return;

    const text = 'Kapoo "Samy"';
    let index = 0;
    let isDeleting = false;

    const TYPE_SPEED = 120;
    const DELETE_SPEED = 80;
    const PAUSE_AT_END = 1000;
    const PAUSE_AT_START = 600;

    const tick = () => {
      if (!footerEl) return;

      if (!isDeleting) {
        if (index < text.length) {
          index++;
        } else {
          isDeleting = true;
          footerEl.textContent = text;
          introFooterTimeoutId = setTimeout(tick, PAUSE_AT_END);
          return;
        }
      } else {
        if (index > 0) {
          index--;
        } else {
          isDeleting = false;
          footerEl.textContent = "";
          introFooterTimeoutId = setTimeout(tick, PAUSE_AT_START);
          return;
        }
      }

      footerEl.textContent = text.slice(0, index);
      const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
      introFooterTimeoutId = setTimeout(tick, delay);
    };

    footerEl.textContent = "";
    introFooterTimeoutId = setTimeout(tick, PAUSE_AT_START);
  }

  function finishIntro() {
    bodyEl.classList.add("app-ready");
    stopIntroFooterTyping();
    if (introOverlay) {
      introOverlay.classList.add("intro-hide");
      setTimeout(() => {
        if (introOverlay && introOverlay.parentNode) {
          introOverlay.parentNode.removeChild(introOverlay);
        }
      }, 400);
    }
  }

  function startIntro() {
    if (!introOverlay || !introTextEl || !appRoot) {
      bodyEl.classList.add("app-ready");
      return;
    }

    const fullText =
      "مرحبا بيكم في موقع كابو استور موقع كابو استور هو عالم الشحن والشراء الذكي \nمع كابو استور هتبق في المضمون";
    let index = 0;
    const TYPE_DELAY = 70;
    const END_PAUSE = 400;

    const typeNext = () => {
      if (index <= fullText.length) {
        introTextEl.textContent = fullText.slice(0, index);
        index++;
        typingTimeoutId = setTimeout(typeNext, TYPE_DELAY);
      } else {
        typingTimeoutId = setTimeout(() => {
          finishIntro();
        }, END_PAUSE);
      }
    };

    if (introSkipBtn) {
      introSkipBtn.addEventListener("click", () => {
        if (typingTimeoutId) {
          clearTimeout(typingTimeoutId);
          typingTimeoutId = null;
        }
        stopIntroFooterTyping();
        finishIntro();
      });
    }

    startIntroFooterTyping();
    typeNext();
  }

  startIntro();

  const WHATSAPP_NUMBER = "201284070117";
  const TELEGRAM_USER = "K_P_O5";

  // روابط مواقع التواصل من زر الثلاث نقاط
  const SOCIAL_LINKS = {
    whatsapp:
      "https://whatsapp.com/channel/0029Vb78F2gCRs1gRj6i6W2O",
    telegram: "https://t.me/K_P_O3",
    instagram:
      "https://www.instagram.com/sami.aura_?igsh=aXlnMzkyeXZ2enU3",
    youtube:
      "https://youtube.com/@k_a_p_oo7?si=0_OroqoEGrNDepX6",
  };

  const moreMenuBtn = document.querySelector(".more-menu-btn");
  const socialOverlay = document.querySelector(".social-modal-overlay");
  const socialCloseBtn = socialOverlay
    ? socialOverlay.querySelector(".social-modal-close")
    : null;

  // Theme toggle (light / dark)
  const themeToggleBtn = document.querySelector(".theme-toggle-btn");
  const THEME_KEY = "kapoo_theme";

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("theme-light");
      if (themeToggleBtn) themeToggleBtn.textContent = "☀";
    } else {
      document.body.classList.remove("theme-light");
      if (themeToggleBtn) themeToggleBtn.textContent = "🌙";
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.body.classList.contains("theme-light")
        ? "light"
        : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // ignore
      }
    });
  }

  // فتح / غلق نافذة مواقع التواصل
  if (moreMenuBtn && socialOverlay) {
    moreMenuBtn.addEventListener("click", () => {
      socialOverlay.classList.add("show");
    });

    if (socialCloseBtn) {
      socialCloseBtn.addEventListener("click", () => {
        socialOverlay.classList.remove("show");
      });
    }

    socialOverlay.addEventListener("click", (e) => {
      if (e.target === socialOverlay) {
        socialOverlay.classList.remove("show");
      }
    });

    socialOverlay.addEventListener("click", (e) => {
      const btn = e.target.closest(".social-btn");
      if (!btn) return;
      const platform = btn.dataset.platform;
      const url = SOCIAL_LINKS[platform];
      if (url) {
        window.open(url, "_blank");
      }
    });
  }

  // خصومات - أكواد لكل قسم
  const DISCOUNT_CODES = {
    pubg: [
      "950bet512d",
      "652ljgu065",
      "hgn8762gt2",
      "0186g25g4k",
      "053hty60u5",
      "h05k8j8p94",
      "fhtd059mku",
      "ftnla0585i",
      "plzgtl69d0",
      "gj5yfy5f9f",
    ],
    freefire: [
      "trgnmi854o",
      "hfg625hty8",
      "uft5l87hlf",
      "uytdv859mj",
      "yt05hgu850",
      "fuj589jhy5",
      "olj580fuiy",
      "okjdtn058d",
      "kf87f26fl8",
      "dro862hfy0",
    ],
    charging: [
      "ufy58fvki8",
      "jfuio58li89",
      "jyxcf85760",
      "juh985jh20",
      "015lom569k",
      "jfy802f8p5",
      "jfy58202kfi",
      "jhy594l,j2",
      "frd520jfu0",
      "uyd520li05",
    ],
    design: [
      "jfy876jfu8",
      "dtv21lifh8",
      "sfvum8759m",
      "afrncy2580",
      "dhy8754kim",
      "hdy018lfj0",
      "jdu58fim0v",
      "hdgy856of0",
      "jdu875dhy0",
      "hstf025kh0",
    ],
    methods: [
      "hfy875fli0",
      "hfynzf5809",
      "ytd528jdhu",
      "tdy58jun20",
      "fsr54ung20",
      "dgch5860ju",
      "nchgdu058k",
      "jfuyf058lk",
      "jhku58bg20",
      "mcj015hyf9",
    ],
  };

  const USED_CODES_STORAGE_PREFIX = "kapoo_discount_used_";

  function getUsedCodes(sectionType) {
    const key = USED_CODES_STORAGE_PREFIX + sectionType;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function addUsedCode(sectionType, code) {
    const used = getUsedCodes(sectionType);
    if (!used.includes(code)) {
      used.push(code);
      try {
        localStorage.setItem(
          USED_CODES_STORAGE_PREFIX + sectionType,
          JSON.stringify(used)
        );
      } catch (e) {
        // ignore storage errors
      }
    }
  }

  // نافذة منبثقة لاختيار كود الخصم
  let discountModalEl = null;
  let discountModalInput = null;
  let discountModalMessage = null;
  let discountModalSaveBtn = null;
  let currentDiscountSection = null; // DOM للسيكشن الحالي

  function ensureDiscountModal() {
    if (discountModalEl) return discountModalEl;

    const overlay = document.createElement("div");
    overlay.className = "discount-modal-overlay";
    overlay.innerHTML = `
      <div class="discount-modal">
        <div class="discount-modal-header">
          <span class="discount-modal-title">كود خصم 10%</span>
          <button type="button" class="discount-modal-close">×</button>
        </div>
        <div class="discount-modal-body">
          <label class="discount-modal-label">
            ادخل كود الخصم 10%
          </label>
          <input
            type="text"
            class="discount-code-input"
            placeholder="اكتب كود الخصم هنا..."
          />
          <div class="discount-modal-message"></div>
        </div>
        <div class="discount-modal-footer">
          <button type="button" class="discount-modal-confirm">تأكيد الكود</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    discountModalEl = overlay;
    discountModalInput = overlay.querySelector(".discount-code-input");
    discountModalMessage = overlay.querySelector(".discount-modal-message");
    discountModalSaveBtn = overlay.querySelector(".discount-modal-confirm");

    function closeModal() {
      overlay.classList.remove("show");
      if (discountModalInput) {
        discountModalInput.value = "";
      }
      if (discountModalMessage) {
        discountModalMessage.textContent = "";
        discountModalMessage.className = "discount-modal-message";
      }
      currentDiscountSection = null;
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    overlay
      .querySelector(".discount-modal-close")
      .addEventListener("click", closeModal);

    discountModalSaveBtn.addEventListener("click", () => {
      if (!currentDiscountSection || !discountModalInput) return;

      const sectionType = currentDiscountSection.dataset.sectionType;
      const codes = DISCOUNT_CODES[sectionType] || [];
      const entered = discountModalInput.value.trim();

      if (!entered) {
        discountModalMessage.textContent = "من فضلك ادخل كود الخصم.";
        discountModalMessage.className =
          "discount-modal-message discount-modal-message-error";
        return;
      }

      const usedCodes = getUsedCodes(sectionType);
      if (usedCodes.includes(entered)) {
        discountModalMessage.textContent =
          "تم استخدام هذا الكود من قبل ولا يمكن استخدامه مرة أخرى.";
        discountModalMessage.className =
          "discount-modal-message discount-modal-message-error";
        return;
      }

      if (!codes.includes(entered)) {
        discountModalMessage.textContent = "الكود غير صحيح او غير تابع لهذا القسم.";
        discountModalMessage.className =
          "discount-modal-message discount-modal-message-error";
        return;
      }

      // كود صحيح
      const now = Date.now();
      const expiresAt = now + 24 * 60 * 60 * 1000; // 24 ساعة

      currentDiscountSection.discountCode = entered;
      currentDiscountSection.discountExpiresAt = expiresAt;

      // حفظ الكود كمستخدم حتى لا يمكن استعماله مرة أخرى
      addUsedCode(sectionType, entered);

      setupDiscountTimer(currentDiscountSection);

      discountModalMessage.textContent = "تم الحصول علي خصم 10 %";
      discountModalMessage.className =
        "discount-modal-message discount-modal-message-success";

      setTimeout(() => {
        overlay.classList.remove("show");
      }, 800);
    });

    return overlay;
  }

  function showDiscountModal(sectionWrapper) {
    currentDiscountSection = sectionWrapper;
    const modal = ensureDiscountModal();
    modal.classList.add("show");
    if (discountModalInput) {
      discountModalInput.value = "";
      discountModalInput.focus();
    }
    if (discountModalMessage) {
      discountModalMessage.textContent = "";
      discountModalMessage.className = "discount-modal-message";
    }
  }

  function formatRemaining(ms) {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor((totalSeconds % 3600) / 60)
    ).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  function setupDiscountTimer(sectionWrapper) {
    const header = sectionWrapper.querySelector(".section-header");
    if (!header) return;
    const bar = header.querySelector(".discount-timer-bar");
    if (!bar) return;

    // أوقف أي عداد قديم
    if (sectionWrapper.discountTimerInterval) {
      clearInterval(sectionWrapper.discountTimerInterval);
    }

    const update = () => {
      const now = Date.now();
      const expiresAt = sectionWrapper.discountExpiresAt || 0;
      const remaining = expiresAt - now;

      if (!sectionWrapper.discountCode || remaining <= 0) {
        bar.hidden = true;
        bar.textContent = "";
        sectionWrapper.discountCode = null;
        sectionWrapper.discountExpiresAt = null;
        if (sectionWrapper.discountTimerInterval) {
          clearInterval(sectionWrapper.discountTimerInterval);
          sectionWrapper.discountTimerInterval = null;
        }
        return;
      }

      bar.hidden = false;
      bar.textContent =
        "الوقت المتبقي لانتهاء كود الخصم: " + formatRemaining(remaining);
    };

    update();
    sectionWrapper.discountTimerInterval = setInterval(update, 1000);
  }

  // Home page typing animation under main logo
  (function initHomeTyping() {
    const typingEl = document.querySelector(".home-typing-text");
    if (!typingEl) return;

    const baseText =
      'أهلا بك في عالم الشحن والتوفير والخصومات والعروض الدائمه\n"KAPOO STORE "\n:مع كابو ستور انت في امان';
    const dotChar = ".";
    let index = 0;
    let isDeleting = false;

    const TYPE_SPEED = 120;
    const DELETE_SPEED = 80;
    const PAUSE_AT_END = 1200;
    const PAUSE_AT_START = 600;

    const tick = () => {
      if (!isDeleting) {
        if (index < baseText.length) {
          index++;
        } else {
          isDeleting = true;
          setTimeout(tick, PAUSE_AT_END);
          typingEl.textContent = baseText.slice(0, index) + dotChar;
          return;
        }
      } else {
        if (index > 0) {
          index--;
        } else {
          isDeleting = false;
          setTimeout(tick, PAUSE_AT_START);
          typingEl.textContent = dotChar;
          return;
        }
      }

      typingEl.textContent = baseText.slice(0, index) + dotChar;
      const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
      setTimeout(tick, delay);
    };

    typingEl.textContent = dotChar;
    setTimeout(tick, PAUSE_AT_START);
  })();

  // Header typewriter (Arabic / English alternating)
  (function initHeaderTyping() {
    const typingEl = document.querySelector(".header-typing-text");
    if (!typingEl) return;

    const texts = [
      { text: "أهلاً بكم في موقع كابو ستور", dir: "rtl" },
      { text: "Welcome to Kabo Store", dir: "ltr" },
    ];

    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 120;
    const DELETE_SPEED = 80;
    const PAUSE_AT_END = 1000;
    const PAUSE_AT_START = 600;

    const tick = () => {
      const current = texts[currentIndex];
      const fullText = current.text;

      typingEl.dir = current.dir;

      if (!isDeleting) {
        if (charIndex < fullText.length) {
          charIndex++;
        } else {
          isDeleting = true;
          typingEl.textContent = fullText;
          setTimeout(tick, PAUSE_AT_END);
          return;
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
        } else {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % texts.length;
          typingEl.textContent = "";
          setTimeout(tick, PAUSE_AT_START);
          return;
        }
      }

      typingEl.textContent = fullText.slice(0, charIndex);
      const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
      setTimeout(tick, delay);
    };

    typingEl.textContent = "";
    setTimeout(tick, PAUSE_AT_START);
  })();

  function openContact(platform, itemText) {
    const encoded = encodeURIComponent(itemText);
    if (platform === "whatsapp") {
      const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded;
      window.open(waUrl, "_blank");
    } else if (platform === "telegram") {
      const tgUrl = "https://t.me/" + TELEGRAM_USER + "?text=" + encoded;
      window.open(tgUrl, "_blank");
    }
  }

  // Floating WhatsApp support button with typewriter text
  (function initFloatingWhatsApp() {
    const btn = document.querySelector(".floating-wa-btn");
    const textEl = document.querySelector(".floating-wa-text");
    if (!btn || !textEl) return;

    const phrases = ["تواصل معنا", "دعم واتساب"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 120;
    const DELETE_SPEED = 80;
    const PAUSE_AT_END = 1000;
    const PAUSE_AT_START = 600;

    const tick = () => {
      const currentText = phrases[phraseIndex];

      if (!isDeleting) {
        if (charIndex < currentText.length) {
          charIndex++;
        } else {
          isDeleting = true;
          setTimeout(tick, PAUSE_AT_END);
          textEl.textContent = currentText;
          return;
        }
      } else {
        if (charIndex > 0) {
          charIndex--;
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, PAUSE_AT_START);
          textEl.textContent = "";
          return;
        }
      }

      textEl.textContent = currentText.slice(0, charIndex);
      const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
      setTimeout(tick, delay);
    };

    textEl.textContent = "";
    setTimeout(tick, PAUSE_AT_START);

    const supportMessage = "*انا جاي من الدعم من موقع كابو ستور*";
    const encodedSupport = encodeURIComponent(supportMessage);

    btn.addEventListener("click", () => {
      const waUrl =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodedSupport;
      window.open(waUrl, "_blank");
    });
  })();

  function createPubgSection() {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page pubg-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">قسم ببجي</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="pubg-search-wrapper">
          <div class="pubg-search-box">
            <input
              type="text"
              class="pubg-search-input"
              placeholder="ابحث عن عنصر داخل القسم..."
            />
          </div>
        </div>
        <div class="pubg-banner">
          <img src="./1481606_0.jpg" alt="صورة ببجي" class="pubg-banner-img" />
        </div>
        <div class="pubg-typing-wrapper">
          <span class="pubg-typing-text"></span>
        </div>
        <div class="pubg-grid">
          <div class="pubg-item" data-item="60 شده ب43ج">
            <button class="pubg-main-btn" type="button">60 شده ب43ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="60 شده ب43ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="60 شده ب43ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="325 شده ب215ج">
            <button class="pubg-main-btn" type="button">325 شده ب215ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="325 شده ب215ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="325 شده ب215ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="170 شده ب55ج">
            <button class="pubg-main-btn" type="button">170 شده ب55ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="170 شده ب55ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="170 شده ب55ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="كريستاله حمرا140ج">
            <button class="pubg-main-btn" type="button">كريستاله حمرا140ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كريستاله حمرا140ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كريستاله حمرا140ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="سيزون ب200ج">
            <button class="pubg-main-btn" type="button">سيزون ب200ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="سيزون ب200ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="سيزون ب200ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="برايم عادي ب48ج">
            <button class="pubg-main-btn" type="button">برايم عادي ب48ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="برايم عادي ب48ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="برايم عادي ب48ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بريم بلص ب420ج">
            <button class="pubg-main-btn" type="button">بريم بلص ب420ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بريم بلص ب420ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بريم بلص ب420ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    `;

    // Back button
    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    // Discount logo button - افتح نافذة الكود
    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    // Contact buttons
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".contact-btn");
      if (!btn) return;
      const platform = btn.getAttribute("data-platform");
      const item = btn.getAttribute("data-item") || "";

      let message = item;
      const now = Date.now();
      if (
        wrapper.discountCode &&
        wrapper.discountExpiresAt &&
        wrapper.discountExpiresAt > now
      ) {
        message +=
          "\n\nلقد تم حصولي علي عرض ال 10%\n" +
          "كود الخصم الذي حصلت عليه: " +
          wrapper.discountCode +
          "\n" +
          "والان سوف اقوم بأرسال اسكرين اثبات للحصول علي كود الخصم";
      }

      openContact(platform, message);
    });

    // Typing animation text under PUBG image
    const typingEl = wrapper.querySelector(".pubg-typing-text");
    if (typingEl) {
      const baseText =
        "اهلا بك في عالم ببجي وعالم الخصومات القويه\nKAPOO STORE";
      const dotChar = ".";
      let index = 0;
      let isDeleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 80;
      const PAUSE_AT_END = 1200;
      const PAUSE_AT_START = 600;

      const tick = () => {
        if (!isDeleting) {
          if (index < baseText.length) {
            index++;
          } else {
            isDeleting = true;
            setTimeout(tick, PAUSE_AT_END);
            typingEl.textContent = baseText.slice(0, index) + dotChar;
            return;
          }
        } else {
          if (index > 0) {
            index--;
          } else {
            isDeleting = false;
            setTimeout(tick, PAUSE_AT_START);
            typingEl.textContent = dotChar;
            return;
          }
        }

        typingEl.textContent = baseText.slice(0, index) + dotChar;

        const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        setTimeout(tick, delay);
      };

      // start animation
      typingEl.textContent = dotChar;
      setTimeout(tick, PAUSE_AT_START);
    }

    // Search behavior: move matched item to top
    const searchInput = wrapper.querySelector(".pubg-search-input");
    const sectionMain = wrapper.querySelector(".section-main");
    const pubgGrid = wrapper.querySelector(".pubg-grid");
    const searchBox = wrapper.querySelector(".pubg-search-box");

    if (searchInput && sectionMain && pubgGrid) {
      const updateSearchGlow = () => {
        if (!searchBox) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
          searchBox.classList.add("active");
        } else {
          searchBox.classList.remove("active");
        }
      };

      const runSearch = () => {
        const query = searchInput.value;
        const items = Array.from(pubgGrid.querySelectorAll(".pubg-item"));

        if (!query) {
          updateSearchGlow();
          return;
        }

        const match = items.find((el) => {
          const text = (el.getAttribute("data-item") || "").toLowerCase();
          return text.includes(query.toLowerCase());
        });

        if (match) {
          pubgGrid.prepend(match);
          sectionMain.scrollTop = 0;
        }

        updateSearchGlow();
      };

      // تحديث الإضاءة عند التركيز، الإلغاء، والكتابة
      searchInput.addEventListener("focus", updateSearchGlow);
      searchInput.addEventListener("blur", updateSearchGlow);
      searchInput.addEventListener("input", runSearch);
      searchInput.addEventListener("keyup", runSearch);

      // حالة أولية
      updateSearchGlow();
    }

    // نوع القسم للخصومات
    wrapper.dataset.sectionType = "pubg";

    return wrapper;
  }

  function createChargingSection() {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page charging-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">كروت فكه</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="pubg-search-wrapper">
          <div class="pubg-search-box">
            <input
              type="text"
              class="pubg-search-input"
              placeholder="ابحث عن كرت فكه..."
            />
          </div>
        </div>
        <div class="pubg-banner">
          <img src="./كروت فمه.png" alt="لوجو قسم كروت فكه" class="pubg-banner-img" />
        </div>
        <div class="pubg-typing-wrapper">
          <span class="pubg-typing-text"></span>
        </div>
        <div class="pubg-grid">
          <div class="pubg-item" data-item="كرت فكه ب17ج">
            <button class="pubg-main-btn" type="button">كرت فكه ب17ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كرت فكه ب17ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كرت فكه ب17ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="كرت فكه ب20ج">
            <button class="pubg-main-btn" type="button">كرت فكه ب20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كرت فكه ب20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كرت فكه ب20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="كرت فكه ب28ج">
            <button class="pubg-main-btn" type="button">كرت فكه ب28ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كرت فكه ب28ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كرت فكه ب28ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="كرت فكه ب36ج">
            <button class="pubg-main-btn" type="button">كرت فكه ب36ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كرت فكه ب36ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كرت فكه ب36ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    `;

    // Back button
    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    // Discount logo button
    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    // Contact buttons
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".contact-btn");
      if (!btn) return;
      const platform = btn.getAttribute("data-platform");
      const item = btn.getAttribute("data-item") || "";

      let message = item;
      const now = Date.now();
      if (
        wrapper.discountCode &&
        wrapper.discountExpiresAt &&
        wrapper.discountExpiresAt > now
      ) {
        message +=
          "\n\nلقد تم حصولي علي عرض ال 10%\n" +
          "كود الخصم الذي حصلت عليه: " +
          wrapper.discountCode +
          "\n" +
          "والان سوف اقوم بأرسال اسكرين اثبات للحصول علي كود الخصم";
      }

      openContact(platform, message);
    });

    // Typing animation text under charging logo image
    const typingEl = wrapper.querySelector(".pubg-typing-text");
    if (typingEl) {
      const baseText =
        "اهلا بك في عالم كروت الفكه وعالم الخصومات\nKAPOO STORE";
      const dotChar = ".";
      let index = 0;
      let isDeleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 80;
      const PAUSE_AT_END = 1200;
      const PAUSE_AT_START = 600;

      const tick = () => {
        if (!isDeleting) {
          if (index < baseText.length) {
            index++;
          } else {
            isDeleting = true;
            setTimeout(tick, PAUSE_AT_END);
            typingEl.textContent = baseText.slice(0, index) + dotChar;
            return;
          }
        } else {
          if (index > 0) {
            index--;
          } else {
            isDeleting = false;
            setTimeout(tick, PAUSE_AT_START);
            typingEl.textContent = dotChar;
            return;
          }
        }

        typingEl.textContent = baseText.slice(0, index) + dotChar;

        const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        setTimeout(tick, delay);
      };

      typingEl.textContent = dotChar;
      setTimeout(tick, PAUSE_AT_START);
    }

    // Search behavior: move matched item to top
    const searchInput = wrapper.querySelector(".pubg-search-input");
    const sectionMain = wrapper.querySelector(".section-main");
    const pubgGrid = wrapper.querySelector(".pubg-grid");
    const searchBox = wrapper.querySelector(".pubg-search-box");

    if (searchInput && sectionMain && pubgGrid) {
      const updateSearchGlow = () => {
        if (!searchBox) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
          searchBox.classList.add("active");
        } else {
          searchBox.classList.remove("active");
        }
      };

      const runSearch = () => {
        const query = searchInput.value;
        const items = Array.from(pubgGrid.querySelectorAll(".pubg-item"));

        if (!query) {
          updateSearchGlow();
          return;
        }

        const match = items.find((el) => {
          const text = (el.getAttribute("data-item") || "").toLowerCase();
          return text.includes(query.toLowerCase());
        });

        if (match) {
          pubgGrid.prepend(match);
          sectionMain.scrollTop = 0;
        }

        updateSearchGlow();
      };

      searchInput.addEventListener("focus", updateSearchGlow);
      searchInput.addEventListener("blur", updateSearchGlow);
      searchInput.addEventListener("input", runSearch);
      searchInput.addEventListener("keyup", runSearch);

      updateSearchGlow();
    }

    // نوع القسم للخصومات
    wrapper.dataset.sectionType = "charging";

    return wrapper;
  }

  function createDesignSection() {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page design-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">قسم تصميم</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="pubg-search-wrapper">
          <div class="pubg-search-box">
            <input
              type="text"
              class="pubg-search-input"
              placeholder="ابحث عن خدمه تصميم داخل القسم..."
            />
          </div>
        </div>
        <div class="pubg-banner">
          <img src="./تصميم.png" alt="شعار قسم التصميم" class="pubg-banner-img" />
        </div>
        <div class="pubg-typing-wrapper">
          <span class="pubg-typing-text"></span>
        </div>
        <div class="pubg-grid">
          <div class="pubg-item" data-item="الوجو بـ 25 ج">
            <button class="pubg-main-btn" type="button">الوجو بـ 25 ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="الوجو بـ 25 ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="الوجو بـ 25 ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="حزمه 3 لوجهات بـ 65 ج">
            <button class="pubg-main-btn" type="button">حزمه 3 لوجهات بـ 65 ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="حزمه 3 لوجهات بـ 65 ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="حزمه 3 لوجهات بـ 65 ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="الاستيكر بـ 10 ج">
            <button class="pubg-main-btn" type="button">الاستيكر بـ 10 ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="الاستيكر بـ 10 ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="الاستيكر بـ 10 ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="حزمه 3 استيكرات بـ 25">
            <button class="pubg-main-btn" type="button">حزمه 3 استيكرات بـ 25</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="حزمه 3 استيكرات بـ 25">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="حزمه 3 استيكرات بـ 25">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بانر للواتس اعمال بـ 15">
            <button class="pubg-main-btn" type="button">بانر للواتس اعمال بـ 15</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بانر للواتس اعمال بـ 15">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بانر للواتس اعمال بـ 15">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    `;

    // Back button
    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    // Discount logo button
    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    // Contact buttons
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".contact-btn");
      if (!btn) return;
      const platform = btn.getAttribute("data-platform");
      const item = btn.getAttribute("data-item") || "";

      let message = item;
      const now = Date.now();
      if (
        wrapper.discountCode &&
        wrapper.discountExpiresAt &&
        wrapper.discountExpiresAt > now
      ) {
        message +=
          "\n\nلقد تم حصولي علي عرض ال 10%\n" +
          "كود الخصم الذي حصلت عليه: " +
          wrapper.discountCode +
          "\n" +
          "والان سوف اقوم بأرسال اسكرين اثبات للحصول علي كود الخصم";
      }

      openContact(platform, message);
    });

    // Typing animation text under logo image
    const typingEl = wrapper.querySelector(".pubg-typing-text");
    if (typingEl) {
      const baseText =
        "اهلا بك في قسم التصميم وعالم الخصومات\nKAPOO STORE";
      const dotChar = ".";
      let index = 0;
      let isDeleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 80;
      const PAUSE_AT_END = 1200;
      const PAUSE_AT_START = 600;

      const tick = () => {
        if (!isDeleting) {
          if (index < baseText.length) {
            index++;
          } else {
            isDeleting = true;
            setTimeout(tick, PAUSE_AT_END);
            typingEl.textContent = baseText.slice(0, index) + dotChar;
            return;
          }
        } else {
          if (index > 0) {
            index--;
          } else {
            isDeleting = false;
            setTimeout(tick, PAUSE_AT_START);
            typingEl.textContent = dotChar;
            return;
          }
        }

        typingEl.textContent = baseText.slice(0, index) + dotChar;

        const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        setTimeout(tick, delay);
      };

      typingEl.textContent = dotChar;
      setTimeout(tick, PAUSE_AT_START);
    }

    // Search behavior: move matched item to top and glow while typing
    const searchInput = wrapper.querySelector(".pubg-search-input");
    const sectionMain = wrapper.querySelector(".section-main");
    const pubgGrid = wrapper.querySelector(".pubg-grid");
    const searchBox = wrapper.querySelector(".pubg-search-box");

    if (searchInput && sectionMain && pubgGrid) {
      const updateSearchGlow = () => {
        if (!searchBox) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
          searchBox.classList.add("active");
        } else {
          searchBox.classList.remove("active");
        }
      };

      const runSearch = () => {
        const query = searchInput.value;
        const items = Array.from(pubgGrid.querySelectorAll(".pubg-item"));

        if (!query) {
          updateSearchGlow();
          return;
        }

        const match = items.find((el) => {
          const text = (el.getAttribute("data-item") || "").toLowerCase();
          return text.includes(query.toLowerCase());
        });

        if (match) {
          pubgGrid.prepend(match);
          sectionMain.scrollTop = 0;
        }

        updateSearchGlow();
      };

      searchInput.addEventListener("focus", updateSearchGlow);
      searchInput.addEventListener("blur", updateSearchGlow);
      searchInput.addEventListener("input", runSearch);
      searchInput.addEventListener("keyup", runSearch);

      updateSearchGlow();
    }

    // نوع القسم للخصومات
    wrapper.dataset.sectionType = "design";

    return wrapper;
  }

  function createMethodsSection() {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page methods-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">قسم طرق ثغرات</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="pubg-search-wrapper">
          <div class="pubg-search-box">
            <input
              type="text"
              class="pubg-search-input"
              placeholder="ابحث عن طريقه او منتج داخل القسم..."
            />
          </div>
        </div>
        <div class="pubg-banner">
          <img src="./generated-image-cf766f79-a536-400c-8bc7-647a7aecb55d.png" alt="شعار قسم طرق ثغرات" class="pubg-banner-img" />
        </div>
        <div class="pubg-typing-wrapper">
          <span class="pubg-typing-text"></span>
        </div>
        <div class="pubg-grid">
          <div class="pubg-item" data-item="طريقه ارقام فيك ب20ج">
            <button class="pubg-main-btn" type="button">طريقه ارقام فيك ب20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقه ارقام فيك ب20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقه ارقام فيك ب20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="طريقه عمل موقع ب30ج">
            <button class="pubg-main-btn" type="button">طريقه عمل موقع ب30ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقه عمل موقع ب30ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقه عمل موقع ب30ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="طريقه سحب صور ب30ج">
            <button class="pubg-main-btn" type="button">طريقه سحب صور ب30ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقه سحب صور ب30ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقه سحب صور ب30ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="ملف سحب بينات ب20ج">
            <button class="pubg-main-btn" type="button">ملف سحب بينات ب20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="ملف سحب بينات ب20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="ملف سحب بينات ب20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بوت سحب رقم من اليوزر ب20ج">
            <button class="pubg-main-btn" type="button">بوت سحب رقم من اليوزر ب20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بوت سحب رقم من اليوزر ب20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بوت سحب رقم من اليوزر ب20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بوت سحب محدثات الشخص ب20ج">
            <button class="pubg-main-btn" type="button">بوت سحب محدثات الشخص ب20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بوت سحب محدثات الشخص ب20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بوت سحب محدثات الشخص ب20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="100نجمه تلي ب70ج">
            <button class="pubg-main-btn" type="button">100نجمه تلي ب70ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="100نجمه تلي ب70ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="100نجمه تلي ب70ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="اشتراك مميز شهر ب200ج">
            <button class="pubg-main-btn" type="button">اشتراك مميز شهر ب200ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="اشتراك مميز شهر ب200ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="اشتراك مميز شهر ب200ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="موظف سحب داتا ب10ج">
            <button class="pubg-main-btn" type="button">موظف سحب داتا ب10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="موظف سحب داتا ب10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="موظف سحب داتا ب10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="موظف سحب داتا — 10ج">
            <button class="pubg-main-btn" type="button">موظف سحب داتا — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="موظف سحب داتا — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="موظف سحب داتا — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item=".طريقة حرق جوجل — 20ج">
            <button class="pubg-main-btn" type="button">.طريقة حرق جوجل — 20ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item=".طريقة حرق جوجل — 20ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item=".طريقة حرق جوجل — 20ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="مواقع دارك ويب — 15ج">
            <button class="pubg-main-btn" type="button">مواقع دارك ويب — 15ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="مواقع دارك ويب — 15ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="مواقع دارك ويب — 15ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="سدادات انف للسباحه — ؟ج">
            <button class="pubg-main-btn" type="button">سدادات انف للسباحه — ؟ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="سدادات انف للسباحه — ؟ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="سدادات انف للسباحه — ؟ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="توثيق منصه بايبت — 100ج">
            <button class="pubg-main-btn" type="button">توثيق منصه بايبت — 100ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="توثيق منصه بايبت — 100ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="توثيق منصه بايبت — 100ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="طريقة تثبيت اي حاجه اندرويد 15 — 10ج">
            <button class="pubg-main-btn" type="button">طريقة تثبيت اي حاجه اندرويد 15 — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقة تثبيت اي حاجه اندرويد 15 — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقة تثبيت اي حاجه اندرويد 15 — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="اشتراك كانفا شهر — 40ج">
            <button class="pubg-main-btn" type="button">اشتراك كانفا شهر — 40ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="اشتراك كانفا شهر — 40ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="اشتراك كانفا شهر — 40ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="سحب بطايق — 100ج">
            <button class="pubg-main-btn" type="button">سحب بطايق — 100ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="سحب بطايق — 100ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="سحب بطايق — 100ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="نسخ عكس — 15ج">
            <button class="pubg-main-btn" type="button">نسخ عكس — 15ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="نسخ عكس — 15ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="نسخ عكس — 15ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بوت كراش — 10ج">
            <button class="pubg-main-btn" type="button">بوت كراش — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بوت كراش — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بوت كراش — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item=". تعزيزات — 100ج">
            <button class="pubg-main-btn" type="button">. تعزيزات — 100ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item=". تعزيزات — 100ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item=". تعزيزات — 100ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="طريقة رشق متابعين — ؟ج">
            <button class="pubg-main-btn" type="button">طريقة رشق متابعين — ؟ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقة رشق متابعين — ؟ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقة رشق متابعين — ؟ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بوتات اختراق — 10ج">
            <button class="pubg-main-btn" type="button">بوتات اختراق — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بوتات اختراق — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بوتات اختراق — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="مكنه حلاقه VGR — 600ج">
            <button class="pubg-main-btn" type="button">مكنه حلاقه VGR — 600ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="مكنه حلاقه VGR — 600ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="مكنه حلاقه VGR — 600ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="كتاب ارض زيكولا — 120ج">
            <button class="pubg-main-btn" type="button">كتاب ارض زيكولا — 120ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="كتاب ارض زيكولا — 120ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="كتاب ارض زيكولا — 120ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="100 بوت مجال — 10ج">
            <button class="pubg-main-btn" type="button">100 بوت مجال — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="100 بوت مجال — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="100 بوت مجال — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="طريقة عمل أكتر من جميل — 10ج">
            <button class="pubg-main-btn" type="button">طريقة عمل أكتر من جميل — 10ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="طريقة عمل أكتر من جميل — 10ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="طريقة عمل أكتر من جميل — 10ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    `;

    // Back button
    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    // Discount logo button
    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    // Contact buttons
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".contact-btn");
      if (!btn) return;
      const platform = btn.getAttribute("data-platform");
      const item = btn.getAttribute("data-item") || "";

      let message = item;
      const now = Date.now();
      if (
        wrapper.discountCode &&
        wrapper.discountExpiresAt &&
        wrapper.discountExpiresAt > now
      ) {
        message +=
          "\n\nلقد تم حصولي علي عرض ال 10%\n" +
          "كود الخصم الذي حصلت عليه: " +
          wrapper.discountCode +
          "\n" +
          "والان سوف اقوم بأرسال اسكرين اثبات للحصول علي كود الخصم";
      }

      openContact(platform, message);
    });

    // Typing animation text under logo image
    const typingEl = wrapper.querySelector(".pubg-typing-text");
    if (typingEl) {
      const baseText =
        "اهلا بك في قسم طرق الثغرات وعالم الخصومات\nKAPOO STORE";
      const dotChar = ".";
      let index = 0;
      let isDeleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 80;
      const PAUSE_AT_END = 1200;
      const PAUSE_AT_START = 600;

      const tick = () => {
        if (!isDeleting) {
          if (index < baseText.length) {
            index++;
          } else {
            isDeleting = true;
            setTimeout(tick, PAUSE_AT_END);
            typingEl.textContent = baseText.slice(0, index) + dotChar;
            return;
          }
        } else {
          if (index > 0) {
            index--;
          } else {
            isDeleting = false;
            setTimeout(tick, PAUSE_AT_START);
            typingEl.textContent = dotChar;
            return;
          }
        }

        typingEl.textContent = baseText.slice(0, index) + dotChar;

        const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        setTimeout(tick, delay);
      };

      typingEl.textContent = dotChar;
      setTimeout(tick, PAUSE_AT_START);
    }

    // Search behavior: move matched item to top and glow while typing
    const searchInput = wrapper.querySelector(".pubg-search-input");
    const sectionMain = wrapper.querySelector(".section-main");
    const pubgGrid = wrapper.querySelector(".pubg-grid");
    const searchBox = wrapper.querySelector(".pubg-search-box");

    if (searchInput && sectionMain && pubgGrid) {
      const updateSearchGlow = () => {
        if (!searchBox) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
          searchBox.classList.add("active");
        } else {
          searchBox.classList.remove("active");
        }
      };

      const runSearch = () => {
        const query = searchInput.value;
        const items = Array.from(pubgGrid.querySelectorAll(".pubg-item"));

        if (!query) {
          updateSearchGlow();
          return;
        }

        const match = items.find((el) => {
          const text = (el.getAttribute("data-item") || "").toLowerCase();
          return text.includes(query.toLowerCase());
        });

        if (match) {
          pubgGrid.prepend(match);
          sectionMain.scrollTop = 0;
        }

        updateSearchGlow();
      };

      searchInput.addEventListener("focus", updateSearchGlow);
      searchInput.addEventListener("blur", updateSearchGlow);
      searchInput.addEventListener("input", runSearch);
      searchInput.addEventListener("keyup", runSearch);

      updateSearchGlow();
    }

    // نوع القسم للخصومات
    wrapper.dataset.sectionType = "methods";

    return wrapper;
  }

  function createFreefireSection() {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page freefire-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">قسم فري فاير</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="pubg-search-wrapper">
          <div class="pubg-search-box">
            <input
              type="text"
              class="pubg-search-input"
              placeholder="ابحث عن عنصر داخل القسم..."
            />
          </div>
        </div>
        <div class="pubg-banner">
          <img src="./483528c77a19be6735661c5f68a749ea.jpg" alt="صورة فري فاير" class="pubg-banner-img" />
        </div>
        <div class="pubg-typing-wrapper">
          <span class="pubg-typing-text"></span>
        </div>
        <div class="pubg-grid">
          <div class="pubg-item" data-item="عضويه اسبوعيه ب70ج">
            <button class="pubg-main-btn" type="button">عضويه اسبوعيه ب70ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="عضويه اسبوعيه ب70ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="عضويه اسبوعيه ب70ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="عضويه شهريه ب350ج">
            <button class="pubg-main-btn" type="button">عضويه شهريه ب350ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="عضويه شهريه ب350ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="عضويه شهريه ب350ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>

          <div class="pubg-item" data-item="بويا باس ب60ج">
            <button class="pubg-main-btn" type="button">بويا باس ب60ج</button>
            <div class="pubg-actions">
              <button class="contact-btn whatsapp-btn" type="button" data-platform="whatsapp" data-item="بويا باس ب60ج">
                <span class="contact-icon contact-icon-wa"></span>
                <span>تواصل واتساب</span>
              </button>
              <button class="contact-btn telegram-btn" type="button" data-platform="telegram" data-item="بويا باس ب60ج">
                <span class="contact-icon contact-icon-tg"></span>
                <span>تواصل تليجرام</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    `;

    // Back button
    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    // Discount logo button
    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    // Contact buttons
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".contact-btn");
      if (!btn) return;
      const platform = btn.getAttribute("data-platform");
      const item = btn.getAttribute("data-item") || "";

      let message = item;
      const now = Date.now();
      if (
        wrapper.discountCode &&
        wrapper.discountExpiresAt &&
        wrapper.discountExpiresAt > now
      ) {
        message +=
          "\n\nلقد تم حصولي علي عرض ال 10%\n" +
          "كود الخصم الذي حصلت عليه: " +
          wrapper.discountCode +
          "\n" +
          "والان سوف اقوم بأرسال اسكرين اثبات للحصول علي كود الخصم";
      }

      openContact(platform, message);
    });

    // Typing animation text under Free Fire image
    const typingEl = wrapper.querySelector(".pubg-typing-text");
    if (typingEl) {
      const baseText =
        "اهلا بكم في عالم فري فاير وعالم الخصومات\nKAPOO STORE";
      const dotChar = ".";
      let index = 0;
      let isDeleting = false;

      const TYPE_SPEED = 120;
      const DELETE_SPEED = 80;
      const PAUSE_AT_END = 1200;
      const PAUSE_AT_START = 600;

      const tick = () => {
        if (!isDeleting) {
          if (index < baseText.length) {
            index++;
          } else {
            isDeleting = true;
            setTimeout(tick, PAUSE_AT_END);
            typingEl.textContent = baseText.slice(0, index) + dotChar;
            return;
          }
        } else {
          if (index > 0) {
            index--;
          } else {
            isDeleting = false;
            setTimeout(tick, PAUSE_AT_START);
            typingEl.textContent = dotChar;
            return;
          }
        }

        typingEl.textContent = baseText.slice(0, index) + dotChar;

        const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        setTimeout(tick, delay);
      };

      // start animation
      typingEl.textContent = dotChar;
      setTimeout(tick, PAUSE_AT_START);
    }

    // Search behavior: move matched item to top
    const searchInput = wrapper.querySelector(".pubg-search-input");
    const sectionMain = wrapper.querySelector(".section-main");
    const pubgGrid = wrapper.querySelector(".pubg-grid");
    const searchBox = wrapper.querySelector(".pubg-search-box");

    if (searchInput && sectionMain && pubgGrid) {
      const updateSearchGlow = () => {
        if (!searchBox) return;
        if (document.activeElement === searchInput || searchInput.value.trim() !== "") {
          searchBox.classList.add("active");
        } else {
          searchBox.classList.remove("active");
        }
      };

      const runSearch = () => {
        const query = searchInput.value;
        const items = Array.from(pubgGrid.querySelectorAll(".pubg-item"));

        if (!query) {
          updateSearchGlow();
          return;
        }

        const match = items.find((el) => {
          const text = (el.getAttribute("data-item") || "").toLowerCase();
          return text.includes(query.toLowerCase());
        });

        if (match) {
          pubgGrid.prepend(match);
          sectionMain.scrollTop = 0;
        }

        updateSearchGlow();
      };

      searchInput.addEventListener("focus", updateSearchGlow);
      searchInput.addEventListener("blur", updateSearchGlow);
      searchInput.addEventListener("input", runSearch);
      searchInput.addEventListener("keyup", runSearch);

      updateSearchGlow();
    }

    // نوع القسم للخصومات
    wrapper.dataset.sectionType = "freefire";

    return wrapper;
  }

  function createEmptySection(title) {
    const wrapper = document.createElement("div");
    wrapper.className = "section-page";

    wrapper.innerHTML = `
      <header class="section-header">
        <button class="back-btn" type="button">رجوع</button>
        <div class="page-title">${title}</div>
        <div class="discount-timer-bar" hidden></div>
        <button class="discount-logo-btn" type="button" aria-label="خصومات"></button>
      </header>
      <main class="section-main">
        <div class="empty-section-text">المحتوى قيد الإعداد</div>
      </main>
    `;

    wrapper.querySelector(".back-btn").addEventListener("click", () => {
      if (wrapper.discountTimerInterval) {
        clearInterval(wrapper.discountTimerInterval);
      }
      wrapper.remove();
    });

    const discountBtn = wrapper.querySelector(".discount-logo-btn");
    if (discountBtn) {
      discountBtn.addEventListener("click", () => {
        showDiscountModal(wrapper);
      });
    }

    return wrapper;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const labelEl = btn.querySelector(".category-label");
      const labelText = labelEl ? labelEl.textContent.trim() : "قسم";

      // Remove any existing section page
      const existing = document.querySelector(".section-page");
      if (existing) existing.remove();

      let sectionWrapper;
      if (labelText.includes("ببجي")) {
        sectionWrapper = createPubgSection();
      } else if (labelText.includes("فري فاير")) {
        sectionWrapper = createFreefireSection();
      } else if (labelText.includes("الشحن")) {
        sectionWrapper = createChargingSection();
      } else if (labelText.includes("تصميم")) {
        sectionWrapper = createDesignSection();
      } else if (labelText.includes("طرق ثغرات")) {
        sectionWrapper = createMethodsSection();
      } else {
        sectionWrapper = createEmptySection(labelText);
      }

      document.body.appendChild(sectionWrapper);
    });
  });
});