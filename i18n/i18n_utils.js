// i18n utils - dictionary loading, language detection and translation lookup

var DEFAULT_LANGUAGE = 'en';
var SUPPORTED_LANGUAGES = ['en', 'pt'];

var i18nDictionaries = {};

/**
 * Reads the active language from settings_cookies, falling back to the
 * browser language (if supported) and finally to DEFAULT_LANGUAGE.
 */
function getCurrentLanguage() {
    var stored = settings_cookies && settings_cookies.general && settings_cookies.general.language;
    if (stored && SUPPORTED_LANGUAGES.indexOf(stored) !== -1) {
        return stored;
    }

    var browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    return SUPPORTED_LANGUAGES.indexOf(browserLang) !== -1 ? browserLang : DEFAULT_LANGUAGE;
}

/**
 * Persists the chosen language in settings_cookies and reloads the page so
 * every widget re-renders with the new language.
 */
function setLanguage(lang) {
    if (SUPPORTED_LANGUAGES.indexOf(lang) === -1) return;
    settings_cookies.general.language = lang;
    safeLocalStorageSet('settings_cookies', JSON.stringify(settings_cookies));
    location.reload();
}

/**
 * Loads and caches the JSON dictionary for a language.
 * Dictionaries are declared in the userscript header as @resource entries
 * named i18n_<lang> (e.g. i18n_en -> i18n/en.json) and read synchronously
 * via GM_getResourceText, so no extra network/CORS handling is needed.
 */
function loadI18nDictionary(lang) {
    if (i18nDictionaries[lang]) {
        return i18nDictionaries[lang];
    }

    var dictionary = {};
    try {
        var raw = GM_getResourceText('i18n_' + lang);
        dictionary = raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn('[i18n] Failed to load dictionary for "' + lang + '":', e);
    }

    i18nDictionaries[lang] = dictionary;
    return dictionary;
}

/**
 * Translates `key` using the current language, falling back to English and
 * finally to the key itself if no translation is found. Supports
 * {{placeholder}} interpolation via `vars`.
 *
 * Keys are literal strings (e.g. "button.save"), not nested objects, so they
 * stay grep-able across the project.
 *
 * Usage: t('settings.language') -> "Language"
 *        t('button.greeting', { name: 'Ann' }) -> "Hello, Ann!"
 */
function t(key, vars) {
    var lang = getCurrentLanguage();
    var text = loadI18nDictionary(lang)[key];

    if (typeof text !== 'string' && lang !== DEFAULT_LANGUAGE) {
        text = loadI18nDictionary(DEFAULT_LANGUAGE)[key];
    }

    if (typeof text !== 'string') {
        return key;
    }

    if (vars) {
        Object.keys(vars).forEach(function (varName) {
            text = text.replace(new RegExp('{{\\s*' + varName + '\\s*}}', 'g'), vars[varName]);
        });
    }

    return text;
}
