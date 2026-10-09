/* =========================================================
   CONFIGURAÇÃO — cole aqui os links do seu checkout
   (Hotmart, Kiwify, Eduzz, Perfect Pay, etc.)
   ========================================================= */
const CHECKOUT_LINKS = {
  basico: "https://pay.cakto.com.br/bdcxgwr_1181819",   // ex.: "https://pay.kiwify.com.br/SEU-LINK-BASICO"
  premium: "https://pay.cakto.com.br/3e5s2qg_1181803",  // ex.: "https://pay.kiwify.com.br/SEU-LINK-PREMIUM"
};

document.addEventListener("DOMContentLoaded", () => {
  // Aplica os links de checkout nos botões de compra
  document.querySelectorAll("[data-checkout]").forEach((btn) => {
    const link = CHECKOUT_LINKS[btn.dataset.checkout];
    if (link && link !== "#") {
      btn.href = link;
      btn.target = "_blank";
      btn.rel = "noopener";
    } else {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Link de compra ainda não configurado. Edite CHECKOUT_LINKS em script.js.");
      });
    }
  });

  // Sombra no header ao rolar
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Botão fixo no rodapé (celular): aparece quando o botão do topo sai da tela
  // e some enquanto os cards de preço estão visíveis (para não ficar repetido).
  const sticky = document.getElementById("sticky-cta");
  const heroCta = document.getElementById("hero-cta");
  const offer = document.getElementById("oferta");
  if ("IntersectionObserver" in window) {
    let heroVisible = true, offerVisible = false;
    const update = () => {
      const show = !heroVisible && !offerVisible;
      sticky.classList.toggle("show", show);
      document.body.classList.toggle("has-sticky", show);
    };
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }).observe(heroCta);
    new IntersectionObserver(([e]) => { offerVisible = e.isIntersecting; update(); }, { threshold: 0.15 }).observe(offer);
  } else {
    sticky.classList.add("show");
  }

  // Animação leve ao rolar (substitui a biblioteca AOS, que era um arquivo a mais para baixar)
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  // FAQ: mantém apenas um item aberto por vez
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  initGallery();

  // Ano no rodapé
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* =========================================================
   GALERIA "O KIT POR DENTRO"
   Mostra só as páginas que existem em assets/paginas/.
   Se nenhuma existir, a seção continua oculta.
   ========================================================= */
function initGallery() {
  const section = document.getElementById("por-dentro");
  const items = [...document.querySelectorAll(".gallery__item")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!section || !items.length) return;

  items.forEach((item, i) => {
    const probe = new Image();
    probe.onload = () => {
      const img = document.createElement("img");
      img.src = item.dataset.src;
      img.alt = `Página ${i + 1} do kit`;
      img.loading = "lazy";
      img.decoding = "async";
      item.appendChild(img);
      item.classList.add("is-ready");
      section.hidden = false;
    };
    probe.onerror = () => item.remove();
    probe.src = item.dataset.src;

    item.addEventListener("click", () => {
      lightboxImg.src = item.dataset.src;
      lightboxImg.alt = `Página ${i + 1} do kit`;
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else window.open(item.dataset.src, "_blank");
    });
  });

  // Fecha ao clicar no X ou fora da imagem
  document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
}
