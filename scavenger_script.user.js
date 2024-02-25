

function injectAutoScavenger() {
    const unitNames = ['spear', 'sword', 'axe', 'archer', 'light', 'marcher', 'heavy', 'knight'];

    const tr = document.createElement('tr');
    tr.id = 'auto_scavenger_form';
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
        startAutoScavenger();
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
}

function startAutoScavenger(all = true) {
    if (all) {
        document.querySelector('.fill-all').click();
        var startButton = document.querySelectorAll('.free_send_button');
        startButton = startButton[startButton.length - 1];

        var timeToAnother = document.querySelector('.return-countdown');
        if (!timeToAnother) {
            var temp = document.querySelectorAll('.duration');
            timeToAnother = document.querySelectorAll('.duration')[temp.length - 1];
        }
        console.log(timeToAnother.textContent);
        setFunctionOnTimeOut('scavenger-auto', functionToCallTest, timeToMilliseconds(timeToAnother.textContent) + timeToMilliseconds('0:00:20'));
        startButton.style.color = 'red';
        startButton.click();

    } else {
        const form = document.querySelector('#auto_scavenger_form');
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

function stopAutoScavenger() {
    const form = document.querySelector('#auto_scavenger_form');
    const unitsInput = Array.from(form.querySelectorAll('input'));

    const unitsInputByName = {};
    unitsInput.forEach(input => {
        unitsInputByName[input.name] = input.value;
    });
}