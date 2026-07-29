var ColorGroups;
ColorGroups = {
    multiple_villages_link: null,
    TYPE_OWN: "own",
    TYPE_OTHER: "other",
    init: function(e, o) {
        this.color_picker.base_link = e,
        this.multiple_villages_link = o,
        MapLegend.init(),
        $(".colorgroup-own-activate").change(function() {
            var e = $(this)
              , o = e.closest(".colorgroup-own-entry").data("id");
            e.is(":checked") ? ColorGroups.Own.activateGroup(o) : ColorGroups.Own.deactivateGroup(o)
        }),
        $(".colorgroup-other-activate").change(function() {
            var e = $(this)
              , o = e.closest(".colorgroup-other-entry").data("id");
            e.is(":checked") ? ColorGroups.Other.activateGroup(o) : ColorGroups.Other.deactivateGroup(o)
        }),
        $(".colorgroup-own-delete").on("click", function(e) {
            e.preventDefault();
            var o = $(this).closest(".colorgroup-own-entry").data("id");
            UI.addConfirmBox(_("1d7a209e5461c92be4a38e7cfef02380"), function() {
                ColorGroups.Own.deleteGroup(o)
            })
        }),
        $(".colorgroup-other-delete").on("click", function(e) {
            e.preventDefault();
            var o = $(this).closest(".colorgroup-other-entry").data("id");
            UI.addConfirmBox(_("1d7a209e5461c92be4a38e7cfef02380"), function() {
                ColorGroups.Other.deleteGroup(o)
            })
        }),
        $(".colorgroup-own-entry").find(".color_picker_launcher").click(function(e) {
            e.preventDefault(),
            ColorGroups.color_picker.openPopup($(this), ColorGroups.TYPE_OWN)
        }),
        $(".colorgroup-other-entry").find(".color_picker_launcher").click(function(e) {
            e.preventDefault(),
            ColorGroups.color_picker.openPopup($(this), ColorGroups.TYPE_OTHER)
        }),
        $(".own-group-create-btn").on("click", this.Own.toggleCreation),
        $(".other-group-create-btn").on("click", this.Other.startCreation),
        mobile ? (e = TribalWars.buildURL("POST", "map", {
            ajaxaction: "change_group_order"
        }),
        MDS.orderableQueue.init($("#color-groups-queue"), e, function(e) {
            UI.SuccessMessage(e.message)
        }, !1),
        MDS.orderableQueue.init($("#for_groups"), e, function(e) {
            UI.SuccessMessage(e.message)
        }, !1)) : ($("#own_color_groups").sortable({
            axis: "y",
            handle: ".bqhandle",
            helper: function(e, o) {
                var a = o.children()
                  , o = o.clone();
                return o.children().each(function(e) {
                    $(this).width(a.eq(e).width())
                }),
                o
            },
            items: ".colorgroup-own-entry",
            placeholder: "table_row_placeholder",
            stop: function(e, o) {
                TribalWars.post("map", {
                    ajaxaction: "change_group_order"
                }, $("#own_color_groups").sortable("serialize"), function(e) {
                    UI.SuccessMessage(e.message)
                }, function() {
                    $("#own_color_groups").sortable("cancel")
                })
            }
        }),
        $("#for_color_groups").sortable({
            axis: "y",
            handle: ".bqhandle",
            helper: function(e, o) {
                var a = o.children()
                  , o = o.clone();
                return o.children().each(function(e) {
                    $(this).width(a.eq(e).width())
                }),
                o
            },
            items: ".colorgroup-other-entry",
            placeholder: "table_row_placeholder",
            stop: function(e, o) {
                TribalWars.post("map", {
                    ajaxaction: "change_group_order"
                }, $("#for_color_groups").sortable("serialize"), function(e) {
                    UI.SuccessMessage(e.message)
                }, function() {
                    $("#for_color_groups").sortable("cancel")
                })
            }
        }))
    },
    openMultiVillagePopup: function(e) {
        TribalWars.post("map", {
            ajaxaction: "load_for_multiple_villages"
        }, {}, function(e) {
            Dialog.show("multi_village_popup", e.dialog, null, {
                width: 400
            })
        })
    },
    color_picker: {
        base_link: null,
        r: 0,
        g: 0,
        b: 0,
        group_id: null,
        group_type: null,
        icon: null,
        openPopup: function(e, o) {
            var a = e.offset().left + 50
              , r = e.offset().top - 100
              , l = e.data("id")
              , i = e.data("r")
              , t = e.data("g")
              , n = e.data("b")
              , c = e.data("icon")
              , p = e.data("t")
              , s = this.base_link + "&r=" + i + "&g=" + t + "&b=" + n;
            p && (s += "&trans=" + p),
            this.r = i,
            this.g = t,
            this.b = n,
            this.group_id = l,
            this.group_type = o,
            this.icon = c,
            this.$launcher = e,
            UI.AjaxPopup(null, "edit_color_popup", s, _("703ddad7cc7f884b4ebf6b79dac842e6"), this.handleReload, {
                dataType: "html",
                reload: !0
            }, !1, !1, a, r)
        },
        handleReload: function(e, o) {
            var a = ColorGroups.color_picker;
            $(o).html(e),
            $("#color_picker").show(),
            $("#color_group_id").val(a.group_id),
            $("#icon_url").val(a.icon),
            color_picker_choose(a.r, a.g, a.b, !0),
            $("#trans_color_input").attr("checked") && $("#color").css("background-color", "transparent"),
            a.group_type === ColorGroups.TYPE_OTHER ? ($("#icon_picker").hide(),
            $("#trans_color").hide(),
            $("#color_picker_submit").val(_("c9cc8cce247e49bae79f15173ce97354")),
            $("#editcolorform").submit(function(e) {
                e.preventDefault(),
                ColorGroups.Other.changeColor(a.group_id, $("#color_picker_r").val(), $("#color_picker_g").val(), $("#color_picker_b").val()),
                $("#closelink_edit_color_popup").click()
            })) : ($("#color_picker_submit").val(_("c9cc8cce247e49bae79f15173ce97354")),
            $("#editcolorform").submit(function(e) {
                e.preventDefault(),
                ColorGroups.Own.changeColor(a.group_id, parseInt($("#color_picker_r").val()), parseInt($("#color_picker_g").val()), parseInt($("#color_picker_b").val()), $("#icon_url").val(), $("#trans_color_input").is(":checked")),
                $("#closelink_edit_color_popup").click()
            })),
            mobile && setTimeout(function() {
                var e = $("#edit_color_popup")
                  , o = e.outerHeight()
                  , o = $(window).height() - 150 - o
                  , o = Math.max(0, Math.min(e.position().top, o));
                e.css("top", o)
            }, 0)
        }
    },
    Own: {
        groups: {},
        toggleCreation: function(e) {
            e.preventDefault();
            var o = $("#own_villages")
              , a = (o.toggle(),
            0)
              , r = 0
              , l = null
              , l = e.srcElement || e.target;
            r = $.cookie("popup_pos_own_villages") ? (e = $.cookie("popup_pos_own_villages").split("x"),
            a = parseInt(e[0], 10),
            parseInt(e[1], 10)) : (a = $(l).offset().left,
            $(l).offset().top - o.height() - 5),
            o.offset({
                left: a,
                top: r
            }),
            UI.Draggable(o)
        },
        activateGroup: function(r) {
            TribalWars.post("map", {
                ajaxaction: "marker_active"
            }, {
                group_id: r,
                active: 1
            }, function(e) {
                MapLegend.showHighlight(MapLegend.CATEGORY_OWN, r);
                for (var o = ColorGroups.Own.groups[r].villages, a = 0; a < o.length; a++)
                    TWMap.villageIcons.hasOwnProperty(o[a]) || (TWMap.villageIcons[o[a]] = {}),
                    TWMap.villageIcons[o[a]]["group_" + r] = ColorGroups.Own.groups[r].marker;
                TWMap.map.reload(!0)
            })
        },
        deactivateGroup: function(r) {
            TribalWars.post("map", {
                ajaxaction: "marker_active"
            }, {
                group_id: r,
                active: 0
            }, function(e) {
                MapLegend.hideHighlight(MapLegend.CATEGORY_OWN, r);
                for (var o = ColorGroups.Own.groups[r].villages, a = 0; a < o.length; a++)
                    delete TWMap.villageIcons[o[a]]["group_" + r];
                TWMap.map.reload(!0)
            })
        },
        deleteGroup: function(r) {
            TribalWars.post("map", {
                ajaxaction: "marker_delete"
            }, {
                group_id: r
            }, function(e) {
                $('.colorgroup-own-entry[data-id="' + r + '"]').remove(),
                MapLegend.removeHighlight(MapLegend.CATEGORY_OWN, r);
                for (var o = ColorGroups.Own.groups[r].villages, a = 0; a < o.length; a++)
                    delete TWMap.villageIcons[o[a]]["group_" + r];
                TWMap.map.reload(!0),
                delete ColorGroups.Own.groups[r]
            })
        },
        changeColor: function(t, n, c, p, s, u) {
            TribalWars.post("map", {
                ajaxaction: "marker_change"
            }, {
                group_id: t,
                r: n,
                g: c,
                b: p,
                icon_url: s,
                t: u
            }, function(e) {
                MapLegend.updateHighlight(MapLegend.CATEGORY_OWN, t, null, u ? null : {
                    r: n,
                    g: c,
                    b: p
                }, s);
                for (var o = u ? "none" : "rgb(" + n + "," + c + "," + p + ")", a = s ? escapeHtml(s, !0) : "", r = $('.colorgroup-own-entry[data-id="' + t + '"]'), l = (r.find(".marker").css("background-color", o),
                "" !== a && (r.find(".marker > img").hide(),
                r.find(".marker").css({
                    backgroundSize: "cover",
                    backgroundImage: "url(" + a + ")"
                })),
                r.find(".color_picker_launcher").data("r", n).data("g", c).data("b", p).data("icon", s).data("t", u),
                ColorGroups.Own.groups[t].marker.c = o,
                ColorGroups.Own.groups[t].marker.img = s,
                ColorGroups.Own.groups[t].villages), i = 0; i < l.length; i++)
                    TWMap.villageIcons[l[i]]["group_" + t] = ColorGroups.Own.groups[t].marker;
                TWMap.map.reload(!0)
            })
        }
    },
    Other: {
        startCreation: function() {
            $("#new_group").show()
        },
        activateGroup: function(o) {
            TribalWars.post("map", {
                ajaxaction: "colorgroup_active"
            }, {
                group_id: o,
                active: 1
            }, function(e) {
                MapLegend.showHighlight(MapLegend.CATEGORY_OTHER, o),
                ColorGroups.Other.handleBigChange(e)
            })
        },
        deactivateGroup: function(o) {
            TribalWars.post("map", {
                ajaxaction: "colorgroup_active"
            }, {
                group_id: o,
                active: 0
            }, function(e) {
                MapLegend.hideHighlight(MapLegend.CATEGORY_OTHER, o),
                ColorGroups.Other.handleBigChange(e)
            })
        },
        deleteGroup: function(o) {
            TribalWars.post("map", {
                ajaxaction: "colorgroup_delete"
            }, {
                group_id: o
            }, function(e) {
                $("#for_groups").find('.colorgroup-other-entry[data-id="' + o + '"]').remove(),
                MapLegend.removeHighlight(MapLegend.CATEGORY_OTHER, o),
                ColorGroups.Other.handleBigChange(e)
            })
        },
        changeColor: function(o, a, r, l) {
            TribalWars.post("map", {
                ajaxaction: "colorgroup_change_color"
            }, {
                group_id: o,
                r: a,
                g: r,
                b: l
            }, function(e) {
                MapLegend.updateHighlight(MapLegend.CATEGORY_OTHER, o, e.group_name, {
                    r: a,
                    g: r,
                    b: l
                }),
                ColorGroups.Other.handleBigChange(e);
                e = $('.colorgroup-other-entry[data-id="' + o + '"]');
                e.find(".marker").css("background-color", "rgb(" + a + "," + r + "," + l + ")"),
                e.find(".color_picker_launcher").data("r", a).data("g", r).data("b", l)
            })
        },
        handleBigChange: function(e) {
            MapHighlighter.alterAll(e.village_colors, e.player_colors, e.tribe_colors),
            MapHighlighter.colorAll(e.affected_villages, e.affected_players, e.affected_tribes),
            TWMap.minimap_cache_stamp++,
            TWMap.minimap.reload(!0),
            TWMap.map.reload(!0)
        },
        editor: {
            ENTITY_TRIBE: "ally",
            ENTITY_PLAYER: "player",
            ENTITY_VILLAGE: "village",
            group_id: null,
            group_name: null,
            openPopup: function(e, o, a) {
                ColorGroups.Other.editor;
                this.group_id = o,
                this.group_name = unescapeHtml($("#groupname_" + o).html()),
                TribalWars.post("map", {
                    ajaxaction: "load_for_groups"
                }, {}, function(e) {
                    Dialog.show("for_villages_popup", e.dialog, null, {
                        width: 400
                    })
                })
            },
            handleReload: function(e, o) {
                var a = ColorGroups.Other.editor;
                $("#for_villages_popup_content").html(e),
                $("#for_group_id").val(a.group_id),
                $("#for_group_name").val(a.group_name),
                a.fetchGroupMembers(a.ENTITY_TRIBE),
                a.fetchGroupMembers(a.ENTITY_PLAYER),
                a.fetchGroupMembers(a.ENTITY_VILLAGE),
                UI.init()
            },
            fetchGroupMembers: function(i) {
                var t = this
                  , e = ""
                  , n = null;
                i === t.ENTITY_TRIBE && (e = "colorgroup_get_tribes",
                n = $("#tribes > tbody")),
                i === t.ENTITY_PLAYER && (e = "colorgroup_get_players",
                n = $("#players > tbody")),
                i === t.ENTITY_VILLAGE && (e = "colorgroup_get_villages",
                n = $("#villages > tbody")),
                TribalWars.post("map", {
                    ajaxaction: e
                }, {
                    group_id: t.group_id
                }, function(e) {
                    n.empty(),
                    $(e).each(function(e, o) {
                        var a = $("<tr>")
                          , r = ""
                          , l = escapeHtml(o.name)
                          , r = (i === t.ENTITY_TRIBE && (r = '<img src="' + o.ally_image + '" class="userimage-tiny"> ',
                        l += " [" + escapeHtml(o.tag) + "]"),
                        i === t.ENTITY_PLAYER && (r = '<img src="' + o.player_image + '" class="userimage-tiny"> '),
                        $("<td>").html(r + l))
                          , l = $("<a>").attr("href", "#").html(_("099af53f601532dbd31e0ea99ffdeb64")).click(function() {
                            return t.removeMember(i, o.id),
                            !1
                        })
                          , l = $("<td>").append(l);
                        a.append(r),
                        a.append(l),
                        n.append(a)
                    }),
                    i === t.ENTITY_VILLAGE && (0 < e.length ? $("#toggle_villages_link").show() : $("#toggle_villages_link").hide())
                })
            },
            ajax_request: function(e, o, a, r) {
                var l = ColorGroups.Other.editor
                  , o = $.extend({
                    group_id: l.group_id
                }, o);
                TribalWars.post("map", {
                    ajaxaction: "colorgroup_" + e
                }, o, function(e) {
                    a === l.ENTITY_TRIBE && l.fetchGroupMembers(l.ENTITY_TRIBE),
                    a === l.ENTITY_PLAYER && l.fetchGroupMembers(l.ENTITY_PLAYER),
                    a === l.ENTITY_VILLAGE && (l.fetchGroupMembers(l.ENTITY_VILLAGE),
                    $("#add_village_x").val(""),
                    $("#add_village_y").val("")),
                    "function" == typeof r && r(e)
                })
            },
            toggleVillageList: function() {
                $("#villages").slideToggle("fast")
            },
            renameGroup: function(o) {
                var a = this;
                a.ajax_request("rename", {
                    name: o
                }, null, function(e) {
                    $("#groupname_" + a.group_id).html(escapeHtml(o)),
                    void 0 !== TWMap.villageKey[e.village_id] && MapLegend.updateHighlight(MapLegend.CATEGORY_OTHER, a.group_id, o, e.color),
                    UI.SuccessMessage(_("996bf1c7776f50b7afe7e50fdc04b32b"))
                })
            },
            addTribe: function(e) {
                this.ajax_request("add_tribe", {
                    name: e
                }, this.ENTITY_TRIBE, function(e) {
                    $("#new_tribe").val("").focus(),
                    MapHighlighter.alterAlly(e.ally_id, e.color),
                    MapHighlighter.colorAlly(e.ally_id),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("c6c2c06d456fb88bc5bddf420e7dca41"))
                })
            },
            removeTribe: function(o) {
                this.ajax_request("del_tribe", {
                    id: o
                }, this.ENTITY_TRIBE, function(e) {
                    MapHighlighter.alterAlly(o, e.color),
                    MapHighlighter.colorAlly(o),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("db8cf2906e1249b98eac8dd0c5e51a09"))
                })
            },
            addPlayer: function(e) {
                this.ajax_request("add_player", {
                    name: e
                }, this.ENTITY_PLAYER, function(e) {
                    $("#new_player").val("").focus(),
                    MapHighlighter.alterPlayer(e.player_id, e.color),
                    MapHighlighter.colorPlayer(e.player_id),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("55aa86def5c494c49b7a93d1e1c70441"))
                })
            },
            removePlayer: function(o) {
                this.ajax_request("del_player", {
                    id: o
                }, this.ENTITY_PLAYER, function(e) {
                    MapHighlighter.alterPlayer(o, e.color),
                    MapHighlighter.colorPlayer(o),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("00f3700f9bbb1b1db7437abe2a7ab43f"))
                })
            },
            addVillage: function(e, o) {
                this.ajax_request("add_village", {
                    x: e,
                    y: o
                }, this.ENTITY_VILLAGE, function(e) {
                    $("#add_vilage_x").focus(),
                    MapHighlighter.alterVillage(e.village_id, e.color),
                    void 0 !== TWMap.villageKey[e.village_id] && MapHighlighter.colorVillage(TWMap.villages[TWMap.villageKey[e.village_id]]),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("5a3e017d872f44bd1505bfcde72bb151"))
                })
            },
            addMutipleVillages: function(e) {
                this.ajax_request("add_multiple_villages", {
                    coordinates: e
                }, this.ENTITY_VILLAGE, function(e) {
                    e.villages.forEach(function(e) {
                        MapHighlighter.alterVillage(e.village_id, e.color),
                        void 0 !== TWMap.villageKey[e.village_id] && MapHighlighter.colorVillage(TWMap.villages[TWMap.villageKey[e.village_id]]),
                        TWMap.minimap_cache_stamp++
                    }),
                    TWMap.minimap.reload(!0),
                    e.status ? UI.SuccessMessage(_("8a144eaccab2a0ca9543e944be380b1c")) : UI.ErrorMessage(e.message),
                    Dialog.close()
                })
            },
            removeVillage: function(o) {
                this.ajax_request("del_village", {
                    id: o
                }, this.ENTITY_VILLAGE, function(e) {
                    MapHighlighter.alterVillage(o, e.color),
                    void 0 !== TWMap.villageKey[o] && MapHighlighter.colorVillage(TWMap.villages[TWMap.villageKey[o]]),
                    TWMap.minimap_cache_stamp++,
                    TWMap.minimap.reload(!0),
                    UI.SuccessMessage(_("d7682f8d88b683452c73ec1b46b1e0d4"))
                })
            },
            removeMember: function(e, o) {
                switch (e) {
                case this.ENTITY_TRIBE:
                    this.removeTribe(o);
                    break;
                case this.ENTITY_PLAYER:
                    this.removePlayer(o);
                    break;
                case this.ENTITY_VILLAGE:
                    this.removeVillage(o);
                    break;
                default:
                    return
                }
            }
        }
    }
};

