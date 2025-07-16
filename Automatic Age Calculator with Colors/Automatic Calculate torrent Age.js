// ==UserScript==
// @name         Automatic Age Calculator with Colors
// @namespace    https://github.com/Horyzontalhoror/user_script
// @version      1.5
// @description  Replaces the original date with a color-coded age calculation. Language can be changed in the menu.
// @author       Horyzontalhoror
// @match        https://1337x.to/*
// @match        https://thepiratebay.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Language Configuration ---
    const translations = {
        id: {
            year: 'thn',
            years: 'thn',
            month: 'bln',
            months: 'bln',
            day: 'hr',
            days: 'hr',
            today: 'Hari ini'
        },
        en: {
            year: 'yr',
            years: 'yrs',
            month: 'mo',
            months: 'mos',
            day: 'd',
            days: 'ds',
            today: 'Today'
        }
    };

    // --- Menu Commands for Language Selection ---
    GM_registerMenuCommand('Gunakan Bahasa Indonesia', () => {
        GM_setValue('language', 'id');
        location.reload();
    });

    GM_registerMenuCommand('Use English', () => {
        GM_setValue('language', 'en');
        location.reload();
    });


    /**
     * Calculates the difference between two dates.
     */
    function calculateAge(startDate, endDate) {
        if (startDate > endDate) return null;

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return { years, months, days };
    }

    /**
     * Parses a date string from various known formats into a Date object.
     */
    function parseDate(dateString) {
        // Handle 1337x format with optional year: "Jul. 11th '25" or "2am Jul. 11th"
        const l337xRegex = /(?:(\d{1,2}:\d{2})|(\d{1,2}))?(am|pm)?\s*([A-Za-z]{3})\.\s+(\d{1,2})(?:st|nd|rd|th)(?:\s+'(\d{2}))?/i;
        let match = dateString.match(l337xRegex);

        if (match) {
            const [, timePart, hourPart, ampmPart, monthStr, dayStr, yearStr] = match;
            let hour = 0, minute = 0;

            if (timePart) {
                [hour, minute] = timePart.split(':').map(Number);
            } else if (hourPart) {
                hour = parseInt(hourPart, 10);
                if (ampmPart && ampmPart.toLowerCase() === 'pm' && hour !== 12) hour += 12;
                if (ampmPart && ampmPart.toLowerCase() === 'am' && hour === 12) hour = 0;
            }

            const day = parseInt(dayStr, 10);
            const monthMap = {'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11};
            const month = monthMap[monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase()];

            if (month === undefined) return null;

            const today = new Date();
            let year;
            if (yearStr) {
                year = parseInt(`20${yearStr}`, 10);
            } else {
                year = today.getFullYear();
                const tentativeDate = new Date(year, month, day);
                if (tentativeDate > today) {
                    year--;
                }
            }
            return new Date(year, month, day, hour, minute);
        }

        // Handle ThePirateBay formats
        const today = new Date();
        if (dateString.startsWith('Today')) {
            const [, h, m] = dateString.match(/(\d{2}):(\d{2})/) || [];
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
        }
        if (dateString.startsWith('Y-day')) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const [, h, m] = dateString.match(/(\d{2}):(\d{2})/) || [];
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), h, m);
        }
        match = dateString.match(/^(\d{2})-(\d{2})\s(\d{2}):(\d{2})$/);
        if (match) {
            const month = parseInt(match[1], 10) - 1;
            const day = parseInt(match[2], 10);
            const hour = parseInt(match[3], 10);
            const minute = parseInt(match[4], 10);
            let year = today.getFullYear();
            if (new Date(year, month, day) > today) year--;
            return new Date(year, month, day, hour, minute);
        }

        const standardDate = new Date(dateString);
        if (!isNaN(standardDate.getTime())) return standardDate;

        return null;
    }

    /**
     * Finds and processes all date elements within a given root element.
     */
    function processElements(rootElement) {
        // Get the saved language, default to Indonesian ('id')
        const lang = GM_getValue('language', 'id');
        const t = translations[lang];

        const dateElements = rootElement.querySelectorAll('td.coll-date, span.list-item.item-uploaded label');

        dateElements.forEach(element => {
            if (element.dataset.ageCalculated) return;

            const dateString = element.textContent.trim();
            const pastDate = parseDate(dateString);

            if (!pastDate || isNaN(pastDate.getTime())) return;

            const age = calculateAge(pastDate, new Date());
            if (!age) return;

            // Build the age string using the selected language
            let ageString = '';
            if (age.years > 0) {
                ageString = `${age.years} ${age.years > 1 ? t.years : t.year}`;
                if (age.months > 0) ageString += ` ${age.months} ${age.months > 1 ? t.months : t.month}`;
            } else if (age.months > 0) {
                ageString = `${age.months} ${age.months > 1 ? t.months : t.month}`;
                if (age.days > 0) ageString += ` ${age.days} ${age.days > 1 ? t.days : t.day}`;
            } else if (age.days > 0) {
                ageString = `${age.days} ${age.days > 1 ? t.days : t.day}`;
            } else {
                ageString = t.today;
            }

            const totalMonths = age.years * 12 + age.months;
            let displayColor = 'green';
            if (totalMonths >= 12) displayColor = 'red';
            else if (totalMonths >= 1) displayColor = 'orange';

            element.textContent = ageString;
            element.style.color = displayColor;
            element.style.fontWeight = 'bold';
            element.style.textAlign = 'center';
            element.dataset.ageCalculated = 'true';
        });
    }

    // --- Main Execution ---
    processElements(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        processElements(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
