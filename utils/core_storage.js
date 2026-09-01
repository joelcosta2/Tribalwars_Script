// Storage safety layer: guards localStorage writes against quota exhaustion.

var storageQuotaWarningShown = false;

function isStorageQuotaError(error) {
    return error && (
        error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.code === 1014 ||
        /quota|storage full|exceeded/i.test(error.message || '')
    );
}

function reportStorageError(error, context) {
    if (!isStorageQuotaError(error)) {
        console.warn('[TW Storage] ' + context, error);
        return;
    }

    console.warn('[TW Storage] Storage quota exceeded while ' + context, error);
    if (storageQuotaWarningShown) return;
    storageQuotaWarningShown = true;

    const message = typeof t === 'function'
        ? t('core.storageQuotaExceeded')
        : 'Storage is full. Some data could not be saved.';
    if (typeof showAutoHideBox === 'function') {
        showAutoHideBox(message, true);
    } else {
        console.warn('[TW Storage] ' + message);
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        reportStorageError(error, 'saving ' + key);
        return false;
    }
}

function installLocalStorageQuotaHandler() {
    if (typeof Storage === 'undefined' || Storage.prototype.__twQuotaHandlerInstalled) return;

    const originalSetItem = Storage.prototype.setItem;
    const wrappedSetItem = function (key, value) {
        try {
            return originalSetItem.call(this, key, value);
        } catch (error) {
            reportStorageError(error, 'saving ' + key);
            throw error;
        }
    };
    wrappedSetItem.__twOriginalSetItem = originalSetItem;
    Storage.prototype.setItem = wrappedSetItem;
    Storage.prototype.__twQuotaHandlerInstalled = true;
}

installLocalStorageQuotaHandler();
