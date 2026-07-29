Report = {
    PREVIEW_DESIRED_SIZE: 518,
    PREVIEW_MIN_SCALE: .75,
    previewing: !1,
    Data: {},
    Memory: {
        toggle: {}
    },
    init: function() {
        $(".report-link").on("mouseenter", function() {
            var e = $(this);
            Report.previewing = e.data("id"),
            e.parents("tr").first().offset().left >= Report.PREVIEW_DESIRED_SIZE * Report.PREVIEW_MIN_SCALE && setTimeout(function() {
                Report.showPreview(e)
            }, 100)
        }).on("mouseleave", function() {
            Report.closePreview()
        }),
        $(".report-filter-checkbox").on("click", () => {
            document.getElementById("battle_filter_form").submit()
        }
        )
    },
    showPreview: function(l) {
        var a;
        Report.previewing === l.data("id") && (a = l.parents("tr").first(),
        TribalWars.get("report", {
            ajax: "view",
            id: l.data("id")
        }, function(e) {
            var t, o, r, i, n, p;
            Report.previewing === l.data("id") && (t = (t = a.offset().left) > Report.PREVIEW_DESIRED_SIZE ? 1 : t / Report.PREVIEW_DESIRED_SIZE,
            o = $(".report-preview"),
            r = $(".report-preview-content"),
            i = a.offset().left - Report.PREVIEW_DESIRED_SIZE * t,
            n = a.offset().top - 50 - $(window).scrollTop(),
            p = $(window).height(),
            r.html(e.dialog),
            o.show().css({
                left: i + "px",
                top: n + "px",
                transform: "scale(" + t + ")"
            }),
            p - 100 < (e = r.height()) + n && o.css("top", (n = (p - e) / 2) + "px"),
            setTimeout(function() {
                Report.markRead(l.data("id"))
            }, 2e3))
        }))
    },
    markRead: function(e) {
        Report.previewing === e && ($(".report-" + e).removeClass("unread"),
        TribalWars.post("report", {
            ajaxaction: "mark_read"
        }, {
            id: e
        }, function() {}, function() {}, !0))
    },
    closePreview: function() {
        Report.previewing = !1,
        $(".report-preview").hide()
    },
    registerCollapsible: function() {
        $("fieldset.collapsible > legend > a").each(function() {
            $(this).click(Report.toggleCollapsible),
            $(this).attr("id", Math.round(1e4 * Math.random()))
        })
    },
    toggleCollapsible: function(e) {
        var t = parseInt($(this).attr("id"));
        Report.Memory.toggle[t] ? Report.Memory.toggle[t] += 1 : Report.Memory.toggle[t] = 1,
        Report.Memory.toggle[t] % 2 ? ($(this).children("img").attr("src", "graphic/arrow_up_padd.png?1"),
        $(this).parent().nextAll().show()) : ($(this).children("img").attr("src", "graphic/arrow_down_padd.png?1"),
        $(this).parent().nextAll().hide())
    },
    toggleFilters: function(e, t) {
        $(".report_filter, #report_filter_hide").toggle(),
        $.ajax({
            url: e,
            type: "POST",
            data: {
                filter_shown: t
            }
        })
    },
    RealMassForward: {
        init: function() {
            Report.registerCollapsible()
        }
    },
    Publish: {
        init: function() {
            $('input[type="checkbox"]').length - 1 == $("input:checked").length && Report.Publish.toggleAll()
        },
        toggleAll: function() {
            this.toggle ? ($('input[type="checkbox"]').prop("checked", !1),
            this.toggle = !1) : (this.toggle = !0,
            $('input[type="checkbox"]').prop("checked", !0))
        }
    }
},
$(function() {
    Report.init()
});

//--------------------------------

var ReportView;
ReportView = {
    BuddyRequest: {
        init: function() {
            $("#reject_buddy").click(function() {
                ReportView.BuddyRequest.confirmReject($(this).data("id"))
            })
        },
        confirmReject: function(e) {
            var t = _("85ca9fe82717848c8a0d369403f73d1d");
            UI.addConfirmBox(t, function() {
                ReportView.BuddyRequest.reject(e)
            })
        },
        reject: function(e) {
            TribalWars.post("buddies", {
                ajaxaction: "reject_buddy",
                buddy_id: e
            }, {}, function() {
                partialReload(),
                UI.SuccessMessage(_("43e7650efbe98b140bf0e27a242dbe15"))
            })
        }
    },
    Nav: {
        init: function() {
            document.querySelectorAll(".report-nav-btn").forEach(function(t) {
                t.addEventListener("click", function(e) {
                    e.preventDefault(),
                    TribalWars.get("report", {
                        ajax: "get_nav_id",
                        id: t.dataset.id,
                        date_forwarded: t.dataset.forwarded,
                        report_mode: t.dataset.mode,
                        group_id: t.dataset.group,
                        direction: t.dataset.direction,
                        important_only: t.dataset.importantOnly
                    }, function(e) {
                        e.id && (window.location.href = TribalWars.buildURL("GET", "report", {
                            mode: t.dataset.mode,
                            group_id: t.dataset.group,
                            view: e.id,
                            important_only: t.dataset.importantOnly
                        }))
                    })
                })
            })
        }
    },
    AllyInvite: {
        init: function() {
            $("#reject_invite").click(function() {
                ReportView.AllyInvite.confirmReject($(this).data("id"))
            })
        },
        confirmReject: function(e) {
            var t = _("40368688d2a4c3c767177828269c8d1a");
            UI.addConfirmBox(t, function() {
                ReportView.AllyInvite.reject(e)
            })
        },
        reject: function(e) {
            TribalWars.post("ally", {
                ajaxaction: "reject_invite",
                id: e
            }, {}, function() {
                partialReload(),
                UI.SuccessMessage(_("70472b8bb3cc6e3f1bddfba6836a2232"))
            })
        }
    }
},
document.addEventListener("DOMContentLoaded", function() {
    ReportView.Nav.init()
});

//--------------------------------

