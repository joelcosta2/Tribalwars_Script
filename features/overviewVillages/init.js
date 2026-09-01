// Shared helpers and page-level state for the overview villages feature.

function formatQueueRemaining(ms) {
	if (!ms || ms <= 0) return null;
	const s = Math.floor((ms / 1000) % 60);
	const m = Math.floor((ms / 1000 / 60) % 60);
	const h = Math.floor((ms / 1000 / 60 / 60) % 24);
	const d = Math.floor(ms / 1000 / 60 / 60 / 24);
	return (d > 0 ? d + 'd ' : '') + (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
}

function attachLiveQueueTooltip(anchor, hoverTarget, headerHtml, getBodyHtml) {
	anchor.setAttribute('data-title', headerHtml);
	anchor.setAttribute('data-tooltip-tpl', getBodyHtml());

	function updateCountdown(event) {
		anchor.setAttribute('data-tooltip-tpl', getBodyHtml());
		toggleTooltip(event.target, true);
		event.target.countdownTimeout = setTimeout(() => updateCountdown(event), 1000);
	}

	hoverTarget.addEventListener('mouseenter', function (event) {
		anchor.setAttribute('data-tooltip-tpl', getBodyHtml());
		toggleTooltip(event.target, true);
		updateCountdown(event);
	});
	hoverTarget.addEventListener('mouseleave', function (event) {
		toggleTooltip(event.target, false);
		clearTimeout(event.target.countdownTimeout);
	});
}

function getOverviewVillagesColumnIndex(table, orderParam) {
	const headerCells = Array.from(table.querySelectorAll('thead th'));
	return headerCells.findIndex(th => !!th.querySelector(`a[href*="order=${orderParam}"]`));
}

function appendOverviewVillagesRefreshIcon(cell, title, onClick) {
	const refreshIcon = document.createElement('a');
	refreshIcon.href = '#';
	refreshIcon.title = title;
	refreshIcon.setAttribute('aria-label', title);
	refreshIcon.style.cssText = 'float:right;text-decoration:none;cursor:pointer;font-size:12px;';
	refreshIcon.textContent = '\u21bb';
	refreshIcon.addEventListener('click', function (event) {
		event.preventDefault();
		onClick(refreshIcon);
	});
	cell.appendChild(refreshIcon);
}

function appendVillageIdentityCell(row, village, existingCell) {
	const nativeRow = overviewVillagesTabsState.table?.querySelector(
		'.quickedit-vn[data-id="' + village.id + '"]'
	)?.closest('tr');
	const nativeCell = nativeRow?.querySelector('.quickedit-vn[data-id]')?.closest('td');
	const cell = existingCell || row.insertCell();

	if (nativeCell) {
		const identity = nativeCell.cloneNode(true);
		if (existingCell) cell.append(...identity.childNodes);
		else cell.replaceChildren(...identity.childNodes);
		cell.className = nativeCell.className;
		cell.style.cssText = nativeCell.style.cssText;
		if (typeof appendOverviewVillageQuickLinksIcons === 'function') {
			appendOverviewVillageQuickLinksIcons(cell, village.id);
		}
		return cell;
	}

	if (existingCell) cell.appendChild(document.createTextNode(village.name));
	else cell.textContent = village.name;
	if (typeof appendOverviewVillageQuickLinksIcons === 'function') {
		appendOverviewVillageQuickLinksIcons(cell, village.id);
	}
	return cell;
}

const overviewVillagesTabsState = {
	activeTabId: 'production',
	host: null,
	table: null,
	tabs: [],
	villages: []
};

/**
 * Initializes the overview villages feature after all context modules have loaded.
 */
function initOverviewVillages() {
	if (typeof game_data === 'undefined' || game_data.screen !== 'overview_villages') return;

	if (typeof injectOverviewVillagesNavigationMenu === 'function') injectOverviewVillagesNavigationMenu();
	if (typeof injectOverviewVillagesBuildQueueColumn === 'function') injectOverviewVillagesBuildQueueColumn();
	if (typeof injectOverviewVillagesTroopsColumn === 'function') injectOverviewVillagesTroopsColumn();
	if (typeof injectOverviewVillagesStorageHover === 'function') injectOverviewVillagesStorageHover();
	if (typeof injectOverviewVillagesQuickLinksIcon === 'function') injectOverviewVillagesQuickLinksIcon();
}