;function FreeMap(e, t, i, s, o) {
    var n, g = this;
    return this.el = {},
    this.el.root = e,
    this.el.container = document.createElement("div"),
    $(this.el.container).attr("style", "position: absolute; left:0px; top:0px; z-index:1; overflow:visible"),
    this.el.container.setAttribute("id", e.id + "_container"),
    e.appendChild(this.el.container),
    this.size = [$(e).width(), $(e).height()],
    this.scale = t,
    this.sectorSize = i,
    this.pos = [-1, -1],
    (this.handler = s).onClick && (n = this,
    $.browser.msie ? $(this.el.root).mousedown(function(e) {
        n._downEl = 2 == e.which ? 0 : 1
    }).mouseup(function(e) {
        return 1 != n._downEl || n._handleClick(e) ? !(n._downEl = 0) : !(n._downEl = 2)
    }).click(function(e) {
        if (2 == n._downEl)
            return !1
    }) : $(this.el.root).click(function(e) {
        return 2 == e.which || n._handleClick(e)
    })),
    this._lastTopLeftSector = [0, 0],
    this._lastBottomRightSector = [0, 0],
    this._visibleSectors = {},
    this._loadedSectors = {},
    this.viewport = [0, 0, 0, 0],
    this.bias = o,
    this._handleClick = function(e) {
        var t;
        return (!this.mover || !this.mover.moveDirty) && (t = this.coordByEvent(e),
        this.handler.onClick(t[0], t[1], e))
    }
    ,
    this.coordByPixel = function(e, t, i) {
        return !0 === i ? [e / this.scale[0], t / this.scale[1]] : [Math.floor(e / this.scale[0]), Math.floor(t / this.scale[1])]
    }
    ,
    this.pixelByCoord = function(e, t) {
        return [e * this.scale[0], t * this.scale[1]]
    }
    ,
    this.sectorByPixel = function(e, t) {
        return [Math.floor(e / this.scale[0] / this.sectorSize), Math.floor(t / this.scale[1] / this.sectorSize)]
    }
    ,
    this.coordByEvent = function(e) {
        var t = $(this.el.root).offset()
          , e = [e.pageX - t.left + this.pos[0], e.pageY - t.top + this.pos[1]];
        return [Math.floor(e[0] / this.scale[0]), Math.floor(e[1] / this.scale[1])]
    }
    ,
    this.centerPos = function(e, t, i) {
        e = e * this.scale[0] - this.size[0] / 2 + this.scale[0] / 2,
        t = t * this.scale[1] - this.size[1] / 2 + this.scale[1] / 2;
        return !0 === i && (e -= e % this.scale[0],
        t -= t % this.scale[1]),
        this.setPosPixel(e, t)
    }
    ,
    this.setPos = function(e, t) {
        return this.setPosPixel(e * this.scale[0], t * this.scale[1])
    }
    ,
    this.setPosPixel = function(e, t) {
        if (e == this.pos[0] && t == this.pos[1])
            return 0;
        if (isNaN(e) || isNaN(t))
            return 0;
        var i = this.handler.scrollBound.x_min * this.scale[0]
          , s = this.handler.scrollBound.x_max * this.scale[0] - this.size[0] + this.scale[0]
          , i = (e = Math.min(Math.max(e, i), s),
        this.handler.scrollBound.y_min * this.scale[1])
          , s = this.handler.scrollBound.y_max * this.scale[1] - this.size[1] + this.scale[1]
          , o = (t = Math.min(Math.max(t, i), s),
        this.pos[0] = e,
        this.pos[1] = t,
        this.handler.onMovePixel && this.handler.onMovePixel(e, t),
        0)
          , i = [e + this.size[0], t + this.size[1]]
          , n = this.sectorByPixel(e, t)
          , h = this.sectorByPixel(i[0], i[1]);
        if (!compareCoord(this._lastTopLeftSector, n) || !compareCoord(this._lastBottomRightSector, h)) {
            for (var r = [], a = [], l = n[0]; l <= h[0]; l++)
                for (var c = n[1]; c <= h[1]; c++) {
                    var d = l + "_" + c;
                    !(p = this._loadedSectors[d]) && (p = {
                        id: d,
                        visible: !1,
                        loaded: !0,
                        sx: l,
                        sy: c,
                        x: l * this.sectorSize,
                        y: c * this.sectorSize,
                        _elements: [],
                        _element_root: null,
                        _map: g,
                        appendElement: function(e, t, i) {
                            e.style.left = t * this._map.scale[0] + "px",
                            e.style.top = i * this._map.scale[1] + "px",
                            this._elements.push(e),
                            (void 0 === this.dom_fragment ? this._element_root : this.dom_fragment).appendChild(e)
                        },
                        spawn: function() {
                            this.visible || (this._map.el.container.appendChild(this._element_root),
                            this.visible = !0)
                        },
                        despawn: function(e) {
                            this.visible && (this._map.el.container.removeChild(this._element_root),
                            !0 === e && (this._element_root = null),
                            this.visible = !1)
                        },
                        coordIn: function(e, t) {
                            return e >= this.x && e < this.x + this._map.sectorSize && t >= this.y && t < this.y + this._map.sectorSize
                        }
                    },
                    (d = document.createElement("div")).style.width = this.scale[0] * this.sectorSize + "px",
                    d.style.height = this.scale[1] * this.sectorSize + "px",
                    d.style.position = "absolute",
                    d.style.left = l * this.sectorSize * this.scale[0] - this.bias + "px",
                    d.style.top = c * this.sectorSize * this.scale[1] - this.bias + "px",
                    p._element_root = d,
                    p.spawn(),
                    !this.handler.scrollBound || p.x >= this.handler.scrollBound.x_min - this.sectorSize && p.y >= this.handler.scrollBound.y_min - this.sectorSize && p.x < this.handler.scrollBound.x_max && p.y < this.handler.scrollBound.y_max) && a.push(p),
                    r.push(p)
                }
            if (a.length)
                if (o = a.length,
                this.handler.loadSectors)
                    this.handler.loadSectors(a);
                else
                    for (var u = 0; u < o; u++)
                        this.handler.loadSector(a[u]);
            if (r.length) {
                this.handler.preLoad && this.handler.preLoad(r.length);
                for (var p, m, v = {}, _ = r.length, u = 0; u < _; u++)
                    (p = r[u]).loaded && p.spawn(),
                    v[p.id] = p,
                    this._loadedSectors[p.id] = p;
                for (u in this._visibleSectors)
                    this._visibleSectors.hasOwnProperty(u) && void 0 === v[(m = this._visibleSectors[u]).id] && (m.despawn(),
                    delete this._loadedSectors[u]);
                this.handler.postLoad && this.handler.postLoad(),
                this._visibleSectors = v
            }
        }
        s = this.getCenter();
        return this.lastCenterCoordPos && compareCoord(s, this.lastCenterCoordPos) || (this.handler.onMove && this.handler.onMove(s[0], s[1]),
        this.lastCenterCoordPos = s,
        this.recalcViewport()),
        e -= this.bias,
        t -= this.bias,
        this.el.container.style.left = -e + "px",
        this.el.container.style.top = -t + "px",
        o
    }
    ,
    this.getCenter = function() {
        return this.coordByPixel(this.pos[0] + this.size[0] / 2, this.pos[1] + this.size[1] / 2)
    }
    ,
    this.getLevelForVillagePoints = function(e) {
        for (var t = [300, 1e3, 3e3, 9e3, 11e3], i = 1, s = 0; s < t.length && !(e < t[s]); s++)
            i++;
        return i
    }
    ,
    this.getViewportTileDimensions = function() {
        return {
            width: TWMap.map.size[0] / TWMap.map.scale[0],
            height: TWMap.map.size[1] / TWMap.map.scale[1]
        }
    }
    ,
    this.getViewport = function() {
        return {
            top_left_tile: {
                coord_x: this.viewport[0],
                coord_y: this.viewport[1]
            },
            bottom_right_tile: {
                coord_x: this.viewport[2],
                coord_y: this.viewport[3]
            }
        }
    }
    ,
    this.recalcViewport = function() {
        var e = this.pos[0]
          , t = this.pos[1]
          , i = this.coordByPixel(e, t)
          , e = this.coordByPixel(e + this.size[0], t + this.size[1]);
        this.viewport = [i[0], i[1], e[0], e[1]]
    }
    ,
    this.inViewport = function(e, t) {
        return e >= this.viewport[0] && t >= this.viewport[1] && e <= this.viewport[2] && t <= this.viewport[3]
    }
    ,
    this.createMover = function(e) {
        this.mover = new FreeMapMover(this),
        this.mover.setSpeed(e)
    }
    ,
    this.reload = function(e, t) {
        if (!t) {
            for (var i in this._loadedSectors)
                this._loadedSectors.hasOwnProperty(i) && this._loadedSectors[i].despawn(!0);
            this._loadedSectors = {}
        }
        this._visibleSectors = {},
        this.handler.onReload && this.handler.onReload(),
        !1 !== e && (t = this.pos[0],
        e = this.pos[1],
        this.pos = [0, 0],
        this.setPosPixel(t, e))
    }
    ,
    this._resizeElements = [],
    this._resizeTargetPosition = [],
    this.resize = function(e, t, i) {
        void 0 === e && (e = (o = $(this.el.root).parent()).width(),
        t = o.height());
        var s, o = [[], []], n = this.getCenter();
        2 & i || (o[0].push(this.el.root),
        o[1].push(this.el.root)),
        this.handler.hasOwnProperty("getResizableElements") && (s = this.handler.getResizableElements(),
        o[0] = o[0].concat(s[0]),
        o[1] = o[1].concat(s[1])),
        this.size = [e, t],
        this.handler.hasOwnProperty("onResize") && this.handler.onResize(e, t),
        1 & i ? ($(o[0]).animate({
            width: e + "px"
        }, {
            duration: 400,
            queue: !1
        }),
        $(o[1]).animate({
            height: t + "px"
        }, {
            duration: 400,
            queue: !1
        })) : ($(o[0]).width(e),
        $(o[1]).height(t)),
        2 & i || (this.centerPos(n[0], n[1], !1),
        this.recalcViewport())
    }
    ,
    this._lastResizeSize = 0,
    this.createResizer = function(e, t, i) {
        i = i || 1,
        $(this.el.root).resizable({
            grid: [i * this.scale[0], i * this.scale[1]],
            minWidth: e[0] * this.scale[0],
            maxWidth: t[0] * this.scale[0],
            minHeight: e[1] * this.scale[1],
            maxHeight: t[1] * this.scale[1],
            handles: "se",
            zIndex: 13,
            start: $.proxy(function(e, t) {
                this.handler.hasOwnProperty("onResizeBegin") && this.handler.onResizeBegin(),
                TWMap.busy = !0,
                this._resizeTargetPosition = this.getCenter()
            }, this),
            stop: $.proxy(function() {
                TWMap.busy = !1,
                this.centerPos(this._resizeTargetPosition[0], this._resizeTargetPosition[1], !1),
                this.handler.hasOwnProperty("onResizeEnd") && this.handler.onResizeEnd()
            }, this)
        }).resize($.proxy(function() {
            var e = $(this.el.root)
              , t = 1e5 * e.width() + e.height();
            t != this._lastResizeSize && (this._lastResizeSize = t,
            this.resize(e.width(), e.height(), 2),
            this.pos = [0, 0],
            this.centerPos(this._resizeTargetPosition[0], this._resizeTargetPosition[1], !1),
            this.recalcViewport())
        }, g))
    }
    ,
    this.effects = {
        beaconVillage: function(e, t) {
            var i, s, o;
            TWMap.map.inViewport(e, t) && (i = $('<div class="center_beacon"></div>'),
            s = $('<div class="map_beacon_container"></div>'),
            o = (e - (e = TWMap.map.getViewport().top_left_tile).coord_x + .5) * TWMap.tileSize[0],
            t = (t - e.coord_y + .5) * TWMap.tileSize[1],
            s.css({
                top: t + "px",
                left: o + "px"
            }).append(i),
            $("#special_effects_container").append(s),
            setTimeout(function() {
                Modernizr.cssanimations && i.addClass("end"),
                setTimeout(function() {
                    s.remove()
                }, 600)
            }, 100))
        }
    },
    !0
}
function FreeMapMover(e) {
    this.moveDirty = !1,
    this.allowDrag = !0,
    this.dragHandler = null,
    this.dragBeginHandler = null,
    this.dragEndHandler = null,
    this.dragBeginPosition = [],
    this.fixTouchEvent = function(e) {
        return e.changedTouches && (e.clientX = e.changedTouches[0].clientX,
        e.clientY = e.changedTouches[0].clientY,
        e.pageX = e.changedTouches[0].pageX,
        e.pageY = e.changedTouches[0].pageY),
        e
    }
    ,
    this.handleMouseDown = function(e) {
        if (null != this.touchIdentifier)
            return e.preventDefault(),
            !1;
        var t;
        (e = this.fixTouchEvent(e)).changedTouches && (this.touchIdentifier = e.changedTouches[0].identifier),
        this.containerPos = [-(parseInt(this._map.el.container.style.left) - this._map.bias), -(parseInt(this._map.el.container.style.top) - this._map.bias)],
        this.mousePos = [e.clientX, e.clientY],
        this.moveDirty = !1,
        this.crappy_browser ? (this._el.setCapture(),
        this._el.attachEvent("onmousemove", this._eventHandleMouseMove),
        this._el.attachEvent("onmouseup", this._eventHandleMouseUp),
        this._el.attachEvent("onlosecapture", this._eventHandleMouseUp)) : (window.addEventListener("touchmove", this._eventHandleMouseMove, !0),
        window.addEventListener("mousemove", this._eventHandleMouseMove, !0),
        window.addEventListener("touchend", this._eventHandleMouseUp, !0),
        window.addEventListener("mouseup", this._eventHandleMouseUp, !0),
        e.preventDefault()),
        !1 !== this.useDragTimer && ((t = this).dragTimer = setInterval(function() {
            t.IEDragTimer()
        }, this.useDragTimer),
        this.dragBeginPosition = [e.clientX, e.clientY],
        this.lastMousePositionForTimer = [e.clientX, e.clientY])
    }
    ,
    this.handleMouseUp = function(e) {
        var t;
        return e.changedTouches && e.changedTouches[0].identifier != this.touchIdentifier || (this.touchIdentifier = null,
        this.crappy_browser ? (this._el.releaseCapture(),
        this._el.detachEvent("onmousemove", this._eventHandleMouseMove),
        this._el.detachEvent("onmouseup", this._eventHandleMouseUp),
        this._el.detachEvent("onlosecapture", this._eventHandleMouseUp)) : (window.removeEventListener("touchmove", this._eventHandleMouseMove, !0),
        window.removeEventListener("mousemove", this._eventHandleMouseMove, !0),
        window.removeEventListener("touchend", this._eventHandleMouseMove, !0),
        window.removeEventListener("mouseup", this._eventHandleMouseUp, !0)),
        !1 !== this.useDragTimer && (clearInterval(this.dragTimer),
        this.dragTimer = void 0),
        this.moveDirty && (this.allowDrag && this._map.handler.hasOwnProperty("onDragEnd") ? this._map.handler.onDragEnd() : this.dragEndHandler && this.dragEndHandler()),
        !this.moveDirty && e.changedTouches && this._map.handler.onClick && (e = this.fixTouchEvent(e),
        (t = {}).pageX = e.changedTouches[0].pageX,
        t.pageY = e.changedTouches[0].pageY,
        t = this._map.coordByEvent(t),
        e.stopPropagation(),
        this._map.handler.onClick(t[0], t[1])),
        setTimeout(jQuery.proxy(function() {
            this.moveDirty = !1
        }, this), 50),
        e.returnValue = !1,
        e.preventDefault && e.preventDefault()),
        !1
    }
    ,
    this.IEDragTimer = function() {
        var e = {
            clientX: this.lastMousePositionForTimer[0],
            clientY: this.lastMousePositionForTimer[1]
        };
        0 == e.clientX && 0 == e.clientY || this.handleMouseMove(e, !0)
    }
    ,
    navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ? this.useDragTimer = 100 : $.browser.webkit | $.browser.safari || $.browser.mozilla ? this.useDragTimer = 40 : !$.browser.msie && $.browser.opera ? this.useDragTimer = 30 : this.useDragTimer = 60,
    this.handleMouseMove = function(e, t) {
        if (!e.changedTouches || e.changedTouches[0].identifier == this.touchIdentifier) {
            if (e = this.fixTouchEvent(e),
            !1 !== this.useDragTimer && void 0 === t)
                return !(this.lastMousePositionForTimer = [e.clientX, e.clientY]);
            var i, s, t = [e.clientX - this.mousePos[0], e.clientY - this.mousePos[1]], e = (this.mousePos = [e.clientX, e.clientY],
            [this.containerPos[0] - t[0] * this._speed, this.containerPos[1] - t[1] * this._speed]);
            this._map.handler.scrollBound && (i = this._map.handler.scrollBound,
            (s = this._map.coordByPixel(e[0], e[1], !0))[0] < i.x_min && 0 < t[0] && (t[0] = 0),
            s[1] < i.y_min && 0 < t[1] && (t[1] = 0),
            (s = this._map.coordByPixel(e[0] + this._map.size[0], e[1] + this._map.size[1]))[0] > i.x_max && t[0] < 0 && (t[0] = 0),
            s[1] > i.y_max) && t[1] < 0 && (t[1] = 0),
            0 == t[0] && 0 == t[1] || 0 != this.moveDirty || (this.allowDrag && this._map.handler.onDragBegin ? this._map.handler.onDragBegin() : this.dragBeginHandler && this.dragBeginHandler(),
            this.moveDirty = !0),
            this.allowDrag ? (this.containerPos[0] -= t[0] * this._speed,
            this.containerPos[1] -= t[1] * this._speed,
            this._map.setPosPixel(this.containerPos[0], this.containerPos[1])) : this.moveDirty && this.dragHandler && this.dragHandler(this.dragBeginPosition, this.mousePos, t)
        }
        return !1
    }
    ,
    this.setSpeed = function(e) {
        this._speed = e
    }
    ,
    this.preventDrag = function(e, t, i) {
        !0 === e || !1 === e ? (this.allowDrag = !e,
        this.dragHandler = null,
        this.dragEndHandler = null,
        $(this._el).css("cursor", "move")) : (this.allowDrag = !1,
        this.dragHandler = e,
        this.dragBeginHandler = t,
        this.dragEndHandler = i,
        $(this._el).css("cursor", "default"))
    }
    ;
    var t = document.createElement("div")
      , i = (t.setAttribute("id", e.el.root.id + "_mover"),
    $(t).addClass("needsclick"),
    $(t).attr("style", 'position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 12; background-image: url("/graphic/map/empty.png"); cursor: move; -moz-user-select: none;'),
    this.crappy_browser = t.setCapture && t.detachEvent,
    this);
    this._eventHandleMouseDown = function(e) {
        return i.handleMouseDown(e)
    }
    ,
    this._eventHandleMouseMove = function(e) {
        return i.handleMouseMove(e)
    }
    ,
    this._eventHandleMouseUp = function(e) {
        return i.handleMouseUp(e)
    }
    ,
    this._speed = 1,
    this.crappy_browser ? t.attachEvent("onmousedown", this._eventHandleMouseDown) : (t.addEventListener("touchstart", this._eventHandleMouseDown, !0),
    t.addEventListener("mousedown", this._eventHandleMouseDown, !0)),
    this._map = e,
    this._el = t,
    e.el.mover = t,
    e.el.root.appendChild(t)
}
function compareCoord(e, t) {
    return e[0] == t[0] && e[1] == t[1]
}

