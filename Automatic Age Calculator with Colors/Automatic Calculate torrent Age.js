// ==UserScript==
// @name         Automatic Age Calculator with Colors
// @namespace    https://github.com/Horyzontalhoror/user_script
// @version      1.2
// @description  Calculates and displays the age (time difference) from a date found on the page with color-coding.
// @author       Horyzontalhoror
// @match        https://1337x.to/*
// @match        https://thepiratebay.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Calculates the difference between two dates.
     * @param {Date} startDate - The start date (from the web page).
     * @param {Date} endDate - The end date (today).
     * @returns {object|null} - An object containing the difference in years, months, and days, or null if the start date is in the future.
     */
    function calculateAge(startDate, endDate) {
        if (startDate > endDate) {
            return null; // Return null if the start date is in the future
        }

        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();

        // If days are negative, borrow from months
        if (days < 0) {
            months--;
            // Get the number of days in the previous month
            days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
        }

        // If months are negative, borrow from years
        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    /**
     * Parses a date string from various known formats into a Date object.
     * This handles formats from 1337x.to and thepiratebay.org.
     * @param {string} dateString - The raw date string from the web page.
     * @returns {Date|null} - A Date object or null if parsing fails.
     */
    function parseDate(dateString) {
        // --- 1. Handle 1337x.to format: "2am Jul. 11th" or "11:50 Jun. 2nd" ---
        const l337xRegex = /(?:(\d{1,2}:\d{2})|(\d{1,2}))(am|pm)?\s+([A-Za-z]{3})\.\s+(\d{1,2})(?:st|nd|rd|th)/i;
        let match = dateString.match(l337xRegex);
        if (match) {
            const timePart = match[1]; // "HH:mm"
            let hourPart = match[2];   // "H"
            const ampmPart = match[3]; // "am" or "pm"

            let hour = 0;
            let minute = 0;

            if (timePart) { // Format like "11:50"
                const [h, m] = timePart.split(':');
                hour = parseInt(h, 10);
                minute = parseInt(m, 10);
            } else if (hourPart) { // Format like "2am"
                hour = parseInt(hourPart, 10);
                if (ampmPart && ampmPart.toLowerCase() === 'pm' && hour !== 12) {
                    hour += 12;
                }
                if (ampmPart && ampmPart.toLowerCase() === 'am' && hour === 12) {
                    hour = 0; // Midnight case
                }
            }

            const monthStr = match[4];
            const day = parseInt(match[5], 10);
            const monthMap = {'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5,'Jul':6,'Aug':7,'Sep':8,'Oct':9,'Nov':10,'Dec':11};
            const month = monthMap[monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase()];

            if (month === undefined) return null;

            const today = new Date();
            let year = today.getFullYear();
            const tentativeDate = new Date(year, month, day, hour, minute);

            // If the parsed date is in the future, assume it's from the previous year
            if (tentativeDate > today) {
                year--;
            }
            return new Date(year, month, day, hour, minute);
        }

        // --- 2. Handle ThePirateBay formats ---
        // e.g., "Today 03:23", "Y-day 20:15", "07-11 20:15", "2023-12-25 04:20"
        const today = new Date();
        if (dateString.startsWith('Today')) {
            const time = dateString.split(' ')[1];
            const [h, m] = time.split(':');
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
        }
        if (dateString.startsWith('Y-day')) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const time = dateString.split(' ')[1];
            const [h, m] = time.split(':');
            return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), h, m);
        }
        // Format "MM-DD HH:mm" (assumes current year)
        match = dateString.match(/^(\d{2})-(\d{2})\s(\d{2}):(\d{2})$/);
        if (match) {
            const month = parseInt(match[1], 10) - 1;
            const day = parseInt(match[2], 10);
            const hour = parseInt(match[3], 10);
            const minute = parseInt(match[4], 10);
            let year = today.getFullYear();
            const tentativeDate = new Date(year, month, day, hour, minute);
            if (tentativeDate > today) {
                year--;
            }
            return new Date(year, month, day, hour, minute);
        }

        // --- 3. Fallback to standard parsing ---
        const standardDate = new Date(dateString);
        if (!isNaN(standardDate.getTime())) {
            return standardDate;
        }

        return null; // Return null if no format matches
    }


    // --- Main Execution ---

    // Find all elements containing the date text on both supported sites
    const dateElements = document.querySelectorAll('td.coll-date, span.list-item.item-uploaded label');

    dateElements.forEach(element => {
        const dateString = element.textContent.trim();
        const pastDate = parseDate(dateString); // Use the new smart parsing function

        // If the date is invalid or couldn't be parsed, skip this element
        if (!pastDate || isNaN(pastDate.getTime())) {
            return;
        }

        const today = new Date();
        const age = calculateAge(pastDate, today);

        // If age couldn't be calculated (e.g., future date), skip
        if (!age) return;

        // Build the age string for display
        let ageString = '';
        if (age.years > 0) {
            ageString = `${age.years} year${age.years > 1 ? 's' : ''}`;
            if (age.months > 0) {
                ageString += ` ${age.months} month${age.months > 1 ? 's' : ''}`;
            }
        } else if (age.months > 0) {
            ageString = `${age.months} month${age.months > 1 ? 's' : ''}`;
            if (age.days > 0) {
                ageString += ` ${age.days} day${age.days > 1 ? 's' : ''}`;
            }
        } else if (age.days > 0) {
            ageString = `${age.days} day${age.days > 1 ? 's' : ''}`;
        } else {
            ageString = 'Today';
        }

        // Determine the color based on the age
        let displayColor = '';
        const totalMonths = age.years * 12 + age.months;
        if (totalMonths >= 12) {
            displayColor = 'red'; // 1 year or more
        } else if (totalMonths >= 1) {
            displayColor = 'orange'; // Between 1 month and 1 year
        } else {
            displayColor = 'green'; // Less than 1 month
        }

        // Create a new span element to display the calculated age
        const ageDisplay = document.createElement('span');
        ageDisplay.textContent = ` (${ageString})`;
        ageDisplay.style.color = displayColor;
        ageDisplay.style.fontWeight = 'bold';
        ageDisplay.style.marginLeft = '5px';

        // Insert the new element right after the original date element
        element.insertAdjacentElement('afterend', ageDisplay);
    });

})();
