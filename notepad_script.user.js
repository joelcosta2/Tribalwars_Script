(function () {
    'use strict';

    // Notepad Module
    function loadNote() {
        var cookieNotepadJson = getCookie('vilagges_notepad');
        var notepadArray = cookieNotepadJson ? JSON.parse(cookieNotepadJson) : [];
        var textToShow = notepadArray[currentVillageIndex];

        if (textToShow !== '') {
            // village_note_script show this
            toggleElement('village_note_script');
            //set text to village-note-body_script
            var textPlacer = document.getElementById('village-note-body_script');
            textPlacer.textContent = textToShow;

        }
    }

    function saveNote() {
        var textToSave = document.getElementById('message_note_script').value;
        var currentCookieValue = getCookie('vilagges_notepad');
        var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        notepadArray[currentVillageIndex] = textToSave;
        var jsonToSave = JSON.stringify(notepadArray);
        setCookie('vilagges_notepad', jsonToSave, 100000000000000);
        toggleElement('note_body_edit');
        loadNote();
        toggleElement('edit_notepad_link_script');
    }

    function openEditModeNote() {
        listenTextAreas();
        var currentCookieValue = getCookie('vilagges_notepad');
        var notepadArray = currentCookieValue ? JSON.parse(currentCookieValue) : [];
        document.getElementById('message_note_script').value = notepadArray[currentVillageIndex];
        toggleElement('note_body_edit');
        document.getElementById('village_note_script').style.display = 'none';
        document.getElementById('edit_notepad_link_script').style.display = 'none';
    }

    function injectNotepadOveriew(columnToUse) {
        if (showNotepad) {
            // Criação do botão "Editar"
            var editLink = document.createElement('a');
            editLink.id = 'edit_notepad_link_script';
            editLink.textContent = '» Editar';
            editLink.onclick = function () {
                openEditModeNote();
            };

            // Criação da área de texto para a nota e do botão "Guardar"
            var noteTextarea = document.createElement('textarea');
            noteTextarea.id = 'message_note_script';
            noteTextarea.name = 'note';
            noteTextarea.style.width = '97%';
            noteTextarea.rows = '10';
            noteTextarea.cols = '40';

            var saveButton = document.createElement('a');
            saveButton.id = 'note_submit_button_script';
            saveButton.className = 'btn btn-default';
            saveButton.textContent = 'Guardar';
            saveButton.onclick = function () {
                saveNote();
            };

            // Criação da estrutura da tabela
            var table = document.createElement('table');
            table.width = '100%';

            var tbody = document.createElement('tbody');

            // Criação da linha para mostrar a nota
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

            noteDiv.appendChild(noteBodyDiv);
            noteCell.appendChild(noteDiv);
            noteRow.appendChild(noteCell);

            // Criação da linha para editar a nota
            var editRow = document.createElement('tr');
            editRow.id = 'note_body_edit';
            editRow.style.display = 'none';

            var editCell = document.createElement('td');
            var editDiv = document.createElement('div');
            editDiv.className = 'village-note';
            editDiv.style.width = '100%';
            editDiv.style.overflow = 'hidden';

            var textareaDiv = document.createElement('div');
            textareaDiv.appendChild(noteTextarea);

            var buttonDiv = document.createElement('div');
            buttonDiv.appendChild(saveButton);

            editDiv.appendChild(textareaDiv);
            editDiv.appendChild(buttonDiv);

            var editNoteBodyDiv = document.createElement('div');
            editNoteBodyDiv.className = 'village-note-body';
            editDiv.appendChild(editNoteBodyDiv);

            editCell.appendChild(editDiv);
            editRow.appendChild(editCell);

            // Criação da linha para o botão "Editar"
            var editButtonRow = document.createElement('tr');
            var editButtonCell = document.createElement('td');
            editButtonCell.appendChild(editLink);
            editButtonRow.appendChild(editButtonCell);

            tbody.appendChild(noteRow);
            tbody.appendChild(editRow);
            tbody.appendChild(editButtonRow);
            table.appendChild(tbody);

            createAssetElement('Notepad', table, columnToUse);
            loadNote();
        }
    }
})();