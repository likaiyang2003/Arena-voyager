(function() {
    'use strict';

    const root = globalThis.__LMNAV__;
    if (!root) {
        return;
    }

    const PREFIX = 'lmnav.';

    function hasChromeStorage() {
        try {
            return Boolean(chrome?.storage?.local);
        } catch {
            return false;
        }
    }

    function localStorageGet(key, fallbackValue) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            return raw === null ? fallbackValue : JSON.parse(raw);
        } catch {
            return fallbackValue;
        }
    }

    function localStorageSet(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error('[LMArena Navigator] localStorage write failed:', error);
        }
        return Promise.resolve();
    }

    function get(key, fallbackValue) {
        if (!hasChromeStorage()) {
            return Promise.resolve(localStorageGet(key, fallbackValue));
        }

        return new Promise((resolve) => {
            chrome.storage.local.get({
                [PREFIX + key]: fallbackValue
            }, (items) => {
                if (chrome.runtime?.lastError) {
                    console.warn('[LMArena Navigator] chrome.storage read failed:', chrome.runtime.lastError.message);
                    resolve(localStorageGet(key, fallbackValue));
                    return;
                }
                resolve(items[PREFIX + key]);
            });
        });
    }

    function set(key, value) {
        if (!hasChromeStorage()) {
            return localStorageSet(key, value);
        }

        return new Promise((resolve) => {
            chrome.storage.local.set({
                [PREFIX + key]: value
            }, () => {
                if (chrome.runtime?.lastError) {
                    console.warn('[LMArena Navigator] chrome.storage write failed:', chrome.runtime.lastError.message);
                    localStorageSet(key, value).then(resolve);
                    return;
                }
                resolve();
            });
        });
    }

    async function getMany(defaults) {
        const result = {};
        const entries = Object.entries(defaults);
        for (const [ key, fallbackValue ] of entries) {
            result[key] = await get(key, fallbackValue);
        }
        return result;
    }

    root.storage = {
        get: get,
        set: set,
        getMany: getMany
    };
})();
