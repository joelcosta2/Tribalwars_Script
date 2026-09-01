// BBCode-to-HTML rendering for the native memo and custom notepad widgets.

/**
 * Converts common BBCode tags in a string to equivalent HTML markup.
 * Supports [b], [i], [u], [s], [url]/[url=], [quote]/[quote=Author], [spoiler]/[spoiler=Title],
 * [size=N], [color=#hex|name], [unit]name[/unit], [building]name[/building],
 * [table]/[**]..[/**]/[*] (native memo doesn't render this itself —
 * see notes in notepad.js) and [player]/[ally]/[coord] (rendered as placeholders,
 * resolved asynchronously to real game links by resolveNotepadBBCodeLinks() in notepad.js).
 * Emoji tokens such as :grinning: are rendered from the emoji map when available.
 * @param {string} text
 * @returns {string}
 */
function convertBBCodeToHTML(text) {
    if (!text) return text;

    // Escape raw HTML first so pasted markup/scripts can't run via innerHTML (quotes too, since
    // several tags below interpolate captured text into HTML attributes); escapeHtml leaves
    // [ and ] untouched so the bbcode substitutions below still match.
    text = escapeHtml(text, true);

    // TribalWars stores picker selections as :emoji_name: tokens. Unknown tokens stay as text.
    const emojiLookup = typeof getEmojiUrl === 'function'
        ? getEmojiUrl
        : (typeof window !== 'undefined' && window.PremiumFeaturesEmojiMap
            ? window.PremiumFeaturesEmojiMap.getUrl
            : null);
    if (emojiLookup) {
        text = text.replace(/:([a-z0-9_+\-]+):/gi, function (match, name) {
            const emojiUrl = emojiLookup(name);
            if (!emojiUrl) return match;
            const safeName = escapeHtml(name, true);
            return `<img alt="${safeName}" class="emoji" src="${emojiUrl}">`;
        });
    }

    const bbcodeAssetBase = typeof image_base !== 'undefined'
        ? image_base
        : 'https://dspt.innogamescdn.com/asset/95eda994/graphic/';
    const unitIcons = new Set([
        'spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy',
        'ram', 'catapult', 'knight', 'snob', 'militia'
    ]);
    const buildingIcons = new Set([
        'main', 'barracks', 'stable', 'garage', 'church', 'watchtower', 'snob',
        'smith', 'place', 'statue', 'market', 'wood', 'stone', 'iron', 'farm',
        'storage', 'hide', 'wall'
    ]);

    text = text.replace(/\[unit\]([a-z]+)\[\/unit\]/gi, function (match, unit) {
        const iconName = unit.toLowerCase();
        if (!unitIcons.has(iconName)) return match;
        return `<img src="${bbcodeAssetBase}unit/unit_${iconName}.webp" title="${escapeHtml(iconName, true)}" alt="${escapeHtml(iconName, true)}" style="vertical-align:middle;">`;
    });
    text = text.replace(/\[building\]([a-z]+)\[\/building\]/gi, function (match, building) {
        const iconName = building.toLowerCase();
        if (!buildingIcons.has(iconName)) return match;
        return `<img src="${bbcodeAssetBase}buildings/${iconName}.webp" title="${escapeHtml(iconName, true)}" alt="${escapeHtml(iconName, true)}" style="vertical-align:middle;">`;
    });

    // [table]...[/table]: optional [**]h1[||]h2[/**] header row, then [*]c1[|]c2 data rows (no
    // closing tag per row — the next [*] or [/table] ends it, matching the native toolbar's own
    // snippet). Runs before the tag map below so bbcode nested inside cells still gets converted.
    text = text.replace(/\[table\]([\s\S]*?)\[\/table\]/gi, function (match, inner) {
        let headerHtml = '';
        let rowsSource = inner;

        const headerMatch = inner.match(/\[\*\*\]([\s\S]*?)\[\/\*\*\]/i);
        if (headerMatch) {
            headerHtml = '<tr>' + headerMatch[1].split(/\[\|\|\]/).map(function (cell) {
                return `<th>${cell.trim()}</th>`;
            }).join('') + '</tr>';
            rowsSource = inner.slice(0, headerMatch.index) + inner.slice(headerMatch.index + headerMatch[0].length);
        }

        const rowsHtml = rowsSource.split(/\[\*\]/).slice(1).map(function (row) {
            return '<tr>' + row.split(/\[\|\]/).map(function (cell) {
                return `<td>${cell.trim()}</td>`;
            }).join('') + '</tr>';
        }).join('');

        return `<table class="vis" width="100%" style="margin:4px 0;">${headerHtml}${rowsHtml}</table>`;
    });

    const bbcodeMap = {
        '\\[b\\](.*?)\\[/b\\]': '<strong>$1</strong>',   // [b]bold[/b] -> <strong>bold</strong>
        '\\[i\\](.*?)\\[/i\\]': '<em>$1</em>',         // [i]italic[/i] -> <em>italic</em>
        '\\[u\\](.*?)\\[/u\\]': '<u>$1</u>',           // [u]underline[/u] -> <u>underline</u>
        '\\[s\\](.*?)\\[/s\\]': '<del>$1</del>',       // [s]strikethrough[/s] -> <del>strikethrough</del>
        '\\[url\\](.*?)\\[/url\\]': '<a href="$1" target="_blank">$1</a>' // [url]link[/url] -> <a>
    };

    for (const bbcode in bbcodeMap) {
        const regex = new RegExp(bbcode, 'gi');
        text = text.replace(regex, bbcodeMap[bbcode]);
    }

    // Handle [url=link]Text[/url] with an explicit label
    text = text.replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, function (match, link, label) {
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            link = "https://" + link;
        }
        return `<a href="${link}" target="_blank">${label}</a>`;
    });

    // [quote=Author]...[/quote] and bare [quote]...[/quote] ([\s\S] so multi-line quotes work)
    text = text.replace(/\[quote=(.*?)\]([\s\S]*?)\[\/quote\]/gi, function (match, author, content) {
        return `<div class="quote-box" style="border:1px solid #7d510f;background:#fff3d3;padding:4px 6px;margin:4px 0;"><div style="font-weight:bold;">${t('format.quoteWrote', { author })}</div><div>${content}</div></div>`;
    });
    text = text.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<div class="quote-box" style="border:1px solid #7d510f;background:#fff3d3;padding:4px 6px;margin:4px 0;">$1</div>');

    // [spoiler=Title]...[/spoiler] and bare [spoiler]...[/spoiler] -> reuses the game's own native
    // markup/CSS (.spoiler) and toggle_spoiler() global so it looks/behaves exactly like the native memo.
    text = text.replace(/\[spoiler=(.*?)\]([\s\S]*?)\[\/spoiler\]/gi, function (match, title, content) {
        return `<div class="spoiler"><input type="button" value="${title}" onclick="toggle_spoiler(this)"><div><span style="display:none">${content}</span></div></div>`;
    });
    text = text.replace(/\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi, function (match, content) {
        return `<div class="spoiler"><input type="button" value="${t('format.spoiler')}" onclick="toggle_spoiler(this)"><div><span style="display:none">${content}</span></div></div>`;
    });

    // [size=6|7|9|12|20]...[/size] -> point scale matching the toolbar's very small..very large labels
    text = text.replace(/\[size=(\d+)\]([\s\S]*?)\[\/size\]/gi, function (match, size, content) {
        return `<span style="font-size:${parseInt(size, 10)}pt">${content}</span>`;
    });

    // [color=#hex|name]...[/color] -> value is restricted to a safe pattern before going into a style attribute
    text = text.replace(/\[color=(#[0-9a-f]{3,8}|[a-z]+)\]([\s\S]*?)\[\/color\]/gi, function (match, color, content) {
        return `<span style="color:${color}">${content}</span>`;
    });

    // [player]Name[/player], [ally]Name[/ally], [coord]X|Y[/coord] -> lightweight placeholders;
    // resolveNotepadBBCodeLinks() looks these up via cached map data and upgrades them to real game links.
    text = text.replace(/\[player\](.*?)\[\/player\]/gi, function (match, name) {
        return `<span class="tw-bbcode-pending" data-bb-type="player" data-bb-value="${name}">${name}</span>`;
    });
    text = text.replace(/\[ally\](.*?)\[\/ally\]/gi, function (match, name) {
        return `<span class="tw-bbcode-pending" data-bb-type="ally" data-bb-value="${name}">${name}</span>`;
    });
    text = text.replace(/\[coord\](\d+\|\d+)\[\/coord\]/gi, function (match, coord) {
        return `<span class="tw-bbcode-pending" data-bb-type="coord" data-bb-value="${coord}">${coord}</span>`;
    });

    return text;
}
