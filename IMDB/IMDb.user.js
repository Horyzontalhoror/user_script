// ==UserScript==
// @name         IMDb Plus
// @namespace    https://imdb.com/
// @version      3.0
// @description  Extracts title, rating, runtime, etc. + popup overlay + dynamic settings for multiple streaming sources.
// @author       You
// @match        https://www.imdb.com/title/tt*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
  "use strict";

  // === ⚙️ KONSTANTA GLOBAL ===
  const FAVICON_BASE = "https://www.google.com/s2/favicons?sz=64&domain=";
  const DEFAULT_ICON = "https://cdn.jsdelivr.net/gh/username/icons/default.png";
  const s1 = "&season=1&episode=1";
  const s2 = "/1/1";
  const f1 = (str) => str.trim().replace(/\s+/g, '-').replace(/'/g, '');
  const f2 = (q) => encodeURIComponent(q).replace(/%20/g, '-');

  // DAFTAR SUMBER
  const SOURCES = [
    // 🎬 Streaming
    { key: "VidSrc.xyz", type: "stream", label: "VidSrc.xyz", domain: "vidsrc.xyz",
      build: (id, isTV) =>
        `https://vidsrc.xyz/embed/${isTV ? `tv?imdb=${id}${s1}` : `movie?imdb=${id}`}`,
    },
    { key: "VidSrc.to", type: "stream", label: "VidSrc.to", domain: "vidsrc.to",
      build: (id, isTV) =>
        `https://vidsrc.to/embed/${isTV ? `tv/${id}${s2}` : `movie/${id}`}`,
    },
    { key: "VidSrc.net", type: "stream", label: "VidSrc.net", domain: "vidsrc.net",
      build: (id, isTV) =>
        `https://vidsrc.net/embed/${isTV ? `tv/${id}${s2}` : `movie?imdb=${id}`}`,
    },
    { key: "Vidfast.pro", type: "stream", label: "Vidfast.pro", domain: "vidfast.pro",
      build: (id, isTV) =>
        `https://vidfast.pro/${isTV ? `tv/${id}${s2}` : `movie/${id}`}`,
    },
    { key: "StreamIMDB", type: "stream", label: "StreamIMDB", domain: "streamimdb.me",
      build: (id, isTV) =>
        `https://streamimdb.me/embed/${isTV ? `tv/${id}${s2}` : id}`,
    },
    { key: "GodrivePlayer", type: "stream", label: "GoDrive", domain: "godriveplayer.com",
      build: (id, isTV) =>
        `https://godriveplayer.com/player.php?imdb=${id}${isTV ? s1 : ""}`,
    },
    { key: "SuperEmbed", type: "stream", label: "SuperEmbed", domain: "multiembed.mov",
      build: (id, isTV) =>
        isTV
          ? `https://multiembed.mov/directstream.php?video_id=${id}&s=1&e=1`
          : `https://multiembed.mov/directstream.php?video_id=${id}`,
    },
    { key: "AutoEmbed", type: "stream", label: "AutoEmbed", domain: "autoembed.co",
      build: (id, isTV) =>
        isTV
          ? `https://autoembed.co/tv/imdb/${id}-1-1`
          : `https://autoembed.co/movie/imdb/${id}`,
    },
    { key: "HNEmbed", type: "stream", label: "HNEmbed", domain: "hnembed.cc",
      build: (id, isTV) =>
        `https://hnembed.cc/embed/${isTV ? `tv/${id}${s2}` : `movie/${id}/1/1`}`,
    },

    // 🔍 Alternative
    { key: "fmovies", type: "alt", label: "FMovies", domain: "fmovies.gd",
      build: (t) =>
        `https://www.fmovies.gd/search?q=${t}`,
    },
    { key: "fmovies24", type: "alt", label: "fmovies24", domain: "fmovies24-to.com",
      build: (t) =>
        `https://en.fmovies24-to.com/search?q=${t}`,
    },
    { key: "oneShow", type: "alt", label: "1Show", domain: "1shows.ru",
      build: (t) =>
        `https://www.1shows.ru/search?query=${t}`,
    },
    { key: "1movie", type: "alt", label: "1Movies", domain: "1movies.bz",
      build: (t,y) =>
        `https://1movies.bz/browser?keyword=${t}+${y}`,
    },
    { key: "sflix", type: "alt", label: "Sflix", domain: "sflix.ps",
      build: (t, y) =>
        `https://sflix.ps/search/${f1(t)}-${f1(y)}`,
    },
    { key: "lookmovie", type: "alt", label: "LookMovie", domain: "lookmovie2.to",
      build: (t, isTV) =>
        `https://www.lookmovie2.to/${isTV ? "shows" : "movies"}/search/?q=${t}`,
    },
    { key: "fsharetv", type: "alt", label: "Fsharetv", domain: "fsharetv.cc", 
      icon: "https://fsharetv.cc/favicon.ico",
      build: (t) =>
        `https://fsharetv.cc/search?q=${t}`,
    },
    { key: "movies4ufree", type: "alt", label: "Movies4uFree", domain: "movies4ufree.net",
      build: (q) =>
        `https://movies4ufree.net/search/${f1(q)}`,
    },

    // 🎞️ Another
    { key: "videosearch", type: "another", label: "VideoSearch.io", domain: "videosearch.io",
      build: (t, y) =>
        `https://www.videosearch.io/#gsc.tab=0&gsc.q=${t}%20(${y})&gsc.sort=`,
    },
    { key: "okru", type: "another", label: "OK.ru", domain: "ok.ru",
      build: (t) =>
        `https://ok.ru/video/search?st.cmd=video&st.psft=search&st.m=SEARCH&st.ft=search&cmd=VideoContentBlock&st.v.srt=All&st.v.sfd=LONG&st.v.sfhd=off&st.v.sq=${t}&gwt.requested=xxx`,
    },
    { key: "archive", type: "another", label: "Archive.org", domain: "archive.org",
      build: (t, y) =>
        `https://archive.org/details/moviesandfilms?query=${t}+(${y})&and[]=mediatype:%22movies%22&and[]=subject:%22Movie%22`,
    },
    { key: "rarefilmm", type: "another", label: "RareFilmm", domain: "rarefilmm.com",
      build: (q) =>
        `https://rarefilmm.com/?s=${q}`,
    },
    { key: "youtube", type: "another", label: "YouTube", domain: "youtube.com",
      build: (q, y) =>
        `https://www.youtube.com/results?search_query=${q}%20${y}&sp=EgQQARgC`,
    },
    { key: "effedup", type: "another", label: "EffedUpMovies", domain: "effedupmovies.com",
      build: (q) =>
        `https://www.effedupmovies.com/?s=${q}`,
    },

    // Subtitles
    { key: "openSubtitles.org", type: "sub", label: "OpenSubtitles.org", domain: "opensubtitles.org",
      build: (id) =>
        `https://www.opensubtitles.org/en/search/sublanguageid-eng/imdbid-${id.replace(/^tt/, "")}`,
    },
    { key: "opensubtitles.com", type: "sub", label: "Opensubtitles.com", domain: "opensubtitles.com",
      build: (id) =>
        `https://www.opensubtitles.com/en/en/search-all/q-${id}/hearing_impaired-include/machine_translated-/trusted_sources-`,
    },
    { key: "podnapisi", type: "sub", label: "Podnapisi", domain: "podnapisi.net",
      build: (q, t) =>
        `https://www.podnapisi.net/en/subtitles/search/advanced?keywords=${q}&year=(${t})&seasons=&episodes=`,
    },
    { key: "subdl", type: "sub", label: "Subdl", domain: "subdl.com",
      build: (id) =>
        `https://subdl.com/search/${id}`,
    },
    { key: "Subsource", type: "sub", label: "Subsource", domain: "subsource.net",
      build: (q) =>
        `https://subsource.net/search?q=${q}`,
    },

    // Torrent
    {
      key: "thepiratebay", type: "tor", label: "ThePirateBay", domain: "thepiratebay.org",
      build: (q) =>
        `https://thepiratebay.org/search/${q}`,
    },
    {
      key: "1337x", type: "tor", label: "1337x", domain: "1337x.to",
      build: (q) =>
        `https://1337x.to/search/${q}/1/`,
    },
    {
      key: "yts", type: "tor", label: "YTS", domain: "yts.mx",
      build: (id) =>
        `https://yts.mx/browse-movies/${id}`,
    },
    {
      key: "therarbg", type: "tor", label: "TheRARBG", domain: "therarbg.com",
      build: (id) =>
        `https://therarbg.com/get-posts/keywords:${id}:category:Movies:category:TV/`,
    },

    // Download
    {
      key: "Vidsrc.vip",type: "download", label: "Vidsrc.vip", domain: "vidsrc.vip",
      build: (id, isTV) =>
        `https://dl.vidsrc.vip/${isTV ? `tv/${id}${s2}` : `movie/${id}`}`,
    },
  ];

  // Ambil & Simpan Konfigurasi 
  function getConfig() {
    const cfg = {
      autoPopup: GM_getValue("autoPopup", true),
      showAlt: GM_getValue("showAlt", true),
    };
    for (const s of SOURCES) cfg[s.key] = GM_getValue(s.key, true);
    return cfg;
  }

  function setConfig(updates) {
    for (const key in updates) GM_setValue(key, updates[key]);
  }

  function notify(msg) {
    GM_notification({ title: "IMDb Plus", text: msg, timeout: 1500 });
  }

  // bersihkan format judul & tahun
  function makeSearchParams(info) {
    const cleanTitle = (info.title || "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/[–—-]/g, " ")
      .trim();

    // Ambil hanya tahun pertama jika formatnya "2012–2019"
    const cleanYear = (info.year || "")
      .split(/[–—-]/)[0]
      .trim();

    // parameter
    const q = encodeURIComponent(`${cleanTitle} ${cleanYear}`);
    const t = encodeURIComponent(cleanTitle);
    const y = encodeURIComponent(cleanYear);

    return { q, t, y, cleanTitle, cleanYear };
  }

  // Popup Pengaturan 
  function openSettingsPopup() {
    const cfg = getConfig();
    const old = document.getElementById("imdb-settings-popup");
    if (old) old.remove();

    const popup = document.createElement("div");
    popup.id = "imdb-settings-popup";

    // === Template ikon per kategori ===
    const makeGroupHTML = (type, title, color) => {
      const group = SOURCES.filter(s => s.type === type);
      if (!group.length) return "";
      return `
        <hr>
        <b style="color:${color};">${title}</b><br>
        ${group.map(src => `
          <div style="display:inline-block;margin:3px;cursor:pointer;" title="${src.label}">
            <img
              id="icon-${src.key}"
              src="${src.icon || FAVICON_BASE + src.domain}"
              onerror="this.onerror=null; this.src='${DEFAULT_ICON}';"
              width="26"
              height="26"
              style="
                border-radius:6px;
                opacity:${cfg[src.key] ? 1 : 0.4};
                transition:opacity 0.2s, transform 0.2s;
                box-shadow:0 1px 3px rgba(0,0,0,0.4);
              ">
          </div>
        `).join("")}
      `;
    };

    // === Template popup utama ===
    popup.innerHTML = `
      <div style="
        position     : fixed;
        top          : 50%;left: 50%;
        transform    : translate(-50%,-50%);
        background   : rgba(0,0,0,0.95);
        color        : #fff;
        padding      : 20px;
        border-radius: 10px;
        z-index      : 999999;
        font-family  : Arial,    sans-serif;
        box-shadow   : 0 4px 20px rgba(0,0,0,0.6);
        min-width    : 320px;
        max-height   : 80vh;
        overflow     : hidden;
      ">
        <div style="max-height:65vh; overflow-y:auto; padding-right:6px;">
          <h3 style="color: #f5c518; margin-top:0;">⚙ IMDb Plus Settings</h3>
          <label><input type="checkbox" id="set-autoPopup" ${cfg.autoPopup ? "checked" : ""
      }> Auto Popup</label><br>
          <label><input type="checkbox" id="set-showAlt" ${cfg.showAlt ? "checked" : ""
      }> Show Alternative Links</label>

          ${makeGroupHTML("stream", "🎬 Streaming Sources:", "#f5c518")}
          ${makeGroupHTML("alt", "🔍 Alternative Sources:", "#8be9fd")}
          ${makeGroupHTML("another", "🎞️ Another Sources:", "#bd93f9")}
          ${makeGroupHTML("sub", "🎞️ Subtitles Sources:", "#93f9a4ff")}
          ${makeGroupHTML("tor", "🎞️ Torrent Sources:", "#93abf9ff")}
          ${makeGroupHTML("download", "🎞️ Download Sources:", "#f993dfff")}

          <p id="save-status" style="display:none; color: #f5c518;margin-top:8px;">Saving...</p>
        </div>

        <button id="save-settings" style="
          margin-top   : 10px;
          background   : #f5c518;
          color        : #000;
          border       : none;
          padding      : 6px 10px;
          border-radius: 4px;
          cursor       : pointer;
          width        : 100%;
          font-weight  : bold;
          ">Save & Close
        </button>
      </div>`;

    document.body.appendChild(popup);

    // === Toggle event setiap ikon ===
    for (const src of SOURCES) {
      const icon = document.getElementById(`icon-${src.key}`);
      if (!icon) continue;
      icon.addEventListener("click", () => {
        cfg[src.key] = !cfg[src.key];
        icon.style.opacity = cfg[src.key] ? 1 : 0.4;
      });
    }

    // === Tombol Save ===
    document.getElementById("save-settings").addEventListener("click", () => {
      const msg = document.getElementById("save-status");
      msg.style.display = "block";
      setTimeout(() => (msg.style.display = "none"), 1000);

      const updates = {
        autoPopup: document.getElementById("set-autoPopup").checked,
        showAlt: document.getElementById("set-showAlt").checked,
      };
      for (const src of SOURCES) updates[src.key] = cfg[src.key];

      setConfig(updates);
      popup.remove();

      const existingPopup = document.getElementById("imdb-info-popup");
      if (existingPopup) {
        existingPopup.remove();
        setTimeout(() => extractAndShow(), 300);
      } else {
        notify("Settings saved ✅");
      }
    });
  }

  // === 🎨 CSS tambahan ===
  const style = document.createElement("style");
  style.textContent = `
    #imdb-info-popup img:hover {
      transform: scale(1.15);
      filter: drop-shadow(0 0 4px #f5c518);
    }
    #imdb-float-btn {
      position     : fixed;
      bottom       : 25px;
      right        : 25px;
      width        : 50px;
      height       : 50px;
      border-radius: 50%;
      background   : #f5c518;
      color        : #000;
      font-weight  : bold;
      font-size    : 22px;
      border       : none;
      cursor       : pointer;
      z-index      : 999999;
      box-shadow   : 0 3px 8px rgba(0,0,0,0.4);
      transition   : transform 0.2s;
    }
    #imdb-float-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 12px rgba(0,0,0,0.5);
    }
  `;
  document.head.appendChild(style);

  // === 🔍 Ekstraksi info IMDb ===
  function extractMovieInfo(block) {
    const title = block.querySelector("h1 span.hero__primary-text")?.innerText.trim() || "N/A";
    const originalTitle = block.querySelector(".sc-16bda17f-2")?.innerText.replace("Original title:", "").trim() || "";
    const listItems = block.querySelectorAll("ul.ipc-inline-list li");
    const details = Array.from(listItems).map(li => li.textContent.trim());
    let type = "N/A", year = "N/A", certificate = "N/A", runtime = "N/A";
    if (details.length === 2) [year, runtime] = details;
    else if (details.length === 3) [year, certificate, runtime] = details;
    else if (details.length >= 4) [type, year, certificate, runtime] = details;

    const imdbRating = block.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"] span')?.innerText.trim() || "N/A";
    const votes = block.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"] + span, .eNfgcR')?.innerText.trim() || "N/A";
    const popularity = block.querySelector('[data-testid="hero-rating-bar__popularity__score"]')?.innerText.trim() || "N/A";
    const idMatch = window.location.pathname.match(/title\/(tt\d+)/);
    const imdbId = idMatch ? idMatch[1] : "";
    return { title, originalTitle, type, year, certificate, runtime, imdbRating, votes, popularity, imdbId };
  }

  // === 🎨 STYLE GLOBAL (Hanya 1 kali) ===
  if (!document.getElementById("imdb-style-global")) {
    const style = document.createElement("style");
    style.id = "imdb-style-global";
    style.textContent = `
    #imdb-info-popup {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(20, 20, 20, 0.92);
      color: #fff;
      padding: 18px 22px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      font-family: 'Segoe UI', Arial, sans-serif;
      z-index: 999999;
      max-width: 360px;
      max-height: 85vh;
      overflow-y: auto;
      line-height: 1.5;
      backdrop-filter: blur(6px);
      scrollbar-width: thin;
      scrollbar-color: #f5c518 #333;
      transition: opacity 0.25s ease;
    }

    #imdb-info-popup img {
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5);
      transition: transform 0.2s, filter 0.2s;
    }

    #imdb-info-popup img:hover { transform: scale(1.15); }
    /* stream style */
    .stream img:hover  { filter: drop-shadow(0 0 6px #f5c518); }
    .alt img:hover     { filter: drop-shadow(0 0 6px #8be9fd); }
    .another img:hover { filter: drop-shadow(0 0 6px #bd93f9); }
    .sub img:hover { filter: drop-shadow(0 0 6px #93f9a4ff); }
    .tor img:hover { filter: drop-shadow(0 0 6px #93abf9ff); }
    .download img:hover { filter: drop-shadow(0 0 6px #f993dfff); }

    .category-title {
      text-align    : center;
      font-weight   : 600;
      font-size     : 14.5px;
      letter-spacing: 0.3px;
      margin        : 6px 0;
    }

    .divider {
      height       : 2px;
      border-radius: 2px;
      margin-bottom: 6px;
    }

    .stream .divider  { background: linear-gradient(90deg,#f5c51880,#f5c51820); }
    .alt .divider     { background: linear-gradient(90deg,#8be9fd80,#8be9fd20); }
    .another .divider { background: linear-gradient(90deg,#bd93f980,#bd93f920); }
    .sub .divider { background: linear-gradient(90deg,#93f9a4ff, #93f9a420); }
    .tor .divider { background: linear-gradient(90deg,#93abf9ff, #93abf920); }
    .download .divider { background: linear-gradient(90deg,#f993dfff, #f993df20); }

    .popup-buttons {
      margin-top: 16px;
      display: flex;
      gap: 10px;
    }

    .popup-buttons button {
      flex: 1;
      border: none;
      border-radius: 4px;
      padding: 6px 10px;
      font-weight: bold;
      cursor: pointer;
    }

    #imdb-settings-btn { background: #444; color: #fff; }
    #imdb-close-btn { background: #f5c518; color: #000; }
  `;
    document.head.appendChild(style);
  }

  // === 🧩 POPUP CREATOR ===
  function createPopup(info) {
    const cfg = getConfig();
    const old = document.getElementById("imdb-info-popup");
    if (old) old.remove();

    const id = info.imdbId;
    const type = info.type.toLowerCase();
    const isTV = type.includes("tv series") || type.includes("tv mini series");
    const { q, t, y } = makeSearchParams(info);

    // Kategori sumber
    const Stream = SOURCES.filter(s => s.type === "stream" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build(id, isTV),
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    const alternatif = SOURCES.filter(s => s.type === "alt" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build(t, y, q),
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    const another = SOURCES.filter(s => s.type === "another" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build?.(t, y, q) || "#",
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    const subtitles = SOURCES.filter(s => s.type === "sub" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build?.(id, t, y, q) || "#",
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    const torrent = SOURCES.filter(s => s.type === "tor" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build?.(id, t, y, q) || "#",
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    const download = SOURCES.filter(s => s.type === "download" && cfg[s.key])
      .map(s => ({
        title: s.label,
        url: s.build?.(id, t, y, q) || "#",
        icon: `${FAVICON_BASE}${s.domain}`,
      }));

    // Popup utama 
    const popup = document.createElement("div");
    popup.id = "imdb-info-popup";
    popup.innerHTML = `
    <h3 style="margin-top:0; font-size:17px; color:#f5c518;">
      🎬 ${info.title} (${info.year})
      <button style="margin-left:6px;padding:2px 6px;border:none;border-radius:4px;
                    background:#f5c518;color:#000;cursor:pointer;font-weight:bold;"
        onclick="navigator.clipboard.writeText('${info.title.replace(/'/g, "\\'")} ${info.year.split('–')[0]}')">
        Copy
      </button>
    </h3>
    <p><b>ID:</b> ${id}
      <button style="margin-left:6px;padding:2px 6px;border:none;border-radius:4px;
                    background:#f5c518;color:#000;cursor:pointer;font-weight:bold;"
        onclick="navigator.clipboard.writeText('${id}')">Copy</button>
    </p>
    ${info.originalTitle ? `<p><b>Original:</b> ${info.originalTitle}</p>` : ""}
    ${info.type !== "N/A" ? `<p><b>Type:</b> ${info.type}</p>` : ""}
    <p><b>Runtime: </b> ${info.runtime}</p>
    <p><b>Rating : </b> ${info.imdbRating}</p>
    <p><b>Votes  : </b> ${info.votes}</p>
    ${info.popularity !== "N/A" ? `<p><b>Popularity:</b> ${info.popularity}</p>` : ""}

    ${Stream.length ? `
      <div class="stream" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color: #f5c518;">🎬 Streaming</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${Stream.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>
          `).join("")}
        </div>
      </div>` : ""}

    ${cfg.showAlt && alternatif.length ? `
      <div class="alt" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color:#8be9fd;">🔍 Alternative</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${alternatif.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>`).join("")}
        </div>
      </div>` : ""}

    ${another.length ? `
      <div class="another" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color: #bd93f9;">🎞️ Another</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${another.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>`).join("")}
        </div>
      </div>` : ""}

    ${subtitles.length ? `
      <div class="subtitles" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color: #93f9a4ff;">📼 Subtitles</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${subtitles.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>`).join("")}
        </div>
      </div>` : ""}

    ${torrent.length ? `
      <div class="torrent" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color: #93abf9ff;">🧲 Torrent</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${torrent.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>`).join("")}
        </div>
      </div>` : ""}

    ${download.length ? `
      <div class="download" style="margin-top:14px;">
        <div class="divider"></div>
        <p class="category-title" style="color: #93abf9ff;">⬇️ Download</p>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">
          ${download.map(l => `
            <a href="${l.url}" target="_blank" title="${l.title}">
              <img src="${l.icon}" width="28" height="28">
            </a>`).join("")}
        </div>
      </div>` : ""}

    <div class="popup-buttons">
      <button id="imdb-settings-btn">⚙ Settings</button>
      <button id="imdb-close-btn">Close</button>
    </div>
  `;

    document.body.appendChild(popup);

    // === Tombol handler ===
    popup.querySelector("#imdb-close-btn").addEventListener("click", () => popup.remove());
    popup.querySelector("#imdb-settings-btn").addEventListener("click", openSettingsPopup);
  }

  // === ⚡ Extract & show ===
  function extractAndShow() {
    const block = document.querySelector('[data-testid="hero-title-block__metadata"]')?.closest("section") || document.querySelector("div.sc-14a487d5-3");
    if (!block) return console.warn("[IMDb Info] No info block found.");
    const info = extractMovieInfo(block);
    createPopup(info);
  }

  // === 🎈 Floating Button ===
  function createFloatingButton() {
    const btn = document.createElement("button");
    btn.id = "imdb-float-btn";
    btn.textContent = "▶️";
    btn.title = "Tampilkan / Tutup Info\nKlik kanan untuk reset posisi";

    // ==== Style tombol ====
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "25px",
      right: "25px",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      background: "#f5c518",
      color: "#000",
      fontSize: "22px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      zIndex: "999999",
      boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
      transition: "transform 0.2s, box-shadow 0.2s",
    });

    // ==== Ambil posisi tersimpan (jika ada) ====
    const savedPos = GM_getValue("floatPos", null);
    if (savedPos && savedPos.x !== null && savedPos.y !== null) {
      btn.style.left = `${savedPos.x}px`;
      btn.style.top = `${savedPos.y}px`;
      btn.style.right = "auto";
      btn.style.bottom = "auto";
    }

    // ==== Hover animasi ====
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 5px 12px rgba(0,0,0,0.5)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
      btn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.4)";
    });

    // ==== Klik utama ====
    btn.addEventListener("click", (e) => {
      if (isDragging) return; // abaikan klik saat sedang drag
      const popup = document.getElementById("imdb-info-popup");
      if (popup) popup.remove();
      else extractAndShow();
    });

    // ==== Drag & Move ====
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    btn.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - btn.getBoundingClientRect().left;
      offsetY = e.clientY - btn.getBoundingClientRect().top;
      btn.style.transition = "none";
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
      btn.style.right = "auto";
      btn.style.bottom = "auto";
      btn.style.position = "fixed";
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        btn.style.transition = "transform 0.2s, box-shadow 0.2s";
        // Simpan posisi tombol
        GM_setValue("floatPos", {
          x: parseFloat(btn.style.left),
          y: parseFloat(btn.style.top),
        });
      }
    });

    // ==== Klik kanan untuk reset posisi ====
    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      GM_deleteValue("floatPos");
      btn.style.left = "";
      btn.style.top = "";
      btn.style.right = "25px";
      btn.style.bottom = "25px";
      alert("📍 Tombol dikembalikan ke posisi default.");
    });

    document.body.appendChild(btn);
  }

  // === 🚀 Jalankan otomatis ===
  window.addEventListener("load", () => {
    setTimeout(() => {
      const cfg = getConfig();
      if (cfg.autoPopup) extractAndShow();
      createFloatingButton();
    }, 1200);
  });

})();
