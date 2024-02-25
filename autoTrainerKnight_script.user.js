function injectScriptAutoTrainerKnight() {
    var trainLevel = parseInt(localStorage.getItem('auto_trainer_knight_level'));
    //button toggle
    var toggleButton = document.createElement('button');
    toggleButton.classList.add(trainLevel !== -1 ? 'toggle-on' : 'toggle-off');
    toggleButton.id = 'toggleButton';
    toggleButton.addEventListener('click', function () {
        this.classList.toggle('toggle-on');
        var select_auto_trainer_level = document.querySelector('#select_auto_trainer_level');
        if (select_auto_trainer_level) {
            select_auto_trainer_level.style.display = (select_auto_trainer_level.style.display === 'none') ? 'block' : 'none';
        }
        var trainLevel = parseInt(localStorage.getItem('auto_trainer_knight_level'));
        if (trainLevel !== -1) {
            localStorage.setItem('auto_trainer_knight_level', -1);
        }
    });
    var text = document.createTextNode('Auto-Trainer  ');
    var container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.appendChild(text);
    container.appendChild(toggleButton);

    //Options for trainer levels
    var options = ['None', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
    var selectElement = document.createElement('select');
    selectElement.className = 'input-nicer';
    selectElement.id = 'select_auto_trainer_level';
    selectElement.style.display = trainLevel !== -1 ? 'block' : 'none';
    selectElement.addEventListener('change', function () {
        localStorage.setItem('auto_trainer_knight_level', this.value);
    });
    options.forEach(function (optionText, index) {
        var optionElement = document.createElement('option');
        optionElement.value = index - 1;
        optionElement.textContent = optionText;
        if (index - 1 === trainLevel) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });
    container.appendChild(selectElement);

    var divElement = document.createElement('div');
    divElement.style.display = 'flex';
    divElement.style.alignItems = 'baseline';
    divElement.style.justifyContent = 'flex-start';
    var existingH3 = document.querySelector('h3');
    var h3TextContent = existingH3.textContent;
    var h3Element = document.createElement('h3');
    h3Element.textContent = h3TextContent;
    h3Element.style.width = '12%';
    h3Element.style.marginTop = '12px';
    divElement.appendChild(h3Element);
    divElement.appendChild(container);
    existingH3.parentNode.replaceChild(divElement, existingH3);

    runAutoTrainer(document);

    /*let $html = `<h3 align="center">Knight Training</h3>
    <div class="info_box">
        <div class="content">Choose training option:</div>
    </div>
    <table width="100%">
        <tbody>`;

    BuildingStatue.knights[Object.keys(BuildingStatue.knights)[0]].usable_regimens.forEach(function (el, i) {

        if (i % 2 === 0) $html += '<tr>';

        $html += `
                <td>
                    <div class="time">
                        <input type="radio" name="trainer-knights" value="${i}">
                        <span style="margin-bottom: 1px" class="icon header time"></span>${String(
            Math.floor(
                el.duration / 3600
            )
        ).padStart(2, '0')}:${String(
            Math.floor(
                (el.duration % 3600) / 60
            )
        ).padStart(2, '0')}:${String(
            Math.floor(el.duration % 60)
        ).padStart(2, '0')}
                    </div>
                </td>`;

        if (i % 2 !== 0 || i === 4) $html += '</tr>';
    }
    );

    $html += `
        </tbody>
    </table>
    <div style="padding-top: 4px">
        <input type="button" id="start" class="btn" value="Start Training">
        <input type="button" id="save" class="btn" value="Save Options">
    </div>
    <br>
    <small>
        <strong>
            Knight Training v1.1 by<span style="color: red"> K I N G S </span>
        </strong>
    </small>`;

    Dialog.show('Knights', $html);
    let val = Number(localStorage.getItem('Statue'));

    $(`input[value="${val === undefined ? 0 : val}"]`).prop('checked', true);

    $('#save').on('click', function () {
        localStorage.setItem('Statue', $('input[type="radio"]:checked').val());
        UI.SuccessMessage(
            'The settings have been saved successfully.'
        );
    });

    $('#start').on('click', function (e) {
        e.preventDefault();
        val = Number($('input[type="radio"]:checked').val());
        Dialog.close();
        Object.keys(BuildingStatue.knights).forEach((i, el) => {
            setTimeout(function () {
                TribalWars.post(
                    game_data.link_base.replace('amp;screen=', '') +
                    'screen=statue&ajaxaction=regimen',
                    null,
                    {
                        knight: BuildingStatue.knights[i].id,
                        regimen: BuildingStatue.knights[i].usable_regimens[val].id,
                    },
                    function () {
                        UI.SuccessMessage(_('386e303de70e5a2ff1b5cabefb0666f5'));
                    },
                    function (r) {
                        console.error(r);
                    }
                );
            }, el * 250);
        });
    });*/
}

function runAutoTrainer() {
    var trainLevel = parseInt(localStorage.getItem('auto_trainer_knight_level'));
    if (trainLevel !== -1) {
        var trainStartButton = document.querySelector('.knight_train_launch');
        if (trainStartButton) {
            trainStartButton.click();
            wait(1).then(() => {
                var trainLevelsButtons = document.querySelectorAll('.btn.knight_regimen_confirm:not([class*="btn-pp"])');
                var trainLevel = parseInt(localStorage.getItem('auto_trainer_knight_level'));

                if (trainLevelsButtons.length) {
                    trainLevelsButtons[trainLevel].click();
                    wait(1).then(() => {
                        var trainEndTime = document.querySelector('[data-endtime]').getAttribute('data-endtime') * 1000; //Convert to milliseconds
                        if (trainEndTime) {
                            var auto_trainer_next_train = new Date(trainEndTime);
                            var waitTime = (auto_trainer_next_train.getTime() - Date.now() + timeToMilliseconds('00:00:03'));
                            if (waitTime > 0) {
                                setFunctionOnTimeOut('auto_trainer_knight', function () {
                                    window.location.href = '/game.php?village=' + game_data.village.id + '&screen=statue';
                                }, waitTime);
                            }
                            history.back();
                        }
                    })
                }
            });

        }
    }
}