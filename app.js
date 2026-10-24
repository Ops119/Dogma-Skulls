(() => {
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);

  // ── text from config ─────────────────────────────────────────
  document.querySelectorAll("[data-site]").forEach((el) => {
    const v = S[el.dataset.site];
    if (v) el.textContent = v;
  });
  $("statSupply").textContent = S.supply || 221;
  $("year").textContent = new Date().getFullYear();

  // ── mint section ─────────────────────────────────────────────
  $("mintDate").textContent = S.mintDate ? S.mintDate : "The gates open soon. Date to be announced.";

  const mintBtn = $("mintBtn");
  const setBtn = (btn, text, href, disabled) => {
    btn.textContent = text;
    btn.href = href || "#mint";
    if (href && /^https?:/.test(href)) { btn.target = "_blank"; btn.rel = "noopener noreferrer"; }
    if (disabled) { btn.setAttribute("aria-disabled", "true"); btn.tabIndex = -1; }
  };
  if (S.status === "live" && S.mintUrl) {
    setBtn(mintBtn, "Mint now", S.mintUrl);
  } else if (S.status === "ended") {
    setBtn(mintBtn, "Mint closed", S.marketplaceUrl, !S.marketplaceUrl);
    if (S.marketplaceUrl) mintBtn.textContent = "View on marketplace";
  } else {
    setBtn(mintBtn, "Mint opens soon", "#", true);
  }
  if (S.allowlistUrl) {
    const a = $("allowBtn");
    a.href = S.allowlistUrl; a.hidden = false;
    a.target = "_blank"; a.rel = "noopener noreferrer";
  }
  if (S.discordUrl) {
    const dbtn = $("discordBtn");
    dbtn.href = S.discordUrl; dbtn.hidden = false;
    dbtn.target = "_blank"; dbtn.rel = "noopener noreferrer";
  }
  if (S.xChatUrl) {
    const xb = $("xChatBtn");
    xb.href = S.xChatUrl; xb.hidden = false;
    xb.target = "_blank"; xb.rel = "noopener noreferrer";
  }
  if (S.telegramUrl) {
    const tbtn = $("telegramBtn");
    tbtn.href = S.telegramUrl; tbtn.hidden = false;
    tbtn.target = "_blank"; tbtn.rel = "noopener noreferrer";
  }
  if (S.marketplaceUrl) {
    $("faqMarket").textContent = "On the secondary market — see the marketplace link in the footer.";
  }

  // 1/1
  const one = S.oneOfOne || {};
  $("oneNote").textContent = one.note || "";
  if (one.url) {
    const b = $("oneBtn");
    b.href = one.url; b.hidden = false; b.target = "_blank"; b.rel = "noopener noreferrer";
    b.textContent = one.state === "sold" ? "See the sale" : "View the Prime Skull";
  }

  // footer links
  const links = $("links");
  [["X", S.xUrl], ["Discord", S.discordUrl], ["Telegram", S.telegramUrl], ["X Chat", S.xChatUrl], ["Marketplace", S.marketplaceUrl]].forEach(([t, u]) => {
    if (!u) return;
    const a = document.createElement("a");
    a.href = u; a.textContent = t; a.target = "_blank"; a.rel = "noopener noreferrer";
    links.appendChild(a);
  });
})();
