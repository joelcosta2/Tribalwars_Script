// Shared custom actions for the native VillageContext menu.

const _ctxCustomActions = new Map();
let _ctxCustomStarted = false;
let _ctxCustomCurrentContext = null;
let _ctxCustomFallbackAnchor = null;

function ctxCustomScheduleRender(attempt = 0) {
    const villageContextOpen = typeof VillageContext !== 'undefined' && VillageContext._open;
    const infoButton = document.getElementById('ctx_info');
    if (!villageContextOpen && (!infoButton || !_ctxCustomFallbackAnchor)) {
        if (attempt < 100) setTimeout(() => ctxCustomScheduleRender(attempt + 1), 50);
        return;
    }
    ctxCustomRender(_ctxCustomFallbackAnchor);
}

function parseCtxCustomCoordinates(anchor) {
    const link = anchor?.querySelector('a[href*="screen=info_village"]') || anchor?.querySelector('a');
    const toCoordinates = (x, y) => {
        const parsedX = Number(x);
        const parsedY = Number(y);
        return parsedX <= 999 && parsedY <= 999 ? { x: parsedX, y: parsedY } : null;
    };
    const text = link?.textContent || '';
    const textMatch = text.match(/(?:^|[^\d])(\d{1,3})\|(\d{1,3})(?!\d)/);
    const textCoordinates = textMatch && toCoordinates(textMatch[1], textMatch[2]);
    if (textCoordinates) return textCoordinates;

    let container = anchor;
    while (container) {
        const cellMatch = Array.from(container.querySelectorAll?.('td') || [])
            .map(cell => cell.textContent || '')
            .map(cellText => cellText.match(/(?:^|[^\d])(\d{1,3})\|(\d{1,3})(?!\d)/))
            .find(Boolean);
        const cellCoordinates = cellMatch && toCoordinates(cellMatch[1], cellMatch[2]);
        if (cellCoordinates) return cellCoordinates;
        container = container.parentElement;
    }

    const href = link?.getAttribute('href') || '';
    const hrefMatch = href.match(/[?&](?:x|coord_x)=(\d{1,3}).*?[&](?:y|coord_y)=(\d{1,3})/);
    const hrefCoordinates = hrefMatch && toCoordinates(hrefMatch[1], hrefMatch[2]);
    if (hrefCoordinates) return hrefCoordinates;

    const hashMatch = href.match(/#(\d{1,3})[;,](\d{1,3})(?:$|&)/);
    const hashCoordinates = hashMatch && toCoordinates(hashMatch[1], hashMatch[2]);
    if (hashCoordinates) return hashCoordinates;
    return null;
}

function getCtxCustomVillageData(villageId) {
    if (!villageId) return null;

    const mapVillage = typeof TWMap !== 'undefined'
        ? Object.values(TWMap.villages || {}).find(village => String(village.id) === String(villageId))
        : null;
    if (mapVillage?.xy) {
        const coordinates = String(mapVillage.xy).match(/^(\d{1,3})(\d{1,3})$/);
        if (coordinates) {
            return {
                ownerId: mapVillage.owner || mapVillage.owner_id || null,
                x: Number(coordinates[1]),
                y: Number(coordinates[2])
            };
        }
    }

    if (typeof mapDataGetRaw !== 'function') return null;
    const raw = mapDataGetRaw('map_villages');
    const match = raw?.match(new RegExp(`^${villageId},[^,]+,(\\d{1,3}),(\\d{1,3}),(\\d+),`, 'm'));
    return match ? { ownerId: match[4], x: Number(match[2]), y: Number(match[3]) } : null;
}

function getCtxCustomContext(anchor = null) {
    const nativeAnchor = typeof VillageContext !== 'undefined'
        ? VillageContext._current_anchor?.parent()?.[0]
        : null;
    const villageAnchor = anchor || nativeAnchor;
    if (!villageAnchor) return null;

    const coordinates = parseCtxCustomCoordinates(villageAnchor);
    const villageLink = villageAnchor.querySelector('a[href*="screen=info_village"]') || villageAnchor.querySelector('a');
    const villageIdMatch = (villageLink?.getAttribute('href') || '').match(/[?&]id=(\d+)/);
    const villageId = villageAnchor.dataset.id || villageIdMatch?.[1] || null;
    const cachedVillage = getCtxCustomVillageData(villageId);
    const resolvedCoordinates = coordinates || cachedVillage;
    return {
        anchor: villageAnchor,
        villageId,
        ownerId: villageAnchor.dataset.player || cachedVillage?.ownerId || null,
        x: resolvedCoordinates?.x ?? null,
        y: resolvedCoordinates?.y ?? null,
        coords: resolvedCoordinates ? `${resolvedCoordinates.x}|${resolvedCoordinates.y}` : null,
        menuParent: typeof VillageContext !== 'undefined'
            ? VillageContext._current_anchor?.[0]?.offsetParent || null
            : null
    };
}

function ctxCustomCreateAnchor(action, context) {
    const element = document.createElement('a');
    element.className = `village_ctx ctx-custom ${action.className || ''} ${action.spriteClass || ''}`.trim();
    element.id = `ctx_${action.id}`;
    element.href = '#';
    element.title = action.title || '';
    element.setAttribute('aria-label', action.title || '');

    const rendered = action.render?.(context, element);
    if (rendered === false) return null;
    if (rendered instanceof Node && rendered !== element) return rendered;

    element.onclick = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        action.onClick?.(context, element, event);
        return false;
    };
    return element;
}

