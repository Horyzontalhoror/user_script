// ==UserScript==
// @name         Vidsrc+
// @namespace    https://vidsrc.xyz/
// @version      2.2
// @description  Add manual jump, toggle autoplay/autonext/subtitle (updates URL), and full control UI on vidsrc.xyz embed player, with collapsible advanced options box.
// @author       Doby_Don
// @match        https://vidsrc.xyz/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);
    const imdb = url.searchParams.get("imdb");
    let season = parseInt(url.searchParams.get("season")) || 1;
    let episode = parseInt(url.searchParams.get("episode")) || 1;

    let isAutoplay = url.searchParams.get("autoplay") === "1";
    let isAutonext = url.searchParams.get("autonext") === "1";
    let isSubtitle = url.searchParams.get("ds_lang") === "en";

    // 🔗 Build URL
    function buildUrl(s, e) {
        const base = `https://vidsrc.xyz/embed/tv`;
        const params = new URLSearchParams({
            imdb: imdb,
            season: s,
            episode: e,
        });
        if (isAutoplay) params.set("autoplay", "1");
        if (isAutonext) params.set("autonext", "1");
        if (isSubtitle) params.set("ds_lang", "en");
        return `${base}?${params.toString()}`;
    }

    // 🎬 Change episode/season
    function changeEpisode(newSeason, newEpisode) {
        window.location.href = buildUrl(newSeason, newEpisode);
    }
    function nextEpisode() { changeEpisode(season, episode + 1); }
    function prevEpisode() {
        if (episode > 1) changeEpisode(season, episode - 1);
        else if (season > 1) changeEpisode(season - 1, 1);
    }
    function nextSeason() { changeEpisode(season + 1, 1); }

    // 🔄 Update URL instantly
    function updateUrlParam(key, value) {
        const newUrl = new URL(window.location.href);
        if (value === null) newUrl.searchParams.delete(key);
        else newUrl.searchParams.set(key, value);
        window.history.replaceState({}, "", newUrl.toString());
    }

    // 🧩 Create Controls
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

        // 👁️ Show/Hide full UI
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

        // ℹ️ Info
        const info = document.createElement("div");
        info.textContent = `S${season}E${episode}`;
        info.style.marginBottom = "5px";

        // ▶️ Basic navigation
        const basicControls = document.createElement("div");
        Object.assign(basicControls.style, {
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "8px"
        });

        const btnPrev = createBtn("⏮️ Prev", prevEpisode);
        const btnNext = createBtn("⏭️ Next", nextEpisode);
        basicControls.append(btnPrev, btnNext);

        // ⚙️ Advanced box toggle
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

        // Simpan status di localStorage
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

        // 🧠 Advanced controls
        const toggleOptions = document.createElement("div");
        Object.assign(toggleOptions.style, {
            display: "flex",
            gap: "6px",
            flexWrap: "wrap"
        });

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

        // Jump box
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

        // Next Season
        const btnNextSeason = createBtn("🎬 Next Season", nextSeason);

        advBox.append(toggleOptions, jumpBox, btnNextSeason);

        // Build UI
        panel.append(info, basicControls, advToggle, advBox);
        document.body.append(panel, toggleBtn);
    }

    // 🔘 Helper button/input
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
