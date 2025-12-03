// ==UserScript==
// @name         YTS Add Link
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Menampilkan link VidSource, Adult, Subtitle dan Trakt.tv dengan opsi enable/disable
// @author       You
// @match        https://yts.mx/movies/*
// @match        https://yts.lt/movies/*
// @match        https://yts.am/movies/*
// @match        https://yts.ag/movies/*
// @grant        GM_config
// @grant        none
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// ==/UserScript==

(function() {
    'use strict';

    // === Inisialisasi Konfigurasi Opsi ===
    GM_config.init({
        id: 'YTSLinkOptions',
        title: 'YTS Link Options',
        fields: {
            showVidSource: {
                label: 'Tampilkan VidSource',
                type: 'checkbox',
                default: true
            },
            showAdultLinks: {
                label: 'Tampilkan Adult Links',
                type: 'checkbox',
                default: false
            },
            showSubtitleLinks: {
                label: 'Tampilkan Subtitle',
                type: 'checkbox',
                default: true
            },
            showTraktLink: {
                label: 'Tampilkan Trakt.tv',
                type: 'checkbox',
                default: true
            }
        },
        css: '#GM_config { background:#f9f9f9; padding:20px; font-family: Arial, sans-serif; }',
        events: {
            save: function() { location.reload(); }
        }
    });

    // === Tombol Pengaturan di Kiri Atas ===
    const settingsBtn = document.createElement('button');
    settingsBtn.textContent = '⚙️ YTS Links';
    settingsBtn.style.position = 'fixed';
    settingsBtn.style.top = '10px';
    settingsBtn.style.left = '10px';
    settingsBtn.style.zIndex = '9999';
    settingsBtn.style.padding = '6px 12px';
    settingsBtn.style.backgroundColor = '#1c1c1c';
    settingsBtn.style.color = '#fff';
    settingsBtn.style.border = 'none';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.style.borderRadius = '4px';
    settingsBtn.style.fontSize = '12px';
    settingsBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    settingsBtn.addEventListener('mouseenter', () => settingsBtn.style.backgroundColor = '#333');
    settingsBtn.addEventListener('mouseleave', () => settingsBtn.style.backgroundColor = '#1c1c1c');

    settingsBtn.onclick = () => GM_config.open();

    document.body.appendChild(settingsBtn);

    // === Fungsi Ambil IMDb ID dari Link ===
    function getImdbIdFromLink() {
        const imdbLink = document.querySelector('a[href^="https://www.imdb.com/title/tt"]');
        if (imdbLink) {
            const match = imdbLink.href.match(/tt\d+/);
            return match ? match[0] : null;
        }
        return null;
    }

    // === Fungsi Membuat Link dengan Icon ===
    function makeIconLink(href, imgSrc) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'inline-block';
        a.style.width = '32px';
        a.style.height = '32px';
        a.style.borderRadius = '4px';
        a.style.overflow = 'hidden';
        a.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        a.style.margin = '0 4px';
        a.style.border = 'none';
        a.style.outline = 'none';
        a.style.transition = 'background-color 0.3s ease';

        a.addEventListener('mouseenter', () => a.style.backgroundColor = '#eee');
        a.addEventListener('mouseleave', () => a.style.backgroundColor = 'transparent');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'link icon';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.display = 'block';

        a.appendChild(img);
        return a;
    }

    // === Fungsi Tambah Semua Link Sesuai Opsi ===
    function addAllLinks() {
        const imdbId = getImdbIdFromLink();
        const titleElement = document.querySelector('.hidden-xs h1');
        const yearElement = document.querySelector('.hidden-xs h2');

        if (!imdbId || !titleElement || !yearElement) return;

        const title = titleElement.textContent.trim();
        const year = yearElement.textContent.trim().split(" ")[0];
        const encodedTitle = encodeURIComponent(title);

        const moviePoster = document.getElementById('movie-poster');
        if (!moviePoster) return;

        // Hapus container lama supaya gak duplikat
        const existingContainer = moviePoster.querySelector('.yts-add-link-container');
        if (existingContainer) existingContainer.remove();

        const mainContainer = document.createElement('div');
        mainContainer.className = 'yts-add-link-container';  // Class untuk identifikasi & hapus nanti
        mainContainer.style.marginTop = '10px';

        // === 1. VidSource Link ===
        if (GM_config.get('showVidSource')) {
            const linksDiv = document.createElement('div');
            linksDiv.style.display = 'flex';

            const vidSourceLink = `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
            const vidSourceImg = "https://vidsrc.xyz/template/vidsrc-ico.png";

            const vidSourcesLink = `https://vidsrc.to/embed/movie/${imdbId}`;
            const vidSourcesImg = `https://vidsrc.to/imgs/favicon-96x96.png`;

            const vidSourceNetLink = `https://vidsrc.net/embed/movie?imdb=${imdbId}`;
            const vidSourceNetImg = `https://vidsrc.net/template/vidsrc-ico.png`;

            const gdriveLink = `https://godriveplayer.com/player.php?imdb=${imdbId}`;
            const gdriveImg = `https://godriveplayer.com/favicon.ico`;

            linksDiv.appendChild(makeIconLink(vidSourceLink, vidSourceImg));
            linksDiv.appendChild(makeIconLink(vidSourcesLink, vidSourcesImg));
            linksDiv.appendChild(makeIconLink(vidSourceNetLink, vidSourceNetImg));
            linksDiv.appendChild(makeIconLink(gdriveLink, gdriveImg));
            mainContainer.appendChild(linksDiv);
        }

        // === 2. Adult Links ===
        if (GM_config.get('showAdultLinks')) {
            const adultDiv = document.createElement('div');
            adultDiv.style.display = 'flex';
            adultDiv.style.marginTop = '10px';

            const nodleLink = `https://noodlemagazine.com/video/${encodedTitle}%20${year}`;
            const aznudeLink = `https://www.aznude.com/search.html?q=${encodedTitle}`;

            const nodleImg = "https://noodlemagazine.com/static/extend/dark/android-icon-72x72.png";
            const aznudeImg = "https://cdn.aznude.com/favicon.ico";

            adultDiv.appendChild(makeIconLink(nodleLink, nodleImg));
            adultDiv.appendChild(makeIconLink(aznudeLink, aznudeImg));
            mainContainer.appendChild(adultDiv);
        }

        // === 3. Subtitle Links ===
        if (GM_config.get('showSubtitleLinks')) {
            const subtitleDiv = document.createElement('div');
            subtitleDiv.style.display = 'flex';
            subtitleDiv.style.marginTop = '10px';

            const openSubsImg = "https://static.opensubtitles.org/favicon.ico";
            const openSubsComImg = "https://www.opensubtitles.com/assets/ui/favicons/apple-touch-icon-76x76-precomposed-c2ad020da0a115a58f669bdb1d7e05300b8927709157d0de1b96e5913e583876.png";
            const podnapisiImg = "https://www.podnapisi.net/static/favicon.ico";
            const subdlImg = "https://subdl.com/favicon.ico";

            subtitleDiv.appendChild(makeIconLink(`https://www.opensubtitles.org/en/search/sublanguageid-eng/imdbid-${imdbId}`, openSubsImg));
            subtitleDiv.appendChild(makeIconLink(`https://www.opensubtitles.com/en/en/search-all/q-${encodeURIComponent(imdbId)}`, openSubsComImg));
            subtitleDiv.appendChild(makeIconLink(`https://www.podnapisi.net/en/subtitles/search/advanced?keywords=${encodedTitle}&year=${year}`, podnapisiImg));
            subtitleDiv.appendChild(makeIconLink(`https://subdl.com/search/${imdbId}`, subdlImg));

            mainContainer.appendChild(subtitleDiv);
        }

        // === 4. Link Baru: Trakt.tv ===
        if (GM_config.get('showTraktLink')) {
            const traktDiv = document.createElement('div');
            traktDiv.style.display = 'flex';
            traktDiv.style.marginTop = '10px';

            const traktLink = `https://trakt.tv/search/imdb/${imdbId}`;
            const traktImg = "https://walter.trakt.tv/hotlink-ok/public/apple-touch-icon.png";

            traktDiv.appendChild(makeIconLink(traktLink, traktImg));
            mainContainer.appendChild(traktDiv);
        }

        // === Append ke moviePoster ===
        moviePoster.appendChild(mainContainer);
    }

    window.addEventListener('load', () => {
        addAllLinks();
    });

})();