function ctxCustomClear() {
    document.querySelectorAll('.ctx-custom').forEach(element => element.remove());
    _ctxCustomCurrentContext = null;
}

const CTX_CUSTOM_SLOT_OFFSETS = [
    { left: -64, top: 0 },
    { left: 64, top: 0 },
    { left: -64, top: -32 },
    { left: 64, top: -32 },
    { left: -64, top: 32 },
    { left: 64, top: 32 }
];

function getCtxCustomPosition(index, infoLeft, infoTop) {
    const offset = CTX_CUSTOM_SLOT_OFFSETS[index];
    if (!offset) return null;
    return {
        left: infoLeft + offset.left,
        top: infoTop + offset.top
    };
}

function ctxCustomRender(anchor = null) {
    ctxCustomClear();
    const currentAnchor = anchor || VillageContext._current_anchor?.parent()?.[0];
    if (!currentAnchor) return;

    const context = getCtxCustomContext(currentAnchor);
    const infoButton = document.getElementById('ctx_info');
    const menuParent = infoButton?.offsetParent || context?.menuParent;
    if (!context || !menuParent) return;

    _ctxCustomCurrentContext = context;
    if (!infoButton) return;

    const infoLeft = parseFloat(infoButton.style.left);
    const infoTop = parseFloat(infoButton.style.top);
    if (!Number.isFinite(infoLeft) || !Number.isFinite(infoTop)) return;

    Array.from(_ctxCustomActions.values())
        .sort((firstAction, secondAction) => (firstAction.slot || 99) - (secondAction.slot || 99))
        .forEach(action => {
        const element = ctxCustomCreateAnchor(action, context);
        if (!element) return;
        const slot = Number.isInteger(action.slot) ? action.slot : 1;
        const position = getCtxCustomPosition(slot - 1, infoLeft, infoTop);
        if (!position) return;
        element.style.left = `${position.left}px`;
        element.style.top = `${position.top}px`;
        element.dataset.ctxCustomAction = action.id;
        menuParent.appendChild(element);
    });

    UI.ToolTip('[title]');
}

function registerCtxCustomAction(action) {
    if (!action?.id) throw new Error('ctxCustom actions require an id');
    _ctxCustomActions.set(action.id, action);
    if (_ctxCustomStarted) ctxCustomRender();
}

function refreshCtxCustom() {
    if (_ctxCustomStarted && VillageContext._open) ctxCustomRender();
}

function startCtxCustom() {
    if (_ctxCustomStarted || typeof VillageContext === 'undefined') return;
    _ctxCustomStarted = true;

    const previousShow = VillageContext.show.bind(VillageContext);
    VillageContext.show = function (...args) {
        previousShow(...args);
        ctxCustomScheduleRender();
    };

    const previousHide = VillageContext.hide.bind(VillageContext);
    VillageContext.hide = function (...args) {
        ctxCustomClear();
        previousHide(...args);
    };
}

function startCtxCustomWhenReady(attempt = 0) {
    if (_ctxCustomStarted) return;
    if (typeof VillageContext !== 'undefined') {
        startCtxCustom();
        return;
    }
    if (attempt < 100) setTimeout(() => startCtxCustomWhenReady(attempt + 1), 50);
}

startCtxCustomWhenReady();

document.addEventListener('click', event => {
    const contextButton = event.target.closest?.('.village_anchor .ctx');
    if (!contextButton) return;
    _ctxCustomFallbackAnchor = contextButton.parentElement;
    ctxCustomScheduleRender();
}, true);
