var TROOP_TEMPLATES_CUSTOM_STORAGE_PREFIX = 'twpf_custom_troop_templates_v1';

function getTroopTemplatesCustomStorageKey() {
	var world = game_data?.world || window.location.hostname || 'unknown_world';
	var player = game_data?.player?.id || 'unknown_player';
	return TROOP_TEMPLATES_CUSTOM_STORAGE_PREFIX + '_' + world + '_' + player;
}

function loadCustomTroopTemplates() {
	try {
		var raw = localStorage.getItem(getTroopTemplatesCustomStorageKey());
		var parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		console.warn('[TroopTemplates Custom] Failed to load templates:', e);
		return [];
	}
}

function saveCustomTroopTemplates(templates) {
	localStorage.setItem(getTroopTemplatesCustomStorageKey(), JSON.stringify(templates || []));
}

function removeCustomTroopTemplateById(templateId) {
	if (!templateId) return;

	var state = getCustomTroopTemplateState();
	var templates = loadCustomTroopTemplates();
	var nextTemplates = templates.filter(function (tpl) { return tpl.id !== templateId; });
	if (nextTemplates.length === templates.length) return;

	saveCustomTroopTemplates(nextTemplates);

	if (state.selectedTemplateId === templateId) {
		state.active = true;
		state.mode = 'create';
		state.selectedTemplateId = null;
		fillTroopTemplateFormUnits({});
		fillTroopTemplateFormName(t('troopTemplates.newTemplate'));
		setNativeTemplateSubmitVisibility(false);
	}

	renderCustomTroopTemplateList();
	updateCustomSubmitButtonLabel();
	UI.SuccessMessage(t('troopTemplates.customRemoved'));
}

function getTroopTemplateUnitInputs() {
	return Array.from(document.querySelectorAll('#troop_template_container input.unitsInput[name]'));
}

function readTroopTemplateFormUnits() {
	var units = {};
	getTroopTemplateUnitInputs().forEach(function (input) {
		var value = parseInt(String(input.value || '').replace(/[^\d]/g, ''), 10);
		units[input.name] = Number.isFinite(value) ? Math.max(0, value) : 0;
	});
	return units;
}

function fillTroopTemplateFormUnits(units) {
	getTroopTemplateUnitInputs().forEach(function (input) {
		var value = units && units[input.name] !== undefined ? units[input.name] : 0;
		input.value = String(Number.isFinite(Number(value)) ? Number(value) : 0);
	});

	// Keep "Todos" checkboxes disabled in custom mode to avoid ambiguity.
	document.querySelectorAll('#troop_template_container input[type="checkbox"][name^="max["]').forEach(function (checkbox) {
		checkbox.checked = false;
	});
}

function fillTroopTemplateFormName(name) {
	var nameInput = document.getElementById('template_name');
	if (nameInput) {
		nameInput.value = name || t('troopTemplates.newTemplate');
	}
}

function getTroopTemplateFormName() {
	var nameInput = document.getElementById('template_name');
	return (nameInput?.value || '').trim() || t('troopTemplates.newTemplate');
}

function createCustomTroopTemplateModel() {
	return {
		id: 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 100000),
		name: getTroopTemplateFormName(),
		units: readTroopTemplateFormUnits(),
		updatedAt: Date.now()
	};
}

function getCustomTroopTemplateState() {
	if (!window.__twpfCustomTroopTemplateState) {
		window.__twpfCustomTroopTemplateState = {
			active: false,
			mode: 'create',
			selectedTemplateId: null
		};
	}
	return window.__twpfCustomTroopTemplateState;
}

function getOrCreateCustomSubmitButton() {
	var button = document.getElementById('template_button_custom');
	if (button) return button;

	var nativeButton = document.getElementById('template_button');
	if (!nativeButton || !nativeButton.parentElement) return null;

	button = document.createElement('input');
	button.id = 'template_button_custom';
	button.className = 'btn';
	button.type = 'button';
	button.value = t('troopTemplates.saveCustom');
	button.style.marginLeft = '6px';

	nativeButton.parentElement.appendChild(button);
	return button;
}

function setNativeTemplateSubmitVisibility(showNative) {
	var nativeButton = document.getElementById('template_button');
	if (nativeButton) nativeButton.style.display = showNative ? '' : 'none';

	var customButton = getOrCreateCustomSubmitButton();
	if (customButton) customButton.style.display = showNative ? 'none' : '';
}

