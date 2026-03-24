// ==UserScript==
// @name         Modify SampleDrive
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modifies Page.
// @author       Doby_Don
// @icon          https://www.sampledrive.org/favicon.ico
// @match        https://www.sampledrive.org/*
// @grant        none
// @run-at       document-end
// @downloadURL   https://github.com/Horyzontalhoror/user_script/raw/refs/heads/master/sampledrive/sampledrive.user.js
// @updateURL     https://github.com/Horyzontalhoror/user_script/raw/refs/heads/master/sampledrive/sampledrive.user.js
// ==/UserScript==

(function() {
    'use strict';

    // loading
    window.addEventListener('load', function() {

        // Tambahkan style
        let backgroundOverlay = document.querySelector('.background-overlay');
        if (backgroundOverlay) {
            backgroundOverlay.style.filter = 'blur(0px) !important';
        }

        // Hapus elemen
        let unwantedElement = document.querySelector('.acdbbf-eccfbf.active');
        if (unwantedElement) {
            unwantedElement.remove();
        }

        // modif blur css
        const style = document.createElement('style');
        style.innerHTML = `
            body.acdbbf-afeccfbfad > :not(#wpadminbar):not(.acdbbf-adbbac):not(.acdbbf-dbbf):not(.acdbbf-eccfbf):not(#ez-cookie-dialog-dbbf) {
                filter: blur(0);
            }
        `;
        document.head.appendChild(style);
    });
})();