;var TWMap = {
    map: null,
    minimap: null,
    minimap_only: !1,
    minimap_highlight: 0,
    mobile: !1,
    fullscreen: !1,
    cachePopupContents: !1,
    minimap_cache_stamp: 0,
    mapSubSectorSize: 5,
    urls: {},
    colors: {},
    classic_gfx: !1,
    old_map_gfx: !1,
    graphics: null,
    image_base: null,
    images: [],
    ghost_village_tile: 51,
    selected_village: null,
    scriptMode: !1,
    attackPlannerMode: !1,
    attackPlannerGeneration: 0,
    villages: {},
    villageKey: {},
    players: {},
    allies: {},
    ghost: !1,
    playerColors: {},
    allyColors: {},
    villageColors: {},
    villageIcons: {},
    commandIcons: {},
    troop_templates: {},
    current_units: {},
    command_hash: [],
    troop_template_id: 0,
    troop_template_command: "",
    allyRelations: {},
    reservations: {},
    friends: {},
    targets: [],
    pos: [],
    size: [0, 0],
    isAutoSize: !1,
    minimap_offset: [0, 0],
    minimap_size: [0, 0],
    currentCon: null,
    currentVillage: null,
    scrollBound: {
        x_min: 0,
        x_max: 999,
        y_min: 0,
        y_max: 999
    },
    keys: {},
    ignore_villages: [],
    non_attackable_players: null,
    non_attackable_villages: null,
    attackable_special_villages: null,
    goFullscreen: function() {
        if (!TWMap.premium)
            return !1;
        var e = document.getElementById("map_wrap")
          , a = "fullscreenchange mozfullscreenchange webkitfullscreenchange";
        if (e.requestFullScreen)
            e.requestFullScreen();
        else if (e.mozRequestFullScreen)
            e.mozRequestFullScreen();
        else {
            if (!e.webkitRequestFullScreen)
                return !1;
            e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        }
        $(document).bind(a, function() {
            var e = TWMap.size;
            TWMap.fullscreen = !0,
            TWMap.resize(0, !1),
            $("#map_popup").detach().appendTo("#map_wrap"),
            $("#minimap").detach().appendTo("#map_wrap"),
            $("#fullscreen").hide(),
            $(document).unbind(a).bind(a, function() {
                $("#map_popup").detach().appendTo($("body")),
                $("#minimap").detach().appendTo($("#minimap_cont")),
                $("#fullscreen").show(),
                TWMap.resize(e, !0),
                TWMap.fullscreen = !1,
                $(document).unbind(a)
            })
        })
    },
    showEmbeddedMap: function(e, a, i, t, n) {
        TWMap.minimap_only = !0,
        TWMap.tileSize = [53, 28],
        TWMap.topoKey = e,
        TWMap.minimap_highlight = n,
        TWMap.minimap_cache_stamp = a || 0,
        TWMap.init(),
        TWMap.focus(i, t, !1)
    },
    storeSectorInformation: function(e) {
        for (var a = 0; a < e.length; a++) {
            var i = e[a]
              , t = i.data
              , n = t.x
              , t = t.y;
            TWMap.storeVillage.set(n, t, i.data),
            i.tiles && TWMap.storeTiles.set(n, t, i.tiles),
            0
        }
    },
    mapHandler: {
        _waitingSectors: {},
        onReceiveSectorInformation: function(e, a) {
            a || TWMap.storeSectorInformation(e);
            for (var i = 0; i < e.length; i++) {
                var t = e[i]
                  , n = t.data
                  , o = n.x
                  , s = n.y
                  , l = this._waitingSectors[o + "_" + s];
                if (l) {
                    t.tiles && (l.tiles = t.tiles),
                    l.x = o,
                    l.y = s;
                    var p, r, c, m, u = [];
                    for (p in (l.data = n).villages)
                        if (n.villages.hasOwnProperty(p))
                            for (var d in p = parseInt(p),
                            n.villages[p])
                                n.villages[p].hasOwnProperty(d) && (d = parseInt(d),
                                0 === (m = n.villages[p][d])[2] && m[8] ? m[2] = _("0bf7975983a90288f809600303ae52cc") : 0 === m[2] && (m[2] = _("acd537450651fef7501d8f80cb075fa3")),
                                -1 == $.inArray(m[0], TWMap.ignore_villages)) && (TWMap.villageKey[m[0]] = d = 1e3 * (o + p) + s + d,
                                TWMap.villages[d] = {
                                    id: m[0],
                                    img: m[1],
                                    name: m[2],
                                    points: m[3],
                                    owner: m[4],
                                    mood: m[5],
                                    bonus: m[6],
                                    event_special: m[7],
                                    xy: d,
                                    bonus_id: m[8],
                                    owner_text: m[9],
                                    type: m[10],
                                    ally_id: m[11],
                                    skin_img: m[12]
                                },
                                u.push(m[0]));
                    for (r in n.players)
                        n.players.hasOwnProperty(r) && (m = n.players[r],
                        TWMap.players[r] = {
                            name: m[0],
                            points: m[1],
                            ally: m[2],
                            newbie: m[3],
                            sleep: m[4],
                            image_id: m[5],
                            village_count_text: m[6]
                        });
                    for (c in n.allies)
                        n.allies.hasOwnProperty(c) && (m = n.allies[c],
                        TWMap.allies[c] = {
                            name: m[0],
                            points: m[1],
                            tag: m[2],
                            image_id: m[3]
                        });
                    for (var h = 0; h < l.queue.length; h++)
                        l.queue[h].loaded = !0,
                        this.spawnSector(l, l.queue[h]);
                    delete this._waitingSectors[o + "_" + s]
                }
            }
        },
        getSectorIdByTile: function(e, a) {
            return e - e % 20 + "_" + (a - a % 20)
        },
        getSubsectorIdByTile: function(e, a) {
            return Math.floor(e / 5) + "_" + Math.floor(a / 5)
        },
        loadSectors: function(e) {
            for (var a = [], i = 0; i < e.length; i++) {
                var t = e[i]
                  , n = t.x - t.x % 20
                  , o = t.y - t.y % 20
                  , s = n + "_" + o;
                (p = this._waitingSectors[s]) ? p.queue.push(t) : (this._waitingSectors[s] = p = {
                    id: s,
                    x: n,
                    y: o,
                    tiles: null,
                    data: null,
                    queue: [t]
                },
                a.push(p))
            }
            if (!(a.length < 1)) {
                this._sector_request_queue = [];
                for (i = 0; i < a.length; i++)
                    (p = a[i]).tiles = TWMap.storeTiles.get(p.x, p.y),
                    p.data = TWMap.storeVillage.get(p.x, p.y),
                    null !== p.data && null !== p.tiles ? this.onReceiveSectorInformation([p], !0) : this._sector_request_queue.push(p);
                if (0 < this._sector_request_queue.length) {
                    for (var l = "/map.php?v=2&locale=" + window.game_data.locale + "&e=" + (new Date).getTime(), i = 0; i < this._sector_request_queue.length; i++) {
                        var p, r = 0;
                        null === (p = this._sector_request_queue[i]).tiles && (r += 1),
                        l += "&" + p.id + "=" + r
                    }
                    $.ajax({
                        type: "GET",
                        url: l,
                        dataType: "json",
                        success: function(e) {
                            return TWMap.mapHandler.onReceiveSectorInformation(e, !1)
                        }
                    }),
                    this._sector_request_queue = []
                }
            }
        },
        onMovePixel: function(e, a) {
            this.busy || TWMap.positionMinimap(),
            TWMap.minimap_only || (e -= TWMap.map.bias,
            a -= TWMap.map.bias,
            TWMap.map_el_coordy.style.top = -a + "px",
            TWMap.map_el_coordx.style.left = -e + "px",
            TWMap.context.hide(),
            TWMap.home.updateDisplay())
        },
        onMove: function(e, a) {
            if (TWMap.pos = [e, a],
            !TWMap.minimap_only) {
                for (var i = Math.min(1e3, a + 20), t = Math.max(0, a - 20); t < i; t++)
                    TWMap._coord_el_y_active[t] || (TWMap._coord_el_y_active[t] = !0,
                    TWMap.map_el_coordy.appendChild(TWMap._coord_el_y[t]));
                for (var n = Math.min(1e3, e + 20), o = Math.max(0, e - 20); o < n; o++)
                    TWMap._coord_el_x_active[o] || (TWMap._coord_el_x_active[o] = !0,
                    TWMap.map_el_coordx.appendChild(TWMap._coord_el_x[o]));
                TWMap.busy || (TWMap.busy = !0,
                TWMap.updateContinent(),
                TWMap.busy = !1)
            }
        },
        onDragBegin: function() {
            TWMap.popup.unregister()
        },
        onDragEnd: function() {
            TWMap.popup.register()
        },
        onClick: function(e, a, i) {
            var t = TWMap.villages[1e3 * e + a];
            if (t)
                if (TWMap.troop_template_command) {
                    var n = Object.create(TWMap.current_units);
                    if ("all" != TWMap.troop_template_id) {
                        var o, s = TWMap.troop_templates[TWMap.troop_template_id];
                        for (o in n)
                            n[o] = s[o];
                        s.use_all.forEach(function(e) {
                            n[e] = TWMap.current_units[e]
                        })
                    }
                    var l = {
                        template_id: TWMap.troop_template_id,
                        source_village: TWMap.currentVillage,
                        x: e,
                        y: a,
                        input: ""
                    }
                      , l = $.extend(l, n)
                      , p = ("attack" == TWMap.troop_template_command ? l.attack = 1 : "support" == TWMap.troop_template_command && (l.support = 1),
                    l[TWMap.command_hash[0]] = TWMap.command_hash[1],
                    function(e) {
                        e.preventDefault();
                        e = $("#command-data-form").serializeArray();
                        TribalWars.post("place", {
                            ajaxaction: "popup_command"
                        }, e, function(e) {
                            Dialog.close(),
                            UI.SuccessMessage(e.message);
                            for (var a, i = 0; i < CommandPopup.command_sent_hooks.length; i++)
                                CommandPopup.command_sent_hooks[i](e);
                            for (a in n)
                                TWMap.current_units[a] -= n[a]
                        })
                    }
                    );
                    TribalWars.post("place", {
                        village: TWMap.currentVillage,
                        ajax: "confirm"
                    }, l, function(e) {
                        Dialog.show("confirm_attack", e.dialog),
                        $("#command-data-form").on("submit", p),
                        $("#troop_confirm_back").on("click", CommandPopup.goBack)
                    })
                } else {
                    if (1 < TWMap.attackPlannerMode)
                        return AttackPlanner.onVillageClicked(t.id, e, a),
                        !1;
                    if (!TWMap.context.enabled)
                        return (!i || $.browser.msie && ~~$.browser.version < 8) && (window.location.href = TWMap.urls.villageInfo.replace(/__village__/, t.id)),
                        !0;
                    premium && TWMap.church.possible_displayed && (MapCanvas.selected_x = e,
                    MapCanvas.selected_y = a,
                    TWMap.selected_village = t.id,
                    TWMap.reload(!1)),
                    premium && TWMap.relics.possible_displayed && (MapCanvas.relic_selected_x = e,
                    MapCanvas.relic_selected_y = a,
                    TWMap.reload(!1)),
                    TWMap.context.spawn(t, e, a)
                }
            else
                TWMap.context.hide(),
                premium && TWMap.church.possible_displayed && (MapCanvas.selected_x = null,
                MapCanvas.selected_y = null,
                TWMap.selected_village = null,
                TWMap.reload(!1)),
                premium && TWMap.relics.possible_displayed && (MapCanvas.relic_selected_x = null,
                MapCanvas.relic_selected_y = null,
                TWMap.reload(!1));
            return !1
        },
        onReload: function() {
            this._waitingSectors = {},
            TWMap.allies = {},
            TWMap.villages = {}
        },
        _createBorder: function(e) {
            var a = document.createElement("div");
            return a.className = e ? "map_con_border" : "map_border",
            TWMap.night && !TWMap.classic_gfx && (a.className += "_night"),
            a.style.zIndex = "3",
            a.style.position = "absolute",
            a
        },
        spawnSector: function(e, a) {
            alert("Missing spawnSector function!")
        }
    },
    minimapHandler: {
        loadSector: function(e) {
            var a = document.createElement("img")
              , i = (a.style.position = "absolute",
            a.style.zIndex = "1",
            game_data && game_data.village && game_data.village.id,
            TWMap.church.displayed ? 1 : 0)
              , t = TWMap.church.possible_displayed ? 1 : 0
              , n = TWMap.church.levels
              , o = 1 === TWMap.attackPlannerMode ? 1 + TWMap.attackPlannerGeneration : 0
              , i = {
                page: "topo_image",
                player_id: game_data.player.id,
                x: e.x,
                y: e.y,
                church: i,
                possible_church: t,
                attack_planner: o,
                watchtower: TribalWars._settings.map_show_watchtower ? 1 : 0,
                key: TWMap.topoKey,
                cur: game_data.village.id,
                focus: TWMap.minimap_highlight,
                local_cache: TWMap.minimap_cache_stamp,
                church_levels: n,
                relics: TribalWars._settings.topo_show_relics ? 1 : 0
            };
            TWMap.relics.is_new_system && (t = TWMap.relics.options || {},
            i.relic_current_village = t.current_village ? 1 : 0,
            i.relic_all = t.all ? 1 : 0,
            i.relic_possible = t.possible ? 1 : 0,
            i.relic_qualities = t.qualities || []),
            game_data && game_data.village && (i.village_id = game_data.village.id),
            null != TWMap.selected_village && (i.selected = TWMap.selected_village),
            a.setAttribute("src", "/page.php?" + $.param(i)),
            e.appendElement(a, 0, 0)
        },
        onMovePixel: function(e, a) {
            TWMap.busy || (TWMap.busy = !0,
            TWMap.map && (e = e / TWMap.minimap.scale[0] + TWMap.minimap_offset[0],
            a = a / TWMap.minimap.scale[1] + TWMap.minimap_offset[1],
            TWMap.map.setPos(e, a),
            TWMap.home.updateDisplay()),
            TWMap.updateContinent(),
            TWMap.busy = !1)
        },
        onClick: function(e, a, i) {
            TWMap.focus(e, a)
        }
    },
    positionMinimap: function() {
        var e;
        this.minimap && (e = this.busy,
        this.busy = !0,
        this.minimap.setPos(this.map.pos[0] / this.map.scale[0] - this.minimap_offset[0], this.map.pos[1] / this.map.scale[1] - this.minimap_offset[1]),
        this.busy = e)
    },
    updateCommandIcon: function(e, a, i) {
        var t = this.mapHandler.getSubsectorIdByTile(e.x, e.y);
        if (void 0 !== this.map._loadedSectors[t]) {
            void 0 === this.commandIcons[e.id] && (this.commandIcons[e.id] = []);
            var n = this.commandIcons[e.id]
              , n = $.grep(n, function(e) {
                return e.img !== a
            });
            i && n.push({
                img: a
            }),
            this.commandIcons[e.id] = n,
            $(this.map._loadedSectors[t]._element_root).find("[id*=map_cmdicons_" + e.id + "]").remove();
            for (var o = this.generateCommandIcons(e.id), s = e.x % 5, l = e.y % 5, p = 0; p < o.length; p++)
                this.map._loadedSectors[t].appendElement(o[p], s, l)
        }
    },
    generateCommandIcons: function(e) {
        var a = [];
        if (TWMap.commandIcons[e])
            for (var i = TWMap.commandIcons[e], t = (i.length,
            2 * (Math.max(2, i.length) - 2)), n = 14 - t, o = 0; o < i.length; o++) {
                var s = document.createElement("img");
                s.style.position = "absolute",
                s.style.right = "0px",
                s.style.zIndex = "4",
                s.style.width = n + "px",
                s.style.height = n + "px",
                s.style.marginTop = "0px",
                s.style.marginLeft = 34 + 2 * t - o * (5 + n - t) + "px",
                s.id = "map_cmdicons_" + e + "_" + o,
                s.src = TWMap.image_base + "/map/" + i[o].img + ".png",
                a.push(s)
            }
        return a
    },
    createVillageIcons: function(e) {
        if (TWMap.minimap_only)
            return [];
        var t = []
          , a = 0;
        if (TWMap.villageIcons[e.id]) {
            var i, n, o, s = TWMap.villageIcons[e.id];
            for (i in s)
                s.hasOwnProperty(i) && (n = s[i],
                a++,
                (o = document.createElement("img")).style.position = "absolute",
                o.style.top = "0px",
                o.style.left = "0px",
                o.style.width = "18px",
                o.style.height = "18px",
                o.style.zIndex = "4",
                o.style.marginTop = "18px",
                o.style.marginLeft = 20 * a - 20 + "px",
                o.id = "map_icons_" + e.id,
                o.style.backgroundColor = n.c,
                o.src = n.img || TWMap.image_base + "/blank-16x22.png",
                t.push(o))
        }
        TWMap.reservations.hasOwnProperty(e.id) && (a++,
        (o = document.createElement("img")).style.position = "absolute",
        o.style.top = "0px",
        o.style.left = "0px",
        o.style.width = "18px",
        o.style.height = "18px",
        o.style.zIndex = "4",
        o.style.marginTop = "18px",
        o.style.marginLeft = 20 * a - 20 + "px",
        o.src = "/graphic/map/reserved_" + TWMap.reservations[e.id] + ".png",
        t.push(o));
        var l, p = this.generateCommandIcons(e.id);
        return $(p).each(function() {
            t.push(this)
        }),
        TWMap.attackPlannerMode && (p = AttackPlanner.getMapInfo())[e.id] && (l = 0,
        $.each(p[e.id].type, function(e, a) {
            if (a) {
                var i = document.createElement("img");
                switch (i.style.position = "absolute",
                i.style.zIndex = "10",
                l) {
                case 0:
                default:
                    i.style.marginTop = "0px",
                    i.style.marginLeft = "0px";
                    break;
                case 1:
                    i.style.marginTop = "20px",
                    i.style.marginLeft = "0px";
                    break;
                case 2:
                    i.style.marginTop = "0px",
                    i.style.marginLeft = "35px";
                    break;
                case 3:
                    i.style.marginTop = "20px",
                    i.style.marginLeft = "35px"
                }
                i.src = TWMap.image_base + "/icons/attack_planner_" + e + ".png",
                t.push(i),
                l++
            }
        })),
        t
    },
    createVillageDot: function(e) {
        var a, i = document.createElement("canvas");
        return i.getContext ? (i.style.position = "absolute",
        i.style.left = "0px",
        i.style.top = "0px",
        i.width = 18,
        i.height = 18,
        i.style.zIndex = "4",
        i.style.marginTop = "0px",
        i.style.marginLeft = "0px",
        (a = i.getContext("2d")).fillStyle = "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")",
        a.strokeStyle = "#000000",
        a.beginPath(),
        a.arc(5, 5, 3.3, 0, 2 * Math.PI, !1),
        a.fill(),
        a.stroke(),
        i) : ((a = document.createElement("img")).style.position = "absolute",
        a.style.left = "0px",
        a.style.top = "0px",
        a.style.width = "6px",
        a.style.height = "6px",
        a.style.zIndex = "4",
        a.style.marginTop = "3px",
        a.style.marginLeft = "0px",
        a.style.border = "0px",
        a.style.backgroundColor = "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")",
        a)
    },
    updateContinent: function() {
        var e = TWMap.con.continentByXY(TWMap.pos[0], TWMap.pos[1]);
        e != TWMap.currentCon && ($("#continent_id").html(e),
        TWMap.currentCon = e)
    },
    getMinimapScrollBound: function() {
        var e = $.extend({}, this.scrollBound);
        return e.x_min -= this.minimap_offset[0],
        e.y_min -= this.minimap_offset[1],
        e.x_max += this.minimap_size[0] - this.minimap_offset[0] - this.size[0],
        e.y_max += this.minimap_size[1] - this.minimap_offset[1] - this.size[1],
        e
    },
    initMap: function() {
        alert("Missing initMap function!")
    },
    focus: function(e, a) {
        alert("Missing focus function!")
    },
    init: function() {
        this.church.optionToggle = new MapToggleBox({
            id: "church_options"
        }),
        this.relics.is_new_system && (this.relics.influence_toggle = new MapToggleBox({
            id: "relic_influence_options",
            visible: this.relics.displayed
        }),
        this.relics.possible_toggle = new MapToggleBox({
            id: "relic_possible_options",
            visible: this.relics.possible_displayed
        }),
        this.relics.initListeners()),
        this.storeVillage = new TWMapStore(3,30),
        this.storeTiles = new TWMapStore(6,86400),
        this.sectorPrefech && (this.storeSectorInformation(this.sectorPrefech),
        this.sectorPrefech = null),
        this.initMap(),
        TWMap.premium && (document.body.requestFullScreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen) && $("#fullscreen").show(),
        TWMap.updateContinent();
        var e = window.location.hash.match(/^#([0-9]+);([0-9]+)$/);
        TWMap.map && null !== e && setTimeout(function() {
            TWMap.map.centerPos(e[1], e[2])
        }, 100),
        setInterval(function() {
            var e = "#" + TWMap.pos[0] + ";" + TWMap.pos[1];
            e != window.location.hash && window.location.replace(e)
        }, 200),
        TWMap.map && null != game_data.village.id ? (TWMap.home.init(),
        TWMap.home_aura.init()) : TWMap.home.active = !1,
        Connection.registerObserver("map", this.synchronizer),
        Connection.enqueueHandler("units_arrived", function(e) {
            if (e.village_id == TWMap.currentVillage)
                for (var a in e.unit_count) {
                    var i = e.unit_count[a];
                    TWMap.current_units[a] = parseInt(TWMap.current_units[a]) + i
                }
        })
    },
    focusSubmit: function() {
        var e = ~~$("#mapx").val()
          , a = ~~$("#mapy").val();
        return this.focusUserSpecified(e, a),
        !1
    },
    focusUserSpecified: function(e, a) {
        return this.focus(e, a),
        TWMap.map && TWMap.map.effects.beaconVillage(e, a),
        !1
    },
    scrollBlock: function(e, a) {
        alert("scrollBlock function missing")
    },
    updateSizeSelect: function(e, a, i) {
        e[0] == e[1] && (a = $(a).find('option[value="' + e[0] + '"]')) && 0 < a.length ? (a.attr("selected", "selected"),
        $(i).hide()) : (a = e[0] + "x" + e[1],
        $(i).show().val(a).text(a).attr("selected", "selected"))
    },
    notifyMapSize: function(e, a) {
        var i = this.size.join("x")
          , t = this.minimap_size.join("x")
          , n = i + "-" + t;
        TWMap._lastNotifiedMapsize != n && (TWMap._lastNotifiedMapsize = n,
        this.updateSizeSelect(TWMap.size, "#map_chooser_select", "#current-map-size"),
        this.updateSizeSelect(TWMap.minimap_size, "#minimap_chooser_select", "#current-minimap-size"),
        mobile || TWMap.fullscreen ? e ? $.cookie("mobile_mapsize", 0, {
            expires: 7
        }) : $.cookie("mobile_mapsize", i, {
            expires: 7
        }) : $.ajax({
            url: this.urls.sizeSave,
            data: "map_size=" + i + "&minimap_size=" + t,
            type: "GET",
            success: function() {
                a && window.location.reload()
            }
        }))
    },
    scaleMinimap: function() {
        var e = [~~(this.minimap.size[0] / this.minimap.scale[0]), ~~(this.minimap.size[1] / this.minimap.scale[1])]
          , a = this.map ? [~~(this.map.size[0] / this.map.scale[0]), ~~(this.map.size[1] / this.map.scale[1])] : [0, 0]
          , i = [~~((e[0] - a[0]) / 2), ~~((e[1] - a[1]) / 2)]
          , e = (this.minimap_offset = i,
        this.minimap_size = e,
        document.getElementById("minimap_viewport"))
          , t = a[0] * this.minimap.scale[0]
          , a = a[1] * this.minimap.scale[1]
          , t = (e.style.width = t + "px",
        e.style.height = a + "px",
        i[0] * this.minimap.scale[0])
          , a = i[1] * this.minimap.scale[1];
        e.style.left = t + "px",
        e.style.top = a + "px"
    },
    tileDimensions: function(e) {
        return [Math.ceil(e.width() / this.tileSize[0]), Math.ceil(e.height() / this.tileSize[1])]
    },
    notifySavedChanges: function() {
        UI.SuccessMessage(_("cc10973ebae83eeb2a4085216a71953a"))
    },
    CoordByXY: function(e) {
        return [~~(e / 1e3), e % 1e3]
    },
    popup: {
        enabled: !0,
        optionToggle: null,
        attackDots: ["", "/dots/green.png", "/dots/yellow.png", "/dots/red.png", "/dots/blue.png", "/dots/red_yellow.png", "/dots/red_blue.png"],
        attackMaxLoot: ["/max_loot/0.png", "/max_loot/1.png"],
        _px: 0,
        _py: 0,
        pending_village_id: null,
        pending_timeout_id: null,
        POPUP_DELAY: 100,
        init: function() {
            this.enabled = !0,
            this.optionToggle = new MapToggleBox({
                id: "popup_options"
            }),
            $("#form_map_popup").find("input").change(function() {
                TribalWars.post("map", {
                    ajaxaction: "save_map_popup"
                }, $("#form_map_popup").serialize(), function() {
                    TWMap.notifySavedChanges()
                }),
                TWMap.popup.enabled && TWMap.popup.invalidateCache()
            }),
            this._cache = {},
            this.el = $("#map_popup"),
            $(this.el).on("mousemove", function(e) {
                return TWMap.popup.handleMouseMove(e)
            }),
            this.register();
            var e = this;
            $(TWMap.map.el.root).on("mouseout", function() {
                e.hide()
            }),
            this._loadingText = $("#info_extra_info").find("td").html()
        },
        invalidateCache: function() {
            this._cache = {}
        },
        invalidateVillage: function(e) {
            delete this._cache[e],
            this._currentVillage == e && this.loadVillage(e)
        },
        receivedPopupInformation: function(e) {
            if (e[0])
                for (var a = 0; void 0 !== e[a]; a++)
                    this.receivedPopupInformationForSingleVillage(e[a]);
            else
                this.receivedPopupInformationForSingleVillage(e),
                this.calcPos()
        },
        receivedPopupInformationForSingleVillage: function(e) {
            var a, i = TWMap.villages[e.xy];
            i && (this._cache[e.id] = e,
            a = TWMap.CoordByXY(e.xy),
            this.displayForVillage(i, a[0], a[1]),
            TWMap.cachePopupContents || delete this._cache[e.id])
        },
        popupOptionsSet: function() {
            var e = $("#popup_options").find("input[type=checkbox]")
              , a = !1;
            return e.each(function() {
                1 == $(this).is(":checked") && (a = !0)
            }),
            a
        },
        _isAwayFromContext: function(e, a) {
            var i;
            return -1 == TWMap.context._curFocus || (i = TWMap.CoordByXY(TWMap.context._curFocus),
            2 <= (e = [Math.abs(e - i[0]), Math.abs(a - i[1])])[0]) || 2 <= e[1]
        },
        loadVillage: function(e) {
            e !== this.pending_village_id && this.clearTimeout(),
            this.pending_village_id = e,
            this.pending_timeout_id = setTimeout( () => {
                TribalWars.get(TWMap.urls.villagePopup.replace(/__village__/, e), {}, function(e) {
                    return TWMap.popup.receivedPopupInformation(e)
                }),
                this._cache[e] = "notanobject"
            }
            , this.POPUP_DELAY)
        },
        handleMouseMove: function(e) {
            if (this != TWMap.popup)
                return !1;
            var a = TWMap.map.coordByEvent(e)
              , i = a[0]
              , a = a[1]
              , t = TWMap.villages[1e3 * i + a];
            if (t && TWMap.map.inViewport(i, a) && this._isAwayFromContext(i, a)) {
                if (TWMap.context.hide(),
                "ghost" == t.special ? TWMap.map.el.root.href = TWMap.urls.ctx.mp_invite : TWMap.map.el.root.href = TWMap.urls.ctx.mp_info.replace(/__village__/, t.id),
                this._currentVillage = t.id,
                TWMap.map.el.mover && (TWMap.troop_template_command ? TWMap.map.el.mover.style.cursor = s("url(%1), pointer", s("/graphic/btn/%1.png", TWMap.troop_template_command)) : TWMap.map.el.mover.style.cursor = "pointer"),
                !this.enabled)
                    return !1;
                this._px = e.pageX,
                this._py = e.pageY,
                this._x != i || this._y != a ? (this.displayForVillage(t, i, a),
                this.el.addClass("map-popup-visible"),
                this._is_visible = !0) : this.calcPos()
            } else
                this.clearTimeout(),
                TWMap.map.el.mover && (e = TWMap.attackPlannerMode ? "default" : "move",
                TWMap.map.el.mover.style.cursor = TWMap.troop_template_command ? s("url(%1), %2", s("/graphic/btn/%1.png", TWMap.troop_template_command), e) : e),
                this._is_visible && (TWMap.map.el.root.href = "#",
                this.hide());
            this._x = i,
            this._y = a
        },
        displayForVillage: function(e, a, i) {
            if (this._currentVillage == e.id) {
                var t = TWMap.players[e.owner]
                  , n = {
                    bonus: null,
                    type: e.type,
                    name: e.name,
                    x: a,
                    y: i,
                    continent: TWMap.con.continentByXY(a, i),
                    points: e.points,
                    owner: null,
                    owner_image: null,
                    newbie: null,
                    ally: null,
                    ally_image: null,
                    extra: null,
                    special: null,
                    units: [],
                    units_display: {}
                };
                if (e.hasOwnProperty("special") && (n.special = e.special),
                e.bonus_id && (n.bonus = {
                    text: TWMap.bonus_data[e.bonus_id].text,
                    img: TWMap.bonus_data[e.bonus_id].image
                }),
                t && ((n.owner = t).newbie && e.owner != game_data.player.id && (n.owner.newbie_time = t.newbie),
                t.image_id && 0 < t.image_id && (n.owner_image = Format.userImageThumbURL(t.image_id)),
                a = TWMap.allies[t.ally]) && (n.ally = a).image_id && 0 < a.image_id && (n.ally_image = Format.userImageThumbURL(a.image_id)),
                this.extraInfo && TWMap.popup.popupOptionsSet()) {
                    var o = this._cache[e.id];
                    if (void 0 === o && e.id)
                        this.loadVillage(e.id),
                        n.extra = !1;
                    else if ("object" == typeof o) {
                        var s, l, p, r = {
                            total: $("#map_popup_units").is(":checked"),
                            home: $("#map_popup_units_home").is(":checked"),
                            time: $("#map_popup_units_times").is(":checked")
                        };
                        if (n.units_display.count = !1,
                        n.units_display.time = r.time && o.id != TWMap.currentVillage,
                        r.total || r.home || r.time)
                            for (var c in o.units)
                                o.units.hasOwnProperty(c) && (s = parseInt(o.units[c].count.home) + parseInt(o.units[c].count.foreign),
                                (l = r.total && 0 != s) || r.time && o.units[c].time) && (p = "",
                                l && (p = s,
                                r.home && 0 != o.units[c].count.home && (p += '<br/><span class="unit_count_home">(' + o.units[c].count.home + ")</span>"),
                                n.units_display.count = r.total),
                                n.units.push({
                                    name: c,
                                    image: o.units[c].image,
                                    time: o.units[c].time,
                                    count: p
                                }));
                        n.extra = o
                    }
                }
                $("#map_popup").html(jstpl("tpl_popup", n)),
                this.calcPos(),
                this.initTimers()
            }
        },
        calcPos: function() {
            var e = [this.el.width(), this.el.height()]
              , a = [$(window).scrollLeft() + 3, $(window).scrollTop() + 3, $(window).scrollLeft() + $(window).width() - 3, $(window).scrollTop() + $(window).height() - 3];
            a[1] += $("#topContainer").height(),
            a[3] -= $("#footer").height(),
            y = !(this._py + 15 + e[1] < a[3]) && this._py - 15 - a[1] >= e[1] ? this._py - e[1] - 15 : this._py + 15,
            x = this._px + 15,
            x -= Math.max(0, x + e[0] - a[2]),
            x = Math.max(x, $(window).scrollLeft()),
            this.el.css("left", x + "px"),
            this.el.css("top", y + "px")
        },
        initTimers: function() {
            var e = this;
            $("span.map_info_timer").on("timer_end", function() {
                e._currentVillage && e.loadVillage(e._currentVillage)
            }),
            Timing.tickHandlers.timers.initTimers("map_info_timer", null)
        },
        invalidPos: function() {
            this.el.css("left", "-2000px").css("top", "-2000px")
        },
        register: function() {
            $(TWMap.map.el.root).on("mousemove", function(e) {
                return TWMap.popup.handleMouseMove(e)
            })
        },
        unregister: function() {
            $(TWMap.map.el.root).unbind("mousemove"),
            TWMap.map.el.mover && (TWMap.map.el.mover.style.cursor = "move"),
            this.hide()
        },
        hide: function() {
            this._is_visible && (this._currentVillage = 0,
            this.el.removeClass("map-popup-visible"),
            this._x = 0,
            this._y = 0,
            this._is_visible = !1)
        },
        clearTimeout: function() {
            this.pending_timeout_id && (this.pending_village_id = 0,
            window.clearTimeout(this.pending_timeout_id),
            this.pending_timeout_id = null)
        }
    },
    reload: function(e) {
        var a = TWMap.map.pos;
        TWMap.map.reload(e = e || !1),
        TWMap.minimap.reload(e),
        TWMap.map.pos = [0, 0],
        TWMap.minimap.pos = [0, 0],
        TWMap.map.setPosPixel(a[0], a[1])
    },
    church: {
        displayed: !1,
        possible_displayed: !1,
        optionToggle: null,
        levels: [],
        enabled: 1 != $.browser.msie,
        toggle: function(e, a) {
            var i = $("#belief_radius").is(":checked")
              , t = $("#belief_radius_2").is(":checked")
              , n = [];
            $("input[name='church_level[]']:checked").each(function() {
                n.push(parseInt($(this).val()))
            }),
            $.ajax({
                url: TWMap.urls.changeShowBelief,
                data: {
                    topo_show_belief: i,
                    topo_belief_levels: n,
                    topo_church_possible: t
                },
                type: "GET",
                success: function() {
                    TWMap.notifySavedChanges(),
                    TWMap.church.levels = n
                }
            }),
            e && (t ? this.optionToggle.show() : this.optionToggle.hide()),
            (i != this.displayed || t != this.possible_displayed || t && n != this.levels) && (this.displayed = i,
            this.possible_displayed = t,
            this.levels = n,
            TWMap.reload())
        }
    },
    relics: {
        is_new_system: !1,
        displayed: !1,
        possible_displayed: !1,
        quality_info: {},
        influence_toggle: null,
        possible_toggle: null,
        options: {
            enabled: !1,
            current_village: !1,
            all: !1,
            possible: !1,
            qualities: []
        },
        readOptionsFromDom: function() {
            return {
                enabled: $("#relics_enabled").is(":checked"),
                current_village: $("#relics_current_village").is(":checked"),
                all: $("#relics_all").is(":checked"),
                possible: $("#relics_possible").is(":checked"),
                qualities: $(".relic-quality-option:checked").map(function() {
                    return $(this).data("quality")
                }).get()
            }
        },
        save: function() {
            var e = TWMap.relics.readOptionsFromDom();
            TWMap.relics.options = e,
            TribalWars._settings && (TribalWars._settings.topo_show_relics = e.enabled ? 1 : 0,
            TribalWars._settings.topo_relic_options = e),
            $.ajax({
                url: TWMap.urls.changeShowRelics,
                data: {
                    topo_relic_options: JSON.stringify(e)
                },
                type: "GET",
                success: function() {
                    TWMap.notifySavedChanges()
                }
            })
        },
        initListeners: function() {
            var e = TWMap.relics;
            e.possible_displayed = !!e.options.possible,
            e.displayed || $("#relic_influence_options").hide(),
            e.options.possible || $("#relic_possible_options").hide(),
            e.bindRelicOptions({
                mainOption: "#relics_enabled",
                section: e.influence_toggle,
                subOptions: "#relics_current_village, #relics_all",
                defaultSubOption: "#relics_current_village",
                stateKey: "displayed"
            }),
            e.bindRelicOptions({
                mainOption: "#relics_possible",
                section: e.possible_toggle,
                subOptions: ".relic-quality-option",
                defaultSubOption: '.relic-quality-option[data-quality="refined"]',
                stateKey: "possible_displayed"
            }),
            $("#relics_current_village, #relics_all, .relic-quality-option").on("change", function() {
                e.save(),
                TWMap.reload()
            })
        },
        bindRelicOptions: function(a) {
            var i = TWMap.relics;
            $(a.mainOption).on("change", function() {
                var e = $(this).is(":checked");
                e ? (a.section.show(),
                $(a.subOptions).filter(":checked").length || $(a.defaultSubOption).prop("checked", !0)) : (a.section.hide(),
                $(a.subOptions).prop("checked", !1)),
                i.save(),
                e !== i[a.stateKey] && (i[a.stateKey] = e,
                TWMap.reload())
            })
        },
        toggle: function() {
            var e = $("#relics_enabled").is(":checked");
            TribalWars.setSetting("topo_show_relics", e, function() {
                TWMap.reload(),
                TWMap.notifySavedChanges()
            })
        }
    },
    non_attackable_hide: {
        toggle: function() {
            var e = $("#non_attackable_hide").is(":checked");
            TribalWars.setSetting("map_casual_hide", e, function() {
                TWMap.reload(),
                TWMap.notifySavedChanges()
            })
        }
    },
    watchtower: {
        toggle: function() {
            var e = $("#show_watchtower").is(":checked");
            TribalWars.setSetting("map_show_watchtower", e, function() {
                TWMap.reload()
            })
        }
    },
    inline_send: {
        enabled: !1
    },
    con: {
        SEC_COUNT: 1,
        SUB_COUNT: 1,
        CON_COUNT: 1,
        continentByXY: function(e, a) {
            return Math.floor(e / (TWMap.con.SEC_COUNT * TWMap.con.SUB_COUNT)) + Math.floor(a / (TWMap.con.SEC_COUNT * TWMap.con.SUB_COUNT)) * TWMap.con.CON_COUNT
        }
    },
    context: {
        _curFocus: -1,
        _visible: !0,
        _circlePos: [[-12, -12], [-12, -49], [20, -30], [20, 6], [-11, 25], [-44, 6], [-44, -30], [20, -30], [20, 6]],
        _otherOrder: [],
        _ownOrder: [],
        _showPremium: !1,
        FATooltip: {
            init: function(e, a, i, t) {
                var e = $("#" + e)
                  , n = e.data("minspeed")
                  , o = game_data.village.coord.split("|")
                  , o = this.distance(o[0], o[1], i, t)
                  , i = this.unitsDistance(o, a, e.data("template"))
                  , t = this.calculateDuration(i, n);
                e.data("duration", t),
                e.data("has-no-units") ? e.css("opacity", .5) : e.css("opacity", 1),
                this.bind(e)
            },
            bind: function(a) {
                a.bind("mouseover", function(e) {
                    void 0 === a.data("tooltip") && (UI.ToolTip(a, {
                        bodyHandler: TWMap.context.FATooltip.create
                    }),
                    a.triggerHandler("mouseover"))
                })
            },
            create: function() {
                var e = $(this)
                  , a = e.data("tooltip-tpl")
                  , i = e.data("duration");
                return e.data("has-no-units") ? a : a + TWMap.context.FATooltip.formatDuration(i)
            },
            distance: function(e, a, i, t) {
                e -= i,
                i = a - t;
                return Math.sqrt(e * e + i * i)
            },
            unitsDistance: function(e, a, i) {
                var t = e;
                return TWMap.GreatSiege.isSiegeVillage(game_data.village.id) && (t = TWMap.GreatSiege.getTravelDistanceFromSiegeVillage(i, e)),
                t = TWMap.GreatSiege.isSiegeVillage(a) ? TWMap.GreatSiege.getTravelDistanceToSiegeVillage(i) : t
            },
            calculateDuration: function(e, a) {
                return Math.round(e / a)
            },
            formatDuration: function(e) {
                var a = Math.floor(e / 3600)
                  , i = Math.floor(e / 60) % 60
                  , e = e % 60;
                return "<span style='line-height: 20px'>" + (a + ":" + (i = i < 10 ? "0" + i : i) + ":" + (e = e < 10 ? "0" + e : e)) + "</span><br />"
            }
        },
        spawn: function(n, o, s) {
            var e = 1e3 * o + s;
            if ($("#map-ctx-buttons").attr("class", "village-type-" + n.type),
            e == this._curFocus)
                return "ghost" == n.special ? window.location.href = TWMap.urls.ctx.mp_invite : window.location.href = TWMap.urls.villageInfo.replace(/__village__/, n.id),
                !0;
            this.hide(),
            TWMap.popup.hide();
            var a = TWMap.map.pixelByCoord(o, s)
              , i = TWMap.map.pos
              , l = [a[0] - i[0], a[1] - i[1]]
              , p = (l[0] += TWMap.tileSize[0] / 2,
            l[1] += TWMap.tileSize[1] / 2,
            this)
              , r = []
              , a = []
              , c = (n.hasOwnProperty("special") ? "ghost" == n.special && (a = [null, null, "mp_invite", "mp_invite_hide"]) : a = n.owner == game_data.player.id ? this._ownOrder : this._otherOrder,
            this._circlePos);
            $(a).each(function(e, a) {
                var i, t;
                "0" == n.owner && ("mp_profile" == a || "mp_msg" == a) || !(p._showPremium || "mp_recruit" != a && "mp_fav" != a && "mp_lock" != a) || ("mp_farm_a" == a || "mp_farm_b" == a) && (!game_data.features.FarmAssistent.possible || VillageContext.send_attack_disabled || 0 < n.owner || 0 < n.event_special || "standard" !== n.type) || game_data.village.id == n.id && ("mp_res" == a || "mp_att" == a) || (0 == game_data.player.ally || "standard" !== n.type) && "mp_lock" == a || !(n.points || "mp_fav" != a && "mp_lock" != a) || !VillageContext.claim_enabled && "mp_lock" === a || "mp_res" == a && 5 == parseInt(n.event_special) || "mp_msg" === a && !VillageContext.igm_enabled || "mp_att" == a && !VillageContext.send_troops_enabled || ("mp_farm_a" != (a = "mp_fav" == (a = "mp_lock" == a && TWMap.reservations[n.id] ? "mp_unlock" : a) && -1 != jQuery.inArray(parseInt(n.id), TWMap.targets) ? "mp_unfav" : a) && "mp_farm_b" != a || TWMap.context.FATooltip.init(a, n.id, o, s),
                t = $("#" + a),
                i = parseFloat(t.css("opacity")) || 1,
                t.css("left", l[0] + c[e][0] + "px").css("top", l[1] + c[e][1] + "px").stop().css("opacity", 0).show().fadeTo(120, i),
                TWMap.urls.ctx[a] && ((t = TWMap.urls.ctx[a].replace(/__village__/, n.id).replace(/__owner__/, n.owner).replace(/__source__/, game_data.village.id)).match(/json=1/) ? p.ajaxRegister(a, t) : $("#" + a)[0].href = t,
                mobile || ("mp_att" == a ? $("#" + a).off("click").on("click", function(e) {
                    return !(1 == e.which && !e.ctrlKey && !e.shiftKey) || (TWMap.inline_send.enabled ? (TWMap.actionHandlers.command.click(n.id),
                    !1) : void 0)
                }) : "mp_res" == a && $("#" + a).off("click").on("click", function(e) {
                    return !(1 == e.which && !e.ctrlKey && !e.shiftKey) || (TWMap.inline_send.enabled ? (TWMap.actionHandlers.market.click(n.id),
                    !1) : void 0)
                }))),
                r.push(a))
            }),
            this._curFocus = e,
            this._visible = !0
        },
        ajaxRegister: function(a, i) {
            $("#" + a).unbind("click").click(function(e) {
                e.preventDefault();
                e = (new Date).getTime();
                if (!(this._last && e - this._last < 900))
                    return this._last = e,
                    TribalWars.get(i, null, function(e) {
                        TWMap.context.ajaxDone(a, e)
                    }),
                    !1
            })
        },
        ajaxDone: function(e, a) {
            this.hide();
            var i, t, n = TWMap.fullscreen ? $("#map_wrap") : null;
            switch (e) {
            case "mp_lock":
            case "mp_unlock":
                a.code ? (a.notice && UI.InfoMessage(a.notice, null, null, n),
                "mp_lock" === e ? TWMap.reservations[a.village] = "player" : delete TWMap.reservations[a.village],
                TWMap.popup.invalidateCache(),
                TWMap.reload()) : UI.ErrorMessage(a.error, null, n);
                break;
            case "mp_fav":
            case "mp_unfav":
                a.code ? "mp_fav" == e ? (UI.SuccessMessage(_("0313820c71668f1d90687f4763d945a2"), null, n),
                TWMap.targets.push(a.id)) : (UI.SuccessMessage(_("c9f785292a87add33c4be1eb55774182"), null, n),
                -1 != (i = jQuery.inArray(a.id, TWMap.targets)) && (TWMap.targets[i] = 0)) : UI.ErrorMessage(a.error, null, n);
                break;
            case "mp_farm_a":
            case "mp_farm_b":
                a.error ? UI.ErrorMessage(a.error, null, n) : a.success && (TWMap.premium && (TWMap.commandIcons[a.target_village] ? (t = !1,
                $.each(TWMap.commandIcons[a.target_village], function() {
                    if ("attack" == this.img)
                        return !(t = !0)
                }),
                t || TWMap.commandIcons[a.target_village].push({
                    img: "attack"
                })) : TWMap.commandIcons[a.target_village] = [{
                    img: "attack"
                }],
                TWMap.reload()),
                TWMap.popup.invalidateCache(),
                UI.InfoMessage(_("64ad195324ccc86d7d134532a71e9d40"), null, null, n));
                break;
            case "mp_invite_hide":
                document.location.reload()
            }
        },
        hide: function() {
            this._visible && ($(".mp").stop().fadeTo(300, 0, function() {
                TWMap.context._visible || $(".mp").hide()
            }),
            this._visible = !1,
            this._curFocus = -1)
        }
    },
    home: {
        active: !0,
        boundary: null,
        go_home: null,
        text: null,
        pointer: null,
        is_premium_account_hint_shown: !1,
        focus: function() {
            var e = game_data.village;
            TWMap.focusUserSpecified(e.x, e.y)
        },
        init: function() {
            this.active && (this.createDisplayComponents(),
            this.updateDisplay())
        },
        createDisplayComponents: function() {
            var e = $('<div id="map_go_home_boundary"></div>')
              , a = $('<div id="map_go_home"></div>')
              , i = $('<div id="map_go_home_circle"></div>')
              , t = (i.on("click", TWMap.home.focus),
            $('<div id="map_go_home_text">home</div>'))
              , t = (i.append(t),
            $('<div id="map_go_home_pointer"></div>'));
            a.append(t),
            a.append(i),
            e.append(a),
            $("#map_wrap").append(e),
            this.boundary = $("#map_go_home_boundary"),
            this.go_home = $("#map_go_home"),
            this.text = $("#map_go_home_text"),
            this.pointer = $("#map_go_home_pointer")
        },
        pointHome: function() {
            var e = game_data.village
              , a = {
                x: (a = TWMap.map.getCenter())[0],
                y: a[1]
            }
              , i = e.y - a.y
              , e = e.x - a.x
              , a = Math.atan2(i, e);
            this.pointer.css({
                transform: "rotate(" + a + "rad)"
            })
        },
        updateDistance: function() {
            var e = game_data.village
              , a = {
                x: (a = TWMap.map.getCenter())[0],
                y: a[1]
            }
              , e = Math.sqrt((e.x - a.x) * (e.x - a.x) + (e.y - a.y) * (e.y - a.y));
            this.text.text(Math.floor(e)),
            15 <= e && e < 16 && this.advertisePremiumIfNeeded()
        },
        skirt: function() {
            var e = game_data.village
              , a = {
                x: (a = TWMap.map.getCenter())[0],
                y: a[1]
            }
              , i = e.x * TWMap.map.scale[0]
              , t = e.y * TWMap.map.scale[1]
              , n = TWMap.map.pos[0] + TWMap.map.size[0] / 2
              , o = TWMap.map.pos[1] + TWMap.map.size[1] / 2
              , t = -Math.atan2(t - o, i - n)
              , o = (t < 0 && (t = 2 * Math.PI + t),
            this.getTopRightCornerAngle())
              , i = "bottom"
              , s = (t < o || t >= 2 * Math.PI - o ? i = "right" : t <= Math.PI - o ? i = "top" : t <= Math.PI + o && (i = "left"),
            {
                left: 0 + $("#map_coord_y_wrap").width(),
                top: 0,
                right: TWMap.map.size[0] - 50,
                bottom: TWMap.map.size[1] - 50 - $("#map_coord_x_wrap").height()
            })
              , l = s.left
              , p = s.top;
            switch (i) {
            case "left":
                l = s.left;
                break;
            case "right":
                l = s.right;
                break;
            case "bottom":
                p = s.bottom;
                break;
            default:
                l = s.left
            }
            "right" != i && "left" != i || (p = TWMap.map.size[1] / 2 - ("right" == i ? 1 : -1) * (Math.tan(t) * (TWMap.map.size[0] / 2)),
            p = Math.max(Math.min(p, s.bottom), s.top)),
            "top" != i && "bottom" != i || (l = TWMap.map.size[0] / 2 - ("top" == i ? 1 : -1) * (Math.tan(t + Math.PI / 2) * (TWMap.map.size[1] / 2)),
            l = e.x < a.x ? Math.max(l, s.left) : Math.min(l, s.right)),
            this.go_home.css({
                left: l + "px",
                top: p + "px"
            })
        },
        updateDisplay: function() {
            var e;
            this.active && (e = game_data.village,
            TWMap.map.inViewport(e.x, e.y) ? this.go_home.hide() : (this.go_home.show(),
            TWMap.home.updateDistance(),
            TWMap.home.pointHome(),
            TWMap.home.skirt()))
        },
        getTopRightCornerAngle: function() {
            var e = TWMap.map.size[0] / 2
              , a = TWMap.map.size[1] / 2;
            return Math.atan2(a, e)
        },
        advertisePremiumIfNeeded: function() {
            game_data.features.Premium.active || this.is_premium_account_hint_shown || this.mobile || ($(".premium_account_hint").show().css({
                display: "inline-block"
            }),
            this.is_premium_account_hint_shown = !0)
        }
    },
    home_aura: {
        center_offsets: {
            1: {
                x: 0,
                y: 3
            },
            2: {
                x: 0,
                y: 0
            },
            3: {
                x: 0,
                y: 0
            },
            4: {
                x: 0,
                y: 0
            },
            5: {
                x: 0,
                y: 0
            },
            6: {
                x: 0,
                y: 0
            }
        },
        init: function() {
            var e = game_data.village
              , a = e.x * TWMap.map.scale[0]
              , i = e.y * TWMap.map.scale[1]
              , e = TWMap.map.getLevelForVillagePoints(e.points)
              , e = this.center_offsets[e]
              , t = document.createElement("div");
            $(t).css({
                position: "absolute",
                left: a - TWMap.map.bias - (56 - TWMap.map.scale[0]) / 2 + e.x,
                top: i - TWMap.map.bias - (62 - TWMap.map.scale[1]) / 2 + e.y,
                "z-index": 4,
                width: 56,
                height: 62,
                "background-image": "url(" + image_base + "/map/home.png)"
            }),
            TWMap.map.el.container.appendChild(t)
        }
    },
    getColorByPlayer: function(e, a, i) {
        return this.players[e] && this.players[e].sleep ? TWMap.colors.sleep : i && TWMap.villageColors[i] && e != game_data.player.id ? TWMap.villageColors[i] : TWMap.playerColors[e] || (e == game_data.player.id ? TWMap.colors.player : a && TWMap.allyColors[a] ? TWMap.allyColors[a] : 0 < game_data.player.ally && a == game_data.player.ally ? TWMap.colors.ally : TWMap.allyRelations[a] ? TWMap.colors[TWMap.allyRelations[a]] : TWMap.friends[e] ? TWMap.colors.friend : TWMap.colors.other)
    },
    actionHandlers: {}
};
function TWMapStore(e, a) {
    for (var i, s = e, l = 1e3 * a, p = new Array(s), t = 0; t < s; t++)
        for (p[t] = new Array(s),
        i = 0; i < s; i++)
            p[t][i] = null;
    this.get = function(e, a) {
        var i = e / 20 % s
          , t = a / 20 % s
          , n = p[i][t]
          , o = (new Date).getTime();
        return null === n || n[0] !== e || n[1] !== a ? null : n[2] < o ? p[i][t] = null : n[3]
    }
    ,
    this.set = function(e, a, i) {
        var t = e / 20 % s
          , n = a / 20 % s
          , o = (new Date).getTime() + l;
        p[t][n] = [e, a, o, i]
    }
}
$(void (TWMap.synchronizer = {
    notify: function(e, a) {
        this.handlers.hasOwnProperty(e) && this.handlers[e](a)
    },
    handlers: {
        command_count: function(e) {
            if (!TWMap.map || !TWMap.premium)
                return !1;
            var a = 0 < e.count;
            TWMap.updateCommandIcon(e.target_village, e.command_type, a),
            TWMap.popup.invalidateVillage(e.target_village.id)
        }
    }
})),
TWMap.GreatSiege = {
    travel_dist_spy_only: null,
    travel_dist_general: null,
    _indexed_village_ids: {},
    setSiegeVillageIds: function(e) {
        for (var a = 0; a < e.length; a++) {
            var i = e[a];
            this._indexed_village_ids[i] = i
        }
    },
    setDistances: function(e, a) {
        this.travel_dist_spy_only = e,
        this.travel_dist_general = a
    },
    isSiegeVillage: function(e) {
        return void 0 !== this._indexed_village_ids[e]
    },
    getTravelDistanceToSiegeVillage: function(e) {
        for (var a = void 0 !== e.spy, i = 0; i < window.game_data.units.length; i++) {
            var t = window.game_data.units[i];
            "spy" !== t && e[t] && (a = !1)
        }
        return a ? this.travel_dist_spy_only : this.travel_dist_general
    },
    getTravelDistanceFromSiegeVillage: function(e, a) {
        return Math.max(a, this.getTravelDistanceToSiegeVillage(e))
    }
},
TWMap.actionHandlers.command = {
    click: function(e) {
        CommandPopup.openRallyPoint({
            target: e
        })
    }
},
TWMap.actionHandlers.market = {
    click: function(e) {
        TribalWars.get("market", {
            ajax: "send",
            target: e
        }, function(e) {
            Dialog.show("popup_command", e.dialog),
            $("#market-send-form").on("submit", TWMap.actionHandlers.market.sendResources),
            Dialog.queueCallWhenShown(function() {
                for (var e = document.querySelectorAll(".resources_max"), a = 0; a < e.length; a++) {
                    var i = e[a].getAttribute("name")
                      , i = document.querySelector('.insert[data-res="' + i + '"]');
                    if (i)
                        if (0 < parseInt(i.textContent.replace(/[()]/g, ""), 10)) {
                            e[a].focus();
                            break
                        }
                }
            })
        })
    },
    sendResources: function() {
        var e = $(this).serializeArray();
        return TribalWars.post("market", {
            ajax: "confirm"
        }, e, function(e) {
            Dialog.close("popup_command"),
            Dialog.show("map_market", e.dialog),
            $("#market-confirm-form").on("submit", TWMap.actionHandlers.market.confirmSendResources);
            e = document.querySelector('#market-confirm-form input[type="submit"]');
            e && e.focus()
        }),
        !1
    },
    confirmSendResources: function() {
        var e = $(this).serializeArray();
        return TribalWars.post("market", {
            ajaxaction: "map_send"
        }, e, function(e) {
            Dialog.close(),
            UI.SuccessMessage(e.message)
        }),
        !1
    }
};