function renderCustomTroopTemplateList() {
	var container = document.getElementById('troop_template_list');
	if (!container) return;

	var currentList = document.getElementById('twpf_custom_template_list');
	if (currentList) currentList.remove();

	var state = getCustomTroopTemplateState();
	var templates = loadCustomTroopTemplates();
	var ul = document.createElement('ul');
	ul.id = 'twpf_custom_template_list';
	ul.style.marginTop = '8px';

	var createLi = document.createElement('li');
	createLi.style.backgroundColor = '#dbb365';
	var createAnchor = document.createElement('a');
	createAnchor.href = '#';
	createAnchor.id = 'twpf_template_create';
	createAnchor.textContent = t('troopTemplates.addNewModel');
	createAnchor.style.display = 'block';
	createAnchor.addEventListener('click', function (event) {
		event.preventDefault();
		var localState = getCustomTroopTemplateState();
		localState.active = true;
		localState.mode = 'create';
		localState.selectedTemplateId = null;
		setNativeTemplateSubmitVisibility(false);
		fillTroopTemplateFormUnits({});
		fillTroopTemplateFormName(t('troopTemplates.newTemplate'));
		updateCustomSubmitButtonLabel();
		renderCustomTroopTemplateList();
	});
	createLi.appendChild(createAnchor);
	ul.appendChild(createLi);

	templates.forEach(function (template) {
		var li = document.createElement('li');
		if (state.active && state.selectedTemplateId === template.id) {
			li.classList.add('selected');
		}

		var anchor = document.createElement('a');
		anchor.href = '#custom_' + template.id;
		anchor.addEventListener('click', function (event) {
			event.preventDefault();
			var localState = getCustomTroopTemplateState();
			localState.active = true;
			localState.mode = 'edit';
			localState.selectedTemplateId = template.id;
			setNativeTemplateSubmitVisibility(false);
			fillTroopTemplateFormUnits(template.units || {});
			fillTroopTemplateFormName(template.name || t('troopTemplates.newTemplate'));
			updateCustomSubmitButtonLabel();
			renderCustomTroopTemplateList();
		});

		var deleteImg = document.createElement('img');
		deleteImg.src = '/graphic/delete_14.png';
		deleteImg.alt = t('button.remove');
		deleteImg.addEventListener('click', function (event) {
			event.preventDefault();
			event.stopPropagation();
			removeCustomTroopTemplateById(template.id);
		});

		anchor.appendChild(deleteImg);
		anchor.appendChild(document.createTextNode(template.name || t('troopTemplates.unnamedTemplate')));
		li.appendChild(anchor);
		ul.appendChild(li);
	});

	container.appendChild(ul);
}

function updateCustomSubmitButtonLabel() {
	var button = getOrCreateCustomSubmitButton();
	if (!button) return;

	var state = getCustomTroopTemplateState();
	button.value = state.mode === 'edit' ? t('troopTemplates.updateCustom') : t('troopTemplates.saveCustom');
}

function upsertCustomTemplateFromForm() {
	var state = getCustomTroopTemplateState();
	var templates = loadCustomTroopTemplates();

	if (state.mode === 'edit' && state.selectedTemplateId) {
		var idx = templates.findIndex(function (tpl) { return tpl.id === state.selectedTemplateId; });
		if (idx !== -1) {
			templates[idx].name = getTroopTemplateFormName();
			templates[idx].units = readTroopTemplateFormUnits();
			templates[idx].updatedAt = Date.now();
		} else {
			var fallbackTemplate = createCustomTroopTemplateModel();
			templates.push(fallbackTemplate);
			state.selectedTemplateId = fallbackTemplate.id;
			state.mode = 'edit';
		}
	} else {
		var newTemplate = createCustomTroopTemplateModel();
		templates.push(newTemplate);
		state.selectedTemplateId = newTemplate.id;
		state.mode = 'edit';
	}

	saveCustomTroopTemplates(templates);
	renderCustomTroopTemplateList();
	updateCustomSubmitButtonLabel();
	UI.SuccessMessage(t('troopTemplates.customSaved'));
}

function bindCustomTemplateSubmit() {
	var button = getOrCreateCustomSubmitButton();
	if (!button || button.dataset.bound === '1') return;

	button.dataset.bound = '1';
	button.addEventListener('click', function () {
		upsertCustomTemplateFromForm();
	});
}

function bindNativeTemplateListToExitCustomMode() {
	var listContainer = document.getElementById('troop_template_list');
	if (!listContainer || listContainer.dataset.customExitBound === '1') return;

	listContainer.dataset.customExitBound = '1';
	listContainer.addEventListener('click', function (event) {
		var anchor = event.target && event.target.closest('a');
		if (!anchor) return;

		if (anchor.closest('#twpf_custom_template_list')) return;

		var state = getCustomTroopTemplateState();
		state.active = false;
		state.mode = 'create';
		state.selectedTemplateId = null;
		setNativeTemplateSubmitVisibility(true);
		renderCustomTroopTemplateList();
	});
}

