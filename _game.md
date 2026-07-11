Aqui está o que o jogo já expõe, por tópico:

---

## `game_data` — Dados em tempo real

### `.village`
| Propriedade | Descrição |
|---|---|
| `id`, `name`, `x`, `y` | ID, nome, coordenadas |
| `wood`, `stone`, `iron` | Recursos actuais (integer) |
| `wood_float`, `stone_float`, `iron_float` | Recursos em ponto flutuante (precisos) |
| `wood_prod`, `stone_prod`, `iron_prod` | Taxa de produção |
| `storage_max` | Capacidade do armazém |
| `pop`, `pop_max` | Pop actual / máximo |
| `is_farm_upgradable` | Farm pode ser upgradada |
| `updateRes()` | Método — recalcula floats via taxa e tempo |

### `.player`
| Propriedade | Descrição |
|---|---|
| `id`, `name` | ID, nome |
| `rank`, `rank_formatted`, `points`, `points_formatted` | Rank e pontos |
| `pp` | Premium points |
| `ally` | ID da tribo (0 = sem tribo) |
| `sitter` | 0 = não é sitter |
| `incomings`, `supports` | Ataques a entrar / apoios a sair |
| `new_igm`, `new_report`, `new_forum_post` | Contadores de notificações |
| `new_ally_invite`, `new_ally_application` | Convites/aplicações à tribo |
| `new_buddy_request`, `new_daily_bonus`, `new_items` | Outros contadores |
| `confirmation_skipping_hash` | Hash para skip de confirmação (premium) |

### Outros
- `game_data.screen` — nome do ecrã actual (`'main'`, `'overview'`, `'place'`, …)
- `game_data.world` — identificador do mundo
- `game_data.market` — locale (`'pt'`, `'us'`, `'br'`, …) — útil para formatar datas US vs EU
- `game_data.device` — `'desktop'`/`'mobile'`/`'ios'`/`'android'`/`'steam'`/`'app'`
- `game_data.admin`, `game_data.pregame`, `game_data.two_factor`
- `game_data.quest.use_questlines`

---

## `TribalWars` — Navegação e AJAX

```js
TribalWars.get(screen, params, successCb, errorCb, silent)
TribalWars.post(screen, urlParams, bodyData, successCb, errorCb, silent)  // CSRF automático
TribalWars.redirect(screen, params)
TribalWars.buildURL(method, screen, params)  // → string URL
TribalWars.fetch(url, silent, cb)            // raw JSON GET
```
- `handleResponse(resp, ok, err)` — processa `error`/`response`/`content`/`game_data`/`bot_protect` automaticamente
- `getSetting(key)` / `setSetting(key, value, cb)` — preferências de utilizador persistidas no servidor
- `isAnyTabActive()`, `getIdleTime()`, `shouldPartialLoad()`
- `updateGameData(data)` / `mergeGameDataProperty(...)` — merge seguro de game_data

---

## `Timing` — Tempo do servidor e timers

```js
Timing.getCurrentServerTime()   // ms, sincronizado com servidor
Timing.getEstimatedLatency()    // ms de latência
Timing.resetTickHandlers()      // reinicia todos os handlers (chama-se após game_data update)
```

**`window.server_utc_diff`** — offset UTC do servidor em **segundos**

### `Timing.tickHandlers` — handlers que correm a cada segundo

| Handler | O que faz |
|---|---|
| `serverTime` | Atualiza `#serverTime` e `#serverDate` |
| `resources` | Atualiza `wood/stone/iron` no DOM via `game_data.village.updateRes()` |
| `timers` | Gere todos os `<span class="timer">` countdown + dispara callbacks |
| `forwardTimers` | Timers crescentes |

```js
// Registar timer num elemento com callback no fim
Timing.tickHandlers.timers.initTimer(el, endEpochSec, callback, nowEpochSec)

// Registar classe de timers para ser re-init em cada resetTickHandlers
Timing.tickHandlers.timers.registerPreInit(className, endCallback)

// Scan + init de todos os <span.className> existentes
Timing.tickHandlers.timers.initTimers(className, endCallback)

// Bloquear page reload durante operações
Timing.tickHandlers.timers.lockPartialReloading()
Timing.tickHandlers.timers.unlockPartialReloading()
```

---

## `Format` — Formatação

| Função | Descrição |
|---|---|
| `Format.date(epochSec, showSec, showDate, showMs, relative)` | `"hoje às 14:32:01"` / `"amanhã às ..."` / data completa; respeita `server_utc_diff` e locale US vs EU |
| `Format.number(n)` | `1.234.567` com `.` em cinzento |
| `Format.shorten_number(n)` | `12K`, `1M` |
| `Format.timeSpan(ms, showDays)` | Duração `H:MM:SS` ou `D:HH:MM:SS` |
| `Format.image_src(path)` | CDN URL: `image_base + path` |
| `Format.image_tag(imgObj, title, classes)` | `<img>` com suporte retina |
| `Format.imageTexture(sprite, w, h, classes)` | Sprite CSS `<span>` |
| `Format.playerAnchor(id, name, avatarId?)` | Link clicável para perfil do jogador |
| `Format.userImageThumb(id)` | `<img>` tiny avatar |
| `Format.lifeColor(ratio)` | `rgb(r,g,b)` — 0→vermelho, 1→verde |
| `Format.resChange(oldRes, newRes)` | `<strike>old</strike> new` para os 3 recursos |
| `Format.get_warn_pop_class(pop, popMax, upgradable)` | `'warn'` / `'warn_90'` / `''` |
| `Format.overdueAnchor()` | Link "overdue" com ajuda |
| `Format.ppCostTooltip(cost)` | HTML de custo em PP |
| `Format.toPercent(val, decimals)` | `"34.5%"` |

