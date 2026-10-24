(() => {
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(3, "0");

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

  // ── gallery ──────────────────────────────────────────────────
  let items = [], view = [], current = -1;
  const grid = $("grid"), count = $("count"), empty = $("empty");
  const sel = { style: $("fStyle"), effect: $("fEffect"), palette: $("fPalette") };

  const fillOptions = (key) => {
    const vals = [...new Set(items.map((i) => i[key]))].sort();
    vals.forEach((v) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = `${v} (${items.filter((i) => i[key] === v).length})`;
      sel[key].appendChild(o);
    });
  };

  const render = () => {
    const f = Object.fromEntries(Object.entries(sel).map(([k, el]) => [k, el.value]));
    view = items.filter((i) => Object.entries(f).every(([k, v]) => !v || i[k] === v));
    grid.textContent = "";
    const frag = document.createDocumentFragment();
    view.forEach((it, idx) => {
      const b = document.createElement("button");
      b.className = "tile"; b.type = "button";
      b.setAttribute("aria-label", `Open etching ${it.id}`);
      b.dataset.idx = idx;
      b.innerHTML = `<img loading="lazy" decoding="async" width="400" height="400" alt=""><span>#${pad(it.id)}</span>`;
      b.firstChild.src = `/img/${it.id}.jpg`;
      b.firstChild.alt = `Etching ${it.id}: ${it.style}, ${it.palette}`;
      frag.appendChild(b);
    });
    grid.appendChild(frag);
    count.textContent = `${view.length} of ${items.length} etchings`;
    empty.hidden = view.length > 0;
  };

  // lightbox
  const lb = $("lightbox");
  const show = (idx) => {
    if (!view.length) return;
    current = (idx + view.length) % view.length;
    const it = view[current];
    const img = $("lbImg");
    img.src = `/img/${it.id}.jpg`;
    img.alt = `Etching ${it.id}: ${it.style}, ${it.palette}, ${it.effect}`;
    $("lbTitle").textContent = `#${pad(it.id)}`;
    $("lbTraits").textContent = `${it.style} · ${it.effect} · ${it.palette}`;
    history.replaceState(null, "", `#${it.id}`);
  };
  const open = (idx) => { show(idx); if (!lb.open) lb.showModal(); };
  const close = () => { if (lb.open) lb.close(); };
  lb.addEventListener("close", () => history.replaceState(null, "", location.pathname + "#gallery"));
  grid.addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (t) open(Number(t.dataset.idx));
  });
  $("lbClose").onclick = close;
  $("lbPrev").onclick = () => show(current - 1);
  $("lbNext").onclick = () => show(current + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  $("reset").onclick = () => { Object.values(sel).forEach((s) => (s.value = "")); render(); };
  Object.values(sel).forEach((s) => s.addEventListener("change", render));

  // ── load data ────────────────────────────────────────────────
  fetch("/data.json")
    .then((r) => r.json())
    .then((data) => {
      items = data;
      Object.keys(sel).forEach(fillOptions);
      render();

      // hero strip: a spread of pieces, doubled for a seamless loop
      const track = $("stripTrack");
      const pick = items.filter((_, i) => i % 9 === 0).slice(0, 24);
      [...pick, ...pick].forEach((it) => {
        const im = document.createElement("img");
        im.src = `/img/${it.id}.jpg`; im.alt = ""; im.width = 96; im.height = 96; im.loading = "lazy";
        track.appendChild(im);
      });

      // deep link: /#42 opens piece 42
      const m = location.hash.match(/^#(\d{1,3})$/);
      if (m) {
        const idx = view.findIndex((i) => i.id === Number(m[1]));
        if (idx >= 0) open(idx);
      }
    })
    .catch(() => { count.textContent = "Could not load the collection. Please refresh."; });
})();
