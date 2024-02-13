# Tribalwars_Script

## Description

Tribalwars_Script is a collection of scripts designed to enhance the gaming experience in Tribalwars. These scripts provide additional features that are typically available only to premium users, along with other useful options. A new column has been added to the left of the main screen, and new assets added by this script will remember their position on the main screen.

## Key Features

- **Arrows for Changing Villages:** Navigate between villages more efficiently with arrow controls.

  ![Arrows for Changing Villages](images/arrows_example.png)

- **Village List for Easy Selection:** Access a convenient list of villages for quick selection.

  ![Village List for Easy Selection](images/village_list_example.png)

- **Notes for Each Village:** Keep track of important details by adding notes to individual villages.

  ![Notes for Each Village](images/notes_example.png)

- **Extra Village Information on Map Hover:** Get additional village information on hover on the map, including details such as the last raid performed, resources detected in the last attack, date of the last attack, and ongoing attack or return.

  ![Extra Village Information on Map Hover](images/extra_info_example.png)

## How to Use

These scripts are intended for use with Tampermonkey, a popular userscript manager for web browsers.

1. **Install Tampermonkey:** If you haven't already, install the [Tampermonkey extension](https://www.tampermonkey.net/) for your web browser.
2. **Install the Script:**
   - Open Tampermonkey and navigate to the "Utilities" tab.
   - In the "Import from URL" field, paste the following link: `https://github.com/joelcosta2/Tribalwars_Script/archive/refs/heads/master.zip`.
   - Click "Install" to add the script to Tampermonkey.
3. **Import the Script:** After installation, click "Import" to import the script into Tampermonkey.

## Notes

- These functionalities only work in the browser and have only been tested with one account/world. Support for multiple accounts or worlds may be added in the future.
- All information is saved in browser cookies.
- The default TW assets on the main screen currently do not retain their position after a refresh (bug to fix).
- Some information is fetched from an AJAX call to the corresponding page. For example, to retrieve information on village hover (regarding last attacks info), the script will fetch the page for that specific report and extract the information to display on the map. I'm currently working on reducing the number of calls to prevent detection by the TW bot-catching tool and decrease the likelihood of a ban.
- By the way, I'm not responsible for any bans resulting from using this script. It is intended to be used in moderation to enhance the gameplay of a casual player without any intention of gaining an advantage over other players.

Enjoy the enhanced features while playing Tribalwars!
