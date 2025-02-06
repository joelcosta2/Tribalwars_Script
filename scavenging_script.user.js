

function injectAutoScavengingOption() {
    /*
    const unitNames = ['spear', 'sword', 'axe', 'archer', 'light', 'marcher', 'heavy', 'knight'];

    const tr = document.createElement('tr');
    tr.id = 'auto_scavenging_form';
    unitNames.forEach(unit => {
        const input = document.createElement('input');
        input.setAttribute('name', unit);
        input.setAttribute('type', 'text');
        input.setAttribute('value', '');
        input.setAttribute('maxlength', '5');
        input.setAttribute('max', '99999');
        input.id = `scavenge_unit_${unit}`;
        input.classList.add('unitsInput', 'input-nicer');

        const anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.classList.add('units-entry-all', 'squad-village-required');
        anchor.setAttribute('data-unit', unit);
        anchor.textContent = '(0)';

        const td = document.createElement('td');
        td.appendChild(input);
        td.appendChild(anchor);
        tr.appendChild(td);
    });

    // Create table data element for the "Start Auto Scavenge" button
    const buttonTd = document.createElement('td');
    buttonTd.classList.add('squad-village-required');
    const buttonAnchor = document.createElement('a');
    buttonAnchor.classList.add('btn', 'current-quest');
    buttonAnchor.setAttribute('href', '#');
    buttonAnchor.textContent = 'Start Auto Scavenge';
    buttonAnchor.onclick = function () {
        startAutoScavenging();
    }
    buttonTd.appendChild(buttonAnchor);
    tr.appendChild(buttonTd);

    // Create table data element for the "Total Value"
    const totalValueTd = document.createElement('td');
    totalValueTd.classList.add('carry-max');
    totalValueTd.textContent = '0';
    tr.appendChild(totalValueTd);

    // Append the created table row to the table
    const table = document.querySelector('.candidate-squad-widget tbody');
    table.appendChild(tr);
    */

    if(settings_cookies.general['show__auto_scavenging'].enabled) {
        startAutoScavenging();
    }
}

async function runAutoScavengingAll() {
    const userChoice = await showWarningPopup('Confirm Auto Scavenging', 'Do you wish to continue with the scavenging automation?');
    if (userChoice === 'cancel') {
        return;
    } else {
        var startButton = document.querySelectorAll('.free_send_button');
        var timeToAnother = document.querySelector('.return-countdown');
        //always goes to the last level available
        if (startButton && !timeToAnother) {
            document.querySelector('.fill-all').click();
            startButton = startButton[startButton.length - 1];
            
            startButton.style.color = 'red';
            startButton.click();
            console.log("AutoScavengingAll started at: " + new Date());
            wait(2).then(() => {
                timeToAnother = document.querySelector('.return-countdown');
                if (timeToAnother) {
                    var temp = document.querySelectorAll('.duration');
                    timeToAnother = document.querySelectorAll('.duration')[temp.length - 1];
                    var waitTime = timeToMilliseconds(timeToAnother.textContent) + 15000; //15 more sec
                    
                    if (waitTime > 0) {
                        setFunctionOnTimeOut('scavenging-auto', function () {
                            window.location.href = game_data.link_base_pure + 'place&mode=scavenge';
                        }, waitTime);
                    }
                    console.log("AutoScavengingAll next at " + new Date(Date.now() + waitTime))
                    history.back();
                }
            })
        } else if (startButton && timeToAnother) {
            var waitTime = timeToMilliseconds(timeToAnother.textContent) + 15000; //15 more sec
            
            if (waitTime > 0) {
                setFunctionOnTimeOut('scavenging-auto', function () {
                    window.location.href = game_data.link_base_pure + 'place&mode=scavenge';
                }, waitTime);
            }
        }
    }
}

function startAutoScavenging(all = true) {
    //only all for now
    if (all) {
        runAutoScavengingAll();
    } else {
        const form = document.querySelector('#auto_scavenging_form');
        const unitsInput = Array.from(form.querySelectorAll('input'));

        const unitsInputByName = {};
        unitsInput.forEach(input => {
            unitsInputByName[input.name] = input.value;

            var currentUnit = document.querySelectorAll('[name="' + input.name + '"]')[0];
            currentUnit.value = input.value.toString();

            var startButton = document.querySelectorAll('.free_send_button');
            startButton = startButton[startButton.length - 1];
            startButton.style.backgroudColor = 'red';
            //startButton.click();
        });
    }
}


//not in use
function stopAutoScavenging() {
    const form = document.querySelector('#auto_scavenging_form');
    const unitsInput = Array.from(form.querySelectorAll('input'));

    const unitsInputByName = {};
    unitsInput.forEach(input => {
        unitsInputByName[input.name] = input.value;
    });
}