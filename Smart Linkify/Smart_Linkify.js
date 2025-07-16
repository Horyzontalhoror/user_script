// ==UserScript==
// @name         Smart Linkify (with Settings Menu)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Converts all types of URLs into links. Can be taught new patterns via a menu.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// ==/UserScript==

(function() {
    'use strict';

    // --- CORE FUNCTIONS ---

    /**
     * Converts a URL string into a flexible Regex.
     * @param {string} str - The example URL string.
     * @returns {RegExp|null} - A RegExp object or null if the URL is invalid.
     */
    function createRegexFromString(str) {
        try {
            // Extract the domain from the example URL
            const url = new URL(str);
            const domain = url.hostname;
            // Create a regex that will match all URLs from that domain
            // Example: https://example.com/page.html -> /https?:\/\/example\.com[\S]+/gi
            const pattern = `https?://${domain.replace(/\./g, '\\.')}[\\S]+`;
            return new RegExp(pattern, 'gi');
        } catch (e) {
            console.error('Invalid URL:', str);
            return null;
        }
    }

    /**
     * Function to linkify text within a node.
     * @param {Node} node - The text node to process.
     * @param {RegExp[]} regexArray - An array of RegExp objects to apply.
     */
    function linkify(node, regexArray) {
        const parent = node.parentNode;
        // Do not process nodes inside scripts, styles, or existing links
        if (!parent || ['SCRIPT', 'STYLE', 'A'].includes(parent.tagName)) {
            return;
        }

        let originalText = node.textContent;
        let modifiedText = originalText;

        // Apply each regex from the array
        regexArray.forEach(regex => {
            if (regex) {
                // The 'g' flag in the regex ensures all occurrences are replaced
                modifiedText = modifiedText.replace(regex, (url) => {
                    // Check to avoid creating a link inside an existing one
                    if (modifiedText.includes(`<a href="${url}"`)) return url;
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
                });
            }
        });

        // If the text was changed, replace the node with the new HTML content
        if (originalText !== modifiedText) {
            const tempContainer = document.createElement('span');
            tempContainer.innerHTML = modifiedText;
            parent.replaceChild(tempContainer, node);
        }
    }

    // --- SETTINGS AND MENU ---

    // Register a menu command to add a new pattern
    GM_registerMenuCommand('Add New URL Pattern', async () => {
        const exampleUrl = prompt('Enter one full example URL that you want to turn into a link:');
        if (exampleUrl) {
            const storedPatterns = JSON.parse(await GM_getValue('customPatterns', '[]'));
            const newPattern = createRegexFromString(exampleUrl)?.source;

            if (newPattern && !storedPatterns.includes(newPattern)) {
                storedPatterns.push(newPattern);
                await GM_setValue('customPatterns', JSON.stringify(storedPatterns));
                alert(`Pattern for "${new URL(exampleUrl).hostname}" has been added.\nReload the page to see the changes.`);
            } else if (!newPattern) {
                alert('Failed to create pattern. Make sure the URL you entered is correct.');
            } else {
                alert('That pattern already exists.');
            }
        }
    });

    // Register a menu command to delete all saved patterns
    GM_registerMenuCommand('Delete All Saved Patterns', async () => {
        if (confirm('Are you sure you want to delete all the URL patterns you have taught?')) {
            await GM_deleteValue('customPatterns');
            alert('All saved patterns have been deleted. Reload the page.');
        }
    });

    // --- SCRIPT EXECUTION ---

    async function runLinkifier() {
        // Default (hardcoded) patterns
        const baseRegexPatterns = [
            /\[img\](https?:\/\/[^\s\[\]]+\.(?:jpg|jpeg|png|gif|webp))\[\/img\]/gi, // For BBCode images
            /(https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp))/gi, // For direct image links
        ];

        // Retrieve taught patterns from storage
        const storedPatternsJSON = await GM_getValue('customPatterns', '[]');
        const customRegexes = JSON.parse(storedPatternsJSON).map(pattern => new RegExp(pattern, 'gi'));

        // Combine all patterns
        const allRegexes = [...baseRegexPatterns, ...customRegexes];

        // Process the page using XPath to find all text nodes
        const textNodes = document.evaluate(".//text()", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < textNodes.snapshotLength; i++) {
            linkify(textNodes.snapshotItem(i), allRegexes);
        }
    }

    // Run the script when the page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runLinkifier);
    } else {
        runLinkifier();
    }

})();