/*
 * Improved local adaptation of the Map SDK by Thomas "Sass" Ameye.
 * Original source: https://shinko-to-kuma.com/scripts/mapSdk.js
 * Thank you, Thomas, for publishing the original Map SDK and providing the
 * foundation for this local adaptation.
 *
 * The original MIT license is retained below. The original SDK is preserved
 * unchanged in _game_source/_mapsdk.js for reference.
 *
 * Map SDK by Thomas "Sass" Ameye
 *
 * I am not affiliated to Innogames
 * Under MIT License:
 *
 * Copyright 2022 Thomas "Sass" Ameye
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var MapSdk = {
    _initializedFor: null,
    _spawnSectorWrapper: null,
    _initTimer: null,
    _canvasSelector: '.mapOverlay_map_canvas, .mapOverlay_topo_canvas',

    _canUseMap() {
        return typeof TWMap !== 'undefined'
            && TWMap
            && TWMap.mapHandler
            && typeof TWMap.mapHandler.spawnSector === 'function'
            && TWMap.map
            && typeof TWMap.map.pixelByCoord === 'function'
            && TWMap.minimap;
    },

    init() {
        if (!this._canUseMap()) return false;
        if (this._initializedFor === TWMap && TWMap.mapHandler.spawnSector === this._spawnSectorWrapper) return true;

        const mapHandler = TWMap.mapHandler;
        const originalSpawnSector = mapHandler.spawnSector === this._spawnSectorWrapper
            ? mapHandler._mapSdkOriginalSpawnSector
            : mapHandler.spawnSector;
        mapHandler._mapSdkOriginalSpawnSector = originalSpawnSector;
        this._spawnSectorWrapper = (data, sector) => {
            originalSpawnSector.call(mapHandler, data, sector);
            this._ensureSectorCanvases(data, sector);
        };
        mapHandler.spawnSector = this._spawnSectorWrapper;

        this._initializedFor = TWMap;
        this.refresh();
        return true;
    },

    ensureInitialized(retryMs = 250, maxAttempts = 40) {
        if (this.init()) return true;
        if (this._initTimer || maxAttempts <= 0) return false;

        let attempts = 0;
        this._initTimer = setInterval(() => {
            attempts += 1;
            if (this.init() || attempts >= maxAttempts) {
                clearInterval(this._initTimer);
                this._initTimer = null;
            }
        }, retryMs);
        return false;
    },

    _ensureSectorCanvases(data, sector) {
        if (!sector || !data?.tiles) return;

        const beginX = sector.x - data.x;
        const endX = beginX + (TWMap.mapSubSectorSize || 0);
        const beginY = sector.y - data.y;
        const endY = beginY + (TWMap.mapSubSectorSize || 0);

        for (const rawX of Object.keys(data.tiles)) {
            const tileX = Number(rawX);
            if (!Number.isFinite(tileX) || tileX < beginX || tileX >= endX) continue;
            for (const rawY of Object.keys(data.tiles[rawX] || {})) {
                const tileY = Number(rawY);
                if (!Number.isFinite(tileY) || tileY < beginY || tileY >= endY) continue;
                this._ensureMapCanvas(sector);
                break;
            }
        }

        const loadedSectors = TWMap.minimap?._loadedSectors || {};
        Object.keys(loadedSectors).forEach(key => this._ensureMiniCanvas(loadedSectors[key], key));
    },

    _configureCanvas(canvas) {
        canvas.style.position = 'absolute';
        canvas.style.pointerEvents = 'none';
    },

    _ensureMapCanvas(sector) {
        if (!sector || typeof sector.appendElement !== 'function') return;
        const id = `mapOverlay_canvas_${sector.x}_${sector.y}`;
        if (document.getElementById(id)) return;

        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.className = 'mapOverlay_map_canvas';
        canvas.width = Math.max(1, Math.round(TWMap.map.scale[0] * TWMap.map.sectorSize));
        canvas.height = Math.max(1, Math.round(TWMap.map.scale[1] * TWMap.map.sectorSize));
        canvas.style.zIndex = '10';
        this._configureCanvas(canvas);
        sector.appendElement(canvas, 0, 0);
        this.redrawSector(sector, canvas);
    },

    _ensureMiniCanvas(sector, key) {
        if (!sector || typeof sector.appendElement !== 'function') return;
        const id = `mapOverlay_topo_canvas_${key}`;
        if (document.getElementById(id)) return;

        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.className = 'mapOverlay_topo_canvas';
        canvas.width = 250;
        canvas.height = 250;
        canvas.style.zIndex = '11';
        this._configureCanvas(canvas);
        sector.appendElement(canvas, 0, 0);
        this.redrawMiniSector(sector, canvas);
    },

    refresh() {
        if (!this.initIfNeeded()) return false;
        if (typeof TWMap.reload === 'function') TWMap.reload();
        return true;
    },

    initIfNeeded() {
        return this._initializedFor === TWMap || this.init();
    },

    clearMap() {
        this.circles = [];
        this.lines = [];
        this.polygons = [];
        this.texts = [];
        this.icons = [];
        this.removeCanvases();
        this.refresh();
    },

    removeCanvases() {
        document.querySelectorAll(this._canvasSelector).forEach(canvas => canvas.remove());
    },

    redraw() {
        if (!this.initIfNeeded()) return false;
        this.removeCanvases();
        this.refresh();
        return true;
    },

    add(element, collection) {
        if (!element || !Array.isArray(this[collection])) return false;
        this[collection].push(element);
        this.redraw();
        return element;
    },

    circleVillage(x, y, size, styling = {}, sector, canvas, markCircleOrigin = false, anchor = 'center') {
        const context = canvas?.getContext('2d');
        if (!context) return;
        const main = styling.main || {};
        // 'cornerFit' uses a single uniform radius so the indicator renders as a true circle,
        // instead of an ellipse skewed by non-square scale[0]/scale[1] tile pixel ratios.
        const uniformRadius = size * Math.min(TWMap.map.scale[0], TWMap.map.scale[1]);
        const radiusX = anchor === 'cornerFit' ? uniformRadius : size * TWMap.map.scale[0];
        const radiusY = anchor === 'cornerFit' ? uniformRadius : size * TWMap.map.scale[1];
        // 'cornerFit' nests the circle in the tile's top-left corner (plus a 1px margin) regardless of its radius.
        const position = anchor === 'cornerFit'
            ? this.pixelByCornerCoord(sector, x, y).map((value, index) => value + (index === 0 ? radiusX : radiusY) + 1)
            : this.pixelByCoord(sector, x, y);
        if (!this.circleInSector(position[0], position[1], radiusX, radiusY, canvas.width, canvas.height)) return;

        context.save();
        if (main.strokeStyle) context.strokeStyle = main.strokeStyle;
        if (main.lineWidth) context.lineWidth = main.lineWidth;
        if (main.fillStyle) context.fillStyle = main.fillStyle;
        context.beginPath();
        context.ellipse(position[0], position[1], radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (main.strokeStyle || main.lineWidth) context.stroke();
        if (main.fillStyle) context.fill();
        context.closePath();
        if (markCircleOrigin) {
            context.strokeStyle = '#fff';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(position[0] - 6, position[1] - 6);
            context.lineTo(position[0] + 6, position[1] + 6);
            context.moveTo(position[0] + 6, position[1] - 6);
            context.lineTo(position[0] - 6, position[1] + 6);
            context.stroke();
        }
        context.restore();
    },

    circleMiniVillage(x, y, size, styling = {}, sector, canvas, markCircleOrigin = false, anchor = 'center') {
        const context = canvas?.getContext('2d');
        if (!context) return;
        const miniRadius = size * 5;
        // 'cornerFit' nests the circle in the tile's top-left corner (plus a 1px margin) regardless of its radius.
        const position = anchor === 'cornerFit'
            ? this.miniPixelByCornerCoord(sector, x, y).map(value => value + miniRadius + 1)
            : this.miniPixelByCoord(sector, x, y);
        const mini = styling.mini || {};
        context.save();
        if (mini.strokeStyle) context.strokeStyle = mini.strokeStyle;
        if (mini.lineWidth) context.lineWidth = mini.lineWidth;
        if (mini.fillStyle) context.fillStyle = mini.fillStyle;
        context.beginPath();
        context.arc(position[0], position[1], miniRadius, 0, 2 * Math.PI);
        if (mini.strokeStyle || mini.lineWidth) context.stroke();
        if (mini.fillStyle) context.fill();
        context.closePath();
        if (markCircleOrigin) {
            context.strokeStyle = '#fff';
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(position[0] - 2, position[1] - 2);
            context.lineTo(position[0] + 2, position[1] + 2);
            context.moveTo(position[0] + 2, position[1] - 2);
            context.lineTo(position[0] - 2, position[1] + 2);
            context.stroke();
        }
        context.restore();
    },

    line(x1, y1, x2, y2, styling = {}, sector, canvas) {
        this._drawPath(sector, canvas, [[x1, y1], [x2, y2]], styling.main || {});
    },

    lineMini(x1, y1, x2, y2, styling = {}, sector, canvas) {
        this._drawPath(sector, canvas, [[x1, y1], [x2, y2]], styling.mini || {}, true);
    },

    polygon(coords, styling = {}, sector, canvas, anchor = 'center') {
        this._drawPath(sector, canvas, coords.map(point => [point.x, point.y]), styling.main || {}, false, anchor);
    },

    polygonOnMini(coords, styling = {}, sector, canvas, anchor = 'center') {
        this._drawPath(sector, canvas, coords.map(point => [point.x, point.y]), styling.mini || {}, true, anchor);
    },

    _drawPath(sector, canvas, points, style, mini = false, anchor = 'center') {
        const context = canvas?.getContext('2d');
        if (!context || points.length < 2) return;
        context.save();
        if (style.strokeStyle) context.strokeStyle = style.strokeStyle;
        if (style.lineWidth) context.lineWidth = style.lineWidth;
        if (style.fillStyle) context.fillStyle = style.fillStyle;
        context.beginPath();
        points.forEach((point, index) => {
            const position = anchor === 'topLeft'
                ? (mini ? this.miniPixelByCornerCoord(sector, point[0], point[1]) : this.pixelByCornerCoord(sector, point[0], point[1]))
                : (mini ? this.miniPixelByCoord(sector, point[0], point[1]) : this.pixelByCoord(sector, point[0], point[1]));
            if (index === 0) context.moveTo(position[0], position[1]);
            else context.lineTo(position[0], position[1]);
        });
        if (points.length > 2) context.closePath();
        if (style.strokeStyle || style.lineWidth) context.stroke();
        if (style.fillStyle && points.length > 2) context.fill();
        context.restore();
    },

    iconOnMap(image, x, y, size, sector, canvas) {
        const context = canvas?.getContext('2d');
        if (!context || !image) return;
        const position = this.pixelByCoord(sector, x, y);
        context.drawImage(image, position[0] - size / 2, position[1] - size / 2, size, size);
    },

    iconOnMiniMap(image, x, y, size, sector, canvas) {
        const context = canvas?.getContext('2d');
        if (!context || !image) return;
        const position = this.miniPixelByCoord(sector, x, y);
        context.drawImage(image, position[0] - size / 2, position[1] - size / 2, size, size);
    },

    textOnMap(text, x, y, color, font, sector, canvas) {
        this._drawText(text, this.pixelByCoord(sector, x, y), color, font, canvas, 4);
    },

    textOnMiniMap(text, x, y, color, font, sector, canvas) {
        this._drawText(text, this.miniPixelByCoord(sector, x, y), color, font, canvas, 1);
    },

    _drawText(text, position, color = 'white', font = '10px Arial', canvas, lineWidth) {
        const context = canvas?.getContext('2d');
        if (!context) return;
        context.save();
        context.font = font;
        context.textAlign = 'center';
        context.fillStyle = color;
        context.strokeStyle = 'black';
        context.lineWidth = lineWidth;
        context.lineJoin = 'round';
        context.strokeText(String(text), position[0], position[1]);
        context.fillText(String(text), position[0], position[1]);
        context.restore();
    },

    pixelByCoord(sector, x, y) {
        const sectorPixel = TWMap.map.pixelByCoord(sector.x, sector.y);
        const villagePixel = TWMap.map.pixelByCoord(x, y);
        return [
            villagePixel[0] - sectorPixel[0] + TWMap.tileSize[0] / 2,
            villagePixel[1] - sectorPixel[1] + TWMap.tileSize[1] / 2
        ];
    },

    miniPixelByCoord(sector, x, y) {
        return [(x - sector.x) * 5 + 3, (y - sector.y) * 5 + 3];
    },

    pixelByCornerCoord(sector, x, y) {
        return this.pixelByCoord(sector, x - 0.5, y - 0.5);
    },

    miniPixelByCornerCoord(sector, x, y) {
        return this.miniPixelByCoord(sector, x - 0.5, y - 0.5);
    },

    circleInSector(cx, cy, radiusX, radiusY, width, height) {
        const nearestX = Math.max(0, Math.min(cx, width));
        const nearestY = Math.max(0, Math.min(cy, height));
        const dx = cx - nearestX;
        const dy = cy - nearestY;
        return (dx * dx) / Math.max(radiusX * radiusX, 1) + (dy * dy) / Math.max(radiusY * radiusY, 1) <= 1;
    },

    redrawSector(sector, canvas) {
        this.circles.filter(element => element.drawOnMap).forEach(element => this.circleVillage(element.x, element.y, element.radius, element.styling, sector, canvas, element.markCircleOrigin, element.anchor));
        this.lines.filter(element => element.drawOnMap).forEach(element => this.line(element.x1, element.y1, element.x2, element.y2, element.styling, sector, canvas));
        this.icons.filter(element => element.drawOnMap).forEach(element => this.iconOnMap(element.img || this.defaultImg, element.x, element.y, element.mapSize || 20, sector, canvas));
        this.texts.filter(element => element.drawOnMap).forEach(element => this.textOnMap(element.text, element.x, element.y, element.color, element.font, sector, canvas));
        this.polygons.filter(element => element.drawOnMap).forEach(element => this.polygon(element.coords, element.styling, sector, canvas, element.anchor));
    },

    redrawMiniSector(sector, canvas) {
        this.circles.filter(element => element.drawOnMini).forEach(element => this.circleMiniVillage(element.x, element.y, element.radius, element.styling, sector, canvas, element.markCircleOrigin, element.anchor));
        this.lines.filter(element => element.drawOnMini).forEach(element => this.lineMini(element.x1, element.y1, element.x2, element.y2, element.styling, sector, canvas));
        this.icons.filter(element => element.drawOnMini).forEach(element => this.iconOnMiniMap(element.img || this.defaultImg, element.x, element.y, element.miniSize || 5, sector, canvas));
        this.texts.filter(element => element.drawOnMini).forEach(element => this.textOnMiniMap(element.text, element.x, element.y, element.color, element.miniFont, sector, canvas));
        this.polygons.filter(element => element.drawOnMini).forEach(element => this.polygonOnMini(element.coords, element.styling, sector, canvas, element.anchor));
    },

    circles: [],
    lines: [],
    polygons: [],
    texts: [],
    icons: [],
    defaultImg: (() => {
        const image = new Image();
        image.src = '/graphic/buildings/wall.png';
        return image;
    })()
};

