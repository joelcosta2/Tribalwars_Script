function calculateMaxTroops() {
    let remainingResources = {
        wood: parseInt(document.getElementById("wood").textContent.replace('.', ''), 10) || 0,
        stone: parseInt(document.getElementById("stone").textContent.replace('.', ''), 10) || 0,
        iron: parseInt(document.getElementById("iron").textContent.replace('.', ''), 10) || 0
    };

    let maxTroops = {};
    for (let unitType in game_data.units) {
        if (game_data.units.hasOwnProperty(unitType)) {
            let unitCosts = game_data.units[unitType]; 
            let inputElement = document.getElementById(unitType + "_input"); 
            let alreadyQueued = inputElement ? parseInt(inputElement.value, 10) || 0 : 0;
            let maxTrainable = Infinity;

            for (let resource in unitCosts) {
                if (unitCosts.hasOwnProperty(resource) && remainingResources.hasOwnProperty(resource)) {
                    remainingResources[resource] -= alreadyQueued * unitCosts[resource];
                    let maxByResource = Math.floor(remainingResources[resource] / unitCosts[resource]); 
                    maxTrainable = Math.min(maxTrainable, maxByResource);
                }
            }
            maxTroops[unitType] = Math.max(0, maxTrainable);
        }
    }
    return maxTroops;
}

function submitTroops() {
    fetch(`${game_data.link_base_pure}barracks&ajaxaction=train&mode=train`, {
        "headers": {
          "priority": "u=1, i",
          "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
          "sec-ch-ua-platform": "\"Windows\"",
          "tribalwars-ajax": "1",
          "x-requested-with": "XMLHttpRequest",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        "referrer": `${game_data.link_base_pure}barracks`,
        "body": `units[spear]=10&h=${game_data.csrf}`,
        "method": "POST",
        "credentials": "include"
      });
}


function injectRecruitTroopsWidget() {
    // Obter os dados das tropas do localStorage
    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
    const columnToUse = settings_cookies.widgets.find(widget => widget.name === 'recruit_troops').column;

    // Criar a tabela
    const table = document.createElement('table');
    table.className = 'vis';
    table.style.width = '100%';

    const tbody = document.createElement('tbody');

    // Criar uma linha para cada tropa
    for (const unit in unitData) {
        const row = document.createElement('tr');

        // Coluna com ícone e nome da tropa
        const unitCell = document.createElement('td');
        unitCell.style.textAlign = 'center';
        unitCell.style.display = 'flex';
        unitCell.style.alignItems = 'center';
        unitCell.style.justifyContent = 'left';
        unitCell.style.gap = '5px'; // Espaço entre ícone e texto

        const unitLink = document.createElement('a');
        unitLink.href = '#';
        unitLink.classList.add('unit_link');
        unitLink.dataset.unit = unit;

        const unitImg = document.createElement('img');
        unitImg.src = `https://dsen.innogamescdn.com/asset/243a567d/graphic/unit/unit_${unit}.png`;
        unitImg.alt = unit;
        unitImg.title = unit.charAt(0).toUpperCase() + unit.slice(1); // Capitaliza a primeira letra
        unitImg.style.width = '20px'; // Ajusta o tamanho da imagem

        const unitName = document.createElement('span');
        unitName.textContent = unit.charAt(0).toUpperCase() + unit.slice(1); // Nome da unidade

        unitLink.appendChild(unitImg);
        unitCell.appendChild(unitLink);
        unitCell.appendChild(unitName);
        row.appendChild(unitCell);

        // Coluna com input
        const inputCell = document.createElement('td');
        inputCell.style.textAlign = 'center';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.className = `train-input train-${unit}`;
        input.dataset.unit = unit;
        input.style.width = '60px';

        inputCell.appendChild(input);
        row.appendChild(inputCell);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Criar um botão de treinamento
    const trainButton = document.createElement('button');
    const langRecruit = JSON.parse(localStorage.getItem('tw_lang'));
    trainButton.textContent = (langRecruit && langRecruit['e1de43dd18d19451febfc1584ab33767'])??'Recruit2';
    trainButton.className = 'btn btn-default';
    // trainButton.addEventListener('click', recruitTroops);

    // Criar um contêiner para envolver a tabela e o botão
    const container = document.createElement('div');
    container.appendChild(table);
    container.appendChild(trainButton);

    // Adicionar ao widget
    createWidgetElement({
        title: 'Recruit',
        contents: container,
        columnToUse,
        update: '',
        extra_name: 'troops',
        description: 'Train your troops'
    });

}