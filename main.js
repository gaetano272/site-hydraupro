/* =========================================================================
   HYDRAUPRO – main.js (commun à toutes les pages)
   - Burger / nav responsive
   - Sous-menus (desktop + mobile)
   - Fermeture au clic sur lien / resize
   - Année dynamique footer (.js-year)
   - Scroll doux (respecte prefers-reduced-motion)
   - Animations reveal (IntersectionObserver)
   - Aperçu PDF (dialog#newsPreviewDialog sur actualites.html)
   - Bandeau cookies : window.showCookieBanner()
   ======================================================================== */

(function () {
  "use strict";

  // Utilitaires
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on  = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     MENU BURGER / NAV MOBILE
     ========================= */
  const burger = qs(".burger");
  const nav    = qs("nav ul");             // <ul class="main-nav">
  const body   = document.body;

  const openNav  = () => {
    burger?.classList.add("active");
    nav?.classList.add("open");
    body.classList.add("no-scroll");
    burger?.setAttribute("aria-expanded", "true");
  };
  const closeNav = () => {
    burger?.classList.remove("active");
    nav?.classList.remove("open");
    body.classList.remove("no-scroll");
    burger?.setAttribute("aria-expanded", "false");
  };

  on(burger, "click", () => {
    if (!nav) return;
    const isOpen = nav.classList.contains("open");
    isOpen ? closeNav() : openNav();
  });

  // Fermer le menu quand on clique sur un lien (mobile)
  qsa("nav a").forEach(a => on(a, "click", closeNav));

  // Fermer le menu si on repasse en large écran
  let lastWidth = window.innerWidth;
  on(window, "resize", () => {
    // Si on agrandit, on nettoie l'état mobile
    if (window.innerWidth > 992 && lastWidth <= 992) {
      closeNav();
      // Ferme aussi les sous-menus mobiles
      qsa(".has-dropdown.open-sub").forEach(li => li.classList.remove("open-sub"));
    }
    lastWidth = window.innerWidth;
  });

  /* ========================
     SOUS-MENUS (dropdowns)
     ======================== */
  // Desktop : ouverture au survol via le CSS.
  // Mobile : on transforme le lien parent en toggle.
  qsa(".has-dropdown > a").forEach(parentLink => {
    on(parentLink, "click", (e) => {
      // En mobile uniquement
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const li = parentLink.parentElement;
        li.classList.toggle("open-sub");
      }
    });
  });

  /* ============================
     ANNÉE DYNAMIQUE DANS FOOTER
     ============================ */
  // Utiliser <span class="js-year"></span> dans le footer
  const year = String(new Date().getFullYear());
  qsa(".js-year").forEach(span => (span.textContent = year));
  // Compat ascendante si tu as gardé #year (optionnel)
  const legacyYear = qs("#year");
  if (legacyYear) legacyYear.textContent = (legacyYear.textContent || "") + year;

  /* ======================
     SCROLL DOUX INTERNE
     ====================== */
  qsa('a[href^="#"]').forEach(link => {
    on(link, "click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      if (prefersReduced) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Ferme le menu mobile après navigation interne
      closeNav();
    });
  });

  /* =======================
     ANIMATIONS "REVEAL"
     ======================= */
  const revealEls = qsa(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback (sans IO)
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ==========================
     APERÇU PDF (Actualités)
     ========================== */
  // Fonctionne si un <dialog id="newsPreviewDialog"><iframe></iframe></dialog> est présent
  const previewDialog = qs("#newsPreviewDialog");
  const previewIframe = previewDialog ? qs("iframe", previewDialog) : null;

  if (previewDialog && previewIframe) {
    // Ouvrir au clic sur un bouton .js-preview
    on(document, "click", (e) => {
      const btn = e.target.closest(".js-preview");
      if (!btn) return;

      const src = btn.getAttribute("data-src");
      if (!src) return;

      // Ajoute des params d’affichage minimal si non fournis
      const url = src.includes("#") ? src : `${src}#view=FitH&toolbar=0`;
      previewIframe.src = url;
      previewDialog.showModal();
    });

    // Fermer en cliquant hors du contenu
    on(previewDialog, "click", (e) => {
      if (e.target === previewDialog) previewDialog.close();
    });

    // Fermer via ESC
    on(window, "keydown", (e) => {
      if (e.key === "Escape" && previewDialog.open) previewDialog.close();
    });
  }

  /* ===================================
     BANDEAU COOKIES – lien "Revoir mes choix"
     =================================== */
  // Le footer appelle showCookieBanner() ; on le fournit ici en global.
  window.showCookieBanner = function () {
    const banner = qs("#cookieBanner");
    if (!banner) return;
    banner.classList.add("show");
  };

})();
(function(){
  "use strict";
  const qs  = (s,ctx=document)=>ctx.querySelector(s);
  const qsa = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
  const on  = (el,ev,fn)=>el&&el.addEventListener(ev,fn);

  const burger = qs('.burger');
  const nav    = qs('#mainMenu');
  const body   = document.body;

  function openNav(){
    burger?.classList.add('active');
    nav?.classList.add('open');
    body.classList.add('no-scroll');
    burger?.setAttribute('aria-expanded','true');
  }
  function closeNav(){
    burger?.classList.remove('active');
    nav?.classList.remove('open');
    body.classList.remove('no-scroll');
    burger?.setAttribute('aria-expanded','false');
  }

  on(burger,'click',()=>{
    if(!nav) return;
    (nav.classList.contains('open') ? closeNav() : openNav());
  });

  // Ferme au clic sur un lien (mobile)
  qsa('#mainMenu a').forEach(a=>on(a,'click',closeNav));

  // Ferme si on repasse au-dessus du breakpoint
  let w = window.innerWidth;
  on(window,'resize',()=>{
    if(window.innerWidth>860 && w<=860){ closeNav(); }
    w = window.innerWidth;
  });

  // Sous-menus en mobile (toggle)
  qsa('.has-dropdown > a').forEach(link=>{
    on(link,'click',(e)=>{
      if(window.innerWidth<=860){
        e.preventDefault();
        link.parentElement.classList.toggle('open-sub');
      }
    });
  });

  // Aperçu PDF (si présent sur la page actualités)
  const dlg = qs('#newsPreviewDialog');
  const iframe = dlg? qs('iframe', dlg): null;
  if(dlg && iframe){
    on(document,'click',(e)=>{
      const btn = e.target.closest('.js-preview');
      if(!btn) return;
      const src = btn.getAttribute('data-src'); if(!src) return;
      iframe.src = src.includes('#') ? src : (src + '#view=FitH&toolbar=0');
      dlg.showModal();
    });
    on(dlg,'click',(e)=>{ if(e.target===dlg) dlg.close(); });
    on(window,'keydown',(e)=>{ if(e.key==='Escape' && dlg.open) dlg.close(); });
  }
})();
