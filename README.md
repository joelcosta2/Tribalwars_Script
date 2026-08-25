# Tribalwars: Premium Features

A desktop userscript that adds practical tools for managing TribalWars villages, maps, reports and routine tasks.

Some features reproduce conveniences normally associated with a Premium Account. Others are independent utilities. Automation is optional and may not be allowed on every world.

<table>
	<tr>
		<td><img src=".github/images/overviewExtraInfo2.png" alt="Visual Building Overview Details" style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;"></td>
		<td><img src=".github/images/largeMap.png" alt="Large Map" style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;"></td>
	</tr>
	<tr>
		<td><img src=".github/images/overviewVillages21.png" alt="Overview Villages" style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;"></td>
		<td><img src=".github/images/mapGroups.png" alt="Custom Map Groups" style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover;"></td>
	</tr>
</table>

> **Important:** This project is intended for players **without** an active Premium Account. Some features may not work at all or may have compatibility issues.


## Requirements

- Tampermonkey or another userscript manager that supports `@require`.
- A desktop browser. Mobile pages are ignored.
- A TribalWars address matching `https://*.tribalwars.*/*`.

## Installation

Install the published script from [main.user.js](main.user.js), or use the raw GitHub URL:

`https://github.com/joelcosta2/Tribalwars_Script/raw/master/main.user.js`

After installation, open the script settings in TribalWars and enable the features you need. Most features are disabled or configurable individually.

## Features

### Navigation and Widgets

<details>
<summary>Village List</summary>

> Shows all villages in a quick-access widget. The list is refreshed when the cached data is incomplete.

![Village List](.github/images/villageList.png)
![Village List2](.github/images/villageListPopup.png)
</details>

<details>
<summary>Village Navigation</summary>

> Adds previous and next village controls. The `A` and `D` keys can also be used to switch villages.

![Village Navigation Arrows](.github/images/navigationArrows.png)
</details>

<details>
<summary>Custom Navigation Bar</summary>

> Create shortcuts to frequently used TribalWars pages and arrange them in your preferred order.

![Custom Navigation Bar](.github/images/navigationBar.png)
![Navigation Bar Editor](.github/images/navigationBar_items.png)
</details>

<details>
<summary>Village Notepad</summary>

> Keep a separate note for each village. The editor supports common BBCode tags and resolves players, tribes and coordinates from game data.

![Village Notepad](.github/images/notepad.png)
![Village Notepad2](.github/images/notepad2.png)
</details>

<details>
<summary>Notepad Page</summary>

> Notes for every village can be managed from the notepad page. Notes can be exported and imported as JSON.

![Notepad Page](.github/images/extraMemo.png)
</details>

<details>
<summary>Recruitment Widget</summary>

> Recruit troops from the sidebar. Costs, population, resources, training queues and the maximum affordable amount update as you edit the form.

![Recruitment Widget](.github/images/recruitTroops.png)
</details>

<details>
<summary>Building Queue Widget</summary>

> Manage upgrades from the sidebar. The script can keep a local waiting queue and submit upgrades when resources and server slots are available.

![Building Queue](.github/images/extraBuildQueue2.png)
</details>

### Overview

<details>
<summary>Visual Building Overview</summary>

> Adds building levels, resource information and queue timers to the overview page.

![Visual Building Overview](.github/images/overviewExtraInfo.png)
![Visual Building Overview Details](.github/images/overviewExtraInfo2.png)
</details>

<details>
<summary>Overview Villages</summary>

> Enhances the all-villages overview with building queues, one troop column per unit type, storage fill times, village notes and quick links.

> This view requires at least two villages. Troop values may need a manual refresh and can be temporarily stale.

![Overview Villages2](.github/images/overviewVillages21.png)
![Overview Villages](.github/images/overviewVillages0.png)
</details>

<details>
<summary>Storage Timer</summary>

> Hover over the resource bars or storage values to see the estimated time until storage is full.

![Storage Fill Time](.github/images/ressourceFullHover.png)
</details>

### Map and Commands

<details>
<summary>Large Map</summary>

> Use a larger map and choose its size from the map controls.

![Large Map](.github/images/largeMap.png)
![Large Map Commands](.github/images/largeMap2.png)
</details>

<details>
<summary>Map Hover Information</summary>

> Shows recent attack information, loot, discovered resources, morale and other village details when hovering over the map.

![Map Hover Information](.github/images/mapVillageHoverExtraInfo.png)
</details>

<details>
<summary>Outgoing Commands and Travel Times</summary>

> Displays outgoing command icons and calculates travel times for available unit types.

![Outgoing Commands](.github/images/outgoingCommands.png)
</details>

<details>
<summary>Attack Heatmap</summary>

> Highlights villages according to the frequency and recency of attacks found in stored reports. - NOT WORKING

![Attack Heatmap](.github/images/heatmap.png)
</details>

<details>
<summary>Custom Map Groups</summary>