;var MapCanvas = {
    box: 3,
    watchTowers: [],
    selected_x: null,
    selected_y: null,
    relic_selected_x: null,
    relic_selected_y: null,
    church_radius_colors: [[0, 0, 0], [254, 216, 177], [253, 173, 92], [252, 139, 24]],
    villages_with_relics: [],
    church_data: [],
    init: function() {
        var e;
        if (this.church_data)
            for (e = 0; e < this.church_data.length; e++)
                this.church_data[e][2] *= this.church_data[e][2]
    },
    createCanvas: function(t, e) {
        var a = document.createElement("canvas");
        if (a && a.getContext) {
            var l, r, i, s = TWMap.map.scale, h = TWMap.map.sectorSize, n = (a.id = "map_canvas_" + t.x + "_" + t.y,
            a.className = "church_radius_display",
            a.width = s[0] * h,
            a.height = s[1] * h,
            a.style.position = "absolute",
            a.style.zIndex = "10",
            t.appendElement(a, 0, 0),
            a.getContext("2d"));
            if (n.save(),
            TribalWars._settings.topo_show_relics && 0 < this.villages_with_relics.length) {
                var c = TWMap.relics.is_new_system ? game_data.village.id : null;
                for (let e = 0; e < this.villages_with_relics.length; e++) {
                    var o = this.villages_with_relics[e]
                      , u = o[4];
                    if (TWMap.relics.is_new_system) {
                        u = u == c;
                        if (!($("#relics_all").is(":checked") || u && $("#relics_current_village").is(":checked")))
                            continue
                    }
                    this.createRelicCanvas(t, o)
                }
            }
            if (TWMap.relics.possible_displayed && (l = null != MapCanvas.relic_selected_x ? MapCanvas.relic_selected_x : game_data.village.x,
            r = null != MapCanvas.relic_selected_y ? MapCanvas.relic_selected_y : game_data.village.y,
            i = TWMap.relics.quality_info || {},
            $(".relic-quality-option:checked").each(function() {
                var e = $(this).data("quality")
                  , a = i[e];
                a && MapCanvas.createRelicCanvas(t, [l, r, a.range, a.color, null, e])
            })),
            TribalWars._settings.map_show_watchtower)
                for (let e = 0; e < this.watchTowers.length; e++) {
                    var d, p = this.watchTowers[e][0], _ = this.watchTowers[e][1], v = this.watchTowers[e][2];
                    this.circleCollidesWithSector({
                        x: p + .5,
                        y: _ + .5,
                        r: v
                    }, {
                        x: t.x,
                        y: t.y,
                        w: TWMap.map.sectorSize,
                        h: TWMap.map.sectorSize
                    }) && (p = TWMap.map.pixelByCoord(p, _),
                    _ = TWMap.map.pixelByCoord(t.x, t.y),
                    d = p[0] - _[0],
                    p = p[1] - _[1],
                    n.beginPath(),
                    MapCanvas.ellipse(n, d + TWMap.tileSize[0] / 2, p + TWMap.tileSize[1] / 2, v * TWMap.map.scale[0], v * TWMap.map.scale[1], 0, 0, 2 * Math.PI, !1),
                    n.fillStyle = "rgba(235, 38, 38, 0.1)",
                    n.fill(),
                    n.lineWidth = 1,
                    n.strokeStyle = "#563f1e",
                    n.stroke())
                }
            var f, M, y, g, s = a.offsetWidth / h, m = a.offsetHeight / h, T = (n.scale(s / 37.75, m / 37.75),
            TWMap.attackPlannerMode);
            for (T && (y = AttackPlanner.getMapInfo()),
            M = t.y - 1; M < t.y + h + 1; M++)
                for (f = t.x - 1; f < t.x + h + 1; f++) {
                    if (T && (g = 1e3 * f + M,
                    y) && TWMap.villages.hasOwnProperty(g) && y[TWMap.villages[g].id] && this.mapDrawCell(n, f - t.x, M - t.y, [!1, !1, !1, !1, !0, !1, !1, !1, !1], ["255", "255", "255"], 19, 19, .6),
                    TWMap.church.displayed && 0 < this.church_data.length) {
                        for (C = [!1, !1, !1, !1, !1, !1, !1, !1, !1],
                        B = 0; B < this.church_data.length; B++)
                            var w = this.church_data[B][0]
                              , x = this.church_data[B][1]
                              , W = this.church_data[B][2]
                              , C = [C[0] || this.churchInBound(f - 1, M - 1, w, x, W), C[1] || this.churchInBound(f, M - 1, w, x, W), C[2] || this.churchInBound(f + 1, M - 1, w, x, W), C[3] || this.churchInBound(f - 1, M, w, x, W), C[4] || this.churchInBound(f, M, w, x, W), C[5] || this.churchInBound(f + 1, M, w, x, W), C[6] || this.churchInBound(f - 1, M + 1, w, x, W), C[7] || this.churchInBound(f, M + 1, w, x, W), C[8] || this.churchInBound(f + 1, M + 1, w, x, W)];
                        this.mapDrawCell(n, f - t.x, M - t.y, C, [0, 0, 128], 19, 19, .5)
                    }
                    if (TWMap.church.possible_displayed)
                        for (var B = 0; B < TWMap.church.levels.length; B++) {
                            let e = [[MapCanvas.selected_x, MapCanvas.selected_y]];
                            null != MapCanvas.selected_x && null != MapCanvas.selected_y || (e = [[game_data.village.x, game_data.village.y]]);
                            var I = TWMap.church.levels[B]
                              , S = 3 < I && I < 0 ? this.church_radius_colors[0] : this.church_radius_colors[I];
                            this.drawMapRadiusByLevel(n, e, t, f, M, I, 2 + 2 * I, S)
                        }
                }
            n.restore(),
            a = n = null
        }
        return null
    },
    circleCollidesWithSector: function(e, a) {
        var t = Math.abs(e.x - a.x - a.w / 2)
          , l = Math.abs(e.y - a.y - a.h / 2);
        return !(t > a.w / 2 + e.r || a.h / 2 + e.r < l || !(t <= a.w / 2 || l <= a.h / 2 || (t = t - a.w / 2) * t + (t = l - a.h / 2) * t <= e.r * e.r))
    },
    mapDrawCell: function(e, a, t, l, r, i, s, h) {
        0 !== l[4] && r && (a = 38 * (a + .5),
        t = 38 * (t + .5),
        e.save(),
        e.translate(a, t),
        this.mapDrawBorderLine(e, this.mapGetSectorLine(l[3] == l[4], l[0] == l[4], l[1] == l[4], s), i, r, h),
        e.restore(),
        e.save(),
        e.translate(a, t),
        e.rotate(.5 * Math.PI),
        this.mapDrawBorderLine(e, this.mapGetSectorLine(l[1] == l[4], l[2] == l[4], l[5] == l[4], s), i, r, h),
        e.restore(),
        e.save(),
        e.translate(a, t),
        e.rotate(Math.PI),
        this.mapDrawBorderLine(e, this.mapGetSectorLine(l[5] == l[4], l[8] == l[4], l[7] == l[4], s), i, r, h),
        e.restore(),
        e.save(),
        e.translate(a, t),
        e.rotate(1.5 * Math.PI),
        this.mapDrawBorderLine(e, this.mapGetSectorLine(l[7] == l[4], l[6] == l[4], l[3] == l[4], s), i, r, h),
        e.restore())
    },
    mapDrawBorderLine: function(e, a, t, l, r) {
        if (!(a.length < 1)) {
            for (var i, s, h, n, c, o, u, d, p, _, v, f, M, y = 2, g = [], m = 0; m < a.length - 2; m += 2)
                c = (h = a[m + 2]) - (i = a[m]),
                o = (n = a[m + 3]) - (s = a[m + 1]),
                u = Math.sqrt(c * c + o * o),
                g[m] = o / u,
                g[m + 1] = -c / u;
            var T = e.globalCompositeOperation
              , w = e.fillStyle;
            for (r || (e.fillStyle = "rgba(" + l[0] + "," + l[1] + "," + l[2] + ",.7)"); null != a[y + 4]; )
                i = a[y],
                s = a[y + 1],
                h = a[y + 2],
                n = a[y + 3],
                v = g[y + 2],
                f = g[y + 3],
                v += M = p = g[y],
                f += d = _ = g[y + 1],
                p += g[y - 2],
                _ += g[y - 1],
                0 < (u = Math.sqrt(v * v + f * f)) && (v /= u,
                f /= u),
                0 < (u = Math.sqrt(p * p + _ * _)) && (p /= u,
                _ /= u),
                r && ((M = e.createLinearGradient(i, s, i + M * t, s + d * t)).addColorStop(0, "rgba(" + l[0] + "," + l[1] + "," + l[2] + "," + r + ")"),
                M.addColorStop(1, "rgba(" + l[0] + "," + l[1] + "," + l[2] + ",0)"),
                e.fillStyle = M),
                e.beginPath(),
                e.moveTo(i, s),
                e.lineTo(h, n),
                e.lineTo(h + v * t, n + f * t),
                e.lineTo(i + p * t, s + _ * t),
                e.closePath(),
                e.fill(),
                y += 2;
            e.fillStyle = w,
            e.globalCompositeOperation = T
        }
    },
    mapGetSectorLine: function(e, a, t, l) {
        var r = []
          , i = 0;
        return e || t ? !e || t || a || (r[i++] = l,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = -19,
        r[i++] = .9 * -l,
        r[i++] = 2 * -l,
        r[i++] = .9 * -l) : (r[i++] = l,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = .1 * -l,
        r[i++] = .9 * -l,
        r[i++] = .35 * -l * .9,
        r[i++] = .95 * -l * .9,
        r[i++] = -l * Math.SQRT1_2 * .9,
        r[i++] = -l * Math.SQRT1_2 * .9,
        r[i++] = .95 * -l * .9,
        r[i++] = .35 * -l * .9,
        r[i++] = .9 * -l,
        r[i++] = .1 * -l,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = l),
        e && !t && a && (r[i++] = l,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = .2 * -l,
        r[i++] = .9 * -l,
        r[i++] = .6 * -l,
        r[i++] = -l,
        r[i++] = .2 * l - 19,
        r[i++] = -19 - .2 * l,
        r[i++] = 2 * -l,
        r[i++] = 2.4 * -l),
        e || !t || a || (r[i++] = .9 * -l,
        r[i++] = 2 * -l,
        r[i++] = .9 * -l,
        r[i++] = -19,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = l),
        !e && t && a && (r[i++] = 2.4 * -l,
        r[i++] = 2 * -l,
        r[i++] = -19 - .2 * l,
        r[i++] = .2 * l - 19,
        r[i++] = -l,
        r[i++] = .6 * -l,
        r[i++] = .9 * -l,
        r[i++] = .2 * -l,
        r[i++] = .9 * -l,
        r[i++] = 0,
        r[i++] = .9 * -l,
        r[i++] = l),
        r
    },
    churchInBound: function(e, a, t, l, r) {
        e -= t,
        t = a - l;
        return e * e + t * t <= r
    },
    ellipse: function(e, a, t, l, r, i, s, h, n) {
        e.save(),
        e.translate(a, t),
        e.rotate(i),
        e.scale(l, r),
        e.arc(0, 0, 1, s, h, n),
        e.restore()
    },
    drawMapRadiusByLevel: function(e, a, t, l, r, i, s, h) {
        for (var n = [!1, !1, !1, !1, !1, !1, !1, !1, !1], c = 0; c < a.length; c++)
            var o = a[c][0]
              , u = a[c][1]
              , d = 0 < i ? Math.pow(s, 2) : 0
              , n = [n[0] || this.churchInBound(l - 1, r - 1, o, u, d), n[1] || this.churchInBound(l, r - 1, o, u, d), n[2] || this.churchInBound(l + 1, r - 1, o, u, d), n[3] || this.churchInBound(l - 1, r, o, u, d), n[4] || this.churchInBound(l, r, o, u, d), n[5] || this.churchInBound(l + 1, r, o, u, d), n[6] || this.churchInBound(l - 1, r + 1, o, u, d), n[7] || this.churchInBound(l, r + 1, o, u, d), n[8] || this.churchInBound(l + 1, r + 1, o, u, d)];
        this.mapDrawCell(e, l - t.x, r - t.y, n, h, 19, 19, .9)
    },
    createRelicCanvas: function(e, a) {
        var t = a[0]
          , l = a[1]
          , r = a[2]
          , i = a[3]
          , a = a[5] || ""
          , s = TWMap.tileSize[0]
          , h = TWMap.tileSize[1]
          , n = (2 * r + 1) * s
          , c = (2 * r + 1) * h
          , a = `relic_canvas_${t}_` + l + (a ? "_" + a : "");
        let o = document.getElementById(a);
        if (null == o && e.coordIn(t, l)) {
            (o = document.createElement("canvas")).id = a,
            o.width = 2 + n,
            o.height = 2 + c,
            o.style.position = "absolute",
            o.style.zIndex = "13",
            o.style.left = (t - e.x + .5) * s - 1 + "px",
            o.style.top = (l - e.y + .5) * h - 1 + "px",
            o.style.transform = "translate(-50%, -50%)";
            var u, d, a = "rgba(" + i.join(", ") + ", 0.4)", n = "rgba(" + i.join(", ") + ", 1)", p = o.getContext("2d"), _ = {};
            for (let a = 0; a < 2 * r + 1; a++) {
                _[a] = {};
                for (let e = 0; e < 2 * r + 1; e++)
                    Math.sqrt(Math.pow(r - a, 2) + Math.pow(r - e, 2)) <= r && (_[a][e] = !0)
            }
            p.fillStyle = a,
            p.strokeStyle = n,
            p.lineWidth = 2;
            for (let a = 0; a < 2 * r + 1; a++)
                for (let e = 0; e < 2 * r + 1; e++)
                    _[a]?.[e] && p.fillRect(a * s + 1, e * h + 1, s, h);
            p.strokeStyle = n,
            p.lineWidth = 2,
            p.beginPath();
            for (let a = 0; a < 2 * r + 1; a++)
                for (let e = 0; e < 2 * r + 1; e++)
                    _[a]?.[e] && (u = a * s + 1,
                    d = e * h + 1,
                    _[a]?.[e - 1] || (p.moveTo(u, d),
                    p.lineTo(u + s, d)),
                    _[a + 1]?.[e] || (p.moveTo(u + s, d),
                    p.lineTo(u + s, d + h)),
                    _[a]?.[e + 1] || (p.moveTo(u, d + h),
                    p.lineTo(u + s, d + h)),
                    _[a - 1]?.[e] || (p.moveTo(u, d),
                    p.lineTo(u, d + h)));
            p.stroke(),
            e.appendElement(o)
        }
        return o
    }
};

