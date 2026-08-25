/* Temporary MapSdk playground. Test drawings are kept in memory only. */

(function () {
    'use strict';

    if (typeof TWMap === 'undefined' || typeof MapSdk === 'undefined') return;

    const TESTER_ID = 'map_sdk_tester';
    let popup;
    let lastElement;

    const text = key => typeof t === 'function' ? t(key) : key;

    function parseCoord(value) {
        const match = String(value || '').trim().match(/^(\d{1,3})\|(\d{1,3})$/);
        if (!match) return null;
        const x = Number(match[1]);
        const y = Number(match[2]);
        if (x < 0 || x > 999 || y < 0 || y > 999) return null;
        return { x, y };
    }

    function input(label, type, value, attributes = {}) {
        const wrapper = document.createElement('label');
        wrapper.style.display = 'block';
        wrapper.style.margin = '4px 0';
        wrapper.textContent = label + ': ';
        const field = document.createElement('input');
        field.type = type;
        field.value = value;
        Object.entries(attributes).forEach(([name, attributeValue]) => {
            if (name.startsWith('data-')) field.setAttribute(name, attributeValue);
            else if (name === 'style') field.style.cssText = attributeValue;
            else field[name] = attributeValue;
        });
        wrapper.appendChild(field);
        return { wrapper, field };
    }

    function row(label, control) {
        const tr = document.createElement('tr');
        const labelCell = document.createElement('td');
        labelCell.className = 'settings-label-cell';
        labelCell.textContent = label;
        const inputCell = document.createElement('td');
        inputCell.className = 'settings-input-cell';
        inputCell.appendChild(control);
        tr.append(labelCell, inputCell);
        return tr;
    }

    function button(label, handler) {
        const element = document.createElement('a');
        element.className = 'btn';
        element.href = '#';
        element.textContent = label;
        element.style.margin = '3px 3px 3px 0';
        element.onclick = event => {
            event.preventDefault();
            handler();
        };
        return element;
    }

    function getFields() {
        return {
            coordinate: popup.querySelector('[data-sdk-field="coordinate"]').value,
            destination: popup.querySelector('[data-sdk-field="destination"]').value,
            size: Number(popup.querySelector('[data-sdk-field="size"]').value) || 2,
            iconSize: Number(popup.querySelector('[data-sdk-field="iconSize"]').value) || 20,
            stroke: popup.querySelector('[data-sdk-field="stroke"]').value,
            fill: popup.querySelector('[data-sdk-field="fill"]').value,
            opacity: Number(popup.querySelector('[data-sdk-field="opacity"]').value) || 0.25,
            lineWidth: Number(popup.querySelector('[data-sdk-field="lineWidth"]').value) || 2
        };
    }

    function colorWithOpacity(color, opacity) {
        const value = String(color || '').replace('#', '');
        const red = parseInt(value.substring(0, 2), 16) || 0;
        const green = parseInt(value.substring(2, 4), 16) || 0;
        const blue = parseInt(value.substring(4, 6), 16) || 0;
        return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(opacity, 1))})`;
    }

    function defaultStyling(fields) {
        return {
            main: { strokeStyle: fields.stroke, fillStyle: colorWithOpacity(fields.fill, fields.opacity), lineWidth: fields.lineWidth },
            mini: { strokeStyle: fields.stroke, fillStyle: colorWithOpacity(fields.fill, Math.min(fields.opacity + 0.2, 1)), lineWidth: fields.lineWidth }
        };
    }

    function flags(destination) {
        return {
            drawOnMap: destination === 'map' || destination === 'both',
            drawOnMini: destination === 'mini' || destination === 'both'
        };
    }

    function addElement(collection, element) {
        Object.assign(element, flags(element.destination));
        delete element.destination;
        MapSdk[collection].push(element);
        lastElement = { collection, element };
        MapSdk.redraw();
    }

    function draw(type) {
        const fields = getFields();
        const origin = parseCoord(fields.coordinate);
        if (!origin) {
            window.alert(text('map.sdkTester.invalidCoordinate'));
            return;
        }

        const base = { x: origin.x, y: origin.y, destination: fields.destination };
        const style = defaultStyling(fields);
        if (type === 'circle') {
            addElement('circles', { ...base, radius: fields.size, styling: style, markCircleOrigin: true });
        } else if (type === 'line') {
            const end = { x: Math.min(origin.x + fields.size, 999), y: Math.min(origin.y + fields.size, 999) };
            addElement('lines', { x1: origin.x, y1: origin.y, x2: end.x, y2: end.y, styling: style, destination: fields.destination });
        } else if (type === 'triangle') {
            const points = [origin, { x: origin.x + fields.size, y: origin.y }, { x: origin.x, y: origin.y + fields.size }];
            addElement('polygons', { coords: points, styling: style, anchor: 'topLeft', destination: fields.destination });
        } else if (type === 'square') {
            const right = origin.x + fields.size;
            const bottom = origin.y + fields.size;
            const points = [origin, { x: right, y: origin.y }, { x: right, y: bottom }, { x: origin.x, y: bottom }];
            addElement('polygons', { coords: points, styling: style, anchor: 'topLeft', destination: fields.destination });
        } else if (type === 'text') {
            addElement('texts', { ...base, text: 'SDK', color: '#ffffff', font: '12px Arial', miniFont: '10px Arial' });
        } else if (type === 'icon') {
            const image = new Image();
            image.onload = () => MapSdk.redraw();
            image.onerror = () => window.alert(text('map.sdkTester.invalidImage'));
            image.src = '/graphic/buildings/wall.png';
            addElement('icons', { ...base, img: image, mapSize: fields.iconSize, miniSize: Math.max(3, fields.iconSize / 2) });
        }
    }

    function removeLast() {
        if (!lastElement) return;
        const collection = MapSdk[lastElement.collection];
        const index = collection.indexOf(lastElement.element);
        if (index >= 0) collection.splice(index, 1);
        lastElement = null;
        MapSdk.redraw();
    }

    function createPopup() {
        if (popup) return popup;
        popup = document.createElement('div');
        popup.id = TESTER_ID + '_popup';
        popup.className = 'popup_style borderimage popup_box script-settings-popup';
        popup.style.cssText = 'display:none;width:520px;max-width:calc(100vw - 30px);z-index:10000;';

        const header = document.createElement('div');
        header.className = 'script-popup-header';
        header.textContent = text('map.sdkTester.title');
        const close = document.createElement('a');
        close.className = 'script-popup-close';
        close.textContent = text('button.close');
        close.href = '#';
        close.onclick = event => { event.preventDefault(); popup.style.display = 'none'; };
        header.appendChild(close);

        const table = document.createElement('table');
        table.className = 'vis settings-table';
        const body = document.createElement('tbody');
        const coordinate = input(text('map.sdkTester.coordinate'), 'text', '500|500', { 'data-sdk-field': 'coordinate', placeholder: '500|500' });
        const destination = document.createElement('select');
        destination.dataset.sdkField = 'destination';
        [['map', text('map.sdkTester.map')], ['mini', text('map.sdkTester.minimap')], ['both', text('map.sdkTester.both')]].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            destination.appendChild(option);
        });
        const size = input(text('map.sdkTester.size'), 'number', '2', { 'data-sdk-field': 'size', min: '0.1', max: '50', step: '0.1' });
        const iconSize = input(text('map.sdkTester.iconSize'), 'number', '20', { 'data-sdk-field': 'iconSize', min: '5', max: '100', step: '1' });
        const stroke = input(text('map.sdkTester.stroke'), 'color', '#ff0000', { 'data-sdk-field': 'stroke' });
        const fill = input(text('map.sdkTester.fill'), 'color', '#ff0000', { 'data-sdk-field': 'fill' });
        const opacity = input(text('map.sdkTester.opacity'), 'number', '0.25', { 'data-sdk-field': 'opacity', min: '0', max: '1', step: '0.05' });
        const lineWidth = input(text('map.sdkTester.lineWidth'), 'number', '2', { 'data-sdk-field': 'lineWidth', min: '1', max: '20', step: '1' });

        [
            [text('map.sdkTester.coordinate'), coordinate.field],
            [text('map.sdkTester.destination'), destination],
            [text('map.sdkTester.size'), size.field],
            [text('map.sdkTester.iconSize'), iconSize.field],
            [text('map.sdkTester.stroke'), stroke.field],
            [text('map.sdkTester.fill'), fill.field],
            [text('map.sdkTester.opacity'), opacity.field],
            [text('map.sdkTester.lineWidth'), lineWidth.field]
        ].forEach(([label, control]) => body.appendChild(row(label, control)));
        table.appendChild(body);

        const actions = document.createElement('div');
        actions.append(
            button(text('map.sdkTester.circle'), () => draw('circle')),
            button(text('map.sdkTester.line'), () => draw('line')),
            button(text('map.sdkTester.triangle'), () => draw('triangle')),
            button(text('map.sdkTester.square'), () => draw('square')),
            button(text('map.sdkTester.icon'), () => draw('icon')),
            button(text('map.sdkTester.textDraw'), () => draw('text')),
            button(text('map.sdkTester.removeLast'), removeLast),
            button(text('map.sdkTester.clear'), () => { MapSdk.clearMap(); lastElement = null; })
        );

        const note = document.createElement('small');
        note.textContent = text('map.sdkTester.note');
        note.style.display = 'block';
        note.style.marginTop = '6px';
        popup.append(header, table, actions, note);
        document.body.appendChild(popup);
        return popup;
    }

    function installButton() {
        if (document.getElementById(TESTER_ID + '_button')) return;
        const legendBody = document.querySelector('#map_legend table tbody');
        if (!legendBody) return;
        const rowElement = document.createElement('tr');
        rowElement.id = TESTER_ID + '_button';
        const cell = document.createElement('td');
        cell.colSpan = 2;
        const testerButton = button(text('map.sdkTester.open'), () => {
            createPopup().style.display = 'block';
        });
        cell.appendChild(testerButton);
        rowElement.appendChild(cell);
        legendBody.appendChild(rowElement);
    }

    function installButtonWhenReady() {
        installButton();
        if (document.getElementById(TESTER_ID + '_button')) return;
        let attempts = 0;
        const timer = setInterval(() => {
            attempts += 1;
            installButton();
            if (document.getElementById(TESTER_ID + '_button') || attempts >= 40) clearInterval(timer);
        }, 250);
    }

    const ready = typeof mapReady === 'function' ? mapReady() : Promise.resolve();
    ready.then(() => {
        MapSdk.ensureInitialized();
        installButtonWhenReady();
    });
})();
