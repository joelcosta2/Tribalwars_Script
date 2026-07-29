var Simulator;
Simulator = {
    SIDE_ATTACKER: "attacker",
    SIDE_DEFENDER: "defender",
    prefixes: {
        attacker: "att",
        defender: "def"
    },
    $form: null,
    benefits: {
        attacker: [],
        defender: []
    },
    init: function() {
        var t = this.$form = $("#simulator_form");
        t.submit(function(e) {
            t.find("input[name=att_benefits]").val(Simulator.formatBenefitsForTransmission(Simulator.benefits.attacker)),
            t.find("input[name=def_benefits]").val(Simulator.formatBenefitsForTransmission(Simulator.benefits.defender))
        }),
        $(".btn-benefit-create").on("click", function(e) {
            e.preventDefault(),
            Simulator.BenefitCreator.open($(this).data("side"))
        }),
        this.Filler.init(),
        this.EffectTemplates.init(),
        $("#catapult_wall").change(function() {
            Simulator.handleCatapultTarget()
        }),
        Simulator.handleCatapultTarget()
    },
    handleCatapultTarget: function() {
        $("#catapult_wall").prop("checked") ? ($("#catapult_input").find(":input").prop("disabled", !0),
        $("#catapult_lvl_disabled_overlay").show()) : ($("#catapult_input").find(":input").prop("disabled", !1),
        $("#catapult_lvl_disabled_overlay").hide())
    },
    setMorale: function(e) {
        $("#moral").val(e)
    },
    addBenefits: function(e, t) {
        e.forEach(function(e) {
            Simulator.addBenefit(e, t)
        })
    },
    addBenefit: function(e, t) {
        var a = this.generateBenefitElement(e, t);
        $("#" + this.prefixes[t] + "_benefits_display").append(a),
        this.benefits[t].push(e)
    },
    removeBenefit: function(e, t) {
        $("#" + this.prefixes[e] + "_benefits_display").find("li:nth-child(" + (t + 1) + ")").detach(),
        this.benefits[e].splice(t, 1)
    },
    removeAllBenefits: function(e) {
        for (; 0 < this.benefits[e].length; )
            this.removeBenefit(e, 0)
    },
    generateBenefitElement: function(e, t) {
        var a = '<span class="description">' + e.instance.description + "</span>"
          , e = '<img class="effect-icon" src="' + e.instance.icon_src + '">'
          , i = '<img class="remove-icon" src="' + Format.image_src("delete.png") + '">';
        return $('<li class="benefit-item">' + i + e + " " + a + "</li>").on("click", function() {
            var e = $(this).closest("li").prevAll().length;
            Simulator.removeBenefit(t, e)
        })
    },
    formatBenefitsForTransmission: function(e) {
        return JSON.stringify(e.map(function(e) {
            e = $.extend(!0, {}, e);
            return delete e.instance,
            e
        }))
    },
    Filler: {
        templates: {
            attacker: {
                current_village: null,
                last_sim: null
            },
            defender: {
                current_village: null,
                last_sim: null,
                sim_survivors: null
            }
        },
        init: function() {
            var t = this;
            $("#att_fill_select").change(function(e) {
                e.preventDefault();
                e = t.templates.attacker[this.value];
                e && t.fillAttacker(e)
            }),
            $("#def_fill_select").change(function(e) {
                e.preventDefault();
                e = t.templates.defender[this.value];
                e && (t.fillDefender(e),
                $("#is_rune").prop("checked", e.is_rune_village),
                $("#is_night").prop("checked", e.has_night_bonus))
            }),
            $("#def_survivor_fill").on("click", function(e) {
                e.preventDefault();
                e = t.templates.attacker.last_sim.catapult_target;
                t.fillDefender(t.templates.defender.sim_survivors, e)
            }),
            $("#reset_att_units").on("click", function(e) {
                e.preventDefault(),
                t.fillSide(Simulator.SIDE_ATTACKER, t.templates.attacker.reset),
                $("#att_fill_select").val("")
            }),
            $("#reset_def_units").on("click", function(e) {
                e.preventDefault(),
                t.fillSide(Simulator.SIDE_DEFENDER, t.templates.defender.reset),
                $("#def_fill_select").val(""),
                $("#wall_id").val(""),
                $("#is_rune").prop("checked", !1),
                $("#is_night").prop("checked", !1)
            })
        },
        addTemplate: function(e, t, a) {
            this.templates[e][t] = a
        },
        fillSide: function(t, a) {
            var e = this
              , i = Simulator.prefixes[t];
            a.fill.units && e.fillUnits(t, a),
            a.fill.tech && e.fillTech(t, a),
            a.fill.belief && e.getInputByName("belief_" + i).prop("checked", a.is_believer),
            a.fill.knight_items && e.getInputByName(i + "_knight_items\\[\\]").find("option").each(function(e, t) {
                t = $(t);
                t.prop("selected", -1 !== a.knight_items.indexOf(t.val()))
            }),
            a.fill.flag && e.getInputByName(i + "_flag").val(a.flag_level),
            a.fill.benefits && (Simulator.removeAllBenefits(t),
            a.benefits.forEach(function(e) {
                Simulator.addBenefit(e, t)
            }),
            Simulator.EffectTemplates.addBenefitsFromSelectedTemplate(t))
        },
        fillUnits: function(e, t) {
            var a = this
              , i = Simulator.prefixes[e];
            $.each(t.unit_counts, function(e, t) {
                a.getInputByName(i + "_" + e).val(0 < t ? t : "")
            })
        },
        fillTech: function(e, t) {
            var a = this
              , i = Simulator.prefixes[e];
            $.each(t.tech_levels, function(e, t) {
                a.getInputByName(i + "_tech_" + e).val(0 < t ? t : "")
            })
        },
        fillAttacker: function(e) {
            this.fillSide(Simulator.SIDE_ATTACKER, e)
        },
        fillDefender: function(e, t) {
            this.fillSide(Simulator.SIDE_DEFENDER, e),
            e.fill.buildings && (this.getInputByName("def_wall").val(e.buildings.wall || ""),
            this.getInputByName("def_farm").val(e.buildings.farm),
            t && this.getInputByName("def_building").val(e.buildings[t]),
            $("#is_church").is(":checked") && this.getInputByName("def_building").val(e.buildings.church),
            $("#is_farm").is(":checked")) && this.getInputByName("def_building").val(e.buildings.farm),
            e.fill.village_bonus_id && this.getInputByName("village_bonus_id").val(e.village_bonus_id)
        },
        getInputByName: function(e) {
            return Simulator.$form.find("[name=" + e + "]")
        },
        addBenefitsFromSelectedVillage: function(e) {
            t = e == Simulator.SIDE_ATTACKER ? $("#att_fill_select") : $("#def_fill_select");
            var t = $(t).val();
            Simulator.addBenefits(Simulator.Filler.templates[e][t].benefits, e)
        }
    },
    MoraleCalculator: {
        PERSPECTIVE_ATTACKER: "attacker",
        PERSPECTIVE_DEFENDER: "defender",
        perspective: null,
        calculated_morale: null,
        open: function() {
            var t = this
              , a = $("input[name=morale_type]:checked").val();
            return Dialog.fetch("morale_calculator", "place", {
                ajax: "morale_calculator",
                type: a
            }, function() {
                t.switchPerspective(t.PERSPECTIVE_ATTACKER);
                var e = $("#morale_calculator");
                e.find(".menu-item").click(function() {
                    t.switchPerspective($(this).data("perspective"))
                }),
                document.querySelectorAll('#morale_calculator input[name="is_tribe_name"]').forEach(e => {
                    e.addEventListener("click", e => {
                        var t = e.target.closest("td").querySelector(".autocomplete");
                        $(t).data("type", e.target.checked ? "ally" : "player")
                    }
                    )
                }
                ),
                e.find("form").submit(function(e) {
                    e.preventDefault(),
                    t.calculateMorale(a)
                })
            }, {}, function() {
                t.perspective = null
            }),
            !1
        },
        calculateMorale: function(e) {
            var t = this.getActiveForm().serializeArray()
              , a = (t.push({
                name: "perspective",
                value: this.perspective
            }),
            this);
            TribalWars.post("place", {
                ajax: "calculate_morale",
                type: e
            }, t, function(e) {
                a.setAttackerName(""),
                a.setAttackerPoints(e.attacker_points),
                a.setDefenderName(""),
                a.setDefenderPoints(e.defender_points),
                a.setDaysPlayed(e.days_played),
                a.setMorale(e.morale)
            })
        },
        setAttackerName: function(e) {
            return this.getActiveForm().find("input[name=attacker_name]").val(e),
            !1
        },
        setDefenderName: function(e) {
            return this.getActiveForm().find("input[name=defender_name]").val(e),
            !1
        },
        setAttackerPoints: function(e) {
            return this.getActiveForm().find("input[name=attacker_points]").val(e),
            !1
        },
        setDefenderPoints: function(e) {
            return this.getActiveForm().find("input[name=defender_points]").val(e),
            !1
        },
        setDaysPlayed: function(e) {
            return this.getActiveForm().find("input[name=days_played]").val(e),
            !1
        },
        setMorale: function(e) {
            this.calculated_morale = e;
            var t = $("#morale_calculator").find(".result_display");
            return t.find(".morale").html(e),
            t.show(),
            !1
        },
        getActiveForm: function() {
            return $("#morale_calculator").find("form." + this.perspective)
        },
        switchPerspective: function(e) {
            var t, a;
            e !== this.perspective && (t = (this.perspective = e) === this.PERSPECTIVE_ATTACKER ? this.PERSPECTIVE_DEFENDER : this.PERSPECTIVE_ATTACKER,
            this.getActiveForm().show(),
            (a = $("#morale_calculator")).find("form." + t).hide(),
            a.find(".menu-item[data-perspective=" + e + "]").addClass("selected"),
            a.find(".menu-item[data-perspective=" + t + "]").removeClass("selected"),
            a.find(".result_display").hide())
        },
        pasteResultToSimulator: function() {
            Simulator.setMorale(this.calculated_morale),
            Dialog.close()
        }
    },
    BenefitCreator: {
        possibilities: {
            attacker: [],
            defender: []
        },
        addPossibilities: function(e, a) {
            var i = this;
            $.each(e, function(e, t) {
                i.possibilities[a].push($.extend(Object.create(i.PossibleBenefit), t))
            })
        },
        open: function(a) {
            var i = '<h2 class="popup_box_header">' + _("df0a38410861dc773fced203680d19d3") + '</h2><form id="benefit_creator_form"><input type="hidden" name="side" value="' + a + '"><div class="attribute-input">' + _("29e9b14315473eb6c2769b8ddf0540a4") + ' <select name="type">'
              , e = (this.possibilities[a].forEach(function(e, t) {
                i += '<option value="' + e.type + '" data-side="' + a + '" data-index="' + t + '">' + e.name + "</option>"
            }),
            i += '</select></div><div class="variable-inputs"></div>',
            a === Simulator.SIDE_ATTACKER ? _("56e022653b34cddcce4b8f5b941b7e20") : _("76c50feb6d03f4620361bdea1953ca07"))
              , t = (i += '<div class="center"><a href="#" class="btn btn-default">' + e + "</a></div></form>",
            Dialog.show("benefit_creator", i),
            this)
              , e = $("#benefit_creator_form");
            e.find('select[name="type"]').change(function() {
                t.handleTypeSwitch()
            }),
            e.find(".btn").click(function(e) {
                e.preventDefault(),
                t.finishBenefit()
            }),
            this.handleTypeSwitch()
        },
        handleTypeSwitch: function() {
            var e = $("#benefit_creator_form")
              , t = e.find('select[name="type"]').find("option:selected");
            e.find(".variable-inputs").html(this.possibilities[t.data("side")][t.data("index")].generateUI())
        },
        finishBenefit: function() {
            TribalWars.post("place", {
                ajax: "create_benefit"
            }, $("#benefit_creator_form").serializeArray(), function(e) {
                Simulator.addBenefit(e.benefit, e.side),
                Dialog.close()
            })
        },
        PossibleBenefit: {
            TYPE_UNITSTAT: "b_unitstat",
            TYPE_FLAG: "b_flag",
            type: null,
            name: "",
            inputs: [],
            generateUI: function() {
                var i = "";
                return this.inputs.forEach(function(e, t) {
                    if ("hidden" === e.type)
                        i += '<input type="hidden" name="inputs[]" value="' + e.value + '">';
                    else {
                        if (i += '<div class="attribute-input">' + e.label + ' <select name="inputs[]">',
                        "int" === e.type)
                            for (var a = e.max; a >= e.min; a--)
                                i += '<option value="' + a + '" ' + (a === e.default_selection ? "selected" : "") + ">" + (a < 0 ? "" : "+") + a + "%</option>";
                        else
                            "enum" === e.type && e.options.forEach(function(e, t) {
                                i += '<option value="' + e.value + '">' + escapeHtml(e.description) + "</option>"
                            });
                        i += "</select></div>"
                    }
                }),
                i
            }
        }
    },
    EffectTemplates: {
        benefits: {
            attacker: [],
            defender: []
        },
        init: function() {
            $("#attack_effect_templates").on("change", function(e) {
                this.value < 0 ? (Simulator.removeAllBenefits(Simulator.SIDE_ATTACKER),
                $("#del_att_temp").prop("disabled", !0),
                $('input[name="att_template_name"]').val(""),
                Simulator.Filler.addBenefitsFromSelectedVillage(Simulator.SIDE_ATTACKER)) : (e.preventDefault(),
                e = Simulator.EffectTemplates.benefits.attacker[this.value],
                Simulator.removeAllBenefits(Simulator.SIDE_ATTACKER),
                Simulator.addBenefits(e.benefits, Simulator.SIDE_ATTACKER),
                Simulator.Filler.addBenefitsFromSelectedVillage(Simulator.SIDE_ATTACKER),
                $('input[name="att_template_name"]').val(e.name),
                $("#del_att_temp").prop("disabled", !1).attr("href", TribalWars.buildURL("GET", {
                    action: "delete_effect_template",
                    screen: "place",
                    mode: "sim",
                    id: e.id
                })))
            }),
            $("#defense_effect_templates").on("change", function(e) {
                this.value < 0 ? (Simulator.removeAllBenefits(Simulator.SIDE_DEFENDER),
                $("#del_def_temp").prop("disabled", !0),
                $('input[name="def_template_name"]').val(""),
                Simulator.Filler.addBenefitsFromSelectedVillage(Simulator.SIDE_DEFENDER)) : (e.preventDefault(),
                e = Simulator.EffectTemplates.benefits.defender[this.value],
                Simulator.removeAllBenefits(Simulator.SIDE_DEFENDER),
                Simulator.addBenefits(e.benefits, Simulator.SIDE_DEFENDER),
                Simulator.Filler.addBenefitsFromSelectedVillage(Simulator.SIDE_DEFENDER),
                $('input[name="def_template_name"]').val(e.name),
                $("#del_def_temp").prop("disabled", !1).attr("href", TribalWars.buildURL("GET", {
                    action: "delete_effect_template",
                    screen: "place",
                    mode: "sim",
                    id: e.id
                })))
            }),
            $("#save_att_template").on("click", function() {
                Simulator.EffectTemplates.saveTemplate({
                    template_name: $('input[name="att_template_name"]').val(),
                    effects: Simulator.benefits.attacker,
                    type: 0,
                    confirm: !1
                })
            }),
            $("#save_def_template").on("click", function() {
                Simulator.EffectTemplates.saveTemplate({
                    template_name: $('input[name="def_template_name"]').val(),
                    effects: Simulator.benefits.defender,
                    type: 1,
                    confirm: !1
                })
            }),
            $("#del_att_temp, #del_def_temp").on("click", function(e) {
                e = $(e.target).attr("data-side");
                Simulator.EffectTemplates.removeTemplate(e)
            })
        },
        addTemplate: function(e) {
            var t = this.sideFromType(e.type);
            Simulator.EffectTemplates.benefits[t][e.id] = e
        },
        addTemplates: function(e) {
            e.forEach(function(e) {
                Simulator.EffectTemplates.addTemplate(e)
            })
        },
        removeTemplate: function(e) {
            t = e == Simulator.SIDE_ATTACKER ? $("#attack_effect_templates") : $("#defense_effect_templates");
            var t, a = $(t).val(), e = ($(t).find(":selected").remove(),
            delete Simulator.EffectTemplates.benefits[e][a],
            {
                text: _("f2a6c498fb90ee345d997f888fce3b18"),
                confirm: !0,
                callback: function() {
                    TribalWars.post("place", {
                        ajax: "delete_effect_template"
                    }, {
                        id: a
                    }, function(e) {
                        1 == parseInt(e.status) ? (UI.SuccessMessage(e.message),
                        $(t).val(-1).trigger("change")) : UI.ErrorMessage(e.message)
                    }, function() {
                        UI.ErrorMessage(_("c6701602de1528fd79d5eff3e8eb1edd"))
                    })
                }
            });
            UI.ConfirmationBox(_("eba24b6def56e1a205e3f30a6582c101"), [e])
        },
        saveTemplate: function(i) {
            var l = this.sideFromType(i.type);
            TribalWars.post("place", {
                ajax: "add_effect_template"
            }, i, function(e) {
                switch (parseInt(e.status)) {
                case 1:
                    UI.SuccessMessage(e.message),
                    Simulator.EffectTemplates.addTemplate(e.template),
                    0 == $('.template-list>option[value="' + e.template.id + '"]').length && (a = l == Simulator.SIDE_ATTACKER ? $("#attack_effect_templates") : $("#defense_effect_templates"),
                    $('<option value="' + e.template.id + '">' + e.template.name + "</option>").appendTo(a).prop("selected", !0),
                    $(a).trigger("change"));
                    break;
                case 0:
                    UI.ErrorMessage(e.message);
                    break;
                case -1:
                    var t = i
                      , a = (t.confirm = !0,
                    {
                        text: _("da364eb37e143f6b2b5559aa03f5913a"),
                        confirm: !0,
                        callback: function() {
                            Simulator.EffectTemplates.saveTemplate(t)
                        }
                    });
                    UI.ConfirmationBox(e.message, [a], "confirm-overwite-template", !1, !0, !1)
                }
            }, function(e) {
                UI.ErrorMessage(e.message)
            })
        },
        sideFromType: function(e) {
            e = 0 === e ? Simulator.SIDE_ATTACKER : Simulator.SIDE_DEFENDER;
            return e
        },
        addBenefitsFromSelectedTemplate: function(e) {
            t = e == Simulator.SIDE_ATTACKER ? $("#attack_effect_templates") : $("#defense_effect_templates");
            var t = $(t).val();
            0 < t && Simulator.addBenefits(Simulator.EffectTemplates.benefits[e][t].benefits, e)
        }
    }
};