;function MapToggleBox(n) {
    var i = $.extend({
        visible: !1,
        url: null,
        onShow: null,
        onHide: null
    }, n)
      , o = this
      , n = (n = i).id
      , e = i.visible
      , t = !1
      , l = i.url
      , u = $(document.getElementById(n))
      , s = $("." + n + "_wrap")
      , h = $("." + n + "_toggler");
    function d() {
        var n = TWMap.image_base + "/icons/slide_" + (e ? "up" : "down") + ".png";
        h.attr("src", n)
    }
    function a() {
        null !== i.onShow && i.onShow(),
        e = !0,
        d(),
        u.show("fast")
    }
    function c(n) {
        t && (t = !1,
        u.html(n),
        a())
    }
    this.show = function() {
        l ? (t = !0,
        $.ajax({
            url: l,
            dataType: "html",
            success: c
        })) : a()
    }
    ,
    this.hide = function() {
        null !== i.onHide && i.onHide(),
        t = e = !1,
        d(),
        u.hide("fast")
    }
    ,
    e || (s.hide(),
    u.hide()),
    h.click(function() {
        return e ? o.hide() : o.show(),
        !1
    }),
    d()
}

;!function() {
    var p = {};
    this.jstpl_format = function(t, n) {
        for (var e = t, p = t.match(/%([^%]+)%/g), r = p.length, i = 0; i < r; i++)
            var o = p[i].substring(1, p[i].length - 1)
              , e = e.replace(new RegExp(p[i]), n[o]);
        return e
    }
    ,
    this.jstpl = function t(n, e) {
        n = /\W/.test(n) ? new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + n.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t==(.*?)%>/g, "',jstpl_format($1,obj),'").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : p[n] = p[n] || t(document.getElementById(n).innerHTML);
        return e ? n(e) : n
    }
}();

