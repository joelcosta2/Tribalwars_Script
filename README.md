# Tribalwars: Premium Features

## Description

**Tribalwars: Premium Features** is a comprehensive enhancement suite designed to elevate the Tribalwars gaming experience by unlocking utility tools typically reserved for Premium Account holders. The script streamlines empire management by introducing a fully customizable **Extra-Large Map**, an **Infinite Building Queue** and advanced automation for routine tasks like **Scavenging** and **Paladin Training**.

To optimize your workflow, the script injects a persistent sidebar on the left side of the screen. All introduced widgets are draggable and feature **state-memory**, meaning they will remember their exact position on your screen every time you log in. Whether you are a casual player or a competitive strategist, this script provides the data transparency and one-click convenience needed to manage your villages with maximum efficiency, even without a premium account.

## Key Features

### 🗺️ Map Enhancements
- **Extra Large Map:** Enjoy a larger map without premium. Toggle it on the map page and set the size freely—no limits!
  ![Extra Large Map](.github/images/largeMap.png)

- **Extra Village Information on Map Hover:** Gain valuable insights with additional village information displayed on map hover. Details include the last raid performed, resources detected in the last attack, date of the last attack, and ongoing attack or return.
  ![Extra Village Information on Map Hover](.github/images/mapVillageHoverExtraInfo.png)

- **Direct Template Attacks from Map:** Quick-action buttons added to the map context menu to launch attacks using saved troop templates with a single click.
  ![Direct Template Attacks from Map](.github/images/mapCtxButtons.png)

- **Outgoing Units Info on Map:** Icons added on the map to show outgoing units per village.
  ![Outgoing Units Info on Map](.github/images/largeMap2.png)

- **Attack Heat-Map:** Colour-coded overlay on the map showing attack frequency and recency per village. Intensity reflects how often and how recently a village has been attacked over the last 14 days.
  ![Attack Heat-Map](.github/images/heatmap.png)

### 🏰 Village & Overview Management
- **Premium info Overview Screen:** Access additional details directly on the overview page, such as the time remaining for the storage to fill or the status of each individual resource. (In progress – replicating features typically available only to Premium users).
  ![Overview Info](.github/images/overviewExtraInfo.png)
  ![Overview Info 2](.github/images/overviewExtraInfo2.png)

- **Arrows for Changing Villages:** Seamlessly navigate between villages using intuitive arrow controls.
  ![Arrows for Changing Villages](.github/images/navigationArrows.png)

- **Village List for Easy Selection:** Quickly access a comprehensive list of villages for efficient selection.
  ![Village List for Easy Selection](.github/images/villageList.png)

- **Notes for Each Village:** Stay organized by adding important notes to individual villages for easy reference.
  ![Notes for Each Village](.github/images/notepad.png)

- **Storage Fill Time on Resource Hover:** Monitor your resource storage effectively. Hover over the resource bar to see the estimated time remaining until wood, stone, and iron reach maximum capacity.
  ![Storage Fill Time on Resource Hover](.github/images/ressourceFullHover.png)

### ⚔️ Reports & Simulator

- **Report to Simulator:** A "View in Simulator" button is injected into attack report pages. Clicking it reads attacker and defender troop counts, wall level, luck, morale, and unit buffs from the report, and redirects to the simulator with all fields pre-filled — no manual entry needed.
  ![Report to Simulator](.github/images/simulatorButton.png)

### ⚙️ UI Customization & Settings
- **Navigation Bar:** Custom navigation bar where you can add shortcuts to various pages. Shortcuts can be edited.
  ![Navigation Bar](.github/images/navigationBar.png)
  ![Navigation Bar Edit](.github/images/navigationBar_items.png)

- **Remove Premium Promos:** Clean up your UI by removing advertising for premium promotions.
  ![Remove Premium Promos](.github/images/premium_promo.png)
  ![Remove Premium Promos](.github/images/premium_promo2.png)

- **Script Settings:** Customize your experience with in-game settings to control various aspects of the script. Adjust options to suit your gameplay style.
  ![Script Settings](.github/images/scriptSettings.png)

### 🛠️ Building, Construction & Troops

- **Recruit Troops Widget:** Train troops directly from the sidebar without navigating to the barracks. Shows per-unit costs, live population availability, and updates the maximum affordable quantity in real time as you adjust values.
  ![Recruit Troops Widget](.github/images/recruitTroops.png)
- **Building Queue Manager:** Conveniently manage your building queue from the overview page by easily adding or removing buildings without navigating through multiple menus.
  ![Building queue](.github/images/extraBuildQueue0.png)

- **Extra Building Queue (Infinite Queue):** Expands the standard queue, allowing you to schedule more than two buildings at a time—similar to the premium option. 
  - **Green**: Building is currently being upgraded.  
  - **Orange**: In the "fake" queue (waiting for resources).  
  *Note: The browser must remain open for this feature to function.*
  ![Extra Building queue](.github/images/extraBuildQueue2.png)

