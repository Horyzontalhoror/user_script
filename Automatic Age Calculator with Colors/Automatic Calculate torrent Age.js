// ==UserScript==
// @name         Automatic Age Calculator with Colors (Optimized)
// @namespace    https://github.com/Horyzontalhoror/user_script
// @version      1.5.1
// @description  Replaces the original date with a color-coded age calculation. Language can be changed in the menu.
// @author       Horyzontalhoror
// @match        https://1337x.to/*
// @match        https://thepiratebay.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    // --- Configurations ---
    const translations = {
        id: {
            year: 'thn', years: 'thn',
            month: 'bln', months: 'bln',
            day: 'hr', days: 'hr',
            today: 'Hari ini'
        },
        en: {
            year: 'yr', years: 'yrs',
            month: 'mo', months: 'mos',
            day: 'd', days: 'ds',
            today: 'Today'
        }
    };

    const siteConfig = {
        '1337x.to': 'td.coll-date',
        'thepiratebay.org': 'span.list-item.item-uploaded label'
    };

    const REGEX_L337X = /(?:(\d{1,2}:\d{2})|(\d{1,2}))?(am|pm)?\s*([A-Za-z]{3})\.\s+(\d{1,2})(?:st|nd|rd|th)(?:\s+'(\d{2}))?/i;
    const REGEX_TPB_DATE = /^(\d{2})-(\d{2})\s(\d{2}):(\d{2})$/;

    // --- Menu Commands ---
    GM_registerMenuCommand('Gunakan Bahasa Indonesia', () => {
        GM_setValue('language', 'id');
        location.reload();
    });
    GM_registerMenuCommand('Use English', () => {
        GM_setValue('language', 'en');
        location.reload();
    });

    // --- Date Utils ---
    function calculateAge(start, end) {
        if (start > end) return null;

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    function parseDate(dateString) {
        const today = new Date();
        let match = dateString.match(REGEX_L337X);

        if (match) {
            const [, timePart, hourPart, ampm, monthStr, dayStr, yearStr] = match;
            let hour = 0, minute = 0;

            if (timePart) [hour, minute] = timePart.split(':').map(Number);
            else if (hourPart) {
                hour = parseInt(hourPart);
                if (ampm?.toLowerCase() === 'pm' && hour !== 12) hour += 12;
                if (ampm?.toLowerCase() === 'am' && hour === 12) hour = 0;
            }

            const day = parseInt(dayStr, 10);
            const monthMap = {'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11};
            const month = monthMap[monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase()];
            if (month === undefined) return null;

            let year = yearStr ? parseInt(`20${yearStr}`, 10) : today.getFullYear();
            if (!yearStr && new Date(year, month, day) > today) year--;

            return new Date(year, month, day, hour, minute);
        }

        if (dateString.startsWith('Today')) {
            const [, h, m] = dateString.match(/(\d{2}):(\d{2})/) || [];
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
        }

        if (dateString.startsWith('Y-day')) {
            const [, h, m] = dateString.match(/(\d{2}):(\d{2})/) || [];
            const y = new Date(today);
            y.setDate(y.getDate() - 1);
            return new Date(y.getFullYear(), y.getMonth(), y.getDate(), h, m);
        }

        match = dateString.match(REGEX_TPB_DATE);
        if (match) {
            const [_, mm, dd, hh, mi] = match;
            const month = parseInt(mm) - 1, day = parseInt(dd), hour = parseInt(hh), minute = parseInt(mi);
            let year = today.getFullYear();
            if (new Date(year, month, day) > today) year--;
            return new Date(year, month, day, hour, minute);
        }

        const fallback = new Date(dateString);
        return isNaN(fallback.getTime()) ? null : fallback;
    }

    function buildAgeString(age, t) {
        if (!age) return '';
        if (age.years > 0) {
            return `${age.years} ${t.years} ${age.months > 0 ? age.months + ' ' + t.months : ''}`.trim();
        }
        if (age.months > 0) {
            return `${age.months} ${t.months} ${age.days > 0 ? age.days + ' ' + t.days : ''}`.trim();
        }
        if (age.days > 0) return `${age.days} ${t.days}`;
        return t.today;
    }

    function determineColor(age) {
        const totalMonths = age.years * 12 + age.months;
        if (totalMonths >= 12) return 'red';
        if (totalMonths >= 1) return 'orange';
        return 'green';
    }

    // --- Main Processor ---
    function processElements(root) {
        const lang = GM_getValue('language', 'id');
        const t = translations[lang];

        const selector = siteConfig[location.hostname];
        if (!selector) return;

        const elements = root.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.dataset.ageCalculated) return;

            const dateStr = el.textContent.trim();
            const parsedDate = parseDate(dateStr);
            if (!parsedDate) return;

            const age = calculateAge(parsedDate, new Date());
            if (!age) return;

            const ageStr = buildAgeString(age, t);
            const color = determineColor(age);

            el.textContent = ageStr;
            el.style.color = color;
            el.style.fontWeight = 'bold';
            el.style.textAlign = 'center';
            el.dataset.ageCalculated = 'true';
        });
    }

    // --- Initial Run ---
    processElements(document.body);

    // --- Observer for Dynamic Content ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) processElements(node);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
