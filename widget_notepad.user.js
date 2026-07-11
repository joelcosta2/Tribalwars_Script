
// Notepad Module

/**
 * Loads the saved note for the current village from localStorage and renders it
 * as HTML (converting BBCode) inside the notepad display area.
 */
function loadNote() {
    var cookieNotepadJson = localStorage.getItem('vilagges_notepad');
    var notepadArray = cookieNotepadJson ? JSON.parse(cookieNotepadJson) : [];
    var textPlacer = document.getElementById('village-note-body_script');
    var notepadText = notepadArray[currentVillageIndex];

    if (notepadText != null && notepadText !== '' && textPlacer) {
        toggleElement('village_note_script');
        textPlacer.innerHTML = convertBBCodeToHTML(notepadText);
    }
}

/**
 * Saves the current textarea content to localStorage for the active village.
 * @param {boolean} [closeNotepad=true] - If true, hides the edit form and reloads the display view.
 */
function saveNote(closeNotepad = true) {
    var textToSave = document.getElementById('message_note_script').value;
    var currentCookieValue = localStorage.getItem('vilagges_notepad');
    var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
    notepadArray[currentVillageIndex] = textToSave;
    var jsonToSave = JSON.stringify(notepadArray);
    localStorage.setItem('vilagges_notepad', jsonToSave);
    if (closeNotepad) {
        toggleElement('note_body_edit');
        loadNote();
        toggleElement('edit_notepad_link_script');
    }
}

/**
 * Switches the notepad into edit mode: sets up BBCode targets, populates the textarea
 * with the stored note, shows the editor, and moves focus to the end of the text.
 */
function openEditModeNote() {
    const lang = JSON.parse(localStorage.getItem('tw_lang'));
    //set target BBCodes
    BBCodes.target = {0: document.getElementById('message_note_script')}

    listenTextAreas();

    var currentCookieValue = localStorage.getItem('vilagges_notepad');
    var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
    document.getElementById('message_note_script').value = notepadArray[currentVillageIndex];
    toggleElement('note_body_edit');
    
    document.getElementById('village_note_script').style.display = 'none';
    document.getElementById('edit_notepad_link_script').style.display = 'none';
    
    var noteElem = document.getElementById('message_note_script');
    noteElem.focus();
    noteElem.setSelectionRange(noteElem.value.length, noteElem.value.length);
}

/**
 * Builds and injects the notepad widget into the given column.
 * Creates the BBCode toolbar, the textarea, the save button, and the read-only
 * display area, then loads any existing note for the current village.
 * @param {string} columnToUse - Target column identifier passed to createWidgetElement.
 */
