VillageOverview = {
    urls: {},
    unit_groups: [],
    unit_group_selected: 0,
    show_notes: !1,
    units: [],
    last_troop_refresh: 0,
    init: function () {
        $(window.TribalWars).off("command_timer_expire.vo").on("command_timer_expire.vo", function () {
            Timing.getCurrentServerTime() - VillageOverview.last_troop_refresh > 1e3 && (VillageOverview.last_troop_refresh = Timing.getCurrentServerTime(),
                VillageOverview.reloadWidget("units"))
        }),
            $(window.TribalWars).off("command_timer_empty.vo").on("command_timer_empty.vo", function () {
                VillageOverview.reloadWidget("units")
            }),
            this.show_notes && this.initNotes(),
            mobile ? VillageOverview.changeMobileGroup(VillageOverview.unit_group_selected) : VillageOverview.changeGroup(0),
            VillageOverview.registerUnitWidgetEvents(),
            mobile || ($("#overviewtable").sortable({
                placeholder: "vis placeholder",
                cursor: "move",
                items: "div.moveable",
                handle: "h4",
                opacity: .6,
                start: function () {
                    $(".hidden_widget").fadeTo(0, .5)
                },
                stop: function () {
                    $(".hidden_widget").hide()
                },
                update: function () {
                    var e = {
                        leftcolumn: [],
                        rightcolumn: []
                    }
                        , t = $(this).sortable("toArray");
                    for (var i in t) {
                        if (t.hasOwnProperty(i))
                            e[document.getElementById(t[i]).parentNode.id].push(t[i])
                    }
                    $.post(VillageOverview.urls.reorder, e)
                }
            }),
                BuildFeatureAvailability.init(),
                UI.ToolTip($(".effect_tooltip")))
    },
    toggleWidget: function (e, t) {
        var i = $("#" + e + " > div");
        return i.toggle(),
            t.src = i.is(":hidden") ? "graphic/plus.png" : "graphic/minus.png",
            $.post(VillageOverview.urls.toggle, {
                widget: e,
                hide: Number(i.is(":hidden"))
            }),
            !1
    },
    change_order: function (e, t, i) {
        return Premium.check(t, i, function () {
            document.location.replace(e)
        }),
            !1
    },
    refreshAMSettingsWidget: function () {
        $("#show_am_settings").length && TribalWars.get("overview", {
            ajax: "am_settings"
        }, function (e) {
            $("#show_am_settings > .widget_content").html(e),
                UI.ToolTip($(".tooltip"))
        })
    },
    initMentor: function () {
        $("#content_value a").not("#mentor_back_link").attr("href", "#").attr("onclick", "").css("cursor", "not-allowed").off("click").on("click", function (e) {
            return e.stopImmediatePropagation(),
                !1
        })
    },
    initNotes: function () {
        require(["Ig/TribalWars/Modules/VillageNotes/Notebook", "Ig/TribalWars/Modules/VillageNotes/OwnNoteWidget"], function (e, t) {
            var i = new e(game_data.village.id)
                , n = $("#village_note")
                , o = $("#edit_notes_link");
            new t(n.find(".village-note"), i);
            i.on(e.EVENT_OWN_NOTE_EDITED, function (e) {
                null === e.note ? $("#message").val("") : $("#message").val(e.note.text_raw)
            });
            var l = function () {
                $("#note_bbcode, #note_input, #note_submit_button_container").toggle()
            };
            $(document).on("click", "#note_submit_button", function (e) {
                e.preventDefault();
                var t = $('textarea[name="note"]').val();
                i.editOwnNote(t, function (e) {
                    null === e ? n.hide() : n.show(),
                        mobile ? l() : $("#village_notes_popup").remove()
                })
            }),
                o.click(function (e) {
                    var t, i, n;
                    e.preventDefault(),
                        mobile ? l() : (t = o.offset().left - 300,
                            i = o.offset().top - 300,
                            n = TribalWars.buildURL("GET", "overview", {
                                ajax: "edit_notes_popup",
                                village: game_data.village.id
                            }),
                            UI.AjaxPopup(null, "village_notes_popup", n, _("744c0e143621b2e2aeaee257475d6d22"), null, {
                                dataType: "html",
                                reload: !0
                            }, 400, 300, t, i))
                })
        })
    },
    reloadWidget: function (e) {
        TribalWars.get("overview", {
            ajax: "widget",
            widget: "units"
        }, function (t) {
            $("#show_" + e).find(".widget_content").html(t),
                "units" == e && (VillageOverview.changeGroup(0),
                    VillageOverview.registerUnitWidgetEvents())
        })
    },
    changeGroup: function (e) {
        var t = VillageOverview.unit_group_selected
            , i = VillageOverview.unit_groups.length;
        t + e >= i ? t = 0 : t + e < 0 ? t = i - 1 : t += e,
            VillageOverview.unit_group_selected = t,
            VillageOverview.changeUnitGroupUI(),
            VillageOverview.changeUnitCounts()
    },
    changeMobileGroup: function (e) {
        VillageOverview.unit_group_selected = e,
            VillageOverview.changeUnitGroupUI(),
            VillageOverview.changeUnitCounts()
    },
    changeUnitGroupUI: function () {
        $(".units-widget-group").text(VillageOverview.unit_groups[VillageOverview.unit_group_selected]),
            mobile && ($("a.units-widget-group-mob").removeClass("active"),
                $('a.units-widget-group-mob[data-selected="' + VillageOverview.unit_group_selected + '"]').addClass("active"))
    },
    changeUnitCounts: function () {
        $("#unit_overview_table>tbody>tr").addClass("hide_toggle"),
            $("#unit_overview_table>tbody>tr." + ["all_unit", "home_unit", "support_unit"][VillageOverview.unit_group_selected]).removeClass("hide_toggle");
        VillageOverview.units[VillageOverview.unit_group_selected]
    },
    registerUnitWidgetEvents: function () {
        $(".units-widget-next, .units-widget-prev").on("click", function (e) {
            VillageOverview.changeGroup(parseInt($(this).data("direction")))
        }),
            $(".units-widget-group-mob").on("click", function (e) {
                e.preventDefault(),
                    VillageOverview.changeMobileGroup(parseInt($(this).data("selected")))
            })
    },
    registerAMWidgetEvents: function () {
        $("#am-edit-queue, #am-cancel").on("click", function (e) {
            $(".am-form-element").toggleClass("hide_toggle")
        }),
            $("#am-save-queue").on("click", function (e) {
                TribalWars.post("overview", {
                    ajax: "edit_am_settings"
                }, $("#amqueue-edit-form").serializeArray(), function (e) {
                    $("#show_am_settings > .widget_content").html(e)
                }, function (e) {
                    $(".am-form-element").toggleClass("hide_toggle")
                })
            })
    }
};