function bindFormSubmitForCustomMode() {
	var form = document.querySelector('#troop_template_container form');
	if (!form || form.dataset.customSubmitBound === '1') return;

	form.dataset.customSubmitBound = '1';
	form.addEventListener('submit', function (event) {
		var state = getCustomTroopTemplateState();
		if (!state.active) return;
		event.preventDefault();
		upsertCustomTemplateFromForm();
	});
}

function getCommandTroopTemplateContainer() {
	var firstTemplateAnchor = document.querySelector('.place-troop-templates .troop_template_selector');
	if (!firstTemplateAnchor) return null;
	return firstTemplateAnchor.closest('tbody');
}

function applyCustomTemplateToCommandInputs(units) {
	if (!units) return;
	document.querySelectorAll('#command-data-form input.unitsInput[name]').forEach(function (input) {
		var value = units[input.name] !== undefined ? units[input.name] : 0;
		input.value = String(Number.isFinite(Number(value)) ? Number(value) : 0);
	});
}

function buildCommandModeTemplateObject(customTemplate, commandUnits) {
	var payload = {
		id: customTemplate.id,
		name: customTemplate.name || t('troopTemplates.unnamedTemplate'),
		use_all: [],
		used: 0
	};

	(commandUnits || []).forEach(function (unit) {
		var value = customTemplate?.units?.[unit];
		payload[unit] = Number.isFinite(Number(value)) ? Number(value) : 0;
	});

	return payload;
}

function injectCustomTroopTemplatesCommandList() {
	var tableBody = getCommandTroopTemplateContainer();
	if (!tableBody) return;

	tableBody.querySelectorAll('.twpf-custom-command-template-row').forEach(function (row) {
		row.remove();
	});

	var templates = loadCustomTroopTemplates();
	if (!templates.length) return;

	var commandUnits = Array.from(document.querySelectorAll('#command-data-form input.unitsInput[name]')).map(function (input) {
		return input.name;
	});

	if (window.TroopTemplates && TroopTemplates.current) {
		Object.keys(TroopTemplates.current).forEach(function (key) {
			if (String(key).indexOf('custom_local_') === 0) {
				delete TroopTemplates.current[key];
			}
		});
	}

	var currentRows = tableBody.querySelectorAll('tr').length;
	templates.forEach(function (template, index) {
		var customId = 'custom_local_' + template.id;

		if (window.TroopTemplates && TroopTemplates.current) {
			TroopTemplates.current[customId] = buildCommandModeTemplateObject(template, commandUnits);
		}

		var tr = document.createElement('tr');
		tr.className = ((currentRows + index) % 2 === 0) ? 'row_a twpf-custom-command-template-row' : 'row_b twpf-custom-command-template-row';

		var td = document.createElement('td');
		td.className = 'place-troop-templates';

		var anchor = document.createElement('a');
		anchor.className = 'troop_template_selector';
		anchor.href = '#';
		anchor.setAttribute('data-template-id', customId);
		anchor.textContent = template.name || t('troopTemplates.unnamedTemplate');
		anchor.addEventListener('click', function (event) {
			event.preventDefault();
			if (window.TroopTemplates && typeof TroopTemplates.useTemplate === 'function') {
				TroopTemplates.useTemplate(customId);
			} else {
				applyCustomTemplateToCommandInputs(template.units || {});
				var hiddenTemplate = document.querySelector('#command-data-form input[name="template_id"]');
				if (hiddenTemplate) hiddenTemplate.value = customId;
			}
		});

		td.appendChild(anchor);
		tr.appendChild(td);
		tableBody.appendChild(tr);
	});

	if (window.TroopTemplates && typeof TroopTemplates.bindTemplateSelectorLinks === 'function') {
		TroopTemplates.bindTemplateSelectorLinks();
	}
}

function injectCustomTroopTemplatesFeature() {
	var troopTemplateBlock = document.getElementById('troop_template');
	if (troopTemplateBlock) {
		renderCustomTroopTemplateList();
		bindCustomTemplateSubmit();
		bindNativeTemplateListToExitCustomMode();
		bindFormSubmitForCustomMode();

		// Custom mode is opt-in by clicking "Add new model" or one custom template.
		setNativeTemplateSubmitVisibility(true);
	}

	injectCustomTroopTemplatesCommandList();
}