> Create coloured groups matching village coordinates, players or tribes. Groups are stored per world and player, and the first matching group takes priority.

![Custom Map Groups](.github/images/mapGroups.png)
![Custom Map Groups2](.github/images/mapGroups2.png)
</details>

<details>
<summary>Troop Templates</summary>

> Create, edit, delete and apply custom troop templates in command forms and map attack menus.

![Troop Templates](.github/images/troopTemplates.png)
</details>

<details>
<summary>Map Quick Action Buttons</summary>

> Adds quick action buttons to the map context menu for quick attacks using saved troop templates, quick reservations and quick addition of villages to map groups.

![Map Quick Action Buttons](.github/images/mapCtxButtons.png)
</details>

<details>
<summary>Map SDK</summary>

> The local SDK adaptation is based on the Map SDK by Thomas "Sass" Ameye: https://shinko-to-kuma.com/scripts/mapSdk.js. Thank you to the author for providing the original foundation.
</details>

### Reports and Simulator

<details>
<summary>Report to Simulator</summary>

> Opens the simulator with attacker troops, defender troops, away defenders, wall level, luck, morale, religion and applicable buffs filled from an attack report.

![Report to Simulator](.github/images/simulatorButton.png)
</details>

<details>
<summary>TWStats Player History</summary>

> Adds extra player history and ranking information to player profiles using a request to TWStats.

> This feature depends on the external `twstats.com` service and may stop working if its pages or availability change.

![TWStats Player History](.github/images/playerProfileStats.png)
</details>

### Automation

<details>
<summary>Auto Daily Bonus</summary>

> Collects the daily bonus when it is available and schedules the next check using server time.
</details>

<details>
<summary>Auto Build Instant Free</summary>

> Completes an eligible active building upgrade during TribalWars' final three-minute free window.
</details>

### Interface and Settings

<details>
<summary>Settings</summary>

> Enable or disable features, arrange widgets, configure automation and export or import all script settings as JSON.

![Script Settings](.github/images/scriptSettings.png)
</details>

<details>
<summary>Languages</summary>

> The interface is available in English and Portuguese.
</details>

<details>
<summary>Small Interface Improvements</summary>

> Optional utilities include hiding Premium promotions, redirecting training buildings to recruitment pages and keeping the page active while it is open.

![Premium Promotion Removal](.github/images/premium_promo.png)
</details>

<details>
<summary>Bot Protection Handling</summary>

> When TribalWars displays an anti-bot screen, the script can stop its features automatically to prevent continuous requests while the protection is active, helping reduce the risk of bans. This behavior is controlled in the settings.
</details>

## Data and Limitations

- IndexedDB stores structured data for build queues, recruitment data, reports, notes and map data.
- `localStorage` stores settings and selected world- or player-specific data.
- The extra building queue is a local waiting queue. It does not increase the server's real queue limit: normally two slots for free accounts and five for Premium accounts.
- The browser tab must remain open for the local build queue and scheduled automation to run. (It's not recommended to leave the tab open on *overview_villages* page.)
- Mobile pages are not supported.
- Some overview and troop data is cached and may require a refresh.
- Map and report information depends on the data available from TribalWars pages.
- The script includes server-timezone handling and is expected to work across different countries and worlds. Some features scrape HTML text, so language or markup changes may cause problems. Please report them so they can be investigated.
- The custom quick-link source and some anti-bot cache/offline settings are not implemented.
- The dark-mode module exists in the codebase but is not currently exposed as an active setting.

## Local Development

[main.user.js](main.user.js) is the distributable entry point and loads the published files from GitHub.

[main_local.user.js](main_local.user.js) is the local-development entry point. Its `@require` paths must point to local files using the `file:///...` format. In Tampermonkey, enable **Allow access to file URLs** for the browser extension.

Edit the feature files directly, then reload the TribalWars page to test them. Reinstall the local userscript only when changing its metadata or local `@require` paths.

## License and Disclaimer

This project is licensed under the [Personal Use License](LICENSE).

The code may be used, copied and modified for personal, non-commercial purposes only. Selling the project, selling modified versions, sublicensing it or including it in a commercial product or service is not permitted without prior written permission from the author.

This project is not affiliated with, endorsed by or sponsored by InnoGames or TribalWars. TribalWars and InnoGames are trademarks of their respective owners.

This project is provided for personal use and experimentation. Automation may violate the Terms of Service or local rules of a TribalWars world.

The software is provided "as is", without guarantees of availability, accuracy or compatibility. It may not work on every world, country, language or game version. Some features interact with external services or parse TribalWars HTML, which may change without notice.

The building queue is a separate feature from these bots and has reportedly worked with at least 10 villages without a ban.

> **A note from an entirely unnamed experimental subject:** “The queue works. Tested with 10 villages. Still not banned.”

Enable automation only if you accept the risks. The author is not responsible for bans, restrictions or data loss.
