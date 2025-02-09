function injectScriptAutoTrainerPaladin() {
    /*
    var trainLevel = parseInt(localStorage.getItem('auto_trainer_paladin_level'));
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
        var trainLevel = parseInt(localStorage.getItem('auto_trainer_paladin_level'));
        if (trainLevel !== -1) {
            localStorage.setItem('auto_trainer_paladin_level', -1);
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
        localStorage.setItem('auto_trainer_paladin_level', this.value);
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
    existingH3.parentNode.replaceChild(divElement, existingH3);*/
    
    if(settings_cookies.general['show__auto_paladin_train'].enabled === true) {
        runAutoTrainer();
    }
}

async function runAutoTrainer() {
    const isAutoWaiting = localStorage.getItem('function_auto_trainer_paladin')

    const userChoice = !isAutoWaiting ? await displayWarningPopup('Confirm Auto Paladin Train', 'Do you wish to continue with the paladin train automation?') : 'cancel';
    if (userChoice === 'cancel') {
        return;
    } else {
        //var trainLevel = parseInt(localStorage.getItem('auto_trainer_paladin_level'));

        var trainStartButton = document.querySelector('.knight_train_launch');
        if (trainStartButton) {
            trainStartButton.click();
            wait(1).then(() => {
                var trainLevelsButtons = document.querySelectorAll('.btn.knight_regimen_confirm:not([class*="btn-pp"])');
                //var trainLevel = parseInt(localStorage.getItem('auto_trainer_knight_level'));
                var trainLevel = 0;
                if (trainLevelsButtons.length) {
                    trainLevelsButtons[trainLevel].click();
                    
                    console.log("PaladinTrainer started at: " + new Date());
                    wait(1).then(() => {
                        var trainTime = document.querySelector('[data-endtime]');
                        if (trainTime) {
                            var waitTime = timeToMilliseconds(trainTime.textContent) + 15000; //15 more sec

                            if (waitTime > 0) {
                                setFunctionOnTimeOut('auto_trainer_paladin', function () {
                                    window.location.href = game_data.link_base_pure + 'statue';
                                }, waitTime);
                                
                                console.log("PaladinTrainer next at " + new Date(Date.now() + waitTime))
                            }
                        }
                    })
                }
            });

        } else {
            var trainTime = document.querySelector('[data-endtime]');
            if (trainTime) {
                var waitTime = timeToMilliseconds(trainTime.textContent) + 15000; //15 more sec

                if (waitTime > 0) {
                    setFunctionOnTimeOut('auto_trainer_paladin', function () {
                        window.location.href = game_data.link_base_pure + 'statue';
                    }, waitTime);
                }
            }
        }
    }
}