---

## `UI` — Interface

### Mensagens
```js
UI.SuccessMessage(html, duration?, container?, opts?)  // verde, auto-esconde
UI.ErrorMessage(html, duration?, container?, opts?)    // vermelho
UI.InfoMessage(html, duration?, type, container?, opts?)
UI.ConfirmationBox(message, callback, id?, skipCheckbox?, isHtml?)
```

### Notificações (toast lateral, só desktop)
```js
UI.Notification.show(imgUrl, title, body, onClick)
```

### Widgets
```js
UI.Image(src, attrs)         // jQuery <img>
UI.ToolTip(selector, opts?)  // tooltip jQuery nos [title]
UI.Dropdown(selector)        // styled <select>
UI.Draggable(el, opts?)      // drag com posição persistida em cookie
UI.Sortable(el, opts?)
UI.initProgressBar(el)
UI.updateProgressBar(el, current, max)
```

---

## `Dialog` — Diálogos in-game

```js
Dialog.show(name, htmlOrCallback, callback?, opts?)  // diálogo com HTML
Dialog.fetch(name, screen, params?, callback?)        // conteúdo do servidor
Dialog.close(force?)
```

---

## `Connection` — WebSocket / Push

```js
Connection.registerHandler(event, callback)  // receber evento do servidor
Connection.emit(event, data)                 // enviar
Connection.isConnected()
Connection.is_websocket                      // boolean
```

### Eventos built-in do servidor
| Evento | Trigger |
|---|---|
| `'building_complete'` | Edifício terminou |
| `'attack'` | Ataque incoming |
| `'message'` | Novo IGM |
| `'report'` | Novo relatório |
| `'award'` / `'award_progress'` | Conquistas |
| `'village_gained'` | Aldeia conquistada |
| `'quest_data'` | Update de quest |
| `'premium_purchase'` / `'package_purchase'` | Compra premium |
| `'command_count'` | Update de comandos |
| `'knight_discover'` | Paladin encontrado |
| `'forum_post'` / `'tribe_forum_notification'` | Fórum |
| `'res_schedule_invalid'` | Invalidar schedule de recursos |
| `chat/*` | Mensagens de chat em tempo real |

---

## `ResourcesForecast` / `ResourcesForecaster` — Previsão de recursos

```js
// Quando chegam os recursos necessários?
ResourcesForecaster.getForecast(neededRes, villageData, ratesSchedule, amountsSchedule)
// → ResourcesForecast com .available = 'now'|'future'|'never' e .when (epochSec)

ResourcesForecast.toHTML(nowLabel, compact)  // "agora" / "em 01:23:45" / "hoje às 14:00"

// Buscar schedules de produção do servidor (assíncrono)
ResourcesForecaster.fetchSchedules(villageId, callback)
```

---

## Funções globais

| Função | Descrição |
|---|---|
| `getTimeString(sec, trimHours?, padHours?)` | `"1:23:45"` ou `"01:23:45"` |
| `getLocalTimeAsFloat()` | `Date.now() / 1000` |
| `partialReload(silent?, cb?)` | Reload parcial da página via AJAX |
| `s(template, ...args)` | sprintf: `s("Olá %1, tens %2 recursos", nome, n)` |
| `escapeHtml(str, forAttr?)` / `unescapeHtml(str)` | XSS-safe |
| `changeResStyle(jqEl, className)` | Toggle `'res'`/`'warn'`/`'warn_90'` |
| `number_format(n, separator)` | Número formatado com separador |
| `formatTime(el, seconds, clamp?)` | Escreve tempo formatado num elemento |

---

## Variáveis globais úteis

| Variável | Descrição |
|---|---|
| `window.premium` | Player tem premium |
| `window.mobile` | UI mobile |
| `window.image_base` | URL base de imagens CDN |
| `window.server_utc_diff` | Offset UTC servidor (segundos) |
| `window.csrf_token` | Token CSRF para POSTs manuais |

---

## `VillageContext` — Menu de contexto em links de aldeias

```js
VillageContext.init(container?)       // activar contexto para .village_anchor
VillageContext.enableContext(anchor)  // activar para anchor específico
VillageContext.hide()
// Flags: .igm_enabled, .send_troops_enabled, .claim_enabled
```

---

## O que podes usar nos teus scripts

As coisas mais relevantes que **ainda não estás a usar** e que seriam úteis:

1. **`Connection.registerHandler('building_complete', cb)`** — trigger real-time quando um edifício acaba, sem polling
2. **`Timing.tickHandlers.timers.initTimer/registerPreInit`** — integrar os teus countdowns no sistema nativo de ticks
3. **`ResourcesForecaster`** — saber exactamente quando chegam os recursos para um build, sem cálculo manual
4. **`Format.date()`** — já trata timezone e locale (US vs EU), substitui o `twWallClockToEpochMs` manual
5. **`Timing.getCurrentServerTime()`** — substitui o cálculo manual de `serverTimezoneOffsetMs`
6. **`TribalWars.getSetting/setSetting`** — guardar preferências no servidor (persistem entre dispositivos)
7. **`UI.Notification.show()`** — toast nativo em vez do teu `showAutoHideBox` customizado

Created 1 todo