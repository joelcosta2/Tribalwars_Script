// Emoji URL map used by the notepad BBCode renderer.

const EMOJI_BASE_URL = 'https://media.innogamescdn.com/TribalWars/emoji/';
const EMOJI_CODEPOINTS = {
    grinning: '1f600',
    grin: '1f601',
    joy: '1f602',
    smiley: '1f603',
    smile: '1f604',
    sweat_smile: '1f605',
    laughing: '1f606',
    wink: '1f609',
    blush: '1f60a',
    yum: '1f60b',
    sunglasses: '1f60e',
    heart_eyes: '1f60d',
    kissing_heart: '1f618',
    kissing: '1f617',
    kissing_smiling_eyes: '1f619',
    kissing_closed_eyes: '1f61a',
    relaxed: '263a',
    slightly_smiling_face: '1f642',
    hugging_face: '1f917',
    'star-struck': '1f929',
    thinking_face: '1f914',
    rolling_on_the_floor_laughing: '1f923',
    neutral_face: '1f610',
    confused: '1f615',
    rage: '1f621',
    grimacing: '1f62c',
    money_mouth_face: '1f911',
    confounded: '1f616',
    flushed: '1f633',
    shushing_face: '1f92b',
    crystal_ball: '1f52e'
};
let emojiUrlMap = null;
let emojiEntries = null;

function getEmojiEntries() {
    if (emojiEntries) return emojiEntries;

    const entries = Object.entries(EMOJI_CODEPOINTS).map(function ([name, codepoints]) {
        return { name, url: `${EMOJI_BASE_URL}${codepoints}.png` };
    });
    if (typeof document !== 'undefined') {
        document.querySelectorAll('img.emoji-selectable[data-title][src]').forEach(function (image) {
            const name = image.dataset.title;
            const url = image.src;
            if (name && url.startsWith(EMOJI_BASE_URL) && !entries.some(entry => entry.name === name)) {
                entries.push({ name, url });
            }
        });
    }

    emojiEntries = entries;
    return emojiEntries;
}

function getEmojiUrl(name) {
    if (!name) return null;
    if (!emojiUrlMap) {
        emojiUrlMap = new Map(getEmojiEntries().map(entry => [entry.name.toLowerCase(), entry.url]));
    }
    return emojiUrlMap.get(String(name).toLowerCase()) || null;
}

function resetEmojiMapCache() {
    emojiUrlMap = null;
    emojiEntries = null;
}

window.PremiumFeaturesEmojiMap = {
    getEntries: getEmojiEntries,
    getUrl: getEmojiUrl,
    reset: resetEmojiMapCache
};