function injectNotepadWidget(columnToUse) {
    if (settings_cookies.general['show__notepad']) {
        var editLink = document.createElement('a');
        editLink.id = 'edit_notepad_link_script';
        editLink.classList.add('btn');
        editLink.textContent = '» Edit';
        editLink.addEventListener('click', openEditModeNote);

        // Create the main BBCode toolbar container
        let BBCodesArea = document.createElement("div");
        BBCodesArea.id = "bb_bar";
        BBCodesArea.style.textAlign = "left";
        BBCodesArea.style.overflow = "visible";
        BBCodesArea.setAttribute("data-target", "message");

        // Button definitions: BBCode tag, tooltip title, and sprite sheet offset
        const bbButtons = [
            { id: "bb_button_bold",          tag: "b",   title: "Bold",          pos: "0px" },
            { id: "bb_button_italic",        tag: "i",   title: "Italic",        pos: "-20px" },
            { id: "bb_button_underline",     tag: "u",   title: "Underline",     pos: "-40px" },
            { id: "bb_button_strikethrough", tag: "s",   title: "Strikethrough", pos: "-60px" },
            { id: "bb_button_url",           tag: "url", title: "URL",           pos: "-160px" },
        ];

        // Build each BBCode button dynamically from the definitions above
        bbButtons.forEach(btn => {
            let button = document.createElement("a");
            button.id = btn.id;
            button.href = "#";
            button.setAttribute("data-title", btn.title);
            button.onclick = function () {
                BBCodes.insert(`[${btn.tag}${btn.extra || ""}]`, `[/${btn.tag}]`);
            };

            let span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.background = `url(https://dspt.innogamescdn.com/asset/95eda994/graphic/bbcodes/bbcodes.png) no-repeat ${btn.pos} 0px`;
            span.style.width = "20px";
            span.style.height = "20px";
            span.style.marginRight = "2px";
            span.style.marginBottom = "3px";

            button.appendChild(span);
            BBCodesArea.appendChild(button);
        });

        var noteTextarea = document.createElement('textarea');
        noteTextarea.id = 'message_note_script';
        noteTextarea.name = 'note';
        noteTextarea.style.width = '-webkit-fill-available';
        noteTextarea.rows = '10';
        noteTextarea.cols = '40';

        var saveButton = document.createElement('a');
        saveButton.id = 'note_submit_button_script';
        saveButton.className = 'btn btn-default';
        saveButton.textContent = lang['c9cc8cce247e49bae79f15173ce97354'];
        saveButton.addEventListener('click', saveNote);

        var table = document.createElement('table');
        table.width = '100%';
        var tbody = document.createElement('tbody'); 

        var noteRow = document.createElement('tr');
        noteRow.id = 'village_note_script';
        noteRow.style.display = 'none';

        var noteCell = document.createElement('td');
        var noteDiv = document.createElement('div');
        noteDiv.className = 'village-note';
        var noteBodyDiv = document.createElement('div');
        noteBodyDiv.id = 'village-note-body_script';
        noteBodyDiv.className = 'village-note-body';
        noteBodyDiv.style.whiteSpace = 'pre-wrap';
        noteBodyDiv.style.cursor = 'pointer';
        noteBodyDiv.addEventListener('dblclick', openEditModeNote);
        noteDiv.appendChild(noteBodyDiv);

        noteCell.appendChild(noteDiv);
        noteRow.appendChild(noteCell);

        var editRow = document.createElement('tr');
        editRow.id = 'note_body_edit';
        editRow.style.display = 'none';

        var editCell = document.createElement('td');
        var editDiv = document.createElement('div');
        editDiv.className = 'village-note';
        editDiv.style.width = '100%';
        editDiv.style.overflow = 'hidden';

        var buttonDiv = document.createElement('div');
        buttonDiv.appendChild(saveButton);

        editDiv.appendChild(BBCodesArea);
        editDiv.appendChild(noteTextarea);
        editDiv.appendChild(buttonDiv);

        var editNoteBodyDiv = document.createElement('div');
        editNoteBodyDiv.className = 'village-note-body';
        editDiv.appendChild(editNoteBodyDiv);

        editCell.appendChild(editDiv);
        editRow.appendChild(editCell);

        var editButtonRow = document.createElement('tr');
        var editButtonCell = document.createElement('td');
        editButtonCell.appendChild(editLink);
        editButtonRow.appendChild(editButtonCell);

        tbody.appendChild(noteRow);
        tbody.appendChild(editRow);
        tbody.appendChild(editButtonRow);
        table.appendChild(tbody);

        createWidgetElement({ identifier: 'Notepad', contents: table, columnToUse, update: '', extra_name: '', description: 'Save notes for your villages', title: lang['744c0e143621b2e2aeaee257475d6d22']});
        loadNote();
    }
}

/**
 * Toggles the visibility of a DOM element between hidden and visible.
 * @param {string} element - The id of the element to toggle.
 */
function toggleElement(element) {
    var elementToToggle = document.getElementById(element);
    if (elementToToggle) {
        if (elementToToggle.style.display === 'none') {
            elementToToggle.style.display = '';
        } else {
            elementToToggle.style.display = 'none';
        }
    }
}