/**
 * Attack report heatmap renderer for the map.
 * Report fetching and persistence are owned by reportsManager.js.
 */
(function () {
    const HEATMAP_TAG = '_twpfHeatmap';
    const HEATMAP_ALPHA = 0.35;
    let rebuildPromise = null;
    let hasBuilt = false;

    function withTransparency(hexColor) {
        const red = parseInt(hexColor.slice(1, 3), 16);
        const green = parseInt(hexColor.slice(3, 5), 16);
        const blue = parseInt(hexColor.slice(5, 7), 16);
        return `rgba(${red},${green},${blue},${HEATMAP_ALPHA})`;
    }

    async function rebuildHeatmap() {
        if (rebuildPromise) return rebuildPromise;
        rebuildPromise = (async () => {
            if (typeof MapSdk === 'undefined' || typeof TWMap === 'undefined') return;
            if (typeof mapReady === 'function') await mapReady();
            MapSdk.ensureInitialized();
            if (typeof MapSdk.redraw !== 'function') return;

            MapSdk.polygons = MapSdk.polygons.filter(element => !element[HEATMAP_TAG]);
            const reports = await window.TWPFMapReports.hydrate();
            if (!window.TWPFMapReports.isEnabled() || !Array.isArray(reports)) {
                hasBuilt = MapSdk.redraw() !== false;
                return;
            }

            reports.forEach(report => {
                if (!report?.coords || window.TWPFMapReports.isOwnVillage(report.coords)) return;
                const match = report.coords.match(/^(\d{1,3})\|(\d{1,3})$/);
                const classification = window.TWPFMapReports.getMode() === 'time'
                    ? window.TWPFMapReports.classifyTime(report)
                    : window.TWPFMapReports.classifyResources(report);
                if (!match || !classification) return;

                const x = Number(match[1]);
                const y = Number(match[2]);
                MapSdk.polygons.push({
                    [HEATMAP_TAG]: true,
                    coords: [{ x, y }, { x: x + 1, y }, { x, y: y + 1 }],
                    anchor: 'topLeft',
                    styling: { main: { fillStyle: withTransparency(classification.color) } },
                    drawOnMap: true,
                    drawOnMini: false
                });
            });
            hasBuilt = MapSdk.redraw() !== false;
        })().finally(() => {
            rebuildPromise = null;
        });
        return rebuildPromise;
    }

    const manager = window.TWPFMapReports;
    if (!manager) {
        console.error('[Report Heatmap] reportsManager.js must load first.');
        return;
    }

    Object.assign(manager, {
        rebuildHeatmap,
        rebuild: rebuildHeatmap,
        notifyUpdated: rebuildHeatmap,
        needsInitialBuild: () => !hasBuilt
    });
})();
