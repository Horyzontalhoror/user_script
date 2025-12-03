// ==UserScript==
// @name         Popup Mini
// @namespace    https://github.com/Horyzontalhoror/user_script
// @version      2.0
// @description  Tekan dan tahan link beberapa detik untuk membuka mini popup dengan countdown lingkaran berwarna biru→merah dan gambar meme berdenyut di tengah. Popup tetap aktif sampai ditutup manual atau klik di area utama web.
// @author       Doby_Don
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @icon         data:image/octet-stream;base64,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
// ==/UserScript==

(function () {
  'use strict';

  const HOLD_TIME = 1200; // waktu tahan (ms)
  const POPUP_SIZE = { width: 600, height: 400 };

  let holdTimer = null;
  let overlay = null;
  let countdownEl = null;
  let popupWindow = null;
  let popupActive = false;
  let holding = false;

  // === CSS ===
  const css = `
    @keyframes pulseMeme {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px #00ffffaa); }
      50% { transform: scale(1.15); filter: drop-shadow(0 0 16px #ff0040aa); }
    }

    .pm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .pm-overlay.show { opacity: 1; }

    .pm-countdown {
      position: relative;
      width: 140px; height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 8px #000;
    }

    .pm-countdown svg {
      position: absolute;
      top: 0; left: 0;
      width: 140px; height: 140px;
      transform: rotate(-90deg);
    }

    .pm-circle-bg {
      stroke: rgba(255,255,255,0.2);
      stroke-width: 8;
    }
    .pm-circle {
      stroke-width: 8;
      stroke-linecap: round;
      filter: drop-shadow(0 0 10px #00ffff);
      transition: stroke-dashoffset 0.05s linear, stroke 0.1s linear;
    }

    .pm-meme {
      width: 80px;
      height: 80px;
      border-radius: 10px;
      object-fit: cover;
      animation: pulseMeme 1.2s infinite ease-in-out;
      z-index: 2;
    }

    .pm-number {
      position: absolute;
      bottom: -20px;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 6px #000;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  // === Overlay ===
  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'pm-overlay';

    countdownEl = document.createElement('div');
    countdownEl.className = 'pm-countdown';
    countdownEl.innerHTML = `
      <svg viewBox="0 0 120 120">
        <circle class="pm-circle-bg" cx="60" cy="60" r="52"></circle>
        <circle class="pm-circle" cx="60" cy="60" r="52"
          stroke-dasharray="${2 * Math.PI * 52}" stroke-dashoffset="0"></circle>
      </svg>
      <img class="pm-meme" src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHNzN2hvaHhscHU3OTdrMng1dmJsazU1dHJubnp3bWlzajd3dG10NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mrcMgI2moKIbJ8lqrP/giphy.gif" alt="meme">
      <div class="pm-number">1.0</div>
    `;

    overlay.appendChild(countdownEl);
    document.body.appendChild(overlay);

    // Klik area blur → tutup popup
    overlay.addEventListener('click', () => {
      if (popupActive) closePopupAndOverlay();
    });

    return overlay;
  }

  function showOverlay() {
    const el = createOverlay();
    requestAnimationFrame(() => el.classList.add('show'));
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => {
      overlay?.remove();
      overlay = null;
      countdownEl = null;
    }, 300);
  }

  // === Countdown radial dengan efek warna panas ===
  function startCountdown(duration) {
    if (!countdownEl) return;
    const numEl = countdownEl.querySelector('.pm-number');
    const circle = countdownEl.querySelector('.pm-circle');
    const totalLength = 2 * Math.PI * 52;
    const start = performance.now();

    function lerpColor(a, b, t) {
      const ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
      const bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
      const rr = Math.round(ar + t * (br - ar));
      const rg = Math.round(ag + t * (bg - ag));
      const rb = Math.round(ab + t * (bb - ab));
      return `rgb(${rr},${rg},${rb})`;
    }

    function update(now) {
      const elapsed = now - start;
      const remain = Math.max(0, duration - elapsed);
      const progress = elapsed / duration;

      numEl.textContent = (remain / 1000).toFixed(1);
      circle.style.strokeDashoffset = totalLength * progress;

      // Warna dinamis: biru → ungu → merah
      let color;
      if (progress < 0.5) {
        color = lerpColor('#00ffff', '#8000ff', progress * 2);
      } else {
        color = lerpColor('#8000ff', '#ff0040', (progress - 0.5) * 2);
      }
      circle.style.stroke = color;
      circle.style.filter = `drop-shadow(0 0 12px ${color})`;

      if (elapsed < duration && holding) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // === Popup ===
  function openMiniPopup(url) {
    const left = window.screenX + (window.outerWidth - POPUP_SIZE.width) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_SIZE.height) / 2;
    popupWindow = window.open(
      url,
      '_blank',
      `width=${POPUP_SIZE.width},height=${POPUP_SIZE.height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    popupActive = true;
  }

  function closePopupAndOverlay() {
    if (popupWindow && !popupWindow.closed) popupWindow.close();
    popupWindow = null;
    popupActive = false;
    hideOverlay();
  }

  // === Tekan lama pada link ===
  document.addEventListener('mousedown', (e) => {
    const link = e.target.closest('a, [data-href]');
    if (!link || e.button !== 0) return;
    holding = true;

    holdTimer = setTimeout(() => {
      if (!holding) return;
      const url = link.href || link.dataset.href;
      if (!url) return;

      showOverlay();
      requestAnimationFrame(() => startCountdown(HOLD_TIME));
      setTimeout(() => {
        if (holding) openMiniPopup(url);
      }, HOLD_TIME);
    }, 150);
  });

  document.addEventListener('mouseup', () => {
    holding = false;
    clearTimeout(holdTimer);
    if (!popupActive) hideOverlay();
  });

  document.addEventListener('mouseleave', () => {
    holding = false;
    clearTimeout(holdTimer);
    if (!popupActive) hideOverlay();
  });

  // Klik di area blur → tutup popup
  document.addEventListener('click', (e) => {
    if (popupActive && overlay && e.target === overlay) closePopupAndOverlay();
  });

  // Tutup otomatis jika popup ditutup manual
  setInterval(() => {
    if (popupActive && (!popupWindow || popupWindow.closed)) closePopupAndOverlay();
  }, 500);
})();