- **Auto Build Instant Free:** Monitors the active building upgrade and automatically clicks the free instant-complete button when less than 3 minutes remain — the window TribalWars offers for free. Re-arms itself after each build finishes so no free window is ever missed.

### 📊 Resources & Automation

- **Auto Scavenging:** Fully configurable per-village automation. A config panel injected on the scavenge page lets you enable or disable the bot per village, choose between sending all available units or a custom subset, select the target scavenge tier, and pick an optimisation mode: **Balanced** (equalises return times across active tiers) or **Fastest** (minimises total trip time). Troops are distributed optimally across unlocked slots and re-sent automatically once they return.
  ![Auto Scavenge Config](.github/images/scavengeConfig.png)

- **Auto Paladin Trainer:** Trains the Paladin automatically using the cheapest available regimen. Schedules the next session when training finishes and supports a configurable max-level cap.

- **Auto Daily Bonus:** Automatically collects the daily login bonus as soon as it becomes available. If already collected for the day, it schedules the next collection for the following server midnight (with a small random delay to mimic human behaviour).

## How to Use

These scripts are intended for use with Tampermonkey, a popular userscript manager for web browsers.

1. **Install Tampermonkey:** If you haven't already, install the [Tampermonkey extension](https://www.tampermonkey.net/) for your web browser.
2. **Install the Script:**
   - Open Tampermonkey and navigate to the "Utilities" tab.
   - In the "Import from URL" field, paste the following link: `https://github.com/joelcosta2/Tribalwars_Script/archive/refs/heads/master.zip`.
   - Click "Install" to add the script to Tampermonkey.
3. **Import the Script:** After installation, click "Import" to import the script into Tampermonkey.

## For Those Who Want to Develop with This
1. **Download project:**
   - Download or clone the project to your local machine.
2. **Change you project file path:**
   - Edit the **main_local.user** file, and past follow settings on the file, replacing YOUR_PATH:
        ```javascript
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\util\core_utils.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\util\core_css.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\util\core_settings.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_villageArrows.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_navigationBar.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\features\feature_map.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\features\feature_overview.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\features\feature_simulator.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\bots\bot_trainerPaladin.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\bots\bot_scavenging.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\bots\bot_dailyBonus.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\bots\bot_buildInstantFree.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_villageList.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_notepad.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_extraBuildQueue.user.js
      // @require      file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\widgets\widget_recruitTroops.user.js
      // @updateURL    file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\main_local.user.js
      // @downloadURL  file://C:\{YOUR_PATH}\Tribalwars-Premium-Features\main_local.user.js
        ```

   
3. **Import the main file on Tampermonkey:**
   - Open Tampermonkey and navigate to the "Utilities" tab.
   - In the "Import from file" field, select the **main_local.user**.
   - Click "Install" to add the script to Tampermonkey.
4. **Make your changes:**
   - Edit the scripts and test them directly in your browser. You only need to reinstall the script if you make changes to the **main_local.user** file
5. **Make sure you have Allow access to file URLs for Tampermonkey(TP):**
   - Go to Extensions on your browser and find the TM 'card'.
   - Click details and "Allow access to file URLs".
   
  ![Allow access to file URLs](.github/images/dkHgL.png)

6. **Notice the file:// URI scheme:**
      - for windows:

            // @require   file://C:\path\to\userscript.user.js

      - for macOS and *nix:

            // @require   file:///path/to/userscript.user.js

## Notes

- These features currently work only in the browser and have been tested with a single account/world. Support for multiple accounts or worlds may be added in the future.
- All data is stored in the browser's local storage.
- I have no idea how it works in other worlds other then PT and BR. Feel free to test it and let me know! :)
- Some information is retrieved via AJAX calls to the relevant pages. For example, village hover info (such as recent attack details) is scraped from the corresponding report page and displayed on the map.
- I know this is basically spaghetti code, but I'm having a lot of fun getting it to work. I just wish my villages weren’t constantly being conquered—it makes it hard to test this with multiple villages. Maybe I should focus more on the game and less on the script!

Enjoy the enhanced features while playing Tribalwars!


## ⚠️ Disclaimer & Warning

**Important:** Some features included in this script, specifically those involving automation (such as Auto-Scavenging, Auto-Train Paladin, Auto Daily Bonus, and Extra Building Queue), may violate the Terms of Service (ToS) of certain TribalWars servers. 

- **Use at your own risk:** I'm are not responsible for any bans or account restrictions.
- **Fair Play:** I recommend using automation features sparingly and in a way that mimics human behavior to minimize the risk of detection.
- **Check your server rules:** Always verify the local rules of your game world regarding scripts that perform automated actions or multiple actions with a single click.