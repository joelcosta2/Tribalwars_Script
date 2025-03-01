function calculateMaxTroops(changedUnit = null) {
    // 1. Cria um snapshot dos valores atuais para todas as unidades.
    const currentQueued = {};
    game_data.units.forEach(unit => {
      const input = document.getElementById(unit + "_input");
      // Use Number() para garantir a conversão; se vazio, fica 0.
      currentQueued[unit] = input ? Number(input.value) || 0 : 0;
    });
  
    // 2. Captura os recursos totais disponíveis (convertendo para número)
    const totalResources = {
      wood: Number(document.getElementById("wood").textContent.replace('.', '')) || 0,
      stone: Number(document.getElementById("stone").textContent.replace('.', '')) || 0,
      iron: Number(document.getElementById("iron").textContent.replace('.', '')) || 0
    };
  
    // 3. Obtém os custos das unidades do localStorage
    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
  
    // 4. Para cada unidade, calcula o adicional máximo possível
    game_data.units.forEach(unit => {
      const input = document.getElementById(unit + "_input");
      if (!input || !unitData[unit]) return;
      const costs = unitData[unit];
      const queued = currentQueued[unit]; // valor atual da unidade
      let additional = Infinity; // começamos com um valor alto
  
      // Para cada recurso usado pela unidade:
      Object.keys(costs).forEach(resource => {
        if (!(resource in totalResources)) return; // ignora se o recurso não está disponível
  
        const cost = costs[resource];
        
        // Soma o consumo desse recurso feito por todas as outras unidades
        let consumptionOthers = 0;
        game_data.units.forEach(otherUnit => {
          if (otherUnit === unit) return; // ignora a unidade atual
          if (!unitData[otherUnit]) return;
          const otherCosts = unitData[otherUnit];
          if (!(resource in otherCosts)) return;
          consumptionOthers += currentQueued[otherUnit] * otherCosts[resource];
        });
  
        // Recurso disponível para a unidade _i_ (excluindo seu próprio consumo)
        const available = totalResources[resource] - consumptionOthers;
  
        // Quantas unidades adicionais podem ser treinadas para esse recurso?
        // Se available for negativo, o resultado será negativo – aí consideramos 0.
        const possible = available >= 0 ? Math.floor(available / cost) : 0;
  
        additional = Math.min(additional, possible);
      });
  
      // Se o cálculo resultar em valor não finito ou negativo, usamos 0
      if (!isFinite(additional) || additional < 0) {
        additional = 0;
      }
  
      // 5. O novo "max" para a unidade é a soma do valor atual com o adicional permitido
      const isCurrentUnit = changedUnit || changedUnit === unit;
      let newMax = isCurrentUnit ? additional - queued : queued + additional;
      input.max = isCurrentUnit ? additional + newMax : newMax;
  
      // 6. Atualiza ou cria o elemento que exibe o valor adicional (ao lado do input)
      const maxElementId = unit + "_max";
      let maxElement = document.getElementById(maxElementId);
      if (!maxElement) {
        maxElement = document.createElement("a");
        maxElement.id = maxElementId;
        maxElement.style.marginLeft = "5px";
        input.parentNode.appendChild(maxElement);
      }
      maxElement.textContent = `(${newMax})`;
    });
}

async function submitTroops() {
    let bodyData = new URLSearchParams();

    game_data.units.forEach(unit => {
        const input = document.getElementById(unit + "_input");
        if (input && input.value > 0) {
            bodyData.append(`units[${unit}]`, input.value);
        }
    });

    if (!bodyData.toString()) return; // Se não houver tropas, não faz a requisição

    bodyData.append("h", game_data.csrf);

    await fetch(`${game_data.link_base_pure}barracks&ajaxaction=train&mode=train`, {
        headers: {
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
            "sec-ch-ua-platform": "\"Windows\"",
            "tribalwars-ajax": "1",
            "x-requested-with": "XMLHttpRequest",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        referrer: `${game_data.link_base_pure}barracks`,
        body: bodyData.toString(),
        method: "POST",
        credentials: "include"
    });

    fetchTrainInfo();
    injectRecruitTroopsWidget();
}


function injectRecruitTroopsWidget() {
    const currentWidget = document.querySelector('#widget_recruit');
    if(currentWidget)  currentWidget.remove();
    // Obter os dados das tropas do localStorage
    const unitData = JSON.parse(localStorage.getItem('unit_managers_costs')) || {};
    const columnToUse = settings_cookies.widgets.find(widget => widget.name === 'recruit_troops').column;

    // Criar a tabela
    const table = document.createElement('table');
    table.id = 'widget_recruit'
    table.className = 'vis';
    table.style.width = '100%';

    const tbody = document.createElement('tbody');

    // Criar uma linha para cada tropa
    for (const unit in unitData) {
        const row = document.createElement('tr');
        row.style.display = '-webkit-box';

        // Coluna com ícone e nome da tropa
        const unitCell = document.createElement('td');
        unitCell.style.textAlign = 'center';
        unitCell.style.display = 'flex';
        unitCell.style.alignItems = 'center';
        unitCell.style.justifyContent = 'left';
        unitCell.style.gap = '5px'; // Espaço entre ícone e texto
        unitCell.style.webkitBoxFlex = 1;

        const unitLink = document.createElement('a');
        unitLink.href = '#';
        unitLink.classList.add('unit_link');
        unitLink.dataset.unit = unit;

        const unitImg = document.createElement('img');
        unitImg.src = `https://dsen.innogamescdn.com/asset/243a567d/graphic/unit/unit_${unit}.png`;
        unitImg.alt = unit;
        unitImg.title = unit.charAt(0).toUpperCase() + unit.slice(1); // Capitaliza a primeira letra

        const unitName = document.createElement('span');
        unitName.textContent = unit.charAt(0).toUpperCase() + unit.slice(1); // Nome da unidade

        unitLink.appendChild(unitImg);
        unitCell.appendChild(unitLink);
        unitCell.appendChild(unitName);
        row.appendChild(unitCell);

        // Coluna com input
        const inputCell = document.createElement('td');
        inputCell.style.textAlign = 'center';
        inputCell.style.webkitBoxFlex = 1;

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        input.className = `train-input train-${unit}`;
        input.id = `${unit}_input`;
        input.dataset.unit = unit;
        input.addEventListener('change', function() {
            calculateMaxTroops(unit);
        })

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
    trainButton.addEventListener('click', submitTroops);

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
    calculateMaxTroops();

    //listeners to update on ressources update
    document.querySelectorAll("#wood, #iron, #stone").forEach(element => {
      calculateMaxTroops();
  });
}