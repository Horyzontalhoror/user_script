// ==UserScript==
// @name         Vidsrc+
// @namespace    https://vidsrc.xyz/
// @version      3.7
// @description  Full control UI (jump, autoplay, autonext, subtitle, server switch) for vidsrc.xyz, vidsrc.to, vidsrc-embed.ru, vidfast.pro, and godriveplayer embeds.
// @author       Doby_Don
// @match        *://vidsrc.to/*
// @match        *://vidsrc-embed.ru/embed/tv?*
// @match        *://vidsrc-embed.ru/embed/tv/*
// @match        *://vidfast.pro/*
// @match        *://godriveplayer.com/*
// @grant        none
// @icon         data:image/png;base64,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
// ==/UserScript==

(function () {
  'use strict';

  const url = new URL(window.location.href);
  const imdb = url.searchParams.get("imdb") || (url.pathname.match(/tt\d+/) || [])[0] || "";
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const pathSeason = Number.parseInt(pathSegments[pathSegments.length - 2], 10);
  const pathEpisode = Number.parseInt(pathSegments[pathSegments.length - 1], 10);
  let season = Number.parseInt(url.searchParams.get("season"), 10);
  let episode = Number.parseInt(url.searchParams.get("episode"), 10);
  if (Number.isNaN(season)) season = Number.isNaN(pathSeason) ? 1 : pathSeason;
  if (Number.isNaN(episode)) episode = Number.isNaN(pathEpisode) ? 1 : pathEpisode;

  let isAutoplay = url.searchParams.get("autoplay") === "1";
  let isAutonext = url.searchParams.get("autonext") === "1";
  let isSubtitle = url.searchParams.get("ds_lang") === "en";

  const DEFAULT_FORMATS = {
    "vidsrc.xyz": "query",
    "vidsrc-embed.ru": "path",
    "vidsrc.to": "path",
    "vidfast.pro": "path",
    "godriveplayer.com": "query"
  };

  const formatPreference = { ...DEFAULT_FORMATS };
  const currentHost = normalizeHost(window.location.hostname);
  formatPreference[currentHost] = detectFormatFromUrl(url, pathSegments);

  const SERVERS = {
    "vidsrc.xyz": "https://vidsrc.xyz/embed/tv",
    "vidsrc-embed.ru": "https://vidsrc-embed.ru/embed/tv",
    "vidsrc.to": "https://vidsrc.to/embed/tv",
    "vidfast.pro": "https://vidfast.pro/tv",
    "godriveplayer.com": "https://godriveplayer.com/player.php"
  };

  function detectBase() {
    const host = window.location.hostname;
    if (host.includes("vidsrc.to")) return SERVERS["vidsrc.to"];
    if (host.includes("vidsrc-embed.ru")) return SERVERS["vidsrc-embed.ru"];
    if (host.includes("vidfast.pro")) return SERVERS["vidfast.pro"];
    if (host.includes("godriveplayer.com")) return SERVERS["godriveplayer.com"];
    return SERVERS["vidsrc.xyz"];
  }

  function normalizeHost(host) {
    return host.replace(/^www\./, "");
  }

  function detectFormatFromUrl(urlObj, segments) {
    const ttIndex = segments.findIndex((segment) => /^tt\d+$/.test(segment));
    if (ttIndex !== -1 && segments.length > ttIndex + 2) {
      return "path";
    }
    if (urlObj.searchParams.has("imdb") && urlObj.searchParams.has("season") && urlObj.searchParams.has("episode")) {
      return "query";
    }
    return DEFAULT_FORMATS[normalizeHost(urlObj.hostname)] || "query";
  }

  let base = detectBase();

  // 🔗 Build URL sesuai domain
  function buildUrl(s, e, targetBase = base) {
    const targetHost = normalizeHost(new URL(targetBase).hostname);
    const preferredFormat = formatPreference[targetHost] || DEFAULT_FORMATS[targetHost] || "query";
    const canUsePath = preferredFormat === "path" && imdb;

    const params = new URLSearchParams({
      imdb: imdb,
      season: s,
      episode: e,
    });
    if (isAutoplay) params.set("autoplay", "1");
    if (isAutonext) params.set("autonext", "1");
    if (isSubtitle) params.set("ds_lang", "en");

    if (targetBase.includes("player.php") || !canUsePath) {
      return `${targetBase}?${params.toString()}`;
    }

    const sanitizedBase = targetBase.replace(/\/+$/, "");
    const queryString = params.get("autoplay") || params.get("autonext") || params.get("ds_lang")
      ? (() => {
          const extras = new URLSearchParams();
          if (isAutoplay) extras.set("autoplay", "1");
          if (isAutonext) extras.set("autonext", "1");
          if (isSubtitle) extras.set("ds_lang", "en");
          const result = extras.toString();
          return result ? `?${result}` : "";
        })()
      : "";
    return `${sanitizedBase}/${imdb}/${s}/${e}${queryString}`;
  }

  function changeEpisode(newSeason, newEpisode) {
    window.location.href = buildUrl(newSeason, newEpisode);
  }

  function nextEpisode() { changeEpisode(season, episode + 1); }
  function prevEpisode() {
    if (episode > 1) changeEpisode(season, episode - 1);
    else if (season > 1) changeEpisode(season - 1, 1);
  }
  function nextSeason() { changeEpisode(season + 1, 1); }

  function updateUrlParam(key, value) {
    const newUrl = new URL(window.location.href);
    if (value === null) newUrl.searchParams.delete(key);
    else newUrl.searchParams.set(key, value);
    window.history.replaceState({}, "", newUrl.toString());
  }

  // 🧩 UI Kontrol
  function createControls() {
    const panel = document.createElement("div");
    Object.assign(panel.style, {
      position: "fixed",
      top: "40px",
      right: "10px",
      zIndex: "9999",
      background: "rgba(0,0,0,0.8)",
      color: "#fff",
      padding: "10px",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "Arial",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      backdropFilter: "blur(3px)"
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "👁️ Hide UI";
    Object.assign(toggleBtn.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      zIndex: "10000",
      padding: "5px 10px",
      background: "#444",
      color: "#fff",
      border: "1px solid #888",
      borderRadius: "4px",
      cursor: "pointer"
    });

    let isVisible = true;
    toggleBtn.onclick = () => {
      isVisible = !isVisible;
      panel.style.display = isVisible ? "flex" : "none";
      toggleBtn.textContent = isVisible ? "👁️ Hide UI" : "👁️ Show UI";
    };

    const info = document.createElement("div");
    info.textContent = `S${season}E${episode}`;
    info.style.marginBottom = "5px";

    const basicControls = document.createElement("div");
    Object.assign(basicControls.style, { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" });
    basicControls.append(createBtn("⏮️ Prev", prevEpisode), createBtn("⏭️ Next", nextEpisode));

    const advToggle = createBtn("⚙️ Advanced ▼");
    const advBox = document.createElement("div");
    Object.assign(advBox.style, {
      display: "none",
      flexDirection: "column",
      gap: "8px",
      marginTop: "8px",
      borderTop: "1px solid #666",
      paddingTop: "6px"
    });

    let advVisible = localStorage.getItem("vidsrc_adv_visible") === "true";
    if (advVisible) {
      advBox.style.display = "flex";
      advToggle.textContent = "⚙️ Hide ▲";
    }

    advToggle.onclick = () => {
      advVisible = advBox.style.display === "none";
      advBox.style.display = advVisible ? "flex" : "none";
      advToggle.textContent = advVisible ? "⚙️ Hide ▲" : "⚙️ Advanced ▼";
      localStorage.setItem("vidsrc_adv_visible", advVisible);
    };

    // Server Switch Dropdown
    const serverBox = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = "🌐 Server: ";
    const select = document.createElement("select");
    Object.assign(select.style, {
      background: "#111",
      color: "#fff",
      border: "1px solid #555",
      padding: "4px",
      borderRadius: "4px"
    });

    for (const name in SERVERS) {
      const opt = document.createElement("option");
      opt.value = SERVERS[name];
      opt.textContent = name;
      if (base === SERVERS[name]) opt.selected = true;
      select.append(opt);
    }

    select.onchange = () => {
      const newBase = select.value;
      window.location.href = buildUrl(season, episode, newBase);
    };

    serverBox.append(label, select);
    serverBox.style.marginBottom = "8px";

    const toggleOptions = document.createElement("div");
    Object.assign(toggleOptions.style, { display: "flex", gap: "6px", flexWrap: "wrap" });
    const autoplayBtn = createBtn(`🔁 Autoplay: ${isAutoplay ? "ON" : "OFF"}`, () => {
      isAutoplay = !isAutoplay;
      autoplayBtn.textContent = `🔁 Autoplay: ${isAutoplay ? "ON" : "OFF"}`;
      updateUrlParam("autoplay", isAutoplay ? "1" : null);
    });
    const autonextBtn = createBtn(`⏩ Autonext: ${isAutonext ? "ON" : "OFF"}`, () => {
      isAutonext = !isAutonext;
      autonextBtn.textContent = `⏩ Autonext: ${isAutonext ? "ON" : "OFF"}`;
      updateUrlParam("autonext", isAutonext ? "1" : null);
    });
    const subtitleBtn = createBtn(`🌐 Subtitle: ${isSubtitle ? "ON" : "OFF"}`, () => {
      isSubtitle = !isSubtitle;
      subtitleBtn.textContent = `🌐 Subtitle: ${isSubtitle ? "ON" : "OFF"}`;
      updateUrlParam("ds_lang", isSubtitle ? "en" : null);
    });
    toggleOptions.append(autoplayBtn, autonextBtn, subtitleBtn);

    const jumpBox = document.createElement("div");
    Object.assign(jumpBox.style, { display: "flex", gap: "5px" });
    const inputSeason = createInput("Season", season);
    const inputEpisode = createInput("Episode", episode);
    const btnGo = createBtn("🎯 Go", () => {
      const s = parseInt(inputSeason.value);
      const e = parseInt(inputEpisode.value);
      if (s >= 1 && e >= 1) changeEpisode(s, e);
    });
    jumpBox.append(inputSeason, inputEpisode, btnGo);

    advBox.append(toggleOptions, serverBox, jumpBox, createBtn("🎬 Next Season", nextSeason));
    panel.append(info, basicControls, advToggle, advBox);
    document.body.append(panel, toggleBtn);
  }

  function createBtn(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: "5px 10px",
      background: "#222",
      color: "#fff",
      border: "1px solid #555",
      cursor: "pointer",
      borderRadius: "4px"
    });
    if (onClick) btn.onclick = onClick;
    return btn;
  }

  function createInput(placeholder, value) {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = placeholder;
    input.value = value;
    input.min = "1";
    Object.assign(input.style, {
      width: "60px",
      padding: "4px",
      borderRadius: "4px",
      border: "1px solid #666",
      background: "#111",
      color: "#fff"
    });
    return input;
  }

  createControls();
})();
