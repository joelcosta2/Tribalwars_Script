function clone(e) {
    if (null == e || "object" != typeof e)
        return e;
    var i, n = new e.constructor;
    for (i in e)
        n[i] = clone(e[i]);
    return n
}
var TrainOverview = {
    train_link: "",
    cancel_link: "",
    pop_max: 0,
    snob_max: 0,
    snob_pending: 0,
    is_affordability_forecasting_initialized: !1,
    focused_input_id: null,
    single_village_mode: !1,
    res_schedule: {
        time_generated: 0,
        rates: null,
        amounts: null
    },
    init: function() {
        $("#train_form").submit(function(e) {
            e.preventDefault(),
            TrainOverview.submitOrder($("#train_form")[0])
        })
    },
    initMassOverview: function() {
        TrainOverview.recalcPop(),
        $("#mr_all_form .unit_input_field").change(function() {
            TrainOverview.recalcPop()
        }),
        TrainOverview.initSnob()
    },
    initSnob: function() {
        var e, i;
        TrainOverview.snob_max && (e = $('<a href="#">(' + TrainOverview.snob_max + ")</a>"),
        (i = $("#mr_all_form input[name=snob]").parent()).append(" ").append(e),
        e.on("click", function() {
            i.find("input").val(TrainOverview.snob_max)
        }))
    },
    initSingleVillageMode: function() {
        this.single_village_mode = !0,
        this.is_affordability_forecasting_initialized || ($(window.TribalWars).on("global_tick", function() {
            unit_build_block.dat.res.wood = game_data.village.wood,
            unit_build_block.dat.res.stone = game_data.village.stone,
            unit_build_block.dat.res.iron = game_data.village.iron,
            setTimeout(function() {
                unit_build_block._onchange(),
                unit_build_block.forecastAffordability()
            }, 1)
        }),
        Connection.registerObserver("train_overview", TrainOverview.Synchronizer),
        $(document).on("partial_reload_start", function() {
            unit_build_block.updateURLForFilledUnits(),
            TrainOverview.focused_input_id = $(":focus").attr("id")
        }),
        $(document).on("partial_reload_end", function() {
            var e = $("#" + TrainOverview.focused_input_id)[0];
            e && (e.focus(),
            e.setSelectionRange ? e.setSelectionRange(5, 5) : $(e).val(e.value))
        }),
        this.is_affordability_forecasting_initialized = !0)
    },
    init_res_schedule: function(e, i, n) {
        this.res_schedule.time_generated = e,
        this.res_schedule.rates = ResourcesForecaster.Factory.createResourcesSchedule(i),
        this.res_schedule.amounts = ResourcesForecaster.Factory.createResourcesInVillageSchedule(n)
    },
    recalcPop: function() {
        var n = 0
          , e = ($("#mr_all_form .unit_input_field").each(function() {
            var e = $(this)
              , i = parseInt(e.val(), 10);
            0 < i && (e = e.attr("name"),
            n += i * unit_managers.units[e].pop)
        }),
        $("#pop_cost"));
        24e3 < n ? e.addClass("red") : e.removeClass("red"),
        e.text(n)
    },
    submitOrder: function() {
        var n = {}
          , i = $("#train_form input[type='submit']");
        $.each($(".recruit_unit"), function() {
            var e = $(this)
              , i = parseInt(e.val(), 10);
            0 < e.val() && (e = e.attr("id").replace("_0", ""),
            n[e] = i)
        }),
        0 != n.length && (i.attr("disabled", "disabled"),
        TribalWars.post(TrainOverview.train_link, {}, {
            units: n
        }, function(e) {
            setTimeout(function() {
                i.removeAttr("disabled")
            }, 500),
            e.success && $(".recruit_unit").val(""),
            TrainOverview.updateAll(e),
            mobile && initMobileMove(),
            e.error ? UI.ErrorMessage(e.error) : e.msg && UI.SuccessMessage(e.msg),
            mobile && UI.SuccessMessage(_("24395b72bfc4ea554b7c2904abd57ec3"))
        }, function() {
            i.removeAttr("disabled")
        }))
    },
    cancelOrder: function(e) {
        return TribalWars.post(TrainOverview.cancel_link, {}, {
            id: e
        }, function(e) {
            e.error ? UI.ErrorMessage(e.error) : (TrainOverview.updateAll(e),
            $(".recruit_unit").val(""))
        }, "json"),
        !1
    },
    updateAll: function(e) {
        var i = $(".current_prod_wrapper");
        1 == i.length ? e.current_order ? i.replaceWith(e.current_order) : i.remove() : ($(".current_prod_wrapper").remove(),
        $("#train_form").before(e.current_order)),
        "undefined" != typeof unit_build_block && void 0 !== e.resources && (unit_build_block.dat.res = {
            wood: e.resources[0],
            stone: e.resources[1],
            iron: e.resources[2],
            pop: TrainOverview.pop_max - e.population
        },
        unit_build_block._onchange(),
        this.single_village_mode) && unit_build_block.forecastAffordability(),
        void 0 !== e.decommission && $.each(e.decommission, function(e, i) {
            unit_managers.units[e] = i;
            e = unit_build_block.get_a(e);
            e && (e.innerHTML = "(" + i + ")")
        }),
        startTimer()
    },
    getPendingCountOfUnit: function(e) {
        var i = 0;
        return $("#mass_train_table input[id^=" + e + "]").each(function() {
            $(this).val() && (i += parseInt($(this).val()))
        }),
        i
    },
    updateSnobPending: function() {
        TrainOverview.snob_pending = TrainOverview.getPendingCountOfUnit("snob")
    },
    Synchronizer: {
        notify: function(e, i) {
            this.handlers.hasOwnProperty(e) && this.handlers[e](i)
        },
        handlers: {
            res_schedule_invalid: function(e) {
                var i = game_data.village.id;
                e.village_id != i || e.time_invalidated < TrainOverview.res_schedule.time_generated || ResourcesForecaster.fetchSchedules(i, function(e) {
                    e.time_generated > TrainOverview.res_schedule.time_generated && (TrainOverview.res_schedule = e,
                    unit_build_block.forecastAffordability())
                })
            }
        }
    }
};
function UnitBuildManager(e, i) {
    this.decommission = !i,
    this.village_id = e,
    this.dat = i,
    this._progress = !1,
    this.cur_res = clone(i.res),
    this._onchange = function(e) {
        if (!this.decommission && !this._progress && !UnitBuildManager._disabled) {
            "snob" === e && TrainOverview.updateSnobPending(),
            this._progress = !0,
            this._calc_cur_res();
            var i, n, t, r = this.cur_res, a = r.wood < 0 || r.stone < 0 || r.iron < 0 || r.pop < 0;
            for (i in unit_managers.units)
                unit_managers.units.hasOwnProperty(i) && (n = this.unit_max(i),
                (t = this.get_a(i)) && (t.innerHTML = "(" + n + ")"),
                t = this.get_box(i)) && (a || "snob" === i && TrainOverview.snob_max < TrainOverview.snob_pending ? t.style.color = "red" : t.style.color = "black");
            if (this._progress = !1,
            TrainOverview.single_village_mode && this.previewCosts(),
            !TrainOverview.single_village_mode && "snob" === e)
                for (var s in unit_managers)
                    unit_managers[s].hasOwnProperty("_onchange") && unit_managers[s]._onchange()
        }
    }
    ,
    this.forecastAffordability = function() {
        var e, i, n, t, r, a = !1;
        for (e in unit_managers.units)
            unit_managers.units.hasOwnProperty(e) && unit_managers.units[e].requirements_met && (i = $(this.get_unit_interaction(e)),
            n = $(this.get_unit_afford_hint(e)),
            t = $(this.get_unit_blocked_hint(e)),
            r = unit_managers.units[e],
            r = new Resources(r.wood,r.stone,r.iron),
            r = ResourcesForecaster.getForecast(r, game_data.village, TrainOverview.res_schedule.rates, TrainOverview.res_schedule.amounts),
            0 !== t.length ? (i.hide(),
            n.hide()) : r.available === ResourcesForecast.AVAILABLE_NOW ? (i.show(),
            n.hide()) : (i.hide(),
            n.html(r.toHTML()).show(),
            a = !0));
        a && Timing.tickHandlers.timers.reset()
    }
    ,
    this.updateURLForFilledUnits = function() {
        var e, i, n, t = document.location.href;
        for (e in "#" === t.substr(-1) && (t = t.substr(0, t.length - 1)),
        unit_managers.units)
            unit_managers.units.hasOwnProperty(e) && unit_managers.units[e].requirements_met && (i = new RegExp(e + "=[0-9]{1,}"),
            n = Number(this.get_box(e).value),
            t.match(i) ? t = t.replace(i, e + "=" + n) : t += "&" + e + "=" + n);
        Modernizr.history && history.replaceState({}, "", t)
    }
    ,
    this.previewCosts = function() {
        for (var e in unit_managers.units) {
            var i;
            unit_managers.units.hasOwnProperty(e) && unit_managers.units[e].requirements_met && (i = (i = Number(this.get_box(e).value)) || 1,
            this.setUnitCostDisplay(e, i))
        }
    }
    ,
    this.setUnitCostDisplay = function(e, i) {
        for (var n = unit_managers.units[e], t = {
            wood: $("#" + e + "_" + this.village_id + "_cost_wood"),
            stone: $("#" + e + "_" + this.village_id + "_cost_stone"),
            iron: $("#" + e + "_" + this.village_id + "_cost_iron"),
            pop: $("#" + e + "_" + this.village_id + "_cost_pop"),
            time: $("#" + e + "_" + this.village_id + "_cost_time")
        }, r = (t.wood.html(i * n.wood),
        t.stone.html(i * n.stone),
        t.iron.html(i * n.iron),
        t.pop.html(i * n.pop),
        t.time.html(Format.timeSpan(1e3 * Math.ceil(i * n.build_time), !0)),
        ["wood", "stone", "iron"]), a = 0; a < r.length; a++) {
            var s = r[a];
            i * n[s] > game_data.village[s] ? t[s].addClass("warn") : t[s].removeClass("warn")
        }
        i * n.pop > game_data.village.pop_max - game_data.village.pop ? t.pop.addClass("warn") : t.pop.removeClass("warn")
    }
    ,
    this.unit_max = function(e) {
        if (this.decommission)
            return unit_managers.units[e];
        var i, n = 999999;
        for (i in this.cur_res)
            this.cur_res.hasOwnProperty(i) && (n = Math.min(n, Math.floor(this.cur_res[i] / unit_managers.units[e][i])));
        return n < 0 ? 0 : "snob" === e ? Math.min(n, Math.max(0, TrainOverview.snob_max - TrainOverview.snob_pending)) : n
    }
    ,
    this._input_value = function(e) {
        var i = parseInt(e.value, 10);
        return (i = isNaN(i) || i < 0 ? 0 : i) != parseInt(e.value, 10) && (e.value = 0 < i ? i : ""),
        i
    }
    ,
    this._calc_cur_res = function() {
        for (var e in this.cur_res = clone(this.dat.res),
        unit_managers.units)
            if (unit_managers.units.hasOwnProperty(e)) {
                var i = this.get_box(e);
                if (i && !i.disabled) {
                    var n, t = this._input_value(i);
                    for (n in this.cur_res)
                        this.cur_res.hasOwnProperty(n) && (this.cur_res[n] -= t * unit_managers.units[e][n])
                }
            }
    }
    ,
    this.set_max = function(e) {
        var i, n, t;
        UnitBuildManager._disabled || (i = this.get_box(e)) && (n = this.unit_max(e),
        t = this._input_value(i),
        this.decommission ? i.value = n : (i.value = 0 == n ? "" : n += t,
        this._onchange(e)))
    }
    ,
    this.get_box = function(e) {
        return document.getElementById(e + "_" + this.village_id)
    }
    ,
    this.get_a = function(e) {
        return document.getElementById(e + "_" + this.village_id + "_a")
    }
    ,
    this.get_unit_interaction = function(e) {
        return document.getElementById(e + "_" + this.village_id + "_interaction")
    }
    ,
    this.get_unit_afford_hint = function(e) {
        return document.getElementById(e + "_" + this.village_id + "_afford_hint")
    }
    ,
    this.get_unit_blocked_hint = function(e) {
        return document.getElementById(e + "_" + this.village_id + "_blocking_hint")
    }
    ;
    var n, t = this;
    for (n in unit_managers.units) {
        var r = this.get_box(n);
        r && (r.onchange = function() {
            t._onchange(this.id.split("_")[0])
        }
        ,
        r.onkeyup = function() {
            t._onchange(this.id.split("_")[0])
        }
        )
    }
}
function doMRFill(t, e) {
    var r = {}
      , a = 0
      , s = $("input[id^='unit_input_']");
    if (s.each(function(e) {
        var i = s[e].name
          , n = parseInt(s[e].value, 10);
        t && 0 < n ? (r[i] = 24e3 * n,
        a++) : isNaN(n) ? s[e].value = "0" : 0 < n && (r[i] = n,
        a++)
    }),
    a) {
        var i, n = {}, o = {
            wood: 0,
            stone: 0,
            iron: 0,
            pop: 0
        };
        for (i in o)
            o.hasOwnProperty(i) && (n[i] = $("input[name='buffer_" + i + "']").val());
        for (O in unit_managers)
            if ("units" != O) {
                var u = unit_managers[O]
                  , _ = clone(r)
                  , l = {
                    wood: 0,
                    stone: 0,
                    iron: 0,
                    pop: 0
                };
                for (f in _) {
                    var c, d, v = u.get_box(f);
                    if (v)
                        if (e && ((d = (p = $(v)).data("existing")) && (c = Math.max(0, _[f] - d),
                        _[f] = c),
                        d = p.data("running")) && (c = Math.max(0, _[f] - d),
                        _[f] = c),
                        !v.disabled) {
                            var h = unit_managers.units[f];
                            for (m in h)
                                h.hasOwnProperty(m) && (l[m] += h[m] * _[f])
                        }
                }
                var g, m, f, p, b, w = 999999;
                for (m in l)
                    g = Math.max(0, u.dat.res[m] - n[m]),
                    w = Math.min(w, g / l[m]);
                for (f in 1 < w && (w = 1),
                _)
                    (v = u.get_box(f)) && v.disabled && t && (_[f] = 0);
                for (f in unit_managers.units)
                    (p = u.get_box(f)) && !p.disabled && (_[f] ? (b = Math.floor(w * _[f]),
                    p.value = b) : p.value = "0");
                u._onchange()
            }
        if (null !== TrainOverview.snob_max)
            for (var O in TrainOverview.updateSnobPending(),
            unit_managers)
                "units" != O && unit_managers[O]._onchange()
    }
    return !1
}
function doMDFill(r) {
    var n = $("input[id^='unit_input_']")
      , a = {};
    n.each(function(e) {
        var i = n[e].name;
        a[i] = parseInt(n[e].value, 10)
    }),
    $(".unit_entry").not(":disabled").each(function() {
        var e, i = $(this), n = i.attr("id").split("_")[0], t = parseInt(i.data("max"));
        r ? 0 < (e = parseInt(i.data("existing")) - (i.data("running") ? parseInt(i.data("running")) : 0) - a[n]) ? i.val(e < t ? e : t) : i.val(0) : i.val(a[n] < t ? a[n] : t)
    })
}
function MDSetBuffer(e) {
    var i = $("#mr_all_form").serialize();
    $.ajax({
        type: "POST",
        url: e,
        data: i,
        success: function() {
            UI.SuccessMessage(_("16251e8d473e47680263de49c55f981b"))
        }
    })
}


//----------TRAIN QUEUE----------
function init_trainqueue(t, a) {
    var n = "#trainqueue_" + t
      , r = "building=" + t + "&";
    $(n).sortable({
        axis: "y",
        handle: ".bqhandle",
        stop: function(e, i) {
            i.item;
            $.ajax({
                dataType: "json",
                type: "get",
                url: a,
                data: r + $(n).sortable("serialize"),
                success: function(e) {
                    0 == e.code ? $(n).sortable("cancel") : ($("#replace_" + t).replaceWith(e.table),
                    init_trainqueue(t, a),
                    startTimer())
                }
            })
        }
    }),
    $(n).sortable("option", "items", ".sortable_row")
}
function init_mobiletrainqueue(i, t) {
    MDS.orderableQueue.init($("#replace_" + i), t + "&building=" + i + "&", function(e) {
        $("#replace_" + i).replaceWith(e.table),
        init_mobiletrainqueue(i, t),
        startTimer()
    })
}