;var TroopTemplates = {
    current: null,
    loadTemplate: null,
    deleteLink: null,
    currentTemplates: 0,
    maxTemplates: 2,
    init: function() {
        var e = $("#troop_template_units");
        e.find('input[type="checkbox"]').change(TroopTemplates.allTroopsCheckbox),
        document.location.hash && (TroopTemplates.loadTemplate = document.location.hash.substring(1)),
        TroopTemplates.currentTemplates >= TroopTemplates.maxTemplates ? TroopTemplates.loadTemplate || (TroopTemplates.loadTemplate = !0) : TroopTemplates.selectCreate(),
        TroopTemplates.updateTemplateList(),
        mobile || $("#troop_template_list").css("height", $("#troop_template_units").height() + "px"),
        $("#template_create").click(TroopTemplates.selectCreate),
        e.find("form").submit(TroopTemplates.validate),
        $("a.help-link").on("click", function(e) {
            e.preventDefault(),
            TribalWars.get(game_data.screen, {
                ajax: "templates_help"
            }, function(e) {
                Dialog.show("help", e.dialog)
            })
        }),
        TroopTemplates.bindTemplateSelectorLinks()
    },
    bindTemplateSelectorLinks: function() {
        document.querySelectorAll(".troop_template_selector").forEach(function(e) {
            e.addEventListener("click", function(e) {
                e.preventDefault();
                e = this.dataset.templateId;
                e && TroopTemplates.useTemplate(e)
            })
        }),
        document.querySelectorAll(".evt-select-template").forEach(function(e) {
            e.addEventListener("change", function() {
                var e, t = this.value;
                t && (TroopTemplates.useTemplate(t),
                e = document.getElementById("template_id")) && (e.value = t)
            })
        }),
        document.querySelectorAll(".template-help-icon").forEach(function(e) {
            e.addEventListener("click", function(e) {
                e.preventDefault(),
                TroopTemplates.showTemplateHelp()
            })
        })
    },
    allTroopsCheckbox: function() {
        var e = mobile ? "number" : "text";
        this.parentElement.querySelector('input[type="' + e + '"]').disabled = this.checked
    },
    resetSelect: function(e) {
        e.find("option:first").attr("selected", "selected").parent("select")
    },
    useTemplate: function(e) {
        var l;
        return (e = "object" == typeof e ? $(e).find("option:selected").val() : e) && (l = TroopTemplates.current[e],
        $.each(l, function(e, t) {
            var a = $("#unit_input_" + e);
            a.length && (0 <= t ? a.val(t) : a.val(Math.max(0, parseInt(a.data("all-count")) + parseInt(t)))),
            -1 < l.use_all.indexOf(e) && a.val(a.data("all-count"))
        }),
        $("#template_id").val(e)),
        !1
    },
    validate: function() {
        return $("#template_name").val().length < 1 ? (UI.ErrorMessage(_("8a583c14eb4afc2ea2ac98a38eabb744")),
        !1) : 50 < $("#template_name").val().length ? (UI.ErrorMessage(_("4d2c639afe61e71f27518ee7b952436a")),
        !1) : "" != $("#template_name").val().trim() || (UI.ErrorMessage(_("ad2e48bae3587249c07027ac3eb331a7")),
        !1)
    },
    updateTemplateList: function() {
        var o = $("#troop_template_list").find("ul")
          , p = 1;
        $.each(TroopTemplates.current, function(e, t) {
            t.sanitized_name = $("<a></a>").text(t.name).text(),
            t.display_name = "";
            for (var a = 0; a < t.sanitized_name.length; a++)
                t.display_name += t.sanitized_name.charAt(a) + "&shy;";
            var l = $('<li><a href="#' + t.id + '"></a></li>')
              , n = l.find("a")
              , l = (n.data("template-id", t.id),
            n.data("li-id", p),
            n.click(TroopTemplates.selectTemplate),
            n.html(t.display_name),
            o.append(l),
            $('<img src="/graphic/delete_14.png" alt="" />').click(function(e) {
                e.stopPropagation(),
                document.location.replace(TroopTemplates.deleteLink + "&id=" + t.id)
            }));
            n.prepend(l),
            t.id != TroopTemplates.loadTemplate && !0 !== TroopTemplates.loadTemplate || (TroopTemplates.selectTemplate.call(n),
            TroopTemplates.loadTemplate = 0),
            p++
        })
    },
    selectCreate: function(e) {
        if (void 0 !== e && e.preventDefault(),
        TroopTemplates.currentTemplates >= TroopTemplates.maxTemplates)
            return UI.ErrorMessage(_("c61cdbdae723805bf8dccf2bf9bcfec5")),
            !1;
        var e = $("#troop_template_units")
          , t = e.find('input[type="checkbox"]')
          , t = (t.prop("checked", !1),
        t.trigger("change"),
        mobile ? "number" : "text");
        e.find("input[type=" + t + "]").val(""),
        $("#template_id").val(0),
        $("#template_name").val(""),
        $("#template_button").val(_("f6da9639891b32492ee35a12286e301b")),
        TroopTemplates.setSelected(0)
    },
    selectTemplate: function() {
        var e = $(this)
          , t = e.data("template-id")
          , e = e.data("li-id")
          , n = TroopTemplates.current[t];
        TroopTemplates.setSelected(e),
        $("#template_id").val(n.id),
        $("#template_name").val(n.name),
        $("#template_button").val(_("2992dafa14a7361deb8459ad07659b12")),
        $.each(n, function(e, t) {
            var a = $("#unit_input_" + e)
              , l = a.parent().find('input[type="checkbox"]');
            a.length && a.val(t),
            l.prop("checked", -1 < n.use_all.indexOf(e)),
            l.trigger("change")
        })
    },
    setSelected: function(e) {
        var t = $("#troop_template_list").find("li");
        t.removeClass("selected"),
        t.eq(e).addClass("selected")
    },
    applyTemplateToAttacks: function(e, t) {
        let l = TroopTemplates.current[e];
        if (!l)
            return !1;
        document.querySelectorAll("#place_confirm_units input[type=number]").forEach(e => e.value = "");
        let n = l.use_all || []
          , a = [];
        return Object.keys(l).forEach(e => {
            var t;
            -1 === ["id", "player_id", "name", "use_all", "used", "help_text"].indexOf(e) && (t = parseInt(l[e])) < 0 && a.push({
                unit_id: e,
                reserve: Math.abs(t)
            })
        }
        ),
        document.querySelectorAll(".units-row:not(:first-child)").forEach( (a, e) => {
            Object.keys(l).forEach(e => {
                var t;
                -1 !== ["id", "player_id", "name", "use_all", "used", "help_text"].indexOf(e) || (t = parseInt(l[e]),
                -1 !== n.indexOf(e)) || t < 0 || 0 < t && (e = a.querySelector("input[data-unit=" + e + "]")) && (e.value = t)
            }
            )
        }
        ),
        0 < n.length && TroopTemplates.autoBalanceUnits(n, t),
        0 < a.length && TroopTemplates.autoBalanceNegativeUnits(a, t),
        t.updateUnitsSum && t.updateUnitsSum(),
        t.checkAndShowCatapultTargetSelection && t.checkAndShowCatapultTargetSelection(),
        !0
    },
    autoBalanceUnits: function(e, t) {
        let o = t.getSendUnits()
          , p = t.getAvailableUnits();
        e.forEach(e => {
            let a = p[e] - o[e] - t.getDirtyUnitCount(e)
              , l = 0
              , n = document.querySelectorAll('#place_confirm_units input[name*="[' + e + ']"]:not(.dirty)');
            n.forEach( (e, t) => {
                t = t === n.length - 1 ? a - l : Math.floor(a / n.length);
                e.value = 0 < t ? t : "",
                l += t
            }
            )
        }
        ),
        t.updateUnitsSum && t.updateUnitsSum()
    },
    autoBalanceNegativeUnits: function(e, o) {
        let p = o.getSendUnits()
          , r = o.getAvailableUnits();
        e.forEach(e => {
            var t = e.unit_id
              , e = e.reserve;
            let a = r[t] - p[t] - e - o.getDirtyUnitCount(t)
              , l = 0
              , n = document.querySelectorAll('#place_confirm_units input[name*="[' + t + ']"]:not(.dirty)');
            n.forEach( (e, t) => {
                t = t === n.length - 1 ? a - l : Math.floor(a / n.length);
                e.value = 0 < t ? t : "",
                l += t
            }
            )
        }
        ),
        o.updateUnitsSum && o.updateUnitsSum()
    },
    showTemplateHelp: function() {
        var t = document.getElementById("attack_template_selector");
        if (t) {
            t = t.value;
            if (t) {
                t = TroopTemplates.current[t];
                if (t) {
                    let e = "<h3>" + t.name + "</h3>";
                    e += t.help_text ? "<p>" + t.help_text + "</p>" : "<p>" + _("e6a59035852fa3c64fcb7dda79da889f") + "</p>",
                    Dialog.show("template_help", e, function() {})
                }
            } else
                Dialog.show("template_help", "<h3>" + _("72bedaeb592ac53c6239a4f918ec0d56") + "</h3><p>" + _("0d47c7cd00dc069e0b88e1cfd8277b86") + "</p>", function() {})
        }
    }
};

