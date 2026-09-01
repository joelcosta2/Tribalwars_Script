// Coin minting widget

var coinMintingState = {
    popup: null,
    loading: false,
    academyByVillage: {},
    academyRequests: {}
};

function getCoinMintingWorldKey() {
    return 'coin_minting_academies_' + (game_data?.world || window.location.hostname);
}

function getCoinMintingAcademies() {
    try {
        const stored = JSON.parse(localStorage.getItem(getCoinMintingWorldKey()) || '[]');
        return new Set(Array.isArray(stored) ? stored.map(String) : []);
    } catch {
        return new Set();
    }
}

function saveCoinMintingAcademy(villageId) {
    const academies = getCoinMintingAcademies();
    academies.add(String(villageId));
    localStorage.setItem(getCoinMintingWorldKey(), JSON.stringify(Array.from(academies)));
}

async function fetchCoinMintingVillages() {
    await refreshOverviewVillagesResources();
    let cached;
    try {
        cached = JSON.parse(localStorage.getItem('villages_info') || '[]');
    } catch {
        cached = [];
    }
    return (Array.isArray(cached) ? cached : []).map(village => {
        const url = new URL(village.url, window.location.origin);
        const id = url.searchParams.get('village');
        return id ? {
            id: String(id),
            name: village.name || id,
            url: url.toString(),
            resources: getVillageResources(id)
        } : null;
    }).filter(Boolean);
}

function coinMintingAcademyStateFromDocument(doc) {
    const heading = Array.from(doc.querySelectorAll('h2, h3, .caption'))
        .map(element => element.textContent.replace(/\s+/g, ' ').trim())
        .find(text => /academia|academy|akademie/i.test(text));
    if (!heading) return 'unknown';
    if (/não\s+constru|not\s+built|nicht\s+gebaut/i.test(heading)) return 'absent';
    if (/(nível|level|stufe)\s*\d+/i.test(heading)) return 'built';
    return 'unknown';
}

async function fetchCoinMintingAcademy(villageId) {
    const id = String(villageId);
    const known = getCoinMintingAcademies();
    if (known.has(id)) return 'built';
    if (coinMintingState.academyRequests[id]) return coinMintingState.academyRequests[id];

    coinMintingState.academyRequests[id] = fetch(getVillageLinkBase(id) + 'snob&mode=train', { credentials: 'include' })
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.text();
        })
        .then(html => coinMintingAcademyStateFromDocument(new DOMParser().parseFromString(html, 'text/html')))
        .then(state => {
            coinMintingState.academyByVillage[id] = state;
            if (state === 'built') saveCoinMintingAcademy(id);
            return state;
        })
        .catch(() => {
            coinMintingState.academyByVillage[id] = 'unknown';
            return 'unknown';
        });
    return coinMintingState.academyRequests[id];
}

function coinMintingCanUse(settings) {
    return settings?.coin_enabled === true &&
        [settings.coin_wood, settings.coin_stone, settings.coin_iron].every(value => Number.isFinite(value) && value > 0);
}

function coinMintingText(key, fallback) {
    try { return t(key); } catch { return fallback; }
}

function closeCoinMintingPopup() {
    coinMintingState.popup?.remove();
    coinMintingState.popup = null;
}

function createCoinMintingInput(village, maxCoins, disabled) {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(maxCoins);
    input.value = '0';
    input.dataset.villageId = village.id;
    input.disabled = disabled || maxCoins < 1;
    input.style.width = '55px';
    return input;
}

