// ==UserScript==
// @name         Automatic Age Calculator with Colors
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculates and displays the age (time difference) from a date found on the page with color-coding.
// @author       You
// @match        https://1337x.to/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Function to calculate the difference between two dates.
     * @param {Date} startDate - The start date (from the web page).
     * @param {Date} endDate - The end date (today).
     * @returns {object|null} - An object containing the difference in years, months, and days, or null if start date is in the future.
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

    // Find all the elements containing the date text
    const dateLabels = document.querySelectorAll('span.list-item.item-uploaded label');

    dateLabels.forEach(label => {
        const dateString = label.textContent.trim();
        const pastDate = new Date(dateString);
        const today = new Date();

        // If the date is invalid, skip this element
        if (isNaN(pastDate.getTime())) {
            return;
        }

        const age = calculateAge(pastDate, today);

        // If age couldn't be calculated (e.g., future date), skip
        if (!age) return;

        // Build the age string for display
        let ageString = '';
        if (age.years > 0) {
            ageString = `${age.years} years`;
            if (age.months > 0) {
                ageString += ` ${age.months} months`;
            }
        } else if (age.months > 0) {
            ageString = `${age.months} months`;
            if (age.days > 0) {
                ageString += ` ${age.days} days`;
            }
        } else if (age.days > 0) {
            ageString = `${age.days} days`;
        } else {
            ageString = 'Today';
        }

        // --- UPDATED SECTION: COLORING LOGIC ---
        let displayColor = '';
        if (age.years >= 1) {
            // Rule 1: 1 year or more = RED
            displayColor = 'red';
        } else if (age.months === 0 || (age.months === 1 && age.days === 0)) {
            // Rule 2: 1 month or less = GREEN
            displayColor = 'green';
        } else {
            // Rule 3: Between 1 month and 1 year = ORANGE
            displayColor = 'orange';
        }
        // --- END OF UPDATED SECTION ---

        // Create a new span element to display the calculated age
        const ageDisplay = document.createElement('span');
        ageDisplay.textContent = ` (${ageString})`;
        ageDisplay.style.color = displayColor; // Apply the determined color
        ageDisplay.style.fontWeight = 'bold';   // Make it bold for better visibility
        ageDisplay.style.marginLeft = '5px';    // Add some space

        // Insert the new element right after the original date label
        label.insertAdjacentElement('afterend', ageDisplay);
    });

})();