;var TargetSelection;
(TargetSelection = function(e) {
    var o = this;
    this.$container = null,
    this.on_confirm_village = function(e) {}
    ,
    this.request_id = 0,
    this.selected_index = null,
    this.num_villages = 0,
    this.page_limit = null,
    this.last_attacked = null,
    this.autocomplete_visible = !1,
    this.ie_compatibility_mode = !0,
    this.confirmed_village_data = !1,
    this.read_only = !1,
    this.clicked_button = "attack",
    this.autocomplete_wrapper = null,
    this.input_text_field = null,
    this.script_watcher = null,
    this.script_old_x = "",
    this.script_old_y = "",
    this.construct = function(e) {
        e = $(e),
        this.$container = e,
        this.input_text_field = e.find("input[type=text]"),
        this.initAutoComplete(),
        this.changeSearchType.call(e.find("input[type=radio]:checked"), !1),
        this.page_limit = Math.min(Math.max(Math.round(($(window).height() - this.input_text_field.offset().top) / 50), 5), 10),
        this.setAutoCompleteWrapperPosition(),
        this.input_text_field.on("input", function() {
            o.ie_compatibility_mode = !1,
            o.fetchVillages()
        }).on("keyup", o.textFieldKeyUp).on("keydown", o.textFieldKeyDown).on("remove", o.destroy),
        e.find("input[type=radio]").on("change", this.changeSearchType),
        this.input_text_field.parents("form").on("submit", this.beforeSubmit),
        $(window).on("click", this.onWindowClick),
        e.find(".btn").on("click", function() {
            o.clicked_button = $(this).attr("name")
        }),
        e = e.data("on-choice");
        e && this.setConfirmHook(e)
    }
    ,
    this.destroy = function() {
        clearInterval(o.script_watcher),
        $(window).off("click", o.onWindowClick),
        this.input_text_field = null
    }
    ,
    this.onWindowClick = function() {
        o.autocomplete_visible && o.hideAutoCompleteWrapper()
    }
    ,
    this.initAutoComplete = function() {
        this.$container.find(".target-input-autocomplete").autocomplete({
            minLength: 2,
            source: UI.AutoComplete.source
        }),
        this.input_text_field.on("autocompleteselect", function(e, t) {
            o.fetchVillages({
                input: t.item.value
            })
        })
    }
    ,
    this.initScriptCompatibility = function() {
        clearInterval(this.script_watcher),
        this.script_watcher = setInterval(this.checkForScriptChange, 100)
    }
    ,
    this.checkForScriptChange = function() {
        var e = parseInt($("#inputx").val())
          , t = parseInt($("#inputy").val())
          , i = parseInt(o.confirmed_village_data ? o.confirmed_village_data.x : 0)
          , a = parseInt(o.confirmed_village_data ? o.confirmed_village_data.y : 0);
        e && t && (e !== i || t !== a) && (clearInterval(o.script_watcher),
        o.setVillageByCoordinates(e, t, function() {
            $("#inputx").val(""),
            $("#inputy").val(""),
            o.initScriptCompatibility()
        }))
    }
    ,
    this.setReadOnly = function() {
        this.read_only = !0
    }
    ,
    this.setLastAttacked = function(e) {
        this.last_attacked = e,
        this.$container.find(".target-last-attacked").show().on("click", function(e) {
            e.preventDefault(),
            o.confirmVillage(o.getVillageDiv(o.last_attacked))
        })
    }
    ,
    this.enableQuickButton = function(e, t) {
        $(".target-" + e).show().on("click", function(e) {
            TargetSelection.loadTargetsPopup(e, t)
        })
    }
    ,
    this.setVillageByCoordinates = function(e, t, i) {
        this.fetchVillages({
            type: "coord",
            input: e + "|" + t
        }, function(e) {
            e.villages.length && o.confirmVillage(o.getVillageDiv(e.villages[0])),
            "function" == typeof i && i()
        })
    }
    ,
    this.setVillageByData = function(e) {
        this.confirmVillage(o.getVillageDiv(e)),
        $("#inputx").val(e.x),
        $("#inputy").val(e.y)
    }
    ,
    this.beforeSubmit = function() {
        var e = $("#inputx")
          , t = $("#inputy")
          , i = o.$container.find(".target-input .village-item");
        return i.length && (i = i.data("village_data"),
        e.val(i.x),
        t.val(i.y)),
        (i = o.$container.find("input[type=text]").val().match(/^([0-9]{1,3})\|([0-9]{1,3})$/)) && (e.val(i[1]),
        t.val(i[2])),
        !0
    }
    ,
    this.changeSearchType = function(e) {
        var t, i = $(this), a = i.closest(".target-select").find("input[type=text]");
        switch (i.val()) {
        case "coord":
            t = "123|456";
            break;
        case "village_name":
            t = _("0b0415688c7513bb82d3c0e0835bd002");
            break;
        case "player_name":
            t = _("8db61ba8bc85fde639110b3098e827bb")
        }
        a.attr("placeholder", t).data("search-type", i.val()),
        o.clearVillages(),
        "player_name" === i.val() ? (a.autocomplete("enable"),
        a.autocomplete("search")) : a.autocomplete("disable"),
        !1 !== e && a.focus()
    }
    ,
    this.clearVillages = function() {
        this.hideAutoCompleteWrapper(),
        this.removeConfirmedVillage()
    }
    ,
    this.fetchVillages = function(e, t) {
        var i = {
            ajax: "target_selection",
            input: this.$container.find("input[type=text]").val(),
            type: this.$container.find("input[type=radio]:checked").val(),
            request_id: ++this.request_id,
            limit: this.page_limit,
            offset: 0
        };
        0 !== (i = $.extend(i, e)).input.length && (void 0 === t && (t = function(e) {
            o.handleVillagesData(e)
        }
        ),
        TribalWars.get("api", i, t))
    }
    ,
    this.handleVillagesData = function(e) {
        var i;
        e.request_id === this.request_id && (i = this.getAutoCompleteWrapper(),
        this.hideAutoCompleteWrapper(),
        this.num_villages = e.villages.length + e.offset,
        0 === e.offset ? (this.selected_index = null,
        i.empty()) : i.find(".village-more").remove(),
        0 !== e.villages.length) && (this.showAutoCompleteWrapper(),
        $.each(e.villages, function(e, t) {
            i.append(o.getVillageDiv(t))
        }),
        e.more && (e = $('<div class="village-item village-more">' + _("146ffe2fd9fa5bec3b63b52543793ec7") + "</div>").on("click", function(e) {
            e.stopPropagation(),
            o.loadMoreVillages()
        }),
        i.append(e)),
        this.setAutoCompleteWrapperPosition())
    }
    ,
    this.showAutoCompleteWrapper = function() {
        this.getAutoCompleteWrapper().show(),
        this.autocomplete_visible = !0
    }
    ,
    this.hideAutoCompleteWrapper = function() {
        "player_name" === this.$container.find(".input[type=radio]:checked").val() && this.input_text_field.autocomplete("enable"),
        this.getAutoCompleteWrapper().hide(),
        this.autocomplete_visible = !1
    }
    ,
    this.getAutoCompleteWrapper = function() {
        return this.autocomplete_wrapper || (this.autocomplete_wrapper = $('<div class="target-select-autocomplete"></div>').appendTo("body")),
        this.autocomplete_wrapper
    }
    ,
    this.setAutoCompleteWrapperPosition = function() {
        var e = this.getAutoCompleteWrapper()
          , t = this.$container.find(".target-input")
          , i = t.offset()
          , a = t.height()
          , t = (e.css("width", t.width() + 2 + "px"),
        e.css("max-height", 50 * this.page_limit + "px"),
        e.css("left", i.left),
        e.height());
        $(document).height() - i.top - a - $("#footer").height() < t ? (e.css("top", i.top - t - 2 + "px"),
        e.css({
            "border-top-width": "1px",
            "border-bottom-width": "0px"
        })) : (e.css("top", i.top + a + 2 + "px"),
        e.css({
            "border-top-width": "0px",
            "border-bottom-width": "1px"
        }))
    }
    ,
    this.setConfirmHook = function(e) {
        for (var t = e.split("."), e = t.pop(), i = window, a = 0; a < t.length; a++)
            i = i[t[a]];
        e = i[e];
        if ("function" != typeof e)
            throw "non-existent function specified for TargetSelection on-choice";
        this.on_confirm_village = e
    }
    ,
    this.confirmVillage = function(e) {
        this.removeConfirmedVillage(),
        this.getAutoCompleteWrapper().hide();
        var t = this.$container.find(".target-input");
        t.find("input").hide(),
        t.append(e),
        e.removeClass("village-selected"),
        this.confirmed_village_data = e.data("village_data"),
        this.updateURLForConfirmedVillage(),
        this.on_confirm_village(this.confirmed_village_data)
    }
    ,
    this.removeConfirmedVillage = function() {
        var e = this.$container.find(".target-input");
        e.find(".village-item").length && (e.find("input").show().val("").focus(),
        e.find(".village-item").remove(),
        this.confirmed_village_data = !1,
        $("input[name=x], input[name=y]").val(""),
        this.updateURLForConfirmedVillage())
    }
    ,
    this.getVillageDiv = function(e) {
        var t = $('<div class="village-item"><img class="village-delete" alt="" /><img class="village-picture" alt="" /><span class="village-name"></span><span class="village-info"></span><span class="village-distance"></span></div>').data("village_data", e)
          , i = (this.read_only || t.on("click", function(e) {
            e.stopPropagation(),
            $(this).parent().hasClass("target-select-autocomplete") ? o.confirmVillage(t) : o.removeConfirmedVillage()
        }),
        e.name)
          , i = (18 < i.length && (i = i.substr(0, 18) + "&hellip;"),
        s("%1 (%2|%3)", i, e.x, e.y))
          , a = e.player_name || _("0a697cba19cd4c1974e2ee11a3c0b9c7")
          , a = "<strong>" + _("13c5c6614ffee1464fd8f257d23151a4") + "</strong> " + a + " <strong>" + _("bde4bea69ecac47075ec76f575513829") + "</strong> " + e.points
          , l = Math.round(Math.sqrt(e.distance))
          , l = 1 === l ? s(_("ba2b365358d84111ebec5eab11ed9676"), l) : s(_("b7e6ef7cb6adca76ea4a73f1b0e4c3b7"), l)
          , l = "<strong>" + _("d7ecc20be02635c8fd9ba717df02a66b") + "</strong> " + l
          , n = t.find(".village-picture");
        return n.attr("src", e.image),
        e.siege_village && n.addClass("siege-village"),
        t.find(".village-delete").attr("src", image_base + "/delete.png"),
        t.find(".village-name").html(i),
        t.find(".village-info").html(a),
        t.find(".village-distance").html(l),
        this.read_only && t.addClass("read-only"),
        t
    }
    ,
    this.textFieldKeyUp = function(e) {
        o.ie_compatibility_mode && 38 !== e.keyCode && 40 !== e.keyCode && o.fetchVillages();
        var t = $(this)
          , i = t.val();
        return "coord" === t.data("search-type") && (3 === (i = (i = i.replace(/[,.]/, "|")).replace(/[^[0-9|]+/, "")).length && 8 !== e.keyCode && 46 !== e.keyCode && (i += "|"),
        7 < (i = -1 !== i.indexOf("||") ? i.replace(/(\|{2,})/, "|") : i).length && (i = i.substr(0, 7)),
        t.val(i)),
        !0
    }
    ,
    this.textFieldKeyDown = function(e) {
        return 38 === e.keyCode ? (o.selectPrevVillage(),
        !1) : 40 === e.keyCode ? (o.selectNextVillage(),
        !1) : 13 !== e.keyCode || (o.confirmVillageAtIndex(o.selected_index),
        !1)
    }
    ,
    this.selectNextVillage = function() {
        null === this.selected_index ? this.selectVillageAtIndex(0) : this.selected_index + 1 <= this.num_villages && this.selectVillageAtIndex(this.selected_index + 1)
    }
    ,
    this.selectPrevVillage = function() {
        null !== this.selected_index && 0 < this.selected_index && this.selectVillageAtIndex(this.selected_index - 1)
    }
    ,
    this.selectVillageAtIndex = function(e) {
        this.unselectSelectedVillage();
        var t, i, a = this.getAutoCompleteWrapper().find("div").eq(e);
        0 != a.length && (a.addClass("village-selected"),
        e = 41 * (this.selected_index = e),
        t = a.position().top,
        i = parseInt(a.parent().css("max-height")),
        t < 10 || i - 40 < t) && a.parent().scrollTop(e)
    }
    ,
    this.unselectSelectedVillage = function() {
        this.getAutoCompleteWrapper().find("div.village-selected").removeClass("village-selected")
    }
    ,
    this.confirmVillageAtIndex = function(e) {
        var t = this.getAutoCompleteWrapper().find("div").eq(e);
        t.length && (t.hasClass("village-more") ? (this.loadMoreVillages(),
        this.selectVillageAtIndex(e - 1)) : this.confirmVillage(t))
    }
    ,
    this.updateURLForConfirmedVillage = function() {
        var e = this.confirmed_village_data || {
            id: 0
        }
          , t = document.location.href
          , i = /target=([0-9]+)/;
        (t = "#" === t.substr(-1) ? t.substr(0, t.length - 1) : t).match(i) ? t = t.replace(i, "target=" + e.id) : t += "&target=" + e.id,
        Modernizr.history && history.replaceState({}, "", t)
    }
    ,
    this.loadMoreVillages = function() {
        this.fetchVillages({
            offset: this.num_villages
        })
    }
    ,
    this.construct(e)
}
).loadTargetsPopup = function(e, t) {
    UI.AjaxPopup(e, "village_targets", t, _("91fadc5613280f76b916f1fd236e43e9"), null, {
        reload: !0
    }, null, 400)
}
,
TargetSelection.selectTargetGroupForDeliveries = function(e, t, i, a) {
    var l = $('form[name="market"]')[0];
    if (l[a + "x"].value = "",
    l[a + "y"].value = "",
    l[a + "_target"]) {
        for (var n = l[a + "_target"], o = n.length - 1; 0 <= o; o--)
            n.options[o].value.startsWith("group_") && n.remove(o);
        l = t + "_group_" + e;
        n.options[n.options.length] = new Option(i,l),
        n.value = l
    }
    $("#closelink_village_targets").click(),
    $("div[id$='_cont']").hide()
}
,
TargetSelection.initGroupsSelection = function() {
    document.querySelectorAll("table .target-group").forEach( (e, t) => {
        e.addEventListener("click", () => {
            TargetSelection.selectTargetGroupForDeliveries(e.dataset.groupId, e.dataset.groupType, e.dataset.groupName, e.dataset.prefix)
        }
        )
    }
    )
}
;

;var Worldmap = {
    Data: {
        t: 0
    },
    init: function(e) {
        Worldmap.Data.t = e,
        $("#worldmap").draggable({
            stop: Worldmap.savePosition,
            containment: [0, 60]
        })
    },
    toggle: function() {
        switch (toggle_value = ("undefined" == typeof toggle_value || 0 == toggle_value) && ("undefined" == typeof toggle_value && Worldmap.reload(),
        !0)) {
        case !0:
            $("#worldmap").show();
            break;
        case !1:
            $("#worldmap").hide()
        }
    },
    reload: function() {
        var e = "&cut=true";
        $("#worldmap_settings").children(":checked").each(function() {
            switch ($(this).attr("name")) {
            case "worldmap_barbarian_toggle":
                e += "&barbarian=true";
                break;
            case "worldmap_ally_toggle":
                e += "&ally=true";
                break;
            case "worldmap_partner_toggle":
                e += "&partner=true";
                break;
            case "worldmap_nap_toggle":
                e += "&nap=true";
                break;
            case "worldmap_enemy_toggle":
                e += "&enemy=true"
            }
        }),
        0 < Worldmap.Data.t && (e = e + "&t=" + Worldmap.Data.t),
        Worldmap.loadMapImage(e)
    },
    loadMapImage: function(e) {
        $("#worldmap_body").hide(),
        $("#worldmap-throbber").show();
        var t = new Image;
        t.onload = function() {
            $("#worldmap-throbber").hide(),
            $("#secrets").css("left", (this.width - 1e3) / 2).css("top", (this.height - 1e3) / 2);
            var o = 500 - this.width / 2
              , r = 500 - this.height / 2;
            $("#worldmap_image > input").width(this.width).height(this.height).click(function(e) {
                var t = $(this).offset()
                  , a = e.offsetX || e.pageX - this.offsetLeft - t.left
                  , e = e.offsetY || e.pageY - this.offsetTop - t.top;
                return a += o,
                e += r,
                Worldmap.toggle(),
                TWMap.map.centerPos(a, e),
                !1
            }),
            $("#worldmap_body").width(this.width).height(this.height).css("background-image", "url(" + this.src + ")").show()
        }
        ,
        t.src = "page.php?page=worldmap_image" + e
    },
    savePosition: function(e, t) {
        $.cookie("worldmap_left", $(this).css("left")),
        $.cookie("worldmap_top", $(this).css("top"))
    }
};

;var Market = {
    Data: {
        Trader: {
            carry: 0,
            amount: 0,
            total: 0,
            capacity: null
        },
        Res: {
            wood: 0,
            stone: 0,
            iron: 0
        }
    },
    Memory: {
        freeCapacity: null,
        res: {
            wood: 0,
            stone: 0,
            iron: 0
        }
    },
    Set: {
        freeCapacitiy: function(e) {
            Market.Memory.freeCapacity = e
        },
        maxRes: function(e) {
            Market.Memory.res = e,
            Market.Data.Res.wood = e.wood,
            Market.Data.Res.stone = e.stone,
            Market.Data.Res.iron = e.iron
        }
    },
    init: function(e, t) {
        Market.Data = e,
        Market.Modes[t] && Market.Modes[t].init(),
        $("#unblocked_points_info").on("click", function() {
            Dialog.fetch("premium_blocked_logs", "premium", {
                ajax: "blocked_points"
            })
        })
    },
    getPremiumRate: function(e, t) {
        e /= t;
        return {
            resources: 0 == e ? 0 : e < 1 ? 1 : Math.floor(e),
            premium: 0 == e ? 0 : e < 1 ? Math.floor(1 / e) : 1
        }
    },
    Modes: {
        own_offer: {
            init: function() {
                Market.Modes.own_offer.initResSelectionHandling()
            },
            initResSelectionHandling: function() {
                $("#res_sell_wood, #res_sell_stone, #res_sell_iron").click(function() {
                    $("#res_sell_amount").select()
                }),
                $("#res_buy_wood, #res_buy_stone, #res_buy_iron").click(function() {
                    $("#res_buy_amount").select()
                })
            }
        },
        all_own_offer: {
            init: function() {
                $(".fillmax").click(function() {
                    return Market.Modes.all_own_offer.fillMax(this),
                    !1
                }),
                $("a.market_accept_offer").click(function() {
                    Market.Modes.all_own_offer.submitOfferAcceptForm($(this))
                }),
                $("input.market_accept_offer").keydown(function(e) {
                    13 === e.keyCode && (e.preventDefault(),
                    $(this).parent().find("a.market_accept_offer").click())
                })
            },
            acceptOffer: function(a, e) {
                TribalWars.post("market", {
                    ajaxaction: "accept_offer"
                }, {
                    id: a,
                    count: e
                }, function(e) {
                    var t = Market.Modes.all_own_offer;
                    e.hasOwnProperty("expired") ? (UI.ErrorMessage(e.expired),
                    t.removeOfferDisplay()) : (UI.SuccessMessage(_("78b7d007dca3267f751240a2a365ce25")),
                    0 === e.offers_remaining ? t.removeOfferDisplay(a) : t.updateOffer(a, e.offers_remaining),
                    t.updateMerchants(e.merchants_available, e.merchants_total, e.merchant_carry))
                })
            },
            submitOfferAcceptForm: function(e) {
                var t = e.data("id")
                  , e = e.parent().find("input[name=count]").val();
                return this.acceptOffer(t, e),
                !1
            },
            removeOfferDisplay: function(e) {
                var e = ($offer_container = $("#offer_" + e)).data("village")
                  , t = $("#village_" + e)
                  , a = t.data("offer-count") - 1;
                t.data("offer-count", a),
                mobile ? ($offer_container.next().remove(),
                $offer_container.prev().remove(),
                a < 1 && (t.next().remove(),
                t.remove())) : (t.attr("rowspan", parseInt(t.attr("rowspan")) - 1),
                (a = $offer_container.next(".offer_container"))[0] && a.data("village") === e && a.prepend(t.detach())),
                $offer_container.remove()
            },
            updateOffer: function(e, t) {
                ($offer_container = $("#offer_" + e)).data("count", t),
                $("#offer_count_" + e).html(t)
            },
            updateMerchants: function(e, t, a) {
                var n = Math.floor(e * a)
                  , f = game_data.village;
                $(".offer_container").each(function() {
                    var e = $(this)
                      , t = e.data("id")
                      , a = {
                        wood: e.data("wanted_wood"),
                        stone: e.data("wanted_stone"),
                        iron: e.data("wanted_iron")
                    }
                      , e = e.data("count")
                      , r = 0
                      , o = 0
                      , i = (["wood", "stone", "iron"].forEach(function(e) {
                        r += a[e],
                        0 < a[e] && (o = Math.floor(f[e] / a[e]))
                    }),
                    0 < r ? Math.floor(n / r) : 0)
                      , i = Math.min(o, i, e);
                    ($fillmax = $("#fillmax_" + t)).html(i).data("max", i)
                })
            },
            fillMax: function(e) {
                ($anchor = $(e)).parent().find("input[name=count]").val($anchor.data("max"))
            }
        },
        other_offer: {
            init: function() {
                $("input[name=res_sell], input[name=res_buy]").change(Market.Modes.other_offer.check_ratio_enabled),
                $("form.market_accept_offer").submit(function() {
                    Market.Modes.other_offer.submitOfferAcceptForm($this)
                }),
                Market.Modes.other_offer.check_ratio_enabled(),
                $("#offer_filter select, #offer_filter input[name=only_ally]").change(function() {
                    Market.Modes.other_offer.search()
                }),
                $("#confirm_custom_ratio_max").click(function() {
                    Market.Modes.other_offer.search()
                }),
                $(".evt-market-swap-res").on("click", function() {
                    $("input[name=swap]").val("1"),
                    Market.Modes.other_offer.search()
                })
            },
            check_ratio_enabled: function() {
                $("input[name=res_sell]").each(function() {
                    this.checked && this.value
                }),
                $("input[name=res_buy]").each(function() {
                    this.checked && this.value
                })
            },
            lockSell: function(e) {
                $('input[name="res_sell"]').prop("disabled", !1),
                $('#selection_sell :input[value="' + e + '"]').prop("disabled", !0),
                this.search()
            },
            lockBuy: function(e) {
                $('input[name="res_buy"]').prop("disabled", !1),
                $('#selection_buy :input[value="' + e + '"]').prop("disabled", !0),
                this.search()
            },
            switchToCustomRatioUI: function() {
                $("#choose_ratio_max").remove(),
                $("#custom_ratio_max").show(),
                $("#custom_ratio_max_input").attr("name", "ratio_max").select()
            },
            sort: function(e) {
                e === $("#order_by").val() && $("#toggle_dir").val(1),
                $("#order_by").val(e),
                this.search()
            },
            search: function() {
                $("#offer_filter").submit()
            },
            acceptOffer: function(e, t) {
                TribalWars.post("market", {
                    ajaxaction: "accept_offer"
                }, {
                    id: e,
                    count: t
                }, function(e) {
                    e.hasOwnProperty("expired") ? UI.ErrorMessage(e.expired) : UI.SuccessMessage(_("78b7d007dca3267f751240a2a365ce25")),
                    partialReload()
                })
            },
            submitOfferAcceptForm: function(e) {
                var t = e.find("input[name=id]").val()
                  , e = e.find("input[name=count]").val();
                return this.acceptOffer(t, e),
                !1
            }
        },
        send: {
            init: function() {
                $("input.resources_max").change(Market.Modes.send.handleChange),
                $("#fill_recent_target").click(function() {
                    var e = $(this);
                    return Market.Modes.send.setCoords(e.data("x"), e.data("y")),
                    !1
                })
            },
            setCoords: function(e, t) {
                return $("#inputx").val(e),
                $("#inputy").val(t),
                !1
            },
            handleChange: function(e) {
                Market.Modes.send.recalcFreeCapacity()
            },
            insertMax: function(e) {
                var t = $("input[name='" + e + "']")
                  , a = parseInt(t.val())
                  , r = (isNaN(a) && (a = 0),
                null == Market.Memory.freeCapacity && Market.Modes.send.recalcFreeCapacity(),
                0);
                (r = Market.Memory.freeCapacity > Market.Memory.res[e] ? Market.Memory.res[e] : Market.Memory.freeCapacity) <= 0 ? (r = 0,
                Market.Memory.res[e] = Market.Data.Res[e]) : r += a,
                Market.Memory.res[e] -= r,
                t.val(r = 0 == r ? "" : r),
                Market.Modes.send.recalcFreeCapacity()
            },
            recalcFreeCapacity: function() {
                var a = 0;
                $("input.resources_max").each(function() {
                    var e = this.name
                      , t = Math.max(0, parseInt($(this).val(), 10));
                    -1 != $(this).val().indexOf("k") && (t *= 1e3),
                    isNaN(t) ? t = 0 : $(this).val(t),
                    a += t,
                    Market.Memory.res[e] = Market.Data.Res[e] - t
                });
                var e = Market.Data.Trader.capacity() - a;
                Market.Set.freeCapacitiy(e),
                Market.Modes.send.Alter.freeCapacity()
            },
            Alter: {
                freeCapacity: function() {
                    $("a.insert").each(function() {
                        var e = $(this).data("res")
                          , t = Market.Memory.res[e]
                          , a = 0
                          , a = t < Market.Memory.freeCapacity ? t : Market.Memory.freeCapacity
                          , t = $('input.resources_max[name="' + e + '"]');
                        a < 0 ? ($(t).css("color", "red"),
                        a = 0) : $(t).css("color", ""),
                        $(this).text("(" + a + ")")
                    })
                }
            }
        },
        mass_create_offers: {
            group_id: 0,
            villages: {},
            lock_create: !1,
            lock_fill: !1,
            default_offer: {
                sell_value: "",
                sell_type: "wood",
                buy_value: "",
                buy_type: "wood",
                count: 0,
                max_time: 5
            },
            init: function() {
                var t = this;
                $("#template_save_button").click(function(e) {
                    e.preventDefault(),
                    t.saveTemplate(t.readTemplate())
                }),
                $("#offer_fill_button").click(function(e) {
                    e.preventDefault(),
                    t.fillFromTemplate(t.readTemplate())
                }),
                $("#market_offers").submit(function(e) {
                    e.preventDefault(),
                    t.createOffers()
                }),
                $("#offer_sell_type, #offer_buy_type").width(Math.max($("#offer_sell_type").width(), $("#offer_buy_type").width()))
            },
            initForReal: function() {
                0 < Object.keys(this.villages).length && this.initVillageForm()
            },
            displayCreationErrors: function(e) {
                var a = '<div class="error_box"><div class="content">' + _("c5cb67f0b95f090ae2f9d1958d16f370") + "<ul>";
                $.each(e, function(e, t) {
                    a += "<li>" + escapeHtml(t) + "</li>"
                }),
                a += "</ul></div></div>",
                $("#offer_creation_errors").html(a)
            },
            hideCreationErrors: function() {
                $("#offer_creation_errors").html("")
            },
            updateVillageInfo: function(e) {
                $("#village_info_res_" + e.id).html(e.res_string),
                $("#village_info_storage_" + e.id).html(Format.number(e.storage_max)),
                $("#village_info_traders_" + e.id).html(e.trader_free + "/" + e.trader_max),
                this.villages[e.id] = e
            },
            resetVillageOffer: function(e) {
                this.setVillageOffer(e, this.default_offer)
            },
            setVillageOffer: function(t, a) {
                Object.getOwnPropertyNames(a).forEach(function(e) {
                    $("#offer_" + e + "_" + t).val(a[e])
                })
            },
            readTemplate: function() {
                return {
                    sell_value: parseInt($("#offer_sell_value").val()) || 0,
                    sell_type: $("#offer_sell_type").val(),
                    buy_value: parseInt($("#offer_buy_value").val()) || 0,
                    buy_type: $("#offer_buy_type").val(),
                    count: parseInt($("#offer_count").val()) || 0,
                    max_time: parseInt($("#offer_max_time").val()) || 0,
                    buffer_wood: parseInt($("#offer_buffer_wood").val()) || 0,
                    buffer_stone: parseInt($("#offer_buffer_stone").val()) || 0,
                    buffer_iron: parseInt($("#offer_buffer_iron").val()) || 0,
                    buffer_trader: parseInt($("#offer_buffer_trader").val()) || 0
                }
            },
            saveTemplate: function(e) {
                e = $.extend({
                    group_id: this.group_id
                }, e);
                TribalWars.post("market", {
                    ajaxaction: "save_offer_creation_template"
                }, e, function(e) {
                    UI.SuccessMessage(_("55392dda51628cc7223acbdb6ef2ba21"))
                })
            },
            fillFromTemplate: function(l) {
                var c, e;
                this.lock_fill || (this.lockFill(),
                c = this,
                e = function() {
                    c.unlockFill()
                }
                ,
                l.sell_type === l.buy_type ? (UI.ErrorMessage(_("48da431332c8f7200e8380d37db87c5a")),
                e()) : l.max_time < 1 || 96 < l.max_time ? (UI.ErrorMessage(_("af9e24f1816a566658089aaef7a52c52")),
                e()) : setTimeout(function() {
                    $.each(c.villages, function(e, t) {
                        var a, r, o, i, n, f = l.sell_type, s = ("greatest" === f && (a = -1,
                        Resources.types.forEach(function(e) {
                            t[e] > a && (a = t[f = e])
                        })),
                        l.buy_type);
                        "least" === s && (r = 99999999,
                        Resources.types.forEach(function(e) {
                            t[e] < r && (r = t[s = e])
                        })),
                        f == s || (i = t[f],
                        o = l["buffer_" + f],
                        i = Math.max(0, i - o),
                        o = Math.floor(i / l.sell_value),
                        i = Math.max(0, t.trader_free - l.buffer_trader),
                        n = Math.ceil(l.sell_value / t.trader_carry),
                        i = Math.floor(i / n),
                        (n = Math.min(l.count, o, i)) < 1) ? c.resetVillageOffer(e) : c.setVillageOffer(e, {
                            count: n,
                            sell_value: l.sell_value,
                            sell_type: f,
                            buy_value: l.buy_value,
                            buy_type: s,
                            max_time: l.max_time
                        })
                    }),
                    e()
                }, 1))
            },
            createOffers: function() {
                var a, i, e, t, r, n;
                this.lock_create || (this.hideCreationErrors(),
                this.lockCreate(),
                a = 0,
                $.each(this.villages, function(e, t) {
                    0 < $("#offer_count_" + e).val() && a++
                }),
                0 === a ? (this.unlockCreate(),
                UI.ErrorMessage(_("0ec7b8af9110d483cd4adf024dfdd796"))) : (i = this,
                e = $("#mass_offer_creation"),
                t = $("#offer_creation_creating"),
                r = e.find(".blocker"),
                t.show(),
                r.show(),
                e.css("opacity", .4),
                n = function() {
                    i.unlockCreate(),
                    r.hide(),
                    e.css("opacity", 1),
                    t.hide()
                }
                ,
                TribalWars.post("market", {
                    ajaxaction: "mass_create_offers"
                }, $("#market_offers").serializeArray(), function(t) {
                    function a() {
                        for (; o < r.length; ) {
                            var e = r[o];
                            if (i.updateVillageInfo(t.villages[e]),
                            void 0 !== t.successful_offers[e] && i.resetVillageOffer(e),
                            ++o % 50 == 0)
                                break
                        }
                        o === r.length ? ($.isEmptyObject(t.village_errors) || i.displayCreationErrors(t.village_errors),
                        n(),
                        t.success_message ? UI.SuccessMessage(t.success_message) : $.isEmptyObject(t.village_errors) && UI.ErrorMessage(_("6702ed629cdae1de9cf1afdb7441ef6c"))) : setTimeout(function() {
                            a()
                        }, 1)
                    }
                    var r = Object.keys(t.villages)
                      , o = 0;
                    a()
                }, function() {
                    n()
                })))
            },
            lockCreate: function() {
                this.lock_create = !0,
                $("#market_offers").find(".btn_offer_create").prop("disabled", !0)
            },
            unlockCreate: function() {
                this.lock_create = !1,
                $("#market_offers").find(".btn_offer_create").prop("disabled", !1)
            },
            lockFill: function() {
                this.lock_fill = !0,
                $("#offer_fill_button").addClass("btn-disabled")
            },
            unlockFill: function() {
                this.lock_fill = !1,
                $("#offer_fill_button").removeClass("btn-disabled")
            },
            initVillageForm: function() {
                var t = this
                  , a = $("#offer_creation_loading")
                  , r = a.find(".mass-progress div")
                  , o = $("#mass_offer_creation")
                  , i = $("#offer_creation_villages").find("tbody")
                  , n = (this.lockFill(),
                this.lockCreate(),
                Object.keys(t.villages))
                  , f = 30
                  , s = 0
                  , l = function() {
                    for (; s < n.length; ) {
                        var e = n[s];
                        if (i.append(t.genVillageRow(t.villages[e])),
                        s++,
                        r.width(s / n.length * 100 + "%"),
                        s % f == 0)
                            break
                    }
                    s === n.length ? (t.unlockFill(),
                    t.unlockCreate(),
                    a.hide(),
                    o.find(".blocker").hide(),
                    o.css("opacity", 1)) : setTimeout(function() {
                        l()
                    }, 1)
                };
                l()
            },
            genVillageRow: function(e) {
                return "<tr><td>" + e.village + '</td><td id="village_info_res_' + e.id + '">' + e.res_string + '</td><td id="village_info_storage_' + e.id + '">' + Format.number(e.storage_max) + '</td><td id="village_info_traders_' + e.id + '">' + e.trader_free + "/" + e.trader_max + '</td><td><table class="vis">' + this.genResSelect(_("1d6f8052d9fe441bd9e7dd4261191cab"), "sell", e.id) + this.genResSelect(_("e77711cc92bbb8bb0bcfb9453706640f"), "buy", e.id) + '</table></td><td><input id="offer_count_' + e.id + '" name="offers[' + e.id + '][count]" type="text" value="0" style="width:50px"> ' + _("9461bed8b71377318436990e57106729") + '</td><td><input id="offer_max_time_' + e.id + '" name="offers[' + e.id + '][max_time]" type="text" value="' + this.default_offer.max_time + '" style="width:50px"> ' + _("6a7e73161603d87b26a8eac49dab0a9c") + "</td></tr>"
            },
            genResSelect: function(e, t, a) {
                return '<tr><td style="white-space:nowrap">' + e + '</td><td><input id="offer_' + t + "_value_" + a + '" name="offers[' + a + "][" + t + '_value]" type="text" style="width:50px"></td><td><select id="offer_' + t + "_type_" + a + '" name="offers[' + a + "][" + t + '_type]">' + $.map(Resources.names, function(e, t) {
                    return '<option value="' + t + '">' + e + "</option>"
                }).join("") + "</select></td></tr>"
            }
        }
    },
    AjaxRequest: {
        changeMaxTime: function(e, t, a, r) {
            $.ajax({
                type: "POST",
                url: e,
                data: {
                    text: parseInt(t)
                },
                dataType: "json",
                success: function(e) {
                    e.error ? UI.ErrorMessage(e.error, 3e3) : e.success && $(a).html(e.max_time_string),
                    $(r).val(e.max_time_value)
                }
            })
        }
    }
};

;var MapHighlighter;
MapHighlighter = {
    colorVillage: function(l) {
        var a = 0 < l.owner && TWMap.players[l.owner] ? TWMap.players[l.owner].ally : 0
          , a = TWMap.getColorByPlayer(l.owner, a, l.id);
        $("#map_village_" + l.id).css("background-color", "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")")
    },
    colorPlayer: function(e) {
        $.each(TWMap.villages, function(l, a) {
            parseInt(a.owner) === parseInt(e) && MapHighlighter.colorVillage(a)
        })
    },
    colorAlly: function(e) {
        $.each(TWMap.players, function(l, a) {
            parseInt(a.ally) === parseInt(e) && MapHighlighter.colorPlayer(l)
        })
    },
    colorAll: function(l, a, e) {
        $.each(l, function(l, a) {
            void 0 !== TWMap.villageKey[a] && MapHighlighter.colorVillage(TWMap.villages[TWMap.villageKey[a]])
        }),
        $.each(a, function(l, a) {
            MapHighlighter.colorPlayer(a)
        }),
        $.each(e, function(l, a) {
            MapHighlighter.colorAlly(a)
        })
    },
    alterVillage: function(l, a) {
        null === a ? delete TWMap.villageColors[l] : TWMap.villageColors[l] = a
    },
    alterPlayer: function(l, a) {
        null === a ? delete TWMap.playerColors[l] : TWMap.playerColors[l] = a
    },
    alterAlly: function(l, a) {
        null === a ? delete TWMap.allyColors[l] : TWMap.allyColors[l] = a
    },
    alterAll: function(l, a, e) {
        TWMap.allyColors = e,
        TWMap.playerColors = a,
        TWMap.villageColors = l
    }
};

;var MapLegend;
MapLegend = {
    CATEGORY_STANDARD: "standard",
    CATEGORY_TRIBAL: "tribal",
    CATEGORY_OWN: "own",
    CATEGORY_OTHER: "other",
    $container: null,
    init: function() {
        this.$container = $("#map_legend")
    },
    addHighlight: function(t, i, a, n, e) {
        var i = $("<div>").addClass("map_legend").attr("data-active", 1).attr("data-id", i)
          , d = $("<div>");
        n && d.css("background-color", "rgb(" + n.r + "," + n.g + "," + n.b + ")"),
        e && d.css({
            "background-image": 'url("' + e + '")',
            "background-size": "15px 15px"
        }),
        i.append(d),
        i.append(" <span>" + escapeHtml(a) + "</span>"),
        this.$container.find('[data-category="' + t + '"]').find("td:nth-child(2)").append(i)
    },
    removeHighlight: function(t, i) {
        this.$container.find('[data-category="' + t + '"]').find('[data-id="' + i + '"]').remove(),
        this.updateVisibility()
    },
    updateHighlight: function(t, i, a, n, e) {
        t = this.$container.find('[data-category="' + t + '"]').find('[data-id="' + i + '"]'),
        i = t.find("div"),
        n = n ? "rgb(" + n.r + "," + n.g + "," + n.b + ")" : "none";
        i.css("background-color", n),
        e && i.css({
            "background-image": 'url("' + escapeHtml(e) + '")',
            "background-size": "15px 15px"
        }),
        null !== a && t.find("span").text(a)
    },
    showHighlight: function(t, i) {
        this.$container.find('[data-category="' + t + '"]').find('[data-id="' + i + '"]').attr("data-active", 1),
        this.updateVisibility()
    },
    hideHighlight: function(t, i) {
        this.$container.find('[data-category="' + t + '"]').find('[data-id="' + i + '"]').attr("data-active", 0),
        this.updateVisibility()
    },
    updateVisibility: function() {
        this.$container.find('.map_legend[data-active="1"]').show(),
        this.$container.find('.map_legend[data-active="0"]').hide();
        var a = this
          , n = 0;
        $.each([this.CATEGORY_STANDARD, this.CATEGORY_TRIBAL, this.CATEGORY_OWN, this.CATEGORY_OTHER], function(t, i) {
            a.countActiveHighlights(i) < 1 ? a.hideCategory(i) : (a.showCategory(i),
            n++)
        }),
        n < 2 ? this.hideCategoryLabels() : this.showCategoryLabels()
    },
    showCategory: function(t) {
        this.$container.find('[data-category="' + t + '"]').show()
    },
    hideCategory: function(t) {
        this.$container.find('[data-category="' + t + '"]').hide()
    },
    showCategoryLabels: function() {
        this.$container.find("tr td:first-child").show()
    },
    hideCategoryLabels: function() {
        this.$container.find("tr td:first-child").hide()
    },
    countActiveHighlights: function(t) {
        return this.$container.find('[data-category="' + t + '"]').find('.map_legend[data-active="1"]').length
    }
};

;var AttackPlanner;
( () => {
    function t(a, e) {
        $(".attack-planner").html(a.html),
        a.message && UI.SuccessMessage(a.message),
        a.map_info && (o = 0 === a.map_info.length ? {} : Object.assign(a.map_info),
        TWMap.attackPlannerMode = e,
        TWMap.reload(!1)),
        $(".attack-planner-edit-order").click(function(a) {
            a.preventDefault(),
            TribalWars.post("map", {
                ajax: "attack_planner_edit_form"
            }, {
                order_id: $(this).data("order-id")
            }, function(a) {
                var e;
                t(a, 2),
                (e = $(".attack-planner-edit-form form")) && (e.submit(function(a) {
                    if (a.preventDefault(),
                    $(".attack-order-submit").hasClass("btn-disabled"))
                        return !1;
                    $(".attack-order-submit, .attack-order-cancel").addClass("btn-disabled"),
                    TribalWars.post("map", {
                        ajax: "attack_planner_edit"
                    }, e.serialize(), function(a) {
                        a.errors ? r(a.errors) : (TWMap.attackPlannerGeneration++,
                        t(a, 1)),
                        $(".attack-order-submit, .attack-order-cancel").removeClass("btn-disabled")
                    }, function() {
                        $(".attack-order-submit, .attack-order-cancel").removeClass("btn-disabled")
                    })
                }),
                n())
            })
        }),
        $(".attack-planner-delete-order").click(function(a) {
            a.preventDefault();
            var e = $(this)
              , a = [{
                text: _("75f128539caa5408392f566fb12bdb5d"),
                callback: function() {
                    TribalWars.post("map", {
                        ajax: "attack_planner_delete"
                    }, {
                        order_id: e.data("order-id")
                    }, function(a) {
                        TWMap.attackPlannerGeneration++,
                        t(a, 1)
                    })
                },
                confirm: !0
            }, {
                text: _("ea4788705e6873b424c65e91c2846b19"),
                callback: function() {},
                cancel: !0
            }];
            UI.ConfirmationBox(_("09fb2c3f1f8b29d225e1a9ad768a8057"), a, "confirmation-box", !0)
        }),
        $(".attack-planner-new-order").click(function() {
            TribalWars.get("map", {
                ajax: "attack_planner_new_form"
            }, function(a) {
                var e;
                t(a, 2),
                (e = $(".attack-planner-new-form form")) && (UnitPopup.initLinks(),
                e.submit(function(a) {
                    if (a.preventDefault(),
                    $(".attack-order-submit").hasClass("btn-disabled"))
                        return !1;
                    TribalWars.post("map", {
                        ajax: "attack_planner_new"
                    }, e.serialize(), function(a) {
                        a.errors ? r(a.errors) : (TWMap.attackPlannerGeneration++,
                        t(a, 1)),
                        $(".attack-order-submit, .attack-order-cancel").removeClass("btn-disabled")
                    }, function() {
                        $(".attack-order-submit, .attack-order-cancel").removeClass("btn-disabled")
                    })
                }),
                n())
            })
        }),
        $(".attack-planner-export-order").click(function() {
            TribalWars.post("map", {
                ajax: "attack_planner_export_order"
            }, {
                order_id: $(this).data("order-id")
            }, function(a) {
                Dialog.close(!1),
                Dialog.show("help", a.export),
                $("#attack-planner-copy").click(function() {
                    var a = $("#attack-planner-export-order");
                    navigator.clipboard ? navigator.clipboard.writeText(a.val()) : (a.focus(),
                    a.select(),
                    document.execCommand("copy"))
                })
            })
        }),
        $(".attack-planner-order-name").click(function() {
            $("#attack-planner-detail-" + $(this).data("order-id")).toggle(),
            $(this).find(".slide-up, .slide-down").toggle()
        }),
        $("#attack-planner-sort").change(function() {
            var a = $(this).val();
            TribalWars.post("map", {
                ajax: "attack_planner"
            }, {
                sort: a
            }, function(a) {
                t(a, 1)
            })
        }),
        TWMap.map.mover.preventDrag(!1),
        0 < $(".premium_direct_buy").length && Premium.directBuy.init()
    }
    function r(a) {
        var t = $(".attack-planner-errors");
        t.html(""),
        $.each(a, function(a, e) {
            t.append("<p>" + e + "</p>")
        }),
        t.append("<hr />")
    }
    function n() {
        $(".attack-order-cancel").click(function(a) {
            a.preventDefault(),
            $(".attack-order-cancel").hasClass("btn-disabled") || TribalWars.get("map", {
                ajax: "attack_planner"
            }, function(a) {
                t(a, 1)
            })
        }),
        $("#order_villages").change(function() {
            var a = $(this).val().split(",");
            o = {},
            $.each(a, function(a, e) {
                var e = e.split("|")
                  , t = 1e3 * parseInt(e[0]) + parseInt(e[1]);
                TWMap.villages[t] && "ghost" != TWMap.villages[t].special && (t = TWMap.villages[t],
                o[t.id] = {
                    x: parseInt(e[0]),
                    y: parseInt(e[1])
                })
            }),
            $("#order-villages-count").html(Object.keys(o).length),
            TWMap.reload(!1)
        }),
        $("#order_arrival_time").Zebra_DatePicker({
            format: "d.m.Y H:i:s",
            direction: !0,
            readonly_element: !1,
            show_icon: !1,
            show_select_today: _("1dd1c5fb7f25cd41b291d43a89e3aefd"),
            lang_clear_date: _("4239f67c37eed41d01bce841e2409c08"),
            days: [_("9d1a0949c39e66a0cd65240bc0ac9177"), _("6f8522e0610541f1ef215a22ffa66ff6"), _("5792315f09a5d54fb7e3d066672b507f"), _("796c163589f295373e171842f37265d5"), _("78ae6f0cd191d25147e252dc54768238"), _("c33b138a163847cdb6caeeb7c9a126b4"), _("8b7051187b9191cdcdae6ed5a10e5adc")],
            months: [_("86f5978d9b80124f509bdb71786e929e"), _("659e59f062c75f81259d22786d6c44aa"), _("fa3e5edac607a88d8fd7ecb9d6d67424"), _("3fcf026bbfffb63fb24b8de9d0446949"), _("195fbb57ffe7449796d23466085ce6d8"), _("688937ccaf2a2b0c45a1c9bbba09698d"), _("1b539f6f34e8503c97f6d3421346b63c"), _("41ba70891fb6f39327d8ccb9b1dafb84"), _("cc5d90569e1c8313c2b1c2aab1401174"), _("eca60ae8611369fe28a02e2ab8c5d12e"), _("7e823b37564da492ca1629b4732289a8"), _("82331503174acbae012b2004f6431fa5")]
        }),
        $("#order_players_select_all").click(function() {
            $(".order_players").prop("checked", $(this).is(":checked"))
        }),
        $("#order_allow_repeats").change(function() {
            $("#order_repeats").prop("disabled", !$(this).is(":checked"))
        }),
        function() {
            i.map_mover = $("#map_mover"),
            i.select = ( () => {
                var a = $("<div/>");
                return a.css({
                    height: "100%",
                    width: "100%",
                    "z-index": "10",
                    "background-image": i.map_mover.css("background-image"),
                    position: "absolute",
                    left: "0px",
                    top: "0px"
                }).attr("id", "attack-planner-selection").hide(),
                a.insertAfter("#map_mover"),
                a
            }
            )(),
            TWMap.map.mover.preventDrag(jQuery.proxy(function(a, e) {
                var e = [e[0] - a[0], e[1] - a[1]]
                  , t = i.map_mover.offset();
                t.left -= $(window).scrollLeft(),
                t.top -= $(window).scrollTop(),
                a = [a[0] - t.left, a[1] - t.top],
                e[0] < 0 && (a[0] += e[0],
                e[0] = -e[0]),
                e[1] < 0 && (a[1] += e[1],
                e[1] = -e[1]),
                l = [a[0], a[1], a[0] + e[0], a[1] + e[1]],
                i.select.height(e[1]).width(e[0]).css({
                    top: a[1] + "px",
                    left: a[0] + "px"
                })
            }, this), jQuery.proxy(function() {
                i.select.css({
                    height: "0px",
                    width: "0px"
                }).show()
            }, this), jQuery.proxy(function() {
                i.select.hide();
                var a = [~~(e = (l[0] + TWMap.map.pos[0]) / TWMap.map.scale[0]), ~~(t = (l[1] + TWMap.map.pos[1]) / TWMap.map.scale[1])]
                  , e = (l[2] + TWMap.map.pos[0]) / TWMap.map.scale[0]
                  , t = (l[3] + TWMap.map.pos[1]) / TWMap.map.scale[1]
                  , r = [~~e, ~~t];
                for (e = a[0]; e <= r[0]; e++)
                    for (t = a[1]; t <= r[1]; t++) {
                        var n = TWMap.villages[1e3 * e + t];
                        n && "ghost" != n.special && (o[n.id] ? delete o[n.id] : o[n.id] = {
                            x: e,
                            y: t
                        })
                    }
                c(),
                TWMap.reload(!1)
            }, this))
        }()
    }
    function c() {
        var t = [];
        $.each(o, function(a, e) {
            t.push(e.x + "|" + e.y)
        }),
        $("#order_villages").val(t.join()),
        $("#order-villages-count").html(t.length)
    }
    var o, i, l;
    i = {
        select: null,
        map_mover: null
    },
    l = [0, 0, 0, 0],
    AttackPlanner = {
        getMapInfo: function() {
            return o
        },
        init: function() {
            $("#attack_planner_enabled").is(":checked") ? TribalWars.get("map", {
                ajax: "attack_planner"
            }, function(a) {
                TWMap.attackPlannerGeneration++,
                t(a, 1)
            }) : ($(".attack-planner").html(""),
            TWMap.attackPlannerMode && (TWMap.attackPlannerMode = !1,
            TWMap.reload(!1)))
        },
        onVillageClicked: function(a, e, t) {
            if ("ghost" == TWMap.villages[1e3 * e + t].special)
                return !1;
            o[a] ? delete o[a] : o[a] = {
                x: e,
                y: t
            },
            c(),
            TWMap.reload(!1)
        }
    }
}
)();

;