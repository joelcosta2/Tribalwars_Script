var BuildingMain = {
    BUILD_ERROR_REQ: 1,
    BUILD_ERROR_POP: 2,
    BUILD_ERROR_QUEUE: 3,
    BUILD_ERROR_RES: 4,
    BUILD_ERROR_QUEUE_RES: 5,
    upgrade_building_link: "",
    downgrade_building_link: "",
    link_reduce_buildtime: "",
    link_cancel: "",
    confirm_queue: !1,
    mode: 0,
    request_id: 0,
    last_request_id: 0,
    pending: !1,
    buildings: null,
    order_count: 0,
    is_buildability_initialized: !1,
    web_push: null,
    res_schedule: {
        time_generated: 0,
        rates: null,
        amounts: null
    },
    init: function() {
        require(["Ig/TribalWars/Modules/UI/WebPushWorld"], function(i) {
            BuildingMain.web_push = new i
        }),
        BuildingMain.init_buildbuttons(),
        this.is_buildability_initialized || ($(window.TribalWars).on("global_tick", function() {
            setTimeout(BuildingMain.updateBuildableState, 1)
        }),
        Connection.registerObserver("building_main", BuildingMain.Synchronizer),
        this.is_buildability_initialized = !0),
        OrderProgress.initProgress(),
        BuildFeatureAvailability.init(),
        Connection.enqueueHandler("quest_data", function(i) {
            for (var e in i) {
                var n = i[e]
                  , e = n.goals.buildings;
                e && e.forEach(function(i) {
                    var e = $(s('[data-building="%1"][data-level-next]', i.building));
                    e.data("level-next") <= i.level && (e.addClass("current-quest").addClass("tooltip"),
                    i = [i = e.prop("title"), n.title].filter(function(i) {
                        return i
                    }).join("<br /><br />"),
                    e.prop("title", i),
                    UI.ToolTip(e))
                })
            }
        })
    },
    init_res_schedule: function(i, e, n) {
        this.res_schedule.time_generated = i,
        this.res_schedule.rates = ResourcesForecaster.Factory.createResourcesSchedule(e),
        this.res_schedule.amounts = ResourcesForecaster.Factory.createResourcesInVillageSchedule(n)
    },
    updateBuildableState: function() {
        var d, t;
        BuildingMain.buildings && (d = 0 == $("#buildqueue_wrap").length ? 0 : BuildingMain.order_count,
        BuildingMain.colorAffordability(),
        t = new Resources(game_data.village.wood,game_data.village.stone,game_data.village.iron),
        $.each(BuildingMain.buildings, function(i, e) {
            var n, a, u, l, i = $("#main_buildrow_" + i).find(".build_options");
            parseInt(i.data.error),
            i.data("could-afford");
            i && (u = new Resources(e.wood,e.stone,e.iron),
            u = ResourcesForecaster.getForecast(u, game_data.village, BuildingMain.res_schedule.rates, BuildingMain.res_schedule.amounts),
            !e.can_build && e.level ? (a = BuildingMain.BUILD_ERROR_REQ,
            n = e.error) : 1 < d && !premium ? n = u.available === ResourcesForecast.AVAILABLE_NOW ? (a = BuildingMain.BUILD_ERROR_QUEUE,
            _("e3191f3416af6c3c40af58132aceb0c8")) : (a = BuildingMain.BUILD_ERROR_RES,
            u.toHTML()) : e.pop && e.pop > parseInt(game_data.village.pop_max) - parseInt(game_data.village.pop) ? (a = BuildingMain.BUILD_ERROR_POP,
            n = e.error) : u.available !== ResourcesForecast.AVAILABLE_NOW && (a = BuildingMain.BUILD_ERROR_RES,
            n = u.toHTML()),
            a == BuildingMain.BUILD_ERROR_RES && e.hasOwnProperty("wood_cheap") && (u = t.hasEnough(new Resources(e.wood_cheap,e.stone_cheap,e.iron_cheap)),
            l = i.find(".btn-bcr"),
            u && l.hasClass("btn-bcr-disabled") ? l.removeClass("btn-bcr-disabled") : u || l.hasClass("btn-bcr-disabled") || l.addClass("btn-bcr-disabled")),
            void 0 === n && e.hasOwnProperty("wood_queue_factor") && !t.hasEnough(new Resources(e.wood_queue_factor,e.stone_queue_factor,e.iron_queue_factor)) && (a = BuildingMain.BUILD_ERROR_QUEUE_RES,
            n = _("f43d707f8c0760ac530ca8441b9bbc17")),
            u = i.find(".btn-build"),
            l = i.find(".inactive"),
            void 0 !== n ? (u.hide(),
            l.show(),
            l.html() != n && l.html(n)) : (u.show(),
            l.hide()))
        }))
    },
    init_buildbuttons: function() {
        $("#building_wrapper").on("click", ".btn-build", function() {
            var i = $(this);
            return BuildingMain.build(i.data("building")),
            !1
        }),
        $("#building_wrapper").on("click", ".btn-bcr", function() {
            var i = $(this);
            return i.hasClass("btn-bcr-disabled") || BuildingMain.build_reduced(i.data("cost"), i.data("building")),
            !1
        })
    },
    init_buildqueue: function(n) {
        $("#buildqueue").sortable({
            axis: "y",
            handle: ".bqhandle",
            helper: function(i, e) {
                var n = e.children()
                  , e = e.clone();
                return e.children().each(function(i) {
                    $(this).width(n.eq(i).width())
                }),
                e
            },
            stop: function(i, e) {
                TribalWars.post(n, {}, $("#buildqueue").sortable("serialize"), function(i) {
                    BuildingMain.init_buildqueue(n),
                    BuildingMain.update_all(i)
                }, function() {
                    $("#buildqueue").sortable("cancel")
                })
            }
        }),
        $("#buildqueue").sortable("option", "items", ".sortable_row")
    },
    init_mobilebuildqueue: function(i) {
        MDS.orderableQueue.init($("#buildqueue_wrap").find("div").first(), i, function(i) {
            BuildingMain.update_all(i)
        })
    },
    build: function(a, u) {
        function i() {
            var e, i, n;
            BuildingMain.pending || (BuildingMain.pending = !0,
            e = ++BuildingMain.request_id,
            i = {
                id: a,
                force: 1,
                destroy: BuildingMain.mode,
                source: game_data.village.id
            },
            void 0 !== u && (i.cheap = 1),
            n = 0 == BuildingMain.mode ? BuildingMain.upgrade_building_link : BuildingMain.downgrade_building_link,
            TribalWars.post(n, {}, i, function(i) {
                BuildingMain.pending = !1,
                BuildingMain.last_request_id < e && (BuildingMain.last_request_id = e,
                BuildingMain.update_all(i),
                $(".popup_box").length || UI.SuccessMessage(_("2ccbefa6927a551c8b66f24b121323c6")))
            }, function() {
                BuildingMain.pending = !1
            }),
            "main" === a && 3 <= parseInt(game_data.village.buildings.main) && BuildingMain.web_push.showPrompt())
        }
        var e, n;
        return BuildingMain.confirm_queue && 0 == this.mode ? (e = _("8beeb963ec4430bddbbe90d2e6a930d8"),
        n = [{
            text: _("70d9be9b139893aa6c69b5e77e614311"),
            callback: i,
            confirm: !0
        }],
        UI.ConfirmationBox(e, n)) : i(),
        !1
    },
    destroy: function(i) {
        return BuildingMain.build(i)
    },
    build_reduced: function(i, e) {
        return Premium.check("BuildCostReduction", i, function() {
            return BuildingMain.build(e, 1)
        }),
        !1
    },
    cancel: function(i, e) {
        var e = e ? _("b30823e6b7339b73d0156dfa031cc060") + " " + _("4666fb30d85dc5cbc47135e12bfd746a") : _("b30823e6b7339b73d0156dfa031cc060")
          , n = [{
            text: _("70d9be9b139893aa6c69b5e77e614311"),
            callback: function() {
                TribalWars.post(BuildingMain.link_cancel, null, {
                    id: i,
                    destroy: BuildingMain.mode
                }, function(i) {
                    BuildingMain.update_all(i)
                })
            },
            confirm: !0
        }];
        return UI.ConfirmationBox(e, n),
        !1
    },
    change_order: function(i, e, n) {
        function a() {
            TribalWars.get(BuildingMain.link_change_order, {
                id: i,
                destroy: BuildingMain.mode
            }, function(i) {
                BuildingMain.update_all(i)
            })
        }
        return n ? Premium.check(e, n, a) : a(),
        !1
    },
    update_all: function(i) {
        var e = $("#buildqueue_wrap");
        1 === e.length ? i.building_orders ? e.replaceWith(i.building_orders) : e.remove() : $("#building_wrapper").before(i.building_orders),
        i.next_buildings && ($("#building_wrapper").replaceWith(i.next_buildings),
        $(".inactive img").fadeTo(0, .5),
        BuildingMain.init_buildbuttons()),
        void 0 !== i.confirm_queue && (BuildingMain.confirm_queue = i.confirm_queue),
        void 0 !== i.population && ((e = $("#pop_current_label")).html(i.population),
        changeResStyle(e, Format.get_warn_pop_class(i.population, game_data.village.pop_max, game_data.village.is_farm_upgradable))),
        "undefined" != typeof QuestArrows && QuestArrows.init(),
        OrderProgress.initProgress(),
        Premium.directBuy.init()
    },
    colorAffordability: function() {
        ["wood", "stone", "iron"].forEach(function(i) {
            $(".cost_" + i).each(function() {
                ($this = $(this)).data("cost") > game_data.village[i] ? $this.addClass("warn") : $this.removeClass("warn")
            })
        })
    },
    Synchronizer: {
        notify: function(i, e) {
            this.handlers.hasOwnProperty(i) && this.handlers[i](e)
        },
        handlers: {
            res_schedule_invalid: function(i) {
                var e = game_data.village.id;
                i.village_id != e || i.time_invalidated < BuildingMain.res_schedule.time_generated || ResourcesForecaster.fetchSchedules(e, function(i) {
                    i.time_generated > BuildingMain.res_schedule.time_generated && (BuildingMain.res_schedule = i,
                    BuildingMain.updateBuildableState())
                })
            }
        }
    }
};