async function mintCoinsFromVillages(villages, settings, button, status) {
    if (coinMintingState.loading) return;
    const inputs = Array.from(coinMintingState.popup.querySelectorAll('input[data-village-id]'));
    const selected = inputs.map(input => ({ id: input.dataset.villageId, amount: parseInt(input.value, 10) || 0 }))
        .filter(item => item.amount > 0);
    if (!selected.length) {
        status.textContent = coinMintingText('coinMinting.selectVillage', 'Select at least one coin.');
        return;
    }

    const selectedWithCurrentResources = selected.map(item => ({
        ...item,
        resources: getVillageResources(item.id)
    }));
    if (selectedWithCurrentResources.some(item => !item.resources ||
        item.amount > Math.floor(Math.min(
            item.resources.wood / settings.coin_wood,
            item.resources.stone / settings.coin_stone,
            item.resources.iron / settings.coin_iron
        )))) {
        status.textContent = coinMintingText('coinMinting.insufficientResources', 'There are not enough resources.');
        return;
    }

    coinMintingState.loading = true;
    button.disabled = true;
    status.textContent = coinMintingText('common.loading', 'Loading\u2026');
    try {
        const body = new URLSearchParams();
        selected.forEach(item => body.append('villages[' + item.id + ']', String(item.amount)));
        const response = await fetch(getVillageLinkBase(game_data.village.id) + 'snob&ajaxaction=coin_multi&h=' + encodeURIComponent(game_data.csrf), {
            method: 'POST', credentials: 'include', body,
            headers: { 'TribalWars-Ajax': '1', 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        if (result.error) throw new Error(Array.isArray(result.error) ? result.error[0] : result.error);
        status.textContent = result.message || coinMintingText('coinMinting.success', 'Coins minted successfully.');
        invalidateVillageResources(selected.map(item => item.id));
        await refreshOverviewVillagesResources({ force: true });
        villages.forEach(village => { village.resources = getVillageResources(village.id); });
        await renderCoinMintingTable(villages, settings);
    } catch (error) {
        status.textContent = error.message || coinMintingText('coinMinting.errorMinting', 'Could not mint coins.');
    } finally {
        coinMintingState.loading = false;
        button.disabled = false;
    }
}

async function renderCoinMintingTable(villages, settings) {
    const table = coinMintingState.popup.querySelector('table');
    const status = coinMintingState.popup.querySelector('.coin-minting-status');
    const mintButton = coinMintingState.popup.querySelector('.coin-minting-submit');
    coinMintingState.popup.querySelector('.coin-minting-no-academy')?.remove();
    table.innerHTML = '';
    const header = table.insertRow();
    [t('common.village'), t('common.wood'), t('common.clay'), t('common.iron'), t('coinMinting.maxHeader'), t('overviewVillages.manualGroupsQuantity')].forEach(label => {
        const cell = document.createElement('th'); cell.textContent = label; header.appendChild(cell);
    });

    const academyStates = await Promise.all(villages.map(village => fetchCoinMintingAcademy(village.id)));
    status.replaceChildren();
    if (!academyStates.includes('built')) {
        const info = document.createElement('div');
        info.className = 'info_box coin-minting-no-academy';
        info.textContent = coinMintingText('coinMinting.noAcademy', 'No village has an Academy built.');
        coinMintingState.popup.insertBefore(info, table);
        mintButton.disabled = true;
    } else {
        mintButton.disabled = false;
    }
    villages.forEach((village, index) => {
        const row = table.insertRow();
        const resources = getVillageResources(village.id);
        const hasResources = resources && ['wood', 'stone', 'iron'].every(resource => Number.isFinite(resources[resource]));
        const maxCoins = hasResources
            ? Math.max(0, Math.floor(Math.min(resources.wood / settings.coin_wood, resources.stone / settings.coin_stone, resources.iron / settings.coin_iron)))
            : 0;
        const built = academyStates[index] === 'built';
        [village.name, hasResources ? resources.wood : '?', hasResources ? resources.stone : '?', hasResources ? resources.iron : '?', built && hasResources ? maxCoins : '?']
            .forEach(value => { const cell = row.insertCell(); cell.textContent = String(value); });
        const inputCell = row.insertCell();
        inputCell.appendChild(createCoinMintingInput(village, maxCoins, !built || !hasResources));
        if (!built || !hasResources) row.style.opacity = '0.55';
    });
    mintButton.onclick = () => mintCoinsFromVillages(villages, settings, mintButton, status);
}

async function openCoinMintingPopup() {
    const shortcutSetting = settings_cookies.general.show__widget_popup_shortcuts;
    if (shortcutSetting?.enabled === false || shortcutSetting?.coinMinting === false) return;
    if (coinMintingState.popup) { closeCoinMintingPopup(); return; }
    const settings = await fetchAndCacheWorldSettings();
    if (!coinMintingCanUse(settings)) {
        showAutoHideBox(coinMintingText('coinMinting.unsupportedWorld', 'This world does not support coin minting.'), true);
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'popup_style borderimage popup_box';
    popup.style.cssText = 'position:fixed;z-index:10000;top:8%;left:50%;transform:translateX(-50%);width:760px;max-width:95vw;max-height:85vh;overflow:auto;';
    const title = document.createElement('h2'); title.textContent = coinMintingText('coinMinting.title', 'Mint coins');
    const close = document.createElement('button'); close.type = 'button'; close.textContent = t('button.close'); close.className = 'btn'; close.style.cssText = 'float:right;'; close.onclick = closeCoinMintingPopup;
    const status = document.createElement('p'); status.className = 'coin-minting-status'; status.appendChild(createWidgetLoadingElement('30px'));
    const table = document.createElement('table'); table.className = 'vis'; table.style.width = '100%';
    const button = document.createElement('input'); button.type = 'button'; button.className = 'btn coin-minting-submit'; button.value = coinMintingText('coinMinting.submit', 'Mint selected');
    popup.append(close, title, status, table, button);
    document.body.appendChild(popup);
    coinMintingState.popup = popup;
    try {
        const villages = await fetchCoinMintingVillages();
        await renderCoinMintingTable(villages, settings);
    } catch (error) {
        status.textContent = error.message || coinMintingText('coinMinting.errorVillages', 'Could not load villages.');
    }
}

