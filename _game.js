Array.prototype.fill || Object.defineProperty(Array.prototype, "fill", {
    value: function(r) {
        if (null == this)
            throw new TypeError("this is null or not defined");
        for (var t = Object(this), e = t.length >>> 0, n = arguments[1] >> 0, i = n < 0 ? Math.max(e + n, 0) : Math.min(n, e), n = arguments[2], n = void 0 === n ? e : n >> 0, o = n < 0 ? Math.max(e + n, 0) : Math.min(n, e); i < o; )
            t[i] = r,
            i++;
        return t
    }
}),
Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
    value: function(r) {
        if (null == this)
            throw new TypeError('"this" is null or not defined');
        var t = Object(this)
          , e = t.length >>> 0;
        if ("function" != typeof r)
            throw new TypeError("predicate must be a function");
        for (var n = arguments[1], i = 0; i < e; ) {
            var o = t[i];
            if (r.call(n, o, i, t))
                return o;
            i++
        }
    },
    configurable: !0,
    writable: !0
}),
Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
    value: function(r, t) {
        if (null == this)
            throw new TypeError('"this" is null or not defined');
        var e = Object(this)
          , n = e.length >>> 0;
        if (0 != n)
            for (var i, o, t = 0 | t, a = Math.max(0 <= t ? t : n - Math.abs(t), 0); a < n; ) {
                if ((i = e[a]) === (o = r) || "number" == typeof i && "number" == typeof o && isNaN(i) && isNaN(o))
                    return !0;
                a++
            }
        return !1
    }
});

;String.prototype.repeat || (String.prototype.repeat = function(t) {
    if (null == this)
        throw new TypeError("can't convert " + this + " to object");
    var r = "" + this;
    if ((t = (t = +t) != t ? 0 : t) < 0)
        throw new RangeError("repeat count must be non-negative");
    if (t == 1 / 0)
        throw new RangeError("repeat count must be less than infinity");
    if (t = Math.floor(t),
    0 == r.length || 0 == t)
        return "";
    if (1 << 28 <= r.length * t)
        throw new RangeError("repeat count must not overflow maximum string size");
    for (var e = "", n = 0; n < t; n++)
        e += r;
    return e
}
),
String.prototype.padStart || (String.prototype.padStart = function(t, r) {
    return t >>= 0,
    r = String(void 0 !== r ? r : " "),
    this.length > t ? String(this) : ((t -= this.length) > r.length && (r += r.repeat(t / r.length)),
    r.slice(0, t) + String(this))
}
);

;( (e, t) => {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (e.document)
            return t(e);
        throw new Error("jQuery requires a window with a document")
    }
    : t(e)
}
)("undefined" != typeof window ? window : this, function(w, R) {
    function v(e) {
        return "function" == typeof e && "number" != typeof e.nodeType
    }
    function g(e) {
        return null != e && e === e.window
    }
    var t = []
      , M = Object.getPrototypeOf
      , s = t.slice
      , I = t.flat ? function(e) {
        return t.flat.call(e)
    }
    : function(e) {
        return t.concat.apply([], e)
    }
      , W = t.push
      , F = t.indexOf
      , B = {}
      , $ = B.toString
      , _ = B.hasOwnProperty
      , z = _.toString
      , U = z.call(Object)
      , y = {}
      , T = w.document
      , X = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    };
    function V(e, t, n) {
        var r, i, o = (n = n || T).createElement("script");
        if (o.text = e,
        t)
            for (r in X)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function h(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? B[$.call(e)] || "object" : typeof e
    }
    var e = "3.5.1"
      , C = function(e, t) {
        return new C.fn.init(e,t)
    };
    function G(e) {
        var t = !!e && "length"in e && e.length
          , n = h(e);
        return !v(e) && !g(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    C.fn = C.prototype = {
        jquery: e,
        constructor: C,
        length: 0,
        toArray: function() {
            return s.call(this)
        },
        get: function(e) {
            return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            e = C.merge(this.constructor(), e);
            return e.prevObject = this,
            e
        },
        each: function(e) {
            return C.each(this, e)
        },
        map: function(n) {
            return this.pushStack(C.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(s.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(C.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(C.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
              , e = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= e && e < t ? [this[e]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: W,
        sort: t.sort,
        splice: t.splice
    },
    C.extend = C.fn.extend = function() {
        var e, t, n, r, i, o = arguments[0] || {}, a = 1, s = arguments.length, u = !1;
        for ("boolean" == typeof o && (u = o,
        o = arguments[a] || {},
        a++),
        "object" == typeof o || v(o) || (o = {}),
        a === s && (o = this,
        a--); a < s; a++)
            if (null != (e = arguments[a]))
                for (t in e)
                    n = e[t],
                    "__proto__" !== t && o !== n && (u && n && (C.isPlainObject(n) || (r = Array.isArray(n))) ? (i = o[t],
                    i = r && !Array.isArray(i) ? [] : r || C.isPlainObject(i) ? i : {},
                    r = !1,
                    o[t] = C.extend(u, i, n)) : void 0 !== n && (o[t] = n));
        return o
    }
    ,
    C.extend({
        expando: "jQuery" + (e + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            return !(!e || "[object Object]" !== $.call(e) || (e = M(e)) && ("function" != typeof (e = _.call(e, "constructor") && e.constructor) || z.call(e) !== U))
        },
        isEmptyObject: function(e) {
            for (var t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, n) {
            V(e, {
                nonce: t && t.nonce
            }, n)
        },
        each: function(e, t) {
            var n, r = 0;
            if (G(e))
                for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                    ;
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        makeArray: function(e, t) {
            t = t || [];
            return null != e && (G(Object(e)) ? C.merge(t, "string" == typeof e ? [e] : e) : W.call(t, e)),
            t
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : F.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) != a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, o = 0, a = [];
            if (G(e))
                for (r = e.length; o < r; o++)
                    null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e)
                    null != (i = t(e[o], o, n)) && a.push(i);
            return I(a)
        },
        guid: 1,
        support: y
    }),
    "function" == typeof Symbol && (C.fn[Symbol.iterator] = t[Symbol.iterator]),
    C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        B["[object " + t + "]"] = t.toLowerCase()
    });
    function r(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && C(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
    function Y(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
    var e = (R => {
        function f(e, t) {
            return e = "0x" + e.slice(1) - 65536,
            t || (e < 0 ? String.fromCharCode(65536 + e) : String.fromCharCode(e >> 10 | 55296, 1023 & e | 56320))
        }
        function M(e, t) {
            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }
        function I() {
            T()
        }
        var e, p, b, o, W, d, F, B, w, u, l, T, C, n, E, h, r, i, g, S = "sizzle" + +new Date, c = R.document, k = 0, $ = 0, _ = q(), z = q(), U = q(), y = q(), X = function(e, t) {
            return e === t && (l = !0),
            0
        }, V = {}.hasOwnProperty, t = [], G = t.pop, Y = t.push, A = t.push, Q = t.slice, v = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", a = "[\\x20\\t\\r\\n\\f]", s = "(?:\\\\[\\da-fA-F]{1,6}" + a + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", K = "\\[" + a + "*(" + s + ")(?:" + a + "*([*^$|!~]?=)" + a + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + s + "))|)" + a + "*\\]", Z = ":(" + s + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + K + ")*)|.*)\\)|)", ee = new RegExp(a + "+","g"), m = new RegExp("^" + a + "+|((?:^|[^\\\\])(?:\\\\.)*)" + a + "+$","g"), te = new RegExp("^" + a + "*," + a + "*"), ne = new RegExp("^" + a + "*([>+~]|" + a + ")" + a + "*"), re = new RegExp(a + "|>"), ie = new RegExp(Z), oe = new RegExp("^" + s + "$"), x = {
            ID: new RegExp("^#(" + s + ")"),
            CLASS: new RegExp("^\\.(" + s + ")"),
            TAG: new RegExp("^(" + s + "|[*])"),
            ATTR: new RegExp("^" + K),
            PSEUDO: new RegExp("^" + Z),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + a + "*(even|odd|(([+-]|)(\\d*)n|)" + a + "*(?:([+-]|)" + a + "*(\\d+)|))" + a + "*\\)|)","i"),
            bool: new RegExp("^(?:" + J + ")$","i"),
            needsContext: new RegExp("^" + a + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + a + "*((?:-\\d)?\\d*)" + a + "*\\)|)(?=[^-]|$)","i")
        }, ae = /HTML$/i, se = /^(?:input|select|textarea|button)$/i, ue = /^h\d$/i, N = /^[^{]+\{\s*\[native \w/, le = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ce = /[+~]/, D = new RegExp("\\\\[\\da-fA-F]{1,6}" + a + "?|\\\\([^\\r\\n\\f])","g"), fe = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, pe = ve(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            A.apply(t = Q.call(c.childNodes), c.childNodes),
            t[c.childNodes.length].nodeType
        } catch (e) {
            A = {
                apply: t.length ? function(e, t) {
                    Y.apply(e, Q.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        function j(t, e, n, r) {
            var i, o, a, s, u, l, c = e && e.ownerDocument, f = e ? e.nodeType : 9;
            if (n = n || [],
            "string" != typeof t || !t || 1 !== f && 9 !== f && 11 !== f)
                return n;
            if (!r && (T(e),
            e = e || C,
            E)) {
                if (11 !== f && (s = le.exec(t)))
                    if (i = s[1]) {
                        if (9 === f) {
                            if (!(l = e.getElementById(i)))
                                return n;
                            if (l.id === i)
                                return n.push(l),
                                n
                        } else if (c && (l = c.getElementById(i)) && g(e, l) && l.id === i)
                            return n.push(l),
                            n
                    } else {
                        if (s[2])
                            return A.apply(n, e.getElementsByTagName(t)),
                            n;
                        if ((i = s[3]) && p.getElementsByClassName && e.getElementsByClassName)
                            return A.apply(n, e.getElementsByClassName(i)),
                            n
                    }
                if (p.qsa && !y[t + " "] && (!h || !h.test(t)) && (1 !== f || "object" !== e.nodeName.toLowerCase())) {
                    if (l = t,
                    c = e,
                    1 === f && (re.test(t) || ne.test(t))) {
                        for ((c = ce.test(t) && ye(e.parentNode) || e) === e && p.scope || ((a = e.getAttribute("id")) ? a = a.replace(fe, M) : e.setAttribute("id", a = S)),
                        o = (u = d(t)).length; o--; )
                            u[o] = (a ? "#" + a : ":scope") + " " + P(u[o]);
                        l = u.join(",")
                    }
                    try {
                        return A.apply(n, c.querySelectorAll(l)),
                        n
                    } catch (e) {
                        y(t, !0)
                    } finally {
                        a === S && e.removeAttribute("id")
                    }
                }
            }
            return B(t.replace(m, "$1"), e, n, r)
        }
        function q() {
            var n = [];
            function r(e, t) {
                return n.push(e + " ") > b.cacheLength && delete r[n.shift()],
                r[e + " "] = t
            }
            return r
        }
        function L(e) {
            return e[S] = !0,
            e
        }
        function H(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t)
            }
        }
        function de(e, t) {
            for (var n = e.split("|"), r = n.length; r--; )
                b.attrHandle[n[r]] = t
        }
        function he(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function ge(t) {
            return function(e) {
                return "form"in e ? e.parentNode && !1 === e.disabled ? "label"in e ? "label"in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && pe(e) === t : e.disabled === t : "label"in e && e.disabled === t
            }
        }
        function O(a) {
            return L(function(o) {
                return o = +o,
                L(function(e, t) {
                    for (var n, r = a([], e.length, o), i = r.length; i--; )
                        e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }
        function ye(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        for (e in p = j.support = {},
        W = j.isXML = function(e) {
            var t = e.namespaceURI
              , e = (e.ownerDocument || e).documentElement;
            return !ae.test(t || e && e.nodeName || "HTML")
        }
        ,
        T = j.setDocument = function(e) {
            var e = e ? e.ownerDocument || e : c;
            return e != C && 9 === e.nodeType && e.documentElement && (n = (C = e).documentElement,
            E = !W(C),
            c != C && (e = C.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", I, !1) : e.attachEvent && e.attachEvent("onunload", I)),
            p.scope = H(function(e) {
                return n.appendChild(e).appendChild(C.createElement("div")),
                void 0 !== e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
            }),
            p.attributes = H(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            p.getElementsByTagName = H(function(e) {
                return e.appendChild(C.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            p.getElementsByClassName = N.test(C.getElementsByClassName),
            p.getById = H(function(e) {
                return n.appendChild(e).id = S,
                !C.getElementsByName || !C.getElementsByName(S).length
            }),
            p.getById ? (b.filter.ID = function(e) {
                var t = e.replace(D, f);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            b.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && E)
                    return (t = t.getElementById(e)) ? [t] : []
            }
            ) : (b.filter.ID = function(e) {
                var t = e.replace(D, f);
                return function(e) {
                    e = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return e && e.value === t
                }
            }
            ,
            b.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && E) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        for (i = t.getElementsByName(e),
                        r = 0; o = i[r++]; )
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            b.find.TAG = p.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : p.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" !== e)
                    return o;
                for (; n = o[i++]; )
                    1 === n.nodeType && r.push(n);
                return r
            }
            ,
            b.find.CLASS = p.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && E)
                    return t.getElementsByClassName(e)
            }
            ,
            r = [],
            h = [],
            (p.qsa = N.test(C.querySelectorAll)) && (H(function(e) {
                var t;
                n.appendChild(e).innerHTML = "<a id='" + S + "'></a><select id='" + S + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && h.push("[*^$]=" + a + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || h.push("\\[" + a + "*(?:value|" + J + ")"),
                e.querySelectorAll("[id~=" + S + "-]").length || h.push("~="),
                (t = C.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || h.push("\\[" + a + "*name" + a + "*=" + a + "*(?:''|\"\")"),
                e.querySelectorAll(":checked").length || h.push(":checked"),
                e.querySelectorAll("a#" + S + "+*").length || h.push(".#.+[+~]"),
                e.querySelectorAll("\\\f"),
                h.push("[\\r\\n\\f]")
            }),
            H(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && h.push("name" + a + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && h.push(":enabled", ":disabled"),
                n.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && h.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                h.push(",.*:")
            })),
            (p.matchesSelector = N.test(i = n.matches || n.webkitMatchesSelector || n.mozMatchesSelector || n.oMatchesSelector || n.msMatchesSelector)) && H(function(e) {
                p.disconnectedMatch = i.call(e, "*"),
                i.call(e, "[s!='']:x"),
                r.push("!=", Z)
            }),
            h = h.length && new RegExp(h.join("|")),
            r = r.length && new RegExp(r.join("|")),
            e = N.test(n.compareDocumentPosition),
            g = e || N.test(n.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , t = t && t.parentNode;
                return e === t || !(!t || 1 !== t.nodeType || !(n.contains ? n.contains(t) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(t)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            X = e ? function(e, t) {
                var n;
                return e === t ? (l = !0,
                0) : (n = !e.compareDocumentPosition - !t.compareDocumentPosition) || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !p.sortDetached && t.compareDocumentPosition(e) === n ? e == C || e.ownerDocument == c && g(c, e) ? -1 : t == C || t.ownerDocument == c && g(c, t) ? 1 : u ? v(u, e) - v(u, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return l = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, a = [e], s = [t];
                if (!i || !o)
                    return e == C ? -1 : t == C ? 1 : i ? -1 : o ? 1 : u ? v(u, e) - v(u, t) : 0;
                if (i === o)
                    return he(e, t);
                for (n = e; n = n.parentNode; )
                    a.unshift(n);
                for (n = t; n = n.parentNode; )
                    s.unshift(n);
                for (; a[r] === s[r]; )
                    r++;
                return r ? he(a[r], s[r]) : a[r] == c ? -1 : s[r] == c ? 1 : 0
            }
            ),
            C
        }
        ,
        j.matches = function(e, t) {
            return j(e, null, null, t)
        }
        ,
        j.matchesSelector = function(e, t) {
            if (T(e),
            p.matchesSelector && E && !y[t + " "] && (!r || !r.test(t)) && (!h || !h.test(t)))
                try {
                    var n = i.call(e, t);
                    if (n || p.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {
                    y(t, !0)
                }
            return 0 < j(t, C, null, [e]).length
        }
        ,
        j.contains = function(e, t) {
            return (e.ownerDocument || e) != C && T(e),
            g(e, t)
        }
        ,
        j.attr = function(e, t) {
            (e.ownerDocument || e) != C && T(e);
            var n = b.attrHandle[t.toLowerCase()]
              , n = n && V.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
            return void 0 !== n ? n : p.attributes || !E ? e.getAttribute(t) : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        }
        ,
        j.escape = function(e) {
            return (e + "").replace(fe, M)
        }
        ,
        j.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        j.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (l = !p.detectDuplicates,
            u = !p.sortStable && e.slice(0),
            e.sort(X),
            l) {
                for (; t = e[i++]; )
                    t === e[i] && (r = n.push(i));
                for (; r--; )
                    e.splice(n[r], 1)
            }
            return u = null,
            e
        }
        ,
        o = j.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += o(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                for (; t = e[r++]; )
                    n += o(t);
            return n
        }
        ,
        (b = j.selectors = {
            cacheLength: 50,
            createPseudo: L,
            match: x,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(D, f),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(D, f),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || j.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && j.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return x.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ie.test(n) && (t = (t = d(n, !0)) && n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(D, f).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = _[e + " "];
                    return t || (t = new RegExp("(^|" + a + ")" + e + "(" + a + "|$)")) && _(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(t, n, r) {
                    return function(e) {
                        e = j.attr(e, t);
                        return null == e ? "!=" === n : !n || (e += "",
                        "=" === n ? e === r : "!=" === n ? e !== r : "^=" === n ? r && 0 === e.indexOf(r) : "*=" === n ? r && -1 < e.indexOf(r) : "$=" === n ? r && e.slice(-r.length) === r : "~=" === n ? -1 < (" " + e.replace(ee, " ") + " ").indexOf(r) : "|=" === n && (e === r || e.slice(0, r.length + 1) === r + "-"))
                    }
                },
                CHILD: function(h, e, t, g, y) {
                    var m = "nth" !== h.slice(0, 3)
                      , v = "last" !== h.slice(-4)
                      , x = "of-type" === e;
                    return 1 === g && 0 === y ? function(e) {
                        return !!e.parentNode
                    }
                    : function(e, t, n) {
                        var r, i, o, a, s, u, l = m != v ? "nextSibling" : "previousSibling", c = e.parentNode, f = x && e.nodeName.toLowerCase(), p = !n && !x, d = !1;
                        if (c) {
                            if (m) {
                                for (; l; ) {
                                    for (a = e; a = a[l]; )
                                        if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType)
                                            return !1;
                                    u = l = "only" === h && !u && "nextSibling"
                                }
                                return !0
                            }
                            if (u = [v ? c.firstChild : c.lastChild],
                            v && p) {
                                for (d = (s = (r = (i = (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]) && r[2],
                                a = s && c.childNodes[s]; a = ++s && a && a[l] || (d = s = 0,
                                u.pop()); )
                                    if (1 === a.nodeType && ++d && a === e) {
                                        i[h] = [k, s, d];
                                        break
                                    }
                            } else if (!1 === (d = p ? s = (r = (i = (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1] : d))
                                for (; (a = ++s && a && a[l] || (d = s = 0,
                                u.pop())) && ((x ? a.nodeName.toLowerCase() !== f : 1 !== a.nodeType) || !++d || (p && ((i = (o = a[S] || (a[S] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [k, d]),
                                a !== e)); )
                                    ;
                            return (d -= y) === g || d % g == 0 && 0 <= d / g
                        }
                    }
                },
                PSEUDO: function(e, o) {
                    var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || j.error("unsupported pseudo: " + e);
                    return a[S] ? a(o) : 1 < a.length ? (t = [e, e, "", o],
                    b.setFilters.hasOwnProperty(e.toLowerCase()) ? L(function(e, t) {
                        for (var n, r = a(e, o), i = r.length; i--; )
                            e[n = v(e, r[i])] = !(t[n] = r[i])
                    }) : function(e) {
                        return a(e, 0, t)
                    }
                    ) : a
                }
            },
            pseudos: {
                not: L(function(e) {
                    var r = []
                      , i = []
                      , s = F(e.replace(m, "$1"));
                    return s[S] ? L(function(e, t, n, r) {
                        for (var i, o = s(e, null, r, []), a = e.length; a--; )
                            (i = o[a]) && (e[a] = !(t[a] = i))
                    }) : function(e, t, n) {
                        return r[0] = e,
                        s(r, null, n, i),
                        r[0] = null,
                        !i.pop()
                    }
                }),
                has: L(function(t) {
                    return function(e) {
                        return 0 < j(t, e).length
                    }
                }),
                contains: L(function(t) {
                    return t = t.replace(D, f),
                    function(e) {
                        return -1 < (e.textContent || o(e)).indexOf(t)
                    }
                }),
                lang: L(function(n) {
                    return oe.test(n || "") || j.error("unsupported lang: " + n),
                    n = n.replace(D, f).toLowerCase(),
                    function(e) {
                        var t;
                        do {
                            if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                                return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1
                    }
                }),
                target: function(e) {
                    var t = R.location && R.location.hash;
                    return t && t.slice(1) === e.id
                },
                root: function(e) {
                    return e === n
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: ge(!1),
                disabled: ge(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !b.pseudos.empty(e)
                },
                header: function(e) {
                    return ue.test(e.nodeName)
                },
                input: function(e) {
                    return se.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (e = e.getAttribute("type")) || "text" === e.toLowerCase())
                },
                first: O(function() {
                    return [0]
                }),
                last: O(function(e, t) {
                    return [t - 1]
                }),
                eq: O(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: O(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: O(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: O(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: O(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = b.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            b.pseudos[e] = (t => function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
            )(e);
        for (e in {
            submit: !0,
            reset: !0
        })
            b.pseudos[e] = (n => function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
            )(e);
        function me() {}
        function P(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function ve(a, e, t) {
            var s = e.dir
              , u = e.next
              , l = u || s
              , c = t && "parentNode" === l
              , f = $++;
            return e.first ? function(e, t, n) {
                for (; e = e[s]; )
                    if (1 === e.nodeType || c)
                        return a(e, t, n);
                return !1
            }
            : function(e, t, n) {
                var r, i, o = [k, f];
                if (n) {
                    for (; e = e[s]; )
                        if ((1 === e.nodeType || c) && a(e, t, n))
                            return !0
                } else
                    for (; e = e[s]; )
                        if (1 === e.nodeType || c)
                            if (i = (i = e[S] || (e[S] = {}))[e.uniqueID] || (i[e.uniqueID] = {}),
                            u && u === e.nodeName.toLowerCase())
                                e = e[s] || e;
                            else {
                                if ((r = i[l]) && r[0] === k && r[1] === f)
                                    return o[2] = r[2];
                                if ((i[l] = o)[2] = a(e, t, n))
                                    return !0
                            }
                return !1
            }
        }
        function xe(i) {
            return 1 < i.length ? function(e, t, n) {
                for (var r = i.length; r--; )
                    if (!i[r](e, t, n))
                        return !1;
                return !0
            }
            : i[0]
        }
        function be(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
                !(o = e[s]) || n && !n(o, r, i) || (a.push(o),
                l && t.push(s));
            return a
        }
        function we(d, h, g, y, m, e) {
            return y && !y[S] && (y = we(y)),
            m && !m[S] && (m = we(m, e)),
            L(function(e, t, n, r) {
                var i, o, a, s = [], u = [], l = t.length, c = e || ( (e, t, n) => {
                    for (var r = 0, i = t.length; r < i; r++)
                        j(e, t[r], n);
                    return n
                }
                )(h || "*", n.nodeType ? [n] : n, []), f = !d || !e && h ? c : be(c, s, d, n, r), p = g ? m || (e ? d : l || y) ? [] : t : f;
                if (g && g(f, p, n, r),
                y)
                    for (i = be(p, u),
                    y(i, [], n, r),
                    o = i.length; o--; )
                        (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
                if (e) {
                    if (m || d) {
                        if (m) {
                            for (i = [],
                            o = p.length; o--; )
                                (a = p[o]) && i.push(f[o] = a);
                            m(null, p = [], i, r)
                        }
                        for (o = p.length; o--; )
                            (a = p[o]) && -1 < (i = m ? v(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else
                    p = be(p === t ? p.splice(l, p.length) : p),
                    m ? m(null, t, p, r) : A.apply(t, p)
            })
        }
        function Te(y, m) {
            function e(e, t, n, r, i) {
                var o, a, s, u = 0, l = "0", c = e && [], f = [], p = w, d = e || x && b.find.TAG("*", i), h = k += null == p ? 1 : Math.random() || .1, g = d.length;
                for (i && (w = t == C || t || i); l !== g && null != (o = d[l]); l++) {
                    if (x && o) {
                        for (a = 0,
                        t || o.ownerDocument == C || (T(o),
                        n = !E); s = y[a++]; )
                            if (s(o, t || C, n)) {
                                r.push(o);
                                break
                            }
                        i && (k = h)
                    }
                    v && ((o = !s && o) && u--,
                    e) && c.push(o)
                }
                if (u += l,
                v && l !== u) {
                    for (a = 0; s = m[a++]; )
                        s(c, f, t, n);
                    if (e) {
                        if (0 < u)
                            for (; l--; )
                                c[l] || f[l] || (f[l] = G.call(r));
                        f = be(f)
                    }
                    A.apply(r, f),
                    i && !e && 0 < f.length && 1 < u + m.length && j.uniqueSort(r)
                }
                return i && (k = h,
                w = p),
                c
            }
            var v = 0 < m.length
              , x = 0 < y.length;
            return v ? L(e) : e
        }
        return me.prototype = b.filters = b.pseudos,
        b.setFilters = new me,
        d = j.tokenize = function(e, t) {
            var n, r, i, o, a, s, u, l = z[e + " "];
            if (l)
                return t ? 0 : l.slice(0);
            for (a = e,
            s = [],
            u = b.preFilter; a; ) {
                for (o in n && !(r = te.exec(a)) || (r && (a = a.slice(r[0].length) || a),
                s.push(i = [])),
                n = !1,
                (r = ne.exec(a)) && (n = r.shift(),
                i.push({
                    value: n,
                    type: r[0].replace(m, " ")
                }),
                a = a.slice(n.length)),
                b.filter)
                    !(r = x[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(),
                    i.push({
                        value: n,
                        type: o,
                        matches: r
                    }),
                    a = a.slice(n.length));
                if (!n)
                    break
            }
            return t ? a.length : a ? j.error(e) : z(e, s).slice(0)
        }
        ,
        F = j.compile = function(e, t) {
            var n, r = [], i = [], o = U[e + " "];
            if (!o) {
                for (n = (t = t || d(e)).length; n--; )
                    ((o = function e(t) {
                        for (var r, n, i, o = t.length, a = b.relative[t[0].type], s = a || b.relative[" "], u = a ? 1 : 0, l = ve(function(e) {
                            return e === r
                        }, s, !0), c = ve(function(e) {
                            return -1 < v(r, e)
                        }, s, !0), f = [function(e, t, n) {
                            return e = !a && (n || t !== w) || ((r = t).nodeType ? l : c)(e, t, n),
                            r = null,
                            e
                        }
                        ]; u < o; u++)
                            if (n = b.relative[t[u].type])
                                f = [ve(xe(f), n)];
                            else {
                                if ((n = b.filter[t[u].type].apply(null, t[u].matches))[S]) {
                                    for (i = ++u; i < o && !b.relative[t[i].type]; i++)
                                        ;
                                    return we(1 < u && xe(f), 1 < u && P(t.slice(0, u - 1).concat({
                                        value: " " === t[u - 2].type ? "*" : ""
                                    })).replace(m, "$1"), n, u < i && e(t.slice(u, i)), i < o && e(t = t.slice(i)), i < o && P(t))
                                }
                                f.push(n)
                            }
                        return xe(f)
                    }(t[n]))[S] ? r : i).push(o);
                (o = U(e, Te(i, r))).selector = e
            }
            return o
        }
        ,
        B = j.select = function(e, t, n, r) {
            var i, o, a, s, u, l = "function" == typeof e && e, c = !r && d(e = l.selector || e);
            if (n = n || [],
            1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(D, f), t) || [])[0]))
                        return n;
                    l && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (i = x.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                !b.relative[s = a.type]); )
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(D, f), ce.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        e = r.length && P(o))
                            break;
                        return A.apply(n, r),
                        n
                    }
            }
            return (l || F(e, c))(r, t, !E, n, !t || ce.test(e) && ye(t.parentNode) || t),
            n
        }
        ,
        p.sortStable = S.split("").sort(X).join("") === S,
        p.detectDuplicates = !!l,
        T(),
        p.sortDetached = H(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }),
        H(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || de("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        p.attributes && H(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || de("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        H(function(e) {
            return null == e.getAttribute("disabled")
        }) || de(J, function(e, t, n) {
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        }),
        j
    }
    )(w)
      , Q = (C.find = e,
    C.expr = e.selectors,
    C.expr[":"] = C.expr.pseudos,
    C.uniqueSort = C.unique = e.uniqueSort,
    C.text = e.getText,
    C.isXMLDoc = e.isXML,
    C.contains = e.contains,
    C.escapeSelector = e.escape,
    C.expr.match.needsContext);
    function u(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var J = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function K(e, n, r) {
        return v(n) ? C.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? C.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? C.grep(e, function(e) {
            return -1 < F.call(n, e) !== r
        }) : C.filter(n, e, r)
    }
    C.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? C.find.matchesSelector(r, e) ? [r] : [] : C.find.matches(e, C.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    C.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(C(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (C.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                C.find(e, i[t], n);
            return 1 < r ? C.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(K(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(K(this, e || [], !0))
        },
        is: function(e) {
            return !!K(this, "string" == typeof e && Q.test(e) ? C(e) : e || [], !1).length
        }
    });
    var Z, ee = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, te = ((C.fn.init = function(e, t, n) {
        if (e) {
            if (n = n || Z,
            "string" != typeof e)
                return e.nodeType ? (this[0] = e,
                this.length = 1,
                this) : v(e) ? void 0 !== n.ready ? n.ready(e) : e(C) : C.makeArray(e, this);
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : ee.exec(e)) || !r[1] && t)
                return (!t || t.jquery ? t || n : this.constructor(t)).find(e);
            if (r[1]) {
                if (t = t instanceof C ? t[0] : t,
                C.merge(this, C.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : T, !0)),
                J.test(r[1]) && C.isPlainObject(t))
                    for (var r in t)
                        v(this[r]) ? this[r](t[r]) : this.attr(r, t[r])
            } else
                (n = T.getElementById(r[2])) && (this[0] = n,
                this.length = 1)
        }
        return this
    }
    ).prototype = C.fn,
    Z = C(T),
    /^(?:parents|prev(?:Until|All))/), ne = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function re(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    C.fn.extend({
        has: function(e) {
            var t = C(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (C.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && C(e);
            if (!Q.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && C.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? C.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? F.call(C(e), this[0]) : F.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(C.uniqueSort(C.merge(this.get(), C(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    C.each({
        parent: function(e) {
            e = e.parentNode;
            return e && 11 !== e.nodeType ? e : null
        },
        parents: function(e) {
            return r(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return r(e, "parentNode", n)
        },
        next: function(e) {
            return re(e, "nextSibling")
        },
        prev: function(e) {
            return re(e, "previousSibling")
        },
        nextAll: function(e) {
            return r(e, "nextSibling")
        },
        prevAll: function(e) {
            return r(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return r(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return r(e, "previousSibling", n)
        },
        siblings: function(e) {
            return Y((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return Y(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && M(e.contentDocument) ? e.contentDocument : (u(e, "template") && (e = e.content || e),
            C.merge([], e.childNodes))
        }
    }, function(r, i) {
        C.fn[r] = function(e, t) {
            var n = C.map(this, i, e);
            return (t = "Until" !== r.slice(-5) ? e : t) && "string" == typeof t && (n = C.filter(t, n)),
            1 < this.length && (ne[r] || C.uniqueSort(n),
            te.test(r)) && n.reverse(),
            this.pushStack(n)
        }
    });
    var E = /[^\x20\t\r\n\f]+/g;
    function c(e) {
        return e
    }
    function ie(e) {
        throw e
    }
    function oe(e, t, n, r) {
        var i;
        try {
            e && v(i = e.promise) ? i.call(e).done(t).fail(n) : e && v(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    C.Callbacks = function(r) {
        var e, n;
        r = "string" == typeof r ? (e = r,
        n = {},
        C.each(e.match(E) || [], function(e, t) {
            n[t] = !0
        }),
        n) : C.extend({}, r);
        function i() {
            for (s = s || r.once,
            a = o = !0; l.length; c = -1)
                for (t = l.shift(); ++c < u.length; )
                    !1 === u[c].apply(t[0], t[1]) && r.stopOnFalse && (c = u.length,
                    t = !1);
            r.memory || (t = !1),
            o = !1,
            s && (u = t ? [] : "")
        }
        var o, t, a, s, u = [], l = [], c = -1, f = {
            add: function() {
                return u && (t && !o && (c = u.length - 1,
                l.push(t)),
                function n(e) {
                    C.each(e, function(e, t) {
                        v(t) ? r.unique && f.has(t) || u.push(t) : t && t.length && "string" !== h(t) && n(t)
                    })
                }(arguments),
                t) && !o && i(),
                this
            },
            remove: function() {
                return C.each(arguments, function(e, t) {
                    for (var n; -1 < (n = C.inArray(t, u, n)); )
                        u.splice(n, 1),
                        n <= c && c--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < C.inArray(e, u) : 0 < u.length
            },
            empty: function() {
                return u = u && [],
                this
            },
            disable: function() {
                return s = l = [],
                u = t = "",
                this
            },
            disabled: function() {
                return !u
            },
            lock: function() {
                return s = l = [],
                t || o || (u = t = ""),
                this
            },
            locked: function() {
                return !!s
            },
            fireWith: function(e, t) {
                return s || (t = [e, (t = t || []).slice ? t.slice() : t],
                l.push(t),
                o) || i(),
                this
            },
            fire: function() {
                return f.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!a
            }
        };
        return f
    }
    ,
    C.extend({
        Deferred: function(e) {
            var o = [["notify", "progress", C.Callbacks("memory"), C.Callbacks("memory"), 2], ["resolve", "done", C.Callbacks("once memory"), C.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", C.Callbacks("once memory"), C.Callbacks("once memory"), 1, "rejected"]]
              , i = "pending"
              , a = {
                state: function() {
                    return i
                },
                always: function() {
                    return s.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return a.then(null, e)
                },
                pipe: function() {
                    var i = arguments;
                    return C.Deferred(function(r) {
                        C.each(o, function(e, t) {
                            var n = v(i[t[4]]) && i[t[4]];
                            s[t[1]](function() {
                                var e = n && n.apply(this, arguments);
                                e && v(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                            })
                        }),
                        i = null
                    }).promise()
                },
                then: function(t, n, r) {
                    var u = 0;
                    function l(i, o, a, s) {
                        return function() {
                            function e() {
                                var e, t;
                                if (!(i < u)) {
                                    if ((e = a.apply(n, r)) === o.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    t = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    v(t) ? s ? t.call(e, l(u, o, c, s), l(u, o, ie, s)) : (u++,
                                    t.call(e, l(u, o, c, s), l(u, o, ie, s), l(u, o, c, o.notifyWith))) : (a !== c && (n = void 0,
                                    r = [e]),
                                    (s || o.resolveWith)(n, r))
                                }
                            }
                            var n = this
                              , r = arguments
                              , t = s ? e : function() {
                                try {
                                    e()
                                } catch (e) {
                                    C.Deferred.exceptionHook && C.Deferred.exceptionHook(e, t.stackTrace),
                                    u <= i + 1 && (a !== ie && (n = void 0,
                                    r = [e]),
                                    o.rejectWith(n, r))
                                }
                            }
                            ;
                            i ? t() : (C.Deferred.getStackHook && (t.stackTrace = C.Deferred.getStackHook()),
                            w.setTimeout(t))
                        }
                    }
                    return C.Deferred(function(e) {
                        o[0][3].add(l(0, e, v(r) ? r : c, e.notifyWith)),
                        o[1][3].add(l(0, e, v(t) ? t : c)),
                        o[2][3].add(l(0, e, v(n) ? n : ie))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? C.extend(e, a) : a
                }
            }
              , s = {};
            return C.each(o, function(e, t) {
                var n = t[2]
                  , r = t[5];
                a[t[1]] = n.add,
                r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock),
                n.add(t[3].fire),
                s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? void 0 : this, arguments),
                    this
                }
                ,
                s[t[0] + "With"] = n.fireWith
            }),
            a.promise(s),
            e && e.call(s, s),
            s
        },
        when: function(e) {
            function t(t) {
                return function(e) {
                    i[t] = this,
                    o[t] = 1 < arguments.length ? s.call(arguments) : e,
                    --n || a.resolveWith(i, o)
                }
            }
            var n = arguments.length
              , r = n
              , i = Array(r)
              , o = s.call(arguments)
              , a = C.Deferred();
            if (n <= 1 && (oe(e, a.done(t(r)).resolve, a.reject, !n),
            "pending" === a.state() || v(o[r] && o[r].then)))
                return a.then();
            for (; r--; )
                oe(o[r], t(r), a.reject);
            return a.promise()
        }
    });
    var ae = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/
      , se = (C.Deferred.exceptionHook = function(e, t) {
        w.console && w.console.warn && e && ae.test(e.name) && w.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }
    ,
    C.readyException = function(e) {
        w.setTimeout(function() {
            throw e
        })
    }
    ,
    C.Deferred());
    function ue() {
        T.removeEventListener("DOMContentLoaded", ue),
        w.removeEventListener("load", ue),
        C.ready()
    }
    C.fn.ready = function(e) {
        return se.then(e).catch(function(e) {
            C.readyException(e)
        }),
        this
    }
    ,
    C.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --C.readyWait : C.isReady) || (C.isReady = !0) !== e && 0 < --C.readyWait || se.resolveWith(T, [C])
        }
    }),
    C.ready.then = se.then,
    "complete" === T.readyState || "loading" !== T.readyState && !T.documentElement.doScroll ? w.setTimeout(C.ready) : (T.addEventListener("DOMContentLoaded", ue),
    w.addEventListener("load", ue));
    function f(e, t, n, r, i, o, a) {
        var s = 0
          , u = e.length
          , l = null == n;
        if ("object" === h(n))
            for (s in i = !0,
            n)
                f(e, t, s, n[s], !0, o, a);
        else if (void 0 !== r && (i = !0,
        v(r) || (a = !0),
        t = l ? a ? (t.call(e, r),
        null) : (l = t,
        function(e, t, n) {
            return l.call(C(e), n)
        }
        ) : t))
            for (; s < u; s++)
                t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
        return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
    }
    var le = /^-ms-/
      , ce = /-([a-z])/g;
    function fe(e, t) {
        return t.toUpperCase()
    }
    function x(e) {
        return e.replace(le, "ms-").replace(ce, fe)
    }
    function m(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }
    function pe() {
        this.expando = C.expando + pe.uid++
    }
    pe.uid = 1,
    pe.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            m(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[x(t)] = n;
            else
                for (r in t)
                    i[x(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][x(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(x) : (t = x(t))in r ? [t] : t.match(E) || []).length;
                    for (; n--; )
                        delete r[t[n]]
                }
                void 0 !== t && !C.isEmptyObject(r) || (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            e = e[this.expando];
            return void 0 !== e && !C.isEmptyObject(e)
        }
    };
    var b = new pe
      , l = new pe
      , de = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , he = /[A-Z]/g;
    function ge(e, t, n) {
        var r, i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(he, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : de.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                l.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    C.extend({
        hasData: function(e) {
            return l.hasData(e) || b.hasData(e)
        },
        data: function(e, t, n) {
            return l.access(e, t, n)
        },
        removeData: function(e, t) {
            l.remove(e, t)
        },
        _data: function(e, t, n) {
            return b.access(e, t, n)
        },
        _removeData: function(e, t) {
            b.remove(e, t)
        }
    }),
    C.fn.extend({
        data: function(n, e) {
            var t, r, i, o = this[0], a = o && o.attributes;
            if (void 0 !== n)
                return "object" == typeof n ? this.each(function() {
                    l.set(this, n)
                }) : f(this, function(e) {
                    var t;
                    if (o && void 0 === e)
                        return void 0 !== (t = l.get(o, n)) || void 0 !== (t = ge(o, n)) ? t : void 0;
                    this.each(function() {
                        l.set(this, n, e)
                    })
                }, null, e, 1 < arguments.length, null, !0);
            if (this.length && (i = l.get(o),
            1 === o.nodeType) && !b.get(o, "hasDataAttrs")) {
                for (t = a.length; t--; )
                    a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = x(r.slice(5)),
                    ge(o, r, i[r]));
                b.set(o, "hasDataAttrs", !0)
            }
            return i
        },
        removeData: function(e) {
            return this.each(function() {
                l.remove(this, e)
            })
        }
    }),
    C.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return r = b.get(e, t = (t || "fx") + "queue"),
                n && (!r || Array.isArray(n) ? r = b.access(e, t, C.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = C.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = C._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, function() {
                C.dequeue(e, t)
            }, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return b.get(e, n) || b.access(e, n, {
                empty: C.Callbacks("once memory").add(function() {
                    b.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    C.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t,
            t = "fx",
            e--),
            arguments.length < e ? C.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = C.queue(this, t, n);
                C._queueHooks(this, t),
                "fx" === t && "inprogress" !== e[0] && C.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                C.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            function n() {
                --i || o.resolveWith(a, [a])
            }
            var r, i = 1, o = C.Deferred(), a = this, s = this.length;
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; s--; )
                (r = b.get(a[s], e + "queueHooks")) && r.empty && (i++,
                r.empty.add(n));
            return n(),
            o.promise(t)
        }
    });
    function ye(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && k(e) && "none" === C.css(e, "display")
    }
    var e = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , me = new RegExp("^(?:([+-])=|)(" + e + ")([a-z%]*)$","i")
      , p = ["Top", "Right", "Bottom", "Left"]
      , S = T.documentElement
      , k = function(e) {
        return C.contains(e.ownerDocument, e)
    }
      , ve = {
        composed: !0
    };
    S.getRootNode && (k = function(e) {
        return C.contains(e.ownerDocument, e) || e.getRootNode(ve) === e.ownerDocument
    }
    );
    function xe(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
            return r.cur()
        }
        : function() {
            return C.css(e, t, "")
        }
        , u = s(), l = n && n[3] || (C.cssNumber[t] ? "" : "px"), c = e.nodeType && (C.cssNumber[t] || "px" !== l && +u) && me.exec(C.css(e, t));
        if (c && c[3] !== l) {
            for (l = l || c[3],
            c = +(u /= 2) || 1; a--; )
                C.style(e, t, c + l),
                (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0),
                c /= o;
            C.style(e, t, (c *= 2) + l),
            n = n || []
        }
        return n && (c = +c || +u || 0,
        i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r) && (r.unit = l,
        r.start = c,
        r.end = i),
        i
    }
    var be = {};
    function A(e, t) {
        for (var n, r, i, o, a, s = [], u = 0, l = e.length; u < l; u++)
            (r = e[u]).style && (n = r.style.display,
            t ? ("none" === n && (s[u] = b.get(r, "display") || null,
            s[u] || (r.style.display = "")),
            "" === r.style.display && ye(r) && (s[u] = (a = o = void 0,
            o = (i = r).ownerDocument,
            (a = be[i = i.nodeName]) || (o = o.body.appendChild(o.createElement(i)),
            a = C.css(o, "display"),
            o.parentNode.removeChild(o),
            be[i] = a = "none" === a ? "block" : a),
            a))) : "none" !== n && (s[u] = "none",
            b.set(r, "display", n)));
        for (u = 0; u < l; u++)
            null != s[u] && (e[u].style.display = s[u]);
        return e
    }
    C.fn.extend({
        show: function() {
            return A(this, !0)
        },
        hide: function() {
            return A(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ye(this) ? C(this).show() : C(this).hide()
            })
        }
    });
    var we = /^(?:checkbox|radio)$/i
      , Te = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i
      , Ce = /^$|^module$|\/(?:java|ecma)script/i
      , N = (L = T.createDocumentFragment().appendChild(T.createElement("div")),
    (a = T.createElement("input")).setAttribute("type", "radio"),
    a.setAttribute("checked", "checked"),
    a.setAttribute("name", "t"),
    L.appendChild(a),
    y.checkClone = L.cloneNode(!0).cloneNode(!0).lastChild.checked,
    L.innerHTML = "<textarea>x</textarea>",
    y.noCloneChecked = !!L.cloneNode(!0).lastChild.defaultValue,
    L.innerHTML = "<option></option>",
    y.option = !!L.lastChild,
    {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    });
    function D(e, t) {
        var n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && u(e, t) ? C.merge([e], n) : n
    }
    function Ee(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            b.set(e[n], "globalEval", !t || b.get(t[n], "globalEval"))
    }
    N.tbody = N.tfoot = N.colgroup = N.caption = N.thead,
    N.th = N.td,
    y.option || (N.optgroup = N.option = [1, "<select multiple='multiple'>", "</select>"]);
    var Se = /<|&#?\w+;/;
    function ke(e, t, n, r, i) {
        for (var o, a, s, u, l, c = t.createDocumentFragment(), f = [], p = 0, d = e.length; p < d; p++)
            if ((o = e[p]) || 0 === o)
                if ("object" === h(o))
                    C.merge(f, o.nodeType ? [o] : o);
                else if (Se.test(o)) {
                    for (a = a || c.appendChild(t.createElement("div")),
                    s = (Te.exec(o) || ["", ""])[1].toLowerCase(),
                    s = N[s] || N._default,
                    a.innerHTML = s[1] + C.htmlPrefilter(o) + s[2],
                    l = s[0]; l--; )
                        a = a.lastChild;
                    C.merge(f, a.childNodes),
                    (a = c.firstChild).textContent = ""
                } else
                    f.push(t.createTextNode(o));
        for (c.textContent = "",
        p = 0; o = f[p++]; )
            if (r && -1 < C.inArray(o, r))
                i && i.push(o);
            else if (u = k(o),
            a = D(c.appendChild(o), "script"),
            u && Ee(a),
            n)
                for (l = 0; o = a[l++]; )
                    Ce.test(o.type || "") && n.push(o);
        return c
    }
    var Ae = /^key/
      , Ne = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , De = /^([^.]*)(?:\.(.+)|)/;
    function n() {
        return !0
    }
    function d() {
        return !1
    }
    function je(e, t) {
        return e === ( () => {
            try {
                return T.activeElement
            } catch (e) {}
        }
        )() == ("focus" === t)
    }
    function qe(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
            n = void 0),
            t)
                qe(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = d;
        else if (!i)
            return e;
        return 1 === o && (a = i,
        (i = function(e) {
            return C().off(e),
            a.apply(this, arguments)
        }
        ).guid = a.guid || (a.guid = C.guid++)),
        e.each(function() {
            C.event.add(this, t, i, r, n)
        })
    }
    function Le(e, i, o) {
        o ? (b.set(e, i, !1),
        C.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t, n, r = b.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r.length)
                        (C.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = s.call(arguments),
                    b.set(this, i, r),
                    t = o(this, i),
                    this[i](),
                    r !== (n = b.get(this, i)) || t ? b.set(this, i, !1) : n = {},
                    r !== n)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        n.value
                } else
                    r.length && (b.set(this, i, {
                        value: C.event.trigger(C.extend(r[0], C.Event.prototype), r.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : void 0 === b.get(e, i) && C.event.add(e, i, n)
    }
    C.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h = b.get(t);
            if (m(t))
                for (n.handler && (n = (o = n).handler,
                i = o.selector),
                i && C.find.matchesSelector(S, i),
                n.guid || (n.guid = C.guid++),
                s = (s = h.events) || (h.events = Object.create(null)),
                a = (a = h.handle) || (h.handle = function(e) {
                    return void 0 !== C && C.event.triggered !== e.type ? C.event.dispatch.apply(t, arguments) : void 0
                }
                ),
                u = (e = (e || "").match(E) || [""]).length; u--; )
                    f = d = (p = De.exec(e[u]) || [])[1],
                    p = (p[2] || "").split(".").sort(),
                    f && (l = C.event.special[f] || {},
                    f = (i ? l.delegateType : l.bindType) || f,
                    l = C.event.special[f] || {},
                    d = C.extend({
                        type: f,
                        origType: d,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && C.expr.match.needsContext.test(i),
                        namespace: p.join(".")
                    }, o),
                    (c = s[f]) || ((c = s[f] = []).delegateCount = 0,
                    l.setup && !1 !== l.setup.call(t, r, p, a)) || t.addEventListener && t.addEventListener(f, a),
                    l.add && (l.add.call(t, d),
                    d.handler.guid || (d.handler.guid = n.guid)),
                    i ? c.splice(c.delegateCount++, 0, d) : c.push(d),
                    C.event.global[f] = !0)
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, y = b.hasData(e) && b.get(e);
            if (y && (u = y.events)) {
                for (l = (t = (t || "").match(E) || [""]).length; l--; )
                    if (d = g = (s = De.exec(t[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d) {
                        for (f = C.event.special[d] || {},
                        p = u[d = (r ? f.delegateType : f.bindType) || d] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = p.length; o--; )
                            c = p[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, y.handle) || C.removeEvent(e, d, y.handle),
                        delete u[d])
                    } else
                        for (d in u)
                            C.event.remove(e, d + t[l], n, r, !0);
                C.isEmptyObject(u) && b.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a = new Array(arguments.length), s = C.event.fix(e), e = (b.get(this, "events") || Object.create(null))[s.type] || [], u = C.event.special[s.type] || {};
            for (a[0] = s,
            t = 1; t < arguments.length; t++)
                a[t] = arguments[t];
            if (s.delegateTarget = this,
            !u.preDispatch || !1 !== u.preDispatch.call(this, s)) {
                for (o = C.event.handlers.call(this, s, e),
                t = 0; (r = o[t++]) && !s.isPropagationStopped(); )
                    for (s.currentTarget = r.elem,
                    n = 0; (i = r.handlers[n++]) && !s.isImmediatePropagationStopped(); )
                        s.rnamespace && !1 !== i.namespace && !s.rnamespace.test(i.namespace) || (s.handleObj = i,
                        s.data = i.data,
                        void 0 !== (i = ((C.event.special[i.origType] || {}).handle || i.handler).apply(r.elem, a)) && !1 === (s.result = i) && (s.preventDefault(),
                        s.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, s),
                s.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [],
                        a = {},
                        n = 0; n < u; n++)
                            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < C(i, this).index(l) : C.find(i, this, null, [l]).length),
                            a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return l = this,
            u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }),
            s
        },
        addProp: function(t, e) {
            Object.defineProperty(C.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: v(e) ? function() {
                    if (this.originalEvent)
                        return e(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[t]
                }
                ,
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[C.expando] ? e : new C.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    e = this || e;
                    return we.test(e.type) && e.click && u(e, "input") && Le(e, "click", n),
                    !1
                },
                trigger: function(e) {
                    e = this || e;
                    return we.test(e.type) && e.click && u(e, "input") && Le(e, "click"),
                    !0
                },
                _default: function(e) {
                    e = e.target;
                    return we.test(e.type) && e.click && u(e, "input") && b.get(e, "click") || u(e, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    C.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    C.Event = function(e, t) {
        if (!(this instanceof C.Event))
            return new C.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? n : d,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && C.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[C.expando] = !0
    }
    ,
    C.Event.prototype = {
        constructor: C.Event,
        isDefaultPrevented: d,
        isPropagationStopped: d,
        isImmediatePropagationStopped: d,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = n,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = n,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = n,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    C.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && Ae.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ne.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, C.event.addProp),
    C.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        C.event.special[e] = {
            setup: function() {
                return Le(this, e, je),
                !1
            },
            trigger: function() {
                return Le(this, e),
                !0
            },
            delegateType: t
        }
    }),
    C.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, i) {
        C.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function(e) {
                var t, n = e.relatedTarget, r = e.handleObj;
                return n && (n === this || C.contains(this, n)) || (e.type = r.origType,
                t = r.handler.apply(this, arguments),
                e.type = i),
                t
            }
        }
    }),
    C.fn.extend({
        on: function(e, t, n, r) {
            return qe(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return qe(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                r = e.handleObj,
                C(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler);
            else {
                if ("object" != typeof e)
                    return !1 !== t && "function" != typeof t || (n = t,
                    t = void 0),
                    !1 === n && (n = d),
                    this.each(function() {
                        C.event.remove(this, e, n, t)
                    });
                for (i in e)
                    this.off(i, t, e[i])
            }
            return this
        }
    });
    var He = /<script|<style|<link/i
      , Oe = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Pe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function Re(e, t) {
        return u(e, "table") && u(11 !== t.nodeType ? t : t.firstChild, "tr") && C(e).children("tbody")[0] || e
    }
    function Me(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function Ie(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function We(e, t) {
        var n, r, i, o;
        if (1 === t.nodeType) {
            if (b.hasData(e) && (o = b.get(e).events))
                for (i in b.remove(t, "handle events"),
                o)
                    for (n = 0,
                    r = o[i].length; n < r; n++)
                        C.event.add(t, i, o[i][n]);
            l.hasData(e) && (e = l.access(e),
            e = C.extend({}, e),
            l.set(t, e))
        }
    }
    function j(n, r, i, o) {
        r = I(r);
        var e, t, a, s, u, l, c = 0, f = n.length, p = f - 1, d = r[0], h = v(d);
        if (h || 1 < f && "string" == typeof d && !y.checkClone && Oe.test(d))
            return n.each(function(e) {
                var t = n.eq(e);
                h && (r[0] = d.call(this, e, t.html())),
                j(t, r, i, o)
            });
        if (f && (t = (e = ke(r, n[0].ownerDocument, !1, n, o)).firstChild,
        1 === e.childNodes.length && (e = t),
        t || o)) {
            for (s = (a = C.map(D(e, "script"), Me)).length; c < f; c++)
                u = e,
                c !== p && (u = C.clone(u, !0, !0),
                s) && C.merge(a, D(u, "script")),
                i.call(n[c], u, c);
            if (s)
                for (l = a[a.length - 1].ownerDocument,
                C.map(a, Ie),
                c = 0; c < s; c++)
                    u = a[c],
                    Ce.test(u.type || "") && !b.access(u, "globalEval") && C.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? C._evalUrl && !u.noModule && C._evalUrl(u.src, {
                        nonce: u.nonce || u.getAttribute("nonce")
                    }, l) : V(u.textContent.replace(Pe, ""), u, l))
        }
        return n
    }
    function Fe(e, t, n) {
        for (var r, i = t ? C.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || C.cleanData(D(r)),
            r.parentNode && (n && k(r) && Ee(D(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    C.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(!0), f = k(e);
            if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || C.isXMLDoc(e)))
                for (a = D(c),
                r = 0,
                i = (o = D(e)).length; r < i; r++)
                    s = o[r],
                    u = a[r],
                    l = void 0,
                    "input" === (l = u.nodeName.toLowerCase()) && we.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || D(e),
                    a = a || D(c),
                    r = 0,
                    i = o.length; r < i; r++)
                        We(o[r], a[r]);
                else
                    We(e, c);
            return 0 < (a = D(c, "script")).length && Ee(a, !f && D(e, "script")),
            c
        },
        cleanData: function(e) {
            for (var t, n, r, i = C.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (m(n)) {
                    if (t = n[b.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? C.event.remove(n, r) : C.removeEvent(n, r, t.handle);
                        n[b.expando] = void 0
                    }
                    n[l.expando] && (n[l.expando] = void 0)
                }
        }
    }),
    C.fn.extend({
        detach: function(e) {
            return Fe(this, e, !0)
        },
        remove: function(e) {
            return Fe(this, e)
        },
        text: function(e) {
            return f(this, function(e) {
                return void 0 === e ? C.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return j(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Re(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return j(this, arguments, function(e) {
                var t;
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (t = Re(this, e)).insertBefore(e, t.firstChild)
            })
        },
        before: function() {
            return j(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return j(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (C.cleanData(D(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return C.clone(this, e, t)
            })
        },
        html: function(e) {
            return f(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !He.test(e) && !N[(Te.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = C.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (C.cleanData(D(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return j(this, arguments, function(e) {
                var t = this.parentNode;
                C.inArray(this, n) < 0 && (C.cleanData(D(this)),
                t) && t.replaceChild(e, this)
            }, n)
        }
    }),
    C.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        C.fn[e] = function(e) {
            for (var t, n = [], r = C(e), i = r.length - 1, o = 0; o <= i; o++)
                t = o === i ? this : this.clone(!0),
                C(r[o])[a](t),
                W.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    function Be(e) {
        var t = e.ownerDocument.defaultView;
        return (t = t && t.opener ? t : w).getComputedStyle(e)
    }
    function $e(e, t, n) {
        var r, i = {};
        for (r in t)
            i[r] = e.style[r],
            e.style[r] = t[r];
        for (r in n = n.call(e),
        t)
            e.style[r] = i[r];
        return n
    }
    var _e, ze, Ue, Xe, Ve, Ge, Ye, i, Qe = new RegExp("^(" + e + ")(?!px)[a-z%]+$","i"), Je = new RegExp(p.join("|"),"i");
    function Ke() {
        var e;
        i && (Ye.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
        i.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
        S.appendChild(Ye).appendChild(i),
        e = w.getComputedStyle(i),
        _e = "1%" !== e.top,
        Ge = 12 === Ze(e.marginLeft),
        i.style.right = "60%",
        Xe = 36 === Ze(e.right),
        ze = 36 === Ze(e.width),
        i.style.position = "absolute",
        Ue = 12 === Ze(i.offsetWidth / 3),
        S.removeChild(Ye),
        i = null)
    }
    function Ze(e) {
        return Math.round(parseFloat(e))
    }
    function et(e, t, n) {
        var r, i, o = e.style;
        return (n = n || Be(e)) && ("" !== (i = n.getPropertyValue(t) || n[t]) || k(e) || (i = C.style(e, t)),
        !y.pixelBoxStyles()) && Qe.test(i) && Je.test(t) && (e = o.width,
        t = o.minWidth,
        r = o.maxWidth,
        o.minWidth = o.maxWidth = o.width = i,
        i = n.width,
        o.width = e,
        o.minWidth = t,
        o.maxWidth = r),
        void 0 !== i ? i + "" : i
    }
    function tt(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    Ye = T.createElement("div"),
    (i = T.createElement("div")).style && (i.style.backgroundClip = "content-box",
    i.cloneNode(!0).style.backgroundClip = "",
    y.clearCloneStyle = "content-box" === i.style.backgroundClip,
    C.extend(y, {
        boxSizingReliable: function() {
            return Ke(),
            ze
        },
        pixelBoxStyles: function() {
            return Ke(),
            Xe
        },
        pixelPosition: function() {
            return Ke(),
            _e
        },
        reliableMarginLeft: function() {
            return Ke(),
            Ge
        },
        scrollboxSize: function() {
            return Ke(),
            Ue
        },
        reliableTrDimensions: function() {
            var e, t, n;
            return null == Ve && (e = T.createElement("table"),
            t = T.createElement("tr"),
            n = T.createElement("div"),
            e.style.cssText = "position:absolute;left:-11111px",
            t.style.height = "1px",
            n.style.height = "9px",
            S.appendChild(e).appendChild(t).appendChild(n),
            n = w.getComputedStyle(t),
            Ve = 3 < parseInt(n.height),
            S.removeChild(e)),
            Ve
        }
    }));
    var nt = ["Webkit", "Moz", "ms"]
      , rt = T.createElement("div").style
      , it = {};
    function ot(e) {
        var t = C.cssProps[e] || it[e];
        return t || (e in rt ? e : it[e] = (e => {
            for (var t = e[0].toUpperCase() + e.slice(1), n = nt.length; n--; )
                if ((e = nt[n] + t)in rt)
                    return e
        }
        )(e) || e)
    }
    var at = /^(none|table(?!-c[ea]).+)/
      , st = /^--/
      , ut = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , lt = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    function ct(e, t, n) {
        var r = me.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function ft(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
          , s = 0
          , u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += C.css(e, n + p[a], !0, i)),
            r ? ("content" === n && (u -= C.css(e, "padding" + p[a], !0, i)),
            "margin" !== n && (u -= C.css(e, "border" + p[a] + "Width", !0, i))) : (u += C.css(e, "padding" + p[a], !0, i),
            "padding" !== n ? u += C.css(e, "border" + p[a] + "Width", !0, i) : s += C.css(e, "border" + p[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0),
        u
    }
    function pt(e, t, n) {
        var r = Be(e)
          , i = (!y.boxSizingReliable() || n) && "border-box" === C.css(e, "boxSizing", !1, r)
          , o = i
          , a = et(e, t, r)
          , s = "offset" + t[0].toUpperCase() + t.slice(1);
        if (Qe.test(a)) {
            if (!n)
                return a;
            a = "auto"
        }
        return (!y.boxSizingReliable() && i || !y.reliableTrDimensions() && u(e, "tr") || "auto" === a || !parseFloat(a) && "inline" === C.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === C.css(e, "boxSizing", !1, r),
        o = s in e) && (a = e[s]),
        (a = parseFloat(a) || 0) + ft(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }
    function o(e, t, n, r, i) {
        return new o.prototype.init(e,t,n,r,i)
    }
    C.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t)
                        return "" === (t = et(e, "opacity")) ? "1" : t
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = x(t), u = st.test(t), l = e.style;
                if (u || (t = ot(s)),
                a = C.cssHooks[t] || C.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" === (o = typeof n) && (i = me.exec(n)) && i[1] && (n = xe(e, t, i),
                o = "number"),
                null == n || n != n || ("number" !== o || u || (n += i && i[3] || (C.cssNumber[s] ? "" : "px")),
                y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                a && "set"in a && void 0 === (n = a.set(e, n, r))) || (u ? l.setProperty(t, n) : l[t] = n)
            }
        },
        css: function(e, t, n, r) {
            var i, o = x(t);
            return st.test(t) || (t = ot(o)),
            "normal" === (i = void 0 === (i = (o = C.cssHooks[t] || C.cssHooks[o]) && "get"in o ? o.get(e, !0, n) : i) ? et(e, t, r) : i) && t in lt && (i = lt[t]),
            ("" === n || n) && (o = parseFloat(i),
            !0 === n || isFinite(o)) ? o || 0 : i
        }
    }),
    C.each(["height", "width"], function(e, a) {
        C.cssHooks[a] = {
            get: function(e, t, n) {
                if (t)
                    return !at.test(C.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? pt(e, a, n) : $e(e, ut, function() {
                        return pt(e, a, n)
                    })
            },
            set: function(e, t, n) {
                var r = Be(e)
                  , i = !y.scrollboxSize() && "absolute" === r.position
                  , o = (i || n) && "border-box" === C.css(e, "boxSizing", !1, r)
                  , n = n ? ft(e, a, n, o, r) : 0;
                return o && i && (n -= Math.ceil(e["offset" + a[0].toUpperCase() + a.slice(1)] - parseFloat(r[a]) - ft(e, a, "border", !1, r) - .5)),
                n && (o = me.exec(t)) && "px" !== (o[3] || "px") && (e.style[a] = t,
                t = C.css(e, a)),
                ct(0, t, n)
            }
        }
    }),
    C.cssHooks.marginLeft = tt(y.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(et(e, "marginLeft")) || e.getBoundingClientRect().left - $e(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    C.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        C.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++)
                    n[i + p[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        },
        "margin" !== i && (C.cssHooks[i + o].set = ct)
    }),
    C.fn.extend({
        css: function(e, t) {
            return f(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = Be(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = C.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? C.style(e, t, n) : C.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    ((C.Tween = o).prototype = {
        constructor: o,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || C.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (C.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = o.propHooks[this.prop];
            return (e && e.get ? e : o.propHooks._default).get(this)
        },
        run: function(e) {
            var t, n = o.propHooks[this.prop];
            return this.options.duration ? this.pos = t = C.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            (n && n.set ? n : o.propHooks._default).set(this),
            this
        }
    }).init.prototype = o.prototype,
    (o.propHooks = {
        _default: {
            get: function(e) {
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (e = C.css(e.elem, e.prop, "")) && "auto" !== e ? e : 0
            },
            set: function(e) {
                C.fx.step[e.prop] ? C.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !C.cssHooks[e.prop] && null == e.elem.style[ot(e.prop)] ? e.elem[e.prop] = e.now : C.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = o.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    C.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    C.fx = o.prototype.init,
    C.fx.step = {};
    var q, dt, a, L, ht = /^(?:toggle|show|hide)$/, gt = /queueHooks$/;
    function yt() {
        dt && (!1 === T.hidden && w.requestAnimationFrame ? w.requestAnimationFrame(yt) : w.setTimeout(yt, C.fx.interval),
        C.fx.tick())
    }
    function mt() {
        return w.setTimeout(function() {
            q = void 0
        }),
        q = Date.now()
    }
    function vt(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = p[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function xt(e, t, n) {
        for (var r, i = (H.tweeners[t] || []).concat(H.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function H(i, e, t) {
        var n, o, r, a, s, u, l, c = 0, f = H.prefilters.length, p = C.Deferred().always(function() {
            delete d.elem
        }), d = function() {
            if (!o) {
                for (var e = q || mt(), e = Math.max(0, h.startTime + h.duration - e), t = 1 - (e / h.duration || 0), n = 0, r = h.tweens.length; n < r; n++)
                    h.tweens[n].run(t);
                if (p.notifyWith(i, [h, t, e]),
                t < 1 && r)
                    return e;
                r || p.notifyWith(i, [h, 1, 0]),
                p.resolveWith(i, [h])
            }
            return !1
        }, h = p.promise({
            elem: i,
            props: C.extend({}, e),
            opts: C.extend(!0, {
                specialEasing: {},
                easing: C.easing._default
            }, t),
            originalProperties: e,
            originalOptions: t,
            startTime: q || mt(),
            duration: t.duration,
            tweens: [],
            createTween: function(e, t) {
                t = C.Tween(i, h.opts, e, t, h.opts.specialEasing[e] || h.opts.easing);
                return h.tweens.push(t),
                t
            },
            stop: function(e) {
                var t = 0
                  , n = e ? h.tweens.length : 0;
                if (!o) {
                    for (o = !0; t < n; t++)
                        h.tweens[t].run(1);
                    e ? (p.notifyWith(i, [h, 1, 0]),
                    p.resolveWith(i, [h, e])) : p.rejectWith(i, [h, e])
                }
                return this
            }
        }), g = h.props, y = g, m = h.opts.specialEasing;
        for (r in y)
            if (s = m[a = x(r)],
            u = y[r],
            Array.isArray(u) && (s = u[1],
            u = y[r] = u[0]),
            r !== a && (y[a] = u,
            delete y[r]),
            (l = C.cssHooks[a]) && "expand"in l)
                for (r in u = l.expand(u),
                delete y[a],
                u)
                    r in y || (y[r] = u[r],
                    m[r] = s);
            else
                m[a] = s;
        for (; c < f; c++)
            if (n = H.prefilters[c].call(h, i, g, h.opts))
                return v(n.stop) && (C._queueHooks(h.elem, h.opts.queue).stop = n.stop.bind(n)),
                n;
        return C.map(g, xt, h),
        v(h.opts.start) && h.opts.start.call(i, h),
        h.progress(h.opts.progress).done(h.opts.done, h.opts.complete).fail(h.opts.fail).always(h.opts.always),
        C.fx.timer(C.extend(d, {
            elem: i,
            anim: h,
            queue: h.opts.queue
        })),
        h
    }
    C.Animation = C.extend(H, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return xe(n.elem, e, me.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            for (var n, r = 0, i = (e = v(e) ? (t = e,
            ["*"]) : e.match(E)).length; r < i; r++)
                n = e[r],
                H.tweeners[n] = H.tweeners[n] || [],
                H.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, a, s, u, l, c = "width"in t || "height"in t, f = this, p = {}, d = e.style, h = e.nodeType && ye(e), g = b.get(e, "fxshow");
            for (r in n.queue || (null == (a = C._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
            s = a.empty.fire,
            a.empty.fire = function() {
                a.unqueued || s()
            }
            ),
            a.unqueued++,
            f.always(function() {
                f.always(function() {
                    a.unqueued--,
                    C.queue(e, "fx").length || a.empty.fire()
                })
            })),
            t)
                if (i = t[r],
                ht.test(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (h ? "hide" : "show")) {
                        if ("show" !== i || !g || void 0 === g[r])
                            continue;
                        h = !0
                    }
                    p[r] = g && g[r] || C.style(e, r)
                }
            if ((u = !C.isEmptyObject(t)) || !C.isEmptyObject(p))
                for (r in c && 1 === e.nodeType && (n.overflow = [d.overflow, d.overflowX, d.overflowY],
                null == (l = g && g.display) && (l = b.get(e, "display")),
                "none" === (c = C.css(e, "display")) && (l ? c = l : (A([e], !0),
                l = e.style.display || l,
                c = C.css(e, "display"),
                A([e]))),
                "inline" === c || "inline-block" === c && null != l) && "none" === C.css(e, "float") && (u || (f.done(function() {
                    d.display = l
                }),
                null == l && (c = d.display,
                l = "none" === c ? "" : c)),
                d.display = "inline-block"),
                n.overflow && (d.overflow = "hidden",
                f.always(function() {
                    d.overflow = n.overflow[0],
                    d.overflowX = n.overflow[1],
                    d.overflowY = n.overflow[2]
                })),
                u = !1,
                p)
                    u || (g ? "hidden"in g && (h = g.hidden) : g = b.access(e, "fxshow", {
                        display: l
                    }),
                    o && (g.hidden = !h),
                    h && A([e], !0),
                    f.done(function() {
                        for (r in h || A([e]),
                        b.remove(e, "fxshow"),
                        p)
                            C.style(e, r, p[r])
                    })),
                    u = xt(h ? g[r] : 0, r, f),
                    r in g || (g[r] = u.start,
                    h && (u.end = u.start,
                    u.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? H.prefilters.unshift(e) : H.prefilters.push(e)
        }
    }),
    C.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? C.extend({}, e) : {
            complete: n || !n && t || v(e) && e,
            duration: e,
            easing: n && t || t && !v(t) && t
        };
        return C.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in C.fx.speeds ? r.duration = C.fx.speeds[r.duration] : r.duration = C.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            v(r.old) && r.old.call(this),
            r.queue && C.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    C.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(ye).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            function i() {
                var e = H(this, C.extend({}, t), a);
                (o || b.get(this, "finish")) && e.stop(!0)
            }
            var o = C.isEmptyObject(t)
              , a = C.speed(e, n, r);
            return i.finish = i,
            o || !1 === a.queue ? this.each(i) : this.queue(a.queue, i)
        },
        stop: function(i, e, o) {
            function a(e) {
                var t = e.stop;
                delete e.stop,
                t(o)
            }
            return "string" != typeof i && (o = e,
            e = i,
            i = void 0),
            e && this.queue(i || "fx", []),
            this.each(function() {
                var e = !0
                  , t = null != i && i + "queueHooks"
                  , n = C.timers
                  , r = b.get(this);
                if (t)
                    r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r)
                        r[t] && r[t].stop && gt.test(t) && a(r[t]);
                for (t = n.length; t--; )
                    n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o),
                    e = !1,
                    n.splice(t, 1));
                !e && o || C.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"),
            this.each(function() {
                var e, t = b.get(this), n = t[a + "queue"], r = t[a + "queueHooks"], i = C.timers, o = n ? n.length : 0;
                for (t.finish = !0,
                C.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length; e--; )
                    i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0),
                    i.splice(e, 1));
                for (e = 0; e < o; e++)
                    n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }),
    C.each(["toggle", "show", "hide"], function(e, r) {
        var i = C.fn[r];
        C.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(vt(r, !0), e, t, n)
        }
    }),
    C.each({
        slideDown: vt("show"),
        slideUp: vt("hide"),
        slideToggle: vt("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        C.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }),
    C.timers = [],
    C.fx.tick = function() {
        var e, t = 0, n = C.timers;
        for (q = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || C.fx.stop(),
        q = void 0
    }
    ,
    C.fx.timer = function(e) {
        C.timers.push(e),
        C.fx.start()
    }
    ,
    C.fx.interval = 13,
    C.fx.start = function() {
        dt || (dt = !0,
        yt())
    }
    ,
    C.fx.stop = function() {
        dt = null
    }
    ,
    C.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    C.fn.delay = function(r, e) {
        return r = C.fx && C.fx.speeds[r] || r,
        this.queue(e = e || "fx", function(e, t) {
            var n = w.setTimeout(e, r);
            t.stop = function() {
                w.clearTimeout(n)
            }
        })
    }
    ,
    a = T.createElement("input"),
    L = T.createElement("select").appendChild(T.createElement("option")),
    a.type = "checkbox",
    y.checkOn = "" !== a.value,
    y.optSelected = L.selected,
    (a = T.createElement("input")).value = "t",
    a.type = "radio",
    y.radioValue = "t" === a.value;
    var bt, wt = C.expr.attrHandle, Tt = (C.fn.extend({
        attr: function(e, t) {
            return f(this, C.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                C.removeAttr(this, e)
            })
        }
    }),
    C.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return void 0 === e.getAttribute ? C.prop(e, t, n) : (1 === o && C.isXMLDoc(e) || (i = C.attrHooks[t.toLowerCase()] || (C.expr.match.bool.test(t) ? bt : void 0)),
                void 0 !== n ? null === n ? void C.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : !(i && "get"in i && null !== (r = i.get(e, t))) && null == (r = C.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    var n;
                    if (!y.radioValue && "radio" === t && u(e, "input"))
                        return n = e.value,
                        e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(E);
            if (i && 1 === e.nodeType)
                for (; n = i[r++]; )
                    e.removeAttribute(n)
        }
    }),
    bt = {
        set: function(e, t, n) {
            return !1 === t ? C.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    C.each(C.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = wt[t] || C.find.attr;
        wt[t] = function(e, t, n) {
            var r, i, o = t.toLowerCase();
            return n || (i = wt[o],
            wt[o] = r,
            r = null != a(e, t, n) ? o : null,
            wt[o] = i),
            r
        }
    }),
    /^(?:input|select|textarea|button)$/i), Ct = /^(?:a|area)$/i;
    function O(e) {
        return (e.match(E) || []).join(" ")
    }
    function P(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function Et(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(E) || []
    }
    C.fn.extend({
        prop: function(e, t) {
            return f(this, C.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[C.propFix[e] || e]
            })
        }
    }),
    C.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && C.isXMLDoc(e) || (t = C.propFix[t] || t,
                i = C.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = C.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Tt.test(e.nodeName) || Ct.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    y.optSelected || (C.propHooks.selected = {
        get: function(e) {
            e = e.parentNode;
            return e && e.parentNode && e.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            e = e.parentNode;
            e && (e.selectedIndex,
            e.parentNode) && e.parentNode.selectedIndex
        }
    }),
    C.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        C.propFix[this.toLowerCase()] = this
    }),
    C.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s = 0;
            if (v(t))
                return this.each(function(e) {
                    C(this).addClass(t.call(this, e, P(this)))
                });
            if ((e = Et(t)).length)
                for (; n = this[s++]; )
                    if (a = P(n),
                    r = 1 === n.nodeType && " " + O(a) + " ") {
                        for (o = 0; i = e[o++]; )
                            r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                        a !== (a = O(r)) && n.setAttribute("class", a)
                    }
            return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s = 0;
            if (v(t))
                return this.each(function(e) {
                    C(this).removeClass(t.call(this, e, P(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((e = Et(t)).length)
                for (; n = this[s++]; )
                    if (a = P(n),
                    r = 1 === n.nodeType && " " + O(a) + " ") {
                        for (o = 0; i = e[o++]; )
                            for (; -1 < r.indexOf(" " + i + " "); )
                                r = r.replace(" " + i + " ", " ");
                        a !== (a = O(r)) && n.setAttribute("class", a)
                    }
            return this
        },
        toggleClass: function(i, t) {
            var o = typeof i
              , a = "string" == o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : v(i) ? this.each(function(e) {
                C(this).toggleClass(i.call(this, e, P(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if (a)
                    for (t = 0,
                    n = C(this),
                    r = Et(i); e = r[t++]; )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else
                    void 0 !== i && "boolean" != o || ((e = P(this)) && b.set(this, "__className__", e),
                    this.setAttribute && this.setAttribute("class", !e && !1 !== i && b.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            for (var t, n = 0, r = " " + e + " "; t = this[n++]; )
                if (1 === t.nodeType && -1 < (" " + O(P(t)) + " ").indexOf(r))
                    return !0;
            return !1
        }
    });
    function St(e) {
        e.stopPropagation()
    }
    var kt = /\r/g
      , At = (C.fn.extend({
        val: function(t) {
            var n, e, r, i = this[0];
            return arguments.length ? (r = v(t),
            this.each(function(e) {
                1 !== this.nodeType || (null == (e = r ? t.call(this, e, C(this).val()) : t) ? e = "" : "number" == typeof e ? e += "" : Array.isArray(e) && (e = C.map(e, function(e) {
                    return null == e ? "" : e + ""
                })),
                (n = C.valHooks[this.type] || C.valHooks[this.nodeName.toLowerCase()]) && "set"in n && void 0 !== n.set(this, e, "value")) || (this.value = e)
            })) : i ? (n = C.valHooks[i.type] || C.valHooks[i.nodeName.toLowerCase()]) && "get"in n && void 0 !== (e = n.get(i, "value")) ? e : "string" == typeof (e = i.value) ? e.replace(kt, "") : null == e ? "" : e : void 0
        }
    }),
    C.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = C.find.attr(e, "value");
                    return null != t ? t : O(C.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n = e.options, r = e.selectedIndex, i = "select-one" === e.type, o = i ? null : [], a = i ? r + 1 : n.length, s = r < 0 ? a : i ? r : 0; s < a; s++)
                        if (((t = n[s]).selected || s === r) && !t.disabled && (!t.parentNode.disabled || !u(t.parentNode, "optgroup"))) {
                            if (t = C(t).val(),
                            i)
                                return t;
                            o.push(t)
                        }
                    return o
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = C.makeArray(t), a = i.length; a--; )
                        ((r = i[a]).selected = -1 < C.inArray(C.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    C.each(["radio", "checkbox"], function() {
        C.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < C.inArray(C(e).val(), t)
            }
        },
        y.checkOn || (C.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    y.focusin = "onfocusin"in w,
    /^(?:focusinfocus|focusoutblur)$/)
      , Nt = (C.extend(C.event, {
        trigger: function(e, t, n, r) {
            var i, o, a, s, u, l, c, f = [n || T], p = _.call(e, "type") ? e.type : e, d = _.call(e, "namespace") ? e.namespace.split(".") : [], h = c = o = n = n || T;
            if (3 !== n.nodeType && 8 !== n.nodeType && !At.test(p + C.event.triggered) && (-1 < p.indexOf(".") && (p = (d = p.split(".")).shift(),
            d.sort()),
            s = p.indexOf(":") < 0 && "on" + p,
            (e = e[C.expando] ? e : new C.Event(p,"object" == typeof e && e)).isTrigger = r ? 2 : 3,
            e.namespace = d.join("."),
            e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            e.result = void 0,
            e.target || (e.target = n),
            t = null == t ? [e] : C.makeArray(t, [e]),
            l = C.event.special[p] || {},
            r || !l.trigger || !1 !== l.trigger.apply(n, t))) {
                if (!r && !l.noBubble && !g(n)) {
                    for (a = l.delegateType || p,
                    At.test(a + p) || (h = h.parentNode); h; h = h.parentNode)
                        f.push(h),
                        o = h;
                    o === (n.ownerDocument || T) && f.push(o.defaultView || o.parentWindow || w)
                }
                for (i = 0; (h = f[i++]) && !e.isPropagationStopped(); )
                    c = h,
                    e.type = 1 < i ? a : l.bindType || p,
                    (u = (b.get(h, "events") || Object.create(null))[e.type] && b.get(h, "handle")) && u.apply(h, t),
                    (u = s && h[s]) && u.apply && m(h) && (e.result = u.apply(h, t),
                    !1 === e.result) && e.preventDefault();
                return e.type = p,
                r || e.isDefaultPrevented() || l._default && !1 !== l._default.apply(f.pop(), t) || !m(n) || s && v(n[p]) && !g(n) && ((o = n[s]) && (n[s] = null),
                C.event.triggered = p,
                e.isPropagationStopped() && c.addEventListener(p, St),
                n[p](),
                e.isPropagationStopped() && c.removeEventListener(p, St),
                C.event.triggered = void 0,
                o) && (n[s] = o),
                e.result
            }
        },
        simulate: function(e, t, n) {
            n = C.extend(new C.Event, n, {
                type: e,
                isSimulated: !0
            });
            C.event.trigger(n, null, t)
        }
    }),
    C.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                C.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return C.event.trigger(e, t, n, !0)
        }
    }),
    y.focusin || C.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        function i(e) {
            C.event.simulate(r, e.target, C.event.fix(e))
        }
        C.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this.document || this
                  , t = b.access(e, r);
                t || e.addEventListener(n, i, !0),
                b.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this.document || this
                  , t = b.access(e, r) - 1;
                t ? b.access(e, r, t) : (e.removeEventListener(n, i, !0),
                b.remove(e, r))
            }
        }
    }),
    w.location)
      , Dt = {
        guid: Date.now()
    }
      , jt = /\?/
      , qt = (C.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e)
            return null;
        try {
            t = (new w.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || C.error("Invalid XML: " + e),
        t
    }
    ,
    /\[\]$/)
      , Lt = /\r?\n/g
      , Ht = /^(?:submit|button|image|reset|file)$/i
      , Ot = /^(?:input|select|textarea|keygen)/i;
    C.param = function(e, t) {
        function n(e, t) {
            t = v(t) ? t() : t,
            i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == t ? "" : t)
        }
        var r, i = [];
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !C.isPlainObject(e))
            C.each(e, function() {
                n(this.name, this.value)
            });
        else
            for (r in e)
                !function n(r, e, i, o) {
                    if (Array.isArray(e))
                        C.each(e, function(e, t) {
                            i || qt.test(r) ? o(r, t) : n(r + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, i, o)
                        });
                    else if (i || "object" !== h(e))
                        o(r, e);
                    else
                        for (var t in e)
                            n(r + "[" + t + "]", e[t], i, o)
                }(r, e[r], t, n);
        return i.join("&")
    }
    ,
    C.fn.extend({
        serialize: function() {
            return C.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = C.prop(this, "elements");
                return e ? C.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !C(this).is(":disabled") && Ot.test(this.nodeName) && !Ht.test(e) && (this.checked || !we.test(e))
            }).map(function(e, t) {
                var n = C(this).val();
                return null == n ? null : Array.isArray(n) ? C.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Lt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Lt, "\r\n")
                }
            }).get()
        }
    });
    var Pt = /%20/g
      , Rt = /#.*$/
      , Mt = /([?&])_=[^&]*/
      , It = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Wt = /^(?:GET|HEAD)$/
      , Ft = /^\/\//
      , Bt = {}
      , $t = {}
      , _t = "*/".concat("*")
      , zt = T.createElement("a");
    function Ut(o) {
        return function(e, t) {
            "string" != typeof e && (t = e,
            e = "*");
            var n, r = 0, i = e.toLowerCase().match(E) || [];
            if (v(t))
                for (; n = i[r++]; )
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }
    function Xt(t, r, i, o) {
        var a = {}
          , s = t === $t;
        function u(e) {
            var n;
            return a[e] = !0,
            C.each(t[e] || [], function(e, t) {
                t = t(r, i, o);
                return "string" != typeof t || s || a[t] ? s ? !(n = t) : void 0 : (r.dataTypes.unshift(t),
                u(t),
                !1)
            }),
            n
        }
        return u(r.dataTypes[0]) || !a["*"] && u("*")
    }
    function Vt(e, t) {
        var n, r, i = C.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r = r || {})[n] = t[n]);
        return r && C.extend(!0, e, r),
        e
    }
    zt.href = Nt.href,
    C.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Nt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Nt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": _t,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": C.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Vt(Vt(e, C.ajaxSettings), t) : Vt(C.ajaxSettings, e)
        },
        ajaxPrefilter: Ut(Bt),
        ajaxTransport: Ut($t),
        ajax: function(e, t) {
            "object" == typeof e && (t = e,
            e = void 0);
            var u, l, c, n, f, p, d, r, h = C.ajaxSetup({}, t = t || {}), g = h.context || h, y = h.context && (g.nodeType || g.jquery) ? C(g) : C.event, m = C.Deferred(), v = C.Callbacks("once memory"), x = h.statusCode || {}, i = {}, o = {}, a = "canceled", b = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (p) {
                        if (!n)
                            for (n = {}; t = It.exec(c); )
                                n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2]);
                        t = n[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return p ? c : null
                },
                setRequestHeader: function(e, t) {
                    return null == p && (e = o[e.toLowerCase()] = o[e.toLowerCase()] || e,
                    i[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == p && (h.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    if (e)
                        if (p)
                            b.always(e[b.status]);
                        else
                            for (var t in e)
                                x[t] = [x[t], e[t]];
                    return this
                },
                abort: function(e) {
                    e = e || a;
                    return u && u.abort(e),
                    s(0, e),
                    this
                }
            };
            if (m.promise(b),
            h.url = ((e || h.url || Nt.href) + "").replace(Ft, Nt.protocol + "//"),
            h.type = t.method || t.type || h.method || h.type,
            h.dataTypes = (h.dataType || "*").toLowerCase().match(E) || [""],
            null == h.crossDomain) {
                e = T.createElement("a");
                try {
                    e.href = h.url,
                    e.href = e.href,
                    h.crossDomain = zt.protocol + "//" + zt.host != e.protocol + "//" + e.host
                } catch (e) {
                    h.crossDomain = !0
                }
            }
            if (h.data && h.processData && "string" != typeof h.data && (h.data = C.param(h.data, h.traditional)),
            Xt(Bt, h, t, b),
            !p) {
                for (r in (d = C.event && h.global) && 0 == C.active++ && C.event.trigger("ajaxStart"),
                h.type = h.type.toUpperCase(),
                h.hasContent = !Wt.test(h.type),
                l = h.url.replace(Rt, ""),
                h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Pt, "+")) : (e = h.url.slice(l.length),
                h.data && (h.processData || "string" == typeof h.data) && (l += (jt.test(l) ? "&" : "?") + h.data,
                delete h.data),
                !1 === h.cache && (l = l.replace(Mt, "$1"),
                e = (jt.test(l) ? "&" : "?") + "_=" + Dt.guid++ + e),
                h.url = l + e),
                h.ifModified && (C.lastModified[l] && b.setRequestHeader("If-Modified-Since", C.lastModified[l]),
                C.etag[l]) && b.setRequestHeader("If-None-Match", C.etag[l]),
                (h.data && h.hasContent && !1 !== h.contentType || t.contentType) && b.setRequestHeader("Content-Type", h.contentType),
                b.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + _t + "; q=0.01" : "") : h.accepts["*"]),
                h.headers)
                    b.setRequestHeader(r, h.headers[r]);
                if (h.beforeSend && (!1 === h.beforeSend.call(g, b, h) || p))
                    return b.abort();
                if (a = "abort",
                v.add(h.complete),
                b.done(h.success),
                b.fail(h.error),
                u = Xt($t, h, t, b)) {
                    if (b.readyState = 1,
                    d && y.trigger("ajaxSend", [b, h]),
                    p)
                        return b;
                    h.async && 0 < h.timeout && (f = w.setTimeout(function() {
                        b.abort("timeout")
                    }, h.timeout));
                    try {
                        p = !1,
                        u.send(i, s)
                    } catch (e) {
                        if (p)
                            throw e;
                        s(-1, e)
                    }
                } else
                    s(-1, "No Transport")
            }
            return b;
            function s(e, t, n, r) {
                var i, o, a, s = t;
                p || (p = !0,
                f && w.clearTimeout(f),
                u = void 0,
                c = r || "",
                b.readyState = 0 < e ? 4 : 0,
                r = 200 <= e && e < 300 || 304 === e,
                n && (a = ( (e, t, n) => {
                    for (var r, i, o, a, s = e.contents, u = e.dataTypes; "*" === u[0]; )
                        u.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            }
                    if (u[0]in n)
                        o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a = a || i
                        }
                        o = o || a
                    }
                    if (o)
                        return o !== u[0] && u.unshift(o),
                        n[o]
                }
                )(h, b, n)),
                !r && -1 < C.inArray("script", h.dataTypes) && (h.converters["text script"] = function() {}
                ),
                a = ( (e, t, n, r) => {
                    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    for (o = c.shift(); o; )
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                        !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        u = o,
                        o = c.shift())
                            if ("*" === o)
                                o = u;
                            else if ("*" !== u && u !== o) {
                                if (!(a = l[u + " " + o] || l["* " + o]))
                                    for (i in l)
                                        if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                            !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0],
                                            c.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== a)
                                    if (a && e.throws)
                                        t = a(t);
                                    else
                                        try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + u + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }
                )(h, a, b, r),
                r ? (h.ifModified && ((n = b.getResponseHeader("Last-Modified")) && (C.lastModified[l] = n),
                n = b.getResponseHeader("etag")) && (C.etag[l] = n),
                204 === e || "HEAD" === h.type ? s = "nocontent" : 304 === e ? s = "notmodified" : (s = a.state,
                i = a.data,
                r = !(o = a.error))) : (o = s,
                !e && s || (s = "error",
                e < 0 && (e = 0))),
                b.status = e,
                b.statusText = (t || s) + "",
                r ? m.resolveWith(g, [i, s, b]) : m.rejectWith(g, [b, s, o]),
                b.statusCode(x),
                x = void 0,
                d && y.trigger(r ? "ajaxSuccess" : "ajaxError", [b, h, r ? i : o]),
                v.fireWith(g, [b, s]),
                d && (y.trigger("ajaxComplete", [b, h]),
                --C.active || C.event.trigger("ajaxStop")))
            }
        },
        getJSON: function(e, t, n) {
            return C.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return C.get(e, void 0, t, "script")
        }
    }),
    C.each(["get", "post"], function(e, i) {
        C[i] = function(e, t, n, r) {
            return v(t) && (r = r || n,
            n = t,
            t = void 0),
            C.ajax(C.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, C.isPlainObject(e) && e))
        }
    }),
    C.ajaxPrefilter(function(e) {
        for (var t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }),
    C._evalUrl = function(e, t, n) {
        return C.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                C.globalEval(e, t, n)
            }
        })
    }
    ,
    C.fn.extend({
        wrapAll: function(e) {
            return this[0] && (v(e) && (e = e.call(this[0])),
            e = C(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && e.insertBefore(this[0]),
            e.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(n) {
            return v(n) ? this.each(function(e) {
                C(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = C(this)
                  , t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = v(t);
            return this.each(function(e) {
                C(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                C(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    C.expr.pseudos.hidden = function(e) {
        return !C.expr.pseudos.visible(e)
    }
    ,
    C.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    C.ajaxSettings.xhr = function() {
        try {
            return new w.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Gt = {
        0: 200,
        1223: 204
    }
      , Yt = C.ajaxSettings.xhr()
      , Qt = (y.cors = !!Yt && "withCredentials"in Yt,
    y.ajax = Yt = !!Yt,
    C.ajaxTransport(function(i) {
        var o, a;
        if (y.cors || Yt && !i.crossDomain)
            return {
                send: function(e, t) {
                    var n, r = i.xhr();
                    if (r.open(i.type, i.url, i.async, i.username, i.password),
                    i.xhrFields)
                        for (n in i.xhrFields)
                            r[n] = i.xhrFields[n];
                    for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType),
                    i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"),
                    e)
                        r.setRequestHeader(n, e[n]);
                    o = function(e) {
                        return function() {
                            o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null,
                            "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Gt[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                                binary: r.response
                            } : {
                                text: r.responseText
                            }, r.getAllResponseHeaders()))
                        }
                    }
                    ,
                    r.onload = o(),
                    a = r.onerror = r.ontimeout = o("error"),
                    void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function() {
                        4 === r.readyState && w.setTimeout(function() {
                            o && a()
                        })
                    }
                    ,
                    o = o("abort");
                    try {
                        r.send(i.hasContent && i.data || null)
                    } catch (e) {
                        if (o)
                            throw e
                    }
                },
                abort: function() {
                    o && o()
                }
            }
    }),
    C.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    C.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return C.globalEval(e),
                e
            }
        }
    }),
    C.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    C.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs)
            return {
                send: function(e, t) {
                    r = C("<script>").attr(n.scriptAttrs || {}).prop({
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", i = function(e) {
                        r.remove(),
                        i = null,
                        e && t("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    T.head.appendChild(r[0])
                },
                abort: function() {
                    i && i()
                }
            }
    }),
    [])
      , Jt = /(=)\?(?=&|$)|\?\?/
      , Kt = (C.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Qt.pop() || C.expando + "_" + Dt.guid++;
            return this[e] = !0,
            e
        }
    }),
    C.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (Jt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Jt.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0])
            return r = e.jsonpCallback = v(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(Jt, "$1" + r) : !1 !== e.jsonp && (e.url += (jt.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
            e.converters["script json"] = function() {
                return o || C.error(r + " was not called"),
                o[0]
            }
            ,
            e.dataTypes[0] = "json",
            i = w[r],
            w[r] = function() {
                o = arguments
            }
            ,
            n.always(function() {
                void 0 === i ? C(w).removeProp(r) : w[r] = i,
                e[r] && (e.jsonpCallback = t.jsonpCallback,
                Qt.push(r)),
                o && v(i) && i(o[0]),
                o = i = void 0
            }),
            "script"
    }),
    y.createHTMLDocument = ((e = T.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === e.childNodes.length),
    C.parseHTML = function(e, t, n) {
        var r;
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (y.createHTMLDocument ? ((r = (t = T.implementation.createHTMLDocument("")).createElement("base")).href = T.location.href,
        t.head.appendChild(r)) : t = T),
        r = !n && [],
        (n = J.exec(e)) ? [t.createElement(n[1])] : (n = ke([e], t, r),
        r && r.length && C(r).remove(),
        C.merge([], n.childNodes)))
    }
    ,
    C.fn.load = function(e, t, n) {
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = O(e.slice(s)),
        e = e.slice(0, s)),
        v(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && C.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? C("<div>").append(C.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    C.expr.pseudos.animated = function(t) {
        return C.grep(C.timers, function(e) {
            return t === e.elem
        }).length
    }
    ,
    C.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s = C.css(e, "position"), u = C(e), l = {};
            "static" === s && (e.style.position = "relative"),
            o = u.offset(),
            r = C.css(e, "top"),
            a = C.css(e, "left"),
            s = ("absolute" === s || "fixed" === s) && -1 < (r + a).indexOf("auto") ? (i = (s = u.position()).top,
            s.left) : (i = parseFloat(r) || 0,
            parseFloat(a) || 0),
            null != (t = v(t) ? t.call(e, n, C.extend({}, o)) : t).top && (l.top = t.top - o.top + i),
            null != t.left && (l.left = t.left - o.left + s),
            "using"in t ? t.using.call(e, l) : ("number" == typeof l.top && (l.top += "px"),
            "number" == typeof l.left && (l.left += "px"),
            u.css(l))
        }
    },
    C.fn.extend({
        offset: function(t) {
            var e, n;
            return arguments.length ? void 0 === t ? this : this.each(function(e) {
                C.offset.setOffset(this, t, e)
            }) : (n = this[0]) ? n.getClientRects().length ? (e = n.getBoundingClientRect(),
            n = n.ownerDocument.defaultView,
            {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === C.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === C.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = C(e).offset()).top += C.css(e, "borderTopWidth", !0),
                    i.left += C.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - C.css(r, "marginTop", !0),
                    left: t.left - i.left - C.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === C.css(e, "position"); )
                    e = e.offsetParent;
                return e || S
            })
        }
    }),
    C.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        C.fn[t] = function(e) {
            return f(this, function(e, t, n) {
                var r;
                if (g(e) ? r = e : 9 === e.nodeType && (r = e.defaultView),
                void 0 === n)
                    return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }),
    C.each(["top", "left"], function(e, n) {
        C.cssHooks[n] = tt(y.pixelPosition, function(e, t) {
            if (t)
                return t = et(e, n),
                Qe.test(t) ? C(e).position()[n] + "px" : t
        })
    }),
    C.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        C.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            C.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e)
                  , i = r || (!0 === e || !0 === t ? "margin" : "border");
                return f(this, function(e, t, n) {
                    var r;
                    return g(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement,
                    Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? C.css(e, t, i) : C.style(e, t, n, i)
                }, s, n ? e : void 0, n)
            }
        })
    }),
    C.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        C.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    C.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        C.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }),
    /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g)
      , Zt = (C.proxy = function(e, t) {
        var n, r;
        if ("string" == typeof t && (r = e[t],
        t = e,
        e = r),
        v(e))
            return n = s.call(arguments, 2),
            (r = function() {
                return e.apply(t || this, n.concat(s.call(arguments)))
            }
            ).guid = e.guid = e.guid || C.guid++,
            r
    }
    ,
    C.holdReady = function(e) {
        e ? C.readyWait++ : C.ready(!0)
    }
    ,
    C.isArray = Array.isArray,
    C.parseJSON = JSON.parse,
    C.nodeName = u,
    C.isFunction = v,
    C.isWindow = g,
    C.camelCase = x,
    C.type = h,
    C.now = Date.now,
    C.isNumeric = function(e) {
        var t = C.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    C.trim = function(e) {
        return null == e ? "" : (e + "").replace(Kt, "")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return C
    }),
    w.jQuery)
      , en = w.$;
    return C.noConflict = function(e) {
        return w.$ === C && (w.$ = en),
        e && w.jQuery === C && (w.jQuery = Zt),
        C
    }
    ,
    void 0 === R && (w.jQuery = w.$ = C),
    C
});

;(t => {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}
)(function(P) {
    P.ui = P.ui || {},
    P.ui.version = "1.12.1";
    var t, e, s, x, z, o, n, r, h, a, i, l, c = 0, p = Array.prototype.slice;
    function C(t, e, i) {
        return [parseFloat(t[0]) * (a.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (a.test(t[1]) ? i / 100 : 1)]
    }
    function I(t, e) {
        return parseInt(P.css(t, e), 10) || 0
    }
    P.cleanData = (l = P.cleanData,
    function(t) {
        for (var e, i, s = 0; null != (i = t[s]); s++)
            try {
                (e = P._data(i, "events")) && e.remove && P(i).triggerHandler("remove")
            } catch (t) {}
        l(t)
    }
    ),
    P.widget = function(t, i, e) {
        var s, o, n, r = {}, h = t.split(".")[0], a = h + "-" + (t = t.split(".")[1]);
        return e || (e = i,
        i = P.Widget),
        P.isArray(e) && (e = P.extend.apply(null, [{}].concat(e))),
        P.expr[":"][a.toLowerCase()] = function(t) {
            return !!P.data(t, a)
        }
        ,
        P[h] = P[h] || {},
        s = P[h][t],
        o = P[h][t] = function(t, e) {
            return this._createWidget ? void (arguments.length && this._createWidget(t, e)) : new o(t,e)
        }
        ,
        P.extend(o, s, {
            version: e.version,
            _proto: P.extend({}, e),
            _childConstructors: []
        }),
        (n = new i).options = P.widget.extend({}, n.options),
        P.each(e, function(e, s) {
            return P.isFunction(s) ? void (r[e] = function() {
                var t, e = this._super, i = this._superApply;
                return this._super = o,
                this._superApply = n,
                t = s.apply(this, arguments),
                this._super = e,
                this._superApply = i,
                t
            }
            ) : void (r[e] = s);
            function o() {
                return i.prototype[e].apply(this, arguments)
            }
            function n(t) {
                return i.prototype[e].apply(this, t)
            }
        }),
        o.prototype = P.widget.extend(n, {
            widgetEventPrefix: s && n.widgetEventPrefix || t
        }, r, {
            constructor: o,
            namespace: h,
            widgetName: t,
            widgetFullName: a
        }),
        s ? (P.each(s._childConstructors, function(t, e) {
            var i = e.prototype;
            P.widget(i.namespace + "." + i.widgetName, o, e._proto)
        }),
        delete s._childConstructors) : i._childConstructors.push(o),
        P.widget.bridge(t, o),
        o
    }
    ,
    P.widget.extend = function(t) {
        for (var e, i, s = p.call(arguments, 1), o = 0, n = s.length; o < n; o++)
            for (e in s[o])
                i = s[o][e],
                s[o].hasOwnProperty(e) && void 0 !== i && (t[e] = P.isPlainObject(i) ? P.isPlainObject(t[e]) ? P.widget.extend({}, t[e], i) : P.widget.extend({}, i) : i);
        return t
    }
    ,
    P.widget.bridge = function(n, e) {
        var r = e.prototype.widgetFullName || n;
        P.fn[n] = function(i) {
            var t = "string" == typeof i
              , s = p.call(arguments, 1)
              , o = this;
            return t ? this.length || "instance" !== i ? this.each(function() {
                var t, e = P.data(this, r);
                return "instance" === i ? (o = e,
                !1) : e ? P.isFunction(e[i]) && "_" !== i.charAt(0) ? (t = e[i].apply(e, s)) !== e && void 0 !== t ? (o = t && t.jquery ? o.pushStack(t.get()) : t,
                !1) : void 0 : P.error("no such method '" + i + "' for " + n + " widget instance") : P.error("cannot call methods on " + n + " prior to initialization; attempted to call method '" + i + "'")
            }) : o = void 0 : (s.length && (i = P.widget.extend.apply(null, [i].concat(s))),
            this.each(function() {
                var t = P.data(this, r);
                t ? (t.option(i || {}),
                t._init && t._init()) : P.data(this, r, new e(i,this))
            })),
            o
        }
    }
    ,
    P.Widget = function() {}
    ,
    P.Widget._childConstructors = [],
    P.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            classes: {},
            disabled: !1,
            create: null
        },
        _createWidget: function(t, e) {
            e = P(e || this.defaultElement || this)[0],
            this.element = P(e),
            this.uuid = c++,
            this.eventNamespace = "." + this.widgetName + this.uuid,
            this.bindings = P(),
            this.hoverable = P(),
            this.focusable = P(),
            this.classesElementLookup = {},
            e !== this && (P.data(e, this.widgetFullName, this),
            this._on(!0, this.element, {
                remove: function(t) {
                    t.target === e && this.destroy()
                }
            }),
            this.document = P(e.style ? e.ownerDocument : e.document || e),
            this.window = P(this.document[0].defaultView || this.document[0].parentWindow)),
            this.options = P.widget.extend({}, this.options, this._getCreateOptions(), t),
            this._create(),
            this.options.disabled && this._setOptionDisabled(this.options.disabled),
            this._trigger("create", null, this._getCreateEventData()),
            this._init()
        },
        _getCreateOptions: function() {
            return {}
        },
        _getCreateEventData: P.noop,
        _create: P.noop,
        _init: P.noop,
        destroy: function() {
            var i = this;
            this._destroy(),
            P.each(this.classesElementLookup, function(t, e) {
                i._removeClass(e, t)
            }),
            this.element.off(this.eventNamespace).removeData(this.widgetFullName),
            this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),
            this.bindings.off(this.eventNamespace)
        },
        _destroy: P.noop,
        widget: function() {
            return this.element
        },
        option: function(t, e) {
            var i, s, o, n = t;
            if (0 === arguments.length)
                return P.widget.extend({}, this.options);
            if ("string" == typeof t)
                if (n = {},
                t = (i = t.split(".")).shift(),
                i.length) {
                    for (s = n[t] = P.widget.extend({}, this.options[t]),
                    o = 0; i.length - 1 > o; o++)
                        s[i[o]] = s[i[o]] || {},
                        s = s[i[o]];
                    if (t = i.pop(),
                    1 === arguments.length)
                        return void 0 === s[t] ? null : s[t];
                    s[t] = e
                } else {
                    if (1 === arguments.length)
                        return void 0 === this.options[t] ? null : this.options[t];
                    n[t] = e
                }
            return this._setOptions(n),
            this
        },
        _setOptions: function(t) {
            for (var e in t)
                this._setOption(e, t[e]);
            return this
        },
        _setOption: function(t, e) {
            return "classes" === t && this._setOptionClasses(e),
            this.options[t] = e,
            "disabled" === t && this._setOptionDisabled(e),
            this
        },
        _setOptionClasses: function(t) {
            var e, i, s;
            for (e in t)
                s = this.classesElementLookup[e],
                t[e] !== this.options.classes[e] && s && s.length && (i = P(s.get()),
                this._removeClass(s, e),
                i.addClass(this._classes({
                    element: i,
                    keys: e,
                    classes: t,
                    add: !0
                })))
        },
        _setOptionDisabled: function(t) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!t),
            t && (this._removeClass(this.hoverable, null, "ui-state-hover"),
            this._removeClass(this.focusable, null, "ui-state-focus"))
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _classes: function(o) {
            function t(t, e) {
                for (var i, s = 0; t.length > s; s++)
                    i = r.classesElementLookup[t[s]] || P(),
                    i = o.add ? P(P.unique(i.get().concat(o.element.get()))) : P(i.not(o.element).get()),
                    r.classesElementLookup[t[s]] = i,
                    n.push(t[s]),
                    e && o.classes[t[s]] && n.push(o.classes[t[s]])
            }
            var n = []
              , r = this;
            return o = P.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, o),
            this._on(o.element, {
                remove: "_untrackClassesElement"
            }),
            o.keys && t(o.keys.match(/\S+/g) || [], !0),
            o.extra && t(o.extra.match(/\S+/g) || []),
            n.join(" ")
        },
        _untrackClassesElement: function(i) {
            var s = this;
            P.each(s.classesElementLookup, function(t, e) {
                -1 !== P.inArray(i.target, e) && (s.classesElementLookup[t] = P(e.not(i.target).get()))
            })
        },
        _removeClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !1)
        },
        _addClass: function(t, e, i) {
            return this._toggleClass(t, e, i, !0)
        },
        _toggleClass: function(t, e, i, s) {
            var o = "string" == typeof t || null === t
              , e = {
                extra: o ? e : i,
                keys: o ? t : e,
                element: o ? this.element : t,
                add: s = "boolean" == typeof s ? s : i
            };
            return e.element.toggleClass(this._classes(e), s),
            this
        },
        _on: function(o, n, t) {
            var r, h = this;
            "boolean" != typeof o && (t = n,
            n = o,
            o = !1),
            t ? (n = r = P(n),
            this.bindings = this.bindings.add(n)) : (t = n,
            n = this.element,
            r = this.widget()),
            P.each(t, function(t, e) {
                function i() {
                    return o || !0 !== h.options.disabled && !P(this).hasClass("ui-state-disabled") ? ("string" == typeof e ? h[e] : e).apply(h, arguments) : void 0
                }
                "string" != typeof e && (i.guid = e.guid = e.guid || i.guid || P.guid++);
                var t = t.match(/^([\w:-]*)\s*(.*)$/)
                  , s = t[1] + h.eventNamespace
                  , t = t[2];
                t ? r.on(s, t, i) : n.on(s, i)
            })
        },
        _off: function(t, e) {
            e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace,
            t.off(e).off(e),
            this.bindings = P(this.bindings.not(t).get()),
            this.focusable = P(this.focusable.not(t).get()),
            this.hoverable = P(this.hoverable.not(t).get())
        },
        _delay: function(t, e) {
            var i = this;
            return setTimeout(function() {
                return ("string" == typeof t ? i[t] : t).apply(i, arguments)
            }, e || 0)
        },
        _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t),
            this._on(t, {
                mouseenter: function(t) {
                    this._addClass(P(t.currentTarget), null, "ui-state-hover")
                },
                mouseleave: function(t) {
                    this._removeClass(P(t.currentTarget), null, "ui-state-hover")
                }
            })
        },
        _focusable: function(t) {
            this.focusable = this.focusable.add(t),
            this._on(t, {
                focusin: function(t) {
                    this._addClass(P(t.currentTarget), null, "ui-state-focus")
                },
                focusout: function(t) {
                    this._removeClass(P(t.currentTarget), null, "ui-state-focus")
                }
            })
        },
        _trigger: function(t, e, i) {
            var s, o, n = this.options[t];
            if (i = i || {},
            (e = P.Event(e)).type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(),
            e.target = this.element[0],
            o = e.originalEvent)
                for (s in o)
                    s in e || (e[s] = o[s]);
            return this.element.trigger(e, i),
            !(P.isFunction(n) && !1 === n.apply(this.element[0], [e].concat(i)) || e.isDefaultPrevented())
        }
    },
    P.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(n, r) {
        P.Widget.prototype["_" + n] = function(e, t, i) {
            var s = (t = "string" == typeof t ? {
                effect: t
            } : t) ? !0 !== t && "number" != typeof t && t.effect || r : n
              , o = !P.isEmptyObject(t = "number" == typeof (t = t || {}) ? {
                duration: t
            } : t);
            t.complete = i,
            t.delay && e.delay(t.delay),
            o && P.effects && P.effects.effect[s] ? e[n](t) : s !== n && e[s] ? e[s](t.duration, t.easing, i) : e.queue(function(t) {
                P(this)[n](),
                i && i.call(e[0]),
                t()
            })
        }
    }),
    P.widget,
    x = Math.max,
    z = Math.abs,
    o = /left|center|right/,
    n = /top|center|bottom/,
    r = /[\+\-]\d+(\.[\d]+)?%?/,
    h = /^\w+/,
    a = /%$/,
    i = P.fn.position,
    P.position = {
        scrollbarWidth: function() {
            var t, e, i;
            return void 0 !== s ? s : (i = (e = P("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>")).children()[0],
            P("body").append(e),
            t = i.offsetWidth,
            e.css("overflow", "scroll"),
            t === (i = i.offsetWidth) && (i = e[0].clientWidth),
            e.remove(),
            s = t - i)
        },
        getScrollInfo: function(t) {
            var e = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x")
              , i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y")
              , e = "scroll" === e || "auto" === e && t.width < t.element[0].scrollWidth;
            return {
                width: "scroll" === i || "auto" === i && t.height < t.element[0].scrollHeight ? P.position.scrollbarWidth() : 0,
                height: e ? P.position.scrollbarWidth() : 0
            }
        },
        getWithinInfo: function(t) {
            var e = P(t || window)
              , i = P.isWindow(e[0])
              , s = !!e[0] && 9 === e[0].nodeType;
            return {
                element: e,
                isWindow: i,
                isDocument: s,
                offset: !i && !s ? P(t).offset() : {
                    left: 0,
                    top: 0
                },
                scrollLeft: e.scrollLeft(),
                scrollTop: e.scrollTop(),
                width: e.outerWidth(),
                height: e.outerHeight()
            }
        }
    },
    P.fn.position = function(p) {
        if (!p || !p.of)
            return i.apply(this, arguments);
        p = P.extend({}, p);
        var u, d, f, m, g, t, v = P(p.of), _ = P.position.getWithinInfo(p.within), w = P.position.getScrollInfo(_), b = (p.collision || "flip").split(" "), y = {}, e = 9 === (e = (t = v)[0]).nodeType ? {
            width: t.width(),
            height: t.height(),
            offset: {
                top: 0,
                left: 0
            }
        } : P.isWindow(e) ? {
            width: t.width(),
            height: t.height(),
            offset: {
                top: t.scrollTop(),
                left: t.scrollLeft()
            }
        } : e.preventDefault ? {
            width: 0,
            height: 0,
            offset: {
                top: e.pageY,
                left: e.pageX
            }
        } : {
            width: t.outerWidth(),
            height: t.outerHeight(),
            offset: t.offset()
        };
        return v[0].preventDefault && (p.at = "left top"),
        d = e.width,
        f = e.height,
        g = P.extend({}, m = e.offset),
        P.each(["my", "at"], function() {
            var t, e, i = (p[this] || "").split(" ");
            (i = 1 === i.length ? o.test(i[0]) ? i.concat(["center"]) : n.test(i[0]) ? ["center"].concat(i) : ["center", "center"] : i)[0] = o.test(i[0]) ? i[0] : "center",
            i[1] = n.test(i[1]) ? i[1] : "center",
            t = r.exec(i[0]),
            e = r.exec(i[1]),
            y[this] = [t ? t[0] : 0, e ? e[0] : 0],
            p[this] = [h.exec(i[0])[0], h.exec(i[1])[0]]
        }),
        1 === b.length && (b[1] = b[0]),
        "right" === p.at[0] ? g.left += d : "center" === p.at[0] && (g.left += d / 2),
        "bottom" === p.at[1] ? g.top += f : "center" === p.at[1] && (g.top += f / 2),
        u = C(y.at, d, f),
        g.left += u[0],
        g.top += u[1],
        this.each(function() {
            var i, t, r = P(this), h = r.outerWidth(), a = r.outerHeight(), e = I(this, "marginLeft"), s = I(this, "marginTop"), o = h + e + I(this, "marginRight") + w.width, n = a + s + I(this, "marginBottom") + w.height, l = P.extend({}, g), c = C(y.my, r.outerWidth(), r.outerHeight());
            "right" === p.my[0] ? l.left -= h : "center" === p.my[0] && (l.left -= h / 2),
            "bottom" === p.my[1] ? l.top -= a : "center" === p.my[1] && (l.top -= a / 2),
            l.left += c[0],
            l.top += c[1],
            i = {
                marginLeft: e,
                marginTop: s
            },
            P.each(["left", "top"], function(t, e) {
                P.ui.position[b[t]] && P.ui.position[b[t]][e](l, {
                    targetWidth: d,
                    targetHeight: f,
                    elemWidth: h,
                    elemHeight: a,
                    collisionPosition: i,
                    collisionWidth: o,
                    collisionHeight: n,
                    offset: [u[0] + c[0], u[1] + c[1]],
                    my: p.my,
                    at: p.at,
                    within: _,
                    elem: r
                })
            }),
            p.using && (t = function(t) {
                var e = m.left - l.left
                  , i = e + d - h
                  , s = m.top - l.top
                  , o = s + f - a
                  , n = {
                    target: {
                        element: v,
                        left: m.left,
                        top: m.top,
                        width: d,
                        height: f
                    },
                    element: {
                        element: r,
                        left: l.left,
                        top: l.top,
                        width: h,
                        height: a
                    },
                    horizontal: i < 0 ? "left" : 0 < e ? "right" : "center",
                    vertical: o < 0 ? "top" : 0 < s ? "bottom" : "middle"
                };
                d < h && d > z(e + i) && (n.horizontal = "center"),
                f < a && f > z(s + o) && (n.vertical = "middle"),
                n.important = x(z(e), z(i)) > x(z(s), z(o)) ? "horizontal" : "vertical",
                p.using.call(this, t, n)
            }
            ),
            r.offset(P.extend(l, {
                using: t
            }))
        })
    }
    ,
    P.ui.position = {
        fit: {
            left: function(t, e) {
                var i, s = e.within, o = s.isWindow ? s.scrollLeft : s.offset.left, s = s.width, n = t.left - e.collisionPosition.marginLeft, r = o - n, h = n + e.collisionWidth - s - o;
                s < e.collisionWidth ? 0 < r && h <= 0 ? (i = t.left + r + e.collisionWidth - s - o,
                t.left += r - i) : t.left = !(0 < h && r <= 0) && h < r ? o + s - e.collisionWidth : o : 0 < r ? t.left += r : 0 < h ? t.left -= h : t.left = x(t.left - n, t.left)
            },
            top: function(t, e) {
                var i, s = e.within, s = s.isWindow ? s.scrollTop : s.offset.top, o = e.within.height, n = t.top - e.collisionPosition.marginTop, r = s - n, h = n + e.collisionHeight - o - s;
                o < e.collisionHeight ? 0 < r && h <= 0 ? (i = t.top + r + e.collisionHeight - o - s,
                t.top += r - i) : t.top = !(0 < h && r <= 0) && h < r ? s + o - e.collisionHeight : s : 0 < r ? t.top += r : 0 < h ? t.top -= h : t.top = x(t.top - n, t.top)
            }
        },
        flip: {
            left: function(t, e) {
                var i = e.within
                  , s = i.offset.left + i.scrollLeft
                  , o = i.width
                  , i = i.isWindow ? i.scrollLeft : i.offset.left
                  , n = t.left - e.collisionPosition.marginLeft
                  , r = n - i
                  , n = n + e.collisionWidth - o - i
                  , h = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0
                  , a = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0
                  , l = -2 * e.offset[0];
                r < 0 ? ((o = t.left + h + a + l + e.collisionWidth - o - s) < 0 || z(r) > o) && (t.left += h + a + l) : 0 < n && (0 < (s = t.left - e.collisionPosition.marginLeft + h + a + l - i) || n > z(s)) && (t.left += h + a + l)
            },
            top: function(t, e) {
                var i = e.within
                  , s = i.offset.top + i.scrollTop
                  , o = i.height
                  , i = i.isWindow ? i.scrollTop : i.offset.top
                  , n = t.top - e.collisionPosition.marginTop
                  , r = n - i
                  , n = n + e.collisionHeight - o - i
                  , h = "top" === e.my[1] ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0
                  , a = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0
                  , l = -2 * e.offset[1];
                r < 0 ? ((o = t.top + h + a + l + e.collisionHeight - o - s) < 0 || z(r) > o) && (t.top += h + a + l) : 0 < n && (0 < (s = t.top - e.collisionPosition.marginTop + h + a + l - i) || n > z(s)) && (t.top += h + a + l)
            }
        },
        flipfit: {
            left: function() {
                P.ui.position.flip.left.apply(this, arguments),
                P.ui.position.fit.left.apply(this, arguments)
            },
            top: function() {
                P.ui.position.flip.top.apply(this, arguments),
                P.ui.position.fit.top.apply(this, arguments)
            }
        }
    },
    P.ui.position,
    P.extend(P.expr[":"], {
        data: P.expr.createPseudo ? P.expr.createPseudo(function(e) {
            return function(t) {
                return !!P.data(t, e)
            }
        }) : function(t, e, i) {
            return !!P.data(t, i[3])
        }
    }),
    P.fn.extend({
        disableSelection: (e = "onselectstart"in document.createElement("div") ? "selectstart" : "mousedown",
        function() {
            return this.on(e + ".ui-disableSelection", function(t) {
                t.preventDefault()
            })
        }
        ),
        enableSelection: function() {
            return this.off(".ui-disableSelection")
        }
    }),
    P.ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    },
    P.fn.scrollParent = function(t) {
        var e = this.css("position")
          , i = "absolute" === e
          , s = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/
          , t = this.parents().filter(function() {
            var t = P(this);
            return (!i || "static" !== t.css("position")) && s.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
        }).eq(0);
        return "fixed" !== e && t.length ? t : P(this[0].ownerDocument || document)
    }
    ,
    P.fn.extend({
        uniqueId: (t = 0,
        function() {
            return this.each(function() {
                this.id || (this.id = "ui-id-" + ++t)
            })
        }
        ),
        removeUniqueId: function() {
            return this.each(function() {
                /^ui-id-\d+$/.test(this.id) && P(this).removeAttr("id")
            })
        }
    }),
    P.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    var u = !1;
    P(document).on("mouseup", function() {
        u = !1
    }),
    P.widget("ui.mouse", {
        version: "1.12.1",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var e = this;
            this.element.on("mousedown." + this.widgetName, function(t) {
                return e._mouseDown(t)
            }).on("click." + this.widgetName, function(t) {
                return !0 === P.data(t.target, e.widgetName + ".preventClickEvent") ? (P.removeData(t.target, e.widgetName + ".preventClickEvent"),
                t.stopImmediatePropagation(),
                !1) : void 0
            }),
            this.started = !1
        },
        _mouseDestroy: function() {
            this.element.off("." + this.widgetName),
            this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function(t) {
            var e, i, s;
            if (!u)
                return this._mouseMoved = !1,
                this._mouseStarted && this._mouseUp(t),
                i = 1 === (this._mouseDownEvent = t).which,
                s = !("string" != typeof (e = this).options.cancel || !t.target.nodeName) && P(t.target).closest(this.options.cancel).length,
                i && !s && this._mouseCapture(t) && (this.mouseDelayMet = !this.options.delay,
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    e.mouseDelayMet = !0
                }, this.options.delay)),
                this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = !1 !== this._mouseStart(t),
                !this._mouseStarted) ? t.preventDefault() : (!0 === P.data(t.target, this.widgetName + ".preventClickEvent") && P.removeData(t.target, this.widgetName + ".preventClickEvent"),
                this._mouseMoveDelegate = function(t) {
                    return e._mouseMove(t)
                }
                ,
                this._mouseUpDelegate = function(t) {
                    return e._mouseUp(t)
                }
                ,
                this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate),
                t.preventDefault(),
                u = !0)),
                !0
        },
        _mouseMove: function(t) {
            if (this._mouseMoved) {
                if (P.ui.ie && (!document.documentMode || document.documentMode < 9) && !t.button)
                    return this._mouseUp(t);
                if (!t.which)
                    if (t.originalEvent.altKey || t.originalEvent.ctrlKey || t.originalEvent.metaKey || t.originalEvent.shiftKey)
                        this.ignoreMissingWhich = !0;
                    else if (!this.ignoreMissingWhich)
                        return this._mouseUp(t)
            }
            return (t.which || t.button) && (this._mouseMoved = !0),
            this._mouseStarted ? (this._mouseDrag(t),
            t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, t),
            this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)),
            !this._mouseStarted)
        },
        _mouseUp: function(t) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate),
            this._mouseStarted && (this._mouseStarted = !1,
            t.target === this._mouseDownEvent.target && P.data(t.target, this.widgetName + ".preventClickEvent", !0),
            this._mouseStop(t)),
            this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer),
            delete this._mouseDelayTimer),
            this.ignoreMissingWhich = !1,
            u = !1,
            t.preventDefault()
        },
        _mouseDistanceMet: function(t) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return !0
        }
    }),
    P.ui.plugin = {
        add: function(t, e, i) {
            var s, o = P.ui[t].prototype;
            for (s in i)
                o.plugins[s] = o.plugins[s] || [],
                o.plugins[s].push([e, i[s]])
        },
        call: function(t, e, i, s) {
            var o, n = t.plugins[e];
            if (n && (s || t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType))
                for (o = 0; n.length > o; o++)
                    t.options[n[o][0]] && n[o][1].apply(t.element, i)
        }
    },
    P.ui.safeActiveElement = function(e) {
        var i;
        try {
            i = e.activeElement
        } catch (t) {
            i = e.body
        }
        return i = (i = i || e.body).nodeName ? i : e.body
    }
    ,
    P.ui.safeBlur = function(t) {
        t && "body" !== t.nodeName.toLowerCase() && P(t).trigger("blur")
    }
    ,
    P.widget("ui.draggable", P.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function() {
            "original" === this.options.helper && this._setPositionRelative(),
            this.options.addClasses && this._addClass("ui-draggable"),
            this._setHandleClassName(),
            this._mouseInit()
        },
        _setOption: function(t, e) {
            this._super(t, e),
            "handle" === t && (this._removeHandleClassName(),
            this._setHandleClassName())
        },
        _destroy: function() {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? void (this.destroyOnClear = !0) : (this._removeHandleClassName(),
            void this._mouseDestroy())
        },
        _mouseCapture: function(t) {
            var e = this.options;
            return !(this.helper || e.disabled || 0 < P(t.target).closest(".ui-resizable-handle").length || (this.handle = this._getHandle(t),
            !this.handle) || (this._blurActiveElement(t),
            this._blockFrames(!0 === e.iframeFix ? "iframe" : e.iframeFix),
            0))
        },
        _blockFrames: function(t) {
            this.iframeBlocks = this.document.find(t).map(function() {
                var t = P(this);
                return P("<div>").css("position", "absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]
            })
        },
        _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(),
            delete this.iframeBlocks)
        },
        _blurActiveElement: function(t) {
            var e = P.ui.safeActiveElement(this.document[0]);
            P(t.target).closest(e).length || P.ui.safeBlur(e)
        },
        _mouseStart: function(t) {
            var e = this.options;
            return this.helper = this._createHelper(t),
            this._addClass(this.helper, "ui-draggable-dragging"),
            this._cacheHelperProportions(),
            P.ui.ddmanager && (P.ui.ddmanager.current = this),
            this._cacheMargins(),
            this.cssPosition = this.helper.css("position"),
            this.scrollParent = this.helper.scrollParent(!0),
            this.offsetParent = this.helper.offsetParent(),
            this.hasFixedAncestor = 0 < this.helper.parents().filter(function() {
                return "fixed" === P(this).css("position")
            }).length,
            this.positionAbs = this.element.offset(),
            this._refreshOffsets(t),
            this.originalPosition = this.position = this._generatePosition(t, !1),
            this.originalPageX = t.pageX,
            this.originalPageY = t.pageY,
            e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt),
            this._setContainment(),
            !1 === this._trigger("start", t) ? (this._clear(),
            !1) : (this._cacheHelperProportions(),
            P.ui.ddmanager && !e.dropBehaviour && P.ui.ddmanager.prepareOffsets(this, t),
            this._mouseDrag(t, !0),
            P.ui.ddmanager && P.ui.ddmanager.dragStart(this, t),
            !0)
        },
        _refreshOffsets: function(t) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            },
            this.offset.click = {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
            }
        },
        _mouseDrag: function(t, e) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()),
            this.position = this._generatePosition(t, !0),
            this.positionAbs = this._convertPositionTo("absolute"),
            !e) {
                e = this._uiHash();
                if (!1 === this._trigger("drag", t, e))
                    return this._mouseUp(new P.Event("mouseup",t)),
                    !1;
                this.position = e.position
            }
            return this.helper[0].style.left = this.position.left + "px",
            this.helper[0].style.top = this.position.top + "px",
            P.ui.ddmanager && P.ui.ddmanager.drag(this, t),
            !1
        },
        _mouseStop: function(t) {
            var e = this
              , i = !1;
            return P.ui.ddmanager && !this.options.dropBehaviour && (i = P.ui.ddmanager.drop(this, t)),
            this.dropped && (i = this.dropped,
            this.dropped = !1),
            "invalid" === this.options.revert && !i || "valid" === this.options.revert && i || !0 === this.options.revert || P.isFunction(this.options.revert) && this.options.revert.call(this.element, i) ? P(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                !1 !== e._trigger("stop", t) && e._clear()
            }) : !1 !== this._trigger("stop", t) && this._clear(),
            !1
        },
        _mouseUp: function(t) {
            return this._unblockFrames(),
            P.ui.ddmanager && P.ui.ddmanager.dragStop(this, t),
            this.handleElement.is(t.target) && this.element.trigger("focus"),
            P.ui.mouse.prototype._mouseUp.call(this, t)
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new P.Event("mouseup",{
                target: this.element[0]
            })) : this._clear(),
            this
        },
        _getHandle: function(t) {
            return !this.options.handle || !!P(t.target).closest(this.element.find(this.options.handle)).length
        },
        _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element,
            this._addClass(this.handleElement, "ui-draggable-handle")
        },
        _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
        },
        _createHelper: function(t) {
            var e = this.options
              , i = P.isFunction(e.helper)
              , t = i ? P(e.helper.apply(this.element[0], [t])) : "clone" === e.helper ? this.element.clone().removeAttr("id") : this.element;
            return t.parents("body").length || t.appendTo("parent" === e.appendTo ? this.element[0].parentNode : e.appendTo),
            i && t[0] === this.element[0] && this._setPositionRelative(),
            t[0] === this.element[0] || /(fixed|absolute)/.test(t.css("position")) || t.css("position", "absolute"),
            t
        },
        _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")),
            "left"in (t = P.isArray(t) ? {
                left: +t[0],
                top: +t[1] || 0
            } : t) && (this.offset.click.left = t.left + this.margins.left),
            "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left),
            "top"in t && (this.offset.click.top = t.top + this.margins.top),
            "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _isRootNode: function(t) {
            return /(html|body)/i.test(t.tagName) || t === this.document[0]
        },
        _getParentOffset: function() {
            var t = this.offsetParent.offset()
              , e = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== e && P.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(),
            t.top += this.scrollParent.scrollTop()),
            {
                top: (t = this._isRootNode(this.offsetParent[0]) ? {
                    top: 0,
                    left: 0
                } : t).top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            var t, e;
            return "relative" !== this.cssPosition ? {
                top: 0,
                left: 0
            } : (t = this.element.position(),
            e = this._isRootNode(this.scrollParent[0]),
            {
                top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + (e ? 0 : this.scrollParent.scrollTop()),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + (e ? 0 : this.scrollParent.scrollLeft())
            })
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var t, e = this.options, i = this.document[0];
            return this.relativeContainer = null,
            e.containment ? "window" === e.containment ? void (this.containment = [P(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, P(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, P(window).scrollLeft() + P(window).width() - this.helperProportions.width - this.margins.left, P(window).scrollTop() + (P(window).height() || i.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : "document" === e.containment ? void (this.containment = [0, 0, P(i).width() - this.helperProportions.width - this.margins.left, (P(i).height() || i.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : e.containment.constructor === Array ? void (this.containment = e.containment) : ("parent" === e.containment && (e.containment = this.helper[0].parentNode),
            void ((e = (i = P(e.containment))[0]) && (t = /(scroll|auto)/.test(i.css("overflow")),
            this.containment = [(parseInt(i.css("borderLeftWidth"), 10) || 0) + (parseInt(i.css("paddingLeft"), 10) || 0), (parseInt(i.css("borderTopWidth"), 10) || 0) + (parseInt(i.css("paddingTop"), 10) || 0), (t ? Math.max(e.scrollWidth, e.offsetWidth) : e.offsetWidth) - (parseInt(i.css("borderRightWidth"), 10) || 0) - (parseInt(i.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (t ? Math.max(e.scrollHeight, e.offsetHeight) : e.offsetHeight) - (parseInt(i.css("borderBottomWidth"), 10) || 0) - (parseInt(i.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom],
            this.relativeContainer = i))) : void (this.containment = null)
        },
        _convertPositionTo: function(t, e) {
            e = e || this.position;
            var t = "absolute" === t ? 1 : -1
              , i = this._isRootNode(this.scrollParent[0]);
            return {
                top: e.top + this.offset.relative.top * t + this.offset.parent.top * t - ("fixed" === this.cssPosition ? -this.offset.scroll.top : i ? 0 : this.offset.scroll.top) * t,
                left: e.left + this.offset.relative.left * t + this.offset.parent.left * t - ("fixed" === this.cssPosition ? -this.offset.scroll.left : i ? 0 : this.offset.scroll.left) * t
            }
        },
        _generatePosition: function(t, e) {
            var i, s = this.options, o = this._isRootNode(this.scrollParent[0]), n = t.pageX, r = t.pageY;
            return o && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }),
            {
                top: (r = e && (this.containment && (i = this.relativeContainer ? (e = this.relativeContainer.offset(),
                [this.containment[0] + e.left, this.containment[1] + e.top, this.containment[2] + e.left, this.containment[3] + e.top]) : this.containment,
                t.pageX - this.offset.click.left < i[0] && (n = i[0] + this.offset.click.left),
                t.pageY - this.offset.click.top < i[1] && (r = i[1] + this.offset.click.top),
                t.pageX - this.offset.click.left > i[2] && (n = i[2] + this.offset.click.left),
                t.pageY - this.offset.click.top > i[3]) && (r = i[3] + this.offset.click.top),
                s.grid && (e = s.grid[1] ? this.originalPageY + Math.round((r - this.originalPageY) / s.grid[1]) * s.grid[1] : this.originalPageY,
                r = !i || e - this.offset.click.top >= i[1] || e - this.offset.click.top > i[3] ? e : e - this.offset.click.top >= i[1] ? e - s.grid[1] : e + s.grid[1],
                t = s.grid[0] ? this.originalPageX + Math.round((n - this.originalPageX) / s.grid[0]) * s.grid[0] : this.originalPageX,
                n = !i || t - this.offset.click.left >= i[0] || t - this.offset.click.left > i[2] ? t : t - this.offset.click.left >= i[0] ? t - s.grid[0] : t + s.grid[0]),
                "y" === s.axis && (n = this.originalPageX),
                "x" === s.axis) ? this.originalPageY : r) - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : o ? 0 : this.offset.scroll.top),
                left: n - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : o ? 0 : this.offset.scroll.left)
            }
        },
        _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"),
            this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(),
            this.helper = null,
            this.cancelHelperRemoval = !1,
            this.destroyOnClear && this.destroy()
        },
        _trigger: function(t, e, i) {
            return i = i || this._uiHash(),
            P.ui.plugin.call(this, t, [e, i, this], !0),
            /^(drag|start|stop)/.test(t) && (this.positionAbs = this._convertPositionTo("absolute"),
            i.offset = this.positionAbs),
            P.Widget.prototype._trigger.call(this, t, e, i)
        },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }),
    P.ui.plugin.add("draggable", "connectToSortable", {
        start: function(e, t, i) {
            var s = P.extend({}, t, {
                item: i.element
            });
            i.sortables = [],
            P(i.options.connectToSortable).each(function() {
                var t = P(this).sortable("instance");
                t && !t.options.disabled && (i.sortables.push(t),
                t.refreshPositions(),
                t._trigger("activate", e, s))
            })
        },
        stop: function(e, t, i) {
            var s = P.extend({}, t, {
                item: i.element
            });
            i.cancelHelperRemoval = !1,
            P.each(i.sortables, function() {
                var t = this;
                t.isOver ? (t.isOver = 0,
                i.cancelHelperRemoval = !0,
                t.cancelHelperRemoval = !1,
                t._storedCSS = {
                    position: t.placeholder.css("position"),
                    top: t.placeholder.css("top"),
                    left: t.placeholder.css("left")
                },
                t._mouseStop(e),
                t.options.helper = t.options._helper) : (t.cancelHelperRemoval = !0,
                t._trigger("deactivate", e, s))
            })
        },
        drag: function(i, s, o) {
            P.each(o.sortables, function() {
                var t = !1
                  , e = this;
                e.positionAbs = o.positionAbs,
                e.helperProportions = o.helperProportions,
                e.offset.click = o.offset.click,
                e._intersectsWith(e.containerCache) && (t = !0,
                P.each(o.sortables, function() {
                    return this.positionAbs = o.positionAbs,
                    this.helperProportions = o.helperProportions,
                    this.offset.click = o.offset.click,
                    t = this !== e && this._intersectsWith(this.containerCache) && P.contains(e.element[0], this.element[0]) ? !1 : t
                })),
                t ? (e.isOver || (e.isOver = 1,
                o._parent = s.helper.parent(),
                e.currentItem = s.helper.appendTo(e.element).data("ui-sortable-item", !0),
                e.options._helper = e.options.helper,
                e.options.helper = function() {
                    return s.helper[0]
                }
                ,
                i.target = e.currentItem[0],
                e._mouseCapture(i, !0),
                e._mouseStart(i, !0, !0),
                e.offset.click.top = o.offset.click.top,
                e.offset.click.left = o.offset.click.left,
                e.offset.parent.left -= o.offset.parent.left - e.offset.parent.left,
                e.offset.parent.top -= o.offset.parent.top - e.offset.parent.top,
                o._trigger("toSortable", i),
                o.dropped = e.element,
                P.each(o.sortables, function() {
                    this.refreshPositions()
                }),
                o.currentItem = o.element,
                e.fromOutside = o),
                e.currentItem && (e._mouseDrag(i),
                s.position = e.position)) : e.isOver && (e.isOver = 0,
                e.cancelHelperRemoval = !0,
                e.options._revert = e.options.revert,
                e.options.revert = !1,
                e._trigger("out", i, e._uiHash(e)),
                e._mouseStop(i, !0),
                e.options.revert = e.options._revert,
                e.options.helper = e.options._helper,
                e.placeholder && e.placeholder.remove(),
                s.helper.appendTo(o._parent),
                o._refreshOffsets(i),
                s.position = o._generatePosition(i, !0),
                o._trigger("fromSortable", i),
                o.dropped = !1,
                P.each(o.sortables, function() {
                    this.refreshPositions()
                }))
            })
        }
    }),
    P.ui.plugin.add("draggable", "cursor", {
        start: function(t, e, i) {
            var s = P("body")
              , i = i.options;
            s.css("cursor") && (i._cursor = s.css("cursor")),
            s.css("cursor", i.cursor)
        },
        stop: function(t, e, i) {
            i = i.options;
            i._cursor && P("body").css("cursor", i._cursor)
        }
    }),
    P.ui.plugin.add("draggable", "opacity", {
        start: function(t, e, i) {
            e = P(e.helper),
            i = i.options;
            e.css("opacity") && (i._opacity = e.css("opacity")),
            e.css("opacity", i.opacity)
        },
        stop: function(t, e, i) {
            i = i.options;
            i._opacity && P(e.helper).css("opacity", i._opacity)
        }
    }),
    P.ui.plugin.add("draggable", "scroll", {
        start: function(t, e, i) {
            i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1)),
            i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
        },
        drag: function(t, e, i) {
            var s = i.options
              , o = !1
              , n = i.scrollParentNotHidden[0]
              , r = i.document[0];
            n !== r && "HTML" !== n.tagName ? (s.axis && "x" === s.axis || (i.overflowOffset.top + n.offsetHeight - t.pageY < s.scrollSensitivity ? n.scrollTop = o = n.scrollTop + s.scrollSpeed : t.pageY - i.overflowOffset.top < s.scrollSensitivity && (n.scrollTop = o = n.scrollTop - s.scrollSpeed)),
            s.axis && "y" === s.axis || (i.overflowOffset.left + n.offsetWidth - t.pageX < s.scrollSensitivity ? n.scrollLeft = o = n.scrollLeft + s.scrollSpeed : t.pageX - i.overflowOffset.left < s.scrollSensitivity && (n.scrollLeft = o = n.scrollLeft - s.scrollSpeed))) : (s.axis && "x" === s.axis || (t.pageY - P(r).scrollTop() < s.scrollSensitivity ? o = P(r).scrollTop(P(r).scrollTop() - s.scrollSpeed) : P(window).height() - (t.pageY - P(r).scrollTop()) < s.scrollSensitivity && (o = P(r).scrollTop(P(r).scrollTop() + s.scrollSpeed))),
            s.axis && "y" === s.axis || (t.pageX - P(r).scrollLeft() < s.scrollSensitivity ? o = P(r).scrollLeft(P(r).scrollLeft() - s.scrollSpeed) : P(window).width() - (t.pageX - P(r).scrollLeft()) < s.scrollSensitivity && (o = P(r).scrollLeft(P(r).scrollLeft() + s.scrollSpeed)))),
            !1 !== o && P.ui.ddmanager && !s.dropBehaviour && P.ui.ddmanager.prepareOffsets(i, t)
        }
    }),
    P.ui.plugin.add("draggable", "snap", {
        start: function(t, e, i) {
            var s = i.options;
            i.snapElements = [],
            P(s.snap.constructor !== String ? s.snap.items || ":data(ui-draggable)" : s.snap).each(function() {
                var t = P(this)
                  , e = t.offset();
                this !== i.element[0] && i.snapElements.push({
                    item: this,
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    top: e.top,
                    left: e.left
                })
            })
        },
        drag: function(t, e, i) {
            for (var s, o, n, r, h, a, l, c, p, u = i.options, d = u.snapTolerance, f = e.offset.left, m = f + i.helperProportions.width, g = e.offset.top, v = g + i.helperProportions.height, _ = i.snapElements.length - 1; 0 <= _; _--)
                a = (h = i.snapElements[_].left - i.margins.left) + i.snapElements[_].width,
                c = (l = i.snapElements[_].top - i.margins.top) + i.snapElements[_].height,
                m < h - d || a + d < f || v < l - d || c + d < g || !P.contains(i.snapElements[_].item.ownerDocument, i.snapElements[_].item) ? (i.snapElements[_].snapping && i.options.snap.release && i.options.snap.release.call(i.element, t, P.extend(i._uiHash(), {
                    snapItem: i.snapElements[_].item
                })),
                i.snapElements[_].snapping = !1) : ("inner" !== u.snapMode && (s = d >= Math.abs(l - v),
                o = d >= Math.abs(c - g),
                n = d >= Math.abs(h - m),
                r = d >= Math.abs(a - f),
                s && (e.position.top = i._convertPositionTo("relative", {
                    top: l - i.helperProportions.height,
                    left: 0
                }).top),
                o && (e.position.top = i._convertPositionTo("relative", {
                    top: c,
                    left: 0
                }).top),
                n && (e.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: h - i.helperProportions.width
                }).left),
                r) && (e.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: a
                }).left),
                p = s || o || n || r,
                "outer" !== u.snapMode && (s = d >= Math.abs(l - g),
                o = d >= Math.abs(c - v),
                n = d >= Math.abs(h - f),
                r = d >= Math.abs(a - m),
                s && (e.position.top = i._convertPositionTo("relative", {
                    top: l,
                    left: 0
                }).top),
                o && (e.position.top = i._convertPositionTo("relative", {
                    top: c - i.helperProportions.height,
                    left: 0
                }).top),
                n && (e.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: h
                }).left),
                r) && (e.position.left = i._convertPositionTo("relative", {
                    top: 0,
                    left: a - i.helperProportions.width
                }).left),
                !i.snapElements[_].snapping && (s || o || n || r || p) && i.options.snap.snap && i.options.snap.snap.call(i.element, t, P.extend(i._uiHash(), {
                    snapItem: i.snapElements[_].item
                })),
                i.snapElements[_].snapping = s || o || n || r || p)
        }
    }),
    P.ui.plugin.add("draggable", "stack", {
        start: function(t, e, i) {
            var s, i = i.options, i = P.makeArray(P(i.stack)).sort(function(t, e) {
                return (parseInt(P(t).css("zIndex"), 10) || 0) - (parseInt(P(e).css("zIndex"), 10) || 0)
            });
            i.length && (s = parseInt(P(i[0]).css("zIndex"), 10) || 0,
            P(i).each(function(t) {
                P(this).css("zIndex", s + t)
            }),
            this.css("zIndex", s + i.length))
        }
    }),
    P.ui.plugin.add("draggable", "zIndex", {
        start: function(t, e, i) {
            e = P(e.helper),
            i = i.options;
            e.css("zIndex") && (i._zIndex = e.css("zIndex")),
            e.css("zIndex", i.zIndex)
        },
        stop: function(t, e, i) {
            i = i.options;
            i._zIndex && P(e.helper).css("zIndex", i._zIndex)
        }
    }),
    P.ui.draggable,
    P.widget("ui.resizable", P.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            classes: {
                "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
            },
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
        },
        _num: function(t) {
            return parseFloat(t) || 0
        },
        _isNumber: function(t) {
            return !isNaN(parseFloat(t))
        },
        _hasScroll: function(t, e) {
            var i;
            return "hidden" !== P(t).css("overflow") && (i = !1,
            0 < t[e = e && "left" === e ? "scrollLeft" : "scrollTop"] || (t[e] = 1,
            i = 0 < t[e],
            t[e] = 0,
            i))
        },
        _create: function() {
            var t, e = this.options, i = this;
            this._addClass("ui-resizable"),
            P.extend(this, {
                _aspectRatio: !!e.aspectRatio,
                aspectRatio: e.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: e.helper || e.ghost || e.animate ? e.helper || "ui-resizable-helper" : null
            }),
            this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(P("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })),
            this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")),
            this.elementIsWrapper = !0,
            t = {
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom"),
                marginLeft: this.originalElement.css("marginLeft")
            },
            this.element.css(t),
            this.originalElement.css("margin", 0),
            this.originalResizeStyle = this.originalElement.css("resize"),
            this.originalElement.css("resize", "none"),
            this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })),
            this.originalElement.css(t),
            this._proportionallyResize()),
            this._setupHandles(),
            e.autoHide && P(this.element).on("mouseenter", function() {
                e.disabled || (i._removeClass("ui-resizable-autohide"),
                i._handles.show())
            }).on("mouseleave", function() {
                e.disabled || i.resizing || (i._addClass("ui-resizable-autohide"),
                i._handles.hide())
            }),
            this._mouseInit()
        },
        _destroy: function() {
            this._mouseDestroy();
            function t(t) {
                P(t).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()
            }
            var e;
            return this.elementIsWrapper && (t(this.element),
            e = this.element,
            this.originalElement.css({
                position: e.css("position"),
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: e.css("top"),
                left: e.css("left")
            }).insertAfter(e),
            e.remove()),
            this.originalElement.css("resize", this.originalResizeStyle),
            t(this.originalElement),
            this
        },
        _setOption: function(t, e) {
            "handles" === (this._super(t, e),
            t) && (this._removeHandles(),
            this._setupHandles())
        },
        _setupHandles: function() {
            var t, e, i, s, o, n = this.options, r = this;
            if (this.handles = n.handles || (P(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            } : "e,s,se"),
            this._handles = P(),
            this.handles.constructor === String)
                for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"),
                i = this.handles.split(","),
                this.handles = {},
                e = 0; i.length > e; e++)
                    s = "ui-resizable-" + (t = P.trim(i[e])),
                    o = P("<div>"),
                    this._addClass(o, "ui-resizable-handle " + s),
                    o.css({
                        zIndex: n.zIndex
                    }),
                    this.handles[t] = ".ui-resizable-" + t,
                    this.element.append(o);
            this._renderAxis = function(t) {
                var e, i, s;
                for (e in t = t || this.element,
                this.handles)
                    this.handles[e].constructor === String ? this.handles[e] = this.element.children(this.handles[e]).first().show() : (this.handles[e].jquery || this.handles[e].nodeType) && (this.handles[e] = P(this.handles[e]),
                    this._on(this.handles[e], {
                        mousedown: r._mouseDown
                    })),
                    this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (s = P(this.handles[e], this.element),
                    s = /sw|ne|nw|se|n|s/.test(e) ? s.outerHeight() : s.outerWidth(),
                    i = ["padding", /ne|nw|n/.test(e) ? "Top" : /se|sw|s/.test(e) ? "Bottom" : /^e$/.test(e) ? "Right" : "Left"].join(""),
                    t.css(i, s),
                    this._proportionallyResize()),
                    this._handles = this._handles.add(this.handles[e])
            }
            ,
            this._renderAxis(this.element),
            this._handles = this._handles.add(this.element.find(".ui-resizable-handle")),
            this._handles.disableSelection(),
            this._handles.on("mouseover", function() {
                r.resizing || (this.className && (o = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),
                r.axis = o && o[1] ? o[1] : "se")
            }),
            n.autoHide && (this._handles.hide(),
            this._addClass("ui-resizable-autohide"))
        },
        _removeHandles: function() {
            this._handles.remove()
        },
        _mouseCapture: function(t) {
            var e, i, s = !1;
            for (e in this.handles)
                i = P(this.handles[e])[0],
                i !== t.target && !P.contains(i, t.target) || (s = !0);
            return !this.options.disabled && s
        },
        _mouseStart: function(t) {
            var e, i, s = this.options, o = this.element;
            return this.resizing = !0,
            this._renderProxy(),
            e = this._num(this.helper.css("left")),
            i = this._num(this.helper.css("top")),
            s.containment && (e += P(s.containment).scrollLeft() || 0,
            i += P(s.containment).scrollTop() || 0),
            this.offset = this.helper.offset(),
            this.position = {
                left: e,
                top: i
            },
            this.size = this._helper ? {
                width: this.helper.width(),
                height: this.helper.height()
            } : {
                width: o.width(),
                height: o.height()
            },
            this.originalSize = this._helper ? {
                width: o.outerWidth(),
                height: o.outerHeight()
            } : {
                width: o.width(),
                height: o.height()
            },
            this.sizeDiff = {
                width: o.outerWidth() - o.width(),
                height: o.outerHeight() - o.height()
            },
            this.originalPosition = {
                left: e,
                top: i
            },
            this.originalMousePosition = {
                left: t.pageX,
                top: t.pageY
            },
            this.aspectRatio = "number" == typeof s.aspectRatio ? s.aspectRatio : this.originalSize.width / this.originalSize.height || 1,
            o = P(".ui-resizable-" + this.axis).css("cursor"),
            P("body").css("cursor", "auto" === o ? this.axis + "-resize" : o),
            this._addClass("ui-resizable-resizing"),
            this._propagate("start", t),
            !0
        },
        _mouseDrag: function(t) {
            var e = this.originalMousePosition
              , i = this.axis
              , s = t.pageX - e.left || 0
              , e = t.pageY - e.top || 0
              , i = this._change[i];
            return this._updatePrevProperties(),
            i && (i = i.apply(this, [t, s, e]),
            this._updateVirtualBoundaries(t.shiftKey),
            (this._aspectRatio || t.shiftKey) && (i = this._updateRatio(i, t)),
            i = this._respectSize(i, t),
            this._updateCache(i),
            this._propagate("resize", t),
            s = this._applyChanges(),
            !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(),
            P.isEmptyObject(s) || (this._updatePrevProperties(),
            this._trigger("resize", t, this.ui()),
            this._applyChanges())),
            !1
        },
        _mouseStop: function(t) {
            this.resizing = !1;
            var e, i, s, o = this.options, n = this;
            return this._helper && (i = (e = (i = this._proportionallyResizeElements).length && /textarea/i.test(i[0].nodeName)) && this._hasScroll(i[0], "left") ? 0 : n.sizeDiff.height,
            e = e ? 0 : n.sizeDiff.width,
            e = {
                width: n.helper.width() - e,
                height: n.helper.height() - i
            },
            i = parseFloat(n.element.css("left")) + (n.position.left - n.originalPosition.left) || null,
            s = parseFloat(n.element.css("top")) + (n.position.top - n.originalPosition.top) || null,
            o.animate || this.element.css(P.extend(e, {
                top: s,
                left: i
            })),
            n.helper.height(n.size.height),
            n.helper.width(n.size.width),
            this._helper) && !o.animate && this._proportionallyResize(),
            P("body").css("cursor", "auto"),
            this._removeClass("ui-resizable-resizing"),
            this._propagate("stop", t),
            this._helper && this.helper.remove(),
            !1
        },
        _updatePrevProperties: function() {
            this.prevPosition = {
                top: this.position.top,
                left: this.position.left
            },
            this.prevSize = {
                width: this.size.width,
                height: this.size.height
            }
        },
        _applyChanges: function() {
            var t = {};
            return this.position.top !== this.prevPosition.top && (t.top = this.position.top + "px"),
            this.position.left !== this.prevPosition.left && (t.left = this.position.left + "px"),
            this.size.width !== this.prevSize.width && (t.width = this.size.width + "px"),
            this.size.height !== this.prevSize.height && (t.height = this.size.height + "px"),
            this.helper.css(t),
            t
        },
        _updateVirtualBoundaries: function(t) {
            var e, i, s, o = this.options, o = {
                minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
                maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : 1 / 0,
                minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
                maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : 1 / 0
            };
            (this._aspectRatio || t) && (t = o.minHeight * this.aspectRatio,
            i = o.minWidth / this.aspectRatio,
            e = o.maxHeight * this.aspectRatio,
            s = o.maxWidth / this.aspectRatio,
            o.minWidth < t && (o.minWidth = t),
            o.minHeight < i && (o.minHeight = i),
            e < o.maxWidth && (o.maxWidth = e),
            s < o.maxHeight) && (o.maxHeight = s),
            this._vBoundaries = o
        },
        _updateCache: function(t) {
            this.offset = this.helper.offset(),
            this._isNumber(t.left) && (this.position.left = t.left),
            this._isNumber(t.top) && (this.position.top = t.top),
            this._isNumber(t.height) && (this.size.height = t.height),
            this._isNumber(t.width) && (this.size.width = t.width)
        },
        _updateRatio: function(t) {
            var e = this.position
              , i = this.size
              , s = this.axis;
            return this._isNumber(t.height) ? t.width = t.height * this.aspectRatio : this._isNumber(t.width) && (t.height = t.width / this.aspectRatio),
            "sw" === s && (t.left = e.left + (i.width - t.width),
            t.top = null),
            "nw" === s && (t.top = e.top + (i.height - t.height),
            t.left = e.left + (i.width - t.width)),
            t
        },
        _respectSize: function(t) {
            var e = this._vBoundaries
              , i = this.axis
              , s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width
              , o = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height
              , n = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width
              , r = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height
              , h = this.originalPosition.left + this.originalSize.width
              , a = this.originalPosition.top + this.originalSize.height
              , l = /sw|nw|w/.test(i)
              , i = /nw|ne|n/.test(i);
            return n && (t.width = e.minWidth),
            r && (t.height = e.minHeight),
            s && (t.width = e.maxWidth),
            o && (t.height = e.maxHeight),
            n && l && (t.left = h - e.minWidth),
            s && l && (t.left = h - e.maxWidth),
            r && i && (t.top = a - e.minHeight),
            o && i && (t.top = a - e.maxHeight),
            t.width || t.height || t.left || !t.top ? t.width || t.height || t.top || !t.left || (t.left = null) : t.top = null,
            t
        },
        _getPaddingPlusBorderDimensions: function(t) {
            for (var e = 0, i = [], s = [t.css("borderTopWidth"), t.css("borderRightWidth"), t.css("borderBottomWidth"), t.css("borderLeftWidth")], o = [t.css("paddingTop"), t.css("paddingRight"), t.css("paddingBottom"), t.css("paddingLeft")]; e < 4; e++)
                i[e] = parseFloat(s[e]) || 0,
                i[e] += parseFloat(o[e]) || 0;
            return {
                height: i[0] + i[2],
                width: i[1] + i[3]
            }
        },
        _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
                for (var t, e = 0, i = this.helper || this.element; this._proportionallyResizeElements.length > e; e++)
                    t = this._proportionallyResizeElements[e],
                    this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(t)),
                    t.css({
                        height: i.height() - this.outerDimensions.height || 0,
                        width: i.width() - this.outerDimensions.width || 0
                    })
        },
        _renderProxy: function() {
            var t = this.element
              , e = this.options;
            this.elementOffset = t.offset(),
            this._helper ? (this.helper = this.helper || P("<div style='overflow:hidden;'></div>"),
            this._addClass(this.helper, this._helper),
            this.helper.css({
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++e.zIndex
            }),
            this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function(t, e) {
                return {
                    width: this.originalSize.width + e
                }
            },
            w: function(t, e) {
                var i = this.originalSize;
                return {
                    left: this.originalPosition.left + e,
                    width: i.width - e
                }
            },
            n: function(t, e, i) {
                var s = this.originalSize;
                return {
                    top: this.originalPosition.top + i,
                    height: s.height - i
                }
            },
            s: function(t, e, i) {
                return {
                    height: this.originalSize.height + i
                }
            },
            se: function(t, e, i) {
                return P.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [t, e, i]))
            },
            sw: function(t, e, i) {
                return P.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [t, e, i]))
            },
            ne: function(t, e, i) {
                return P.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [t, e, i]))
            },
            nw: function(t, e, i) {
                return P.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [t, e, i]))
            }
        },
        _propagate: function(t, e) {
            P.ui.plugin.call(this, t, [e, this.ui()]),
            "resize" !== t && this._trigger(t, e, this.ui())
        },
        plugins: {},
        ui: function() {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    }),
    P.ui.plugin.add("resizable", "animate", {
        stop: function(e) {
            var i = P(this).resizable("instance")
              , t = i.options
              , s = i._proportionallyResizeElements
              , o = s.length && /textarea/i.test(s[0].nodeName)
              , n = o && i._hasScroll(s[0], "left") ? 0 : i.sizeDiff.height
              , o = o ? 0 : i.sizeDiff.width
              , o = {
                width: i.size.width - o,
                height: i.size.height - n
            }
              , n = parseFloat(i.element.css("left")) + (i.position.left - i.originalPosition.left) || null
              , r = parseFloat(i.element.css("top")) + (i.position.top - i.originalPosition.top) || null;
            i.element.animate(P.extend(o, r && n ? {
                top: r,
                left: n
            } : {}), {
                duration: t.animateDuration,
                easing: t.animateEasing,
                step: function() {
                    var t = {
                        width: parseFloat(i.element.css("width")),
                        height: parseFloat(i.element.css("height")),
                        top: parseFloat(i.element.css("top")),
                        left: parseFloat(i.element.css("left"))
                    };
                    s && s.length && P(s[0]).css({
                        width: t.width,
                        height: t.height
                    }),
                    i._updateCache(t),
                    i._propagate("resize", e)
                }
            })
        }
    }),
    P.ui.plugin.add("resizable", "containment", {
        start: function() {
            var i, s, t, e, o = P(this).resizable("instance"), n = o.options, r = o.element, n = n.containment, r = n instanceof P ? n.get(0) : /parent/.test(n) ? r.parent().get(0) : n;
            r && (o.containerElement = P(r),
            /document/.test(n) || n === document ? (o.containerOffset = {
                left: 0,
                top: 0
            },
            o.containerPosition = {
                left: 0,
                top: 0
            },
            o.parentData = {
                element: P(document),
                left: 0,
                top: 0,
                width: P(document).width(),
                height: P(document).height() || document.body.parentNode.scrollHeight
            }) : (i = P(r),
            s = [],
            P(["Top", "Right", "Left", "Bottom"]).each(function(t, e) {
                s[t] = o._num(i.css("padding" + e))
            }),
            o.containerOffset = i.offset(),
            o.containerPosition = i.position(),
            o.containerSize = {
                height: i.innerHeight() - s[3],
                width: i.innerWidth() - s[1]
            },
            n = o.containerOffset,
            e = o.containerSize.height,
            t = o.containerSize.width,
            t = o._hasScroll(r, "left") ? r.scrollWidth : t,
            e = o._hasScroll(r) ? r.scrollHeight : e,
            o.parentData = {
                element: r,
                left: n.left,
                top: n.top,
                width: t,
                height: e
            }))
        },
        resize: function(t) {
            var e = P(this).resizable("instance")
              , i = e.options
              , s = e.containerOffset
              , o = e.position
              , t = e._aspectRatio || t.shiftKey
              , n = {
                top: 0,
                left: 0
            }
              , r = e.containerElement
              , h = !0;
            r[0] !== document && /static/.test(r.css("position")) && (n = s),
            o.left < (e._helper ? s.left : 0) && (e.size.width = e.size.width + (e._helper ? e.position.left - s.left : e.position.left - n.left),
            t && (e.size.height = e.size.width / e.aspectRatio,
            h = !1),
            e.position.left = i.helper ? s.left : 0),
            o.top < (e._helper ? s.top : 0) && (e.size.height = e.size.height + (e._helper ? e.position.top - s.top : e.position.top),
            t && (e.size.width = e.size.height * e.aspectRatio,
            h = !1),
            e.position.top = e._helper ? s.top : 0),
            r = e.containerElement.get(0) === e.element.parent().get(0),
            i = /relative|absolute/.test(e.containerElement.css("position")),
            r && i ? (e.offset.left = e.parentData.left + e.position.left,
            e.offset.top = e.parentData.top + e.position.top) : (e.offset.left = e.element.offset().left,
            e.offset.top = e.element.offset().top),
            o = Math.abs(e.sizeDiff.width + (e._helper ? e.offset.left - n.left : e.offset.left - s.left)),
            r = Math.abs(e.sizeDiff.height + (e._helper ? e.offset.top - n.top : e.offset.top - s.top)),
            o + e.size.width >= e.parentData.width && (e.size.width = e.parentData.width - o,
            t) && (e.size.height = e.size.width / e.aspectRatio,
            h = !1),
            r + e.size.height >= e.parentData.height && (e.size.height = e.parentData.height - r,
            t) && (e.size.width = e.size.height * e.aspectRatio,
            h = !1),
            h || (e.position.left = e.prevPosition.left,
            e.position.top = e.prevPosition.top,
            e.size.width = e.prevSize.width,
            e.size.height = e.prevSize.height)
        },
        stop: function() {
            var t = P(this).resizable("instance")
              , e = t.options
              , i = t.containerOffset
              , s = t.containerPosition
              , o = t.containerElement
              , n = P(t.helper)
              , r = n.offset()
              , h = n.outerWidth() - t.sizeDiff.width
              , n = n.outerHeight() - t.sizeDiff.height;
            t._helper && !e.animate && /relative/.test(o.css("position")) && P(this).css({
                left: r.left - s.left - i.left,
                width: h,
                height: n
            }),
            t._helper && !e.animate && /static/.test(o.css("position")) && P(this).css({
                left: r.left - s.left - i.left,
                width: h,
                height: n
            })
        }
    }),
    P.ui.plugin.add("resizable", "alsoResize", {
        start: function() {
            var t = P(this).resizable("instance").options;
            P(t.alsoResize).each(function() {
                var t = P(this);
                t.data("ui-resizable-alsoresize", {
                    width: parseFloat(t.width()),
                    height: parseFloat(t.height()),
                    left: parseFloat(t.css("left")),
                    top: parseFloat(t.css("top"))
                })
            })
        },
        resize: function(t, i) {
            var e = P(this).resizable("instance")
              , s = e.options
              , o = e.originalSize
              , n = e.originalPosition
              , r = {
                height: e.size.height - o.height || 0,
                width: e.size.width - o.width || 0,
                top: e.position.top - n.top || 0,
                left: e.position.left - n.left || 0
            };
            P(s.alsoResize).each(function() {
                var t = P(this)
                  , s = P(this).data("ui-resizable-alsoresize")
                  , o = {}
                  , e = t.parents(i.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                P.each(e, function(t, e) {
                    var i = (s[e] || 0) + (r[e] || 0);
                    i && 0 <= i && (o[e] = i || null)
                }),
                t.css(o)
            })
        },
        stop: function() {
            P(this).removeData("ui-resizable-alsoresize")
        }
    }),
    P.ui.plugin.add("resizable", "ghost", {
        start: function() {
            var t = P(this).resizable("instance")
              , e = t.size;
            t.ghost = t.originalElement.clone(),
            t.ghost.css({
                opacity: .25,
                display: "block",
                position: "relative",
                height: e.height,
                width: e.width,
                margin: 0,
                left: 0,
                top: 0
            }),
            t._addClass(t.ghost, "ui-resizable-ghost"),
            !1 !== P.uiBackCompat && "string" == typeof t.options.ghost && t.ghost.addClass(this.options.ghost),
            t.ghost.appendTo(t.helper)
        },
        resize: function() {
            var t = P(this).resizable("instance");
            t.ghost && t.ghost.css({
                position: "relative",
                height: t.size.height,
                width: t.size.width
            })
        },
        stop: function() {
            var t = P(this).resizable("instance");
            t.ghost && t.helper && t.helper.get(0).removeChild(t.ghost.get(0))
        }
    }),
    P.ui.plugin.add("resizable", "grid", {
        resize: function() {
            var t, e = P(this).resizable("instance"), i = e.options, s = e.size, o = e.originalSize, n = e.originalPosition, r = e.axis, h = "number" == typeof i.grid ? [i.grid, i.grid] : i.grid, a = h[0] || 1, l = h[1] || 1, c = Math.round((s.width - o.width) / a) * a, s = Math.round((s.height - o.height) / l) * l, p = o.width + c, u = o.height + s, d = i.maxWidth && p > i.maxWidth, f = i.maxHeight && u > i.maxHeight, m = i.minWidth && i.minWidth > p, g = i.minHeight && i.minHeight > u;
            i.grid = h,
            m && (p += a),
            g && (u += l),
            d && (p -= a),
            f && (u -= l),
            /^(se|s|e)$/.test(r) ? (e.size.width = p,
            e.size.height = u) : /^(ne)$/.test(r) ? (e.size.width = p,
            e.size.height = u,
            e.position.top = n.top - s) : /^(sw)$/.test(r) ? (e.size.width = p,
            e.size.height = u,
            e.position.left = n.left - c) : ((u - l <= 0 || p - a <= 0) && (t = e._getPaddingPlusBorderDimensions(this)),
            0 < u - l ? (e.size.height = u,
            e.position.top = n.top - s) : (u = l - t.height,
            e.size.height = u,
            e.position.top = n.top + o.height - u),
            0 < p - a ? (e.size.width = p,
            e.position.left = n.left - c) : (p = a - t.width,
            e.size.width = p,
            e.position.left = n.left + o.width - p))
        }
    }),
    P.ui.resizable,
    P.widget("ui.sortable", P.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _isOverAxis: function(t, e, i) {
            return e <= t && t < e + i
        },
        _isFloating: function(t) {
            return /left|right/.test(t.css("float")) || /inline|table-cell/.test(t.css("display"))
        },
        _create: function() {
            this.containerCache = {},
            this._addClass("ui-sortable"),
            this.refresh(),
            this.offset = this.element.offset(),
            this._mouseInit(),
            this._setHandleClassName(),
            this.ready = !0
        },
        _setOption: function(t, e) {
            this._super(t, e),
            "handle" === t && this._setHandleClassName()
        },
        _setHandleClassName: function() {
            var t = this;
            this._removeClass(this.element.find(".ui-sortable-handle"), "ui-sortable-handle"),
            P.each(this.items, function() {
                t._addClass(this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item, "ui-sortable-handle")
            })
        },
        _destroy: function() {
            this._mouseDestroy();
            for (var t = this.items.length - 1; 0 <= t; t--)
                this.items[t].item.removeData(this.widgetName + "-item");
            return this
        },
        _mouseCapture: function(t, e) {
            var i = null
              , s = !1
              , o = this;
            return !(this.reverting || this.options.disabled || "static" === this.options.type || (this._refreshItems(t),
            P(t.target).parents().each(function() {
                return P.data(this, o.widgetName + "-item") === o ? (i = P(this),
                !1) : void 0
            }),
            !(i = P.data(t.target, o.widgetName + "-item") === o ? P(t.target) : i)) || (this.options.handle && !e && (P(this.options.handle, i).find("*").addBack().each(function() {
                this === t.target && (s = !0)
            }),
            !s) || (this.currentItem = i,
            this._removeCurrentsFromItems(),
            0)))
        },
        _mouseStart: function(t, e, i) {
            var s, o, n = this.options;
            if ((this.currentContainer = this).refreshPositions(),
            this.helper = this._createHelper(t),
            this._cacheHelperProportions(),
            this._cacheMargins(),
            this.scrollParent = this.helper.scrollParent(),
            this.offset = this.currentItem.offset(),
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            },
            P.extend(this.offset, {
                click: {
                    left: t.pageX - this.offset.left,
                    top: t.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }),
            this.helper.css("position", "absolute"),
            this.cssPosition = this.helper.css("position"),
            this.originalPosition = this._generatePosition(t),
            this.originalPageX = t.pageX,
            this.originalPageY = t.pageY,
            n.cursorAt && this._adjustOffsetFromHelper(n.cursorAt),
            this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            },
            this.helper[0] !== this.currentItem[0] && this.currentItem.hide(),
            this._createPlaceholder(),
            n.containment && this._setContainment(),
            n.cursor && "auto" !== n.cursor && (o = this.document.find("body"),
            this.storedCursor = o.css("cursor"),
            o.css("cursor", n.cursor),
            this.storedStylesheet = P("<style>*{ cursor: " + n.cursor + " !important; }</style>").appendTo(o)),
            n.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")),
            this.helper.css("opacity", n.opacity)),
            n.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")),
            this.helper.css("zIndex", n.zIndex)),
            this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()),
            this._trigger("start", t, this._uiHash()),
            this._preserveHelperProportions || this._cacheHelperProportions(),
            !i)
                for (s = this.containers.length - 1; 0 <= s; s--)
                    this.containers[s]._trigger("activate", t, this._uiHash(this));
            return P.ui.ddmanager && (P.ui.ddmanager.current = this),
            P.ui.ddmanager && !n.dropBehaviour && P.ui.ddmanager.prepareOffsets(this, t),
            this.dragging = !0,
            this._addClass(this.helper, "ui-sortable-helper"),
            this._mouseDrag(t),
            !0
        },
        _mouseDrag: function(t) {
            var e, i, s, o, n = this.options, r = !1;
            for (this.position = this._generatePosition(t),
            this.positionAbs = this._convertPositionTo("absolute"),
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs),
            this.options.scroll && (this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < n.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + n.scrollSpeed : t.pageY - this.overflowOffset.top < n.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - n.scrollSpeed),
            this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < n.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + n.scrollSpeed : t.pageX - this.overflowOffset.left < n.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - n.scrollSpeed)) : (t.pageY - this.document.scrollTop() < n.scrollSensitivity ? r = this.document.scrollTop(this.document.scrollTop() - n.scrollSpeed) : this.window.height() - (t.pageY - this.document.scrollTop()) < n.scrollSensitivity && (r = this.document.scrollTop(this.document.scrollTop() + n.scrollSpeed)),
            t.pageX - this.document.scrollLeft() < n.scrollSensitivity ? r = this.document.scrollLeft(this.document.scrollLeft() - n.scrollSpeed) : this.window.width() - (t.pageX - this.document.scrollLeft()) < n.scrollSensitivity && (r = this.document.scrollLeft(this.document.scrollLeft() + n.scrollSpeed))),
            !1 !== r) && P.ui.ddmanager && !n.dropBehaviour && P.ui.ddmanager.prepareOffsets(this, t),
            this.positionAbs = this._convertPositionTo("absolute"),
            this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"),
            this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"),
            e = this.items.length - 1; 0 <= e; e--)
                if (s = (i = this.items[e]).item[0],
                (o = this._intersectsWithPointer(i)) && i.instance === this.currentContainer && s !== this.currentItem[0] && this.placeholder[1 === o ? "next" : "prev"]()[0] !== s && !P.contains(this.placeholder[0], s) && ("semi-dynamic" !== this.options.type || !P.contains(this.element[0], s))) {
                    if (this.direction = 1 === o ? "down" : "up",
                    "pointer" !== this.options.tolerance && !this._intersectsWithSides(i))
                        break;
                    this._rearrange(t, i),
                    this._trigger("change", t, this._uiHash());
                    break
                }
            return this._contactContainers(t),
            P.ui.ddmanager && P.ui.ddmanager.drag(this, t),
            this._trigger("sort", t, this._uiHash()),
            this.lastPositionAbs = this.positionAbs,
            !1
        },
        _mouseStop: function(t, e) {
            var i, s, o, n;
            if (t)
                return P.ui.ddmanager && !this.options.dropBehaviour && P.ui.ddmanager.drop(this, t),
                this.options.revert ? (s = (i = this).placeholder.offset(),
                n = {},
                (o = this.options.axis) && "x" !== o || (n.left = s.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft)),
                o && "y" !== o || (n.top = s.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop)),
                this.reverting = !0,
                P(this.helper).animate(n, parseInt(this.options.revert, 10) || 500, function() {
                    i._clear(t)
                })) : this._clear(t, e),
                !1
        },
        cancel: function() {
            if (this.dragging) {
                this._mouseUp(new P.Event("mouseup",{
                    target: null
                })),
                "original" === this.options.helper ? (this.currentItem.css(this._storedCSS),
                this._removeClass(this.currentItem, "ui-sortable-helper")) : this.currentItem.show();
                for (var t = this.containers.length - 1; 0 <= t; t--)
                    this.containers[t]._trigger("deactivate", null, this._uiHash(this)),
                    this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)),
                    this.containers[t].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(),
            P.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }),
            this.domPosition.prev ? P(this.domPosition.prev).after(this.currentItem) : P(this.domPosition.parent).prepend(this.currentItem)),
            this
        },
        serialize: function(e) {
            var t = this._getItemsAsjQuery(e && e.connected)
              , i = [];
            return e = e || {},
            P(t).each(function() {
                var t = (P(e.item || this).attr(e.attribute || "id") || "").match(e.expression || /(.+)[\-=_](.+)/);
                t && i.push((e.key || t[1] + "[]") + "=" + (e.key && e.expression ? t[1] : t[2]))
            }),
            !i.length && e.key && i.push(e.key + "="),
            i.join("&")
        },
        toArray: function(t) {
            var e = this._getItemsAsjQuery(t && t.connected)
              , i = [];
            return t = t || {},
            e.each(function() {
                i.push(P(t.item || this).attr(t.attribute || "id") || "")
            }),
            i
        },
        _intersectsWith: function(t) {
            var e = this.positionAbs.left
              , i = e + this.helperProportions.width
              , s = this.positionAbs.top
              , o = s + this.helperProportions.height
              , n = t.left
              , r = n + t.width
              , h = t.top
              , a = h + t.height
              , l = this.offset.click.top
              , c = this.offset.click.left
              , l = "x" === this.options.axis || h < s + l && s + l < a
              , c = "y" === this.options.axis || n < e + c && e + c < r;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > t[this.floating ? "width" : "height"] ? l && c : e + this.helperProportions.width / 2 > n && r > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > h && a > o - this.helperProportions.height / 2
        },
        _intersectsWithPointer: function(t) {
            var e = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, t.top, t.height)
              , t = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, t.left, t.width);
            return !!(e && t) && (e = this._getDragVerticalDirection(),
            t = this._getDragHorizontalDirection(),
            this.floating ? "right" === t || "down" === e ? 2 : 1 : e && ("down" === e ? 2 : 1))
        },
        _intersectsWithSides: function(t) {
            var e = this._isOverAxis(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height)
              , t = this._isOverAxis(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width)
              , i = this._getDragVerticalDirection()
              , s = this._getDragHorizontalDirection();
            return this.floating && s ? "right" === s && t || "left" === s && !t : i && ("down" === i && e || "up" === i && !e)
        },
        _getDragVerticalDirection: function() {
            var t = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 != t && (0 < t ? "down" : "up")
        },
        _getDragHorizontalDirection: function() {
            var t = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 != t && (0 < t ? "right" : "left")
        },
        refresh: function(t) {
            return this._refreshItems(t),
            this._setHandleClassName(),
            this.refreshPositions(),
            this
        },
        _connectWith: function() {
            var t = this.options;
            return t.connectWith.constructor === String ? [t.connectWith] : t.connectWith
        },
        _getItemsAsjQuery: function(t) {
            function e() {
                r.push(this)
            }
            var i, s, o, n, r = [], h = [], a = this._connectWith();
            if (a && t)
                for (i = a.length - 1; 0 <= i; i--)
                    for (s = (o = P(a[i], this.document[0])).length - 1; 0 <= s; s--)
                        (n = P.data(o[s], this.widgetFullName)) && n !== this && !n.options.disabled && h.push([P.isFunction(n.options.items) ? n.options.items.call(n.element) : P(n.options.items, n.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), n]);
            for (h.push([P.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : P(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]),
            i = h.length - 1; 0 <= i; i--)
                h[i][0].each(e);
            return P(r)
        },
        _removeCurrentsFromItems: function() {
            var i = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = P.grep(this.items, function(t) {
                for (var e = 0; i.length > e; e++)
                    if (i[e] === t.item[0])
                        return !1;
                return !0
            })
        },
        _refreshItems: function(t) {
            this.items = [],
            this.containers = [this];
            var e, i, s, o, n, r, h, a, l = this.items, c = [[P.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {
                item: this.currentItem
            }) : P(this.options.items, this.element), this]], p = this._connectWith();
            if (p && this.ready)
                for (e = p.length - 1; 0 <= e; e--)
                    for (i = (s = P(p[e], this.document[0])).length - 1; 0 <= i; i--)
                        (o = P.data(s[i], this.widgetFullName)) && o !== this && !o.options.disabled && (c.push([P.isFunction(o.options.items) ? o.options.items.call(o.element[0], t, {
                            item: this.currentItem
                        }) : P(o.options.items, o.element), o]),
                        this.containers.push(o));
            for (e = c.length - 1; 0 <= e; e--)
                for (n = c[e][1],
                a = (r = c[e][i = 0]).length; i < a; i++)
                    (h = P(r[i])).data(this.widgetName + "-item", n),
                    l.push({
                        item: h,
                        instance: n,
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    })
        },
        refreshPositions: function(t) {
            var e, i, s, o;
            for (this.floating = !!this.items.length && ("x" === this.options.axis || this._isFloating(this.items[0].item)),
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset()),
            e = this.items.length - 1; 0 <= e; e--)
                (i = this.items[e]).instance !== this.currentContainer && this.currentContainer && i.item[0] !== this.currentItem[0] || (s = this.options.toleranceElement ? P(this.options.toleranceElement, i.item) : i.item,
                t || (i.width = s.outerWidth(),
                i.height = s.outerHeight()),
                o = s.offset(),
                i.left = o.left,
                i.top = o.top);
            if (this.options.custom && this.options.custom.refreshContainers)
                this.options.custom.refreshContainers.call(this);
            else
                for (e = this.containers.length - 1; 0 <= e; e--)
                    o = this.containers[e].element.offset(),
                    this.containers[e].containerCache.left = o.left,
                    this.containers[e].containerCache.top = o.top,
                    this.containers[e].containerCache.width = this.containers[e].element.outerWidth(),
                    this.containers[e].containerCache.height = this.containers[e].element.outerHeight();
            return this
        },
        _createPlaceholder: function(i) {
            var s, o = (i = i || this).options;
            o.placeholder && o.placeholder.constructor !== String || (s = o.placeholder,
            o.placeholder = {
                element: function() {
                    var t = i.currentItem[0].nodeName.toLowerCase()
                      , e = P("<" + t + ">", i.document[0]);
                    return i._addClass(e, "ui-sortable-placeholder", s || i.currentItem[0].className)._removeClass(e, "ui-sortable-helper"),
                    "tbody" === t ? i._createTrPlaceholder(i.currentItem.find("tr").eq(0), P("<tr>", i.document[0]).appendTo(e)) : "tr" === t ? i._createTrPlaceholder(i.currentItem, e) : "img" === t && e.attr("src", i.currentItem.attr("src")),
                    s || e.css("visibility", "hidden"),
                    e
                },
                update: function(t, e) {
                    s && !o.forcePlaceholderSize || (e.height() || e.height(i.currentItem.innerHeight() - parseInt(i.currentItem.css("paddingTop") || 0, 10) - parseInt(i.currentItem.css("paddingBottom") || 0, 10)),
                    e.width()) || e.width(i.currentItem.innerWidth() - parseInt(i.currentItem.css("paddingLeft") || 0, 10) - parseInt(i.currentItem.css("paddingRight") || 0, 10))
                }
            }),
            i.placeholder = P(o.placeholder.element.call(i.element, i.currentItem)),
            i.currentItem.after(i.placeholder),
            o.placeholder.update(i, i.placeholder)
        },
        _createTrPlaceholder: function(t, e) {
            var i = this;
            t.children().each(function() {
                P("<td>&#160;</td>", i.document[0]).attr("colspan", P(this).attr("colspan") || 1).appendTo(e)
            })
        },
        _contactContainers: function(t) {
            for (var e, i, s, o, n, r, h, a, l, c = null, p = null, u = this.containers.length - 1; 0 <= u; u--)
                if (!P.contains(this.currentItem[0], this.containers[u].element[0]))
                    if (this._intersectsWith(this.containers[u].containerCache)) {
                        if (c && P.contains(this.containers[u].element[0], c.element[0]))
                            continue;
                        c = this.containers[u],
                        p = u
                    } else
                        this.containers[u].containerCache.over && (this.containers[u]._trigger("out", t, this._uiHash(this)),
                        this.containers[u].containerCache.over = 0);
            if (c)
                if (1 === this.containers.length)
                    this.containers[p].containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash(this)),
                    this.containers[p].containerCache.over = 1);
                else {
                    for (i = 1e4,
                    s = null,
                    o = (a = c.floating || this._isFloating(this.currentItem)) ? "left" : "top",
                    n = a ? "width" : "height",
                    l = a ? "pageX" : "pageY",
                    e = this.items.length - 1; 0 <= e; e--)
                        P.contains(this.containers[p].element[0], this.items[e].item[0]) && this.items[e].item[0] !== this.currentItem[0] && (r = this.items[e].item.offset()[o],
                        h = !1,
                        t[l] - r > this.items[e][n] / 2 && (h = !0),
                        i > Math.abs(t[l] - r)) && (i = Math.abs(t[l] - r),
                        s = this.items[e],
                        this.direction = h ? "up" : "down");
                    (s || this.options.dropOnEmpty) && (this.currentContainer === this.containers[p] ? this.currentContainer.containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash()),
                    this.currentContainer.containerCache.over = 1) : (s ? this._rearrange(t, s, null, !0) : this._rearrange(t, null, this.containers[p].element, !0),
                    this._trigger("change", t, this._uiHash()),
                    this.containers[p]._trigger("change", t, this._uiHash(this)),
                    this.currentContainer = this.containers[p],
                    this.options.placeholder.update(this.currentContainer, this.placeholder),
                    this.containers[p]._trigger("over", t, this._uiHash(this)),
                    this.containers[p].containerCache.over = 1))
                }
        },
        _createHelper: function(t) {
            var e = this.options
              , t = P.isFunction(e.helper) ? P(e.helper.apply(this.element[0], [t, this.currentItem])) : "clone" === e.helper ? this.currentItem.clone() : this.currentItem;
            return t.parents("body").length || P("parent" !== e.appendTo ? e.appendTo : this.currentItem[0].parentNode)[0].appendChild(t[0]),
            t[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }),
            t[0].style.width && !e.forceHelperSize || t.width(this.currentItem.width()),
            t[0].style.height && !e.forceHelperSize || t.height(this.currentItem.height()),
            t
        },
        _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")),
            "left"in (t = P.isArray(t) ? {
                left: +t[0],
                top: +t[1] || 0
            } : t) && (this.offset.click.left = t.left + this.margins.left),
            "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left),
            "top"in t && (this.offset.click.top = t.top + this.margins.top),
            "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== this.document[0] && P.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(),
            t.top += this.scrollParent.scrollTop()),
            {
                top: (t = this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && P.ui.ie ? {
                    top: 0,
                    left: 0
                } : t).top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function() {
            var t;
            return "relative" === this.cssPosition ? {
                top: (t = this.currentItem.position()).top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
            } : {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function() {
            var t, e, i = this.options;
            "parent" === i.containment && (i.containment = this.helper[0].parentNode),
            "document" !== i.containment && "window" !== i.containment || (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, "document" === i.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, ("document" === i.containment ? this.document.height() || document.body.parentNode.scrollHeight : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]),
            /^(document|window|parent)$/.test(i.containment) || (t = P(i.containment)[0],
            i = P(i.containment).offset(),
            e = "hidden" !== P(t).css("overflow"),
            this.containment = [i.left + (parseInt(P(t).css("borderLeftWidth"), 10) || 0) + (parseInt(P(t).css("paddingLeft"), 10) || 0) - this.margins.left, i.top + (parseInt(P(t).css("borderTopWidth"), 10) || 0) + (parseInt(P(t).css("paddingTop"), 10) || 0) - this.margins.top, i.left + (e ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(P(t).css("borderLeftWidth"), 10) || 0) - (parseInt(P(t).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, i.top + (e ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(P(t).css("borderTopWidth"), 10) || 0) - (parseInt(P(t).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
        },
        _convertPositionTo: function(t, e) {
            e = e || this.position;
            var t = "absolute" === t ? 1 : -1
              , i = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && P.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent
              , s = /(html|body)/i.test(i[0].tagName);
            return {
                top: e.top + this.offset.relative.top * t + this.offset.parent.top * t - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : i.scrollTop()) * t,
                left: e.left + this.offset.relative.left * t + this.offset.parent.left * t - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : i.scrollLeft()) * t
            }
        },
        _generatePosition: function(t) {
            var e = this.options
              , i = t.pageX
              , s = t.pageY
              , o = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && P.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent
              , n = /(html|body)/i.test(o[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()),
            this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (i = this.containment[0] + this.offset.click.left),
            t.pageY - this.offset.click.top < this.containment[1] && (s = this.containment[1] + this.offset.click.top),
            t.pageX - this.offset.click.left > this.containment[2] && (i = this.containment[2] + this.offset.click.left),
            t.pageY - this.offset.click.top > this.containment[3]) && (s = this.containment[3] + this.offset.click.top),
            e.grid) && (t = this.originalPageY + Math.round((s - this.originalPageY) / e.grid[1]) * e.grid[1],
            s = !this.containment || t - this.offset.click.top >= this.containment[1] && t - this.offset.click.top <= this.containment[3] ? t : t - this.offset.click.top >= this.containment[1] ? t - e.grid[1] : t + e.grid[1],
            t = this.originalPageX + Math.round((i - this.originalPageX) / e.grid[0]) * e.grid[0],
            i = !this.containment || t - this.offset.click.left >= this.containment[0] && t - this.offset.click.left <= this.containment[2] ? t : t - this.offset.click.left >= this.containment[0] ? t - e.grid[0] : t + e.grid[0]),
            {
                top: s - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : n ? 0 : o.scrollTop()),
                left: i - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : n ? 0 : o.scrollLeft())
            }
        },
        _rearrange: function(t, e, i, s) {
            i ? i[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? e.item[0] : e.item[0].nextSibling),
            this.counter = this.counter ? ++this.counter : 1;
            var o = this.counter;
            this._delay(function() {
                o === this.counter && this.refreshPositions(!s)
            })
        },
        _clear: function(t, e) {
            function i(e, i, s) {
                return function(t) {
                    s._trigger(e, t, i._uiHash(i))
                }
            }
            this.reverting = !1;
            var s, o = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem),
            this._noFinalSort = null,
            this.helper[0] === this.currentItem[0]) {
                for (s in this._storedCSS)
                    "auto" !== this._storedCSS[s] && "static" !== this._storedCSS[s] || (this._storedCSS[s] = "");
                this.currentItem.css(this._storedCSS),
                this._removeClass(this.currentItem, "ui-sortable-helper")
            } else
                this.currentItem.show();
            for (this.fromOutside && !e && o.push(function(t) {
                this._trigger("receive", t, this._uiHash(this.fromOutside))
            }),
            !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || e || o.push(function(t) {
                this._trigger("update", t, this._uiHash())
            }),
            this === this.currentContainer || e || (o.push(function(t) {
                this._trigger("remove", t, this._uiHash())
            }),
            o.push(function(e) {
                return function(t) {
                    e._trigger("receive", t, this._uiHash(this))
                }
            }
            .call(this, this.currentContainer)),
            o.push(function(e) {
                return function(t) {
                    e._trigger("update", t, this._uiHash(this))
                }
            }
            .call(this, this.currentContainer))),
            s = this.containers.length - 1; 0 <= s; s--)
                e || o.push(i("deactivate", this, this.containers[s])),
                this.containers[s].containerCache.over && (o.push(i("out", this, this.containers[s])),
                this.containers[s].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor),
            this.storedStylesheet.remove()),
            this._storedOpacity && this.helper.css("opacity", this._storedOpacity),
            this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex),
            this.dragging = !1,
            e || this._trigger("beforeStop", t, this._uiHash()),
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(),
            this.helper = null),
            !e) {
                for (s = 0; s < o.length; s++)
                    o[s].call(this, t);
                this._trigger("stop", t, this._uiHash())
            }
            return this.fromOutside = !1,
            !this.cancelHelperRemoval
        },
        _trigger: function() {
            !1 === P.Widget.prototype._trigger.apply(this, arguments) && this.cancel()
        },
        _uiHash: function(t) {
            var e = t || this;
            return {
                helper: e.helper,
                placeholder: e.placeholder || P([]),
                position: e.position,
                originalPosition: e.originalPosition,
                offset: e.positionAbs,
                item: e.currentItem,
                sender: t ? t.element : null
            }
        }
    }),
    P.widget("ui.menu", {
        version: "1.12.1",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: {
                submenu: "ui-icon-caret-1-e"
            },
            items: "> *",
            menus: "ul",
            position: {
                my: "left top",
                at: "right top"
            },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function() {
            this.activeMenu = this.element,
            this.mouseHandled = !1,
            this.element.uniqueId().attr({
                role: this.options.role,
                tabIndex: 0
            }),
            this._addClass("ui-menu", "ui-widget ui-widget-content"),
            this._on({
                "mousedown .ui-menu-item": function(t) {
                    t.preventDefault()
                },
                "click .ui-menu-item": function(t) {
                    var e = P(t.target)
                      , i = P(P.ui.safeActiveElement(this.document[0]));
                    !this.mouseHandled && e.not(".ui-state-disabled").length && (this.select(t),
                    t.isPropagationStopped() || (this.mouseHandled = !0),
                    e.has(".ui-menu").length ? this.expand(t) : !this.element.is(":focus") && i.closest(".ui-menu").length && (this.element.trigger("focus", [!0]),
                    this.active) && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer))
                },
                "mouseenter .ui-menu-item": function(t) {
                    var e, i;
                    this.previousFilter || (e = P(t.target).closest(".ui-menu-item"),
                    i = P(t.currentTarget),
                    e[0] === i[0] && (this._removeClass(i.siblings().children(".ui-state-active"), null, "ui-state-active"),
                    this.focus(t, i)))
                },
                mouseleave: "collapseAll",
                "mouseleave .ui-menu": "collapseAll",
                focus: function(t, e) {
                    var i = this.active || this.element.find(this.options.items).eq(0);
                    e || this.focus(t, i)
                },
                blur: function(t) {
                    this._delay(function() {
                        P.contains(this.element[0], P.ui.safeActiveElement(this.document[0])) || this.collapseAll(t)
                    })
                },
                keydown: "_keydown"
            }),
            this.refresh(),
            this._on(this.document, {
                click: function(t) {
                    this._closeOnDocumentClick(t) && this.collapseAll(t),
                    this.mouseHandled = !1
                }
            })
        },
        _destroy: function() {
            var t = this.element.find(".ui-menu-item").removeAttr("role aria-disabled").children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),
            t.children().each(function() {
                var t = P(this);
                t.data("ui-menu-submenu-caret") && t.remove()
            })
        },
        _keydown: function(t) {
            var e, i, s, o = !0;
            switch (t.keyCode) {
            case P.ui.keyCode.PAGE_UP:
                this.previousPage(t);
                break;
            case P.ui.keyCode.PAGE_DOWN:
                this.nextPage(t);
                break;
            case P.ui.keyCode.HOME:
                this._move("first", "first", t);
                break;
            case P.ui.keyCode.END:
                this._move("last", "last", t);
                break;
            case P.ui.keyCode.UP:
                this.previous(t);
                break;
            case P.ui.keyCode.DOWN:
                this.next(t);
                break;
            case P.ui.keyCode.LEFT:
                this.collapse(t);
                break;
            case P.ui.keyCode.RIGHT:
                this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                break;
            case P.ui.keyCode.ENTER:
            case P.ui.keyCode.SPACE:
                this._activate(t);
                break;
            case P.ui.keyCode.ESCAPE:
                this.collapse(t);
                break;
            default:
                e = this.previousFilter || "",
                s = o = !1,
                i = 96 <= t.keyCode && t.keyCode <= 105 ? "" + (t.keyCode - 96) : String.fromCharCode(t.keyCode),
                clearTimeout(this.filterTimer),
                i === e ? s = !0 : i = e + i,
                e = this._filterMenuItems(i),
                (e = s && -1 !== e.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : e).length || (i = String.fromCharCode(t.keyCode),
                e = this._filterMenuItems(i)),
                e.length ? (this.focus(t, e),
                this.previousFilter = i,
                this.filterTimer = this._delay(function() {
                    delete this.previousFilter
                }, 1e3)) : delete this.previousFilter
            }
            o && t.preventDefault()
        },
        _activate: function(t) {
            this.active && !this.active.is(".ui-state-disabled") && (this.active.children("[aria-haspopup='true']").length ? this.expand(t) : this.select(t))
        },
        refresh: function() {
            var t, e, s = this, o = this.options.icons.submenu, i = this.element.find(this.options.menus);
            this._toggleClass("ui-menu-icons", null, !!this.element.find(".ui-icon").length),
            t = i.filter(":not(.ui-menu)").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function() {
                var t = P(this)
                  , e = t.prev()
                  , i = P("<span>").data("ui-menu-submenu-caret", !0);
                s._addClass(i, "ui-menu-icon", "ui-icon " + o),
                e.attr("aria-haspopup", "true").prepend(i),
                t.attr("aria-labelledby", e.attr("id"))
            }),
            this._addClass(t, "ui-menu", "ui-widget ui-widget-content ui-front"),
            (t = i.add(this.element).find(this.options.items)).not(".ui-menu-item").each(function() {
                var t = P(this);
                s._isDivider(t) && s._addClass(t, "ui-menu-divider", "ui-widget-content")
            }),
            e = (i = t.not(".ui-menu-item, .ui-menu-divider")).children().not(".ui-menu").uniqueId().attr({
                tabIndex: -1,
                role: this._itemRole()
            }),
            this._addClass(i, "ui-menu-item")._addClass(e, "ui-menu-item-wrapper"),
            t.filter(".ui-state-disabled").attr("aria-disabled", "true"),
            this.active && !P.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function() {
            return {
                menu: "menuitem",
                listbox: "option"
            }[this.options.role]
        },
        _setOption: function(t, e) {
            var i;
            "icons" === t && (i = this.element.find(".ui-menu-icon"),
            this._removeClass(i, null, this.options.icons.submenu)._addClass(i, null, e.submenu)),
            this._super(t, e)
        },
        _setOptionDisabled: function(t) {
            this._super(t),
            this.element.attr("aria-disabled", t + ""),
            this._toggleClass(null, "ui-state-disabled", !!t)
        },
        focus: function(t, e) {
            var i;
            this.blur(t, t && "focus" === t.type),
            this._scrollIntoView(e),
            this.active = e.first(),
            i = this.active.children(".ui-menu-item-wrapper"),
            this._addClass(i, null, "ui-state-active"),
            this.options.role && this.element.attr("aria-activedescendant", i.attr("id")),
            i = this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"),
            this._addClass(i, null, "ui-state-active"),
            t && "keydown" === t.type ? this._close() : this.timer = this._delay(function() {
                this._close()
            }, this.delay),
            (i = e.children(".ui-menu")).length && t && /^mouse/.test(t.type) && this._startOpening(i),
            this.activeMenu = e.parent(),
            this._trigger("focus", t, {
                item: e
            })
        },
        _scrollIntoView: function(t) {
            var e, i, s;
            this._hasScroll() && (e = parseFloat(P.css(this.activeMenu[0], "borderTopWidth")) || 0,
            i = parseFloat(P.css(this.activeMenu[0], "paddingTop")) || 0,
            e = t.offset().top - this.activeMenu.offset().top - e - i,
            i = this.activeMenu.scrollTop(),
            s = this.activeMenu.height(),
            t = t.outerHeight(),
            e < 0 ? this.activeMenu.scrollTop(i + e) : s < e + t && this.activeMenu.scrollTop(i + e - s + t))
        },
        blur: function(t, e) {
            e || clearTimeout(this.timer),
            this.active && (this._removeClass(this.active.children(".ui-menu-item-wrapper"), null, "ui-state-active"),
            this._trigger("blur", t, {
                item: this.active
            }),
            this.active = null)
        },
        _startOpening: function(t) {
            clearTimeout(this.timer),
            "true" === t.attr("aria-hidden") && (this.timer = this._delay(function() {
                this._close(),
                this._open(t)
            }, this.delay))
        },
        _open: function(t) {
            var e = P.extend({
                of: this.active
            }, this.options.position);
            clearTimeout(this.timer),
            this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true"),
            t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(e)
        },
        collapseAll: function(e, i) {
            clearTimeout(this.timer),
            this.timer = this._delay(function() {
                var t = i ? this.element : P(e && e.target).closest(this.element.find(".ui-menu"));
                t.length || (t = this.element),
                this._close(t),
                this.blur(e),
                this._removeClass(t.find(".ui-state-active"), null, "ui-state-active"),
                this.activeMenu = t
            }, this.delay)
        },
        _close: function(t) {
            (t = t || (this.active ? this.active.parent() : this.element)).find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false")
        },
        _closeOnDocumentClick: function(t) {
            return !P(t.target).closest(".ui-menu").length
        },
        _isDivider: function(t) {
            return !/[^\-\u2014\u2013\s]/.test(t.text())
        },
        collapse: function(t) {
            var e = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            e && e.length && (this._close(),
            this.focus(t, e))
        },
        expand: function(t) {
            var e = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
            e && e.length && (this._open(e.parent()),
            this._delay(function() {
                this.focus(t, e)
            }))
        },
        next: function(t) {
            this._move("next", "first", t)
        },
        previous: function(t) {
            this._move("prev", "last", t)
        },
        isFirstItem: function() {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function() {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function(t, e, i) {
            var s;
            (s = this.active ? "first" === t || "last" === t ? this.active["first" === t ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[t + "All"](".ui-menu-item").eq(0) : s) && s.length && this.active || (s = this.activeMenu.find(this.options.items)[e]()),
            this.focus(i, s)
        },
        nextPage: function(t) {
            var e, i, s;
            return this.active ? void (this.isLastItem() || (this._hasScroll() ? (i = this.active.offset().top,
            s = this.element.height(),
            this.active.nextAll(".ui-menu-item").each(function() {
                return (e = P(this)).offset().top - i - s < 0
            }),
            this.focus(t, e)) : this.focus(t, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]()))) : void this.next(t)
        },
        previousPage: function(t) {
            var e, i, s;
            return this.active ? void (this.isFirstItem() || (this._hasScroll() ? (i = this.active.offset().top,
            s = this.element.height(),
            this.active.prevAll(".ui-menu-item").each(function() {
                return 0 < (e = P(this)).offset().top - i + s
            }),
            this.focus(t, e)) : this.focus(t, this.activeMenu.find(this.options.items).first()))) : void this.next(t)
        },
        _hasScroll: function() {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function(t) {
            this.active = this.active || P(t.target).closest(".ui-menu-item");
            var e = {
                item: this.active
            };
            this.active.has(".ui-menu").length || this.collapseAll(t, !0),
            this._trigger("select", t, e)
        },
        _filterMenuItems: function(t) {
            var t = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
              , e = RegExp("^" + t, "i");
            return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function() {
                return e.test(P.trim(P(this).children(".ui-menu-item-wrapper").text()))
            })
        }
    }),
    P.widget("ui.autocomplete", {
        version: "1.12.1",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        requestIndex: 0,
        pending: 0,
        _create: function() {
            var i, s, o, t = this.element[0].nodeName.toLowerCase(), e = "textarea" === t, t = "input" === t;
            this.isMultiLine = e || !t && this._isContentEditable(this.element),
            this.valueMethod = this.element[e || t ? "val" : "text"],
            this.isNewMenu = !0,
            this._addClass("ui-autocomplete-input"),
            this.element.attr("autocomplete", "off"),
            this._on(this.element, {
                keydown: function(t) {
                    if (this.element.prop("readOnly"))
                        s = o = i = !0;
                    else {
                        s = o = i = !1;
                        var e = P.ui.keyCode;
                        switch (t.keyCode) {
                        case e.PAGE_UP:
                            i = !0,
                            this._move("previousPage", t);
                            break;
                        case e.PAGE_DOWN:
                            i = !0,
                            this._move("nextPage", t);
                            break;
                        case e.UP:
                            i = !0,
                            this._keyEvent("previous", t);
                            break;
                        case e.DOWN:
                            i = !0,
                            this._keyEvent("next", t);
                            break;
                        case e.ENTER:
                            this.menu.active && (i = !0,
                            t.preventDefault(),
                            this.menu.select(t));
                            break;
                        case e.TAB:
                            this.menu.active && this.menu.select(t);
                            break;
                        case e.ESCAPE:
                            this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term),
                            this.close(t),
                            t.preventDefault());
                            break;
                        default:
                            s = !0,
                            this._searchTimeout(t)
                        }
                    }
                },
                keypress: function(t) {
                    if (i)
                        i = !1,
                        this.isMultiLine && !this.menu.element.is(":visible") || t.preventDefault();
                    else if (!s) {
                        var e = P.ui.keyCode;
                        switch (t.keyCode) {
                        case e.PAGE_UP:
                            this._move("previousPage", t);
                            break;
                        case e.PAGE_DOWN:
                            this._move("nextPage", t);
                            break;
                        case e.UP:
                            this._keyEvent("previous", t);
                            break;
                        case e.DOWN:
                            this._keyEvent("next", t)
                        }
                    }
                },
                input: function(t) {
                    return o ? (o = !1,
                    void t.preventDefault()) : void this._searchTimeout(t)
                },
                focus: function() {
                    this.selectedItem = null,
                    this.previous = this._value()
                },
                blur: function(t) {
                    return this.cancelBlur ? void delete this.cancelBlur : (clearTimeout(this.searching),
                    this.close(t),
                    void this._change(t))
                }
            }),
            this._initSource(),
            this.menu = P("<ul>").appendTo(this._appendTo()).menu({
                role: null
            }).hide().menu("instance"),
            this._addClass(this.menu.element, "ui-autocomplete", "ui-front"),
            this._on(this.menu.element, {
                mousedown: function(t) {
                    t.preventDefault(),
                    this.cancelBlur = !0,
                    this._delay(function() {
                        delete this.cancelBlur,
                        this.element[0] !== P.ui.safeActiveElement(this.document[0]) && this.element.trigger("focus")
                    })
                },
                menufocus: function(t, e) {
                    var i;
                    return this.isNewMenu && (this.isNewMenu = !1,
                    t.originalEvent) && /^mouse/.test(t.originalEvent.type) ? (this.menu.blur(),
                    void this.document.one("mousemove", function() {
                        P(t.target).trigger(t.originalEvent)
                    })) : (i = e.item.data("ui-autocomplete-item"),
                    !1 !== this._trigger("focus", t, {
                        item: i
                    }) && t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(i.value),
                    void ((e = e.item.attr("aria-label") || i.value) && P.trim(e).length && (this.liveRegion.children().hide(),
                    P("<div>").text(e).appendTo(this.liveRegion))))
                },
                menuselect: function(t, e) {
                    var i = e.item.data("ui-autocomplete-item")
                      , s = this.previous;
                    this.element[0] !== P.ui.safeActiveElement(this.document[0]) && (this.element.trigger("focus"),
                    this.previous = s,
                    this._delay(function() {
                        this.previous = s,
                        this.selectedItem = i
                    })),
                    !1 !== this._trigger("select", t, {
                        item: i
                    }) && this._value(i.value),
                    this.term = this._value(),
                    this.close(t),
                    this.selectedItem = i
                }
            }),
            this.liveRegion = P("<div>", {
                role: "status",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).appendTo(this.document[0].body),
            this._addClass(this.liveRegion, null, "ui-helper-hidden-accessible"),
            this._on(this.window, {
                beforeunload: function() {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function() {
            clearTimeout(this.searching),
            this.element.removeAttr("autocomplete"),
            this.menu.element.remove(),
            this.liveRegion.remove()
        },
        _setOption: function(t, e) {
            this._super(t, e),
            "source" === t && this._initSource(),
            "appendTo" === t && this.menu.element.appendTo(this._appendTo()),
            "disabled" === t && e && this.xhr && this.xhr.abort()
        },
        _isEventTargetInWidget: function(t) {
            var e = this.menu.element[0];
            return t.target === this.element[0] || t.target === e || P.contains(e, t.target)
        },
        _closeOnClickOutside: function(t) {
            this._isEventTargetInWidget(t) || this.close()
        },
        _appendTo: function() {
            var t = this.options.appendTo;
            return t = (t = (t = t && (t.jquery || t.nodeType ? P(t) : this.document.find(t).eq(0))) && t[0] ? t : this.element.closest(".ui-front, dialog")).length ? t : this.document[0].body
        },
        _initSource: function() {
            var i, s, o = this;
            P.isArray(this.options.source) ? (i = this.options.source,
            this.source = function(t, e) {
                e(P.ui.autocomplete.filter(i, t.term))
            }
            ) : "string" == typeof this.options.source ? (s = this.options.source,
            this.source = function(t, e) {
                o.xhr && o.xhr.abort(),
                o.xhr = P.ajax({
                    url: s,
                    data: t,
                    dataType: "json",
                    success: function(t) {
                        e(t)
                    },
                    error: function() {
                        e([])
                    }
                })
            }
            ) : this.source = this.options.source
        },
        _searchTimeout: function(s) {
            clearTimeout(this.searching),
            this.searching = this._delay(function() {
                var t = this.term === this._value()
                  , e = this.menu.element.is(":visible")
                  , i = s.altKey || s.ctrlKey || s.metaKey || s.shiftKey;
                t && (e || i) || (this.selectedItem = null,
                this.search(null, s))
            }, this.options.delay)
        },
        search: function(t, e) {
            return t = null != t ? t : this._value(),
            this.term = this._value(),
            t.length < this.options.minLength ? this.close(e) : !1 !== this._trigger("search", e) ? this._search(t) : void 0
        },
        _search: function(t) {
            this.pending++,
            this._addClass("ui-autocomplete-loading"),
            this.cancelSearch = !1,
            this.source({
                term: t
            }, this._response())
        },
        _response: function() {
            var e = ++this.requestIndex;
            return P.proxy(function(t) {
                e === this.requestIndex && this.__response(t),
                this.pending--,
                this.pending || this._removeClass("ui-autocomplete-loading")
            }, this)
        },
        __response: function(t) {
            t = t && this._normalize(t),
            this._trigger("response", null, {
                content: t
            }),
            !this.options.disabled && t && t.length && !this.cancelSearch ? (this._suggest(t),
            this._trigger("open")) : this._close()
        },
        close: function(t) {
            this.cancelSearch = !0,
            this._close(t)
        },
        _close: function(t) {
            this._off(this.document, "mousedown"),
            this.menu.element.is(":visible") && (this.menu.element.hide(),
            this.menu.blur(),
            this.isNewMenu = !0,
            this._trigger("close", t))
        },
        _change: function(t) {
            this.previous !== this._value() && this._trigger("change", t, {
                item: this.selectedItem
            })
        },
        _normalize: function(t) {
            return t.length && t[0].label && t[0].value ? t : P.map(t, function(t) {
                return "string" == typeof t ? {
                    label: t,
                    value: t
                } : P.extend({}, t, {
                    label: t.label || t.value,
                    value: t.value || t.label
                })
            })
        },
        _suggest: function(t) {
            var e = this.menu.element.empty();
            this._renderMenu(e, t),
            this.isNewMenu = !0,
            this.menu.refresh(),
            e.show(),
            this._resizeMenu(),
            e.position(P.extend({
                of: this.element
            }, this.options.position)),
            this.options.autoFocus && this.menu.next(),
            this._on(this.document, {
                mousedown: "_closeOnClickOutside"
            })
        },
        _resizeMenu: function() {
            var t = this.menu.element;
            t.outerWidth(Math.max(t.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function(i, t) {
            var s = this;
            P.each(t, function(t, e) {
                s._renderItemData(i, e)
            })
        },
        _renderItemData: function(t, e) {
            return this._renderItem(t, e).data("ui-autocomplete-item", e)
        },
        _renderItem: function(t, e) {
            return P("<li>").append(P("<div>").text(e.label)).appendTo(t)
        },
        _move: function(t, e) {
            return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(t) || this.menu.isLastItem() && /^next/.test(t) ? (this.isMultiLine || this._value(this.term),
            void this.menu.blur()) : void this.menu[t](e) : void this.search(null, e)
        },
        widget: function() {
            return this.menu.element
        },
        _value: function() {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function(t, e) {
            this.isMultiLine && !this.menu.element.is(":visible") || (this._move(t, e),
            e.preventDefault())
        },
        _isContentEditable: function(t) {
            var e;
            return !!t.length && ("inherit" === (e = t.prop("contentEditable")) ? this._isContentEditable(t.parent()) : "true" === e)
        }
    }),
    P.extend(P.ui.autocomplete, {
        escapeRegex: function(t) {
            return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function(t, e) {
            var i = RegExp(P.ui.autocomplete.escapeRegex(e), "i");
            return P.grep(t, function(t) {
                return i.test(t.label || t.value || t)
            })
        }
    }),
    P.widget("ui.autocomplete", P.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function(t) {
                    return t + (1 < t ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function(t) {
            this._superApply(arguments),
            this.options.disabled || this.cancelSearch || (t = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults,
            this.liveRegion.children().hide(),
            P("<div>").text(t).appendTo(this.liveRegion))
        }
    }),
    P.ui.autocomplete
});

;jQuery.uaMatch = function(e) {
    e = e.toLowerCase();
    e = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
    return {
        browser: e[1] || "",
        version: e[2] || "0"
    }
}
,
jQuery.browser || (matched = jQuery.uaMatch(navigator.userAgent),
browser = {},
matched.browser && (browser[matched.browser] = !0,
browser.version = matched.version),
browser.chrome ? browser.webkit = !0 : browser.webkit && (browser.safari = !0),
jQuery.browser = browser);

;(n => {
    var r, l, d, h = {}, o = n.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent), p = !1;
    function c(t) {
        return n.data(t, "tooltip")
    }
    function i() {
        this.title && (this.tooltipText = this.title,
        n(this).removeAttr("title"),
        r === this) && a.call(this, {}, !0)
    }
    function s() {
        r === this && a.call(this, {}, !0)
    }
    function a(t, e) {
        var i = "object" == typeof t.originalEvent;
        if ((!i || !t.originalEvent.triggered_ds_tooltip) && !n.tooltip.blocked && (this !== r || e) && (this.tooltipText || c(this).bodyHandler)) {
            if (l = (r = this).tooltipText,
            c(this).bodyHandler) {
                h.title.hide();
                e = c(this).bodyHandler.call(this);
                e.nodeType || e.jquery ? h.body.empty().append(e) : h.body.html(e),
                h.body.show()
            } else if (c(this).showBody) {
                var o = l.split(c(this).showBody);
                h.title.html(o.shift()).show(),
                h.body.empty();
                for (var s, a = 0; s = o[a]; a++)
                    0 < a && h.body.append("<br/>"),
                    h.body.append(s);
                h.body.hideWhenEmpty()
            } else
                h.title.html(l).show(),
                h.body.hide();
            c(this).showURL && n(this).url() ? h.url.html(n(this).url().replace("http://", "")).show() : h.url.hide(),
            c(this).fixPNG && h.parent.fixPNG(),
            !function(t) {
                c(this).delay ? d = setTimeout(f, c(this).delay) : f(),
                p = !!c(this).track,
                n(document.body).bind("mousemove", u),
                u(t)
            }
            .apply(this, arguments),
            i && (t.originalEvent.triggered_ds_tooltip = !0)
        }
    }
    function f() {
        d = null,
        o && n.fn.bgiframe || !c(r).fade ? h.parent.show() : h.parent.is(":animated") ? h.parent.stop().show().fadeTo(c(r).fade, r.tOpacity) : h.parent.is(":visible") ? h.parent.fadeTo(c(r).fade, r.tOpacity) : h.parent.fadeIn(c(r).fade),
        h.parent.addClass(c(r).extraClass),
        u()
    }
    function u(t) {
        var e, i, o;
        n.tooltip.blocked || t && t.target && "OPTION" == t.target.tagName || (!p && h.parent.is(":visible") && n(document.body).unbind("mousemove", u),
        null == r ? n(document.body).unbind("mousemove", u) : n.contains(document.documentElement, r) ? (h.parent.removeClass("viewport-right").removeClass("viewport-bottom"),
        e = h.parent[0].offsetLeft,
        i = h.parent[0].offsetTop,
        t && (e = t.pageX + c(r).left,
        i = t.pageY + c(r).top,
        t = "auto",
        c(r).positionLeft && (t = n(window).width() - e,
        e = "auto"),
        h.parent.css({
            left: e,
            right: t,
            top: i
        })),
        t = {
            x: n(window).scrollLeft(),
            y: n(window).scrollTop(),
            cx: n(window).width(),
            cy: n(window).height()
        },
        o = h.parent[0],
        t.x + t.cx < o.offsetLeft + o.offsetWidth && (e -= o.offsetWidth + 20 + c(r).left,
        h.parent.css({
            left: e + "px"
        }).addClass("viewport-right")),
        t.y + t.cy < o.offsetTop + o.offsetHeight && (i -= o.offsetHeight + 20 + c(r).top,
        h.parent.css({
            top: i + "px"
        }).addClass("viewport-bottom"))) : (n(document.body).unbind("mousemove", u),
        h.parent.hide().css("opacity", "")))
    }
    function m(t) {
        var e;
        function i() {
            h.parent.removeClass(e.extraClass).hide().css("opacity", "")
        }
        n.tooltip.blocked || (d && clearTimeout(d),
        (r = null) != (e = c(this)) && (o && n.fn.bgiframe || !e.fade ? i() : h.parent.is(":animated") ? h.parent.stop().fadeTo(e.fade, 0, i) : h.parent.stop().fadeOut(e.fade, i),
        c(this).fixPNG) && h.parent.unfixPNG())
    }
    n.tooltip = {
        blocked: !1,
        defaults: {
            delay: 200,
            fade: !1,
            showURL: !0,
            extraClass: "",
            top: 15,
            left: 15,
            id: "tooltip"
        },
        block: function() {
            n.tooltip.blocked = !n.tooltip.blocked
        }
    },
    n.fn.extend({
        tooltip: function(t) {
            var e;
            return t = n.extend({}, n.tooltip.defaults, t),
            e = t,
            h.parent || (h.parent = n('<div id="' + e.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide(),
            n.fn.bgiframe && h.parent.bgiframe(),
            h.title = n("h3", h.parent),
            h.body = n("div.body", h.parent),
            h.url = n("div.url", h.parent)),
            this.each(function() {
                n.data(this, "tooltip", t),
                this.tOpacity = h.parent.css("opacity"),
                "" != n(this).attr("data-title") && null != n(this).attr("data-title") ? this.tooltipText = n(this).attr("data-title") : (this.tooltipText = this.title,
                n(this).attr("data-title", this.title))
            }).mouseover(a).mouseout(m).on("tooltip_content_change", s).on("tooltip_change", i).click(m).removeClass("tooltip").removeAttr("alt").removeAttr("title")
        },
        removeTooltip: function() {
            this.each(function() {
                this.tooltipText = "",
                r === this && (a.call(this, {}, !0),
                m.call(this))
            })
        },
        fixPNG: o ? function() {
            return this.each(function() {
                var t = n(this).css("backgroundImage");
                t.match(/^url\(["']?(.*\.png)["']?\)$/i) && (t = RegExp.$1,
                n(this).css({
                    backgroundImage: "none",
                    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + t + "')"
                }).each(function() {
                    var t = n(this).css("position");
                    "absolute" != t && "relative" != t && n(this).css("position", "relative")
                }))
            })
        }
        : function() {
            return this
        }
        ,
        unfixPNG: o ? function() {
            return this.each(function() {
                n(this).css({
                    filter: "",
                    backgroundImage: ""
                })
            })
        }
        : function() {
            return this
        }
        ,
        hideWhenEmpty: function() {
            return this.each(function() {
                n(this)[n(this).html() ? "show" : "hide"]()
            })
        },
        url: function() {
            return this.attr("href") || this.attr("src")
        }
    })
}
)(jQuery);

;(o => {
    var i = "QuickEdit"
      , n = {};
    function e(t, e) {
        this.element = t,
        this.settings = o.extend({
            url: "",
            show_icons: !0,
            label_element: !1,
            save_success_callback: null
        }, n, e),
        this._defaults = n,
        this._name = i,
        this.init()
    }
    e.prototype = {
        init: function() {
            o(this.element).find(".rename-icon").on("click", o.proxy(this.beginEdit, this))
        },
        beginEdit: function() {
            var t = (i = o(this.element)).find(".quickedit-label")
              , e = Math.max(80, t.width())
              , i = (t = t.data("text") ? t.data("text") : o.trim(i.find(".quickedit-label").text()),
            i.find(".quickedit-content").hide(),
            o('<span class="quickedit-edit"></span>'))
              , t = o('<input type="text" />').val(t).css("width", e + "px").appendTo(i).on("keydown", o.proxy(function(t) {
                if (13 == t.keyCode)
                    return this.beginSave(),
                    !1
            }, this))
              , e = parseInt(o(this.element).data("length"));
            void 0 !== e && !isNaN(e) && 3 < e && t.prop("size", e).prop("maxlength", e),
            o('<input type="button" class="btn" />').val(_("904a8304056d77e4547744781b7ceb50")).appendTo(i).on("click", o.proxy(this.beginSave, this));
            return i.appendTo(o(this.element)),
            t.select(),
            !1
        },
        beginSave: function() {
            var e = o(this.element)
              , t = e.find("input[type=text]").prop("disabled", !0).val()
              , i = (e.find(".btn").remove(),
            e.find(".quickedit-edit").append(UI.Image("loading2.gif", {
                style: "vertical-align: middle"
            })),
            this.settings.url.replace("__ID__", e.data("id")))
              , s = this;
            TribalWars.post(i, {}, {
                text: t
            }, function(n) {
                var a, t = s.settings.label_element ? o(s.settings.label_element) : e.find(".quickedit-label");
                t.text(n.text),
                n.raw && t.data("text", n.raw),
                n.icon && s.settings.show_icons && ((t = e.find(".quickedit-content")).find("img, .commandicon-ally").remove(),
                (a = e.find(".icon-container")).length ? a.empty() : a = t,
                o.each(n.icon, function(t, e) {
                    var i;
                    n.command ? a.prepend(UI.CommandIcon(e, n.command)) : (i = e.tooltip ? {
                        class: "tooltip",
                        title: e.tooltip
                    } : {},
                    a.prepend(UI.Image(e.img, i))),
                    a.prepend(" ")
                }),
                UI.ToolTip(t.find(".tooltip"))),
                s.revert(),
                "function" == typeof s.settings.save_success_callback && s.settings.save_success_callback(n)
            }, function() {
                s.revert()
            })
        },
        revert: function() {
            var t = o(this.element);
            t.find(".quickedit-edit").remove(),
            t.find(".quickedit-content").show()
        }
    },
    o.fn[i] = function(t) {
        return this.each(function() {
            o.data(this, "plugin_" + i) || o.data(this, "plugin_" + i, new e(this,t))
        }),
        this
    }
}
)(jQuery, (window,
document));

;(e => {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery)
}
)(function(s) {
    var n = /\+/g;
    function f(e) {
        return x.raw ? e : encodeURIComponent(e)
    }
    function m(e, o) {
        e = x.raw ? e : (e => {
            0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
            try {
                return e = decodeURIComponent(e.replace(n, " ")),
                x.json ? JSON.parse(e) : e
            } catch (e) {}
        }
        )(e);
        return s.isFunction(o) ? o(e) : e
    }
    var x = s.cookie = function(e, o, n) {
        var i, r;
        if (void 0 !== o && !s.isFunction(o))
            return "number" == typeof (n = s.extend({}, x.defaults, n)).expires && (i = n.expires,
            (r = n.expires = new Date).setTime(+r + 864e5 * i)),
            document.cookie = [f(e), "=", (r = o,
            f(x.json ? JSON.stringify(r) : String(r))), n.expires ? "; expires=" + n.expires.toUTCString() : "", n.path ? "; path=" + n.path : "", n.domain ? "; domain=" + n.domain : "", n.secure ? "; secure" : ""].join("");
        for (var t = e ? void 0 : {}, c = document.cookie ? document.cookie.split("; ") : [], u = 0, a = c.length; u < a; u++) {
            var d = c[u].split("=")
              , p = (p = d.shift(),
            x.raw ? p : decodeURIComponent(p))
              , d = d.join("=");
            if (e && e === p) {
                t = m(d, o);
                break
            }
            e || void 0 === (d = m(d)) || (t[p] = d)
        }
        return t
    }
    ;
    x.defaults = {},
    s.removeCookie = function(e, o) {
        return void 0 !== s.cookie(e) && (s.cookie(e, "", s.extend({}, o, {
            expires: -1
        })),
        !s.cookie(e))
    }
});

;(l => {
    function t(t) {
        var o, p;
        "string" == typeof t.data && (t.data = {
            keys: t.data
        }),
        t.data && t.data.keys && "string" == typeof t.data.keys && (o = t.handler,
        p = t.data.keys.toLowerCase().split(" "),
        t.handler = function(a) {
            if (this === a.target || !(l.hotkeys.options.filterInputAcceptingElements && l.hotkeys.textInputTypes.test(a.target.nodeName) || l.hotkeys.options.filterContentEditable && l(a.target).attr("contenteditable") || l.hotkeys.options.filterTextInputs && -1 < l.inArray(a.target.type, l.hotkeys.textAcceptingInputTypes))) {
                var s = "keypress" !== a.type && l.hotkeys.specialKeys[a.which]
                  , t = String.fromCharCode(a.which).toLowerCase()
                  , n = ""
                  , e = {};
                l.each(["alt", "ctrl", "shift"], function(t, e) {
                    a[e + "Key"] && s !== e && (n += e + "+")
                }),
                a.metaKey && !a.ctrlKey && "meta" !== s && (n += "meta+"),
                a.metaKey && "meta" !== s && -1 < n.indexOf("alt+ctrl+shift+") && (n = n.replace("alt+ctrl+shift+", "hyper+")),
                s ? e[n + s] = !0 : (e[n + t] = !0,
                e[n + l.hotkeys.shiftNums[t]] = !0,
                "shift+" === n && (e[l.hotkeys.shiftNums[t]] = !0));
                for (var i = 0, r = p.length; i < r; i++)
                    if (e[p[i]])
                        return o.apply(this, arguments)
            }
        }
        )
    }
    l.hotkeys = {
        version: "0.2.0",
        specialKeys: {
            8: "backspace",
            9: "tab",
            10: "return",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            59: ";",
            61: "=",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            173: "-",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        },
        shiftNums: {
            "`": "~",
            1: "!",
            2: "@",
            3: "#",
            4: "$",
            5: "%",
            6: "^",
            7: "&",
            8: "*",
            9: "(",
            0: ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        },
        textAcceptingInputTypes: ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"],
        textInputTypes: /textarea|input|select/i,
        options: {
            filterInputAcceptingElements: !0,
            filterTextInputs: !0,
            filterContentEditable: !0
        }
    },
    l.each(["keydown", "keyup", "keypress"], function() {
        l.event.special[this] = {
            add: t
        }
    })
}
)(jQuery || this.jQuery || window.jQuery);

;var JToggler = {
    init: function(e) {
        JToggler.elements = $(e + ":not(.selectAll):not(.ignore_jtoggler)"),
        JToggler.elements.unbind("mousedown", JToggler.down).bind("mousedown", JToggler.down),
        JToggler.elements.unbind("click", JToggler.click).bind("click", JToggler.click),
        $("body").unbind("mouseup", JToggler.up).bind("mouseup", JToggler.up)
    },
    click: function(e) {
        if (JToggler.first && (JToggler.first.checked = JToggler.checked),
        e.shiftKey && JToggler.first) {
            var g, o = JToggler.elements.index(JToggler.first), r = JToggler.elements.index(e.target);
            for (r < o ? (g = r,
            r = o) : g = o; g < r; g++)
                JToggler.elements[g].checked = JToggler.checked
        }
    },
    down: function(e) {
        e.shiftKey || JToggler.started || (JToggler.started = !0,
        JToggler.first = e.target,
        JToggler.checked = e.target.checked = !e.target.checked,
        JToggler.elements.mouseover(JToggler.over))
    },
    over: function(e) {
        e.target.checked != JToggler.checked && (e.target.checked = JToggler.checked)
    },
    up: function(e) {
        JToggler.started && (JToggler.started = !1,
        JToggler.elements.unbind("mouseover", JToggler.over))
    }
};

;( (t, e) => {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).io = e()
}
)(this, function() {
    function a(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = Array(e); n < e; n++)
            r[n] = t[n];
        return r
    }
    function U(t, e) {
        for (var n = 0; n < e.length; n++) {
            var r = e[n];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, (t => "symbol" == typeof (t = (t => {
                if ("object" != typeof t || !t)
                    return t;
                var e = t[Symbol.toPrimitive];
                if (void 0 === e)
                    return String(t);
                if ("object" != typeof (e = e.call(t, "string")))
                    return e;
                throw new TypeError("@@toPrimitive must return a primitive value.")
            }
            )(t)) ? t : t + "")(r.key), r)
        }
    }
    function t(t, e, n) {
        return e && U(t.prototype, e),
        n && U(t, n),
        Object.defineProperty(t, "prototype", {
            writable: !1
        }),
        t
    }
    function F(t, e) {
        var n, r, i, o, s = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
        if (s)
            return i = !(r = !0),
            {
                s: function() {
                    s = s.call(t)
                },
                n: function() {
                    var t = s.next();
                    return r = t.done,
                    t
                },
                e: function(t) {
                    i = !0,
                    n = t
                },
                f: function() {
                    try {
                        r || null == s.return || s.return()
                    } finally {
                        if (i)
                            throw n
                    }
                }
            };
        if (Array.isArray(t) || (s = (t => {
            var e;
            if (t)
                return "string" == typeof t ? a(t, void 0) : "Map" === (e = "Object" === (e = {}.toString.call(t).slice(8, -1)) && t.constructor ? t.constructor.name : e) || "Set" === e ? Array.from(t) : "Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? a(t, void 0) : void 0
        }
        )(t)) || e && t && "number" == typeof t.length)
            return s && (t = s),
            o = 0,
            {
                s: e = function() {}
                ,
                n: function() {
                    return o >= t.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: t[o++]
                    }
                },
                e: function(t) {
                    throw t
                },
                f: e
            };
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
    }
    function c() {
        return (c = Object.assign ? Object.assign.bind() : function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var n, r = arguments[e];
                for (n in r)
                    !{}.hasOwnProperty.call(r, n) || (t[n] = r[n])
            }
            return t
        }
        ).apply(null, arguments)
    }
    function I(t) {
        return (I = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t)
        }
        )(t)
    }
    function e(t, e) {
        t.prototype = Object.create(e.prototype),
        i(t.prototype.constructor = t, e)
    }
    function L() {
        try {
            var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
        } catch (t) {}
        return (L = function() {
            return !!t
        }
        )()
    }
    function i(t, e) {
        return (i = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
            return t.__proto__ = e,
            t
        }
        )(t, e)
    }
    function h(t) {
        return (h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    function D(t) {
        var n = "function" == typeof Map ? new Map : void 0;
        return function(t) {
            if (null === t || !(e => {
                try {
                    return -1 !== Function.toString.call(e).indexOf("[native code]")
                } catch (t) {
                    return "function" == typeof e
                }
            }
            )(t))
                return t;
            if ("function" != typeof t)
                throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== n) {
                if (n.has(t))
                    return n.get(t);
                n.set(t, e)
            }
            function e() {
                return function(t, e, n) {
                    var r;
                    return L() ? Reflect.construct.apply(null, arguments) : ((r = [null]).push.apply(r, e),
                    e = new (t.bind.apply(t, r)),
                    n && i(e, n.prototype),
                    e)
                }(t, arguments, I(this).constructor)
            }
            return e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }),
            i(e, t)
        }(t)
    }
    var o = Object.create(null)
      , r = (o.open = "0",
    o.close = "1",
    o.ping = "2",
    o.pong = "3",
    o.message = "4",
    o.upgrade = "5",
    o.noop = "6",
    Object.create(null));
    Object.keys(o).forEach(function(t) {
        r[o[t]] = t
    });
    function M(t) {
        return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t && t.buffer instanceof ArrayBuffer
    }
    function s(t, e, n) {
        var r = t.type
          , t = t.data;
        K && t instanceof Blob ? e ? n(t) : V(t, n) : Y && (t instanceof ArrayBuffer || M(t)) ? e ? n(t) : V(new Blob([t]), n) : n(o[r] + (t || ""))
    }
    function V(t, e) {
        var n = new FileReader;
        return n.onload = function() {
            var t = n.result.split(",")[1];
            e("b" + (t || ""))
        }
        ,
        n.readAsDataURL(t)
    }
    var n, H = {
        type: "error",
        data: "parser error"
    }, K = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Object.prototype.toString.call(Blob), Y = "function" == typeof ArrayBuffer;
    function W(t) {
        return t instanceof Uint8Array ? t : t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer,t.byteOffset,t.byteLength)
    }
    for (var u = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256), f = 0; f < 64; f++)
        u["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(f)] = f;
    function $(t, e) {
        var n;
        return "string" != typeof t ? {
            type: "message",
            data: X(t, e)
        } : "b" === (n = t.charAt(0)) ? {
            type: "message",
            data: ( (t, e) => {
                var n;
                return z ? (n = (t => {
                    for (var e, n, r, i, o = .75 * t.length, s = t.length, a = 0, o = ("=" === t[t.length - 1] && (o--,
                    "=" === t[t.length - 2]) && o--,
                    new ArrayBuffer(o)), c = new Uint8Array(o), h = 0; h < s; h += 4)
                        e = u[t.charCodeAt(h)],
                        n = u[t.charCodeAt(h + 1)],
                        r = u[t.charCodeAt(h + 2)],
                        i = u[t.charCodeAt(h + 3)],
                        c[a++] = e << 2 | n >> 4,
                        c[a++] = (15 & n) << 4 | r >> 2,
                        c[a++] = (3 & r) << 6 | 63 & i;
                    return o
                }
                )(t),
                X(n, e)) : {
                    base64: !0,
                    data: t
                }
            }
            )(t.substring(1), e)
        } : r[n] ? 1 < t.length ? {
            type: r[n],
            data: t.substring(1)
        } : {
            type: r[n]
        } : H
    }
    var J, z = "function" == typeof ArrayBuffer, X = function(t, e) {
        return "blob" === e ? t instanceof Blob ? t : new Blob([t]) : t instanceof ArrayBuffer ? t : t.buffer
    }, Z = String.fromCharCode(30);
    function G() {
        return new TransformStream({
            transform: function(i, o) {
                var t, e;
                t = i,
                e = function(t) {
                    var e, n, r = t.length;
                    r < 126 ? (e = new Uint8Array(1),
                    new DataView(e.buffer).setUint8(0, r)) : r < 65536 ? (e = new Uint8Array(3),
                    (n = new DataView(e.buffer)).setUint8(0, 126),
                    n.setUint16(1, r)) : (e = new Uint8Array(9),
                    (n = new DataView(e.buffer)).setUint8(0, 127),
                    n.setBigUint64(1, BigInt(r))),
                    i.data && "string" != typeof i.data && (e[0] |= 128),
                    o.enqueue(e),
                    o.enqueue(t)
                }
                ,
                K && t.data instanceof Blob ? t.data.arrayBuffer().then(W).then(e) : Y && (t.data instanceof ArrayBuffer || M(t.data)) ? e(W(t.data)) : s(t, !1, function(t) {
                    n = n || new TextEncoder,
                    e(n.encode(t))
                })
            }
        })
    }
    function p(t) {
        return t.reduce(function(t, e) {
            return t + e.length
        }, 0)
    }
    function l(t, e) {
        if (t[0].length === e)
            return t.shift();
        for (var n = new Uint8Array(e), r = 0, i = 0; i < e; i++)
            n[i] = t[0][r++],
            r === t[0].length && (t.shift(),
            r = 0);
        return t.length && r < t[0].length && (t[0] = t[0].slice(r)),
        n
    }
    function d(t) {
        if (t) {
            var e, n = t;
            for (e in d.prototype)
                n[e] = d.prototype[e];
            return n
        }
    }
    d.prototype.on = d.prototype.addEventListener = function(t, e) {
        return this.t = this.t || {},
        (this.t["$" + t] = this.t["$" + t] || []).push(e),
        this
    }
    ,
    d.prototype.once = function(t, e) {
        function n() {
            this.off(t, n),
            e.apply(this, arguments)
        }
        return n.fn = e,
        this.on(t, n),
        this
    }
    ,
    d.prototype.off = d.prototype.removeListener = d.prototype.removeAllListeners = d.prototype.removeEventListener = function(t, e) {
        if (this.t = this.t || {},
        0 == arguments.length)
            this.t = {};
        else {
            var n, r = this.t["$" + t];
            if (r)
                if (1 == arguments.length)
                    delete this.t["$" + t];
                else {
                    for (var i = 0; i < r.length; i++)
                        if ((n = r[i]) === e || n.fn === e) {
                            r.splice(i, 1);
                            break
                        }
                    0 === r.length && delete this.t["$" + t]
                }
        }
        return this
    }
    ,
    d.prototype.emitReserved = d.prototype.emit = function(t) {
        this.t = this.t || {};
        for (var e = new Array(arguments.length - 1), n = this.t["$" + t], r = 1; r < arguments.length; r++)
            e[r - 1] = arguments[r];
        if (n)
            for (var r = 0, i = (n = n.slice(0)).length; r < i; ++r)
                n[r].apply(this, e);
        return this
    }
    ,
    d.prototype.listeners = function(t) {
        return this.t = this.t || {},
        this.t["$" + t] || []
    }
    ,
    d.prototype.hasListeners = function(t) {
        return !!this.listeners(t).length
    }
    ;
    var y = "function" == typeof Promise && "function" == typeof Promise.resolve ? function(t) {
        return Promise.resolve().then(t)
    }
    : function(t, e) {
        return e(t, 0)
    }
      , v = "undefined" != typeof self ? self : "undefined" != typeof window ? window : Function("return this")();
    function Q(n) {
        for (var t = arguments.length, e = new Array(1 < t ? t - 1 : 0), r = 1; r < t; r++)
            e[r - 1] = arguments[r];
        return e.reduce(function(t, e) {
            return n.hasOwnProperty(e) && (t[e] = n[e]),
            t
        }, {})
    }
    var tt = v.setTimeout
      , et = v.clearTimeout;
    function g(t, e) {
        e.useNativeTimers ? (t.setTimeoutFn = tt.bind(v),
        t.clearTimeoutFn = et.bind(v)) : (t.setTimeoutFn = v.setTimeout.bind(v),
        t.clearTimeoutFn = v.clearTimeout.bind(v))
    }
    function nt() {
        return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5)
    }
    e(ct, it = D(Error));
    var rt, m, it, ot = ct, b = (e(at, m = d),
    (b = at.prototype).onError = function(t, e, n) {
        return m.prototype.emitReserved.call(this, "error", new ot(t,e,n)),
        this
    }
    ,
    b.open = function() {
        return this.readyState = "opening",
        this.doOpen(),
        this
    }
    ,
    b.close = function() {
        return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(),
        this.onClose()),
        this
    }
    ,
    b.send = function(t) {
        "open" === this.readyState && this.write(t)
    }
    ,
    b.onOpen = function() {
        this.readyState = "open",
        this.writable = !0,
        m.prototype.emitReserved.call(this, "open")
    }
    ,
    b.onData = function(t) {
        t = $(t, this.socket.binaryType);
        this.onPacket(t)
    }
    ,
    b.onPacket = function(t) {
        m.prototype.emitReserved.call(this, "packet", t)
    }
    ,
    b.onClose = function(t) {
        this.readyState = "closed",
        m.prototype.emitReserved.call(this, "close", t)
    }
    ,
    b.pause = function(t) {}
    ,
    b.createUri = function(t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        return t + "://" + this.i() + this.o() + this.opts.path + this.u(e)
    }
    ,
    b.i = function() {
        var t = this.opts.hostname;
        return -1 === t.indexOf(":") ? t : "[" + t + "]"
    }
    ,
    b.o = function() {
        return this.opts.port && (this.opts.secure && Number(443 !== this.opts.port) || !this.opts.secure && 80 !== Number(this.opts.port)) ? ":" + this.opts.port : ""
    }
    ,
    b.u = function(t) {
        t = (t => {
            var e, n = "";
            for (e in t)
                t.hasOwnProperty(e) && (n.length && (n += "&"),
                n += encodeURIComponent(e) + "=" + encodeURIComponent(t[e]));
            return n
        }
        )(t);
        return t.length ? "?" + t : ""
    }
    ,
    at), w = (e(st, rt = b),
    (w = st.prototype).doOpen = function() {
        this.v()
    }
    ,
    w.pause = function(t) {
        function e() {
            r.readyState = "paused",
            t()
        }
        var n, r = this;
        this.readyState = "pausing";
        this.h || !this.writable ? (n = 0,
        this.h && (n++,
        this.once("pollComplete", function() {
            --n || e()
        })),
        this.writable || (n++,
        this.once("drain", function() {
            --n || e()
        }))) : e()
    }
    ,
    w.v = function() {
        this.h = !0,
        this.doPoll(),
        this.emitReserved("poll")
    }
    ,
    w.onData = function(t) {
        var e = this;
        ( (t, e) => {
            for (var n = t.split(Z), r = [], i = 0; i < n.length; i++) {
                var o = $(n[i], e);
                if (r.push(o),
                "error" === o.type)
                    break
            }
            return r
        }
        )(t, this.socket.binaryType).forEach(function(t) {
            if ("opening" === e.readyState && "open" === t.type && e.onOpen(),
            "close" === t.type)
                return e.onClose({
                    description: "transport closed by the server"
                }),
                !1;
            e.onPacket(t)
        }),
        "closed" !== this.readyState && (this.h = !1,
        this.emitReserved("pollComplete"),
        "open" === this.readyState) && this.v()
    }
    ,
    w.doClose = function() {
        function t() {
            e.write([{
                type: "close"
            }])
        }
        var e = this;
        "open" === this.readyState ? t() : this.once("open", t)
    }
    ,
    w.write = function(t) {
        var n, r, i, o = this;
        this.writable = !1,
        n = (t = t).length,
        r = new Array(n),
        i = 0,
        t.forEach(function(t, e) {
            s(t, !1, function(t) {
                r[e] = t,
                ++i === n && (t = r.join(Z),
                o.doWrite(t, function() {
                    o.writable = !0,
                    o.emitReserved("drain")
                }))
            })
        })
    }
    ,
    w.uri = function() {
        var t = this.opts.secure ? "https" : "http"
          , e = this.query || {};
        return !1 !== this.opts.timestampRequests && (e[this.opts.timestampParam] = nt()),
        this.supportsBinary || e.sid || (e.b64 = 1),
        this.createUri(t, e)
    }
    ,
    t(st, [{
        key: "name",
        get: function() {
            return "polling"
        }
    }])), k = !1;
    function st() {
        var t;
        return (t = rt.apply(this, arguments) || this).h = !1,
        t
    }
    function at(t) {
        var e;
        return (e = m.call(this) || this).writable = !1,
        g(e, t),
        e.opts = t,
        e.query = t.query,
        e.socket = t.socket,
        e.supportsBinary = !t.forceBase64,
        e
    }
    function ct(t, e, n) {
        return (t = it.call(this, t) || this).description = e,
        t.context = n,
        t.type = "TransportError",
        t
    }
    try {
        k = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest
    } catch (a) {}
    var ht = k;
    function ut() {}
    e(lt, pt = w),
    (k = lt.prototype).doWrite = function(t, e) {
        var n = this
          , t = this.request({
            method: "POST",
            data: t
        });
        t.on("success", e),
        t.on("error", function(t, e) {
            n.onError("xhr post error", t, e)
        })
    }
    ,
    k.doPoll = function() {
        var n = this
          , t = this.request();
        t.on("data", this.onData.bind(this)),
        t.on("error", function(t, e) {
            n.onError("xhr poll error", t, e)
        }),
        this.pollXhr = t
    }
    ;
    var ft, pt, w = lt, A = (e(E, ft = d),
    (k = E.prototype).A = function() {
        var t, e = this, n = Q(this.l, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref"), r = (n.xdomain = !!this.l.xd,
        this.j = this.createRequest(n));
        try {
            r.open(this.p, this.m, !0);
            try {
                if (this.l.extraHeaders)
                    for (var i in r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0),
                    this.l.extraHeaders)
                        this.l.extraHeaders.hasOwnProperty(i) && r.setRequestHeader(i, this.l.extraHeaders[i])
            } catch (t) {}
            if ("POST" === this.p)
                try {
                    r.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                } catch (t) {}
            try {
                r.setRequestHeader("Accept", "*/*")
            } catch (t) {}
            null != (t = this.l.cookieJar) && t.addCookies(r),
            "withCredentials"in r && (r.withCredentials = this.l.withCredentials),
            this.l.requestTimeout && (r.timeout = this.l.requestTimeout),
            r.onreadystatechange = function() {
                var t;
                3 === r.readyState && null != (t = e.l.cookieJar) && t.parseCookies(r.getResponseHeader("set-cookie")),
                4 === r.readyState && (200 === r.status || 1223 === r.status ? e.O() : e.setTimeoutFn(function() {
                    e.B("number" == typeof r.status ? r.status : 0)
                }, 0))
            }
            ,
            r.send(this.k)
        } catch (t) {
            return void this.setTimeoutFn(function() {
                e.B(t)
            }, 0)
        }
        "undefined" != typeof document && (this.S = E.requestsCount++,
        E.requests[this.S] = this)
    }
    ,
    k.B = function(t) {
        this.emitReserved("error", t, this.j),
        this.N(!0)
    }
    ,
    k.N = function(t) {
        if (null != this.j) {
            if (this.j.onreadystatechange = ut,
            t)
                try {
                    this.j.abort()
                } catch (t) {}
            "undefined" != typeof document && delete E.requests[this.S],
            this.j = null
        }
    }
    ,
    k.O = function() {
        var t = this.j.responseText;
        null !== t && (this.emitReserved("data", t),
        this.emitReserved("success"),
        this.N())
    }
    ,
    k.abort = function() {
        this.N()
    }
    ,
    E);
    function E(t, e, n) {
        var r;
        return (r = ft.call(this) || this).createRequest = t,
        g(r, n),
        r.l = n,
        r.p = n.method || "GET",
        r.m = e,
        r.k = void 0 !== n.data ? n.data : null,
        r.A(),
        r
    }
    function lt(t) {
        var e, n = pt.call(this, t) || this;
        return "undefined" != typeof location && (e = (e = location.port) || ("https:" === location.protocol ? "443" : "80"),
        n.xd = void 0 !== location && t.hostname !== location.hostname || e !== t.port),
        n
    }
    function dt() {
        for (var t in A.requests)
            A.requests.hasOwnProperty(t) && A.requests[t].abort()
    }
    A.requestsCount = 0,
    A.requests = {},
    "undefined" != typeof document && ("function" == typeof attachEvent ? attachEvent("onunload", dt) : "function" == typeof addEventListener && addEventListener("onpagehide"in v ? "pagehide" : "unload", dt, !1));
    var yt, vt = (k = mt({
        xdomain: !1
    })) && null !== k.responseType, k = (e(gt, yt = w),
    gt.prototype.request = function() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        return c(t, {
            xd: this.xd
        }, this.opts),
        new A(mt,this.uri(),t)
    }
    ,
    gt);
    function gt(t) {
        var e = yt.call(this, t) || this
          , t = t && t.forceBase64;
        return e.supportsBinary = vt && !t,
        e
    }
    function mt(t) {
        var e = t.xdomain;
        try {
            if ("undefined" != typeof XMLHttpRequest && (!e || ht))
                return new XMLHttpRequest
        } catch (t) {}
        if (!e)
            try {
                return new v[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")
            } catch (t) {}
    }
    var bt = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase()
      , w = (e(Ct, Et = b),
    (w = Ct.prototype).doOpen = function() {
        var t = this.uri()
          , e = this.opts.protocols
          , n = bt ? {} : Q(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
        try {
            this.ws = this.createSocket(t, e, n)
        } catch (t) {
            return this.emitReserved("error", t)
        }
        this.ws.binaryType = this.socket.binaryType,
        this.addEventListeners()
    }
    ,
    w.addEventListeners = function() {
        var e = this;
        this.ws.onopen = function() {
            e.opts.autoUnref && e.ws.C.unref(),
            e.onOpen()
        }
        ,
        this.ws.onclose = function(t) {
            return e.onClose({
                description: "websocket connection closed",
                context: t
            })
        }
        ,
        this.ws.onmessage = function(t) {
            return e.onData(t.data)
        }
        ,
        this.ws.onerror = function(t) {
            return e.onError("websocket error", t)
        }
    }
    ,
    w.write = function(t) {
        var r = this;
        this.writable = !1;
        for (var i = 0; i < t.length; i++)
            ( () => {
                var e = t[i]
                  , n = i === t.length - 1;
                s(e, r.supportsBinary, function(t) {
                    try {
                        r.doWrite(e, t)
                    } catch (t) {}
                    n && y(function() {
                        r.writable = !0,
                        r.emitReserved("drain")
                    }, r.setTimeoutFn)
                })
            }
            )()
    }
    ,
    w.doClose = function() {
        void 0 !== this.ws && (this.ws.onerror = function() {}
        ,
        this.ws.close(),
        this.ws = null)
    }
    ,
    w.uri = function() {
        var t = this.opts.secure ? "wss" : "ws"
          , e = this.query || {};
        return this.opts.timestampRequests && (e[this.opts.timestampParam] = nt()),
        this.supportsBinary || (e.b64 = 1),
        this.createUri(t, e)
    }
    ,
    t(Ct, [{
        key: "name",
        get: function() {
            return "websocket"
        }
    }]))
      , wt = v.WebSocket || v.MozWebSocket
      , w = (e(St, At = w),
    (w = St.prototype).createSocket = function(t, e, n) {
        return bt ? new wt(t,e,n) : e ? new wt(t,e) : new wt(t)
    }
    ,
    w.doWrite = function(t, e) {
        this.ws.send(e)
    }
    ,
    St);
    e(Bt, kt = b),
    (b = Bt.prototype).doOpen = function() {
        var r = this;
        try {
            this.T = new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])
        } catch (r) {
            return this.emitReserved("error", r)
        }
        this.T.closed.then(function() {
            r.onClose()
        }).catch(function(t) {
            r.onError("webtransport error", t)
        }),
        this.T.ready.then(function() {
            r.T.createBidirectionalStream().then(function(t) {
                o = Number.MAX_SAFE_INTEGER,
                s = r.socket.binaryType,
                J = J || new TextDecoder,
                a = [],
                c = 0,
                u = !(h = -1);
                var o, s, a, c, h, u, e = new TransformStream({
                    transform: function(t, e) {
                        for (a.push(t); ; ) {
                            if (0 === c) {
                                if (p(a) < 1)
                                    break;
                                var n = l(a, 1);
                                u = !(128 & ~n[0]),
                                c = (h = 127 & n[0]) < 126 ? 3 : 126 === h ? 1 : 2
                            } else if (1 === c) {
                                if (p(a) < 2)
                                    break;
                                n = l(a, 2);
                                h = new DataView(n.buffer,n.byteOffset,n.length).getUint16(0),
                                c = 3
                            } else if (2 === c) {
                                if (p(a) < 8)
                                    break;
                                var r = l(a, 8)
                                  , r = new DataView(r.buffer,r.byteOffset,r.length)
                                  , i = r.getUint32(0);
                                if (i > Math.pow(2, 21) - 1) {
                                    e.enqueue(H);
                                    break
                                }
                                h = i * Math.pow(2, 32) + r.getUint32(4),
                                c = 3
                            } else {
                                if (p(a) < h)
                                    break;
                                i = l(a, h);
                                e.enqueue($(u ? i : J.decode(i), s)),
                                c = 0
                            }
                            if (0 === h || o < h) {
                                e.enqueue(H);
                                break
                            }
                        }
                    }
                }), n = t.readable.pipeThrough(e).getReader(), e = G(), t = (e.readable.pipeTo(t.writable),
                r.U = e.writable.getWriter(),
                !function e() {
                    n.read().then(function(t) {
                        t.done || (r.onPacket(t.value),
                        e())
                    }).catch(function(t) {})
                }(),
                {
                    type: "open"
                });
                r.query.sid && (t.data = '{"sid":"'.concat(r.query.sid, '"}')),
                r.U.write(t).then(function() {
                    return r.onOpen()
                })
            })
        })
    }
    ,
    b.write = function(n) {
        var r = this;
        this.writable = !1;
        for (var i = 0; i < n.length; i++)
            ( () => {
                var t = n[i]
                  , e = i === n.length - 1;
                r.U.write(t).then(function() {
                    e && y(function() {
                        r.writable = !0,
                        r.emitReserved("drain")
                    }, r.setTimeoutFn)
                })
            }
            )()
    }
    ,
    b.doClose = function() {
        var t;
        null != (t = this.T) && t.close()
    }
    ;
    var kt, At, Et, Ot = {
        websocket: w,
        webtransport: t(Bt, [{
            key: "name",
            get: function() {
                return "webtransport"
            }
        }]),
        polling: k
    }, Rt = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Tt = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
    function Bt() {
        return kt.apply(this, arguments) || this
    }
    function St() {
        return At.apply(this, arguments) || this
    }
    function Ct() {
        return Et.apply(this, arguments) || this
    }
    function Nt(t) {
        if (8e3 < t.length)
            throw "URI too long";
        var e = t
          , n = t.indexOf("[")
          , r = t.indexOf("]");
        -1 != n && -1 != r && (t = t.substring(0, n) + t.substring(n, r).replace(/:/g, ";") + t.substring(r, t.length));
        for (var i, o = Rt.exec(t || ""), s = {}, a = 14; a--; )
            s[Tt[a]] = o[a] || "";
        return -1 != n && -1 != r && (s.source = e,
        s.host = s.host.substring(1, s.host.length - 1).replace(/;/g, ":"),
        s.authority = s.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
        s.ipv6uri = !0),
        s.pathNames = (n = (t = s.path).replace(/\/{2,9}/g, "/").split("/"),
        "/" != t.slice(0, 1) && 0 !== t.length || n.splice(0, 1),
        "/" == t.slice(-1) && n.splice(n.length - 1, 1),
        n),
        s.queryKey = (i = {},
        s.query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(t, e, n) {
            e && (i[e] = n)
        }),
        i),
        s
    }
    var jt, xt = "function" == typeof addEventListener && "function" == typeof removeEventListener, O = [], R = (xt && addEventListener("offline", function() {
        O.forEach(function(t) {
            return t()
        })
    }, !1),
    e(T, jt = d),
    (b = T.prototype).createTransport = function(t) {
        var e = c({}, this.opts.query)
          , e = (e.EIO = 4,
        e.transport = t,
        this.id && (e.sid = this.id),
        c({}, this.opts, {
            query: e,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
        }, this.opts.transportOptions[t]));
        return new this.D[t](e)
    }
    ,
    b.q = function() {
        var t, e = this;
        0 !== this.transports.length ? (t = this.opts.rememberUpgrade && T.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket") ? "websocket" : this.transports[0],
        this.readyState = "opening",
        (t = this.createTransport(t)).open(),
        this.setTransport(t)) : this.setTimeoutFn(function() {
            e.emitReserved("error", "No transports available")
        }, 0)
    }
    ,
    b.setTransport = function(t) {
        var e = this;
        this.transport && this.transport.removeAllListeners(),
        (this.transport = t).on("drain", this.X.bind(this)).on("packet", this.H.bind(this)).on("error", this.B.bind(this)).on("close", function(t) {
            return e.F("transport close", t)
        })
    }
    ,
    b.onOpen = function() {
        this.readyState = "open",
        T.priorWebsocketSuccess = "websocket" === this.transport.name,
        this.emitReserved("open"),
        this.flush()
    }
    ,
    b.H = function(t) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
            switch (this.emitReserved("packet", t),
            this.emitReserved("heartbeat"),
            t.type) {
            case "open":
                this.onHandshake(JSON.parse(t.data));
                break;
            case "ping":
                this.J("pong"),
                this.emitReserved("ping"),
                this.emitReserved("pong"),
                this.K();
                break;
            case "error":
                var e = new Error("server error");
                e.code = t.data,
                this.B(e);
                break;
            case "message":
                this.emitReserved("data", t.data),
                this.emitReserved("message", t.data)
            }
    }
    ,
    b.onHandshake = function(t) {
        this.emitReserved("handshake", t),
        this.id = t.sid,
        this.transport.query.sid = t.sid,
        this.I = t.pingInterval,
        this.R = t.pingTimeout,
        this.L = t.maxPayload,
        this.onOpen(),
        "closed" !== this.readyState && this.K()
    }
    ,
    b.K = function() {
        var t = this
          , e = (this.clearTimeoutFn(this.Y),
        this.I + this.R);
        this._ = Date.now() + e,
        this.Y = this.setTimeoutFn(function() {
            t.F("ping timeout")
        }, e),
        this.opts.autoUnref && this.Y.unref()
    }
    ,
    b.X = function() {
        this.writeBuffer.splice(0, this.M),
        (this.M = 0) === this.writeBuffer.length ? this.emitReserved("drain") : this.flush()
    }
    ,
    b.flush = function() {
        var t;
        "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (t = this.G(),
        this.transport.send(t),
        this.M = t.length,
        this.emitReserved("flush"))
    }
    ,
    b.G = function() {
        if (this.L && "polling" === this.transport.name && 1 < this.writeBuffer.length)
            for (var t = 1, e = 0; e < this.writeBuffer.length; e++) {
                var n = this.writeBuffer[e].data;
                if (n && (t += "string" == typeof (n = n) ? (t => {
                    for (var e, n = 0, r = 0, i = t.length; r < i; r++)
                        (e = t.charCodeAt(r)) < 128 ? n += 1 : e < 2048 ? n += 2 : e < 55296 || 57344 <= e ? n += 3 : (r++,
                        n += 4);
                    return n
                }
                )(n) : Math.ceil(1.33 * (n.byteLength || n.size))),
                0 < e && t > this.L)
                    return this.writeBuffer.slice(0, e);
                t += 2
            }
        return this.writeBuffer
    }
    ,
    b.W = function() {
        var t, e = this;
        return !this._ || ((t = Date.now() > this._) && (this._ = 0,
        y(function() {
            e.F("ping timeout")
        }, this.setTimeoutFn)),
        t)
    }
    ,
    b.write = function(t, e, n) {
        return this.J("message", t, e, n),
        this
    }
    ,
    b.send = function(t, e, n) {
        return this.J("message", t, e, n),
        this
    }
    ,
    b.J = function(t, e, n, r) {
        "function" == typeof e && (r = e,
        e = void 0),
        "function" == typeof n && (r = n,
        n = null),
        "closing" !== this.readyState && "closed" !== this.readyState && ((n = n || {}).compress = !1 !== n.compress,
        this.emitReserved("packetCreate", t = {
            type: t,
            data: e,
            options: n
        }),
        this.writeBuffer.push(t),
        r && this.once("flush", r),
        this.flush())
    }
    ,
    b.close = function() {
        function t() {
            n.off("upgrade", t),
            n.off("upgradeError", t),
            r()
        }
        function e() {
            n.once("upgrade", t),
            n.once("upgradeError", t)
        }
        var n = this
          , r = function() {
            n.F("forced close"),
            n.transport.close()
        };
        return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing",
        this.writeBuffer.length ? this.once("drain", function() {
            (n.upgrading ? e : r)()
        }) : (this.upgrading ? e : r)()),
        this
    }
    ,
    b.B = function(t) {
        if (T.priorWebsocketSuccess = !1,
        this.opts.tryAllTransports && 1 < this.transports.length && "opening" === this.readyState)
            return this.transports.shift(),
            this.q();
        this.emitReserved("error", t),
        this.F("transport error", t)
    }
    ,
    b.F = function(t, e) {
        var n;
        "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (this.clearTimeoutFn(this.Y),
        this.transport.removeAllListeners("close"),
        this.transport.close(),
        this.transport.removeAllListeners(),
        xt && (this.P && removeEventListener("beforeunload", this.P, !1),
        this.$) && (-1 !== (n = O.indexOf(this.$)) && O.splice(n, 1)),
        this.readyState = "closed",
        this.id = null,
        this.emitReserved("close", t, e),
        this.writeBuffer = [],
        this.M = 0)
    }
    ,
    T);
    function T(t, e) {
        var o;
        return (o = jt.call(this) || this).binaryType = "arraybuffer",
        o.writeBuffer = [],
        o.M = 0,
        o.I = -1,
        o.R = -1,
        o.L = -1,
        o._ = 1 / 0,
        t && "object" === h(t) && (e = t,
        t = null),
        t ? (t = Nt(t),
        e.hostname = t.host,
        e.secure = "https" === t.protocol || "wss" === t.protocol,
        e.port = t.port,
        t.query && (e.query = t.query)) : e.host && (e.hostname = Nt(e.host).host),
        g(o, e),
        o.secure = null != e.secure ? e.secure : "undefined" != typeof location && "https:" === location.protocol,
        e.hostname && !e.port && (e.port = o.secure ? "443" : "80"),
        o.hostname = e.hostname || ("undefined" != typeof location ? location.hostname : "localhost"),
        o.port = e.port || ("undefined" != typeof location && location.port ? location.port : o.secure ? "443" : "80"),
        o.transports = [],
        o.D = {},
        e.transports.forEach(function(t) {
            var e = t.prototype.name;
            o.transports.push(e),
            o.D[e] = t
        }),
        o.opts = c({
            path: "/engine.io",
            agent: !1,
            withCredentials: !1,
            upgrade: !0,
            timestampParam: "t",
            rememberUpgrade: !1,
            addTrailingSlash: !0,
            rejectUnauthorized: !0,
            perMessageDeflate: {
                threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: !1
        }, e),
        o.opts.path = o.opts.path.replace(/\/$/, "") + (o.opts.addTrailingSlash ? "/" : ""),
        "string" == typeof o.opts.query && (o.opts.query = ( () => {
            for (var t = {}, e = o.opts.query.split("&"), n = 0, r = e.length; n < r; n++) {
                var i = e[n].split("=");
                t[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
            }
            return t
        }
        )()),
        xt && (o.opts.closeOnBeforeunload && (o.P = function() {
            o.transport && (o.transport.removeAllListeners(),
            o.transport.close())
        }
        ,
        addEventListener("beforeunload", o.P, !1)),
        "localhost" !== o.hostname) && (o.$ = function() {
            o.F("transport close", {
                description: "network connection lost"
            })
        }
        ,
        O.push(o.$)),
        o.opts.withCredentials && (o.V = void 0),
        o.q(),
        o
    }
    R.protocol = 4;
    e(Ut, B = R),
    (w = Ut.prototype).onOpen = function() {
        if (B.prototype.onOpen.call(this),
        "open" === this.readyState && this.opts.upgrade)
            for (var t = 0; t < this.Z.length; t++)
                this.tt(this.Z[t])
    }
    ,
    w.tt = function(t) {
        var e = this
          , n = this.createTransport(t)
          , r = !1
          , i = (R.priorWebsocketSuccess = !1,
        function() {
            r || (n.send([{
                type: "ping",
                data: "probe"
            }]),
            n.once("packet", function(t) {
                r || ("pong" === t.type && "probe" === t.data ? (e.upgrading = !0,
                e.emitReserved("upgrading", n),
                n && (R.priorWebsocketSuccess = "websocket" === n.name,
                e.transport.pause(function() {
                    r || "closed" !== e.readyState && (u(),
                    e.setTransport(n),
                    n.send([{
                        type: "upgrade"
                    }]),
                    e.emitReserved("upgrade", n),
                    n = null,
                    e.upgrading = !1,
                    e.flush())
                }))) : ((t = new Error("probe error")).transport = n.name,
                e.emitReserved("upgradeError", t)))
            }))
        }
        );
        function o() {
            r || (r = !0,
            u(),
            n.close(),
            n = null)
        }
        var s = function(t) {
            t = new Error("probe error: " + t);
            t.transport = n.name,
            o(),
            e.emitReserved("upgradeError", t)
        };
        function a() {
            s("transport closed")
        }
        function c() {
            s("socket closed")
        }
        function h(t) {
            n && t.name !== n.name && o()
        }
        var u = function() {
            n.removeListener("open", i),
            n.removeListener("error", s),
            n.removeListener("close", a),
            e.off("close", c),
            e.off("upgrading", h)
        };
        n.once("open", i),
        n.once("error", s),
        n.once("close", a),
        this.once("close", c),
        this.once("upgrading", h),
        -1 !== this.Z.indexOf("webtransport") && "webtransport" !== t ? this.setTimeoutFn(function() {
            r || n.open()
        }, 200) : n.open()
    }
    ,
    w.onHandshake = function(t) {
        this.Z = this.nt(t.upgrades),
        B.prototype.onHandshake.call(this, t)
    }
    ,
    w.nt = function(t) {
        for (var e = [], n = 0; n < t.length; n++)
            ~this.transports.indexOf(t[n]) && e.push(t[n]);
        return e
    }
    ;
    var qt, B, k = Ut, Pt = (e(_t, qt = k),
    _t);
    function _t(t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
          , e = "object" === h(t) ? t : e;
        return e.transports && (e.transports,
        "string" != typeof e.transports[0]) || (e.transports = (e.transports || ["polling", "websocket", "webtransport"]).map(function(t) {
            return Ot[t]
        }).filter(function(t) {
            return !!t
        })),
        qt.call(this, t, e) || this
    }
    function Ut() {
        var t;
        return (t = B.apply(this, arguments) || this).Z = [],
        t
    }
    Pt.protocol;
    var Ft = "function" == typeof ArrayBuffer
      , It = function(t) {
        return "function" == typeof ArrayBuffer.isView ? ArrayBuffer.isView(t) : t.buffer instanceof ArrayBuffer
    }
      , b = Object.prototype.toString
      , Lt = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === b.call(Blob)
      , Dt = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === b.call(File);
    function Mt(t) {
        return Ft && (t instanceof ArrayBuffer || It(t)) || Lt && t instanceof Blob || Dt && t instanceof File
    }
    function Vt(t) {
        var e = []
          , n = t.data;
        return t.data = function t(e, n) {
            if (!e)
                return e;
            {
                var r;
                if (Mt(e))
                    return r = {
                        _placeholder: !0,
                        num: n.length
                    },
                    n.push(e),
                    r
            }
            if (Array.isArray(e)) {
                for (var i = new Array(e.length), o = 0; o < e.length; o++)
                    i[o] = t(e[o], n);
                return i
            }
            if ("object" === h(e) && !(e instanceof Date)) {
                var s, a = {};
                for (s in e)
                    Object.prototype.hasOwnProperty.call(e, s) && (a[s] = t(e[s], n));
                return a
            }
            return e
        }(n, e),
        t.attachments = e.length,
        {
            packet: t,
            buffers: e
        }
    }
    function Ht(t, e) {
        return t.data = function t(e, n) {
            if (!e)
                return e;
            if (e && !0 === e._placeholder) {
                if ("number" == typeof e.num && 0 <= e.num && e.num < n.length)
                    return n[e.num];
                throw new Error("illegal attachments")
            }
            if (Array.isArray(e))
                for (var r = 0; r < e.length; r++)
                    e[r] = t(e[r], n);
            else if ("object" === h(e))
                for (var i in e)
                    Object.prototype.hasOwnProperty.call(e, i) && (e[i] = t(e[i], n));
            return e
        }(t.data, e),
        delete t.attachments,
        t
    }
    var S, C, Kt = ["connect", "connect_error", "disconnect", "disconnecting", "newListener", "removeListener"], b = ((w = S = S || {})[w.CONNECT = 0] = "CONNECT",
    w[w.DISCONNECT = 1] = "DISCONNECT",
    w[w.EVENT = 2] = "EVENT",
    w[w.ACK = 3] = "ACK",
    w[w.CONNECT_ERROR = 4] = "CONNECT_ERROR",
    w[w.BINARY_EVENT = 5] = "BINARY_EVENT",
    w[w.BINARY_ACK = 6] = "BINARY_ACK",
    (k = $t.prototype).encode = function(t) {
        return t.type !== S.EVENT && t.type !== S.ACK || !function t(e) {
            if (e && "object" === h(e))
                if (Array.isArray(e)) {
                    for (var n = 0, r = e.length; n < r; n++)
                        if (t(e[n]))
                            return !0
                } else {
                    if (Mt(e))
                        return !0;
                    if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length)
                        return t(e.toJSON(), !0);
                    for (var i in e)
                        if (Object.prototype.hasOwnProperty.call(e, i) && t(e[i]))
                            return !0
                }
            return !1
        }(t) ? [this.encodeAsString(t)] : this.encodeAsBinary({
            type: t.type === S.EVENT ? S.BINARY_EVENT : S.BINARY_ACK,
            nsp: t.nsp,
            data: t.data,
            id: t.id
        })
    }
    ,
    k.encodeAsString = function(t) {
        var e = "" + t.type;
        return t.type !== S.BINARY_EVENT && t.type !== S.BINARY_ACK || (e += t.attachments + "-"),
        t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
        null != t.id && (e += t.id),
        null != t.data && (e += JSON.stringify(t.data, this.replacer)),
        e
    }
    ,
    k.encodeAsBinary = function(t) {
        var t = Vt(t)
          , e = this.encodeAsString(t.packet)
          , t = t.buffers;
        return t.unshift(e),
        t
    }
    ,
    $t), k = (e(N, C = d),
    (w = N.prototype).add = function(t) {
        var e;
        if ("string" == typeof t) {
            if (this.reconstructor)
                throw new Error("got plaintext data when reconstructing a packet");
            var n = (e = this.decodeString(t)).type === S.BINARY_EVENT;
            (n || e.type === S.BINARY_ACK) && (e.type = n ? S.EVENT : S.ACK,
            this.reconstructor = new Yt(e),
            0 !== e.attachments) || C.prototype.emitReserved.call(this, "decoded", e)
        } else {
            if (!Mt(t) && !t.base64)
                throw new Error("Unknown type: " + t);
            if (!this.reconstructor)
                throw new Error("got binary data when not reconstructing a packet");
            (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null,
            C.prototype.emitReserved.call(this, "decoded", e))
        }
    }
    ,
    w.decodeString = function(t) {
        var e = 0
          , n = {
            type: Number(t.charAt(0))
        };
        if (void 0 === S[n.type])
            throw new Error("unknown packet type " + n.type);
        if (n.type === S.BINARY_EVENT || n.type === S.BINARY_ACK) {
            for (var r = e + 1; "-" !== t.charAt(++e) && e != t.length; )
                ;
            r = t.substring(r, e);
            if (r != Number(r) || "-" !== t.charAt(e))
                throw new Error("Illegal attachments");
            n.attachments = Number(r)
        }
        if ("/" === t.charAt(e + 1)) {
            for (r = e + 1; ++e && "," !== t.charAt(e) && e !== t.length; )
                ;
            n.nsp = t.substring(r, e)
        } else
            n.nsp = "/";
        r = t.charAt(e + 1);
        if ("" !== r && Number(r) == r) {
            for (r = e + 1; ++e; ) {
                var i = t.charAt(e);
                if (null == i || Number(i) != i) {
                    --e;
                    break
                }
                if (e === t.length)
                    break
            }
            n.id = Number(t.substring(r, e + 1))
        }
        if (t.charAt(++e)) {
            r = this.tryParse(t.substr(e));
            if (!N.isPayloadValid(n.type, r))
                throw new Error("invalid payload");
            n.data = r
        }
        return n
    }
    ,
    w.tryParse = function(t) {
        try {
            return JSON.parse(t, this.reviver)
        } catch (t) {
            return !1
        }
    }
    ,
    N.isPayloadValid = function(t, e) {
        switch (t) {
        case S.CONNECT:
            return j(e);
        case S.DISCONNECT:
            return void 0 === e;
        case S.CONNECT_ERROR:
            return "string" == typeof e || j(e);
        case S.EVENT:
        case S.BINARY_EVENT:
            return Array.isArray(e) && ("number" == typeof e[0] || "string" == typeof e[0] && -1 === Kt.indexOf(e[0]));
        case S.ACK:
        case S.BINARY_ACK:
            return Array.isArray(e)
        }
    }
    ,
    w.destroy = function() {
        this.reconstructor && (this.reconstructor.finishedReconstruction(),
        this.reconstructor = null)
    }
    ,
    N), Yt = ((w = Wt.prototype).takeBinaryData = function(t) {
        return this.buffers.push(t),
        this.buffers.length === this.reconPack.attachments ? (t = Ht(this.reconPack, this.buffers),
        this.finishedReconstruction(),
        t) : null
    }
    ,
    w.finishedReconstruction = function() {
        this.reconPack = null,
        this.buffers = []
    }
    ,
    Wt);
    function Wt(t) {
        this.packet = t,
        this.buffers = [],
        this.reconPack = t
    }
    function N(t) {
        var e;
        return (e = C.call(this) || this).reviver = t,
        e
    }
    function $t(t) {
        this.replacer = t
    }
    var Jt = Number.isInteger || function(t) {
        return "number" == typeof t && isFinite(t) && Math.floor(t) === t
    }
    ;
    function j(t) {
        return "[object Object]" === Object.prototype.toString.call(t)
    }
    var zt = Object.freeze({
        __proto__: null,
        protocol: 5,
        get PacketType() {
            return S
        },
        Encoder: b,
        Decoder: k,
        isPacketValid: function(t) {
            return "string" == typeof t.nsp && (void 0 === (e = t.id) || Jt(e)) && ( (t, e) => {
                switch (t) {
                case S.CONNECT:
                    return void 0 === e || j(e);
                case S.DISCONNECT:
                    return void 0 === e;
                case S.EVENT:
                    return Array.isArray(e) && ("number" == typeof e[0] || "string" == typeof e[0] && -1 === Kt.indexOf(e[0]));
                case S.ACK:
                    return Array.isArray(e);
                case S.CONNECT_ERROR:
                    return "string" == typeof e || j(e);
                default:
                    return !1
                }
            }
            )(t.type, t.data);
            var e
        }
    });
    function x(t, e, n) {
        return t.on(e, n),
        function() {
            t.off(e, n)
        }
    }
    var Xt, Zt = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        newListener: 1,
        removeListener: 1
    }), Gt = (e(Qt, Xt = d),
    (w = Qt.prototype).subEvents = function() {
        var t;
        this.subs || (t = this.io,
        this.subs = [x(t, "open", this.onopen.bind(this)), x(t, "packet", this.onpacket.bind(this)), x(t, "error", this.onerror.bind(this)), x(t, "close", this.onclose.bind(this))])
    }
    ,
    w.connect = function() {
        return this.connected || (this.subEvents(),
        this.io.ot || this.io.open(),
        "open" === this.io.st && this.onopen()),
        this
    }
    ,
    w.open = function() {
        return this.connect()
    }
    ,
    w.send = function() {
        for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
            e[n] = arguments[n];
        return e.unshift("message"),
        this.emit.apply(this, e),
        this
    }
    ,
    w.emit = function(t) {
        if (Zt.hasOwnProperty(t))
            throw new Error('"' + t.toString() + '" is a reserved event name');
        for (var e, n, r = arguments.length, i = new Array(1 < r ? r - 1 : 0), o = 1; o < r; o++)
            i[o - 1] = arguments[o];
        return (i.unshift(t),
        !this.l.retries || this.flags.fromQueue || this.flags.volatile) ? (e = ((t = {
            type: S.EVENT,
            data: i,
            options: {}
        }).options.compress = !1 !== this.flags.compress,
        "function" == typeof i[i.length - 1] && (n = this.ids++,
        e = i.pop(),
        this.ht(n, e),
        t.id = n),
        null == (n = null == (e = this.io.engine) ? void 0 : e.transport) ? void 0 : n.writable),
        n = this.connected && !(null != (n = this.io.engine) && n.W()),
        this.flags.volatile && !e || (n ? (this.notifyOutgoingListeners(t),
        this.packet(t)) : this.sendBuffer.push(t)),
        this.flags = {}) : this.ut(i),
        this
    }
    ,
    w.ht = function(e, r) {
        var i, o = this, t = null != (t = this.flags.timeout) ? t : this.l.ackTimeout;
        void 0 !== t ? (i = this.io.setTimeoutFn(function() {
            delete o.acks[e];
            for (var t = 0; t < o.sendBuffer.length; t++)
                o.sendBuffer[t].id === e && o.sendBuffer.splice(t, 1);
            r.call(o, new Error("operation has timed out"))
        }, t),
        (t = function() {
            o.io.clearTimeoutFn(i);
            for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                e[n] = arguments[n];
            r.apply(o, e)
        }
        ).withError = !0,
        this.acks[e] = t) : this.acks[e] = r
    }
    ,
    w.emitWithAck = function(e) {
        for (var i = this, t = arguments.length, o = new Array(1 < t ? t - 1 : 0), n = 1; n < t; n++)
            o[n - 1] = arguments[n];
        return new Promise(function(n, r) {
            function t(t, e) {
                return t ? r(t) : n(e)
            }
            t.withError = !0,
            o.push(t),
            i.emit.apply(i, [e].concat(o))
        }
        )
    }
    ,
    w.ut = function(t) {
        var i, o = this, s = ("function" == typeof t[t.length - 1] && (i = t.pop()),
        {
            id: this.rt++,
            tryCount: 0,
            pending: !1,
            args: t,
            flags: c({
                fromQueue: !0
            }, this.flags)
        });
        t.push(function(t) {
            if (s === o.it[0]) {
                if (null !== t)
                    s.tryCount > o.l.retries && (o.it.shift(),
                    i) && i(t);
                else if (o.it.shift(),
                i) {
                    for (var e = arguments.length, n = new Array(1 < e ? e - 1 : 0), r = 1; r < e; r++)
                        n[r - 1] = arguments[r];
                    i.apply(void 0, [null].concat(n))
                }
                return s.pending = !1,
                o.ft()
            }
        }),
        this.it.push(s),
        this.ft()
    }
    ,
    w.ft = function() {
        var t;
        this.connected && 0 !== this.it.length && (!(t = this.it[0]).pending || 0 < arguments.length && void 0 !== arguments[0] && arguments[0]) && (t.pending = !0,
        t.tryCount++,
        this.flags = t.flags,
        this.emit.apply(this, t.args))
    }
    ,
    w.packet = function(t) {
        t.nsp = this.nsp,
        this.io.ct(t)
    }
    ,
    w.onopen = function() {
        var e = this;
        "function" == typeof this.auth ? this.auth(function(t) {
            e.vt(t)
        }) : this.vt(this.auth)
    }
    ,
    w.vt = function(t) {
        this.packet({
            type: S.CONNECT,
            data: this.lt ? c({
                pid: this.lt,
                offset: this.dt
            }, t) : t
        })
    }
    ,
    w.onerror = function(t) {
        this.connected || this.emitReserved("connect_error", t)
    }
    ,
    w.onclose = function(t, e) {
        this.connected = !1,
        delete this.id,
        this.emitReserved("disconnect", t, e),
        this.yt()
    }
    ,
    w.yt = function() {
        var n = this;
        Object.keys(this.acks).forEach(function(e) {
            var t;
            n.sendBuffer.some(function(t) {
                return String(t.id) === e
            }) || (t = n.acks[e],
            delete n.acks[e],
            t.withError && t.call(n, new Error("socket has been disconnected")))
        })
    }
    ,
    w.onpacket = function(t) {
        if (t.nsp === this.nsp)
            switch (t.type) {
            case S.CONNECT:
                t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                break;
            case S.EVENT:
            case S.BINARY_EVENT:
                this.onevent(t);
                break;
            case S.ACK:
            case S.BINARY_ACK:
                this.onack(t);
                break;
            case S.DISCONNECT:
                this.ondisconnect();
                break;
            case S.CONNECT_ERROR:
                this.destroy();
                var e = new Error(t.data.message);
                e.data = t.data.data,
                this.emitReserved("connect_error", e)
            }
    }
    ,
    w.onevent = function(t) {
        var e = t.data || [];
        null != t.id && e.push(this.ack(t.id)),
        this.connected ? this.emitEvent(e) : this.receiveBuffer.push(Object.freeze(e))
    }
    ,
    w.emitEvent = function(t) {
        if (this.bt && this.bt.length) {
            var e, n = F(this.bt.slice());
            try {
                for (n.s(); !(e = n.n()).done; )
                    e.value.apply(this, t)
            } catch (t) {
                n.e(t)
            } finally {
                n.f()
            }
        }
        Xt.prototype.emit.apply(this, t),
        this.lt && t.length && "string" == typeof t[t.length - 1] && (this.dt = t[t.length - 1])
    }
    ,
    w.ack = function(r) {
        var i = this
          , o = !1;
        return function() {
            if (!o) {
                o = !0;
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                i.packet({
                    type: S.ACK,
                    id: r,
                    data: e
                })
            }
        }
    }
    ,
    w.onack = function(t) {
        var e = this.acks[t.id];
        "function" == typeof e && (delete this.acks[t.id],
        e.withError && t.data.unshift(null),
        e.apply(this, t.data))
    }
    ,
    w.onconnect = function(t, e) {
        this.id = t,
        this.recovered = e && this.lt === e,
        this.lt = e,
        this.connected = !0,
        this.emitBuffered(),
        this.emitReserved("connect"),
        this.ft(!0)
    }
    ,
    w.emitBuffered = function() {
        var e = this;
        this.receiveBuffer.forEach(function(t) {
            return e.emitEvent(t)
        }),
        this.receiveBuffer = [],
        this.sendBuffer.forEach(function(t) {
            e.notifyOutgoingListeners(t),
            e.packet(t)
        }),
        this.sendBuffer = []
    }
    ,
    w.ondisconnect = function() {
        this.destroy(),
        this.onclose("io server disconnect")
    }
    ,
    w.destroy = function() {
        this.subs && (this.subs.forEach(function(t) {
            return t()
        }),
        this.subs = void 0),
        this.io.wt(this)
    }
    ,
    w.disconnect = function() {
        return this.connected && this.packet({
            type: S.DISCONNECT
        }),
        this.destroy(),
        this.connected && this.onclose("io client disconnect"),
        this
    }
    ,
    w.close = function() {
        return this.disconnect()
    }
    ,
    w.compress = function(t) {
        return this.flags.compress = t,
        this
    }
    ,
    w.timeout = function(t) {
        return this.flags.timeout = t,
        this
    }
    ,
    w.onAny = function(t) {
        return this.bt = this.bt || [],
        this.bt.push(t),
        this
    }
    ,
    w.prependAny = function(t) {
        return this.bt = this.bt || [],
        this.bt.unshift(t),
        this
    }
    ,
    w.offAny = function(t) {
        if (this.bt)
            if (t) {
                for (var e = this.bt, n = 0; n < e.length; n++)
                    if (t === e[n])
                        return e.splice(n, 1),
                        this
            } else
                this.bt = [];
        return this
    }
    ,
    w.listenersAny = function() {
        return this.bt || []
    }
    ,
    w.onAnyOutgoing = function(t) {
        return this.gt = this.gt || [],
        this.gt.push(t),
        this
    }
    ,
    w.prependAnyOutgoing = function(t) {
        return this.gt = this.gt || [],
        this.gt.unshift(t),
        this
    }
    ,
    w.offAnyOutgoing = function(t) {
        if (this.gt)
            if (t) {
                for (var e = this.gt, n = 0; n < e.length; n++)
                    if (t === e[n])
                        return e.splice(n, 1),
                        this
            } else
                this.gt = [];
        return this
    }
    ,
    w.listenersAnyOutgoing = function() {
        return this.gt || []
    }
    ,
    w.notifyOutgoingListeners = function(t) {
        if (this.gt && this.gt.length) {
            var e, n = F(this.gt.slice());
            try {
                for (n.s(); !(e = n.n()).done; )
                    e.value.apply(this, t.data)
            } catch (t) {
                n.e(t)
            } finally {
                n.f()
            }
        }
    }
    ,
    t(Qt, [{
        key: "disconnected",
        get: function() {
            return !this.connected
        }
    }, {
        key: "active",
        get: function() {
            return !!this.subs
        }
    }, {
        key: "volatile",
        get: function() {
            return this.flags.volatile = !0,
            this
        }
    }]));
    function Qt(t, e, n) {
        var r;
        return (r = Xt.call(this) || this).connected = !1,
        r.recovered = !1,
        r.receiveBuffer = [],
        r.sendBuffer = [],
        r.it = [],
        r.rt = 0,
        r.ids = 0,
        r.acks = {},
        r.flags = {},
        r.io = t,
        r.nsp = e,
        n && n.auth && (r.auth = n.auth),
        r.l = c({}, n),
        r.io.et && r.open(),
        r
    }
    function q(t) {
        this.ms = (t = t || {}).min || 100,
        this.max = t.max || 1e4,
        this.factor = t.factor || 2,
        this.jitter = 0 < t.jitter && t.jitter <= 1 ? t.jitter : 0,
        this.attempts = 0
    }
    q.prototype.duration = function() {
        var t, e, n = this.ms * Math.pow(this.factor, this.attempts++);
        return this.jitter && (t = Math.random(),
        e = Math.floor(t * this.jitter * n),
        n = 1 & Math.floor(10 * t) ? n + e : n - e),
        0 | Math.min(n, this.max)
    }
    ,
    q.prototype.reset = function() {
        this.attempts = 0
    }
    ,
    q.prototype.setMin = function(t) {
        this.ms = t
    }
    ,
    q.prototype.setMax = function(t) {
        this.max = t
    }
    ,
    q.prototype.setJitter = function(t) {
        this.jitter = t
    }
    ;
    e(ne, te = d),
    (b = ne.prototype).reconnection = function(t) {
        return arguments.length ? (this.kt = !!t,
        t || (this.skipReconnect = !0),
        this) : this.kt
    }
    ,
    b.reconnectionAttempts = function(t) {
        return void 0 === t ? this.At : (this.At = t,
        this)
    }
    ,
    b.reconnectionDelay = function(t) {
        var e;
        return void 0 === t ? this.jt : (this.jt = t,
        null != (e = this.backoff) && e.setMin(t),
        this)
    }
    ,
    b.randomizationFactor = function(t) {
        var e;
        return void 0 === t ? this.Et : (this.Et = t,
        null != (e = this.backoff) && e.setJitter(t),
        this)
    }
    ,
    b.reconnectionDelayMax = function(t) {
        var e;
        return void 0 === t ? this.Ot : (this.Ot = t,
        null != (e = this.backoff) && e.setMax(t),
        this)
    }
    ,
    b.timeout = function(t) {
        return arguments.length ? (this.Bt = t,
        this) : this.Bt
    }
    ,
    b.maybeReconnectOnOpen = function() {
        !this.ot && this.kt && 0 === this.backoff.attempts && this.reconnect()
    }
    ,
    b.open = function(e) {
        var t, n, r, i, o, s, a, c = this;
        return ~this.st.indexOf("open") || (this.engine = new Pt(this.uri,this.opts),
        t = this.engine,
        (n = this).st = "opening",
        this.skipReconnect = !1,
        r = x(t, "open", function() {
            n.onopen(),
            e && e()
        }),
        o = x(t, "error", i = function(t) {
            c.cleanup(),
            c.st = "closed",
            c.emitReserved("error", t),
            e ? e(t) : c.maybeReconnectOnOpen()
        }
        ),
        !1 !== this.Bt && (s = this.Bt,
        a = this.setTimeoutFn(function() {
            r(),
            i(new Error("timeout")),
            t.close()
        }, s),
        this.opts.autoUnref && a.unref(),
        this.subs.push(function() {
            c.clearTimeoutFn(a)
        })),
        this.subs.push(r),
        this.subs.push(o)),
        this
    }
    ,
    b.connect = function(t) {
        return this.open(t)
    }
    ,
    b.onopen = function() {
        this.cleanup(),
        this.st = "open",
        this.emitReserved("open");
        var t = this.engine;
        this.subs.push(x(t, "ping", this.onping.bind(this)), x(t, "data", this.ondata.bind(this)), x(t, "error", this.onerror.bind(this)), x(t, "close", this.onclose.bind(this)), x(this.decoder, "decoded", this.ondecoded.bind(this)))
    }
    ,
    b.onping = function() {
        this.emitReserved("ping")
    }
    ,
    b.ondata = function(t) {
        try {
            this.decoder.add(t)
        } catch (t) {
            this.onclose("parse error", t)
        }
    }
    ,
    b.ondecoded = function(t) {
        var e = this;
        y(function() {
            e.emitReserved("packet", t)
        }, this.setTimeoutFn)
    }
    ,
    b.onerror = function(t) {
        this.emitReserved("error", t)
    }
    ,
    b.socket = function(t, e) {
        var n = this.nsps[t];
        return n ? this.et && !n.active && n.connect() : (n = new Gt(this,t,e),
        this.nsps[t] = n),
        n
    }
    ,
    b.wt = function(t) {
        for (var e = 0, n = Object.keys(this.nsps); e < n.length; e++) {
            var r = n[e];
            if (this.nsps[r].active)
                return
        }
        this.St()
    }
    ,
    b.ct = function(t) {
        for (var e = this.encoder.encode(t), n = 0; n < e.length; n++)
            this.engine.write(e[n], t.options)
    }
    ,
    b.cleanup = function() {
        this.subs.forEach(function(t) {
            return t()
        }),
        this.subs.length = 0,
        this.decoder.destroy()
    }
    ,
    b.St = function() {
        this.skipReconnect = !0,
        this.ot = !1,
        this.onclose("forced close")
    }
    ,
    b.disconnect = function() {
        return this.St()
    }
    ,
    b.onclose = function(t, e) {
        var n;
        this.cleanup(),
        null != (n = this.engine) && n.close(),
        this.backoff.reset(),
        this.st = "closed",
        this.emitReserved("close", t, e),
        this.kt && !this.skipReconnect && this.reconnect()
    }
    ,
    b.reconnect = function() {
        var e = this;
        if (this.ot || this.skipReconnect)
            return this;
        var t, n, r = this;
        this.backoff.attempts >= this.At ? (this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        this.ot = !1) : (t = this.backoff.duration(),
        this.ot = !0,
        n = this.setTimeoutFn(function() {
            r.skipReconnect || (e.emitReserved("reconnect_attempt", r.backoff.attempts),
            r.skipReconnect) || r.open(function(t) {
                t ? (r.ot = !1,
                r.reconnect(),
                e.emitReserved("reconnect_error", t)) : r.onreconnect()
            })
        }, t),
        this.opts.autoUnref && n.unref(),
        this.subs.push(function() {
            e.clearTimeoutFn(n)
        }))
    }
    ,
    b.onreconnect = function() {
        var t = this.backoff.attempts;
        this.ot = !1,
        this.backoff.reset(),
        this.emitReserved("reconnect", t)
    }
    ;
    var te, ee = ne, P = {};
    function ne(t, e) {
        (n = te.call(this) || this).nsps = {},
        n.subs = [],
        t && "object" === h(t) && (e = t,
        t = void 0),
        (e = e || {}).path = e.path || "/socket.io",
        n.opts = e,
        g(n, e),
        n.reconnection(!1 !== e.reconnection),
        n.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
        n.reconnectionDelay(e.reconnectionDelay || 1e3),
        n.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
        n.randomizationFactor(null != (r = e.randomizationFactor) ? r : .5),
        n.backoff = new q({
            min: n.reconnectionDelay(),
            max: n.reconnectionDelayMax(),
            jitter: n.randomizationFactor()
        }),
        n.timeout(null == e.timeout ? 2e4 : e.timeout),
        n.st = "closed",
        n.uri = t;
        var n, r = e.parser || zt;
        return n.encoder = new r.Encoder,
        n.decoder = new r.Decoder,
        n.et = !1 !== e.autoConnect,
        n.et && n.open(),
        n
    }
    function _(t, e) {
        "object" === h(t) && (e = t,
        t = void 0);
        var t = function(t, e, n) {
            var e = 1 < arguments.length && void 0 !== e ? e : ""
              , r = t
              , n = (2 < arguments.length ? n : void 0) || "undefined" != typeof location && location
              , t = ("string" == typeof (t = null == t ? n.protocol + "//" + n.host : t) && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t),
            r = Nt(t = /^(https?|wss?):\/\//.test(t) ? t : n.protocol + "//" + t)),
            r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
            r.path = r.path || "/",
            -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host);
            return r.id = r.protocol + "://" + t + ":" + r.port + e,
            r.href = r.protocol + "://" + t + (n && n.port === r.port ? "" : ":" + r.port),
            r
        }(t, (e = e || {}).path || "/socket.io")
          , n = t.source
          , r = t.id
          , i = P[r] && t.path in P[r].nsps
          , i = e.forceNew || e["force new connection"] || !1 === e.multiplex || i ? new ee(n,e) : (P[r] || (P[r] = new ee(n,e)),
        P[r]);
        return t.query && !e.query && (e.query = t.queryKey),
        i.socket(t.path, e)
    }
    return c(_, {
        Manager: ee,
        Socket: Gt,
        io: _,
        connect: _
    }),
    _
});

;(C => {
    C.fn.extend({
        slimScroll: function(y) {
            var x = C.extend({
                width: "auto",
                height: "250px",
                size: "7px",
                color: "#000",
                position: "right",
                distance: "1px",
                start: "top",
                opacity: .4,
                alwaysVisible: !1,
                disableFadeOut: !1,
                railVisible: !1,
                railColor: "#333",
                railOpacity: .2,
                railDraggable: !0,
                railClass: "slimScrollRail",
                barClass: "slimScrollBar",
                wrapperClass: "slimScrollDiv",
                allowPageScroll: !1,
                wheelStep: 20,
                touchScrollStep: 200,
                borderRadius: "7px",
                railBorderRadius: "7px"
            }, y);
            return this.each(function() {
                function e(e) {
                    var t;
                    o && (t = 0,
                    (e = e || window.event).wheelDelta && (t = -e.wheelDelta / 120),
                    e.detail && (t = e.detail / 3),
                    C(e.target || e.srcTarget || e.srcElement).closest("." + x.wrapperClass).is(f.parent()) && s(t, !0),
                    e.preventDefault && !g && e.preventDefault(),
                    g || (e.returnValue = !1))
                }
                function s(e, t, i) {
                    g = !1;
                    var s = e
                      , o = f.outerHeight() - w.outerHeight();
                    t && (s = parseInt(w.css("top")) + e * parseInt(x.wheelStep) / 100 * w.outerHeight(),
                    s = Math.min(Math.max(s, 0), o),
                    s = 0 < e ? Math.ceil(s) : Math.floor(s),
                    w.css({
                        top: s + "px"
                    })),
                    s = (u = parseInt(w.css("top")) / (f.outerHeight() - w.outerHeight())) * (f[0].scrollHeight - f.outerHeight()),
                    i && (e = (s = e) / f[0].scrollHeight * f.outerHeight(),
                    e = Math.min(Math.max(e, 0), o),
                    w.css({
                        top: e + "px"
                    })),
                    f.scrollTop(s),
                    f.trigger("slimscrolling", ~~s),
                    a(),
                    r()
                }
                function i() {
                    d = Math.max(f.outerHeight() / f[0].scrollHeight * f.outerHeight(), 30),
                    w.css({
                        height: d + "px"
                    });
                    var e = d == f.outerHeight() ? "none" : "block";
                    w.css({
                        display: e
                    })
                }
                function a() {
                    i(),
                    clearTimeout(c),
                    u == ~~u ? (g = x.allowPageScroll,
                    p != u && f.trigger("slimscroll", 0 == ~~u ? "top" : "bottom")) : g = !1,
                    p = u,
                    d >= f.outerHeight() ? g = !0 : (w.stop(!0, !0).fadeIn("fast"),
                    x.railVisible && m.stop(!0, !0).fadeIn("fast"))
                }
                function r() {
                    x.alwaysVisible || (c = setTimeout(function() {
                        x.disableFadeOut && o || l || n || (w.fadeOut("slow"),
                        m.fadeOut("slow"))
                    }, 1e3))
                }
                var o, l, n, c, h, d, u, p, g = !1, f = C(this);
                if (f.parent().hasClass(x.wrapperClass)) {
                    var b, v = f.scrollTop(), w = f.closest("." + x.barClass), m = f.closest("." + x.railClass);
                    if (i(),
                    C.isPlainObject(y)) {
                        if ("height"in y && "auto" == y.height && (f.parent().css("height", "auto"),
                        f.css("height", "auto"),
                        b = f.parent().parent().height(),
                        f.parent().css("height", b),
                        f.css("height", b)),
                        "scrollTo"in y)
                            v = parseInt(x.scrollTo);
                        else if ("scrollBy"in y)
                            v += parseInt(x.scrollBy);
                        else if ("destroy"in y)
                            return w.remove(),
                            m.remove(),
                            void f.unwrap();
                        s(v, !1, !0)
                    }
                } else
                    C.isPlainObject(y) && "destroy"in y || (x.height = "auto" == x.height ? f.parent().height() : x.height,
                    v = C("<div></div>").addClass(x.wrapperClass).css({
                        position: "relative",
                        overflow: "hidden",
                        width: x.width,
                        height: x.height
                    }),
                    f.css({
                        overflow: "hidden",
                        width: x.width,
                        height: x.height
                    }),
                    m = C("<div></div>").addClass(x.railClass).css({
                        width: x.size,
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        display: x.alwaysVisible && x.railVisible ? "block" : "none",
                        "border-radius": x.railBorderRadius,
                        background: x.railColor,
                        opacity: x.railOpacity,
                        zIndex: 90
                    }),
                    w = C("<div></div>").addClass(x.barClass).css({
                        background: x.color,
                        width: x.size,
                        position: "absolute",
                        top: 0,
                        opacity: x.opacity,
                        display: x.alwaysVisible ? "block" : "none",
                        "border-radius": x.borderRadius,
                        BorderRadius: x.borderRadius,
                        MozBorderRadius: x.borderRadius,
                        WebkitBorderRadius: x.borderRadius,
                        zIndex: 99
                    }),
                    b = "right" == x.position ? {
                        right: x.distance
                    } : {
                        left: x.distance
                    },
                    m.css(b),
                    w.css(b),
                    f.wrap(v),
                    f.parent().append(w),
                    f.parent().append(m),
                    x.railDraggable && w.bind("mousedown", function(e) {
                        var i = C(document);
                        return n = !0,
                        t = parseFloat(w.css("top")),
                        pageY = e.pageY,
                        i.bind("mousemove.slimscroll", function(e) {
                            currTop = t + e.pageY - pageY,
                            w.css("top", currTop),
                            s(0, w.position().top, !1)
                        }),
                        i.bind("mouseup.slimscroll", function(e) {
                            n = !1,
                            r(),
                            i.unbind(".slimscroll")
                        }),
                        !1
                    }).bind("selectstart.slimscroll", function(e) {
                        return e.stopPropagation(),
                        e.preventDefault(),
                        !1
                    }),
                    m.hover(function() {
                        a()
                    }, function() {
                        r()
                    }),
                    w.hover(function() {
                        l = !0
                    }, function() {
                        l = !1
                    }),
                    f.hover(function() {
                        o = !0,
                        a(),
                        r()
                    }, function() {
                        o = !1,
                        r()
                    }),
                    f.bind("touchstart", function(e, t) {
                        e.originalEvent.touches.length && (h = e.originalEvent.touches[0].pageY)
                    }),
                    f.bind("touchmove", function(e) {
                        g || e.originalEvent.preventDefault(),
                        e.originalEvent.touches.length && (s((h - e.originalEvent.touches[0].pageY) / x.touchScrollStep, !0),
                        h = e.originalEvent.touches[0].pageY)
                    }),
                    i(),
                    "bottom" === x.start ? (w.css({
                        top: f.outerHeight() - w.outerHeight()
                    }),
                    s(0, !0)) : "top" !== x.start && (s(C(x.start).position().top, null, !0),
                    x.alwaysVisible || w.hide()),
                    window.addEventListener ? (this.addEventListener("DOMMouseScroll", e, !1),
                    this.addEventListener("mousewheel", e, !1)) : document.attachEvent("onmousewheel", e))
            }),
            this
        }
    }),
    C.fn.extend({
        slimscroll: C.fn.slimScroll
    })
}
)(jQuery);

;(t => {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? t(require("jquery")) : t(jQuery)
}
)(function(Zt) {
    Zt.Zebra_DatePicker = function(t, q) {
        function e(t) {
            for (var e, s, a, n = {
                days: ["d", "j", "D"],
                months: ["F", "m", "M", "n", "t"],
                years: ["o", "Y", "y"],
                hours: ["G", "g", "H", "h"],
                minutes: ["i"],
                seconds: ["s"],
                ampm: ["A", "a"]
            }, i = null, r = !1, o = 0; o < 3; o++)
                E += Math.floor(65536 * (1 + Math.random())).toString(16);
            if (k = [],
            nt = [],
            !t)
                for (e in Q.settings = Zt.extend({}, _t, Zt.fn.Zebra_DatePicker.defaults, q),
                B.readonly = J.attr("readonly"),
                B.style = J.attr("style"),
                B.padding_left = parseInt(J.css("paddingLeft"), 10) || 0,
                B.padding_right = parseInt(J.css("paddingRight"), 10) || 0,
                J.data())
                    0 === e.indexOf("zdp_") && (e = e.replace(/^zdp\_/, ""),
                    void 0 !== _t[e]) && (Q.settings[e] = "pair" === e ? Zt(J.data("zdp_" + e)) : J.data("zdp_" + e));
            for (Q.settings.readonly_element ? J.attr("readonly", "readonly") : J.removeAttr("readonly"),
            O = !1,
            R = []; !r; ) {
                for (i in n)
                    Zt.each(n[i], function(t, e) {
                        var s, n;
                        if (-1 < Q.settings.format.indexOf(e))
                            if ("days" === i)
                                R.push("days");
                            else if ("months" === i)
                                R.push("months");
                            else if ("years" === i)
                                R.push("years");
                            else if (("hours" === i || "minutes" === i || "seconds" === i || "ampm" === i) && !Q.settings.disable_time_picker)
                                if (O || (O = {
                                    is12hour: !1
                                },
                                R.push("time")),
                                "hours" === i)
                                    for ("g" === (O.hour_format = e) || "h" === e ? (n = 12,
                                    O.is12hour = !0) : n = 24,
                                    O.hours = [],
                                    Zt.isArray(Q.settings.enabled_hours) && (Q.settings.enabled_hour = Q.settings.enabled_hours.map(function(t) {
                                        return parseInt(t, 10)
                                    })),
                                    s = 12 === n ? 1 : 0; s < (12 === n ? 13 : n); s++)
                                        (!Zt.isArray(Q.settings.enabled_hours) || -1 < Zt.inArray(s, Q.settings.enabled_hours)) && O.hours.push(s);
                                else if ("minutes" === i)
                                    for (O.minutes = [],
                                    Zt.isArray(Q.settings.enabled_minutes) && (Q.settings.enabled_minutes = Q.settings.enabled_minutes.map(function(t) {
                                        return parseInt(t, 10)
                                    })),
                                    s = 0; s < 60; s++)
                                        (!Zt.isArray(Q.settings.enabled_minutes) || -1 < Zt.inArray(s, Q.settings.enabled_minutes)) && O.minutes.push(s);
                                else if ("seconds" === i)
                                    for (O.seconds = [],
                                    Zt.isArray(Q.settings.enabled_seconds) && (Q.settings.enabled_seconds = Q.settings.enabled_seconds.map(function(t) {
                                        return parseInt(t, 10)
                                    })),
                                    s = 0; s < 60; s++)
                                        (!Zt.isArray(Q.settings.enabled_seconds) || -1 < Zt.inArray(s, Q.settings.enabled_seconds)) && O.seconds.push(s);
                                else
                                    O.ampm_case = e,
                                    Zt.isArray(Q.settings.enabled_ampm) && Zt.grep(Q.settings.enabled_ampm, function(t) {
                                        return -1 < Zt.inArray(t.toLowerCase(), ["am", "pm"])
                                    }).length ? O.ampm = Q.settings.enabled_ampm : O.ampm = ["am", "pm"]
                    });
                O.hour_format && O.ampm && !1 === O.is12hour ? Q.settings.format = Q.settings.format.replace(O.hour_format, O.hour_format.toLowerCase()) : r = !0
            }
            for (o in 0 === R.length && (R = ["years", "months", "days"]),
            -1 === Zt.inArray(Q.settings.view, R) && (Q.settings.view = R[R.length - 1]),
            f = [],
            Q.settings.custom_classes)
                Q.settings.custom_classes.hasOwnProperty(o) && -1 === f.indexOf(o) && f.push(o);
            for (a = 0; a < 2 + f.length; a++)
                s = 0 === a ? Q.settings.disabled_dates : 1 === a ? Q.settings.enabled_dates : Q.settings.custom_classes[f[a - 2]],
                Zt.isArray(s) && 0 < s.length && Zt.each(s, function() {
                    for (var t, e, s, n = this.split(" "), i = 0; i < 4; i++) {
                        for (n[i] || (n[i] = "*"),
                        n[i] = -1 < n[i].indexOf(",") ? n[i].split(",") : new Array(n[i]),
                        t = 0; t < n[i].length; t++)
                            if (-1 < n[i][t].indexOf("-") && null !== (s = n[i][t].match(/^([0-9]+)\-([0-9]+)/))) {
                                for (e = $(s[1]); e <= $(s[2]); e++)
                                    -1 === Zt.inArray(e, n[i]) && n[i].push(e + "");
                                n[i].splice(t, 1)
                            }
                        for (t = 0; t < n[i].length; t++)
                            n[i][t] = isNaN($(n[i][t])) ? n[i][t] : $(n[i][t])
                    }
                    (0 === a ? k : 1 === a ? nt : (void 0 === ht[f[a - 2]] && (ht[f[a - 2]] = []),
                    ht[f[a - 2]])).push(n)
                });
            var d = !1 !== Q.settings.current_date ? new Date(Q.settings.current_date) : new Date
              , c = Q.settings.reference_date || (J.data("zdp_reference_date") && void 0 !== J.data("zdp_reference_date") ? J.data("zdp_reference_date") : d);
            if (D = N = void 0,
            C = c.getMonth(),
            tt = d.getMonth(),
            M = c.getFullYear(),
            et = d.getFullYear(),
            A = c.getDate(),
            K = d.getDate(),
            !0 === Q.settings.direction)
                N = c;
            else if (!1 === Q.settings.direction)
                rt = (D = c).getMonth(),
                ot = D.getFullYear(),
                at = D.getDate();
            else if (!Zt.isArray(Q.settings.direction) && Dt(Q.settings.direction) && 0 < $(Q.settings.direction) || Zt.isArray(Q.settings.direction) && ((_ = ft(Q.settings.direction[0])) || !0 === Q.settings.direction[0] || Dt(Q.settings.direction[0]) && 0 < Q.settings.direction[0]) && ((p = ft(Q.settings.direction[1])) || !1 === Q.settings.direction[1] || Dt(Q.settings.direction[1]) && 0 <= Q.settings.direction[1]))
                N = _ || new Date(M,C,A + (Zt.isArray(Q.settings.direction) ? $(!0 === Q.settings.direction[0] ? 0 : Q.settings.direction[0]) : $(Q.settings.direction))),
                C = N.getMonth(),
                M = N.getFullYear(),
                A = N.getDate(),
                p && +N <= +p ? D = p : !p && !1 !== Q.settings.direction[1] && Zt.isArray(Q.settings.direction) && (D = new Date(M,C,A + $(Q.settings.direction[1]))),
                D && (rt = D.getMonth(),
                ot = D.getFullYear(),
                at = D.getDate());
            else if (!Zt.isArray(Q.settings.direction) && Dt(Q.settings.direction) && $(Q.settings.direction) < 0 || Zt.isArray(Q.settings.direction) && (!1 === Q.settings.direction[0] || Dt(Q.settings.direction[0]) && Q.settings.direction[0] < 0) && ((_ = ft(Q.settings.direction[1])) || Dt(Q.settings.direction[1]) && 0 <= Q.settings.direction[1]))
                D = new Date(M,C,A + (Zt.isArray(Q.settings.direction) ? $(!1 === Q.settings.direction[0] ? 0 : Q.settings.direction[0]) : $(Q.settings.direction))),
                rt = D.getMonth(),
                ot = D.getFullYear(),
                at = D.getDate(),
                _ && +_ < +D ? N = _ : !_ && Zt.isArray(Q.settings.direction) && (N = new Date(ot,rt,at - $(Q.settings.direction[1]))),
                N && (C = N.getMonth(),
                M = N.getFullYear(),
                A = N.getDate());
            else if (Zt.isArray(Q.settings.disabled_dates) && 0 < Q.settings.disabled_dates.length)
                for (var l in k)
                    if (-1 < Zt.inArray("*", k[l][0]) && -1 < Zt.inArray("*", k[l][1]) && -1 < Zt.inArray("*", k[l][2]) && -1 < Zt.inArray("*", k[l][3])) {
                        var g = [];
                        Zt.each(nt, function() {
                            var t = this;
                            "*" !== t[2][0] && g.push(parseInt(t[2][0] + ("*" === t[1][0] ? "12" : V(t[1][0], 2)) + ("*" === t[0][0] ? "*" === t[1][0] ? "31" : new Date(t[2][0],t[1][0],0).getDate() : V(t[0][0], 2)), 10))
                        }),
                        g.sort(),
                        0 < g.length && (l = (g[0] + "").match(/([0-9]{4})([0-9]{2})([0-9]{2})/),
                        M = parseInt(l[1], 10),
                        C = parseInt(l[2], 10) - 1,
                        A = parseInt(l[3], 10));
                        break
                    }
            if (G(M, C, A)) {
                for (; G(M); )
                    C = N ? (M++,
                    0) : (M--,
                    11),
                    A = 1;
                for (; G(M, C); )
                    A = N ? (C++,
                    1) : (C--,
                    new Date(M,C + 1,0).getDate()),
                    11 < C ? (M++,
                    C = 0,
                    A = 1) : C < 0 && (M--,
                    C = 11,
                    A = new Date(M,C + 1,0).getDate());
                for (; G(M, C, A); )
                    N ? A++ : A--,
                    d = new Date(M,C,A),
                    M = d.getFullYear(),
                    C = d.getMonth(),
                    A = d.getDate();
                d = new Date(M,C,A),
                M = d.getFullYear(),
                C = d.getMonth(),
                A = d.getDate()
            }
            Q.settings.start_date && "object" == typeof Q.settings.start_date && Q.settings.start_date instanceof Date && (Q.settings.start_date = vt(Q.settings.start_date));
            var _, h, p, c = ft(J.val() || Q.settings.start_date || "");
            if (c && Q.settings.strict && G(c.getFullYear(), c.getMonth(), c.getDate()) && J.val(""),
            t || void 0 === N && void 0 === c || Pt(void 0 !== c ? c : N),
            Q.settings.always_visible instanceof jQuery || (t || ((X = Q.settings.show_icon ? ("firefox" === Ft.name && J.is('input[type="text"]') && "inline" === J.css("display") && J.css("display", "inline-block"),
            p = parseInt(J.css("marginTop"), 10) || 0,
            _ = parseInt(J.css("marginRight"), 10) || 0,
            c = parseInt(J.css("marginBottom"), 10) || 0,
            h = parseInt(J.css("marginLeft"), 10) || 0,
            p = Zt('<span class="Zebra_DatePicker_Icon_Wrapper"></span>').css({
                display: J.css("display"),
                position: "static" === J.css("position") ? "relative" : J.css("position"),
                float: J.css("float"),
                top: J.css("top"),
                right: J.css("right"),
                bottom: J.css("bottom"),
                left: J.css("left"),
                marginTop: p < 0 ? p : 0,
                marginRight: _ < 0 ? _ : 0,
                marginBottom: c < 0 ? c : 0,
                marginLeft: h < 0 ? h : 0,
                paddingTop: p,
                paddingRight: _,
                paddingBottom: c,
                paddingLeft: h
            }),
            "block" === J.css("display") && p.css("width", J.outerWidth(!0)),
            J.wrap(p).css({
                position: "relative",
                float: "none",
                top: "auto",
                right: "auto",
                bottom: "auto",
                left: "auto",
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0
            }),
            F = Zt('<button type="button" class="Zebra_DatePicker_Icon' + ("disabled" === J.attr("disabled") ? " Zebra_DatePicker_Icon_Disabled" : "") + '">Pick a date</button>'),
            Q.icon = F,
            Q.settings.open_icon_only ? F : F.add(J)) : J).on("click.Zebra_DatePicker_" + E + (Q.settings.open_on_focus ? " focus.Zebra_DatePicker_" + E : ""), function() {
                b.hasClass("dp_hidden") && !J.attr("disabled") && (!ut || Q.settings.readonly_element ? Q.show() : (clearTimeout(gt),
                gt = setTimeout(function() {
                    Q.show()
                }, 600)))
            }),
            X.on("keydown.Zebra_DatePicker_" + E, function(t) {
                9 !== t.keyCode || b.hasClass("dp_hidden") || Q.hide()
            }),
            !Q.settings.readonly_element && Q.settings.pair && J.on("blur.Zebra_DatePicker_" + E, function() {
                var t;
                (t = ft(Zt(this).val())) && !G(t.getFullYear(), t.getMonth(), t.getDate()) && Pt(t)
            }),
            void 0 !== F && F.insertAfter(J)),
            void 0 !== F && (F.attr("style", ""),
            _ = J.outerWidth(),
            c = J.outerHeight(),
            h = F.outerWidth(),
            p = F.outerHeight(),
            F.css("top", (c - p) / 2),
            Q.settings.inside ? "right" === Q.settings.icon_position ? (F.css("right", !1 !== Q.settings.icon_margin ? Q.settings.icon_margin : B.padding_right),
            J.css("paddingRight", 2 * (!1 !== Q.settings.icon_margin ? Q.settings.icon_margin : B.padding_right) + h)) : (F.css("left", !1 !== Q.settings.icon_margin ? Q.settings.icon_margin : B.padding_left),
            J.css("paddingLeft", 2 * (!1 !== Q.settings.icon_margin ? Q.settings.icon_margin : B.padding_left) + h)) : F.css("left", _ + (!1 !== Q.settings.icon_margin ? Q.settings.icon_margin : B.padding_left)),
            F.removeClass("Zebra_DatePicker_Icon_Disabled"),
            "disabled" === J.attr("disabled")) && F.addClass("Zebra_DatePicker_Icon_Disabled")),
            lt = !1 !== Q.settings.show_select_today && -1 < Zt.inArray("days", R) && !G(et, tt, K) && Q.settings.show_select_today,
            t)
                return Zt(".dp_previous", b).html(Q.settings.navigation[0]),
                Zt(".dp_next", b).html(Q.settings.navigation[1]),
                Zt(".dp_time_controls_increase .dp_time_control", b).html(Q.settings.navigation[2]),
                Zt(".dp_time_controls_decrease .dp_time_control", b).html(Q.settings.navigation[3]),
                Zt(".dp_clear", b).html(Q.settings.lang_clear_date),
                Zt(".dp_today", b).html(Q.settings.show_select_today),
                b.is(":visible") && (o = Q.settings.view,
                Q.settings.view = T,
                Q.show(!1),
                Q.settings.view = o),
                b.parent() !== Q.settings.container && Q.settings.container.append(b.detach());
            Zt(window).on("resize.Zebra_DatePicker_" + E + ", orientationchange.Zebra_DatePicker_" + E, function() {
                Q.hide()
            });
            c = '<div class="Zebra_DatePicker"><table class="dp_header dp_actions"><tr><td class="dp_previous">' + Q.settings.navigation[0] + (mt ? "&#xFE0E;" : "") + '</td><td class="dp_caption"></td><td class="dp_next">' + Q.settings.navigation[1] + (mt ? "&#xFE0E;" : "") + '</td></tr></table><table class="dp_daypicker' + (Q.settings.show_week_number ? " dp_week_numbers" : "") + ' dp_body"></table><table class="dp_monthpicker dp_body"></table><table class="dp_yearpicker dp_body"></table><table class="dp_timepicker dp_body"></table><table class="dp_footer dp_actions"><tr><td class="dp_today">' + lt + '</td><td class="dp_clear">' + Q.settings.lang_clear_date + '</td><td class="dp_view_toggler dp_icon">&nbsp;&nbsp;&nbsp;&nbsp;</td><td class="dp_confirm dp_icon"></td></tr></table></div>';
            b = Zt(c),
            P = Zt("table.dp_header", b),
            y = Zt("table.dp_daypicker", b),
            Z = Zt("table.dp_monthpicker", b),
            L = Zt("table.dp_yearpicker", b),
            H = Zt("table.dp_timepicker", b),
            it = Zt("table.dp_footer", b),
            z = Zt("td.dp_today", it),
            u = Zt("td.dp_clear", it),
            Y = Zt("td.dp_view_toggler", it),
            m = Zt("td.dp_confirm", it),
            Q.settings.always_visible instanceof jQuery ? J.attr("disabled") || (Q.settings.always_visible.append(b),
            Q.show()) : Q.settings.container.append(b),
            b.on("mouseover", "td:not(.dp_disabled)", function() {
                Zt(this).addClass("dp_hover")
            }).on("mouseout", "td:not(.dp_disabled)", function() {
                Zt(this).removeClass("dp_hover")
            }),
            bt(b),
            Zt(Q.settings.rtl ? ".dp_next" : ".dp_previous", P).on("click", function() {
                "months" === T ? j-- : "years" === T ? j -= 12 : --I < 0 && (I = 11,
                j--),
                U()
            }),
            Q.settings.fast_navigation && Zt(".dp_caption", P).on("click", function() {
                T = "days" === T ? -1 < Zt.inArray("months", R) ? "months" : -1 < Zt.inArray("years", R) ? "years" : "days" : "months" === T ? -1 < Zt.inArray("years", R) ? "years" : -1 < Zt.inArray("days", R) ? "days" : "months" : -1 < Zt.inArray("days", R) ? "days" : -1 < Zt.inArray("months", R) ? "months" : "years",
                U()
            }),
            Zt(Q.settings.rtl ? ".dp_previous" : ".dp_next", P).on("click", function() {
                "months" === T ? j++ : "years" === T ? j += 12 : 12 == ++I && (I = 0,
                j++),
                U()
            }),
            y.on("click", "td:not(.dp_disabled)", function() {
                var t;
                Q.settings.select_other_months && Zt(this).attr("class") && null !== (t = Zt(this).attr("class").match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/)) ? Mt(t[1], t[2] - 1, t[3], "days", Zt(this)) : Mt(j, I, $(Zt(this).html()), "days", Zt(this))
            }),
            Z.on("click", "td:not(.dp_disabled)", function() {
                var t = Zt(this).attr("class").match(/dp\_month\_([0-9]+)/);
                I = $(t[1]),
                -1 === Zt.inArray("days", R) ? Mt(j, I, 1, "months", Zt(this)) : (T = "days",
                Q.settings.always_visible && J.val(""),
                U())
            }),
            L.on("click", "td:not(.dp_disabled)", function() {
                j = $(Zt(this).html()),
                -1 === Zt.inArray("months", R) ? Mt(j, 0, 1, "years", Zt(this)) : (T = "months",
                Q.settings.always_visible && J.val(""),
                U())
            }),
            z.on("click", function(t) {
                var e = !1 !== Q.settings.current_date ? new Date(Q.settings.current_date) : new Date;
                t.preventDefault(),
                Mt(e.getFullYear(), e.getMonth(), e.getDate(), "days", Zt(".dp_current", y))
            }),
            u.on("click", function(t) {
                t.preventDefault(),
                J.val(""),
                w = st = v = null,
                Q.settings.always_visible ? Zt("td.dp_selected", b).removeClass("dp_selected") : j = I = null,
                J.focus(),
                Q.hide(),
                Q.settings.onClear && "function" == typeof Q.settings.onClear && Q.settings.onClear.call(J)
            }),
            Y.on("click", function() {
                "time" !== T ? (T = "time",
                U()) : Zt(".dp_caption", P).trigger("click")
            }),
            m.on("click", function() {
                var t;
                Zt(".dp_time_controls_increase td", H).first().trigger("mousedown"),
                clearInterval(W),
                Zt(".dp_time_controls_decrease td", H).first().trigger("mousedown"),
                clearInterval(W),
                Q.settings.onSelect && "function" == typeof Q.settings.onSelect && (t = new Date(j,I,v,O && O.hours ? S + (O.ampm && ("pm" === x && S < 12 || "am" === x && 12 === S) ? 12 : 0) : 0,O && O.minutes ? dt : 0,O && O.seconds ? ct : 0),
                Q.settings.onSelect.call(J, vt(t), j + "-" + V(I + 1, 2) + "-" + V(v, 2) + (O ? " " + V(t.getHours(), 2) + ":" + V(t.getMinutes(), 2) + ":" + V(t.getSeconds(), 2) : ""), t)),
                Q.hide()
            }),
            b.on("mousedown", ".dp_time_controls_increase td, .dp_time_controls_decrease td", function() {
                var t = this
                  , e = 0;
                Ct(t),
                W = setInterval(function() {
                    Ct(t),
                    5 < ++e && (clearInterval(W),
                    W = setInterval(function() {
                        Ct(t),
                        10 < ++e && (clearInterval(W),
                        W = setInterval(function() {
                            Ct(t)
                        }, 100, t))
                    }, 200, t))
                }, 400, t)
            }),
            b.on("mouseup mouseleave", ".dp_time_controls_increase td, .dp_time_controls_decrease td", function() {
                clearInterval(W)
            }),
            Q.settings.always_visible instanceof jQuery || (Zt(document).on("touchmove.Zebra_DatePicker_" + E, function() {
                pt = !0
            }),
            Zt(document).on("mousedown.Zebra_DatePicker_" + E + " touchend.Zebra_DatePicker_" + E, function(t) {
                if ("touchend" === t.type && pt)
                    return pt = !(ut = !0);
                pt = !1,
                b.hasClass("dp_hidden") || (!Q.settings.open_icon_only || !Q.icon || Zt(t.target).get(0) === Q.icon.get(0)) && (Q.settings.open_icon_only || Zt(t.target).get(0) === J.get(0) || Q.icon && Zt(t.target).get(0) === Q.icon.get(0)) || 0 !== Zt(t.target).closest(".Zebra_DatePicker").length || Zt(t.target).hasClass("dp_time_control") || Q.hide(!0)
            }),
            Zt(document).on("keyup.Zebra_DatePicker_" + E, function(t) {
                b.hasClass("dp_hidden") || 27 !== t.which || Q.hide()
            })),
            U()
        }
        function g() {
            var t, e, s, n, i, a, r, o, d, c, l = new Date(j,I + 1,0).getDate(), g = new Date(j,I,1).getDay(), _ = new Date(j,I,0).getDate(), h = (h = g - Q.settings.first_day_of_week) < 0 ? 7 + h : h;
            for (At(Q.settings.header_captions.days),
            e = "<tr>",
            Q.settings.show_week_number && (e += "<th>" + Q.settings.show_week_number + "</th>"),
            t = 0; t < 7; t++)
                s = (Q.settings.first_day_of_week + (Q.settings.rtl ? 6 - t : t)) % 7,
                e += "<th>" + (Zt.isArray(Q.settings.days_abbr) && void 0 !== Q.settings.days_abbr[s] ? Q.settings.days_abbr[s] : Q.settings.days[s].substr(0, 2)) + "</th>";
            for (e += "</tr><tr>",
            t = 0; t < 42; t++)
                c = Q.settings.rtl ? 6 - t % 7 * 2 : 0,
                0 < t && t % 7 == 0 && (e += "</tr><tr>"),
                t % 7 == 0 && Q.settings.show_week_number && (e += "<th>" + kt(new Date(j,I,t - h + 1)) + "</th>"),
                s = t - h + 1 + c,
                Q.settings.select_other_months && (t < h || l < s) && (i = (n = new Date(j,I,s)).getFullYear(),
                a = n.getMonth(),
                r = n.getDate(),
                n = i + V(a + 1, 2) + V(r, 2)),
                d = (Q.settings.first_day_of_week + t) % 7,
                d = -1 < Zt.inArray(d, Q.settings.weekend_days),
                Q.settings.rtl && s < 1 || !Q.settings.rtl && t < h ? e += '<td class="dp_not_in_month ' + (d ? "dp_weekend " : "") + (Q.settings.select_other_months && !G(i, a, r) ? "date_" + n : "dp_disabled") + '">' + (Q.settings.select_other_months || Q.settings.show_other_months ? V(c + _ - h + t + 1, Q.settings.zero_pad ? 2 : 0) : "&nbsp;") + "</td>" : l < s ? e += '<td class="dp_not_in_month ' + (d ? "dp_weekend " : "") + (Q.settings.select_other_months && !G(i, a, r) ? "date_" + n : "dp_disabled") + '">' + (Q.settings.select_other_months || Q.settings.show_other_months ? V(s - l, Q.settings.zero_pad ? 2 : 0) : "&nbsp;") + "</td>" : (c = "",
                o = wt(j, I, s),
                d && (c = " dp_weekend"),
                I === tt && j === et && K === s && (c += " dp_current"),
                "" !== o && (c += " " + o),
                I === st && j === w && v === s && (c += " dp_selected"),
                G(j, I, s) && (c += " dp_disabled"),
                e += "<td" + ("" !== c ? ' class="' + Zt.trim(c) + '"' : "") + ">" + ((Q.settings.zero_pad ? V(s, 2) : s) || "&nbsp;") + "</td>");
            y.html(Zt(e += "</tr>")),
            Q.settings.always_visible && (p = Zt("td:not(.dp_disabled)", y)),
            y.show()
        }
        function c(t) {
            var e;
            "explorer" === Ft.name && 6 === Ft.version && ("hide" === (s || (e = $(b.css("zIndex")) - 1,
            s = Zt("<iframe>", {
                src: 'javascript:document.write("")',
                scrolling: "no",
                frameborder: 0,
                css: {
                    zIndex: e,
                    position: "absolute",
                    top: -1e3,
                    left: -1e3,
                    width: b.outerWidth(),
                    height: b.outerHeight(),
                    filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=0)",
                    display: "none"
                }
            }),
            Zt("body").append(s)),
            t) ? s.hide() : (e = b.offset(),
            s.css({
                top: e.top,
                left: e.left,
                display: "block"
            })))
        }
        var u, X, m, K, tt, et, f, b, y, p, v, st, w, k, nt, D, A, C, M, it, P, F, at, rt, ot, Z, _, S, dt, ct, x, Y, I, j, z, s, lt, N, gt, H, O, L, h, T, R, W, _t = {
            always_visible: !(this.version = "1.9.18"),
            container: Zt("body"),
            current_date: !1,
            custom_classes: !1,
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            days_abbr: !1,
            default_position: "above",
            direction: 0,
            disable_time_picker: !1,
            disabled_dates: !1,
            enabled_ampm: !1,
            enabled_dates: !1,
            enabled_hours: !1,
            enabled_minutes: !1,
            enabled_seconds: !1,
            fast_navigation: !0,
            first_day_of_week: 1,
            format: "Y-m-d",
            header_captions: {
                days: "F, Y",
                months: "Y",
                years: "Y1 - Y2"
            },
            icon_margin: !1,
            icon_position: "right",
            inside: !0,
            lang_clear_date: "Clear date",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            months_abbr: !1,
            navigation: ["&#9664;", "&#9654;", "&#9650;", "&#9660;"],
            offset: [5, -5],
            open_icon_only: !1,
            open_on_focus: !1,
            pair: !1,
            readonly_element: !0,
            rtl: !1,
            select_other_months: !1,
            show_clear_date: 0,
            show_icon: !0,
            show_other_months: !0,
            show_select_today: "Today",
            show_week_number: !1,
            start_date: !1,
            strict: !1,
            view: "days",
            weekend_days: [0, 6],
            zero_pad: !1,
            onChange: null,
            onClear: null,
            onOpen: null,
            onClose: null,
            onSelect: null
        }, ht = {}, B = {}, pt = !1, E = "", ut = !1, mt = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform), Q = this, J = Zt(t), ft = function(t) {
            if ("" !== Zt.trim(t += "")) {
                for (var e, s, n = yt(Q.settings.format), i = ["d", "D", "j", "l", "N", "S", "w", "F", "m", "M", "n", "Y", "y", "G", "g", "H", "h", "i", "s", "a", "A"], a = [], r = [], o = null, d = 0; d < i.length; d++)
                    -1 < (s = n.indexOf(i[d])) && a.push({
                        character: i[d],
                        position: s
                    });
                if (a.sort(function(t, e) {
                    return t.position - e.position
                }),
                Zt.each(a, function(t, e) {
                    switch (e.character) {
                    case "d":
                        r.push("0[1-9]|[12][0-9]|3[01]");
                        break;
                    case "D":
                        r.push(Q.settings.days_abbr ? Q.settings.days_abbr.map(function(t) {
                            return yt(t)
                        }).join("|") : "[a-zÀ-ɏ]{3}");
                        break;
                    case "j":
                        r.push("[1-9]|[12][0-9]|3[01]");
                        break;
                    case "l":
                        r.push(Q.settings.days ? Q.settings.days.map(function(t) {
                            return yt(t)
                        }).join("|") : "[a-zÀ-ɏ]+");
                        break;
                    case "N":
                        r.push("[1-7]");
                        break;
                    case "S":
                        r.push("st|nd|rd|th");
                        break;
                    case "w":
                        r.push("[0-6]");
                        break;
                    case "F":
                        r.push(Q.settings.months ? Q.settings.months.map(function(t) {
                            return yt(t)
                        }).join("|") : "[a-zÀ-ɏ]+");
                        break;
                    case "m":
                        r.push("0[1-9]|1[012]");
                        break;
                    case "M":
                        r.push(Q.settings.months_abbr ? Q.settings.months_abbr.map(function(t) {
                            return yt(t)
                        }).join("|") : "[a-zÀ-ɏ]{3}");
                        break;
                    case "n":
                        r.push("[1-9]|1[012]");
                        break;
                    case "Y":
                        r.push("[0-9]{4}");
                        break;
                    case "y":
                        r.push("[0-9]{2}");
                        break;
                    case "G":
                        r.push("[1-9]|1[0-9]|2[0123]");
                        break;
                    case "g":
                        r.push("[0-9]|1[012]");
                        break;
                    case "H":
                        r.push("0[0-9]|1[0-9]|2[0123]");
                        break;
                    case "h":
                        r.push("0[0-9]|1[012]");
                        break;
                    case "i":
                    case "s":
                        r.push("0[0-9]|[12345][0-9]");
                        break;
                    case "a":
                        r.push("am|pm");
                        break;
                    case "A":
                        r.push("AM|PM")
                    }
                }),
                r.length && (a.reverse(),
                Zt.each(a, function(t, e) {
                    n = n.replace(e.character, "(" + r[r.length - t - 1] + ")")
                }),
                r = new RegExp("^" + n + "$","ig"),
                o = r.exec(t))) {
                    var c, l, t = new Date, g = 1, _ = t.getMonth() + 1, h = t.getFullYear(), p = t.getHours(), u = t.getMinutes(), m = t.getSeconds(), f = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], b = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], y = !0;
                    if (a.reverse(),
                    Zt.each(a, function(s, n) {
                        if (!y)
                            return !0;
                        switch (n.character) {
                        case "m":
                        case "n":
                            _ = $(o[s + 1]);
                            break;
                        case "d":
                        case "j":
                            g = $(o[s + 1]);
                            break;
                        case "D":
                        case "l":
                        case "F":
                        case "M":
                            l = "D" === n.character ? Q.settings.days_abbr || Q.settings.days : "l" === n.character ? Q.settings.days : "M" === n.character && Q.settings.months_abbr || Q.settings.months,
                            y = !1,
                            Zt.each(l, function(t, e) {
                                if (y)
                                    return !0;
                                if (o[s + 1].toLowerCase() === e.substring(0, "D" === n.character && !Q.settings.days_abbr || "M" === n.character && !Q.settings.months_abbr ? 3 : e.length).toLowerCase()) {
                                    switch (n.character) {
                                    case "D":
                                        o[s + 1] = f[t].substring(0, 3);
                                        break;
                                    case "l":
                                        o[s + 1] = f[t];
                                        break;
                                    case "F":
                                        o[s + 1] = b[t],
                                        _ = t + 1;
                                        break;
                                    case "M":
                                        o[s + 1] = b[t].substring(0, 3),
                                        _ = t + 1
                                    }
                                    y = !0
                                }
                            });
                            break;
                        case "Y":
                            h = $(o[s + 1]);
                            break;
                        case "y":
                            h = $("20" + $(o[s + 1]));
                            break;
                        case "G":
                        case "H":
                        case "g":
                        case "h":
                            p = $(o[s + 1]);
                            break;
                        case "i":
                            u = $(o[s + 1]);
                            break;
                        case "s":
                            m = $(o[s + 1]);
                            break;
                        case "a":
                        case "A":
                            c = o[s + 1].toLowerCase()
                        }
                    }),
                    y && (e = new Date(h,(_ || 1) - 1,g || 1,p + ("pm" === c && 12 !== p ? 12 : "am" === c && 12 === p ? -12 : 0),u,m)).getFullYear() === h && e.getDate() === (g || 1) && e.getMonth() === (_ || 1) - 1)
                        return e
                }
                return !1
            }
        }, bt = function(t) {
            "firefox" === Ft.name ? t.css("MozUserSelect", "none") : "explorer" === Ft.name ? Zt(document).on("selectstart", t, function() {
                return !1
            }) : t.mousedown(function() {
                return !1
            })
        }, yt = function(t) {
            return t.replace(/([-.,*+?^${}()|[\]\/\\])/g, "\\$1")
        }, vt = function(t) {
            for (var e, s = "", n = t.getDate(), i = t.getDay(), a = Q.settings.days[i], r = t.getMonth() + 1, o = Q.settings.months[r - 1], d = t.getFullYear() + "", c = t.getHours(), l = c % 12 == 0 ? 12 : c % 12, g = t.getMinutes(), _ = t.getSeconds(), h = 12 <= c ? "pm" : "am", p = 0; p < Q.settings.format.length; p++)
                switch (e = Q.settings.format.charAt(p)) {
                case "y":
                    d = d.substr(2);
                case "Y":
                    s += d;
                    break;
                case "m":
                    r = V(r, 2);
                case "n":
                    s += r;
                    break;
                case "M":
                    o = Zt.isArray(Q.settings.months_abbr) && void 0 !== Q.settings.months_abbr[r - 1] ? Q.settings.months_abbr[r - 1] : Q.settings.months[r - 1].substr(0, 3);
                case "F":
                    s += o;
                    break;
                case "d":
                    n = V(n, 2);
                case "j":
                    s += n;
                    break;
                case "D":
                    a = Zt.isArray(Q.settings.days_abbr) && void 0 !== Q.settings.days_abbr[i] ? Q.settings.days_abbr[i] : Q.settings.days[i].substr(0, 3);
                case "l":
                    s += a;
                    break;
                case "N":
                    i++;
                case "w":
                    s += i;
                    break;
                case "S":
                    s += n % 10 == 1 && 11 !== n ? "st" : n % 10 == 2 && 12 !== n ? "nd" : n % 10 == 3 && 13 !== n ? "rd" : "th";
                    break;
                case "g":
                    s += l;
                    break;
                case "h":
                    s += V(l, 2);
                    break;
                case "G":
                    s += c;
                    break;
                case "H":
                    s += V(c, 2);
                    break;
                case "i":
                    s += V(g, 2);
                    break;
                case "s":
                    s += V(_, 2);
                    break;
                case "a":
                    s += h;
                    break;
                case "A":
                    s += h.toUpperCase();
                    break;
                default:
                    s += e
                }
            return s
        }, wt = function(s, n, i) {
            var a, t, r;
            for (t in void 0 !== n && (n += 1),
            f)
                if (a = f[t],
                r = !1,
                Zt.isArray(ht[a]) && Zt.each(ht[a], function() {
                    var t, e;
                    return !r && (-1 < Zt.inArray(s, (e = this)[2]) || -1 < Zt.inArray("*", e[2])) && (void 0 !== n && -1 < Zt.inArray(n, e[1]) || -1 < Zt.inArray("*", e[1])) && (void 0 !== i && -1 < Zt.inArray(i, e[0]) || -1 < Zt.inArray("*", e[0])) && (-1 < Zt.inArray("*", e[3]) || (t = new Date(s,n - 1,i).getDay(),
                    -1 < Zt.inArray(t, e[3]))) ? r = a : void 0
                }),
                r)
                    return r;
            return r || ""
        }, kt = function(t) {
            var e, s, n, i, a = t.getFullYear(), r = t.getMonth() + 1, t = t.getDate();
            return (r = (a = r < 3 ? (n = (s = ((e = a - 1) / 4 | 0) - (e / 100 | 0) + (e / 400 | 0)) - (((e - 1) / 4 | 0) - ((e - 1) / 100 | 0) + ((e - 1) / 400 | 0)),
            i = 0,
            t - 1 + 31 * (r - 1)) : (i = 1 + (n = (s = ((e = a) / 4 | 0) - (e / 100 | 0) + (e / 400 | 0)) - (((e - 1) / 4 | 0) - ((e - 1) / 100 | 0) + ((e - 1) / 400 | 0))),
            t + ((153 * (r - 3) + 2) / 5 | 0) + 58 + n)) + 3 - (a + (t = (e + s) % 7) - i) % 7) < 0 ? 53 - ((t - n) / 5 | 0) : 364 + n < r ? 1 : 1 + (r / 7 | 0)
        }, G = function(s, n, i) {
            var t, e, a, r;
            if (!(void 0 !== s && !isNaN(s) || void 0 !== n && !isNaN(n) || void 0 !== i && !isNaN(i)))
                return !1;
            if (s < 1e3)
                return !0;
            if (Zt.isArray(Q.settings.direction) || 0 !== $(Q.settings.direction)) {
                if (8 === (e = ((t = $(o(s, void 0 !== n ? V(n, 2) : "", void 0 !== i ? V(i, 2) : ""))) + "").length) && (void 0 !== N && t < $(o(M, V(C, 2), V(A, 2))) || void 0 !== D && t > $(o(ot, V(rt, 2), V(at, 2)))))
                    return !0;
                if (6 === e && (void 0 !== N && t < $(o(M, V(C, 2))) || void 0 !== D && t > $(o(ot, V(rt, 2)))))
                    return !0;
                if (4 === e && (void 0 !== N && t < M || void 0 !== D && ot < t))
                    return !0
            }
            return void 0 !== n && (n += 1),
            r = a = !1,
            Zt.isArray(k) && k.length && Zt.each(k, function() {
                var t, e;
                return !a && (-1 < Zt.inArray(s, (e = this)[2]) || -1 < Zt.inArray("*", e[2])) && (void 0 !== n && -1 < Zt.inArray(n, e[1]) || -1 < Zt.inArray("*", e[1])) && (void 0 !== i && -1 < Zt.inArray(i, e[0]) || -1 < Zt.inArray("*", e[0])) && (-1 < Zt.inArray("*", e[3]) || (t = new Date(s,n - 1,i).getDay(),
                -1 < Zt.inArray(t, e[3]))) ? a = !0 : void 0
            }),
            nt && Zt.each(nt, function() {
                if (!r) {
                    var t, e = this;
                    if ((-1 < Zt.inArray(s, e[2]) || -1 < Zt.inArray("*", e[2])) && (r = !0,
                    void 0 !== n))
                        if (r = !0,
                        -1 < Zt.inArray(n, e[1]) || -1 < Zt.inArray("*", e[1])) {
                            if (void 0 !== i) {
                                if (r = !0,
                                -1 < Zt.inArray(i, e[0]) || -1 < Zt.inArray("*", e[0]))
                                    return -1 < Zt.inArray("*", e[3]) || (t = new Date(s,n - 1,i).getDay(),
                                    -1 < Zt.inArray(t, e[3])) ? r = !0 : void (r = !1);
                                r = !1
                            }
                        } else
                            r = !1
                }
            }),
            !(nt && r || !k || !a)
        }, Dt = function(t) {
            return (t + "").match(/^\-?[0-9]+$/)
        }, At = function(t) {
            !isNaN(parseFloat(I)) && isFinite(I) && (t = t.replace(/\bm\b|\bn\b|\bF\b|\bM\b/, function(t) {
                switch (t) {
                case "m":
                    return V(I + 1, 2);
                case "n":
                    return I + 1;
                case "F":
                    return Q.settings.months[I];
                case "M":
                    return Zt.isArray(Q.settings.months_abbr) && void 0 !== Q.settings.months_abbr[I] ? Q.settings.months_abbr[I] : Q.settings.months[I].substr(0, 3);
                default:
                    return t
                }
            })),
            !isNaN(parseFloat(j)) && isFinite(j) && (t = t.replace(/\bY\b/, j).replace(/\by\b/, (j + "").substr(2)).replace(/\bY1\b/i, j - 7).replace(/\bY2\b/i, j + 4)),
            Zt(".dp_caption", P).html(t)
        }, U = function(t) {
            var e, s;
            if ("" === y.text() || "days" === T)
                "" === y.text() ? (Q.settings.always_visible instanceof jQuery || b.css("left", -1e3),
                b.removeClass("hidden"),
                g(),
                s = void 0 !== y[0].getBoundingClientRect && void 0 !== y[0].getBoundingClientRect().height ? y[0].getBoundingClientRect().height : y.outerHeight(!0),
                Z.css("height", s),
                L.css("height", s),
                H.css("height", s + P.outerHeight(!0)),
                b.css("width", b.outerWidth()),
                b.addClass("dp_hidden")) : g(),
                P.show(),
                Z.hide(),
                L.hide(),
                H.hide(),
                Y.hide(),
                m.hide(),
                O && Y.show().removeClass("dp_calendar");
            else if ("months" === T) {
                At(Q.settings.header_captions.months);
                for (var n, i, a = "<tr>", r = 0; r < 12; r++)
                    0 < r && r % 3 == 0 && (a += "</tr><tr>"),
                    n = "dp_month_" + (i = Q.settings.rtl ? 2 + r - r % 3 * 2 : r),
                    G(j, i) ? n += " dp_disabled" : !1 !== st && st === i && j === w ? n += " dp_selected" : tt === i && et === j && (n += " dp_current"),
                    a += '<td class="' + Zt.trim(n) + '">' + (Zt.isArray(Q.settings.months_abbr) && void 0 !== Q.settings.months_abbr[i] ? Q.settings.months_abbr[i] : Q.settings.months[i].substr(0, 3)) + "</td>";
                Z.html(Zt(a += "</tr>")),
                Q.settings.always_visible && (_ = Zt("td:not(.dp_disabled)", Z)),
                Z.show(),
                y.hide(),
                L.hide(),
                H.hide(),
                Y.hide(),
                m.hide()
            } else if ("years" === T) {
                At(Q.settings.header_captions.years);
                for (var o, d, c = "<tr>", l = 0; l < 12; l++)
                    0 < l && l % 3 == 0 && (c += "</tr><tr>"),
                    d = Q.settings.rtl ? 2 + l - l % 3 * 2 : l,
                    o = "",
                    G(j - 7 + d) ? o += " dp_disabled" : w && w === j - 7 + d ? o += " dp_selected" : et === j - 7 + d && (o += " dp_current"),
                    c += "<td" + ("" !== Zt.trim(o) ? ' class="' + Zt.trim(o) + '"' : "") + ">" + (j - 7 + d) + "</td>";
                L.html(Zt(c += "</tr>")),
                Q.settings.always_visible && (h = Zt("td:not(.dp_disabled)", L)),
                L.show(),
                y.hide(),
                Z.hide(),
                H.hide(),
                Y.hide(),
                m.hide()
            } else
                "time" === T && (e = '<tr class="dp_time_controls_increase' + ((s = O.hours && O.minutes && O.seconds && O.ampm) ? " dp_time_controls_condensed" : "") + '">' + (Q.settings.rtl && O.ampm ? '<td class="dp_time_ampm dp_time_control">' + Q.settings.navigation[2] + "</td>" : "") + (O.hours ? '<td class="dp_time_hour dp_time_control">' + Q.settings.navigation[2] + "</td>" : "") + (O.minutes ? '<td class="dp_time_minute dp_time_control">' + Q.settings.navigation[2] + "</td>" : "") + (O.seconds ? '<td class="dp_time_second dp_time_control">' + Q.settings.navigation[2] + "</td>" : "") + (!Q.settings.rtl && O.ampm ? '<td class="dp_time_ampm dp_time_control">' + Q.settings.navigation[2] + "</td>" : "") + "</tr>",
                e += '<tr class="dp_time_segments' + (s ? " dp_time_controls_condensed" : "") + '">',
                Q.settings.rtl && O.ampm && (e += '<td class="dp_time_ampm dp_disabled' + (O.hours || O.minutes || O.seconds ? " dp_time_separator" : "") + '"><div>' + ("A" === O.ampm_case ? x.toUpperCase() : x) + "</div></td>"),
                O.hours && (e += '<td class="dp_time_hours dp_disabled' + (O.minutes || O.seconds || !Q.settings.rtl && O.ampm ? " dp_time_separator" : "") + '"><div>' + ("h" === O.hour_format || "H" === O.hour_format ? V(S, 2) : S) + "</div></td>"),
                O.minutes && (e += '<td class="dp_time_minutes dp_disabled' + (O.seconds || !Q.settings.rtl && O.ampm ? " dp_time_separator" : "") + '"><div>' + V(dt, 2) + "</div></td>"),
                O.seconds && (e += '<td class="dp_time_seconds dp_disabled' + (!Q.settings.rtl && O.ampm ? " dp_time_separator" : "") + '"><div>' + V(ct, 2) + "</div></td>"),
                !Q.settings.rtl && O.ampm && (e += '<td class="dp_time_ampm dp_disabled">' + ("A" === O.ampm_case ? x.toUpperCase() : x) + "</td>"),
                e = e + "</tr>" + ('<tr class="dp_time_controls_decrease' + (s ? " dp_time_controls_condensed" : "") + '">' + (Q.settings.rtl && O.ampm ? '<td class="dp_time_ampm dp_time_control">' + Q.settings.navigation[3] + "</td>" : "") + (O.hours ? '<td class="dp_time_hour dp_time_control">' + Q.settings.navigation[3] + "</td>" : "") + (O.minutes ? '<td class="dp_time_minute dp_time_control">' + Q.settings.navigation[3] + "</td>" : "") + (O.seconds ? '<td class="dp_time_second dp_time_control">' + Q.settings.navigation[3] + "</td>" : "") + (!Q.settings.rtl && O.ampm ? '<td class="dp_time_ampm dp_time_control">' + Q.settings.navigation[3] + "</td>" : "") + "</tr>"),
                H.html(Zt(e)),
                H.show(),
                1 === R.length ? (Y.hide(),
                m.show()) : (Y.show().addClass("dp_calendar"),
                "" === J.val() ? m.hide() : m.show()),
                P.hide(),
                y.hide(),
                Z.hide(),
                L.hide());
            !1 !== t && Q.settings.onChange && "function" == typeof Q.settings.onChange && void 0 !== T && ((s = "days" === T ? y.find("td:not(.dp_disabled)") : "months" === T ? Z.find("td:not(.dp_disabled)") : "years" === T ? L.find("td:not(.dp_disabled)") : H.find(".dp_time_segments td")).each(function() {
                var t;
                "days" === T ? Zt(this).hasClass("dp_not_in_month") && !Zt(this).hasClass("dp_disabled") ? (t = Zt(this).attr("class").match(/date\_([0-9]{4})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/),
                Zt(this).data("date", t[1] + "-" + t[2] + "-" + t[3])) : Zt(this).data("date", j + "-" + V(I + 1, 2) + "-" + V($(Zt(this).text()), 2)) : "months" === T ? (t = Zt(this).attr("class").match(/dp\_month\_([0-9]+)/),
                Zt(this).data("date", j + "-" + V($(t[1]) + 1, 2))) : "years" === T && Zt(this).data("date", $(Zt(this).text()))
            }),
            Q.settings.onChange.call(J, T, s)),
            it.show(),
            "time" === T && 1 < R.length ? (z.hide(),
            u.hide(),
            Y.css("width", "" === J.val() ? "100%" : "50%")) : (z.show(),
            u.show(),
            !0 === Q.settings.show_clear_date || 0 === Q.settings.show_clear_date && "" !== J.val() || Q.settings.always_visible && !1 !== Q.settings.show_clear_date ? lt ? (z.css("width", "50%"),
            u.css("width", "50%")) : (z.hide(),
            u.css("width", -1 < Zt.inArray(R, "time") ? "50%" : "100%")) : (u.hide(),
            lt ? z.css("width", "100%") : (z.hide(),
            O && ("time" === T || "days" === T) || it.hide())))
        }, Ct = function(t) {
            var e = 0 < Zt(t).parent(".dp_time_controls_increase").length
              , t = Zt(t).attr("class").match(/dp\_time\_([^\s]+)/i)
              , s = Zt(".dp_time_segments .dp_time_" + t[1] + ("ampm" !== t[1] ? "s" : ""), H)
              , n = s.text().toLowerCase()
              , i = O[t[1] + ("ampm" !== t[1] ? "s" : "")]
              , n = Zt.inArray("ampm" !== t[1] ? parseInt(n, 10) : n, i)
              , e = -1 === n ? 0 : e ? n + 1 >= i.length ? 0 : n + 1 : n - 1 < 0 ? i.length - 1 : n - 1;
            "hour" === t[1] ? S = i[e] : "minute" === t[1] ? dt = i[e] : "second" === t[1] ? ct = i[e] : x = i[e],
            v = (v = !v && Q.settings.start_date && (n = ft(Q.settings.start_date)) ? n.getDate() : v) || A,
            s.text(V(i[e], 2).toUpperCase()),
            Mt(j, I, v)
        }, Mt = function(t, e, s, n, i) {
            var a = new Date(t,e,s,O && O.hours ? S + (O.ampm ? "pm" === x && 12 !== S ? 12 : "am" === x && 12 === S ? -12 : 0 : 0) : 12,O && O.minutes ? dt : 0,O && O.seconds ? ct : 0)
              , r = "days" === n ? p : "months" === n ? _ : h
              , o = vt(a);
            J.val(o),
            (Q.settings.always_visible || O) && (st = a.getMonth(),
            I = a.getMonth(),
            w = a.getFullYear(),
            j = a.getFullYear(),
            v = a.getDate(),
            i) && r && (r.removeClass("dp_selected"),
            i.addClass("dp_selected"),
            "days" === n) && i.hasClass("dp_not_in_month") && !i.hasClass("dp_disabled") && Q.show(),
            O ? (T = "time",
            U()) : (J.focus(),
            Q.hide()),
            Pt(a),
            !O && Q.settings.onSelect && "function" == typeof Q.settings.onSelect && Q.settings.onSelect.call(J, o, t + "-" + V(e + 1, 2) + "-" + V(s, 2), a)
        }, o = function() {
            for (var t = "", e = 0; e < arguments.length; e++)
                t += arguments[e] + "";
            return t
        }, V = function(t, e) {
            for (t += ""; t.length < e; )
                t = "0" + t;
            return t
        }, $ = function(t) {
            return parseInt(t, 10)
        }, Pt = function(s) {
            Q.settings.pair && Zt.each(Q.settings.pair, function() {
                var t, e = Zt(this);
                e.data && e.data("Zebra_DatePicker") ? ((t = e.data("Zebra_DatePicker")).update({
                    reference_date: s,
                    direction: 0 === t.settings.direction ? 1 : t.settings.direction
                }),
                t.settings.always_visible && t.show()) : e.data("zdp_reference_date", s)
            })
        }, Ft = {
            init: function() {
                this.name = this.searchString(this.dataBrowser) || "",
                this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || ""
            },
            searchString: function(t) {
                for (var e, s, n = 0; n < t.length; n++)
                    if (e = t[n].string,
                    s = t[n].prop,
                    this.versionSearchString = t[n].versionSearch || t[n].identity,
                    e) {
                        if (-1 !== e.indexOf(t[n].subString))
                            return t[n].identity
                    } else if (s)
                        return t[n].identity
            },
            searchVersion: function(t) {
                var e = t.indexOf(this.versionSearchString);
                if (-1 !== e)
                    return parseFloat(t.substring(e + this.versionSearchString.length + 1))
            },
            dataBrowser: [{
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "firefox"
            }, {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "explorer",
                versionSearch: "MSIE"
            }]
        };
        Q.settings = {},
        Q.clear_date = function() {
            Zt(u).trigger("click")
        }
        ,
        Q.destroy = function() {
            void 0 !== Q.icon && (Q.icon.off("click.Zebra_DatePicker_" + E),
            Q.icon.off("focus.Zebra_DatePicker_" + E),
            Q.icon.off("keydown.Zebra_DatePicker_" + E),
            Q.icon.remove()),
            b.off(),
            b.remove(),
            !Q.settings.show_icon || Q.settings.always_visible instanceof jQuery || J.unwrap(),
            J.off("blur.Zebra_DatePicker_" + E),
            J.off("click.Zebra_DatePicker_" + E),
            J.off("focus.Zebra_DatePicker_" + E),
            J.off("keydown.Zebra_DatePicker_" + E),
            J.off("mousedown.Zebra_DatePicker_" + E),
            Zt(document).off("keyup.Zebra_DatePicker_" + E),
            Zt(document).off("mousedown.Zebra_DatePicker_" + E),
            Zt(document).off("touchend.Zebra_DatePicker_" + E),
            Zt(window).off("resize.Zebra_DatePicker_" + E),
            Zt(window).off("orientationchange.Zebra_DatePicker_" + E),
            J.removeData("Zebra_DatePicker"),
            J.attr("readonly", B.readonly),
            J.attr("style", B.style || ""),
            J.css("paddingLeft", B.padding_left),
            J.css("paddingRight", B.padding_right)
        }
        ,
        Q.hide = function(t) {
            b.hasClass("dp_hidden") || Q.settings.always_visible && !t || (c("hide"),
            b.addClass("dp_hidden"),
            Q.settings.onClose && "function" == typeof Q.settings.onClose && Q.settings.onClose.call(J))
        }
        ,
        Q.set_date = function(t) {
            var e;
            "object" == typeof t && t instanceof Date && (t = vt(t)),
            (e = ft(t)) && !G(e.getFullYear(), e.getMonth(), e.getDate()) && (J.val(t),
            Pt(e))
        }
        ,
        Q.show = function(t) {
            T = Q.settings.view;
            var e, s, n, i, a, r, o, d = ft(J.val() || Q.settings.start_date || "");
            d ? (st = d.getMonth(),
            I = d.getMonth(),
            w = d.getFullYear(),
            j = d.getFullYear(),
            v = d.getDate(),
            G(w, st, v) && (Q.settings.strict && J.val(""),
            I = C,
            j = M)) : (I = C,
            j = M),
            O && (d = d || new Date,
            S = d.getHours(),
            dt = d.getMinutes(),
            ct = d.getSeconds(),
            x = 12 <= S ? "pm" : "am",
            O.is12hour && (S = S % 12 == 0 ? 12 : S % 12),
            Zt.isArray(Q.settings.enabled_hours) && -1 === Zt.inArray(S, Q.settings.enabled_hours) && (S = Q.settings.enabled_hours[0]),
            Zt.isArray(Q.settings.enabled_minutes) && -1 === Zt.inArray(dt, Q.settings.enabled_minutes) && (dt = Q.settings.enabled_minutes[0]),
            Zt.isArray(Q.settings.enabled_seconds) && -1 === Zt.inArray(ct, Q.settings.enabled_seconds) && (ct = Q.settings.enabled_seconds[0]),
            Zt.isArray(Q.settings.enabled_ampm)) && -1 === Zt.inArray(x, Q.settings.enabled_ampm) && (x = Q.settings.enabled_ampm[0]),
            U(t),
            Q.settings.always_visible instanceof jQuery ? b.removeClass("dp_hidden") : (Q.settings.container.is("body") ? (d = b.outerWidth(),
            e = b.outerHeight(),
            s = (void 0 !== F ? F.offset().left + F.outerWidth(!0) : J.offset().left + J.outerWidth(!0)) + Q.settings.offset[0],
            n = (void 0 !== F ? F : J).offset().top - e + Q.settings.offset[1],
            i = Zt(window).width(),
            a = Zt(window).height(),
            r = Zt(window).scrollTop(),
            o = Zt(window).scrollLeft(),
            "below" === Q.settings.default_position && (n = (void 0 !== F ? F : J).offset().top + Q.settings.offset[1]),
            b.css({
                left: s = (s = o + i < s + d ? o + i - d : s) < o ? o : s,
                top: n = (n = r + a < n + e ? r + a - e : n) < r ? r : n
            })) : b.css({
                left: 0,
                top: 0
            }),
            b.removeClass("dp_hidden"),
            c()),
            !1 !== t && Q.settings.onOpen && "function" == typeof Q.settings.onOpen && Q.settings.onOpen.call(J)
        }
        ,
        Q.update = function(t) {
            Q.original_direction && (Q.original_direction = Q.direction),
            Q.settings = Zt.extend(Q.settings, t),
            e(!0)
        }
        ,
        Ft.init(),
        e()
    }
    ,
    Zt.fn.Zebra_DatePicker = function(e) {
        return this.each(function() {
            void 0 !== Zt(this).data("Zebra_DatePicker") && Zt(this).data("Zebra_DatePicker").destroy();
            var t = new Zt.Zebra_DatePicker(this,e);
            Zt(this).data("Zebra_DatePicker", t)
        })
    }
    ,
    Zt.fn.Zebra_DatePicker.defaults = {}
});

;var requirejs, require, define;
!function(global, setTimeout) {
    function commentReplace(e, t) {
        return t || ""
    }
    function isFunction(e) {
        return "[object Function]" === ostring.call(e)
    }
    function isArray(e) {
        return "[object Array]" === ostring.call(e)
    }
    function each(e, t) {
        if (e)
            for (var i = 0; i < e.length && (!e[i] || !t(e[i], i, e)); i += 1)
                ;
    }
    function eachReverse(e, t) {
        if (e)
            for (var i = e.length - 1; -1 < i && (!e[i] || !t(e[i], i, e)); --i)
                ;
    }
    function hasProp(e, t) {
        return hasOwn.call(e, t)
    }
    function getOwn(e, t) {
        return hasProp(e, t) && e[t]
    }
    function eachProp(e, t) {
        for (var i in e)
            if (hasProp(e, i) && t(e[i], i))
                break
    }
    function mixin(i, e, r, n) {
        e && eachProp(e, function(e, t) {
            !r && hasProp(i, t) || (!n || "object" != typeof e || !e || isArray(e) || isFunction(e) || e instanceof RegExp ? i[t] = e : (i[t] || (i[t] = {}),
            mixin(i[t], e, r, n)))
        })
    }
    function bind(e, t) {
        return function() {
            return t.apply(e, arguments)
        }
    }
    function scripts() {
        return document.getElementsByTagName("script")
    }
    function defaultOnError(e) {
        throw e
    }
    function getGlobal(e) {
        var t;
        return e && (t = global,
        each(e.split("."), function(e) {
            t = t[e]
        }),
        t)
    }
    function makeError(e, t, i, r) {
        t = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        return t.requireType = e,
        t.requireModules = r,
        i && (t.originalError = i),
        t
    }
    function newContext(u) {
        function f(e, t, i) {
            var r, n, o, a, s, u, c, d, p, f = t && t.split("/"), l = y.map, h = l && l["*"];
            if (e) {
                t = (e = e.split("/")).length - 1,
                y.nodeIdCompat && jsSuffixRegExp.test(e[t]) && (e[t] = e[t].replace(jsSuffixRegExp, ""));
                for (var m = e = "." === e[0].charAt(0) && f ? (t = f.slice(0, f.length - 1)).concat(e) : e, g, x = 0; x < m.length; x++)
                    if ("." === (g = m[x]))
                        m.splice(x, 1),
                        --x;
                    else if (".." === g) {
                        if (0 === x || 1 === x && ".." === m[2] || ".." === m[x - 1])
                            continue;
                        0 < x && (m.splice(x - 1, 2),
                        x -= 2)
                    }
                e = e.join("/")
            }
            if (i && l && (f || h)) {
                e: for (o = (n = e.split("/")).length; 0 < o; --o) {
                    if (s = n.slice(0, o).join("/"),
                    f)
                        for (a = f.length; 0 < a; --a)
                            if (r = (r = getOwn(l, f.slice(0, a).join("/"))) && getOwn(r, s)) {
                                u = r,
                                c = o;
                                break e
                            }
                    !d && h && getOwn(h, s) && (d = getOwn(h, s),
                    p = o)
                }
                !u && d && (u = d,
                c = p),
                u && (n.splice(0, c, u),
                e = n.join("/"))
            }
            return getOwn(y.pkgs, e) || e
        }
        function c(t) {
            isBrowser && each(scripts(), function(e) {
                if (e.getAttribute("data-requiremodule") === t && e.getAttribute("data-requirecontext") === E.contextName)
                    return e.parentNode.removeChild(e),
                    !0
            })
        }
        function d(e) {
            var t = getOwn(y.paths, e);
            return t && isArray(t) && 1 < t.length && (t.shift(),
            E.require.undef(e),
            E.makeRequire(null, {
                skipMap: !0
            })([e]),
            1)
        }
        function l(e) {
            var t, i = e ? e.indexOf("!") : -1;
            return -1 < i && (t = e.substring(0, i),
            e = e.substring(i + 1, e.length)),
            [t, e]
        }
        function p(e, t, i, r) {
            var n, o, a, s = null, u = t ? t.name : null, c = e, d = !0, p = "";
            return e || (d = !1,
            e = "_@r" + (R += 1)),
            s = (a = l(e))[0],
            e = a[1],
            s && (s = f(s, u, r),
            o = getOwn(O, s)),
            e && (s ? p = i ? e : o && o.normalize ? o.normalize(e, function(e) {
                return f(e, u, r)
            }) : -1 === e.indexOf("!") ? f(e, u, r) : e : (s = (a = l(p = f(e, u, r)))[0],
            i = !0,
            n = E.nameToUrl(p = a[1]))),
            {
                prefix: s,
                name: p,
                parentMap: t,
                unnormalized: !!(e = !s || o || i ? "" : "_unnormalized" + (T += 1)),
                url: n,
                originalName: c,
                isDefine: d,
                id: (s ? s + "!" + p : p) + e
            }
        }
        function h(e) {
            var t = e.id;
            return getOwn(S, t) || (S[t] = new E.Module(e))
        }
        function m(e, t, i) {
            var r = e.id
              , n = getOwn(S, r);
            !hasProp(O, r) || n && !n.defineEmitComplete ? (n = h(e)).error && "error" === t ? i(n.error) : n.on(t, i) : "defined" === t && i(O[r])
        }
        function g(t, e) {
            var i = t.requireModules
              , r = !1;
            e ? e(t) : (each(i, function(e) {
                e = getOwn(S, e);
                e && (e.error = t,
                e.events.error) && (r = !0,
                e.emit("error", t))
            }),
            r || req.onError(t))
        }
        function x() {
            globalDefQueue.length && (each(globalDefQueue, function(e) {
                var t = e[0];
                "string" == typeof t && (E.defQueueMap[t] = !0),
                M.push(e)
            }),
            globalDefQueue = [])
        }
        function b(e) {
            delete S[e],
            delete k[e]
        }
        function v() {
            var r, e = 1e3 * y.waitSeconds, n = e && E.startTime + e < (new Date).getTime(), o = [], a = [], s = !1, u = !0;
            if (!i) {
                if (i = !0,
                eachProp(k, function(e) {
                    var t = e.map
                      , i = t.id;
                    if (e.enabled && (t.isDefine || a.push(e),
                    !e.error))
                        if (!e.inited && n)
                            d(i) ? s = r = !0 : (o.push(i),
                            c(i));
                        else if (!e.inited && e.fetched && t.isDefine && (s = !0,
                        !t.prefix))
                            return u = !1
                }),
                n && o.length)
                    return (e = makeError("timeout", "Load timeout for modules: " + o, null, o)).contextName = E.contextName,
                    g(e);
                u && each(a, function(e) {
                    !function r(n, o, a) {
                        var e = n.map.id;
                        n.error ? n.emit("error", n.error) : (o[e] = !0,
                        each(n.depMaps, function(e, t) {
                            var e = e.id
                              , i = getOwn(S, e);
                            !i || n.depMatched[t] || a[e] || (getOwn(o, e) ? (n.defineDep(t, O[e]),
                            n.check()) : r(i, o, a))
                        }),
                        a[e] = !0)
                    }(e, {}, {})
                }),
                n && !r || !s || !isBrowser && !isWebWorker || (w = w || setTimeout(function() {
                    w = 0,
                    v()
                }, 50)),
                i = !1
            }
        }
        function a(e) {
            hasProp(O, e[0]) || h(p(e[0], null, !0)).init(e[1], e[2])
        }
        function t(e, t, i, r) {
            e.detachEvent && !isOpera ? r && e.detachEvent(r, t) : e.removeEventListener(i, t, !1)
        }
        function n(e) {
            e = e.currentTarget || e.srcElement;
            return t(e, E.onScriptLoad, "load", "onreadystatechange"),
            t(e, E.onScriptError, "error"),
            {
                node: e,
                id: e && e.getAttribute("data-requiremodule")
            }
        }
        function q() {
            var e;
            for (x(); M.length; ) {
                if (null === (e = M.shift())[0])
                    return g(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
                a(e)
            }
            E.defQueueMap = {}
        }
        var i, E, w, y = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, S = {}, k = {}, r = {}, M = [], O = {}, j = {}, P = {}, R = 1, T = 1, A = {
            require: function(e) {
                return e.require || (e.require = E.makeRequire(e.map))
            },
            exports: function(e) {
                if (e.usingExports = !0,
                e.map.isDefine)
                    return e.exports ? O[e.map.id] = e.exports : e.exports = O[e.map.id] = {}
            },
            module: function(e) {
                return e.module || (e.module = {
                    id: e.map.id,
                    uri: e.map.url,
                    config: function() {
                        return getOwn(y.config, e.map.id) || {}
                    },
                    exports: e.exports || (e.exports = {})
                })
            }
        }, e = function(e) {
            this.events = getOwn(r, e.id) || {},
            this.map = e,
            this.shim = getOwn(y.shim, e.id),
            this.depExports = [],
            this.depMaps = [],
            this.depMatched = [],
            this.pluginMaps = {},
            this.depCount = 0
        };
        return e.prototype = {
            init: function(e, t, i, r) {
                r = r || {},
                this.inited || (this.factory = t,
                i ? this.on("error", i) : this.events.error && (i = bind(this, function(e) {
                    this.emit("error", e)
                })),
                this.depMaps = e && e.slice(0),
                this.errback = i,
                this.inited = !0,
                this.ignore = r.ignore,
                r.enabled || this.enabled ? this.enable() : this.check())
            },
            defineDep: function(e, t) {
                this.depMatched[e] || (this.depMatched[e] = !0,
                --this.depCount,
                this.depExports[e] = t)
            },
            fetch: function() {
                var e;
                if (!this.fetched)
                    return this.fetched = !0,
                    E.startTime = (new Date).getTime(),
                    e = this.map,
                    this.shim ? void E.makeRequire(this.map, {
                        enableBuildCallback: !0
                    })(this.shim.deps || [], bind(this, function() {
                        return e.prefix ? this.callPlugin() : this.load()
                    })) : e.prefix ? this.callPlugin() : this.load()
            },
            load: function() {
                var e = this.map.url;
                j[e] || (j[e] = !0,
                E.load(this.map.id, e))
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var e, t, i, r = this.map.id, n = this.depExports, o = this.exports, a = this.factory;
                    if (this.inited) {
                        if (this.error)
                            this.emit("error", this.error);
                        else if (!this.defining) {
                            if (this.defining = !0,
                            this.depCount < 1 && !this.defined) {
                                if (isFunction(a)) {
                                    if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)
                                        try {
                                            o = E.execCb(r, a, n, o)
                                        } catch (t) {
                                            e = t
                                        }
                                    else
                                        o = E.execCb(r, a, n, o);
                                    if (this.map.isDefine && void 0 === o && ((t = this.module) ? o = t.exports : this.usingExports && (o = this.exports)),
                                    e)
                                        return e.requireMap = this.map,
                                        e.requireModules = this.map.isDefine ? [this.map.id] : null,
                                        e.requireType = this.map.isDefine ? "define" : "require",
                                        g(this.error = e)
                                } else
                                    o = a;
                                this.exports = o,
                                this.map.isDefine && !this.ignore && (O[r] = o,
                                req.onResourceLoad) && (i = [],
                                each(this.depMaps, function(e) {
                                    i.push(e.normalizedMap || e)
                                }),
                                req.onResourceLoad(E, this.map, i)),
                                b(r),
                                this.defined = !0
                            }
                            this.defining = !1,
                            this.defined && !this.defineEmitted && (this.defineEmitted = !0,
                            this.emit("defined", this.exports),
                            this.defineEmitComplete = !0)
                        }
                    } else
                        hasProp(E.defQueueMap, r) || this.fetch()
                }
            },
            callPlugin: function() {
                var s = this.map
                  , u = s.id
                  , e = p(s.prefix);
                this.depMaps.push(e),
                m(e, "defined", bind(this, function(e) {
                    var o, t, i = getOwn(P, this.map.id), r = this.map.name, n = this.map.parentMap ? this.map.parentMap.name : null, a = E.makeRequire(s.parentMap, {
                        enableBuildCallback: !0
                    });
                    return this.map.unnormalized ? (e.normalize && (r = e.normalize(r, function(e) {
                        return f(e, n, !0)
                    }) || ""),
                    m(t = p(s.prefix + "!" + r, this.map.parentMap, !0), "defined", bind(this, function(e) {
                        this.map.normalizedMap = t,
                        this.init([], function() {
                            return e
                        }, null, {
                            enabled: !0,
                            ignore: !0
                        })
                    })),
                    void ((r = getOwn(S, t.id)) && (this.depMaps.push(t),
                    this.events.error && r.on("error", bind(this, function(e) {
                        this.emit("error", e)
                    })),
                    r.enable()))) : i ? (this.map.url = E.nameToUrl(i),
                    void this.load()) : ((o = bind(this, function(e) {
                        this.init([], function() {
                            return e
                        }, null, {
                            enabled: !0
                        })
                    })).error = bind(this, function(e) {
                        this.inited = !0,
                        (this.error = e).requireModules = [u],
                        eachProp(S, function(e) {
                            0 === e.map.id.indexOf(u + "_unnormalized") && b(e.map.id)
                        }),
                        g(e)
                    }),
                    o.fromText = bind(this, function(e, t) {
                        var i = s.name
                          , r = p(i)
                          , n = useInteractive;
                        t && (e = t),
                        n && (useInteractive = !1),
                        h(r),
                        hasProp(y.config, u) && (y.config[i] = y.config[u]);
                        try {
                            req.exec(e)
                        } catch (e) {
                            return g(makeError("fromtexteval", "fromText eval for " + u + " failed: " + e, e, [u]))
                        }
                        n && (useInteractive = !0),
                        this.depMaps.push(r),
                        E.completeLoad(i),
                        a([i], o)
                    }),
                    void e.load(s.name, a, o, y))
                })),
                E.enable(e, this),
                this.pluginMaps[e.id] = e
            },
            enable: function() {
                (k[this.map.id] = this).enabled = !0,
                this.enabling = !0,
                each(this.depMaps, bind(this, function(e, t) {
                    var i, r;
                    if ("string" == typeof e) {
                        if (e = p(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap),
                        this.depMaps[t] = e,
                        r = getOwn(A, e.id))
                            return void (this.depExports[t] = r(this));
                        this.depCount += 1,
                        m(e, "defined", bind(this, function(e) {
                            this.undefed || (this.defineDep(t, e),
                            this.check())
                        })),
                        this.errback ? m(e, "error", bind(this, this.errback)) : this.events.error && m(e, "error", bind(this, function(e) {
                            this.emit("error", e)
                        }))
                    }
                    r = e.id,
                    i = S[r],
                    hasProp(A, r) || !i || i.enabled || E.enable(e, this)
                })),
                eachProp(this.pluginMaps, bind(this, function(e) {
                    var t = getOwn(S, e.id);
                    t && !t.enabled && E.enable(e, this)
                })),
                this.enabling = !1,
                this.check()
            },
            on: function(e, t) {
                (this.events[e] || (this.events[e] = [])).push(t)
            },
            emit: function(e, t) {
                each(this.events[e], function(e) {
                    e(t)
                }),
                "error" === e && delete this.events[e]
            }
        },
        (E = {
            config: y,
            contextName: u,
            registry: S,
            defined: O,
            urlFetched: j,
            defQueue: M,
            defQueueMap: {},
            Module: e,
            makeModuleMap: p,
            nextTick: req.nextTick,
            onError: g,
            configure: function(e) {
                e.baseUrl && "/" !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += "/"),
                "string" == typeof e.urlArgs && (i = e.urlArgs,
                e.urlArgs = function(e, t) {
                    return (-1 === t.indexOf("?") ? "?" : "&") + i
                }
                );
                var i, r = y.shim, n = {
                    paths: !0,
                    bundles: !0,
                    config: !0,
                    map: !0
                };
                eachProp(e, function(e, t) {
                    n[t] ? (y[t] || (y[t] = {}),
                    mixin(y[t], e, !0, !0)) : y[t] = e
                }),
                e.bundles && eachProp(e.bundles, function(e, t) {
                    each(e, function(e) {
                        e !== t && (P[e] = t)
                    })
                }),
                e.shim && (eachProp(e.shim, function(e, t) {
                    !(e = isArray(e) ? {
                        deps: e
                    } : e).exports && !e.init || e.exportsFn || (e.exportsFn = E.makeShimExports(e)),
                    r[t] = e
                }),
                y.shim = r),
                e.packages && each(e.packages, function(e) {
                    var t = (e = "string" == typeof e ? {
                        name: e
                    } : e).name;
                    e.location && (y.paths[t] = e.location),
                    y.pkgs[t] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                }),
                eachProp(S, function(e, t) {
                    e.inited || e.map.unnormalized || (e.map = p(t, null, !0))
                }),
                (e.deps || e.callback) && E.require(e.deps || [], e.callback)
            },
            makeShimExports: function(t) {
                return function() {
                    var e;
                    return (e = t.init ? t.init.apply(global, arguments) : e) || t.exports && getGlobal(t.exports)
                }
            },
            makeRequire: function(o, a) {
                function s(e, t, i) {
                    var r, n;
                    return a.enableBuildCallback && t && isFunction(t) && (t.__requireJsBuild = !0),
                    "string" == typeof e ? isFunction(t) ? g(makeError("requireargs", "Invalid require call"), i) : o && hasProp(A, e) ? A[e](S[o.id]) : req.get ? req.get(E, e, o, s) : (r = p(e, o, !1, !0).id,
                    hasProp(O, r) ? O[r] : g(makeError("notloaded", 'Module name "' + r + '" has not been loaded yet for context: ' + u + (o ? "" : ". Use require([])")))) : (q(),
                    E.nextTick(function() {
                        q(),
                        (n = h(p(null, o))).skipMap = a.skipMap,
                        n.init(e, t, i, {
                            enabled: !0
                        }),
                        v()
                    }),
                    s)
                }
                return a = a || {},
                mixin(s, {
                    isBrowser: isBrowser,
                    toUrl: function(e) {
                        var t, i = e.lastIndexOf("."), r = e.split("/")[0];
                        return -1 !== i && (!("." === r || ".." === r) || 1 < i) && (t = e.substring(i, e.length),
                        e = e.substring(0, i)),
                        E.nameToUrl(f(e, o && o.id, !0), t, !0)
                    },
                    defined: function(e) {
                        return hasProp(O, p(e, o, !1, !0).id)
                    },
                    specified: function(e) {
                        return e = p(e, o, !1, !0).id,
                        hasProp(O, e) || hasProp(S, e)
                    }
                }),
                o || (s.undef = function(i) {
                    x();
                    var e = p(i, o, !0)
                      , t = getOwn(S, i);
                    t.undefed = !0,
                    c(i),
                    delete O[i],
                    delete j[e.url],
                    delete r[i],
                    eachReverse(M, function(e, t) {
                        e[0] === i && M.splice(t, 1)
                    }),
                    delete E.defQueueMap[i],
                    t && (t.events.defined && (r[i] = t.events),
                    b(i))
                }
                ),
                s
            },
            enable: function(e) {
                getOwn(S, e.id) && h(e).enable()
            },
            completeLoad: function(e) {
                var t, i, r, n = getOwn(y.shim, e) || {}, o = n.exports;
                for (x(); M.length; ) {
                    if (null === (i = M.shift())[0]) {
                        if (i[0] = e,
                        t)
                            break;
                        t = !0
                    } else
                        i[0] === e && (t = !0);
                    a(i)
                }
                if (E.defQueueMap = {},
                r = getOwn(S, e),
                !t && !hasProp(O, e) && r && !r.inited) {
                    if (!(!y.enforceDefine || o && getGlobal(o)))
                        return d(e) ? void 0 : g(makeError("nodefine", "No define call for " + e, null, [e]));
                    a([e, n.deps || [], n.exportsFn])
                }
                v()
            },
            nameToUrl: function(e, t, i) {
                var r, n, o, a, s, u = getOwn(y.pkgs, e);
                if (u = getOwn(P, e = u ? u : e))
                    return E.nameToUrl(u, t, i);
                if (req.jsExtRegExp.test(e))
                    a = e + (t || "");
                else {
                    for (r = y.paths,
                    o = (n = e.split("/")).length; 0 < o; --o)
                        if (s = getOwn(r, n.slice(0, o).join("/"))) {
                            isArray(s) && (s = s[0]),
                            n.splice(0, o, s);
                            break
                        }
                    a = n.join("/"),
                    a = ("/" === (a += t || (/^data\:|^blob\:|\?/.test(a) || i ? "" : ".js")).charAt(0) || a.match(/^[\w\+\.\-]+:/) ? "" : y.baseUrl) + a
                }
                return y.urlArgs && !/^blob\:/.test(a) ? a + y.urlArgs(e, a) : a
            },
            load: function(e, t) {
                req.load(E, e, t)
            },
            execCb: function(e, t, i, r) {
                return t.apply(r, i)
            },
            onScriptLoad: function(e) {
                "load" !== e.type && !readyRegExp.test((e.currentTarget || e.srcElement).readyState) || (interactiveScript = null,
                e = n(e),
                E.completeLoad(e.id))
            },
            onScriptError: function(e) {
                var i, r = n(e);
                if (!d(r.id))
                    return i = [],
                    eachProp(S, function(e, t) {
                        0 !== t.indexOf("_@r") && each(e.depMaps, function(e) {
                            if (e.id === r.id)
                                return i.push(t),
                                !0
                        })
                    }),
                    g(makeError("scripterror", 'Script error for "' + r.id + (i.length ? '", needed by: ' + i.join(", ") : '"'), e, [r.id]))
            }
        }).require = E.makeRequire(),
        E
    }
    function getInteractiveScript() {
        return interactiveScript && "interactive" === interactiveScript.readyState || eachReverse(scripts(), function(e) {
            if ("interactive" === e.readyState)
                return interactiveScript = e
        }),
        interactiveScript
    }
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.3.3", commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), isWebWorker = !isBrowser && "undefined" != typeof importScripts, readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(), contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
    if (void 0 === define) {
        if (void 0 !== requirejs) {
            if (isFunction(requirejs))
                return;
            cfg = requirejs,
            requirejs = void 0
        }
        void 0 === require || isFunction(require) || (cfg = require,
        require = void 0),
        req = requirejs = function(e, t, i, r) {
            var n, o = defContextName;
            return isArray(e) || "string" == typeof e || (n = e,
            isArray(t) ? (e = t,
            t = i,
            i = r) : e = []),
            n && n.context && (o = n.context),
            r = (r = getOwn(contexts, o)) || (contexts[o] = req.s.newContext(o)),
            n && r.configure(n),
            r.require(e, t, i)
        }
        ,
        req.config = function(e) {
            return req(e)
        }
        ,
        req.nextTick = void 0 !== setTimeout ? function(e) {
            setTimeout(e, 4)
        }
        : function(e) {
            e()
        }
        ,
        require = require || req,
        req.version = version,
        req.jsExtRegExp = /^\/|:|\?|\.js$/,
        req.isBrowser = isBrowser,
        s = req.s = {
            contexts: contexts,
            newContext: newContext
        },
        req({}),
        each(["toUrl", "undef", "defined", "specified"], function(t) {
            req[t] = function() {
                var e = contexts[defContextName];
                return e.require[t].apply(e, arguments)
            }
        }),
        isBrowser && (head = s.head = document.getElementsByTagName("head")[0],
        baseElement = document.getElementsByTagName("base")[0],
        baseElement) && (head = s.head = baseElement.parentNode),
        req.onError = defaultOnError,
        req.createNode = function(e, t, i) {
            var r = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return r.type = e.scriptType || "text/javascript",
            r.charset = "utf-8",
            r.async = !0,
            r
        }
        ,
        req.load = function(e, t, i) {
            var r, n = e && e.config || {};
            if (isBrowser)
                return (r = req.createNode(n, t, i)).setAttribute("data-requirecontext", e.contextName),
                r.setAttribute("data-requiremodule", t),
                !r.attachEvent || r.attachEvent.toString && r.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (r.addEventListener("load", e.onScriptLoad, !1),
                r.addEventListener("error", e.onScriptError, !1)) : (useInteractive = !0,
                r.attachEvent("onreadystatechange", e.onScriptLoad)),
                r.src = i,
                n.onNodeCreated && n.onNodeCreated(r, n, t, i),
                currentlyAddingScript = r,
                baseElement ? head.insertBefore(r, baseElement) : head.appendChild(r),
                currentlyAddingScript = null,
                r;
            if (isWebWorker)
                try {
                    setTimeout(function() {}, 0),
                    importScripts(i),
                    e.completeLoad(t)
                } catch (r) {
                    e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + i, r, [t]))
                }
        }
        ,
        isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function(e) {
            if (head = head || e.parentNode,
            dataMain = e.getAttribute("data-main"))
                return mainScript = dataMain,
                cfg.baseUrl || -1 !== mainScript.indexOf("!") || (mainScript = (src = mainScript.split("/")).pop(),
                subPath = src.length ? src.join("/") + "/" : "./",
                cfg.baseUrl = subPath),
                mainScript = mainScript.replace(jsSuffixRegExp, ""),
                req.jsExtRegExp.test(mainScript) && (mainScript = dataMain),
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript],
                !0
        }),
        define = function(e, i, t) {
            var r, n;
            "string" != typeof e && (t = i,
            i = e,
            e = null),
            isArray(i) || (t = i,
            i = null),
            !i && isFunction(t) && (i = [],
            t.length) && (t.toString().replace(commentRegExp, commentReplace).replace(cjsRequireRegExp, function(e, t) {
                i.push(t)
            }),
            i = (1 === t.length ? ["require"] : ["require", "exports", "module"]).concat(i)),
            useInteractive && (r = currentlyAddingScript || getInteractiveScript()) && (e = e || r.getAttribute("data-requiremodule"),
            n = contexts[r.getAttribute("data-requirecontext")]),
            n ? (n.defQueue.push([e, i, t]),
            n.defQueueMap[e] = !0) : globalDefQueue.push([e, i, t])
        }
        ,
        define.amd = {
            jQuery: !0
        },
        req.exec = function(text) {
            return eval(text)
        }
        ,
        req(cfg)
    }
}(this, "undefined" == typeof setTimeout ? void 0 : setTimeout);

;window.Modernizr = function(e, r, u) {
    function t(e) {
        p.cssText = e
    }
    function d(e, t) {
        return typeof e === t
    }
    function f(e, t) {
        for (var n in e) {
            n = e[n];
            if (!~("" + n).indexOf("-") && p[n] !== u)
                return "pfx" != t || n
        }
        return !1
    }
    function o(e, t, n) {
        var r = e.charAt(0).toUpperCase() + e.slice(1)
          , o = (e + " " + h.join(r + " ") + r).split(" ");
        if (d(t, "string") || void 0 === t)
            return f(o, t);
        var i, a = (e + " " + v.join(r + " ") + r).split(" "), c = t, s = n;
        for (i in a) {
            var l = c[a[i]];
            if (l !== u)
                return !1 === s ? a[i] : d(l, "function") ? l.bind(s || c) : l
        }
        return !1
    }
    function P(e, t) {
        t = t || r.createElement(i[e] || "div");
        var n = (e = "on" + e)in t;
        return n || (t = t.setAttribute ? t : r.createElement("div")).setAttribute && t.removeAttribute && (t.setAttribute(e, ""),
        n = d(t[e], "function"),
        void 0 !== t[e] && (t[e] = u),
        t.removeAttribute(e)),
        t = null,
        n
    }
    var n, i, a, c = {}, s = r.documentElement, l = "modernizr", p = r.createElement(l).style, m = "Webkit Moz O ms", h = m.split(" "), v = m.toLowerCase().split(" "), g = {}, y = [], b = y.slice, E = (i = {
        select: "input",
        change: "input",
        submit: "form",
        reset: "form",
        error: "img",
        load: "img",
        abort: "img"
    },
    {}.hasOwnProperty), w = void 0 !== E && void 0 !== E.call ? function(e, t) {
        return E.call(e, t)
    }
    : function(e, t) {
        return t in e && void 0 === e.constructor.prototype[t]
    }
    ;
    for (a in Function.prototype.bind || (Function.prototype.bind = function(n) {
        var r = this;
        if ("function" != typeof r)
            throw new TypeError;
        var o = b.call(arguments, 1)
          , i = function() {
            var e, t;
            return this instanceof i ? ((e = function() {}
            ).prototype = r.prototype,
            e = new e,
            t = r.apply(e, o.concat(b.call(arguments))),
            Object(t) === t ? t : e) : r.apply(n, o.concat(b.call(arguments)))
        };
        return i
    }
    ),
    g.flexbox = function() {
        return o("flexWrap")
    }
    ,
    g.history = function() {
        return !!e.history && !!history.pushState
    }
    ,
    g.draganddrop = function() {
        var e = r.createElement("div");
        return "draggable"in e || "ondragstart"in e && "ondrop"in e
    }
    ,
    g.borderimage = function() {
        return o("borderImage")
    }
    ,
    g.textshadow = function() {
        return "" === r.createElement("div").style.textShadow
    }
    ,
    g.cssanimations = function() {
        return o("animationName")
    }
    ,
    g.localstorage = function() {
        try {
            return localStorage.setItem(l, l),
            localStorage.removeItem(l),
            !0
        } catch (e) {
            return !1
        }
    }
    ,
    g.sessionstorage = function() {
        try {
            return sessionStorage.setItem(l, l),
            sessionStorage.removeItem(l),
            !0
        } catch (e) {
            return !1
        }
    }
    ,
    g)
        w(g, a) && (n = a.toLowerCase(),
        c[n] = g[a](),
        y.push((c[n] ? "" : "no-") + n));
    c.addTest = function(e, t) {
        if ("object" == typeof e)
            for (var n in e)
                w(e, n) && c.addTest(n, e[n]);
        else {
            if (e = e.toLowerCase(),
            c[e] !== u)
                return c;
            t = "function" == typeof t ? t() : t,
            s.className += " " + (t ? "" : "no-") + e,
            c[e] = t
        }
        return c
    }
    ,
    t("");
    var m = this
      , S = r;
    function x() {
        var e = D.elements;
        return "string" == typeof e ? e.split(" ") : e
    }
    function j(e) {
        var t = L[e[A]];
        return t || (t = {},
        z++,
        e[A] = z,
        L[z] = t),
        t
    }
    function C(e, t, n) {
        return t = t || S,
        M ? t.createElement(e) : !(t = (n = n || j(t)).cache[e] ? n.cache[e].cloneNode() : U.test(e) ? (n.cache[e] = n.createElem(e)).cloneNode() : n.createElem(e)).canHaveChildren || B.test(e) || t.tagUrn ? t : n.frag.appendChild(t)
    }
    function F(e) {
        var t, n, r, o, i, a = j(e = e || S);
        return !D.shivCSS || N || a.hasCSS || (a.hasCSS = (o = "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}",
        i = (r = e).createElement("p"),
        r = r.getElementsByTagName("head")[0] || r.documentElement,
        i.innerHTML = "x<style>" + o + "</style>",
        !!r.insertBefore(i.lastChild, r.firstChild))),
        M || (t = e,
        (n = a).cache || (n.cache = {},
        n.createElem = t.createElement,
        n.createFrag = t.createDocumentFragment,
        n.frag = n.createFrag()),
        t.createElement = function(e) {
            return D.shivMethods ? C(e, t, n) : n.createElem(e)
        }
        ,
        t.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + x().join().replace(/[\w\-]+/g, function(e) {
            return n.createElem(e),
            n.frag.createElement(e),
            'c("' + e + '")'
        }) + ");return n}")(D, n.frag)),
        e
    }
    var N, M, O, T = m.html5 || {}, B = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, U = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, A = "_html5shiv", z = 0, L = {};
    try {
        var k = S.createElement("a");
        k.innerHTML = "<xyz></xyz>",
        N = "hidden"in k,
        M = 1 == k.childNodes.length || (S.createElement("a"),
        void 0 === (O = S.createDocumentFragment()).cloneNode) || void 0 === O.createDocumentFragment || void 0 === O.createElement
    } catch (e) {
        M = N = !0
    }
    var D = {
        elements: T.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
        version: "3.7.0",
        shivCSS: !1 !== T.shivCSS,
        supportsUnknownElements: M,
        shivMethods: !1 !== T.shivMethods,
        type: "default",
        shivDocument: F,
        createElement: C,
        createDocumentFragment: function(e, t) {
            if (e = e || S,
            M)
                return e.createDocumentFragment();
            for (var n = (t = t || j(e)).frag.cloneNode(), r = 0, o = x(), i = o.length; r < i; r++)
                n.createElement(o[r]);
            return n
        }
    };
    return m.html5 = D,
    F(S),
    c._version = "2.8.3",
    c._domPrefixes = v,
    c._cssomPrefixes = h,
    c.hasEvent = P,
    c.testProp = function(e) {
        return f([e])
    }
    ,
    c.testAllProps = o,
    c.prefixed = function(e, t, n) {
        return t ? o(e, t, n) : o(e, "pfx")
    }
    ,
    s.className = s.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (" js " + y.join(" ")),
    c
}(this, this.document),
( (e, p) => {
    function d(e) {
        return "[object Function]" == o.call(e)
    }
    function m(e) {
        return "string" == typeof e
    }
    function f() {}
    function h(e) {
        return !e || "loaded" == e || "complete" == e || "uninitialized" == e
    }
    function v() {
        var e = b.shift();
        E = 1,
        e ? e.t ? g(function() {
            ("c" == e.t ? F.injectCss : F.injectJs)(e.s, 0, e.a, e.x, e.e, 1)
        }, 0) : (e(),
        v()) : E = 0
    }
    function t(e, t, n, r, o) {
        return E = 0,
        t = t || "j",
        m(e) ? (a = "c" == t ? j : x,
        c = e,
        t = t,
        s = this.i++,
        n = n,
        r = r,
        o = (o = o) || F.errorTimeout,
        l = p.createElement(a),
        d = u = 0,
        f = {
            t: t,
            s: c,
            e: n,
            a: r,
            x: o
        },
        1 === C[c] && (d = 1,
        C[c] = []),
        "object" == a ? l.data = c : (l.src = c,
        l.type = a),
        l.width = l.height = "0",
        l.onerror = l.onload = l.onreadystatechange = function() {
            i.call(this, d)
        }
        ,
        b.splice(s, 0, f),
        "img" != a && (d || 2 === C[c] ? (S.insertBefore(l, w ? null : y),
        g(i, o)) : C[c].push(l))) : (b.splice(this.i++, 0, e),
        1 == b.length && v()),
        this;
        function i(e) {
            if (!u && h(l.readyState) && (f.r = u = 1,
            E || v(),
            l.onload = l.onreadystatechange = null,
            e))
                for (var t in "img" != a && g(function() {
                    S.removeChild(l)
                }, 50),
                C[c])
                    C[c].hasOwnProperty(t) && C[c][t].onload()
        }
        var a, c, s, l, u, d, f
    }
    function c() {
        var e = F;
        return e.loader = {
            load: t,
            i: 0
        },
        e
    }
    var n, r = p.documentElement, g = e.setTimeout, y = p.getElementsByTagName("script")[0], o = {}.toString, b = [], E = 0, i = "MozAppearance"in r.style, w = i && !!p.createRange().compareNode, S = w ? r : y.parentNode, r = e.opera && "[object Opera]" == o.call(e.opera), r = !!p.attachEvent && !r, x = i ? "object" : r ? "script" : "img", j = r ? "script" : x, a = Array.isArray || function(e) {
        return "[object Array]" == o.call(e)
    }
    , s = [], C = {}, l = {
        timeout: function(e, t) {
            return t.length && (e.timeout = t[0]),
            e
        }
    }, F = function(e) {
        function u(e, t, n, r, o) {
            var i = (e => {
                for (var t, n, e = e.split("!"), r = s.length, o = e.pop(), i = e.length, o = {
                    url: o,
                    origUrl: o,
                    prefixes: e
                }, a = 0; a < i; a++)
                    n = e[a].split("="),
                    (t = l[n.shift()]) && (o = t(o, n));
                for (a = 0; a < r; a++)
                    o = s[a](o);
                return o
            }
            )(e)
              , a = i.autoCallback;
            i.url.split(".").pop().split("?").shift(),
            i.bypass || (t = t && (d(t) ? t : t[e] || t[r] || t[e.split("/").pop().split("?")[0]]),
            i.instead ? i.instead(e, t, n, r, o) : (C[i.url] ? i.noexec = !0 : C[i.url] = 1,
            n.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : void 0, i.noexec, i.attrs, i.timeout),
            (d(t) || d(a)) && n.load(function() {
                c(),
                t && t(i.origUrl, o, r),
                a && a(i.origUrl, o, r),
                C[i.url] = 2
            })))
        }
        function t(e, t) {
            function n(n, e) {
                if (n) {
                    if (m(n))
                        u(n, c = e ? c : function() {
                            var e = [].slice.call(arguments);
                            s.apply(this, e),
                            l()
                        }
                        , t, 0, i);
                    else if (Object(n) === n)
                        for (o in r = ( () => {
                            var e, t = 0;
                            for (e in n)
                                n.hasOwnProperty(e) && t++;
                            return t
                        }
                        )(),
                        n)
                            n.hasOwnProperty(o) && (e || --r || (d(c) ? c = function() {
                                var e = [].slice.call(arguments);
                                s.apply(this, e),
                                l()
                            }
                            : c[o] = (t => function() {
                                var e = [].slice.call(arguments);
                                t && t.apply(this, e),
                                l()
                            }
                            )(s[o])),
                            u(n[o], c, t, o, i))
                } else
                    e || l()
            }
            var r, o, i = !!e.test, a = e.load || e.both, c = e.callback || f, s = c, l = e.complete || f;
            n(i ? e.yep : e.nope, !!a),
            a && n(a)
        }
        var n, r, o = this.yepnope.loader;
        if (m(e))
            u(e, 0, o, 0);
        else if (a(e))
            for (n = 0; n < e.length; n++)
                m(r = e[n]) ? u(r, 0, o, 0) : a(r) ? F(r) : Object(r) === r && t(r, o);
        else
            Object(e) === e && t(e, o)
    };
    F.addPrefix = function(e, t) {
        l[e] = t
    }
    ,
    F.addFilter = function(e) {
        s.push(e)
    }
    ,
    F.errorTimeout = 1e4,
    null == p.readyState && p.addEventListener && (p.readyState = "loading",
    p.addEventListener("DOMContentLoaded", n = function() {
        p.removeEventListener("DOMContentLoaded", n, 0),
        p.readyState = "complete"
    }
    , 0)),
    e.yepnope = c(),
    e.yepnope.executeStack = v,
    e.yepnope.injectJs = function(e, t, n, r, o, i) {
        var a, c, s = p.createElement("script"), r = r || F.errorTimeout;
        for (c in s.src = e,
        n)
            s.setAttribute(c, n[c]);
        t = i ? v : t || f,
        s.onreadystatechange = s.onload = function() {
            !a && h(s.readyState) && (a = 1,
            t(),
            s.onload = s.onreadystatechange = null)
        }
        ,
        g(function() {
            a || t(a = 1)
        }, r),
        o ? s.onload() : y.parentNode.insertBefore(s, y)
    }
    ,
    e.yepnope.injectCss = function(e, t, n, r, o, i) {
        var a, t = i ? v : t || f;
        for (a in (r = p.createElement("link")).href = e,
        r.rel = "stylesheet",
        r.type = "text/css",
        n)
            r.setAttribute(a, n[a]);
        o || (y.parentNode.insertBefore(r, y),
        g(t, 0))
    }
}
)(this, document),
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
}
,
Modernizr.addTest("filereader", function() {
    return !!(window.File && window.FileList && window.FileReader)
}),
Modernizr.addTest("json", !!window.JSON && !!JSON.parse),
Modernizr.addTest("performance", !!Modernizr.prefixed("performance", window));

;var mx = 0
  , my = 0;
function setImageTitles() {
    $("img").each(function() {
        var e = $(this).attr("alt");
        $(this).attr("title") || "" == e || $(this).attr("title", e)
    })
}
function getTime(e) {
    if (n = e.data("seconds"))
        return n;
    if (!e.html() || 0 == e.html().length)
        return -1;
    if (-1 != e.html().indexOf("<a "))
        return -1;
    for (var t, n, a = e.html().split(":"), o = 1; o < 3; o++)
        "0" == a[o].charAt(0) && (a[o] = a[o].substring(1, a[o].length));
    return 3600 * (isNaN(a[0]) ? (n = a[0].split(/[a-z\s]+/i),
    t = parseInt(n[1], 10),
    parseInt(n[0], 10)) : (t = parseInt(a[0], 10),
    0)) * 24 + 60 * t * 60 + 60 * parseInt(a[1], 10) + parseInt(a[2], 10)
}
function getLocalTimeAsFloat() {
    return (new Date).getTime() / 1e3
}
function startTimer() {
    Timing.resetTickHandlers()
}
function setRes(e, t) {
    game_data.village[e] = t,
    game_data.village[e + "_float"] = t,
    Timing.resetTickHandlers()
}
function changeResStyle(e, t) {
    e.hasClass(t) || e.removeClass("res").removeClass("warn").removeClass("warn_90").addClass(t)
}
function number_format(e, t) {
    var n = e < 0
      , a = Math.abs(e).toString();
    if (a.length <= 3)
        return e;
    var o = [];
    do {
        var l = a.length - 3
    } while (o.push(a.slice(l, a.length)),
    3 < (a = a.substring(0, l)).length);
    for (l in o.reverse(),
    o)
        o.hasOwnProperty(l) && (a += t + o[l]);
    return n ? "-" + a : a
}
function getTimeString(e, t, n) {
    e = Math.floor(e);
    var a = Math.floor(e / 3600)
      , t = (t && (a %= 24),
    n && (a = a.toString().padStart(2, "0")),
    (Math.floor(e / 60) % 60).toString().padStart(2, "0"));
    return a + ":" + t + ":" + (e % 60).toString().padStart(2, "0")
}
function formatTime(e, t, n) {
    t = getTimeString(t, n);
    $(e).html(t)
}
function partialReload(e, t) {
    var n;
    $(".captcha").length || ($(document).trigger("partial_reload_start"),
    n = document.location.href.replace(/action=\w*/, "").replace(/#.*$/, "") + "&_partial",
    TribalWars.fetch(n, e, t))
}
function selectAll(e, t, n) {
    for (var a = 0; a < e.length; a++)
        "checkbox" != e.elements[a].type || e.elements[a].disabled || void 0 !== n && n != e.elements[a].className || (e.elements[a].checked = t)
}
function changeBunches(e) {
    for (var t = 0, n = 0; n < e.length; n++) {
        var a = e.elements[n];
        "select_all" != a.className && null != a.selectedIndex && (t += parseInt(a.value, 10))
    }
    $("#selectedBunches_bottom").text(t),
    $("#selectedBunches_top").text(t)
}
function delete_village_group(e, t) {
    var n = [{
        text: _("70d9be9b139893aa6c69b5e77e614311"),
        callback: function() {
            window.location.href = t
        },
        confirm: !0
    }];
    UI.ConfirmationBox(e, n)
}
function insertCoord(e, t, n) {
    var a, t = t.value.split("|");
    2 != t.length ? "market" === e.name && (e[n + "x"].value = "",
    e[n + "y"].value = "") : (a = parseInt(t[0], 10),
    t = parseInt(t[1], 10),
    e[(n = n || "") + "x"].value = a,
    e[n + "y"].value = t,
    (n = $(e).find(".target-input input[type=text]")) && n.val(a + "|" + t))
}
function insertUnit(e, t, n) {
    (e = $(e)).is(":disabled") || (t != e.val() || n ? e.val(t) : e.val(""))
}
function insertBBcode(e, t, n) {
    return BBCodes.insert(t, n),
    !1
}
function selectTarget(e, t, n) {
    n = n || "";
    var a = $('form[name="units"], form[name="market"], form[name="secret"], form[name="support"]')[0];
    a[n + "x"].value = e,
    a[n + "y"].value = t,
    a[n + "_target"] && (a[n + "_target"].value = e + "|" + t),
    $(a[n + "x"]).trigger("coordsUpdated"),
    $("#closelink_village_targets").click(),
    $("div[id$='_cont']").hide()
}
function editGroup(e) {
    var t = window.opener.location.href;
    t = (t = t.replace(/&action=edit_group&edit_group=\d+&h=([a-z0-9]+)/, "")).replace(/&edit_group=\d+/, ""),
    (overview = window.opener.document.getElementById("overview")) && -1 != overview.value.search(/(combined|prod|units|buildings|tech)/) && (window.opener.location.href = encodeURI(t + "&edit_group=" + e)),
    window.close()
}
function escape_id(e) {
    return "#" + e.replace("^#", "").replace("[", "\\[").replace("]", "\\]")
}
function editToggle(e, t) {
    $(escape_id(t)).toggle(),
    $(escape_id(e)).toggle(),
    $(escape_id(t)).find("input").each(function() {
        var e = $(this)
          , t = e.attr("type");
        void 0 !== t && "text" != t || (e.focus(),
        e.select())
    })
}
function toggle_element(e) {
    "#" !== e.substring(0, 1) && (e = "#" + e),
    $(e).toggle()
}
function unescapeHtml(e) {
    return (e = String(e)).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
}
function renameAttack(e, t, n) {
    e = $("#" + e).val();
    0 < e.length && ($("#" + t).html(escapeHtml(e)),
    $("#" + n).val(e))
}
function bb_color_picker_gencaller(e, t) {
    return function() {
        e(t)
    }
}
function bb_color_set_color(e) {
    var t = $("#bb_color_picker_preview")
      , n = $("#bb_color_picker_tx")
      , t = (t.css("color", "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"),
    e[0].toString(16))
      , a = e[1].toString(16)
      , e = e[2].toString(16)
      , t = t.length < 2 ? "0" + t : t
      , a = a.length < 2 ? "0" + a : a
      , e = e.length < 2 ? "0" + e : e;
    n.val("#" + t + a + e)
}
function bb_color_pick_color(e) {
    for (var t = e.data("rgb"), n = 0; n < 6; n++)
        for (var a = 1; a < 6; a++) {
            var o = $("#bb_color_picker_" + a + n)
              , l = (o || alert("bb_color_picker_" + a + n),
            n / 3)
              , r = a / 4.5
              , r = Math.pow(r, .5)
              , i = Math.max(0, 255 * l - 255)
              , c = Math.floor(Math.max(0, Math.min(255, t[0] * l * r + 255 * (1 - r) + i)))
              , s = Math.floor(Math.max(0, Math.min(255, t[1] * l * r + 255 * (1 - r) + i)))
              , l = Math.floor(Math.max(0, Math.min(255, t[2] * l * r + 255 * (1 - r) + i)));
            o.css("background-color", "rgb(" + c + "," + s + "," + l + ")"),
            o.data("rgb", [c, s, l]),
            o.unbind("click").click(function() {
                bb_color_picker_gencaller(bb_color_set_color, $(this).data("rgb"))
            })
        }
}
function bb_color_picker_textchange() {
    var e = $("#bb_color_picker_tx")
      , t = $("#bb_color_picker_preview");
    try {
        t.css("color", e.val())
    } catch (e) {}
}
function igm_to_show(e) {
    $.get(e, function(e) {
        var t = $("#igm_to_content");
        t.html(e),
        UI.Draggable(t.parent(), {
            savepos: !1
        })
    }),
    $("#igm_to").css("display", "inline")
}
function igm_to_hide() {
    $("#igm_to").hide()
}
function igm_to_insert_adresses(e) {
    $("#to").val($("#to").val() + e)
}
function igm_to_addresses_clear() {
    $("#to").val("")
}
function xProcess(e, t) {
    e = $("#" + e),
    t = $("#" + t);
    var n, a, o, l = e.val(), r = t.val();
    -1 != l.indexOf("|") ? (a = l.split("|"),
    o = parseInt(a[0], 10),
    0 !== a[1].length && (n = parseInt(a[1], 10)),
    e.val(o),
    t.val(n).focus()) : 3 === l.length && 0 === r.length ? t.focus() : 3 < l.length && (o = l.substr(0, 3),
    n = l.substring(3),
    e.val(o),
    t.val(n).focus())
}
function textCounter(e, t, n) {
    e.value.length > n && (e.value = e.value.substring(0, n));
    try {
        document.getElementById(t).innerHTML = "%1/%2".replace(/%2/, n).replace(/%1/, e.value.length)
    } catch (e) {}
}
function selectAllUnits(a) {
    $(".unitsInput").each(function(e, t) {
        var n = $(this).next("a").html();
        insertUnit(t, 0 < (n = n.substr(1).substr(0, n.length - 2)) && a ? n : "", a)
    })
}
function toggle_spoiler(e) {
    var t = e.parentNode.getElementsByTagName("div")[0].getElementsByTagName("span")[0].style.display;
    e.parentNode.getElementsByTagName("div")[0].getElementsByTagName("span")[0].style.display = "none" == t ? "block" : "none"
}
function s(e) {
    if (1 < arguments.length && "object" == typeof arguments[1] && null != arguments[1])
        return s.apply(s, [arguments[0]].concat(arguments[1]));
    for (var t = 1; t < arguments.length; t++)
        e = e.split("%" + t).join(arguments[t]);
    return e
}
function autoresize_textarea(e, a) {
    var o, l = $(e);
    l.length && (a = a || 40,
    o = l[0].rows,
    l.keydown(function() {
        for (var e = this.value.split("\n"), t = e.length, n = 0; n < e.length; n++)
            e[n].length >= l[0].cols && (t += Math.floor(e[n].length / l[0].cols));
        t += 2,
        t = Math.min(t, a),
        o < t && (this.rows = t)
    }))
}
function load_into(e, t) {
    void 0 === t && (t = document.body),
    $.ajax({
        url: e,
        success: function(e) {
            e.error ? UI.ErrorMessage(e.error) : $(t).html(e).show()
        }
    })
}
var villageDock = {
    saveLink: !1,
    loadLink: null,
    docked: null,
    bindClose: function() {
        $("#closelink_group_popup").click(function() {
            villageDock.saveDockMode(0)
        })
    },
    saveDockMode: function(e) {
        villageDock.saveLink && (ajaxSimple(villageDock.saveLink, null, {
            dock: e
        }),
        villageDock.docked = e)
    },
    open: function(e) {
        return 0 == villageDock.docked && villageDock.saveDockMode(1),
        UI.AjaxPopup(e, "group_popup", villageDock.loadLink, _("49f8eff5b37c62212f0b7870b07af7bb"), villageDock.callback, null, 320, 380, null, null, ["#open_groups", "#close_groups"]),
        $("#close_groups, #open_groups").toggle(),
        !1
    },
    close: function(e) {
        return 1 == villageDock.docked && villageDock.saveDockMode(0),
        $("#close_groups, #open_groups").toggle(),
        $("#group_popup").toggle(),
        !1
    },
    callback: function(e, t) {
        VillageGroups.villageSelect.handleGroupMenuData(e, t),
        villageDock.saveLink && villageDock.bindClose()
    }
};
function ajaxSimple(e, t, n, a) {
    $.ajax({
        url: e,
        data: n,
        dataType: "html",
        success: function(e) {
            0 == e.length && (e = a),
            $("#" + t).html(e)
        }
    })
}

;function escapeHtml(e, r) {
    return e = (e = String(e)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    e = r ? e.replace(/"/g, "&quot;") : e
}

;function _(n) {
    return window.lang.hasOwnProperty(n) ? window.lang[n] : n
}
function _n(n, r, e) {
    return (1 === Number(e) ? n : r).replace("%d", e).replace("%s", e)
}

;var Decorate;
Decorate = {
    FiresEvents: function(n) {
        var i = {};
        n.on = function(n, o) {
            void 0 === i[n] && (i[n] = []),
            i[n].push(o)
        }
        ,
        n.off = function(n) {
            i[n] = []
        }
        ,
        n.trigger = function(n, o) {
            void 0 !== i[n] && i[n].forEach(function(n) {
                n(o)
            })
        }
    }
};

;var UI;
( () => {
    function r(a, s) {
        var r = document.createElement("div");
        return r.className = "ui-dropdown-list display-none",
        Array.from(a.options).forEach(function(e) {
            var t, n, i, o;
            r.appendChild((e = e,
            t = a,
            n = s,
            i = r,
            (o = document.createElement("div")).className = "ui-dropdown-item",
            o.textContent = e.text.trim(),
            o.dataset.value = e.value,
            e.value || o.classList.add("ui-dropdown-placeholder"),
            e.selected && o.classList.add("ui-dropdown-selected"),
            o.addEventListener("click", function() {
                t.value = this.dataset.value,
                t.dispatchEvent(new Event("change")),
                n.textContent = this.textContent,
                i.querySelectorAll(".ui-dropdown-selected").forEach(function(e) {
                    e.classList.remove("ui-dropdown-selected")
                }),
                this.classList.add("ui-dropdown-selected"),
                i.classList.add("display-none")
            }),
            o))
        }),
        s.addEventListener("click", function(e) {
            e.stopPropagation(),
            document.querySelectorAll(".ui-dropdown-list").forEach(function(e) {
                e !== r && e.classList.add("display-none")
            }),
            r.classList.toggle("display-none"),
            r.classList.contains("display-none") || (r.scrollTop = 0)
        }),
        r
    }
    var t;
    UI = {
        init: function() {
            var t;
            "undefined" != typeof game_data && ((t = this).initUIElements(),
            this.initDialogs(),
            $(".evt-confirm").on("click", UI.getConfirmHandler()),
            $(".error_box").on("click", function() {
                window.getSelection().toString() || $(this).fadeOut(500, function() {
                    $(this).remove()
                })
            }),
            this.InitProgressBars(),
            $.widget("ui.autocomplete", $.ui.autocomplete, UI.AutoComplete.extension_targeted_suggestions),
            "undefined" == typeof mobile || mobile || $(".autocomplete").autocomplete({
                minLength: 2,
                source: UI.AutoComplete.source,
                focus: UI.AutoComplete.handleFocus,
                delay: 0
            }),
            UI.initDefaultTooltips(),
            UI.ToolTip(".tooltip-delayed", {
                delay: 400
            }),
            window.mobile && $(".mds-tooltip").on("click", function() {
                return Dialog.show("tooltip", $(this).attr("title")),
                !1
            }),
            UI.checkForMessages(),
            UI.FormAbandon.init(),
            UI.FormAllowOneSubmission.init(),
            UI.Help.init(),
            UI.initHintToggle(),
            UI.ConfirmationSkipping.supported() && void 0 !== game_data.player.confirmation_skipping_hash && UI.ConfirmationSkipping.init(game_data.player.confirmation_skipping_hash),
            UI.fixupCSRFInUrl(),
            require(["Ig/TribalWars/Modules/UI/FormSubmit"], function(e) {
                new e
            }),
            game_data.two_factor) && !this.two_factor && require(["Ig/TribalWars/Modules/TwoFactor"], function(e) {
                t.two_factor = new e
            })
        },
        initDefaultTooltips() {
            UI.ToolTip(":not(iframe)[title]")
        },
        fixupCSRFInUrl: function() {
            $('form[action*="&h="]').each(function() {
                var e = $(this)
                  , t = e.attr("action")
                  , n = t.match(/&h=([a-f0-9]+)/)[1];
                0 === e.find("input[name=h]").length && e.append('<input type="hidden" name="h" value="' + n + '" />'),
                e.attr("action", t.replace(/&h=([a-f0-9]+)/, ""))
            })
        },
        initHintToggle: function() {
            $(".hint-toggle").off("click.hints").on("click.hints", function() {
                var e = $(this);
                e.closest(".info_box").fadeOut(),
                e.closest(".mobileNotification").fadeOut(),
                e.data("setting") ? TribalWars.setSetting(e.data("setting"), 0) : TribalWars.suppressHint(e.data("hint"))
            })
        },
        AutoComplete: {
            url: null,
            source: function(e, t) {
                var n = this.element.data("type");
                -1 !== e.term.indexOf(";") && t([]),
                $.post(UI.AutoComplete.url, {
                    type: n,
                    text: e.term
                }, function(e) {
                    t(e)
                }, "json")
            },
            handleFocus: function(e, t) {
                UI.AutoComplete.highlightMenuItem(t.item.label)
            },
            highlightMenuItem: function(n) {
                var e = $(".ui-autocomplete.ui-menu > li > a");
                $.each(e, function(e, t) {
                    t = $(t);
                    t.html() == n ? t.addClass("selected") : t.removeClass("selected")
                })
            },
            extension_targeted_suggestions: {
                _renderMenu: function(n, e) {
                    var t, i, o = this, e = e[0];
                    if (o.element.data("ignore-single-exact-match") && e.targeted.length + e.common.length === 1 && (e.targeted.length ? e.targeted : e.common)[0].label.toUpperCase() === o.element.val().toUpperCase())
                        return void n.addClass("no-suggestions");
                    if (!e.targeted.length && !e.common.length)
                        return (t = this.element.data("no-suggestions-hint")) ? ((i = $("<li>" + t + "</li>")).data("ui-autocomplete-item", {
                            label: t,
                            value: ""
                        }),
                        void n.append(i)) : void n.addClass("no-suggestions");
                    n.removeClass("no-suggestions"),
                    e.targeted.length && $.each(e.targeted, function(e, t) {
                        o._renderItemData(n, t)
                    }),
                    e.targeted.length && e.common.length && n.append("<li><hr/></li>"),
                    $.each(e.common, function(e, t) {
                        o._renderItemData(n, t)
                    })
                }
            }
        },
        Throbber: $('<img alt="' + _("8524de963f07201e5c086830d370797f") + '" title="' + _("8524de963f07201e5c086830d370797f") + '" />').attr("src", "/graphic/throbber.gif"),
        initDialogs: function() {
            $(".dialog-opener").off("click.dialog").on("click.dialog", function() {
                var e = $(this)
                  , t = e.data("name")
                  , n = e.data("screen")
                  , i = e.data("ajax")
                  , e = e.data("params");
                return Dialog.fetch(t, n, $.extend({
                    ajax: i
                }, e)),
                !1
            })
        },
        initUIElements: function() {
            $("#premium_points_buy, .premium-buy").off("click").click(function(e) {
                mobile || (Premium.buy(),
                e.preventDefault())
            }),
            Premium.initChecks()
        },
        InitProgressBars: function() {
            $(".progress-bar:not(.progress-bar-alive)").each(function() {
                UI.initProgressBar($(this))
            })
        },
        initProgressBar: function(e) {
            var t = e.children(":first").html()
              , n = (e.data("prefix") || "") + " "
              , i = " " + (e.data("suffix") || "")
              , o = e.find("div")
              , a = ("100%" === o[0].style.width && o.addClass("full"),
            $("<span>" + (n + t + i).trim() + "</span>").addClass("label").css("width", e.width() + "px"));
            UI.onResizeEnd(e, function() {
                a.css("width", e.width() + "px")
            }),
            o.first().append(a),
            e.addClass("progress-bar-alive")
        },
        updateProgressBar: function(e, t, n) {
            var i = t / n * 100
              , o = (e.data("prefix") || "") + " "
              , a = " " + (e.data("suffix") || "")
              , s = e.find("div");
            s.css("width", i + "%"),
            100 == i && s.addClass("full"),
            e.find(".label").html((o + Format.number(t) + " / " + Format.number(n) + a).trim())
        },
        checkForMessages: function() {
            var e = $.cookie("success_message");
            e && UI.SuccessMessage(e.replace(/\+/g, " ")),
            $.removeCookie("success_message")
        },
        Image: function(e, t) {
            e = {
                src: image_base + e
            };
            return $.extend(e, t),
            $('<img alt="" />').attr(e)
        },
        CommandIcon: function(e, t) {
            var n = $("<span>").attr("data-command-id", t.unit)
              , i = (e.class && n.addClass(e.class),
            e.tooltip || "");
            return t.own_command || t.is_shared ? (n.addClass("command_hover_details"),
            n.attr("data-icon-hint", escapeHtml(i, !0)),
            n.attr("data-command-type", t.type),
            Command.initHoverDetails(n)) : (n.addClass("tooltip"),
            n.attr("title", escapeHtml(i, !0))),
            n.append(UI.Image(e.img, {})),
            n
        },
        ToolTip: function(e, t) {
            mobile || $(e).tooltip($.extend({
                showURL: !1,
                track: !0,
                fade: 0,
                delay: 0,
                showBody: " :: ",
                extraClass: "tooltip-style"
            }, t))
        },
        Dropdown: function(e) {
            (e instanceof HTMLElement ? [e] : document.querySelectorAll(e)).forEach(function(e) {
                var t, n, i, o, a;
                e.dataset.dropdownInit || (e.dataset.dropdownInit = "true",
                t = e,
                (n = document.createElement("div")).className = "ui-dropdown-display",
                n.textContent = t.options[t.selectedIndex]?.text || "",
                n = r(e, t = n),
                e = e,
                i = t,
                o = n,
                (a = document.createElement("div")).className = "ui-dropdown",
                e.style.display = "none",
                e.parentNode.insertBefore(a, e),
                a.appendChild(i),
                a.appendChild(o),
                a.appendChild(e),
                i = t,
                (o = n).classList.remove("display-none"),
                o.style.visibility = "hidden",
                a = o.scrollWidth,
                o.classList.add("display-none"),
                o.style.visibility = "",
                i.style.minWidth = a + "px")
            }),
            t || (document.addEventListener("click", function() {
                document.querySelectorAll(".ui-dropdown-list").forEach(function(e) {
                    e.classList.add("display-none")
                })
            }),
            t = !0)
        },
        Draggable: function(n, e) {
            var t = {
                savepos: !0,
                cursor: "move",
                handle: $(n).find("div:first"),
                appendTo: "body",
                containment: [0, 60]
            }
              , t = $.extend(t, e);
            $(n).draggable(t),
            t.savepos && $(n).bind("dragstop", function() {
                var e = $(document)
                  , t = $(n).offset().left - e.scrollLeft()
                  , e = $(n).offset().top - e.scrollTop();
                $.cookie("popup_pos_" + $(n).attr("id"), t + "x" + e)
            })
        },
        Sortable: function(e, t) {
            var n = {
                cursor: "move",
                handle: $(e).find("div:first"),
                opacity: .6,
                helper: function(e, t) {
                    return t.children().each(function() {
                        $(this).width($(this).width())
                    }),
                    t
                }
            };
            $(e).sortable($.extend(n, t))
        },
        SlimScroll: function(e, t) {
            e = $(e);
            t.maxHeight && (e.css({
                height: "",
                "max-height": t.maxHeight
            }),
            t.height = "auto"),
            0 < e.parent(".slimScrollDiv").length && e.parent().replaceWith(e),
            e.slimScroll(t),
            e.css("height", e.height() - (e.innerHeight() - e.height()))
        },
        ErrorMessage: function(e, t, n, i) {
            return UI.InfoMessage(e, t, "error", n, i)
        },
        SuccessMessage: function(e, t, n, i) {
            return UI.InfoMessage(e, t, "success", n, i)
        },
        InfoMessage: function(e, t, n, i, o) {
            $(".autoHideBox").remove(),
            t = t || 2e3;
            var a = o?.fade_out || "slow"
              , s = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
            function r(e) {
                e.remove(),
                "function" == typeof o.onRemoved && o.onRemoved()
            }
            i = i || s || $("body"),
            !0 === n && (n = "error");
            s = (o = o || {}).hasOwnProperty("is_html") && o.is_html ? e : "<p>" + e + "</p>";
            $("<div/>", {
                class: n ? "autoHideBox " + n : "autoHideBox",
                click: function() {
                    r($(this))
                },
                html: s
            }).appendTo(i).delay(t).fadeOut(a, function() {
                r($(this))
            })
        },
        OmgMessage: function(e, t, n, i, o, a="up") {
            n = n || "",
            o = o || $("#ds_body");
            var s = e.offset().left - o.offset().left + e.width() / 2
              , r = e.offset().top - o.offset().top
              , c = r + e.height() / 2
              , r = r + e.height() - 5;
            let d = $('<div class="omg-message-container">').css({
                top: Math.min(c - 10, r - 20),
                left: s - 150
            }).appendTo(o);
            e = $(`<span class="omg-message ${"up" === a ? "omg-up" : "omg-down"} ` + n + '"></span>').text(t);
            "object" == typeof i && null !== i && e.css(i),
            e.appendTo(d),
            setTimeout(function() {
                d.remove()
            }, 2e3)
        },
        BanneredRewardMessage: function(e, t) {
            var e = s('<div class="bannered-reward"><div class="bannered-reward-message">' + e + "</div></div>")
              , n = $(e).appendTo("body");
            t = t || 1800,
            setTimeout(function() {
                n.fadeOut(300, function() {
                    n.remove()
                })
            }, t)
        },
        ConfirmationBox: function(e, t, i, n, o, a) {
            var r, c, d;
            i = i || "confirmation-box",
            n = n || !1,
            o = o || !1,
            a = a && UI.ConfirmationSkipping.supported(),
            $("#fader").remove(),
            a && UI.ConfirmationSkipping.shouldSkip(i) ? ($.each(t, function(e, t) {
                !0 === t.confirm && (r = t.callback)
            }),
            r()) : 0 === $("#" + i).length && (!0 !== n && t.push({
                text: _("ea4788705e6873b424c65e91c2846b19"),
                callback: function() {},
                cancel: !0
            }),
            n = o ? "div" : "p",
            $("<div id='fader'><div class='confirmation-box' id='" + i + "' role='dialog' aria-labelledby='confirmation-msg'><div class='confirmation-box-content-pane'><div class='confirmation-box-content'>" + s("<%1 id='confirmation-msg' class='confirmation-msg'>%2</%3>", n, e, n) + (a ? '<div class="skip-container"><label><input type="checkbox" id="confirmation-skip"/>' + _("7019f1ebdfd76051fdae9fc39cd668f4") + "</label></div>" : "") + "<div class='confirmation-buttons'></div></div></div></div></div>").appendTo("body").css("z-index", "14999"),
            (o = $("#" + i)).outerWidth() % 2 == 1 && o.css("width", o.outerWidth() + 1 + "px"),
            c = o.find(".confirmation-buttons"),
            $("#mNotifyContainer").hide(),
            d = function(t, n) {
                return function(e) {
                    return $("#fader > .confirmation-box").parent().hide(),
                    $("#mNotifyContainer").show(),
                    $(document).off("keydown.confirmbox"),
                    a && n && $("#confirmation-skip").is(":checked") ? UI.ConfirmationSkipping.setShouldSkip(i, !0, function() {
                        t(e)
                    }) : t(e),
                    !1
                }
            }
            ,
            $(t).each(function(e, t) {
                var n = $("<button class='btn' aria-label'" + t.text + "'>" + t.text + "</button>").bind("click", d(t.callback, !0 === t.confirm)).appendTo(c);
                0 === e && n.focus(),
                !0 === t.confirm && n.addClass("evt-confirm-btn").addClass("btn-confirm-yes"),
                !0 === t.cancel && (n.addClass("evt-cancel-btn").addClass("btn-confirm-no"),
                $(document).on("keydown.confirmbox", null, "esc", d(t.callback)))
            }),
            e = o.find(".confirmation-box-content-pane"),
            n = window.innerHeight,
            "ios" === window.game_data.device && (n -= 50),
            e.css({
                "max-height": n - 60 + "px"
            }),
            (t = e.find(".confirmation-box-content")).outerHeight() > e.height()) && UI.SlimScroll(t, {
                height: "auto",
                alwaysVisible: !0
            })
        },
        closeConfirmationBox: function() {
            $("#fader").remove()
        },
        ConfirmationSkipping: {
            STORAGE_KEY: "confirmation_skipping_preferences",
            STORAGE_HASH_KEY: "confirmation_skipping_preferences_hash",
            preferences: {},
            preferences_hash: "",
            supported: function() {
                return Modernizr.localstorage
            },
            init: function(e) {
                this.loadFromClientStorage(),
                this.preferences_hash !== e && this.fetchPreferences()
            },
            shouldSkip: function(e) {
                return 1 === this.preferences[e]
            },
            setShouldSkip: function(e, t, n) {
                var i = this;
                TribalWars.post("api", {
                    ajaxaction: "skip_confirmation"
                }, {
                    confirmation_box_id: e,
                    should_skip: t
                }, function(e) {
                    i.updateFromServerData(e.preferences, e.preferences_hash),
                    "function" == typeof n && n()
                })
            },
            fetchPreferences: function() {
                var t = this;
                TribalWars.get("api", {
                    ajax: "skip_confirmation_preferences"
                }, function(e) {
                    t.updateFromServerData(e.preferences, e.preferences_hash)
                })
            },
            updateFromServerData: function(e, t) {
                this.preferences = e,
                this.preferences_hash = t,
                this.updateClientStorage(e, t)
            },
            updateClientStorage: function(e, t) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(e)),
                localStorage.setItem(this.STORAGE_HASH_KEY, t)
            },
            loadFromClientStorage: function() {
                var e = localStorage.getItem(this.STORAGE_KEY);
                null !== e && "undefined" !== e && (this.preferences = JSON.parse(e),
                this.preferences_hash = localStorage.getItem(this.STORAGE_HASH_KEY))
            }
        },
        getConfirmHandler: function(i) {
            return function(e) {
                e.preventDefault();
                var t = $(e.target)
                  , n = (t.hasClass("evt-confirm") || (t = t.parents(".evt-confirm")),
                i || t.data("confirm-msg"));
                return t.is("input, button") && UI.confirmSubmit(e, n),
                t.is("a") && UI.confirmLink(e, n),
                !1
            }
        },
        confirmLink: function(t, e) {
            UI.addConfirmBox(e, function() {
                var e = $(t.target).attr("href");
                void 0 === e && (e = $(t.target).closest("a").attr("href")),
                window.location = e
            })
        },
        confirmSubmit: function(e, t) {
            var n = $(e.target)
              , i = n.attr("name")
              , o = n.attr("value");
            i && o && ($("#submit-value-container").remove(),
            n.before("<input id='submit-value-container' type='hidden' name='" + i + "' value='" + o + "' />"));
            UI.addConfirmBox(t, function() {
                $(e.target).closest("form").submit()
            })
        },
        addConfirmBox: function(e, t) {
            t = [{
                text: _("70d9be9b139893aa6c69b5e77e614311"),
                callback: t,
                confirm: !0
            }];
            UI.ConfirmationBox(e, t)
        },
        AjaxPopup: function(e, s, t, r, c, n, d, l, u, f, i) {
            var p = $(".top_bar").height()
              , m = $.extend({
                dataType: "json",
                saveDragPosition: !0,
                container: "#ds_body"
            }, n);
            if (m.reload || 0 === $("#" + s).length) {
                var o, n = null, h = (!e || u && f || (n = e.srcElement || e.target,
                e = $(n).offset(),
                u = u || e.left,
                f = f || e.top + $(n).height() + 1),
                l = l || "auto",
                d = d || "auto",
                "#" + s);
                if (void 0 !== i)
                    if (0 < i.length)
                        for (o in i)
                            i.hasOwnProperty(o) && (h = h + ", " + i[o]);
                e = function(e) {
                    function t(e, t) {
                        var n = $(document).height() - $(e).outerHeight()
                          , i = $(document).width() - $(e).outerWidth();
                        e.draggable("option", "containment", [0, t, i, n])
                    }
                    var n = null
                      , i = (0 === $("#" + s).length ? (n = $("<div>").attr("id", s).addClass("popup_style").css({
                        width: d,
                        position: "fixed"
                    }),
                    o = $("<div>").attr("id", s + "_menu").addClass("popup_menu").html(r + '<a id="closelink_' + s + '" href="#">X</a>'),
                    i = $("<div>").attr("id", s + "_content").addClass("popup_content").css("height", l).css("overflow-y", "auto"),
                    n.append(o).append(i),
                    UI.Draggable(n, {
                        savepos: m.saveDragPosition
                    }),
                    n.bind("dragstart", function() {
                        document.onselectstart = function(e) {
                            e.preventDefault()
                        }
                    }),
                    n.bind("dragstop", function() {
                        document.onselectstart = function(e) {
                            $(e.target).trigger("select")
                        }
                    }),
                    $(m.container).append($('<div class="popup_helper"></div>').append(n)),
                    $("#closelink_" + s).click(function(e) {
                        e.preventDefault(),
                        $(h).toggle()
                    })) : n = $("#" + s),
                    c ? c.call(this, e, $("#" + s + "_content")) : $("#" + s + "_content").html(e),
                    $.cookie("popup_pos_" + s) ? (o = $.cookie("popup_pos_" + s).split("x"),
                    u = parseInt(o[0], 10),
                    f = parseInt(o[1], 10)) : m.saveDragPosition && $.cookie("popup_pos_" + s, u + "x" + f),
                    n.outerHeight())
                      , e = n.outerWidth()
                      , o = $(window).width()
                      , a = $(window).height();
                    (u = o < u + e ? o - e : u) < 0 && (u = 0),
                    (f = a < f + i ? a - i : f) < p && (f = p),
                    n.css("top", f).css("left", u);
                    t(n, p),
                    $(window).resize(function() {
                        t(n, p)
                    }),
                    n.show(),
                    UI.init()
                }
                ;
                "json" === m.dataType ? TribalWars.get(t, {}, e) : "prerendered" === m.dataType ? e(t) : $.ajax({
                    url: t,
                    dataType: m.dataType,
                    success: e
                })
            } else
                $("#" + s).show()
        },
        Notification: {
            SHOW_TIME: 6e3,
            _queue: [],
            _displayed_notifications: 0,
            show: function(e, t, n, i) {
                var o, a, s;
                window.mobile || (100 < (o = (o = $("#side-notification-container")).length ? o : $('<div id="side-notification-container"></div>').appendTo("body")).position().top || this._displayed_notifications < 1 ? ((a = $('<div class="side-notification"><div class="img-container"><img src="' + e + '" alt="" /></div><div class="content"><strong>' + t + "</strong><p>" + n + "</p></div></div>")).on("click", i).prependTo(o).addClass("side-notification-visible"),
                this._displayed_notifications++,
                s = this,
                setTimeout(function() {
                    s.removeNotification(a)
                }, this.SHOW_TIME)) : this._queue.push({
                    img: e,
                    title: t,
                    content: n,
                    callback: i
                }))
            },
            showNext: function() {
                var e;
                this._queue.length < 1 || (e = this._queue.shift(),
                this.show(e.img, e.title, e.content, e.callback))
            },
            removeNotification: function(t) {
                function n() {
                    t.remove(),
                    e._displayed_notifications--,
                    e.showNext()
                }
                var e = this;
                Modernizr.cssanimations ? (t.removeClass("side-notification-visible").addClass("side-notification-hide"),
                t.on("transitionend webkitTransitionEnd", function(e) {
                    t.off(e).addClass("side-notification-shrink").on("transitionend webkitTransitionEnd", function() {
                        n()
                    })
                })) : n()
            },
            debug: function() {
                this.show("/user_image.php?award=award1&level=4", "Achievement unlocked!", "Demolisher (Gold - Level 4) - Destroy 10.000 building levels using catapults")
            }
        },
        FormAbandon: {
            active: t = !1,
            verify: function(e) {
                if (UI.FormAbandon.active)
                    return e.stopImmediatePropagation(),
                    _("a8658061929ca8148ce4bf95935e72c6")
            },
            init: function() {
                var e;
                "steam" !== window.game_data.device && ($(window).on("beforeunload", UI.FormAbandon.verify),
                (e = $(".confirm_abandonment")).change(function() {
                    UI.FormAbandon.active = !0
                }),
                e.submit(function() {
                    UI.FormAbandon.active = !1
                }))
            }
        },
        FormAllowOneSubmission: {
            init: function() {
                $(".submit-once").each(function() {
                    UI.FormAllowOneSubmission.registerForm(this)
                })
            },
            registerForm: function(e) {
                var t = $(e);
                t.submit(function(e) {
                    t.data("lock-submission") ? e.preventDefault() : UI.FormAllowOneSubmission.lockForm(t)
                }),
                t.removeClass("submit-once")
            },
            lockForm: function(e) {
                e.data("lock-submission", 1),
                e.find("input[type=submit]").addClass("btn-disabled")
            }
        },
        onResizeEnd: function(e, t) {
            UI.Resize.end_handlers.push(t),
            $(e).on("resize.end", function(e) {
                clearTimeout(UI.Resize.timeout),
                UI.Resize.timeout = setTimeout(function() {
                    UI.Resize.callEndHandlers(e)
                }, 50)
            })
        },
        Resize: {
            timeout: null,
            end_handlers: [],
            callEndHandlers: function(e) {
                for (var t = 0; t < this.end_handlers.length; t++)
                    this.end_handlers[t](e)
            }
        },
        Help: {
            init: function() {
                $(".help_link").off("click").click(function(e) {
                    e.preventDefault();
                    e = $(this);
                    UI.Help.open(e.data("topic"), e.data("section"))
                })
            },
            open: function(e, t) {
                Dialog.fetch("ingame_help", "api", {
                    ajax: "help",
                    topic: e,
                    section: t
                })
            }
        }
    }
}
)(),
$(document).ready(function() {
    UI.init()
});

;let QuickCommands = {
    init: () => {
        var e = new URL(window.location.href)
          , a = e.searchParams.get("template_id")
          , e = e.searchParams.get("checkbox_id");
        TWMap.onCommandChange = function(e) {
            e = $(e.target);
            TWMap.troop_template_command = e.prop("checked") ? e.prop("name") : ""
        }
        ;
        let t = $("#troop_template_selection")
          , i = $('#quick_command_inputs input[type="checkbox"]');
        i.on("change", TWMap.onCommandChange),
        a && $("#troop_template_selection").val(a),
        e && $("#" + e).click(),
        t.on("change", function() {
            0 == t.val() ? (i.prop("checked", !1),
            i.prop("disabled", !0).next().attr("disabled", !0),
            i.trigger("change"),
            QuickCommands.removeCheckboxIdFromVillageSwitch(),
            QuickCommands.removeTemplateIdFromVillageSwitch()) : (i.prop("disabled", !1).next().removeAttr("disabled"),
            TWMap.troop_template_id = t.val(),
            QuickCommands.addTemplateIdToVillageSwitch(t.val()))
        }),
        i.on("change", function(e) {
            var e = $(e.target)
              , a = e.prop("id");
            e.prop("checked") ? (i.filter(":not(#" + a + ")").prop("checked", !1).next().removeClass("active"),
            e.next().addClass("active"),
            QuickCommands.addCheckboxToVillageSwitch(a)) : (e.next().removeClass("active"),
            QuickCommands.removeCheckboxIdFromVillageSwitch())
        }),
        t.trigger("change")
    }
    ,
    addTemplateIdToVillageSwitch: a => {
        QuickCommands.manipulateVillageChangeUrls(e => {
            e.searchParams.delete("template_id"),
            e.searchParams.set("template_id", a)
        }
        )
    }
    ,
    removeTemplateIdFromVillageSwitch: () => {
        QuickCommands.manipulateVillageChangeUrls(e => {
            e.searchParams.delete("template_id")
        }
        )
    }
    ,
    addCheckboxToVillageSwitch: a => {
        QuickCommands.manipulateVillageChangeUrls(e => {
            e.searchParams.delete("checkbox_id"),
            e.searchParams.set("checkbox_id", a)
        }
        )
    }
    ,
    removeCheckboxIdFromVillageSwitch: () => {
        QuickCommands.manipulateVillageChangeUrls(e => {
            e.searchParams.delete("checkbox_id")
        }
        )
    }
    ,
    manipulateVillageChangeUrls: a => {
        var t = ["village_switch_right", "village_switch_left"];
        for (let e = 0; e < t.length; e++) {
            var i = $("#" + t[e])
              , l = i.attr("href")
              , l = new URL(l,window.location.origin);
            a(l),
            i.attr("href", l.toString())
        }
    }
};

;var BBCodes = {
    target: null,
    ajax_unit_url: null,
    ajax_building_url: null,
    init: function(t) {
        BBCodes.target = $(t.target),
        BBCodes.ajax_unit_url = t.ajax_unit_url,
        BBCodes.ajax_building_url = t.ajax_building_url
    },
    insert: function(t, o, e) {
        var r, i, a, c, l = BBCodes.target[0];
        return l.focus(),
        void 0 !== document.selection ? (a = (r = document.selection.createRange()).text,
        r.text = t + a + o,
        r = document.selection.createRange(),
        0 < a.length || 1 == e ? r.moveStart("character", t.length + a.length + o.length) : r.move("character", -o.length),
        r.select()) : void 0 !== l.selectionStart && (r = l.selectionStart,
        i = l.selectionEnd,
        a = l.value.substring(r, i),
        c = l.scrollTop,
        l.value = l.value.substr(0, r) + t + a + o + l.value.substr(i),
        0 < a.length || !0 === e ? (t.length,
        a.length,
        o.length) : t.length,
        l.setSelectionRange(r + t.length, i + t.length),
        l.scrollTop = c),
        !1
    },
    colorPickerToggle: function(t) {
        var o = $("#bb_color_picker_tx").first();
        if (o.unbind("keyup").keyup(function() {
            var t = $("#bb_color_picker_tx").first()
              , o = $("#bb_color_picker_preview").first();
            try {
                o.css("color", t.val())
            } catch (t) {}
        }),
        t)
            BBCodes.insert("[color=" + $(o).val() + "]", "[/color]");
        else {
            var e = [$("#bb_color_picker_c0").first(), $("#bb_color_picker_c1").first(), $("#bb_color_picker_c2").first(), $("#bb_color_picker_c3").first(), $("#bb_color_picker_c4").first(), $("#bb_color_picker_c5").first()];
            e[0].data("rgb", [255, 0, 0]),
            e[1].data("rgb", [255, 255, 0]),
            e[2].data("rgb", [0, 255, 0]),
            e[3].data("rgb", [0, 255, 255]),
            e[4].data("rgb", [0, 0, 255]),
            e[5].data("rgb", [255, 0, 255]);
            for (var r = 0; r <= 5; r++)
                e[r].unbind("click").click(function() {
                    BBCodes.colorPickColor($(this).data("rgb"))
                });
            BBCodes.colorPickColor(e[0].data("rgb"))
        }
        return $("#bb_color_picker").toggle(),
        !1
    },
    colorPickColor: function(t) {
        for (var o = 0; o < 6; o++)
            for (var e = 1; e < 6; e++) {
                var r = $("#bb_color_picker_" + e + o).first()
                  , i = (r || alert("bb_color_picker_" + e + o),
                o / 3)
                  , a = e / 4.5
                  , a = Math.pow(a, .5)
                  , c = Math.max(0, 255 * i - 255)
                  , l = Math.floor(Math.max(0, Math.min(255, t[0] * i * a + 255 * (1 - a) + c)))
                  , n = Math.floor(Math.max(0, Math.min(255, t[1] * i * a + 255 * (1 - a) + c)))
                  , i = Math.floor(Math.max(0, Math.min(255, t[2] * i * a + 255 * (1 - a) + c)));
                r.css("background-color", "rgb(" + l + "," + n + "," + i + ")"),
                r.data("rgb", [l, n, i]),
                r.unbind("click").click(function() {
                    BBCodes.colorSetColor($(this).data("rgb"))
                })
            }
    },
    colorSetColor: function(t) {
        var o = $("#bb_color_picker_preview").first()
          , e = $("#bb_color_picker_tx").first()
          , o = (o.css("color", "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"),
        t[0].toString(16))
          , r = t[1].toString(16)
          , t = t[2].toString(16)
          , o = o.length < 2 ? "0" + o : o
          , r = r.length < 2 ? "0" + r : r
          , t = t.length < 2 ? "0" + t : t;
        e.val("#" + o + r + t)
    },
    placePopups: function() {
        var t = $("#bb_button_size > span")
          , o = $("#bb_button_color > span")
          , e = $("#bb_button_tagging > span")
          , r = $("#bb_sizes")
          , i = $("#bb_color_picker")
          , a = $("#bb_tagging");
        $(document).width() || document.body.clientWidth;
        0 < t.length && r.offset({
            left: t.offset().left,
            top: t.offset().top + t.height() + 2
        }),
        0 < o.length && (r = o.offset().left + o.width() - i.width(),
        /MSIE 7/.test(navigator.userAgent) && (r -= 200),
        i.offset({
            left: r,
            top: o.offset().top + o.height() + 2
        })),
        0 < e.length && a.offset({
            left: e.offset().left,
            top: e.offset().top + e.height() + 2
        })
    },
    closePopups: function() {
        $("#bb_sizes").hide(),
        $("#bb_color_picker").hide(),
        $("#bb_tagging").hide()
    },
    setTarget: function(t) {
        BBCodes.target = t,
        $("#bb_popup_container").children().hide();
        var o = $("#bb_popup_container").detach();
        $(".bb_popup_container").remove(),
        t.before(o)
    },
    ajaxPopupToggle: function(t, o, e, r) {
        var i = $("#" + o);
        i && i.is(":visible") ? i.hide() : UI.AjaxPopup(t, o, e, r, null, {
            container: "#bb_popup_container"
        }, 200)
    },
    unitPickerToggle: function(t) {
        BBCodes.ajaxPopupToggle(t, "unit_picker", BBCodes.ajax_unit_url, _("e5771a362d88a71a657bfcd21ca54b3f"))
    },
    buildingPickerToggle: function(t) {
        BBCodes.ajaxPopupToggle(t, "building_picker", BBCodes.ajax_building_url, _("9fdd5aad7ea528df6738692b788cee0a"))
    },
    emojiToggle: function(t) {
        $("#bb_popup_container").off("click.emoji").on("click.emoji", ".emoji-selectable", function() {
            var t = (t = $(this).data("title")) || $(this).attr("title");
            BBCodes.insert(":" + t + ":", "")
        }),
        BBCodes.ajaxPopupToggle(t, "emoji_picker", TribalWars.buildURL("GET", "api", {
            ajax: "emoji",
            bbcode: 1
        }), _("68305e25f5788db069d06c54924af087"))
    }
};

;var ScriptAPI = {
    active: [],
    url: "",
    version: null,
    register: function(t, i, r, e) {
        function a(t, i) {
            if (!i)
                throw "ScriptAPI: parameter ('" + t + "') requires a value."
        }
        if ("" !== ScriptAPI.url) {
            a("scriptname", t),
            a("author", r),
            a("email", e),
            i = !0 === (i = "object" != typeof (i = "8.20" != i && "8.21" != i ? i : !0) || -1 == $.inArray(8.2, i) && -1 == $.inArray(8.21, i) ? i : !0);
            var c, n = {
                scriptname: t,
                version: 0,
                author: r,
                email: e,
                broken: !1
            }, p = !1;
            for (c in ScriptAPI.active)
                ScriptAPI.active[c].scriptname == t && (p = !0,
                n = ScriptAPI.active[c]);
            if (p || (ScriptAPI.active.push(n),
            ScriptAPI.save(n)),
            !n.broken && !i)
                throw n.broken = !0,
                ScriptAPI.notify(n),
                "Version incompatible!"
        }
    },
    notify: function(t) {
        var i = $("<li>").text(escapeHtml(t.scriptname) + " ");
        i.append($("<a>").attr("href", escapeHtml("mailto:" + t.email)).text("(" + _("91401f053501b716b4a695b048c9b827") + " " + escapeHtml(t.author) + ")")),
        $("#script_list").append(i),
        $("#script_warning").show()
    },
    save: function(t) {
        $.post(ScriptAPI.url, t)
    }
};

;var Premium;
Premium = {
    PromptBeforeSpendPreference: {
        UNSPECIFIED: null,
        NO: 0,
        YES: 1
    },
    initChecks: function() {
        $(".evt-check-pp").on("click", function() {
            var e, a, t = $(this);
            return t.attr("disabled") || (e = t.data("feature"),
            a = t.data("cost"),
            t.addClass("btn-disabled"),
            Premium.check(e, a, function() {
                document.location = "#" != t.attr("href") ? t.attr("href") : t.data("url")
            })),
            !1
        }).removeClass("evt-check-pp")
    },
    check: function(a, e, t, i, n, r, o) {
        e ? (void 0 === i && (i = 0),
        void 0 === n && (n = 0),
        void 0 === o && (o = 0),
        r = $.extend({
            createContentHtml: function(e) {
                return e
            }
        }, r),
        TribalWars.get("api", {
            feature: a,
            costs: e,
            days: i,
            save: n,
            ajax: "check_premium",
            sub_feature_id: o
        }, function(e) {
            e.insufficient_pp ? Dialog.show("pp", e.insufficient_pp) : e.prompt ? Premium.openConfirmationPrompt({
                feature: a,
                content: r.createContentHtml(e.prompt),
                okayCallback: t,
                always_prompt: e.always_prompt,
                prompt_preference: e.prompt_preference,
                id: r.id || null
            }) : t()
        })) : t()
    },
    checkElement: function(e, a, t=0, i=0, n={}) {
        var r = e.dataset.feature
          , o = e.dataset.cost
          , e = e.dataset.subFeatureId || "0";
        this.check(r, o, a, t, i, n, e)
    },
    openConfirmationPrompt: function(t) {
        var e = function() {
            var e, a = $("#pp_prompt");
            return !!a.length && (e = t.prompt_preference,
            (a = a.is(":checked") ? Premium.PromptBeforeSpendPreference.NO : Premium.PromptBeforeSpendPreference.YES) !== e) && (Premium.setPromptPreference(t.feature, a, t.okayCallback),
            !0)
        }
          , a = t.content
          , i = (t.always_prompt || (a = (a += "<br/></br>") + this.createPromptPreferenceHtml(t.prompt_preference)),
        [{
            text: _("70d9be9b139893aa6c69b5e77e614311"),
            callback: function() {
                e() || t.okayCallback()
            },
            confirm: !0
        }]);
        UI.ConfirmationBox(a, i, t.id, !1, !0)
    },
    createPromptPreferenceHtml: function(e) {
        return '<label><input type="checkbox" id="pp_prompt" ' + (e === Premium.PromptBeforeSpendPreference.UNSPECIFIED ? 'checked="checked"' : "") + "/>" + _("7019f1ebdfd76051fdae9fc39cd668f4") + "</label>"
    },
    setPromptPreference: function(e, a, t) {
        TribalWars.post("api", {
            ajaxaction: "set_premium_prompt",
            feature: e,
            preference: a
        }, {}, function() {
            t()
        })
    },
    buy: function(e) {
        mobile ? TribalWars.redirect("premium", {
            mode: "premium"
        }) : (Dialog.close(),
        e = $.extend({
            action: "buy_premium"
        }, e),
        e = TribalWars.buildURL("GET", "api", e),
        e = this.getBuyDialogHTML(e),
        $("body").append(e),
        document.getElementById("payment_fader").addEventListener("click", Premium.closeBuy),
        $(window).off("message", Premium.handleMessage).on("message", Premium.handleMessage))
    },
    openCashShop: function(e) {
        e = $.extend({
            ajax: "get_cashshop"
        }, e);
        Dialog.fetch("cash_shop", "api", e, function() {
            $(".cs-close-btn").on("click", function() {
                Dialog.close()
            })
        }, {
            class_name: "cs-dialog",
            allow_close: !0,
            show_close_button: !1
        })
    },
    showEasyPay: function(e) {
        var a, t, i;
        $("#pay_frame").length || (a = 244,
        e = $('<iframe id="pay_frame" style="position: absolute; width: 244px; height: 530px" frameborder="0" src="' + e + '" />'),
        i = $("#main_layout").offset().left,
        t = $("#topContainer").height() + 10,
        i = a < i ? i - a : $("#premium_points_buy").offset().left - 122,
        e.css({
            zIndex: 1e3,
            top: t + "px",
            left: i + "px"
        }),
        e.on("load", function() {
            TribalWars.hideLoadingIndicator()
        }),
        TribalWars.showLoadingIndicator(),
        $("body").append(e),
        $(window).off("message", Premium.handleMessage).on("message", Premium.handleMessage))
    },
    handleMessage: function(e) {
        var a = e.originalEvent.data
          , e = ("close_easypay_window" === a ? Premium.closeBuy() : "open_payment_window" === a ? (Premium.closeBuy(),
        Premium.buy({
            force: "full"
        })) : "payment_window_transaction_success" === a && (Premium.closeBuy(),
        Premium.showTransactionCompleteMessage()),
        "CloseCashshop" === a && Premium.closeBuy(),
        Premium.extractEventData(e.originalEvent.data));
        e && "Shop/close" === e.name && Premium.closeBuy(),
        "Cashshop/close" === a.name && (e = a.data && a.data.continueShopping,
        Premium.closeBuy(),
        e || Dialog.close())
    },
    extractEventData: function(e) {
        var a = new RegExp("^([^/]+)/([^:]+)(?::(.+))?$");
        if ("string" != typeof e)
            return !1;
        e = e.match(a);
        if (null === e || 4 !== e.length)
            return !1;
        a = {};
        if (void 0 !== e[3])
            try {
                a = JSON.parse(e[3])
            } catch (e) {
                return !1
            }
        return {
            context: e[1],
            method: e[2],
            name: e[1] + "/" + e[2],
            data: a
        }
    },
    showTransactionCompleteMessage: function() {
        var e = '<div style="max-width: 450px" class="popup_box_header"><h2>' + _("6d8c88550a438c916fae3407e6bc18aa") + "</h2>"
          , e = (e = (e += '<img src="' + window.image_base + 'premium/coinbag_large.png" class="float_right" style="margin: 0 5px" />') + ("<p>" + _("2bbb8a9cd3ad3b17611172920f72c532") + "</p>")) + ("<p>" + _("8e37a4c59b3c791bac050f7e7b58973b") + "</p>") + "</div>";
        Dialog.show("payment_success", e)
    },
    showFeatureTrialNotification: function() {
        Dialog.fetch("feature_trial", "premium", {
            ajax: "trial_dialog"
        })
    },
    closeBuy: function() {
        $("#payment_fader, #payment_box").remove(),
        TribalWars.track("pay_window_close", [])
    },
    features: {
        init: function() {
            $(".premium-offer").on("change", this.updatePrices),
            this.updatePrices();
            var e = $(".premium-sub");
            e.find("button").on("click", function() {
                var e = $(this).attr("name");
                $(this).parents("form").data("intent", e)
            }),
            e.on("submit", function() {
                var e, a, t, i, n, r, o = $(this);
                if (!o.data("confirmed"))
                    return e = o.data("cost"),
                    a = o.data("feature"),
                    t = o.data("days"),
                    i = "gift" === o.data("intent") ? 1 : 0,
                    n = o.data("sub_feature_id"),
                    (r = (r = o.find("input[name=intent]")).length ? r : $('<input type="hidden" name="intent" />').appendTo(o)).val(o.data("intent")),
                    Premium.check(a, e, function() {
                        o.data("confirmed", !0),
                        o.submit()
                    }, t, i, void 0, n),
                    !1
            })
        },
        updatePrices: function() {
            $(".premium-offer, input[name=offer]").each(function() {
                var e = $(this).find("option:selected")
                  , a = $(this).parents("form")
                  , t = (e = e.length ? e : $(this)).data("feature")
                  , i = e.data("costs")
                  , n = e.data("days")
                  , e = e.data("sub_feature_id");
                a.data("cost", i),
                a.data("days", n),
                a.data("feature", t),
                a.data("sub_feature_id", e),
                $("#premium-cost-" + t).text(s(_("b200717de770e245641700fd15a1beaa"), i))
            })
        },
        toggleAutoExtend: function(e) {
            TribalWars.post("premium", {
                ajaxaction: "auto_renew",
                feature: e.value,
                active: e.checked ? 1 : 0
            }, null, function(e) {
                var a = e.active ? _("bb9e8c9104f8b9774720ead1131053b6") : _("152f3ed78e900e646348d6118807acd7");
                e.extended_now ? (a += _("bfcb588125f265c36b977867e7bc845c"),
                document.location.reload(),
                $.cookie("success_message", a)) : UI.SuccessMessage(a)
            })
        }
    },
    directBuy: {
        init: function() {
            $(".premium_direct_buy").click(function() {
                return Premium.directBuy.beginBuy($(this).data("feature")),
                !1
            })
        },
        beginGift: function(e, a) {
            Dialog.fetch("sub_gift", "premium", {
                ajax: "direct_gift_dialog",
                feature: a,
                player_id: e
            }, function() {
                Premium.features.init(),
                $(".direct-buy-form").on("submit", Premium.directBuy.finishBuy)
            }, {
                class_name: "noborder"
            })
        },
        beginBuy: function(e) {
            "ios" === window.game_data.device ? TribalWars.redirect("premium") : Dialog.fetch("sub_buy", "premium", {
                ajax: "direct_buy_dialog",
                feature: e
            }, function() {
                Premium.features.init(),
                $(".direct-buy-form").on("submit", Premium.directBuy.finishBuy)
            }, {
                class_name: "noborder"
            })
        },
        finishBuy: function() {
            var e = $(".direct-buy-form");
            return e.data("confirmed") && (e = e.serializeArray(),
            TribalWars.post("premium", {
                ajaxaction: "accept"
            }, e, function(e) {
                e.hasOwnProperty("feature_was_activated") ? window.location.reload() : e.hasOwnProperty("redirect") ? window.location = e.redirect : (UI.SuccessMessage(e.success),
                Dialog.close())
            })),
            !1
        }
    },
    showBlocked: function() {
        Dialog.fetch("blocked_points", "premium", {
            ajax: "blocked_points"
        })
    },
    getBuyDialogHTML: function(e) {
        return `<div id="payment_fader" class="fader"></div>
            <div id="payment_box" class="payment-container">
                <div id="payment_box_iframe_container">
                    <iframe id="pay_frame" class="payment-frame" src="${e}">
                        <a href="${e}">&raquo; ${_("97c1a400599b7a5e4995794218e32370")}</a>
                    </iframe>
                </div>
                <div id="payment_box_loading">
                    <img src="/graphic/loading.gif"> ${_("8524de963f07201e5c086830d370797f")}
                </div>
            </div>

            <script>
                $('#pay_frame').on('load', function () {
                    $('#payment_box_loading').fadeOut().remove();
                });
            </script>`
    }
},
$(function() {
    Premium.directBuy.init()
});

;var Quests;
Quests = {
    quests: {},
    open_quest_id: null,
    handlers: {
        quest_completed: []
    },
    setQuestData: function(e, t) {
        var s;
        "app" !== window.game_data.device && (s = !1,
        $.each(e, function(e, t) {
            Quests.hasQuest(e) ? Quests.getQuest(e).updateData(t) : "completed" !== t.state && Quests.addQuest(t),
            0 == t.opened && 0 == t.hide && (s = !0)
        }),
        !0 === t && $.each(Quests.quests, function(e, t) {
            Quests.quests.hasOwnProperty(e) || Quests.removeQuest(e)
        }),
        game_data.quest.use_questlines && Questlines.setNewLabel(s),
        "undefined" != typeof QuestArrows) && QuestArrows.init()
    },
    getAll: function() {
        return Quests.quests
    },
    hasQuest: function(e) {
        return Quests.quests.hasOwnProperty(e)
    },
    getQuest: function(e) {
        return Quests.quests[e]
    },
    addQuest: function(e) {
        Quests.quests[e.id] = new Quest(e)
    },
    removeQuest: function(e) {
        delete Quests.quests[e]
    },
    handleButton: function(e) {
        return "guest_register" === e && GuestRegister.showDialog(),
        !1
    },
    onQuestCompleted: function(e) {
        this.handlers.quest_completed.push(e)
    },
    notifyQuestCompleted: function(t) {
        this.handlers.quest_completed.forEach(function(e) {
            e(t)
        })
    }
};

;var Quest;
Quest = function(e) {
    var t;
    this.getData = function() {
        return t
    }
    ,
    this.updateData = function(e) {
        "completed" === e.state || (t = e,
        !game_data.quest.use_questlines) || !e.finished || e.opened || game_data.admin || mobile || Questlines.showDialog(e.id, "main-tab")
    }
    ,
    this.complete = function(e, a) {
        void 0 === e && (e = !1),
        Dialog.close();
        var s = t.id;
        TribalWars.post("api", {
            ajaxaction: "quest_complete",
            quest: s,
            skip: e
        }, {}, function(e) {
            var t;
            e.reward ? UI.SuccessMessage(_("b6d49ae1eaf9aada42e9a800556eca8a") + "<br /><br />" + e.reward, 3e3) : UI.SuccessMessage(_("0bfb250526c8e5118112b06f9dedb0a1"), 3e3),
            Quests.removeQuest(s),
            mobile ? $("#quest-container").hide() : (t = e.detailed,
            $.each(t, function(e, t) {
                t.hasOwnProperty("resources") && $.each(t.resources, function(e, t) {
                    TribalWars.showResourceIncrease(e, t)
                })
            })),
            Quests.notifyQuestCompleted(s),
            null != a && setTimeout(function() {
                a(e)
            }, 2500)
        })
    }
    ,
    this.getArrowState = function() {
        var e = "active";
        return t.finished ? e = "finished" : t.opened || (e = "new"),
        5 === t.quest_system && (e += "_nqs"),
        e
    }
    ,
    this.updateData(e)
}
;

;var QuestArrows = {
    firstInit: !0,
    arrows: {
        1e3: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_wood_1",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1005: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_stone_1",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_iron_1",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1010: {
            new: {
                arrow: "left",
                target: "#quest_1010"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: {
                    arrow: "down",
                    target: "#main_buildlink_wood_1",
                    remember: "click"
                },
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            },
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_wood_2",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_stone_2",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1015: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_main_2",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1020: {
            new: {
                arrow: "left",
                target: "#quest_1020"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_stone_1",
                    remember: "click"
                }, {
                    arrow: "down",
                    target: "#main_buildlink_iron_1",
                    remember: "click"
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            },
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_wood_3",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_stone_3",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1025: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_main_3",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_barracks_1",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1030: {
            new: {
                arrow: "left",
                target: "#quest_1030"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_wood_2",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_stone_2",
                    remember: "click",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            },
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_farm_2",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_storage_2",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1040: {
            new: {
                arrow: "left",
                target: "#quest_1040"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: {
                    arrow: "down",
                    target: "#main_buildlink_main_2",
                    remember: "click"
                },
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1050: {
            new: {
                arrow: "left",
                target: "#quest_1050"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_main_3",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_barracks_1",
                    remember: "click",
                    goal: 2
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1060: {
            new: {
                arrow: "left",
                target: "#quest_1060"
            },
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_wood_3",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }, {
                    arrow: "down",
                    target: "#main_buildlink_stone_3",
                    remember: "click",
                    goal: 2
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant2",
                    goal: 2
                }, {
                    arrow: "down",
                    target: "#main_buildlink_barracks_2",
                    remember: "click",
                    goal: 4
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1070: {
            active: {
                main: {
                    arrow: "down",
                    target: "#main_buildlink_storage_2",
                    remember: "click"
                }
            }
        },
        1090: {
            active: {
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_iron_2",
                    remember: "click"
                }, {
                    arrow: "down",
                    target: "#main_buildlink_storage_3",
                    remember: "click"
                }]
            }
        },
        1115: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                default: [{
                    arrow: "down",
                    target: '[data-tab="reward-tab"]',
                    remember: "click",
                    remember_id: "rewardtab",
                    zindex: 14e3
                }, {
                    arrow: "down",
                    target: ".reward-system-claim-button",
                    remember: "click",
                    remember_id: "reward",
                    zindex: 14e3
                }]
            }
        },
        1140: {
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_barracks, .visual-building-barracks1"
                },
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                },
                barracks: [{
                    arrow: "left",
                    target: "#spear_0",
                    remember: "keyup"
                }, {
                    arrow: "right",
                    target: ".btn-recruit",
                    remember: "click",
                    remember_id: "recruit"
                }]
            }
        },
        1150: {
            active: {
                barracks: [{
                    arrow: "left",
                    target: "#spear_0",
                    remember: "keyup",
                    goal: 1
                }, {
                    arrow: "right",
                    target: ".btn-recruit",
                    remember: "click",
                    remember_id: "recruit",
                    goal: 1
                }, {
                    arrow: "left",
                    target: "#quest_1150",
                    remember: "click"
                }],
                main: {
                    arrow: "down",
                    target: "#main_buildlink_barracks_3",
                    remember: "click"
                }
            }
        },
        1200: {
            new_nqs: {
                default: [{
                    arrow: "left",
                    target: "#new_quest",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#questline-header-2",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "left",
                    target: '.quest-link[data-quest-id="1200"]',
                    zindex: 14e3
                }]
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_barracks_2",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1205: {
            new_nqs: {
                default: [{
                    arrow: "left",
                    target: "#new_quest",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#questline-header-2",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "left",
                    target: '.quest-link[data-quest-id="1205"]',
                    zindex: 14e3
                }]
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-barracks1"
                },
                barracks: [{
                    arrow: "left",
                    target: "#spear_0",
                    remember: "keyup"
                }, {
                    arrow: "right",
                    target: ".btn-recruit",
                    remember: "click",
                    remember_id: "recruit"
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1215: {
            new_nqs: {
                default: [{
                    arrow: "left",
                    target: "#new_quest",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#questline-header-2",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "left",
                    target: '.quest-link[data-quest-id="1215"]',
                    zindex: 14e3
                }]
            },
            active_nqs: {
                default: {
                    arrow: "up",
                    target: "#header_menu_link_map"
                },
                map: [{
                    arrow: "left",
                    target: "#units_entry_all_spear",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "left",
                    target: "#units_entry_all_sword",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "up",
                    target: "#target_attack",
                    remember: "click",
                    zindex: 14e3
                }, {
                    arrow: "up",
                    target: "#troop_confirm_submit",
                    zindex: 14e3
                }]
            }
        },
        1255: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                arrow: "up",
                target: "#manager_icon_farm",
                remember: "click"
            }
        },
        1300: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-market1"
                },
                market: [{
                    arrow: "down",
                    target: "#main_buildlink_barracks_2",
                    remember: "click"
                }, {
                    arrow: "right",
                    target: "#id_own_offer",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#res_sell_amount",
                    remember: "keyup"
                }, {
                    arrow: "left",
                    target: "#res_sell_selection",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#res_buy_amount",
                    remember: "keyup"
                }, {
                    arrow: "left",
                    target: "#res_buy_selection",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#submit_offer",
                    remember: "click"
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        1810: {
            active: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: {
                    arrow: "down",
                    target: "#main_buildlink_statue_1",
                    remember: "click"
                }
            }
        },
        1820: {
            active: {
                default: {
                    arrow: "up",
                    target: "#header_menu_link_map"
                },
                map: [{
                    arrow: "left",
                    target: "#units_entry_all_spear",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#units_entry_all_sword",
                    remember: "click"
                }, {
                    arrow: "up",
                    target: "#target_attack",
                    remember: "click"
                }, {
                    arrow: "up",
                    target: "#troop_confirm_submit"
                }]
            }
        },
        1821: {
            active: {
                default: {
                    arrow: "up",
                    target: "#header_menu_link_map"
                },
                map: [{
                    arrow: "left",
                    target: "#units_entry_all_spear",
                    remember: "click"
                }, {
                    arrow: "left",
                    target: "#units_entry_all_sword",
                    remember: "click"
                }, {
                    arrow: "up",
                    target: "#target_attack",
                    remember: "click"
                }, {
                    arrow: "up",
                    target: "#troop_confirm_submit"
                }]
            }
        },
        1900: {
            active: {
                arrow: "up",
                target: "quest1900",
                remember: "click"
            }
        },
        7e3: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-main1"
                },
                main: [{
                    arrow: "down",
                    target: "#main_buildlink_statue_1",
                    remember: "click",
                    goal: 1
                }, {
                    arrow: "up",
                    target: ".btn-instant-free",
                    remember: "click",
                    remember_id: "instant",
                    goal: 1
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village"
                }
            }
        },
        7005: {
            new_nqs: {
                arrow: "left",
                target: "#new_quest"
            },
            active_nqs: {
                overview: {
                    arrow: "down",
                    target: "img.p_main, .visual-building-statue1",
                    remember: "click",
                    remember_target: 'area[data-building="statue"]',
                    remember_id: "statue"
                },
                statue: [{
                    arrow: "right",
                    target: ".btn-recruit",
                    remember: "click",
                    remember_id: "recruit"
                }],
                default: {
                    arrow: "left",
                    target: "#menu_row2_village",
                    remember: "click"
                }
            }
        }
    },
    sizes: {
        left: [67, 71],
        right: [67, 71],
        down: [70, 68],
        up: [70, 68]
    },
    custom_priority: {
        1115: 2,
        1020: 1
    },
    init: function() {
        var t, a, e;
        window.mobile || TribalWars.getSetting("disable_quest_arrows") || (t = Quests.getAll(),
        a = !1,
        $(".quest_arrow").remove(),
        $(".quest-arrow-target").removeClass("quest-arrow-target"),
        (e = Object.keys(t)).sort(function(e, r) {
            return QuestArrows.custom_priority.hasOwnProperty(e) && QuestArrows.custom_priority.hasOwnProperty(r) ? QuestArrows.custom_priority[r] - QuestArrows.custom_priority[e] : 0
        }),
        e.forEach(function(e) {
            var r = t[e].getArrowState();
            QuestArrows.arrows.hasOwnProperty(e) && QuestArrows.arrows[e].hasOwnProperty(r) && !a && (a = QuestArrows.showArrow(e, QuestArrows.arrows[e][r]))
        }),
        this.firstInit && (this.firstInit = !1,
        UI.onResizeEnd(window, this.onResize)))
    },
    onResize: function() {
        $(".quest_arrow").length && QuestArrows.init()
    },
    getTarget: function(e) {
        return $target = this.callbacks.hasOwnProperty(e) ? this.callbacks[e]() : $(e)
    },
    checkArrowEligibility: function(r, t) {
        if (t.hasOwnProperty("remember")) {
            var a = t.hasOwnProperty("remember_id") ? t.remember_id : QuestArrows.getTarget(t.target).attr("id");
            if (!a)
                return !1;
            if (QuestArrows.isRemembered(r, a))
                return !1
        }
        if (t.hasOwnProperty("goal")) {
            a = Quests.getQuest(r);
            let e;
            if (e = a ? a.getData().goals_completed : 0,
            t.goal & e)
                return !1
        }
        return !0
    },
    showArrow: function(t, a) {
        if (!a.hasOwnProperty("arrow")) {
            var e = a.hasOwnProperty(game_data.screen) ? a[game_data.screen] : a.default;
            if (!e)
                return !1;
            if (e.hasOwnProperty("arrow"))
                a = e;
            else {
                var i = !1;
                if ($.each(e, function(e, r) {
                    if (QuestArrows.checkArrowEligibility(t, r))
                        return a = r,
                        !(i = !0)
                }),
                !i)
                    return !1
            }
        }
        var e = a.arrow
          , r = this.sizes[e]
          , n = this.callbacks.hasOwnProperty(a.target) ? this.callbacks[a.target]() : $(a.target);
        if (!n || !n.length || n.is(":hidden"))
            return !1;
        if (a.hasOwnProperty("remember") && QuestArrows.isRemembered(t, a.hasOwnProperty("remember_id") ? a.remember_id : QuestArrows.getTarget(a.target).attr("id")))
            return !1;
        n.data("arrow") && (e = n.data("arrow"));
        var o = $('<img class="quest_arrow quest_arrow_' + e + '" src="/graphic/quests/ar_' + e + '.png" alt="" />')
          , r = (o.css({
            width: r[0] + "px",
            height: r[1] + "px"
        }),
        a.hasOwnProperty("zindex") && o.css({
            "z-index": a.zindex
        }),
        $("body").append(o),
        n.offset())
          , m = r.left
          , r = r.top - window.scrollY
          , l = n.outerWidth()
          , w = n.outerHeight()
          , s = !1;
        return n.parents().each(function() {
            s = s || "fixed" === $(this).css("position")
        }),
        this.positionArrow(o, m, r, l, w, e, n.css("z-index") + 1, s),
        n.addClass("quest-arrow-target"),
        a.hasOwnProperty("remember") && (o = n,
        (o = !a.hasOwnProperty("remember_target") || (o = $(a.remember_target)) && o.length && !o.is(":hidden") ? o : n).on(a.remember, function() {
            var e = a.hasOwnProperty("remember_id") ? a.remember_id : n.attr("id");
            QuestArrows.remember(t, e),
            QuestArrows.init()
        })),
        !0
    },
    remember: function(e, r) {
        window.sessionStorage.setItem(game_data.world + "_questprogress_" + e + "_" + r, !0)
    },
    isRemembered: function(e, r) {
        return null !== window.sessionStorage.getItem(game_data.world + "_questprogress_" + e + "_" + r)
    },
    positionArrow: function(e, r, t, a, i, n, o, m) {
        var l = this.sizes[n][0]
          , w = this.sizes[n][1]
          , s = 0
          , _ = 0;
        switch (n) {
        case "left":
            s = r + a + 5,
            _ = t + i / 2 - w / 2;
            break;
        case "right":
            s = r - l - 5,
            _ = t + i / 2 - w / 2;
            break;
        case "down":
            s = r + a / 2 - l / 2,
            _ = t - w - 5;
            break;
        case "up":
            s = r + a / 2 - l / 2,
            _ = t + i / 2 + 5
        }
        e.css({
            left: s + "px",
            top: _ + "px",
            "z-index": o,
            position: m ? "fixed" : "absolute"
        })
    },
    callbacks: {
        quest1900: function() {
            return !("am_farm" === game_data.screen || 500 <= parseInt(game_data.player.points)) && $("#manager_icon_farm")
        }
    }
};

;var VillageContext = {
    claim_enabled: !1,
    igm_enabled: !1,
    send_troops_enabled: !1,
    send_attack_disabled: !1,
    _button_order: {
        pa_own: ["info", "recruit", "map", "overview", "", "market", "place"],
        pa_other: ["info", "claim", "map", "", "fav", "market", "place"],
        free_own: ["info", "", "map", "overview", "", "market", "place"],
        free_other: ["info", "", "map", "", "", "market", "place"]
    },
    _circlePos: [[-12, -12], [-12, -49], [20, -30], [20, 6], [-11, 25], [-44, 6], [-44, -30], [20, -30], [20, 6]],
    _requires_extra: ["claim", "fav"],
    _buttons_created: [],
    _open: !1,
    _urls: {},
    _current_anchor: null,
    _titles: {
        info: _("f653a99b8cea306156b098ddba529800"),
        recruit: _("e1de43dd18d19451febfc1584ab33767"),
        map: _("b1522965c99b35ddbeacc9e7d61f4aea"),
        overview: _("abc78b929c795754af1ecd600e410ffb"),
        market: _("6354ccce785ae0a81233559b352600a5"),
        place: _("d79cca039b901d8ef0b137cf9f4dfe41"),
        claim: _("d4edb6698d9b8cd53de81c1453f4de09"),
        unclaim: "",
        fav: _("910885435dbc44a22b68cb45c79e4a7e"),
        unfav: _("6566f1e3ba3eca29eeeccd5eb86e93d9")
    },
    init: function(e) {
        "undefined" != typeof mobile && mobile || (e ? e.find(".village_anchor:not(.contexted)") : $(".village_anchor:not(.contexted)")).each(VillageContext.enableContext)
    },
    enableContext: function() {
        var e = $('<a class="ctx" href="#"></a>');
        $(this).append(e).addClass("contexted"),
        e.click(VillageContext.toggleForVillage)
    },
    toggleForVillage: function() {
        var e = $(this).parent()
          , a = e.data("id")
          , e = e.data("player");
        return VillageContext.beginShow($(this), a, e),
        !1
    },
    hide: function() {
        VillageContext._current_anchor && (VillageContext._current_anchor.removeClass("spin"),
        VillageContext._current_anchor = null),
        $(".village_ctx").hide(),
        $("body").unbind("click", VillageContext.hide),
        VillageContext._open = !1
    },
    beginShow: function(e, a, t) {
        this._open && this.hide(),
        VillageContext._current_anchor = e;
        var i = this
          , r = premium ? t == game_data.player.id ? this._button_order.pa_own : this._button_order.pa_other : t == game_data.player.id ? this._button_order.free_own : this._button_order.free_other
          , n = !1
          , c = ($.each(this._requires_extra, function(e, a) {
            !n && -1 == $.inArray(a, r) || (n = !0)
        }),
        e.parent().data("z-index"));
        n ? (VillageContext._current_anchor.addClass("spin"),
        TribalWars.get("api", {
            ajax: "village_context",
            id: a
        }, function(e) {
            e.error ? UI.ErrorMessage(e.error) : i.show(a, t, r, e, c)
        })) : (this.show(a, t, r, null, c),
        UI.ToolTip("[title]"))
    },
    show: function(n, c, e, o, l) {
        var s = this
          , _ = this._circlePos
          , a = s._current_anchor
          , d = a.offsetParent()
          , t = a.offset()
          , f = [t.left - d.offset().left + a.width() / 2 - parseInt(d.css("border-left-width")), t.top - d.offset().top + a.height() / 2 - parseInt(d.css("border-top-width"))]
          , t = a.data("offset-x")
          , a = a.data("offset-y");
        t && (f[0] += t),
        a && (f[1] += a),
        $(e).each(function(e, a) {
            var t, i, r;
            "" == a || ("market" == a || "place" == a) && n == game_data.village.id || !("claim" !== a || game_data.player.ally && VillageContext.claim_enabled) || !VillageContext.igm_enabled && "msg" === a || "place" == a && !VillageContext.send_troops_enabled || ("unclaim" == (a = "claim" == (a = "fav" == a && o.fav ? "unfav" : a) && o.claim ? "unclaim" : a) && (s._titles[a] = o.unclaim_title),
            t = s._titles[a],
            i = s._urls[a].replace(/__village__/, n).replace(/__owner__/, c).replace(/__source__/, game_data.village.id),
            -1 == $.inArray(a, s._buttons_created) ? (r = $('<a class="village_ctx" id="ctx_' + a + '" title="' + t + '" href=""></a>'),
            s._buttons_created.push(a)) : r = $("#ctx_" + a),
            i.match(/json/) ? s.ajaxRegister(r, a, i) : r.attr("href", i),
            l && r.css("z-index", l),
            r.attr("title", t),
            r.appendTo(d).css("left", f[0] + _[e][0] + "px").css("top", f[1] + _[e][1] + "px").stop().css("opacity", 0).show().fadeTo(120, 1))
        }),
        VillageContext._current_anchor.removeClass("spin"),
        $("body").bind("click", VillageContext.hide),
        this._open = !0
    },
    ajaxRegister: function(e, a, t) {
        e.unbind("click").click(function(e) {
            e.preventDefault();
            e = (new Date).getTime();
            if (!(this._last && e - this._last < 900))
                return this._last = e,
                $.ajax({
                    url: t,
                    dataType: "json",
                    success: function(e) {
                        VillageContext.ajaxDone(a, e)
                    }
                }),
                !1
        })
    },
    ajaxDone: function(e, a) {
        switch (this.hide(),
        e) {
        case "claim":
        case "unclaim":
            var t;
            a.code ? (a.notice && UI.InfoMessage(a.notice),
            "delete" == a.type ? (UI.SuccessMessage(_("4f922ce9065cf34bed61379b6ff46789")),
            a.id && ($("#reservation_" + a.id).fadeOut(),
            "info_player" == game_data.screen) && $("#reservation_" + a.village).hide()) : (UI.SuccessMessage(_("c1144d4424af216a7cf917edaca7e6c6")),
            "info_player" == game_data.screen && ((t = $("#reservation_" + a.village)).attr("src", Format.image_src("map/reserved_player.png")),
            t.attr("title", " :: " + _("51ead50e222e2f4550f2e0d104bb3854")),
            UI.ToolTip(t),
            t.show()))) : UI.ErrorMessage(a.error);
            break;
        case "fav":
        case "unfav":
            a.code ? "fav" == e ? UI.SuccessMessage(_("0313820c71668f1d90687f4763d945a2")) : UI.SuccessMessage(_("a4259c24bdcc98ffcd5fb2dad8daa1f2")) : UI.ErrorMessage(a.error, null, message_container)
        }
    }
};

;var Favicon = {
    update: function() {
        var a, i = document.createElement("canvas"), e = document.createElement("img"), o = document.getElementById("favicon").cloneNode(!0), d = Number(game_data.player.incomings);
        i.getContext,
        i.fillText;
        let l = "";
        l = d < 100 ? d.toString() : d < 1e3 ? "99+" : d < 1e4 ? d.toString().substring(0, 1) + "k" : ": O",
        e.onload = function() {
            i.height = i.width = 16,
            a = i.getContext("2d"),
            0 !== d ? (n = 8,
            e = 2.5,
            t = 11,
            1 === l.length ? (n = 12,
            e = 4.5,
            t = 12.3) : 2 === l.length && (n = 10,
            e = 1.5,
            t = 11),
            a.drawImage(this, 0, 0),
            a.font = "bold " + n + 'px "helvetica", sans-serif',
            a.fillStyle = "#333333",
            a.fillText(l, e, t),
            o.href = i.toDataURL("image/png")) : o.href = image_base + "favicon-32x32.webp";
            var e, t, n = document.getElementById("favicon");
            n.parentNode.removeChild(n),
            document.head.appendChild(o)
        }
        ,
        e.src = "/graphic/favicon_lit.png"
    }
};
$(function() {
    !document.getElementById("favicon") || "undefined" == typeof game_data || "undefined" != typeof mobile && mobile || Favicon.update()
});

;var WorldSwitch = {
    worldsURL: "",
    loaded: !1,
    init: function() {
        $(".evt-world-selection-toggle").click(function() {
            "none" == $("#world_selection_popup").css("display") ? WorldSwitch.show() : WorldSwitch.hide()
        })
    },
    hide: function() {
        $("#world_selection_clicktrap").hide(),
        $("#world_selection_popup").hide()
    },
    show: function() {
        function e() {
            $("#world_selection_clicktrap").show(),
            $("#world_selection_popup").show(),
            $("#world_selection_popup").css("left", $("#footer .evt-world-selection-toggle").offset().left - 10 + "px")
        }
        WorldSwitch.loaded ? e() : $.getJSON(WorldSwitch.worldsURL, function(t) {
            $("#servers-list-block").html(t.html),
            e(),
            WorldSwitch.loaded = !0
        })
    },
    submit_login: function(t) {
        return ($server_select_list = $("#server_select_list")).attr("action", $server_select_list.attr("action") + "&" + t),
        $server_select_list.submit(),
        !1
    }
};

;function selectVillage(e, l, o) {
    var a = window.location.href;
    -1 != a.search(/village=\w*/) ? a = a.replace(/village=\w*/, "village=" + e) : a += "&village=" + e,
    -1 != (a = a.replace(/action=\w*/, "")).search(/group=\w*/) ? a = a.replace(/group=\w*/, "group=" + l) : a += "&group=" + l,
    o ? window.open(encodeURI(a), "_blank") : window.location.href = encodeURI(a)
}

;var TribalWars;
TribalWars = {
    _script: "/game.php",
    _loadedJS: [],
    _onLoadHandler: null,
    _inputCache: {},
    _previousData: {},
    _data_update_stamps: {},
    _settings: {
        sound: !1
    },
    _tabID: null,
    _tabActive: !0,
    _tabTimeout: !1,
    _lastActivity: null,
    _lastSound: 0,
    _chat: null,
    _ah: {},
    constants: {},
    fetch: function(a, e, t) {
        this.registerOnLoadHandler(null),
        this.cacheInputVars(),
        e || this.showLoadingIndicator(),
        $.getJSON(a, function(a) {
            TribalWars.hideLoadingIndicator(),
            TribalWars.handleResponse(a),
            UI.init(),
            UnitPopup.initLinks(),
            "function" == typeof t && t()
        })
    },
    get: function(a, e, t, r, i) {
        a = this.buildURL("GET", a, e);
        this.request("GET", a, {}, t, r, i)
    },
    post: function(a, e, t, r, i, n) {
        a = this.buildURL("POST", a, e),
        e = a.match(/&h=([a-z0-9]+)/);
        e && "string" != typeof t && (a = a.replace(/&h=([a-z0-9]+)/, ""),
        "object" == typeof t && null != t ? t.hasOwnProperty("0") ? t.push({
            name: "h",
            value: e[1]
        }) : t.h = e[1] : t = {
            h: e[1]
        }),
        this.request("POST", a, t, r, i, n)
    },
    request: function(a, e, t, r, i, n) {
        !0 !== n && this.showLoadingIndicator();
        n = {
            "TribalWars-Ajax": 1
        };
        Object.keys(TribalWars._ah).length && (n = $.extend(TribalWars._ah, n),
        TribalWars._ah = {}),
        $.ajax({
            url: e,
            data: t,
            type: a,
            dataType: "json",
            headers: n,
            success: function(a) {
                TribalWars.hideLoadingIndicator(),
                TribalWars.handleResponse(a, r, i)
            },
            error: function(a, e) {
                TribalWars.hideLoadingIndicator(),
                0 !== a.readyState && (429 === a.status ? UI.ErrorMessage(_("f1ac6646f49d65cbe50901b805abfbf8"), 3e3) : 503 === a.status ? UI.ErrorMessage(_("b51a6b34f8d967218773e5ec33bf8a10")) : (UI.ErrorMessage(_("ba628a2fb8acbf8ab7c4c24c9714d893")),
                "function" == typeof i && i(a)))
            },
            complete: function() {
                UI.initDefaultTooltips()
            }
        })
    },
    redirect: function(a, e) {
        a = TribalWars.buildURL("GET", a, e);
        window.location.href = a
    },
    buildURL: function(a, e, t) {
        var r = "";
        return "string" == typeof e && ("/" === e.charAt() ? (r = e,
        "object" == typeof t && (e = t)) : e = $.extend({
            screen: e
        }, t)),
        "" === r && ("object" == typeof e && null !== e && void 0 !== e.village ? (r = TribalWars._script + "?village=" + e.village,
        delete e.village) : r = game_data.hasOwnProperty("village") ? TribalWars._script + "?village=" + game_data.village.id : TribalWars._script + "?village="),
        "object" == typeof e && null !== e && (r += "&" + $.param(e)),
        ("POST" === a || "object" == typeof e && null !== e && e.hasOwnProperty("action")) && -1 === r.indexOf("&h=") && (r += "&h=" + window.csrf_token),
        0 < game_data.player.sitter && (r += "&t=" + game_data.player.id),
        r
    },
    handleResponse: function(a, e, t) {
        if (TribalWars._previousData = $.extend(!0, {}, window.game_data),
        a.hasOwnProperty("redirect")) {
            var r = String(document.location)
              , i = r.indexOf(a.redirect);
            if (-1 === i || r.substring(i) !== a.redirect)
                return void (document.location = a.redirect)
        }
        a.hasOwnProperty("error") || a.hasOwnProperty("response") || a.hasOwnProperty("content") ? a.error ? ("object" == typeof a.error && (a.error = Object.values(a.error)),
        r = Array.isArray(a.error) && 1 < a.error.length ? '<ul style="list-style-type: none">' + a.error.map(function(a) {
            return "<li>" + a + "</li>"
        }).join("") + "</ul>" : Array.isArray(a.error) ? a.error[0] : a.error,
        UI.ErrorMessage(r),
        "function" == typeof t && t(r)) : a.bot_protect && BotProtect.isForced(a.bot_protect) ? (BotProtect.show(a.bot_protect),
        "function" == typeof t && t()) : (a.content && $("#content_value").html(a.content),
        a.content && (UI.ToolTip(".tooltip"),
        TribalWars.contentLoaded()),
        a.game_data && (i = window.game_data.screen,
        TribalWars.updateGameData(a.game_data),
        window.game_data.screen = i,
        setTimeout(function() {
            Timing.resetTickHandlers()
        }, 10)),
        a.quest_data && Quests.setQuestData(a.quest_data, !0),
        "partial_reload" === a.response ? $(document).trigger("partial_reload_end") : null !== a.response && "function" == typeof e && e(a.response),
        mobile ? TribalWars.updateHeaderOnMobile() : TribalWars.updateHeader(),
        a.bot_protect && BotProtect.show(a.bot_protect)) : UI.ErrorMessage(_("ba628a2fb8acbf8ab7c4c24c9714d893"))
    },
    updateGameData: function(t) {
        void 0 === window.game_data ? window.game_data = t : (TribalWars._previousData = $.extend(!0, {}, window.game_data),
        $.each(t, function(a, e) {
            "village" === a && e.id !== window.game_data.village.id || TribalWars.mergeGameDataProperty(a, e, t.time_generated, window.game_data, TribalWars._data_update_stamps)
        })),
        void 0 === window.game_data.village || Village.isPrototypeOf(window.game_data.village) || (window.game_data.village = $.extend(!0, Object.create(Village), window.game_data.village))
    },
    mergeGameDataProperty: function(t, a, r, i, n) {
        "object" == typeof a && null !== a ? ("object" != typeof n[t] && (n[t] = {}),
        i[t] || (i[t] = {}),
        $.each(a, function(a, e) {
            TribalWars.mergeGameDataProperty(a, e, r, i[t], n[t])
        })) : (!n.hasOwnProperty(t) || n[t] < r) && (i[t] = a,
        n[t] = r)
    },
    handleGameData: function(a) {
        TribalWars.updateGameData(a),
        mobile ? TribalWars.updateHeaderOnMobile() : TribalWars.updateHeader(),
        a.hasOwnProperty("village") && Timing.resetTickHandlers()
    },
    showLoadingIndicator: function() {
        $("#loading_content").show()
    },
    hideLoadingIndicator: function() {
        $("#loading_content").hide()
    },
    updateHeader: function() {
        window.game_data.hasOwnProperty("village") && ($("#storage").text(game_data.village.storage_max),
        (t = $("#pop_current_label")).text(game_data.village.pop),
        changeResStyle(t, Format.get_warn_pop_class(game_data.village.pop, game_data.village.pop_max, game_data.village.is_farm_upgradable)),
        $("#pop_max_label").text(game_data.village.pop_max),
        parseInt(this._previousData.player.rank) !== parseInt(game_data.player.rank) && (a = $("#rank_rank").html(game_data.player.rank_formatted),
        this._previousData.player.rank > game_data.player.rank) && (a.addClass("increased"),
        setTimeout(function() {
            a.removeClass("increased")
        }, 100)),
        parseInt(this._previousData.player.points) !== parseInt(game_data.player.points)) && (e = $("#rank_points").html(game_data.player.points_formatted),
        this._previousData.player.points < game_data.player.points) && (e.addClass("increased"),
        setTimeout(function() {
            e.removeClass("increased")
        }, 100)),
        $("#premium_points").text(game_data.player.pp);
        var a, e, t = $("#new_mail"), r = t.hasClass("new_mail_faded"), i = parseInt(game_data.player.new_igm), r = (0 < i && r ? t.removeClass("new_mail_faded").addClass("new_mail") : 0 !== i || r || t.hide(),
        $(".badge-mail").text(i ? " (" + i + ")" : ""),
        $("#new_report")), t = r.hasClass("new_report_faded"), i = parseInt(game_data.player.new_report), t = (0 < i && t ? r.removeClass("new_report_faded").addClass("new_report") : 0 !== i || t || r.hide(),
        $(".badge-report").text(i ? " (" + i + ")" : ""),
        parseInt(game_data.player.new_post_notification)), r = parseInt(game_data.player.new_forum_post), i = parseInt(game_data.player.new_ally_invite), n = parseInt(game_data.player.new_ally_application), s = r + i + n, o = $("#tribe_forum_indicator"), t = (o.removeClass("new_post no_new_post new_notification"),
        t ? o.addClass("new_notification").attr("title", _("e55d740659fcbd1e45213ffc5a872da6")) : r ? o.addClass("new_post").attr("title", _("3d17b7d7c59f2578040822fd6c08eee8")) : o.addClass("no_new_post").attr("title", _("fd41237025d00c9823b661d8691a3694")),
        $(".badge-ally-forum-post").text(r ? " (" + r + ")" : ""),
        $(".badge-ally-application").text(n ? " (" + n + ")" : ""),
        $(".badge-ally-invite").text(i ? " (" + i + ")" : ""),
        $("#menu_counter_ally").text(s ? " (" + s + ")" : ""),
        parseInt(game_data.player.sitter) ? 0 : parseInt(game_data.player.new_buddy_request)), o = parseInt(game_data.player.sitter) ? 0 : parseInt(game_data.player.new_daily_bonus), r = parseInt(game_data.player.new_items), n = t + r + o, i = ($(".badge-buddy").text(t ? " (" + t + ")" : ""),
        $(".badge-daily-bonus").text(o ? " (" + o + ")" : ""),
        $(".badge-inventory").text(r ? " (" + r + ")" : ""),
        $("#menu_counter_profile").text(n ? " (" + n + ")" : ""),
        $("#header_commands"));
        game_data.player.incomings !== this._previousData.player.incomings && (!i.hasClass("has_incomings") && 0 < parseInt(game_data.player.incomings) ? i.addClass("has_incomings") : i.hasClass("has_incomings") && 0 === parseInt(game_data.player.incomings) && i.removeClass("has_incomings"),
        $("#incomings_amount").text(game_data.player.incomings),
        Favicon.update()),
        window.premium && parseInt(game_data.player.supports) !== parseInt(this._previousData.player.supports) && (!i.hasClass("has_supports") && 0 < parseInt(game_data.player.supports) ? i.addClass("has_supports") : i.hasClass("has_supports") && 0 === parseInt(game_data.player.supports) && i.removeClass("has_supports"),
        $("#supports_amount").text(game_data.player.supports))
    },
    updateHeaderOnMobile: function() {
        $("#storage").text(game_data.village.storage_max),
        $("#pop_current_label").text(game_data.village.pop),
        $("#pop_max_label").text(game_data.village.pop_max);
        var a = $("#notify_mail")
          , a = ("none" === a.css("display") && 1 === parseInt(game_data.player.new_igm) ? a.show() : "none" !== a.css("display") && 0 === parseInt(game_data.player.new_igm) && a.hide(),
        $("#notify_report"))
          , a = ("none" === a.css("display") && 1 === parseInt(game_data.player.new_report) ? a.show() : "none" !== a.css("display") && 0 === parseInt(game_data.player.new_report) && a.hide(),
        $("#notify_forum"))
          , a = (1 === parseInt(game_data.player.new_forum_post) ? a.show() : a.hide(),
        $("#notify_incomings"))
          , a = (0 < parseInt(game_data.player.incomings) ? a.show() : a.hide(),
        a.find(".mNotifyNumber").last().text(game_data.player.incomings),
        $("#notify_supports"));
        0 < parseInt(game_data.player.supports) ? a.show() : a.hide(),
        a.find(".mNotifyNumber").last().text(game_data.player.supports)
    },
    cacheInputVars: function() {
        this._inputCache = {};
        var e = 0;
        $("#content_value, .popup_box").find("input[type=text]:visible").each(function() {
            var a = $(this);
            if (a.attr("id")) {
                if (20 < ++e)
                    return !1;
                TribalWars._inputCache["#" + a.attr("id")] = a.val()
            } else if (a.attr("name")) {
                if (20 < ++e)
                    return !1;
                TribalWars._inputCache["input[name=" + a.attr("name").replace("[", "\\[").replace("]", "\\]") + "]"] = a.val()
            }
        })
    },
    restoreInputVars: function() {
        $.each(this._inputCache, function(a, e) {
            $(a).val(e)
        })
    },
    contentLoaded: function() {
        this._onLoadHandler && this._onLoadHandler(),
        TribalWars.restoreInputVars()
    },
    registerOnLoadHandler: function(a) {
        this._onLoadHandler = a
    },
    shouldPartialLoad: function() {
        return !0
    },
    showResourceIncrease: function(a, e) {
        var t = $("#" + a).offset()
          , a = $('<span id="' + a + '_gain"></span>').text("+" + e);
        a.css({
            top: t.top - 8 + "px",
            left: t.left - 3 + "px"
        }),
        a.appendTo($("body")),
        a.animate({
            top: t.top - 20 + "px"
        }, 1600, "linear", function() {
            $(this).delay(500).fadeOut().remove()
        })
    },
    dev: function() {
        TribalWars.get("dev", {
            ajax: "options"
        }, function(a) {
            $(a.options).insertAfter(".server_info")
        })
    },
    playAttackSound: function() {
        !TribalWars._settings.sound || (new Date).getTime() - TribalWars._lastSound < 6e4 || (TribalWars.playSound("attack"),
        TribalWars._lastSound = (new Date).getTime())
    },
    playSound: function(a, e, t) {
        e = e || 1500;
        var a = '<audio autoplay><source src="' + image_base + "/sound/" + a + '.ogg" type="audio/ogg" /><source src="' + image_base + "/sound/" + a + '.mp3" type="audio/mpeg" /></audio>'
          , r = $(a).appendTo("body");
        setTimeout(function() {
            r.remove(),
            "function" == typeof t && t()
        }, e)
    },
    setSetting: function(a, e, t) {
        TribalWars.post("settings", {
            ajaxaction: "toggle_setting"
        }, {
            setting: a,
            value: e ? 1 : 0
        }, function(a) {
            TribalWars._settings = $.extend(TribalWars._settings, a),
            t && t()
        })
    },
    suppressHint: function(a, e) {
        TribalWars.post("settings", {
            ajaxaction: "suppress_hint"
        }, {
            hint: a
        }, function(a) {
            e && e()
        })
    },
    getSetting: function(a) {
        return TribalWars._settings[a]
    },
    initTab: function(a) {
        QuickBar.init(),
        Modernizr.localstorage && (this._tabID = a,
        TribalWars.setActivityHappened(),
        $("body").on("click keydown mouseenter", function() {
            TribalWars.setActivityHappened(),
            TribalWars._tabTimeout && (TribalWars.setActiveTab(),
            TribalWars._tabTimeout = !1)
        }),
        document.hidden || TribalWars.setActiveTab(),
        $(document).on("visibilitychange", function() {
            TribalWars.setActivityHappened(),
            document.hidden ? TribalWars.setInactiveTab() : TribalWars.setActiveTab()
        }),
        a99e5bbb616(),
        "undefined" == typeof Chat || !0 !== Boolean(TribalWars.getSetting("chat_enabled")) || Number(window.game_data.player.sitter) || (this._chat = new Chat))
    },
    setActiveTab: function() {
        localStorage.setItem("activetab", JSON.stringify([this._tabID, (new Date).getTime()])),
        localStorage.setItem("lastactivetab", this._tabID),
        TribalWars._tabActive = !0,
        TribalWars._tabTimer = setTimeout(function() {
            TribalWars.getIdleTime() < 18e4 ? TribalWars.setActiveTab() : TribalWars._tabTimeout = !0
        }, 1e3)
    },
    setInactiveTab: function() {
        TribalWars._tabTimer && clearInterval(TribalWars._tabTimer),
        localStorage.setItem("activetab", JSON.stringify(!1)),
        TribalWars._tabActive = !1
    },
    isTabActive: function() {
        return !document.hidden
    },
    isAnyTabActive: function() {
        var a;
        return !this._tabID || (a = JSON.parse(localStorage.getItem("activetab"))) && (new Date).getTime() - a[1] < 2500 && this.getIdleTime() < 18e4
    },
    wasLastActiveTab: function() {
        return this._tabID == localStorage.getItem("lastactivetab")
    },
    setActivityHappened: function() {
        TribalWars._lastActivity = (new Date).getTime()
    },
    getIdleTime: function() {
        return (new Date).getTime() - TribalWars._lastActivity
    },
    track: function(a, e) {
        TribalWars.post("tracking", {
            ajaxaction: "track"
        }, {
            event: a,
            params: e
        }, null, null, !0)
    },
    getGameData: function() {
        return window.game_data
    }
};

;var Village;
Village = {
    id: null,
    points: null,
    name: null,
    player_id: null,
    x: null,
    y: null,
    pop: null,
    pop_max: null,
    storage_max: null,
    wood: null,
    stone: null,
    iron: null,
    wood_float: null,
    stone_float: null,
    iron_float: null,
    wood_prod: null,
    stone_prod: null,
    iron_prod: null,
    last_res_tick: null,
    buildings: null,
    canAfford: function(l) {
        return new Resources(this.wood,this.stone,this.iron).hasEnough(l)
    },
    updateRes: function() {
        var t = this
          , l = Timing.getCurrentServerTime()
          , a = (l - t.last_res_tick) / 1e3
          , r = parseInt(t.storage_max);
        ["wood", "stone", "iron"].forEach(function(l) {
            var n = parseFloat(t[l + "_float"])
              , o = parseFloat(t[l + "_prod"])
              , n = Math.min(r, n + o * a);
            t[l + "_float"] = n,
            t[l] = Math.floor(n)
        }),
        t.last_res_tick = l
    }
};

;var Resources, ResourcesForecast, ResourcesForecaster;
( () => {
    function o(e, t, o) {
        if (!t || e[0] > o)
            return null;
        for (var s = 0, r = t - 1, n = r; 1 < n; ) {
            var a = s + (n >> 1);
            e[a] > o ? r = a - 1 : s = a,
            n = r - s
        }
        return e[r] > o ? e[s] : e[r]
    }
    function t() {}
    function r() {}
    t.prototype = {
        schedules: {
            wood: {},
            stone: {},
            iron: {}
        },
        items_count: {
            wood: 0,
            stone: 0,
            iron: 0
        },
        timestamps: {
            wood: [],
            stone: [],
            iron: []
        },
        getMostRecentItem: function(e, t) {
            t = o(this.timestamps[e], this.items_count[e], t);
            return null === t ? null : new n(t,this.schedules[e][t])
        }
    },
    r.prototype = $.extend(Object.create(t.prototype), {
        values: {
            wood: [],
            stone: [],
            iron: []
        },
        next_timestamps: {
            wood: {},
            stone: {},
            iron: {}
        },
        schedules_flipped: {
            wood: {},
            stone: {},
            iron: {}
        },
        getNextItem: function(e, t) {
            return void 0 === this.next_timestamps[e][t] ? null : (t = this.next_timestamps[e][t],
            new n(t,this.schedules[e][t]))
        },
        getItemAlmostAtValue: function(e, t) {
            t = o(this.values[e], this.items_count[e], t);
            return null === t ? null : new n(this.schedules_flipped[e][t.toString()],t)
        }
    });
    var n = function(e, t) {
        this.time = e,
        this.value = t
    };
    (Resources = function(e, t, o) {
        this.wood = e,
        this.stone = t,
        this.iron = o
    }
    ).prototype = {
        hasEnough: function(e) {
            return this.wood >= e.wood && this.stone >= e.stone && this.iron >= e.iron
        },
        maxAffordableUnits: function(e) {
            var t = e.wood ? this.wood / e.wood : 0
              , o = e.stone ? this.stone / e.stone : 0
              , e = e.iron ? this.iron / e.iron : 0;
            return Math.floor(Math.min(t, o, e))
        }
    },
    Resources.types = ["wood", "stone", "iron"],
    Resources.names = {
        wood: _("6e4dd7ce4ea3c1d4a90edb289e22da98"),
        stone: _("ed5eace1bd098cdced7685864b09c291"),
        iron: _("cefa8a9606819ed409dc761ca6080887")
    },
    (ResourcesForecast = function(e, t) {
        this.available = e,
        this.when = t
    }
    ).AVAILABLE_NEVER = "never",
    ResourcesForecast.AVAILABLE_NOW = "now",
    ResourcesForecast.AVAILABLE_FUTURE = "future",
    ResourcesForecast.prototype = {
        toHTML: function(e, t) {
            var o;
            return e = e || _("c131ac6751200713be7ad27065413f89"),
            this.available === ResourcesForecast.AVAILABLE_NEVER ? _("1228deb87af18530e809c8cf4534e814") : this.available === ResourcesForecast.AVAILABLE_NOW ? e : (o = this.when - Timing.getCurrentServerTime() / 1e3) <= 120 ? t ? s(_("1b3358ab233b3c3df7d47af2c2ea115e"), getTimeString(Math.round(o))) : (t = '<span class="timer_replace">' + getTimeString(Math.round(o)) + "</span>",
            "<span>" + s(_("1b3358ab233b3c3df7d47af2c2ea115e"), t) + "</span>" + ('<span style="display:none">' + e + "</span>")) : s(_("75b113c1ba03c76292b56a170fa00b28"), Format.date(getLocalTimeAsFloat() + o))
        },
        toString: function() {
            return this.toHTML("", !0)
        }
    },
    ResourcesForecaster = {
        getForecast: function(e, t, o, s) {
            var r = new Resources(t.wood_float,t.stone_float,t.iron_float)
              , n = new Resources(t.wood_prod,t.stone_prod,t.iron_prod)
              , a = Timing.getCurrentServerTime() / 1e3
              , c = e
              , i = r
              , u = n
              , d = a
              , e = t.storage_max
              , l = o
              , h = s;
            if (Math.max(c.wood, c.stone, c.iron) > e)
                return new ResourcesForecast(ResourcesForecast.AVAILABLE_NEVER);
            if (i.hasEnough(c))
                return new ResourcesForecast(ResourcesForecast.AVAILABLE_NOW,d);
            d = Math.ceil(d);
            var m = {}
              , e = (Resources.types.forEach(function(e) {
                var t, o, s, r = c[e];
                i[e] >= r ? m[e] = d : (o = h.getMostRecentItem(e, d),
                o = Number(o.value) + u[e] * (d - o.time),
                o = Number(i[e]) - o,
                s = h.getItemAlmostAtValue(e, r - o),
                o = Number(s.value) + o,
                s = s.time,
                o < r && (t = s <= d ? u[e] : l.getMostRecentItem(e, s).value,
                r = s + Math.ceil((r - o) / t),
                s = r = null !== (o = h.getNextItem(e, s)) ? Math.min(r, o.time) : r),
                m[e] = s)
            }),
            Math.max(m.wood, m.stone, m.iron));
            return new ResourcesForecast(ResourcesForecast.AVAILABLE_FUTURE,e)
        },
        fetchSchedules: function(e, t) {
            TribalWars.get("api", {
                ajax: "resources_schedule",
                id: e
            }, function(e) {
                void 0 === e.invalid_village && "function" == typeof t && t({
                    time_generated: e.time_generated,
                    rates: ResourcesForecaster.Factory.createResourcesSchedule(e.rates),
                    amounts: ResourcesForecaster.Factory.createResourcesInVillageSchedule(e.amounts)
                })
            })
        },
        Factory: {
            createResourcesSchedule: function(e) {
                return $.extend(new t, e)
            },
            createResourcesInVillageSchedule: function(e) {
                return $.extend(new r, e)
            }
        }
    }
}
)();

;var Format;
Format = {
    month_names: [_("f0eadcecffbb5f66bf549645d20bd0cd"), _("b8a8de82dd0387e97241d76edb64c78e"), _("99d26c335ff06a1f4f32e1b78ccc0855"), _("2d0ea4e2a5d29e1321ae6d9ff1861052"), _("c0a48f32c11d4e56173d7bb151154236"), _("00a5cf879180a196bf1720187b4a29ba"), _("23176c991f48ba3a17942b82cc7787b2"), _("19c1b76c51e0eb5d5c92221e6e891bad"), _("1f17626a373b6a69f8287ed8781e1e0a"), _("4caa55b7c609d00fb95f03cd1ceafeab"), _("b575d8d37fffa782cfa3592d1cfc65da"), _("a0bccd9315fa3e38aef93f34cd116aa9")],
    date: function(e, a, t, r, n) {
        t = void 0 !== t && t,
        r = void 0 !== r && r,
        n = void 0 === n || n;
        function o(e, a) {
            return a = a || 2,
            e = "" + e,
            a = Math.max(0, a - e.length),
            new Array(a).fill("0").join("") + e
        }
        var i = 60 * (new Date).getTimezoneOffset()
          , e = e + i + window.server_utc_diff
          , e = new Date(1e3 * e)
          , c = e.getFullYear()
          , d = e.getMonth() + 1
          , f = e.getDate()
          , u = e.getHours()
          , b = e.getMinutes()
          , m = e.getSeconds()
          , g = e.getMilliseconds()
          , f = "us" === game_data.market ? o(d) + "." + o(f) + "." : o(f) + "." + o(d) + "."
          , d = (t && (f += c),
        o(u) + ":" + o(b) + (!0 === a ? ":" + o(m) : ""))
          , t = (r && (d += s(':<span class="grey small">%1</span>', o(g, 3))),
        new Date((new Date).getTime() + 1e3 * i + 1e3 * window.server_utc_diff))
          , c = new Date(t);
        return c.setDate(t.getDate() + 1),
        t.toDateString() === e.toDateString() ? _("aea2b0aa9ae1534226518faaefffdaad").replace("%s", d) : c.toDateString() === e.toDateString() ? _("57d28d1b211fddbb7a499ead5bf23079").replace("%s", d) : (n ? _("0cb274c906d622fa8ce524bcfbb7552d") : _("850731037a4693bf4338a0e8b06bd2e4")).replace("%1", f).replace("%2", d)
    },
    time: function(e, a) {
        var e = new Date(e)
          , t = ""
          , t = (t += Format.padLead(e.getHours(), 2)) + (":" + Format.padLead(e.getMinutes(), 2));
        return a && (t += ":" + Format.padLead(e.getSeconds(), 2)),
        t
    },
    timeSpan: function(e, a) {
        var t = ""
          , a = a ? (t += 0 < (r = Math.floor(e / 24 / 60 / 60 / 1e3)) ? r + ":" : "",
        Math.floor(e / 60 / 60 / 1e3) % 24) : Math.floor(e / 60 / 60 / 1e3)
          , r = (t += 0 < r ? Format.padLead(a, 2) : a,
        Math.floor(e / 60 / 1e3) % 60)
          , a = (t += ":" + Format.padLead(r, 2),
        Math.floor(e / 1e3) % 60);
        return t += ":" + Format.padLead(a, 2)
    },
    padLead: function(e, a) {
        for (var t = e.toString(), r = t.length; r < a; r++)
            t = "0" + t;
        return t
    },
    number: function(e) {
        return number_format(e, '<span class="grey">.</span>')
    },
    shorten_number: function(e) {
        return 1e7 <= e ? (e /= 1e6,
        Math.round(e) + _("381f749a338b826aa1af08395d8a3b8e")) : 1e4 <= e ? (e /= 1e3,
        Math.round(e) + _("49327b55a12f22d2c1abbbee4c9e071b")) : e
    },
    get_warn_pop_class: function(e, a, t) {
        return t && a <= e ? "warn" : t && .9 <= e / a ? "warn_90" : ""
    },
    image_src: function(e) {
        return window.image_base + e
    },
    image_tag: function(e, a="", t=[]) {
        var r = e.src
          , n = "";
        return e.has_retina && (r = r.replace(/\.(png)/, "@2x.$1"),
        n = s('style="width: %1px; height: %2px;"', e.width, e.height)),
        '<img src="' + Format.image_src(r) + '" title="' + a + '" alt="" class="' + t.join(" ") + '" ' + n + "/>"
    },
    imageTexture: function(e, a, t, r, n) {
        Array.isArray(r) || (r = []),
        "string" != typeof n && (n = "span");
        var o = a / e.width
          , i = t / e.height
          , c = e.atlas_width * o
          , s = e.atlas_height * i
          , o = -e.position_x * o
          , i = -e.position_y * i
          , a = ["width:" + a + "px", "height:" + t + "px", "background-image: url(" + Format.image_src(e.atlas_src) + ")", "background-size:" + c + "px " + s + "px", "background-position:" + o + "px " + i + "px"];
        return r.push("sprite"),
        "<" + n + ' class="' + r.join(" ") + '" style="' + a.join(";") + '"></' + n + ">"
    },
    playerAnchor: function(e, a, t) {
        var r = "";
        return '<a href="' + TribalWars.buildURL("GET", "info_player", {
            id: e
        }) + '">' + (r = void 0 !== t ? Format.userImageThumb(t) + " " : r) + escapeHtml(a) + "</a>"
    },
    userImageThumb: function(e) {
        return '<img class="userimage-tiny" src="' + Format.userImageThumbURL(e) + '">'
    },
    userImageThumbURL: function(e) {
        return e && 0 !== parseInt(e) ? e < 1e3 ? image_base + "avatar/thumb/" + e + ".jpg" : image_base + "userimage/" + e + "_thumb" : image_base + "coa_unknown.png"
    },
    overdueAnchor: function() {
        return "<a href=\"#\" onclick=\"UI.Help.open('misc', 'overdues'); return false\">" + _("38e7b1eb7d0cc1978dbd368eaf05f9f9") + "</a>"
    },
    ppCostTooltip: function(e) {
        var a = _("50705527ef25ef5a96b42447e257edd5");
        return mobile ? s(a, s(_("aef108da881016d949f09d923a76cc76"), e)) : s(a, s('<span class="coinbag solo"></span> %1', e))
    },
    lifeColor: function(e) {
        function a(e) {
            return Math.min(255, Math.floor(e))
        }
        var t = 0
          , r = 0;
        e < .5 ? (t = 255,
        r = e <= 0 ? 0 : e / .5 * 255) : (r = 255,
        t = 1 <= e ? 0 : (1 - e) / .5 * 255);
        return s("rgb(%1, %2, %3)", a(t), a(r), a(0))
    },
    resChange: function(a, t) {
        return ["wood", "stone", "iron"].map(function(e) {
            return '<strike><span class="icon header ' + e + '"></span>' + Format.number(a[e]) + '</strike> <span class="icon header ' + e + '"></span>' + Format.number(t[e]) + "<br/>"
        }).join("")
    },
    toPercent: function(e, a) {
        return ((100 * e).toFixed(a = a || 6) + "%").replace(/(?:(\.[0-9]*[1-9])|.)?0*%$/, "$1%")
    }
};

;var Dialog;
( () => {
    function r(t, e, o) {
        this.priority = t,
        this.body_class = e,
        this.closeCallback = o
    }
    r.prototype = {
        is_completely_shown: !1,
        after_completely_shown_queue: [],
        triggerAfterCompletelyShownHooks: function() {
            for (var t = this.after_completely_shown_queue; t.length; )
                t.shift()()
        }
    },
    Dialog = {
        MAX_WIDTH: 821,
        PRIORITY_NONE: 0,
        PRIORITY_IMPORTANT: 1,
        active_id: null,
        instances: {},
        show: function(t, e, o, i={}) {
            if (!this.isContentValid(e))
                throw "invalid dialog content";
            if (i = $.extend({
                class_name: "",
                close_from_fader: !0,
                auto_width: !1,
                allow_close: !0,
                show_close_button: !0,
                priority: Dialog.PRIORITY_NONE,
                overlay: !0,
                body_class: "dialog-open"
            }, i),
            this.active_id && this.active_id !== t && !i.overlay || this.active_id === t) {
                if (this.getActiveInstance().priority > i.priority)
                    return !1;
                Dialog.close()
            }
            this.active_id = t;
            var n, s, a = new r(i.priority,i.body_class,o), o = (this.instances[t] = a,
            this.getDialogContainer()), l = $('.popup_box_container[data-id="' + this.active_id + '"]'), c = !1;
            switch (l.length ? (n = l.find(".popup_box"),
            s = l.find(".popup_box_content"),
            n.css("width", "auto")) : (c = !0,
            l = $('<div class="popup_box_container" />'),
            n = $('<div class="popup_box" />').attr("id", "popup_box_" + t).addClass(i.class_name).data("name", t).appendTo(l),
            $('<div class="fader" />').appendTo(l),
            s = $('<div class="popup_box_content" />').appendTo(n)),
            l.toggleClass("sub-dialog", i.overlay),
            l.attr("data-id", this.active_id),
            l.appendTo($(o).addClass(i.body_class)),
            typeof e) {
            case "string":
                s.html(e);
                break;
            case "object":
                s.html("").append(e);
                break;
            case "function":
                s.html(""),
                e(s);
                break;
            default:
                throw "invalid dialog content"
            }
            ($(window).width() < 500 || $(window).height() < s.height() + 125) && n.addClass("mobile"),
            s.find("img").on("load", function() {
                ($(window).width() < 500 || $(window).height() < s.height() + 125) && n.addClass("mobile")
            }),
            t = "function" == typeof window.getComputedStyle ? parseInt(getComputedStyle(n[0], null).borderLeftWidth) : parseInt(n.css("border-left-width"));
            var o = Math.ceil(Math.min(this.MAX_WIDTH, s.width(), $(window).width() - t));
            return o < 250 && (o = 250),
            Modernizr.borderimage || (o += 20),
            o % 2 == 1 && o++,
            i.auto_width ? n.css("width", "auto") : n.css("width", o + "px"),
            i.allow_close && (t = mobile || mobiledevice || !HotKeys.enabled ? "" : " :: " + _("28926ff7e8e5f5e52b3e35f5cc7ad99b") + " <strong>Esc</strong>",
            o = mobile || mobiledevice ? "" : "tooltip-delayed",
            i.show_close_button && (o = $('<a class="popup_box_close ' + o + '" title="' + _("d3d2e617335f08df83599665eef8a418") + t + '" href="#">&nbsp;</a>').prependTo(n),
            UI.ToolTip(o, {
                delay: 400
            })),
            t = i.close_from_fader ? ".fader, .popup_box_close, .popup_closer" : ".popup_box_close, .popup_closer",
            l.off("click").on("click", t, function(t) {
                t.preventDefault(),
                Dialog.close(!0)
            })),
            c ? setTimeout(function() {
                n.addClass("show"),
                a.is_completely_shown = !0,
                a.triggerAfterCompletelyShownHooks()
            }, 50) : (a.is_completely_shown = !0,
            a.triggerAfterCompletelyShownHooks()),
            UI.init(),
            UnitPopup.initLinks(),
            VillageContext.init(l),
            setTimeout(QuestArrows.init, 500),
            !0
        },
        isContentValid: function(t) {
            return "string" == typeof t || "object" == typeof t && $.prototype.isPrototypeOf(t) || "function" == typeof t && 1 === t.length
        },
        close: function(t) {
            var e, o;
            return this.active_id && (((e = () => $(".popup_box_container.sub-dialog"))().length ? e().last() : $(".popup_box_container")).remove(),
            o = this.getActiveInstance(),
            $(this.getDialogContainer()).removeClass(o.body_class),
            o.closeCallback && o.closeCallback(t),
            delete this.instances[this.active_id],
            this.active_id = e().last().attr("data-id") || Object.keys(Dialog.instances)[0] || null,
            QuestArrows.init(),
            VillageContext.hide(),
            t) && DialogQueue.consume(),
            !1
        },
        fetch: function(e, t, o, i, n, s, a) {
            TribalWars.get(t, o, function(t) {
                Dialog.show(e, t.dialog, s, n),
                i && i()
            }, a)
        },
        openWidget: function(t, e, o, i) {
            function n() {
                e.update(Timing.getCurrentServerTime())
            }
            t = Dialog.show(t, function(t) {
                e.init(t),
                $(TribalWars).on("global_tick", n)
            }, function() {
                $(TribalWars).off("global_tick", n),
                e.destruct(),
                "function" == typeof o && o()
            }, i);
            return t || e.destruct(),
            t
        },
        queueCallWhenShown: function(t) {
            var e = this.getActiveInstance();
            e.is_completely_shown ? t() : e.after_completely_shown_queue.push(t)
        },
        getActiveInstance: function() {
            return this.instances[this.active_id]
        },
        getDialogContainer: function() {
            return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.body
        }
    }
}
)();

;var DialogQueue;
( () => {
    var e;
    e = [],
    DialogQueue = {
        add: function(u) {
            e.push(u)
        },
        consume: function() {
            0 < e.length && e.shift()()
        }
    }
}
)();

;var VillageGroups = {
    loadGroups: function(e, t, a, r) {
        TribalWars.get("groups", {
            ajax: "load_groups",
            village_id: e
        }, function(e) {
            VillageGroups.showGroups(e, t, a, r)
        })
    },
    loadGroupsToggle: function(e, t, a) {
        var r = $("#" + t);
        r.toggle(),
        r.is(":visible") && VillageGroups.loadGroups(e, t, a)
    },
    showGroups: function(e, t, a, r) {
        r = void 0 !== r ? r : function() {}
        ,
        $("#" + t).empty();
        var o, n = $("<table>").attr("id", "group_table").attr("width", "100%").addClass("vis"), i = $("<tbody>");
        n.append(i),
        $("#group_assiggment > tr").not("#header").remove(),
        i.append($("<img>").attr("src", "graphic/throbber.gif").attr("alt", "Loading...").attr("id", "throbber")),
        a && (o = $("<form>").attr("id", "reassign_village_to_groups_form_" + t).attr("action", $("#group_assign_action").val()).attr("method", "POST"));
        for (var p, l, u, s, d, g = 0; g < e.result.length; g++)
            (a || e.result[g].in_group) && (p = $("<tr>"),
            l = $("<td>"),
            u = e.result[g].name,
            s = null,
            a && (d = $("<input>").attr("type", "checkbox").attr("id", "checkbox_" + u).attr("name", "groups[]").attr("value", e.result[g].group_id).addClass("check"),
            e.result[g].in_group && d.attr("checked", "checked"),
            s = $("<label>" + escapeHtml(u) + "</label>").prepend(d),
            l.append(s)),
            d = $("<p>").addClass("p_groups"),
            s ? d.append(s) : d.html(escapeHtml(u)),
            l.append(d),
            p.append(l),
            i.append(p));
        if (a ? (n.appendTo(o),
        o.append($("<input>").attr("name", "village_id").attr("type", "hidden").val(e.village_id)),
        o.append($("<input>").attr("name", "mode").attr("type", "hidden").val("village")),
        o.append($("<input>").attr("type", "submit").attr("class", "btn").val($("#group_submit_text").val())),
        $("#" + t).append(o)) : $("#" + t).append(n),
        $("#throbber").remove(),
        a)
            o.unbind().on("submit", function() {
                return TribalWars.post(o.attr("action"), {}, o.serialize(), function(e) {
                    VillageGroups.showGroups(e, t, !1, r),
                    r && r(e, t)
                }),
                !1
            });
        else {
            var c, n = "overview" === game_data.screen;
            if (e.player_has_static_groups)
                c = $("<a>").attr("href", "#").html($("#group_edit_village").val()).on("click", function() {
                    return VillageGroups.loadGroups(e.village_id, "group_assignment", !0, r),
                    !1
                });
            else {
                if (!n)
                    return !1;
                if (parseInt($("#village_has_dynamic_membership").val()))
                    return !1;
                c = $("<i>" + _("1ccabc4df5f8a94cd7cf7c669ed03c0e") + "</i>")
            }
            var n = $("<tbody>")
              , m = $("<table>").attr("width", "100%").addClass("vis").css("margin-top", "-2px").append(n)
              , v = $("<tr>")
              , f = $("<td>");
            f.append(c),
            v.append(f),
            n.append(v),
            $("#" + t).append(m)
        }
    },
    handleSaveFromOverview: function(e, t) {
        var a = ""
          , r = 0;
        if (null != e.result && 0 < e.result.length) {
            for (var o = 0; o < e.result.length; o++)
                e.result[o].in_group && (a += escapeHtml(e.result[o].name) + "; ",
                r++);
            a = a.substring(0, a.lastIndexOf(";")),
            $("#assigned_groups_" + e.village_id + "_names").html(a)
        } else {
            $("#assigned_groups_" + e.village_id + "_names").empty();
            var n = $('<span class="grey" style="font-style:italic"></span>');
            n.html($("#group_undefined").val()),
            $("#assigned_groups_" + e.village_id + "_names").append(n)
        }
        $("#assigned_groups_" + e.village_id + "_count").html(r),
        (mobile ? $("#group_edit_div_" + e.village_id) : $("#group_edit_tr_" + e.village_id)).hide()
    },
    initOverviews: function() {
        $("#add_group_form").on("submit", function() {
            return VillageGroups.createGroup($(this).find("#add_new_group_name").val()),
            !1
        }),
        $("#add_coordinates").on("click", function() {
            var e = (mobile ? $(".vis_item select option:selected")[0] : document.querySelector("strong.group-menu-item"))?.dataset.groupId;
            return TribalWars.post("overview_villages", {
                ajaxaction: "load_add_coordinates_dialog",
                group_id: e
            }, {}, function(e) {
                Dialog.show("add_coordinates_dialog", e.dialog)
            }),
            !1
        })
    },
    displayGroupInfo: function(e, t, a) {
        $("#" + t).empty();
        for (var r = $("<img>").attr("src", "/graphic/throbber.gif"), r = ($("#" + t).append(r),
        $("<table>").addClass("vis").attr("id", "group_table").width("100%")), o = $("<tbody>"), n = (r.append(o),
        $("<tr>")), i = (o.append(n),
        $("<th>").width("100%").html($("#group_config_headline").val())), p = (n.append(i),
        new Array), l = 0; l < e.result.length; l++) {
            if (!a && 5 == l) {
                var u = e.result.length - 5
                  , d = $('<tr><td><a href="#" /></td></tr>')
                  , g = d.find("a");
                1 == u ? g.text(_("721f3f08e94a23bad2f5b02d9575ff5f")) : g.text(s(_("759b1416a977d5c9d468450c1c3df687"), u)),
                g.on("click", function() {
                    VillageGroups.displayGroupInfo(e, t, !0)
                }),
                o.append(d);
                break
            }
            var u = e.result[l].group_id
              , g = e.result[l].name
              , d = $("<tr>").attr("id", "tr_group" + u)
              , c = $("<td>").attr("id", "show_group" + u)
              , m = $("<a>").attr("href", e.result[l].link).html(escapeHtml(g))
              , m = (null != e.last_selected && u == e.last_selected && c.addClass("selected"),
            c.append(m),
            d.append(c),
            $("<td>").attr("id", "rename_group" + u).css("display", "none"))
              , v = $("<form>").attr("id", "rename_group_form" + u).attr("class", "rename_group_form").attr("action", $("#rename_group_link").val() + "&old_name=" + g).attr("method", "post")
              , f = $("<input>").attr("type", "hidden").attr("name", "group_id").attr("value", u);
            v.append(f),
            f = $("<input>").attr("type", "hidden").attr("name", "mode").attr("value", $("#group_mode").val()),
            v.append(f),
            f = $("<input>").attr("type", "text").attr("name", "group_name").attr("value", g),
            v.append(f),
            f = $("<input>").attr("type", "submit").attr("class", "btn").attr("value", $("#group_submit_text").val()),
            v.append(f),
            m.append(v),
            d.append(m),
            0 != u && (f = $("<a>").attr("href", "#").addClass("float_right").data("group-name", g),
            v = $("<img>").attr("src", "/graphic/delete_14.png").attr("title", $("#group_title_delete").val()),
            f.append(v),
            c.append(f),
            f.click(function(e) {
                var t = s($("#group_msg_confirm_delete").val(), escapeHtml($(this).data("group-name")))
                  , a = [{
                    text: _("70d9be9b139893aa6c69b5e77e614311"),
                    callback: function() {
                        VillageGroups.deleteGroup(VillageGroups.getGroupID(e))
                    },
                    confirm: !0
                }];
                return UI.ConfirmationBox(t, a),
                !1
            }),
            m = $("<a>").attr("href", "#").css("margin", "0 5px"),
            v = $("<img>").attr("src", "/graphic/rename.png").attr("title", $("#group_title_rename").val()),
            m.append(v),
            c.append(m),
            m.click(function(e) {
                e = VillageGroups.getGroupID(e);
                return toggle_element("#show_group" + e),
                toggle_element("#rename_group" + e),
                !1
            }),
            p[l] = new Array,
            p[l].group_id = u),
            o.append(d)
        }
        $("#" + t).empty().append(r).show(),
        $(".rename_group_form").on("submit", function() {
            var e = $(this).find("input[name=group_id]").val()
              , t = $(this).find("input[name=group_name]").val();
            return VillageGroups.renameGroup(e, t),
            !1
        })
    },
    reloadOverviewPage: function() {
        var e = location.href.match(/group=[0-9]*/)
          , e = $("#start_edit_group_link").val().replace("group=0", e);
        $.ajax({
            url: e,
            dataType: "html",
            success: function(e) {
                (0 < $("#group_management_content").length ? $("#group_management_content") : $("#paged_view_content")).html(e),
                "undefined" != typeof MDS && MDS.initToggleMenus(),
                VillageGroups.initOverviews(),
                VillageGroupMenu.Nav.init()
            }
        })
    },
    createGroup: function(e) {
        TribalWars.post("groups", {
            ajaxaction: "create_group"
        }, {
            group_name: e
        }, function(e) {
            $("#add_new_group_name").val(""),
            VillageGroups.reloadOverviewPage()
        })
    },
    deleteGroup: function(e) {
        TribalWars.post("groups", {
            ajaxaction: "delete_group"
        }, {
            group_id: e
        }, function(e) {
            VillageGroups.reloadOverviewPage()
        })
    },
    renameGroup: function(e, t) {
        TribalWars.post("groups", {
            ajaxaction: "rename_group"
        }, {
            group_name: t,
            group_id: e
        }, function(e) {
            VillageGroups.reloadOverviewPage()
        })
    },
    getGroupID: function(e) {
        var t = null
          , t = e.srcElement || e.target
          , e = $(t).parents("tr").first().attr("id");
        return parseInt(e.substr(8))
    },
    villageSelect: {
        init: function(t) {
            TribalWars.get("groups", {
                ajax: "load_group_menu"
            }, function(e) {
                VillageGroups.villageSelect.handleGroupMenuData(e, t)
            })
        },
        handleGroupMenuData: function(e, t) {
            for (var a = e, r = ("object" != typeof t && (t = $("#" + t)),
            $("<form>").attr("id", "select_group_box").attr("action", $("#show_groups_villages_link").val()).attr("method", "POST")), e = $("<p>").attr("style", "margin: 0 0 10px 0; font-weight: bold;").html($("#group_popup_select_title").val()), o = $("<select>").attr("id", "group_id").attr("name", "group_id").css("margin-left", "3px"), n = $("<input>").attr("type", "hidden").attr("name", "mode").attr("value", $("#group_popup_mode").val()), i = (r.append(n),
            !1), p = 0; p < a.result.length; p++) {
                var l = a.result[p]
                  , u = "separator" === l.type
                  , s = "";
                u && !i ? (s = "<option disabled></option>",
                i = !0) : u || (s = $("<option>").attr("value", l.group_id).html(escapeHtml(l.name)),
                a.group_id && l.group_id === a.group_id && s.attr("selected", !0),
                i = !1),
                o.append(s)
            }
            n = $("<div>").attr("id", "group_list_content").css("overflow", "auto");
            mobile || n.css("height", "340px"),
            e.append(o),
            r.append(e),
            t.empty(),
            t.append(r).append(n),
            r.on("submit", function() {
                return TribalWars.post("groups", {
                    ajax: "load_villages_from_group"
                }, {
                    group_id: $("#group_id").val()
                }, function(e) {
                    VillageGroups.villageSelect.showVillages(e.html, "group_list_content")
                }),
                !1
            }),
            r.submit(),
            $("#group_id").change(function() {
                $("#group_list_content").html(UI.Throbber),
                r.submit()
            })
        },
        showVillages: function(e, t) {
            $("#" + t).html(e),
            $("th.group_label").html($("#group_popup_villages_select").val());
            t = $("#selected_popup_village");
            t.length && (e = t.position().top,
            $("#group_list_content").scrollTop(e - 60))
        }
    },
    addCoordinates: function(e, t) {
        TribalWars.post("overview_villages", {
            ajaxaction: "add_coordinates"
        }, {
            coordinates: e,
            group_id: t
        }, function(e) {
            e.status ? (Dialog.close(),
            TribalWars.redirect("overview_villages", {
                group: e.group_id
            })) : UI.ErrorMessage(e.message)
        })
    }
};

;var VillageGroupMenu;
VillageGroupMenu = {
    Nav: {
        village_counts: {},
        pending_village_counts: {},
        type_labels: {
            all: "",
            static: _("06dd230334ea28e78a3cf0f107ff3326"),
            dynamic: _("f7bff9446c4fed89e213ac495395dc7b")
        },
        init: function() {
            mobile || this.initHoverCounts(".group-menu-item")
        },
        initHoverCounts: function(e) {
            var o = {
                bodyHandler: VillageGroupMenu.Nav.getTooltipContent
            };
            UI.ToolTip(e, o)
        },
        getTooltipContent: function() {
            let e = $(this)
              , o = e.data("group-id");
            var t = void 0 !== VillageGroupMenu.Nav.village_counts[o];
            let a = Boolean(VillageGroupMenu.Nav.pending_village_counts[o]);
            t || a || (VillageGroupMenu.Nav.debounceTooltip(e, 200, () => VillageGroupMenu.Nav.loadDataForTooltip(e, o)),
            a = !0);
            var t = e.data("group-type");
            let r = "";
            return VillageGroupMenu.Nav.type_labels[t] && (r = "<strong>" + VillageGroupMenu.Nav.type_labels[t] + "</strong><br/>"),
            a ? (t = '<img alt="" src="' + image_base + 'loading2.gif">',
            r + '<div style="text-align:center; margin:5px;">' + t + "</div>") : (t = VillageGroupMenu.Nav.village_counts[o],
            r + _("0f827c5ff05ea68c64cfc782882adb27") + " <strong>" + t + "</strong>")
        },
        loadDataForTooltip: function(o, t) {
            VillageGroupMenu.Nav.pending_village_counts[t] = !0,
            TribalWars.get("api", {
                ajax: "count_villages_in_group",
                id: t
            }, function(e) {
                VillageGroupMenu.Nav.village_counts[t] = e,
                VillageGroupMenu.Nav.pending_village_counts[t] = !1,
                o.trigger("tooltip_content_change")
            }, null, !0)
        },
        debounceTooltip: function(e, o, t) {
            let a = !0
              , r = () => {
                a = !1
            }
            ;
            setTimeout( () => {
                a && t(),
                e.off("mouseout", r)
            }
            , o),
            e.on("mouseout", r)
        }
    },
    Editor: {
        init: function() {
            $("#add_separator").click(function() {
                return VillageGroupMenu.Editor.createSeparator(),
                !1
            }),
            $(".remove_separator").click(function() {
                return VillageGroupMenu.Editor.removeSeparator($(this).data("id")),
                !1
            }),
            $(".order_up").click(function() {
                return VillageGroupMenu.Editor.moveUp($(this).closest("tr")),
                !1
            }),
            $(".order_down").click(function() {
                return VillageGroupMenu.Editor.moveDown($(this).closest("tr")),
                !1
            }),
            this.updateOrderButtons(),
            $("#menu_items").sortable({
                axis: "y",
                handle: ".bqhandle",
                helper: "clone",
                stop: VillageGroupMenu.Editor.saveOrder
            })
        },
        saveOrder: function(e, o) {
            TribalWars.post("overview_villages", {
                mode: "groups",
                ajaxaction: "order_menu"
            }, $("#menu_items").sortable("serialize"), function() {})
        },
        createSeparator: function() {
            TribalWars.post("overview_villages", {
                mode: "groups",
                ajaxaction: "create_menu_separator"
            }, null, function() {
                partialReload()
            })
        },
        removeSeparator: function(e) {
            TribalWars.post("overview_villages", {
                mode: "groups",
                ajaxaction: "remove_menu_separator"
            }, {
                item_id: e
            }, function() {
                partialReload()
            })
        },
        moveUp: function(e) {
            e.prev().before(e.detach()),
            this.saveOrder(),
            this.updateOrderButtons()
        },
        moveDown: function(e) {
            e.next().after(e.detach()),
            this.saveOrder(),
            this.updateOrderButtons()
        },
        updateOrderButtons: function() {
            $(".order_up, .order_down").show(),
            $(".order_up").first().hide(),
            $(".order_down").last().hide()
        }
    }
};

;var OrderProgress = {
    didInitTicker: !1,
    initProgress: function() {
        $(".order-progress").each(function() {
            var a = $(this)
              , e = a.data("progress")
              , o = []
              , e = ($.each(e.progress, function(e, r) {
                var t = r[0]
                  , r = r[1]
                  , s = $("<div />").css({
                    width: 100 * r + "%"
                });
                s.data("seconds_worked", t),
                s.data("percentage_complete", r),
                a.append(s),
                o.push(r / t)
            }),
            $('<div class="anim" />'));
            a.append(e),
            a.data("slot_speeds", o)
        }),
        UI.ToolTip($(".order-progress").find("div"), {
            bodyHandler: OrderProgress.getTooltipBody
        }),
        OrderProgress.updateProgress(!0),
        setTimeout(function() {
            OrderProgress.updateProgress(),
            OrderProgress.didInitTicker || (OrderProgress.didInitTicker = !0,
            $(window.TribalWars).on("global_tick", function() {
                OrderProgress.updateProgress()
            }))
        }, 100)
    },
    updateProgress: function(t) {
        $(".order-progress").each(function() {
            var s, a, o, d, i, e = $(this), r = e.data("progress"), n = e.data("slot_speeds");
            n && (n = n.slice(0),
            s = Math.min(Timing.getCurrentServerTime() / 1e3 - r.slot_start, r.slot_time),
            t || s++,
            a = (s = Math.round(s)) / r.slot_time * (1 - r.percentage_complete),
            n.push(a / s),
            1 < a || (o = Math.max.apply(Math, n),
            d = Math.min.apply(Math, n),
            (i = e.find("div")).each(function(e) {
                var r, t = $(this);
                e == i.length - 1 ? (r = (a / s - d) / (o - d),
                t.css("width", 100 * a + "%"),
                t.data("percentage_complete", a),
                t.data("seconds_worked", s + 1)) : r = (t.data("percentage_complete") / t.data("seconds_worked") - d) / (o - d),
                1 == n.length ? r = 0 : isNaN(r) && (r = 1),
                t.css("background-color", 0 == r ? "#92c200" : 1 == r ? "#577400" : "#7aa104")
            })))
        })
    },
    getTooltipBody: function() {
        var e = $(this)
          , r = e.data("percentage_complete")
          , e = e.data("seconds_worked");
        return s(_("7d37a744453c6f4cf5c42f823f8d4ed6"), Math.round(100 * r), getTimeString(Math.round(e)))
    }
};

;var Timing = {
    tick_interval: 1e3,
    initial_server_time: null,
    added_server_time: 0,
    offset_to_server: 0,
    offset_from_server: 0,
    navigation_timing: null,
    paused: !1,
    is_ready: !1,
    when_ready: [],
    tickHandlers: {},
    init: function(e) {
        for (var t in this.initial_server_time = Math.round(1e3 * e),
        Timing.latency.init(),
        this.calculateOffsetsToServer(),
        Timing.tickHandlers)
            Timing.tickHandlers.hasOwnProperty(t) && Timing.tickHandlers[t].hasOwnProperty("init") && Timing.tickHandlers[t].init();
        $("#serverTime").click(function(e) {
            e.ctrlKey || Timing.pause()
        }),
        this.is_ready = !0,
        this.when_ready.forEach(function(e) {
            e()
        }),
        this.doGlobalTick()
    },
    calculateOffsetsToServer() {
        var e;
        this.navigation_timing = window.performance.getEntriesByType("navigation")[0] ?? [],
        this.navigation_timing.length instanceof PerformanceNavigationTiming ? (this.offset_from_server = this.navigation_timing.domContentLoadedEventStart - this.navigation_timing.responseStart,
        e = this.navigation_timing.serverTiming?.filter(e => "app" === e.name)[0]?.duration ?? 0,
        this.offset_to_server = this.navigation_timing.responseStart - e) : this.offset_to_server = this.offset_from_server = 0
    },
    getEstimatedLatency() {
        var e = Timing.latency.getAverageLatency();
        return e ? Math.min(e, 1e3) : Math.min(this.offset_to_server, 200)
    },
    pause: function() {
        this.paused = !this.paused
    },
    supportsPerformanceAPI: function() {
        return Modernizr.performance && "object" == typeof window.performance && "function" == typeof window.performance.now
    },
    getElapsedTimeSinceLoad: function() {
        return this.navigation_timing || this.calculateOffsetsToServer(),
        performance.now() - (this.navigation_timing.connectEnd ?? 0)
    },
    getElapsedTimeSinceData: function() {
        return this.getElapsedTimeSinceLoad() - this.added_server_time
    },
    getCurrentServerTime: function() {
        return this.initial_server_time + this.getElapsedTimeSinceLoad()
    },
    doGlobalTick: function(e) {
        if (!Timing.paused) {
            for (var t in Timing.tickHandlers)
                Timing.tickHandlers.hasOwnProperty(t) && Timing.tickHandlers[t].tick();
            $(window.TribalWars).trigger("global_tick")
        }
        e || (e = Math.round(Timing.getCurrentServerTime()),
        e = Timing.tick_interval - e % Timing.tick_interval + 10,
        setTimeout(Timing.doGlobalTick, e))
    },
    resetTickHandlers: function() {
        for (var e in this.added_server_time += this.getElapsedTimeSinceData(),
        Timing.tickHandlers)
            Timing.tickHandlers.hasOwnProperty(e) && Timing.tickHandlers[e].hasOwnProperty("reset") && Timing.tickHandlers[e].reset();
        this.doGlobalTick(!0)
    },
    whenReady: function(e) {
        this.is_ready ? e() : this.when_ready.push(e)
    }
};
Timing.tickHandlers.serverTime = {
    tick: function() {
        var e = $("#serverTime")
          , t = Timing.getCurrentServerTime() / 1e3 + window.server_utc_diff
          , t = getTimeString(t, !0, !0);
        e.text(t),
        "00:00:00" == t && Timing.tickHandlers.serverTime.incrementDate()
    },
    incrementDate: function() {
        var e = $("#serverDate").text().split("/")
          , e = new Date(e[2],e[1] - 1,e[0])
          , e = (e.setDate(e.getDate() + 1),
        e.getDate().toString().padStart(2, "0") + "/" + (e.getMonth() + 1).toString().padStart(2, "0") + "/" + e.getFullYear());
        $("#serverDate").text(e)
    }
},
Timing.tickHandlers.resources = {
    start: {},
    lastFullState: !1,
    tick: function() {
        game_data.village && (game_data.village.updateRes(),
        ["wood", "stone", "iron"].forEach(this.updateDisplay))
    },
    updateDisplay: function(e) {
        var t = game_data.village[e]
          , i = parseInt(game_data.village.storage_max, 10)
          , e = $("#" + e);
        .9 * i <= t && t < i ? changeResStyle(e, "warn_90") : t < i ? changeResStyle(e, "res") : changeResStyle(e, "warn"),
        mobile && (99999 < t ? t = Math.floor(t / 1e3) + "K" : 9999 < t && (t = Math.floor(t / 100) / 10 + "K")),
        e.html(t)
    },
    initResource: function(e) {
        var t = parseFloat(game_data.village[e + "_float"]);
        return Timing.tickHandlers.resources.start[e] = t
    },
    getOriginalValue: function(e) {
        return Timing.tickHandlers.resources.start.hasOwnProperty(e) ? Timing.tickHandlers.resources.start[e] : Timing.tickHandlers.resources.initResource(e)
    },
    reset: function() {
        Timing.tickHandlers.resources.start = {}
    }
},
Timing.tickHandlers.timers = {
    _timers: [],
    _command_refresh_timeouts: {},
    _lock_content_reloading: !1,
    _doc_events_registered: !1,
    _registeredPreInit: [],
    init: function() {
        this._doc_events_registered || ($(document).on("partial_reload_start", function() {
            Timing.tickHandlers.timers.lockPartialReloading()
        }),
        $(document).on("partial_reload_end", function() {
            Timing.tickHandlers.timers.unlockPartialReloading()
        }),
        this._doc_events_registered = !0),
        this.initTimers("timer", Timing.tickHandlers.timers.handleTimerEnd),
        this.initTimers("timer_replace", Timing.tickHandlers.timers.handleReplaceTimerEnd),
        this.initTimers("widget-command-timer", Timing.tickHandlers.timers.handleCommandTimerEnd);
        for (let e = 0; e < this._registeredPreInit.length; e++)
            this._registeredPreInit[e]()
    },
    registerPreInit: function(e, t, i=void 0) {
        this._registeredPreInit.push( () => this.initTimers(e, t, i))
    },
    handleTimerEnd: function() {
        var e = $(this).data("timer_callback");
        e ? e.call(this) : Timing.tickHandlers.timers._lock_content_reloading || (TribalWars.shouldPartialLoad() ? partialReload() : document.location.href = document.location.href.replace(/action=\w*/, "").replace(/#.*$/, ""))
    },
    handleReplaceTimerEnd: function() {
        var e = $(this).parent()
          , t = e.next();
        0 !== t.length && (t.css("display", "inline"),
        e.remove())
    },
    handleCommandTimerEnd: function() {
        var e, t = $(this).parents(".commands-container"), i = t.data("type"), n = ($(this).parents("tr").eq(0).remove(),
        $(window.TribalWars).trigger("command_timer_expire"),
        t.find(".commands-command-count"));
        n.data("limit-reached") || (e = parseInt(t.data("commands")) - 1,
        t.data("commands", e),
        n.text("(" + e + ")"),
        0 == e && setTimeout(function() {
            Timing.tickHandlers.timers.handleCommandTimerRefreshAll(t)
        }, 1e3)),
        Timing.tickHandlers.timers._command_refresh_timeouts.hasOwnProperty(i) || (Timing.tickHandlers.timers._command_refresh_timeouts[i] = setTimeout(function() {
            Timing.tickHandlers.timers.handleCommandTimerRefreshAll(t)
        }, 5e3))
    },
    handleCommandTimerRefreshAll: function(t) {
        var e = t.data("type")
          , i = t.data("village");
        Timing.tickHandlers.timers._command_refresh_timeouts.hasOwnProperty(e) && delete Timing.tickHandlers.timers._command_refresh_timeouts[e],
        TribalWars.post("place", {
            ajax: "commands",
            oscreen: game_data.screen
        }, {
            type: e,
            village_id: i
        }, function(e) {
            e ? t.replaceWith(e) : ((e = t.parents(".commands-container-outer")).length && 1 === e.find(".commands-container").length && e.remove(),
            t.remove(),
            $(window.TribalWars).trigger("command_timer_empty"))
        })
    },
    lockPartialReloading: function() {
        this._lock_content_reloading = !0
    },
    unlockPartialReloading: function() {
        this._lock_content_reloading = !1
    },
    initTimers: function(i, n, r=void 0) {
        var a = Math.round(Timing.getCurrentServerTime() / 1e3)
          , s = this;
        $("span." + i).each(function() {
            var e = $(this)
              , t = (e.removeClass(i),
            e.data("endtime") || a + getTime(e));
            s.initTimer(e, t, n, a, "widget-command-timer" === i, !1, r)
        })
    },
    initTimer: function(e, t, i, n, r, a, s=void 0) {
        r = r || !1,
        a = a || !1;
        n = t - (n = n || Math.round(Timing.getCurrentServerTime() / 1e3));
        if (e.on("timer_end", i),
        r && n < 1 && -2 <= n)
            e.trigger("timer_end");
        else {
            if (n < 0)
                return s ? void e.html(s) : void e.html(Format.overdueAnchor());
            formatTime(e, n, a),
            this._timers.push({
                element: e,
                end: t,
                clamp: a
            })
        }
    },
    reset: function() {
        this.init()
    },
    tick: function() {
        var t = [];
        for (let e = 0; e < this._timers.length; e++)
            this.tickTimer(this._timers[e]) || t.push(this._timers[e]);
        this._timers = t
    },
    tickTimer: function(e) {
        if ($.contains(document.body, e.element[0])) {
            var t = Math.round(e.end - Timing.getCurrentServerTime() / 1e3);
            if (0 <= t)
                return formatTime(e.element, t, e.clamp),
                !1;
            if (0 < $(".popup_style:visible").length)
                return !1;
            formatTime(e.element, 0, e.clamp),
            e.element.trigger("timer_end")
        }
        return !0
    }
},
Timing.tickHandlers.forwardTimers = {
    _timers: [],
    init: function() {
        $("span.relative_time").each(function() {
            Timing.tickHandlers.forwardTimers._timers.push($(this)),
            $(this).removeClass(".relative_time")
        })
    },
    tick: function() {
        for (var e = 0; e < this._timers.length; e++) {
            var t, i = this._timers[e];
            $.contains(document.body, i[0]) ? (t = i.data("duration"),
            t = (Timing.getCurrentServerTime() + Timing.getEstimatedLatency() / 2) / 1e3 + t,
            i.text(Format.date(t, !0))) : this._timers.splice(e, 1)
        }
    },
    reset: function() {
        this.init()
    }
},
Timing.latency = {
    SAMPLE_SIZE: 5,
    SAMPLE_INTERVAL: 6e4,
    samples: [],
    last_sample: null,
    init() {
        this.samples = sessionStorage.getItem("latency_samples") ? JSON.parse(sessionStorage.getItem("latency_samples")) : [],
        this.last_sample = sessionStorage.getItem("latency_last_sample"),
        this.renderAverageLatency(),
        Connection.registerHandler("tribalwars/pong", e => this.receiveLatencyFromWebsocket(e)),
        $(window.TribalWars).on("global_tick", () => Timing.latency.sampleLatencyIfRequired()),
        $("#serverTime").on("click", e => {
            e.ctrlKey && Dialog.show("debug", '<textarea style="width: 600px; height: 400px">' + Timing.latency.debug() + "</textarea>")
        }
        )
    },
    renderAverageLatency() {
        this.getAverageLatency() && $("#serverTime").attr("title", "Latency: " + this.getAverageLatency() + "ms")
    },
    getAverageLatency() {
        return 0 === this.samples.length ? null : this.samples.reduce( (e, t) => e + t, 0) / this.samples.length
    },
    sampleLatencyIfRequired() {
        Timing.getElapsedTimeSinceLoad() < 1e3 || (null === this.last_sample || Date.now() - this.last_sample > Timing.latency.SAMPLE_INTERVAL) && this.sampleLatency()
    },
    sampleLatency() {
        this.last_sample = Date.now(),
        sessionStorage.setItem("latency_last_sample", this.last_sample),
        Connection.isConnected() && Connection.is_websocket ? Connection.emit("tribalwars/ping", {
            ts: Date.now()
        }) : TribalWars.get("api", {
            ajax: "ping",
            ts: Date.now()
        }, function(e) {
            Timing.latency.recordSample(Date.now() - e.ts - e.gentime)
        })
    },
    recordSample(e) {
        this.samples.push(e),
        this.samples.length > this.SAMPLE_SIZE && this.samples.shift(),
        sessionStorage.setItem("latency_samples", JSON.stringify(this.samples))
    },
    receiveLatencyFromWebsocket(e) {
        e = Date.now() - e.ts;
        this.recordSample(e)
    },
    debug() {
        return "If you're seeing this, you've probably been asked to send this information to support :) Please copy/paste the entire thing.\n\nNavigation timing: " + JSON.stringify(Timing.navigation_timing) + "\nLegacy offset to server: " + Timing.offset_to_server + "\nLegacy offset from server: " + Timing.offset_from_server + "\nSampled latency: " + this.getAverageLatency() + "\nLatency samples: " + JSON.stringify(this.samples) + "\nSampling method: " + (Connection.isConnected() && Connection.is_websocket ? "Websocket" : "xhr")
    }
};

;var HotKeys;
HotKeys = {
    enabled: !1,
    rate_limit_ms: 200,
    locked: !1,
    init: function() {
        function e(o) {
            return function(e) {
                HotKeys.processHotkey(o, e)
            }
        }
        var o = $(document);
        $.hotkeys.textInputTypes = /textarea|select/i;
        switch (o.on("keydown", null, "shift+h", e(HotKeys.help)),
        o.on("keydown", null, "a", e(HotKeys.previousVillage)),
        o.on("keydown", null, "d", e(HotKeys.nextVillage)),
        game_data.screen) {
        case "report":
            o.on("keydown", null, "w", e(HotKeys.nextReport)),
            o.on("keydown", null, "s", e(HotKeys.previousReport));
            break;
        case "mail":
            o.on("keydown", null, "w", e(HotKeys.nextMail)),
            o.on("keydown", null, "s", e(HotKeys.previousMail))
        }
        game_data.pregame || (o.on("keydown", null, "v", e(HotKeys.villageOverview)),
        o.on("keydown", null, "m", e(HotKeys.map))),
        o.on("keydown", null, "esc", e(HotKeys.closeDialog)),
        this.bindQuickbarKeys(),
        this.enabled = !0
    },
    bindQuickbarKeys: function() {
        $("#quickbar_contents").find(".quickbar_item").each(function(e, o) {
            var t = $(o)
              , o = t.data("hotkey");
            !o && 0 !== o || $(document).on("keydown", null, String(o), function(e) {
                HotKeys.processHotkey(function() {
                    var e = t.find(".quickbar_link")
                      , o = e.attr("href");
                    UI.InfoMessage(s(_("bb6ce803b23a8e161085e255bf3b42cf"), "<b>" + e.html() + "</b>")),
                    "_blank" === e.prop("target") ? window.open(o) : QuickBar.openEntry(e.data("hash"), o)
                }, e)
            })
        })
    },
    processHotkey: function(e, o) {
        HotKeys.locked || (HotKeys.locked = !0,
        e(o),
        setTimeout(function() {
            HotKeys.locked = !1
        }, HotKeys.rate_limit_ms))
    },
    help: function(e) {
        e && e.stopPropagation(),
        TribalWars.get("api", {
            ajax: "hotkeys"
        }, function(e) {
            Dialog.show("hotkeys", e.dialog)
        })
    },
    nextReport: function(e) {
        var o = document.getElementById("report-next");
        o && (UI.InfoMessage(_("d42a9e46b1a644d753fbabef588e89db")),
        o.click())
    },
    previousReport: function(e) {
        var o = document.getElementById("report-prev");
        o && (UI.InfoMessage(_("d42a9e46b1a644d753fbabef588e89db")),
        o.click())
    },
    nextMail: function(e) {
        var o = $("#igm-next");
        o.length && (UI.InfoMessage(_("baa0a23866840c753f48fb835156b06f")),
        document.location.assign(o.attr("href")))
    },
    previousMail: function(e) {
        var o = $("#igm-prev");
        o.length && (UI.InfoMessage(_("baa0a23866840c753f48fb835156b06f")),
        document.location.assign(o.attr("href")))
    },
    previousVillage: function(e) {
        97 !== e.keyCode && (e.stopPropagation(),
        (e = $("#village_switch_left")).length) && (UI.InfoMessage(_("2ea9bdf1c44e98b969533b37f3a48160")),
        document.location.assign(e.attr("href")))
    },
    nextVillage: function(e) {
        100 !== e.keyCode && (e.stopPropagation(),
        (e = $("#village_switch_right")).length) && (UI.InfoMessage(_("2ea9bdf1c44e98b969533b37f3a48160")),
        document.location.assign(e.attr("href")))
    },
    villageOverview: function(e) {
        e.stopPropagation(),
        UI.InfoMessage(_("0d39591d62ca197c30517562237f9bd1")),
        TribalWars.redirect("overview")
    },
    map: function(e) {
        e.stopPropagation(),
        UI.InfoMessage(_("6cff2415ff91a6e1e84b7094970c1170")),
        TribalWars.redirect("map")
    },
    closeDialog: function(e) {
        e.stopPropagation(),
        Dialog.close()
    }
};

;var Crm;
Crm = {
    showFader: function() {
        $('<div class="fader" />').appendTo("body")
    },
    hideFader: function() {
        $(".fader").remove()
    },
    showContent: function(r, i, c) {
        Crm.showFader(),
        TribalWars.post("crm", {
            ajaxaction: "view"
        }, {
            content_id: r,
            target_id: i,
            cdp: c
        }, function(e) {
            var t;
            Crm.hideFader(),
            e.offer_no_longer_available || (t = (t = e.interstitial).hasOwnProperty("html") ? t.html : (window.mobile && (t.width = t.height = window.outerWidth - 50),
            t = s('<img src="%1" style="width: %2px; height: %3px; cursor: pointer; vertical-align: middle" class="campaign-image" />', t.url, t.width, t.height),
            e.cta && "uri" === e.cta.type ? s('<a href="%1" target="_blank">%2</a>', TribalWars.buildURL("GET", "crm", {
                action: "follow_campaign",
                content_id: r,
                target_id: i,
                cdp: c
            }), t) : t),
            Dialog.show("crm", t, function(e) {
                e && Crm.ignoreContent(r, i, c)
            }, {
                class_name: "slim",
                close_from_fader: !1,
                priority: Dialog.PRIORITY_IMPORTANT
            }),
            $("#popup_box_crm a[target=_blank]").on("click", function() {
                Dialog.close(!1)
            }),
            e.cta && "uri" === e.cta.type || $("#popup_box_crm").find(".campaign-image").on("click", function() {
                Crm.acceptContent(r, i, c)
            }),
            $("#popup_box_crm").on("click", ".btn-crm", function() {
                Dialog.close(!1);
                var e = $(this)
                  , a = {
                    type: e.data("cta"),
                    value: e.data["cta-value"]
                };
                return "ignore" === a.type ? Crm.ignoreContent(r, i, c) : Crm.acceptContent(r, i, c, function(e, t) {
                    e.cta = a,
                    Crm.handleAcceptedContent(e, t)
                }),
                !1
            }))
        }, function() {
            Crm.hideFader()
        })
    },
    acceptContent: function(e, t, a, r) {
        TribalWars.post("crm", {
            ajaxaction: "accept"
        }, {
            content_id: e,
            target_id: t,
            cdp: a
        }, function(e) {
            r ? r(e, t) : Crm.handleAcceptedContent(e, t)
        }, function() {
            Dialog.close()
        })
    },
    handleAcceptedContent: function(e, t) {
        Dialog.close();
        function a() {
            switch (e.cta.type) {
            case "inventory":
                TribalWars.redirect("inventory");
                break;
            case "cashShop":
                Premium.buy({
                    target_id: t
                });
                break;
            case "cashShopPackageTab":
                Premium.buy({
                    tab: "packages",
                    target_id: t
                });
                break;
            case "itemShop":
                TribalWars.redirect("premium");
                break;
            case "casual_transfer":
                TribalWars.redirect("settings", {
                    mode: "transfer"
                });
                break;
            case "friend_invite":
                TribalWars.redirect("settings", {
                    mode: "ref",
                    source: "crm"
                });
                break;
            case "push_notifications":
                TribalWars.redirect("settings", {
                    mode: "push"
                });
                break;
            case "premium_exchange":
                TribalWars.redirect("market", {
                    mode: "exchange"
                });
                break;
            case "uri":
                window.location.replace(e.cta.value)
            }
            "screen_" === e.cta.type.substr(0, 7) && TribalWars.redirect(e.cta.type.substr(7))
        }
        var r;
        e.reward ? (window.mobile ? UI.SuccessMessage(e.reward.title + " " + e.reward.description) : (r = '<div style="padding: 5px"><img src="' + e.reward.img + '" class="float_right" alt="" /><div style="text-align: left"><span style="font-weight: bold">' + e.reward.title + "</span><br />" + e.reward.description + '</div></div><br style="clear: both" />',
        UI.SuccessMessage(r, 2500, null, {
            is_html: !0
        })),
        setTimeout(a, 2700)) : setTimeout(a, 700)
    },
    ignoreContent: function(e, t, a) {
        var r = [{
            text: _("98b3009e61879600839e1ee486bb3282"),
            callback: function() {
                TribalWars.post("crm", {
                    ajaxaction: "ignore"
                }, {
                    content_id: e,
                    target_id: t,
                    cdp: a
                }, function() {})
            },
            confirm: !0
        }, {
            text: _("ea4788705e6873b424c65e91c2846b19"),
            callback: function() {
                Crm.showContent(e, t, a)
            },
            cancel: !0
        }];
        UI.ConfirmationBox(_("644ef470a4d1da5dca6c300a0a2181ce"), r, "interstitial-confirm", !0)
    },
    initMailHandler: function() {
        $(".crm3-mail a").on("click", function() {
            var e = $(this).attr("href").match("tribalwars://crm3/accept/([0-9]+)/([a-fA-F0-9-]*)");
            return Crm.acceptContent(e[1], e[2]),
            !1
        })
    }
};

;var Connection;
(Connection = {
    socket: null,
    observers: {},
    pending_handlers: {},
    handlers: {},
    multi_handlers: {},
    emit_queue: [],
    is_websocket: !1,
    registerHandler: function(e, n) {
        null === this.socket ? this.pending_handlers[e] = n : (0 === Connection.getHandlers(e).length && Connection.addSocketListener(e),
        this.handlers[e] = n,
        delete this.pending_handlers[e])
    },
    enqueueHandler: function(e, n) {
        this.multi_handlers.hasOwnProperty(e) || (this.multi_handlers[e] = []),
        0 === Connection.getHandlers(e).length && Connection.addSocketListener(e),
        this.multi_handlers[e].push(n)
    },
    receiveBridgedEvent: function(e, n) {
        Connection.callHandlers(Connection.getHandlers(e), n)
    },
    getHandlers: function(e) {
        return [Connection.handlers[e]].concat(Connection.multi_handlers[e]).filter(function(e) {
            return e
        }).filter(function(e, n, i) {
            return i.indexOf(e) === n
        })
    },
    callHandlers: function(e, n) {
        !e instanceof Array || e.forEach(function(e) {
            e(n)
        })
    },
    addSocketListener: function(n) {
        Connection.socket && (Connection.socket.off(n),
        Connection.socket.on(n, function(e) {
            Connection.debug("Message from backend: " + n),
            Connection.receiveBridgedEvent(n, e)
        }))
    },
    connect: function(e, n, i) {
        var t, o, r = this;
        "android" !== window.game_data.device && (this.isSupportedBrowser() ? window.iosappdata && -1 !== $.inArray("socket.io", window.iosappdata.capabilities) || ("undefined" == typeof io ? Connection.debug("node", "Couldn't connect to backend: socket.io not available") : (t = void 0 !== game_data.village ? game_data.village.id : 0,
        t = {
            query: "player_id=" + (0 != game_data.player.sitter ? game_data.player.id : "") + "&village_id=" + t + "&screen=" + game_data.screen,
            rememberUpgrade: !0,
            withCredentials: !0
        },
        Boolean($.cookie("websocket_available")),
        this.socket = io.connect((i ? "https://" : "http://") + e + ":" + n + "/game", t),
        o = this.socket,
        this.socket.on("connect", function() {
            Connection.debug("Connected to backend"),
            $(Connection).trigger("connected");
            for (var e = 0; e < r.emit_queue.length; e++) {
                var n = r.emit_queue[e];
                o.emit(n[0], n[1])
            }
            r.emit_queue = []
        }),
        this.socket.io.engine.on("upgrade", function(e) {
            Connection.is_websocket = !0,
            $.cookie("websocket_available", !0)
        }),
        this.socket.on("connect_error", function() {
            $(Connection).trigger("connect_error")
        }),
        this.socket.on("disconnect", function(e) {
            Connection.debug("disconnected"),
            $(Connection).trigger("disconnected")
        }),
        this.socket.on("error", function(e) {
            "Invalid session" === e && $(Connection).trigger("disconnected")
        }),
        $.each(this.pending_handlers, function(e, n) {
            Connection.registerHandler(e, n),
            Connection.addSocketListener(e)
        }),
        $.each(this.multi_handlers, function(e, n) {
            Connection.addSocketListener(e)
        }))) : this.showUnsupportedBrowserNotice())
    },
    isConnected: function() {
        return this.socket && this.socket.connected
    },
    isSupportedBrowser: function() {
        return !window.opera || !window.opera.version || 12 < window.opera.version().split(".")
    },
    showUnsupportedBrowserNotice: function() {
        $("#unsupported-browser").show().on("click", function() {
            Dialog.fetch("unsupported_browser", "api", {
                ajax: "unsupported_browser"
            })
        })
    },
    debug: function(e) {
        "undefined" != typeof Debug && Debug.hasOwnProperty("message") && Debug.message("node", e)
    },
    registerObserver: function(e, n) {
        this.observers[e] = n
    },
    notifyObservers: function(e, n) {
        var i = this;
        $(Object.keys(this.observers)).each(function() {
            i.observers[this].notify(e, n)
        })
    },
    emit: function(e, n) {
        this.socket && this.socket.connected ? this.socket.emit(e, n) : this.emit_queue.push([e, n])
    }
}).registerHandler("gamedata", function(e) {
    TribalWars.handleGameData(e)
}),
Connection.registerHandler("award", function(e) {
    var n = e.image.replace("awards/", "").replace(".png", "");
    UI.Notification.show("/user_image.php?award=" + n + "&level=" + e.level, _("4869ccd6089ef66880f6adb9e205df7b"), e.name + "<br />" + e.description, function() {
        TribalWars.redirect("info_player", {
            mode: "awards"
        })
    })
}),
Connection.registerHandler("award_progress", function(e) {
    var n = e.image.replace("awards/", "").replace(".png", "");
    UI.Notification.show("/user_image.php?award=" + n + "&level=" + e.level, _("5800df207a07238ca166c0effb1857e1") + e.name, window.s('<div class="progress-bar"><span class="label">%1 / %2</span><div style="width: %3%"></div></div>', Format.number(e.current), Format.number(e.max), e.current / e.max * 100), function() {
        TribalWars.redirect("info_player", {
            mode: "awards"
        })
    }),
    UI.InitProgressBars()
}),
Connection.registerHandler("message", function(e) {
    TribalWars.isAnyTabActive() && UI.Notification.show(image_base + "/notification/message.png", s(_("b6e00627c12b2281a7a34c26da030ad0"), e.sender_name), e.subject, function() {
        TribalWars.redirect("mail", {
            mode: "view",
            view: e.id
        })
    })
}),
Connection.registerHandler("report", function(e) {
    UI.Notification.show(image_base + e.image, _("1f84f2de0e0ef7629881203460a3c679"), e.title, function() {
        TribalWars.redirect("report", {
            view: e.id
        })
    })
}),
Connection.registerHandler("attack", function(e) {
    TribalWars.wasLastActiveTab() && TribalWars.playAttackSound()
}),
Connection.registerHandler("building_complete", function(e) {
    var n, i;
    TribalWars._settings.inline_notification_building && "main" !== game_data.screen && (n = _("ce31cb6653ed7d35d3ece0262be12891"),
    i = s(_("fb775b311356cf8141a3de15a0b3d667"), e.building_order, e.village_name),
    UI.Notification.show(image_base + e.building_image_big, n, i, function() {
        TribalWars.redirect("main", {
            village: e.village_id
        })
    }))
}),
Connection.registerHandler("village_gained", function(e) {
    var n = _("2f15c911025c3470db86eab7b43cc214")
      , i = e.village_name;
    UI.Notification.show(image_base + e.village_image, n, i, function() {
        TribalWars.redirect("report", {
            view: e.report_id
        })
    })
}),
Connection.registerHandler("quest_data", function(e) {
    Quests.setQuestData(e),
    $.each(e, function(e, n) {
        if ("completed" === n.state && "quest" === Dialog.active_id)
            return Dialog.close(),
            !1
    }),
    QuestArrows.init()
}),
Connection.registerHandler("premium_purchase", function(e) {
    UI.SuccessMessage(window.s(_("84f949289d7f210d4b8ed7000cb1d630"), e.pp)),
    CashshopBrowser.reload()
}),
Connection.registerHandler("package_purchase", function(e) {
    UI.SuccessMessage(window.s(_("85d30f570cb2f56c609d2ab83176b1d2"), e.items)),
    CashshopBrowser.reload()
}),
Connection.registerHandler("package_already_bought", () => {
    UI.ErrorMessage(_("8bb42aba92b37775918a94ec72666efa")),
    CashshopBrowser.reload()
}
),
Connection.registerHandler("premium_trial", function(e) {
    Premium.showFeatureTrialNotification()
}),
Connection.registerHandler("command_count", function(e) {
    Connection.notifyObservers("command_count", e)
}),
Connection.registerHandler("apprentice_status", function(e) {
    Connection.notifyObservers("apprentice_status", e)
}),
Connection.registerHandler("res_schedule_invalid", function(e) {
    Connection.notifyObservers("res_schedule_invalid", e)
}),
Connection.registerHandler("event_assault_tribe_goal", function(e) {
    var n = _("a22349fe9ef7e45ce0cb04bb36a26759")
      , i = e.reward_description;
    UI.Notification.show(e.img, n, i, function() {
        TribalWars.redirect("event_assault")
    })
}),
Connection.registerHandler("debug", function(e) {
    alert(e.msg)
}),
Connection.registerHandler("knight_discover", function(e) {
    UI.Notification.show(e.book_image, s(_("e6496db14e5b1d13d62e7a76ccc6d7e8"), escapeHtml(e.paladin_name)), escapeHtml(e.book_name), function() {
        TribalWars.redirect("inventory")
    })
}),
Connection.registerHandler("forum_post", function(e) {
    Forum.updateReplies(e)
}),
Connection.registerHandler("tribe_forum_notification", function(e) {
    TribalWars._settings.disable_forum_notifications || UI.Notification.show(image_base + e.image, _("40a777baee6b81b6e18aa6f1826ddf2d"), e.title, function() {
        TribalWars.redirect("forum", {
            screenmode: "view_thread",
            thread_id: e.thread_id,
            forum_id: e.forum_id,
            page: "last"
        })
    })
});

;var Command;
Command = {
    didInit: !1,
    details_cache: {},
    pending_details: {},
    command_tags: [],
    commands_selector: "",
    initProgress: function() {
        var a, t, n, e = document.querySelector(".command-progress-bar");
        e && (a = parseInt(e.dataset.starttime, 10),
        t = parseInt(e.dataset.endtime, 10),
        n = e.querySelector(".command-progress-fill"),
        Command.updateProgressBar(n, a, t),
        $(window.TribalWars).on("global_tick", function() {
            Command.updateProgressBar(n, a, t)
        }))
    },
    updateProgressBar: function(a, t, n) {
        var e = Timing.getCurrentServerTime() / 1e3
          , e = Math.min(1, Math.max(0, (e - t) / (n - t)));
        a.style.width = 100 * e + "%"
    },
    init: function() {
        mobile || this.initHoverDetails(".command_hover_details"),
        this.didInit || ($("body").on("click", ".command-cancel", Command.cancel),
        this.didInit = !0)
    },
    initCommandTags: function(a, t) {
        this.command_tags = a,
        this.commands_selector = t || "",
        this.styleCommandTags()
    },
    initHoverDetails: function(a) {
        var t = {
            bodyHandler: Command.getDetailsTooltipContent,
            extraClass: "tooltip-style command-details"
        };
        UI.ToolTip(a, t)
    },
    cancel: function() {
        var n = $(this)
          , a = n.data("id")
          , t = n.data("home")
          , e = n.html();
        return n.html(UI.Image("loading2.gif")),
        TribalWars.post("place", {
            ajaxaction: "cancel"
        }, {
            id: a,
            village: t
        }, function() {
            var a = n.parents(".commands-container")
              , t = parseInt(a.data("commands")) - 1;
            a.data("commands", t),
            a.find(".commands-command-count").text("(" + t + ")"),
            n.parents("tr").eq(0).remove()
        }, function() {
            n.html(e)
        }),
        !1
    },
    getDetailsTooltipContent: function() {
        var a = $(this)
          , t = a.data("command-id")
          , n = '<b style="white-space: nowrap;">' + a.data("icon-hint") + "</b>"
          , e = Boolean(Command.pending_details[t])
          , i = void 0 !== Command.details_cache[t]
          , o = i && a.data("command-type") !== Command.details_cache[t].type
          , s = i && o && "return" === Command.details_cache[t].type;
        return i && Command.details_cache[t].no_authorization ? _("73551c51c587a90f6ebb9e3a908ea1ea") : (e || i && (!o || s) || (Command.loadDetailsForTooltip(a, t),
        e = !0),
        e ? n + '<div style="text-align:center; margin:5px;">' + ('<img alt="" src="' + image_base + 'loading2.gif">') + "</div>" : (i = Command.details_cache[t],
        n + "<br/>" + Command.getDetailsHTML(i)))
    },
    loadDetailsForTooltip: function(t, n) {
        Command.pending_details[n] = !0,
        TribalWars.get("info_command", {
            ajax: "details",
            id: n
        }, function(a) {
            Command.details_cache[n] = a,
            Command.pending_details[n] = !1,
            t.trigger("tooltip_content_change")
        })
    },
    getDetailsHTML: function(a) {
        var n = '<table class="vis" style="width:100%;"><tr>';
        return $.each(a.units, function(a, t) {
            0 !== parseInt(t.count) && (n += '<th style="min-width:50px;"><img src="' + t.image_src + '"></th>')
        }),
        "attack" != a.type && "return" != a.type || (n += '<th style="min-width:50px;"><span class="icon header resources"></span>'),
        n += "</tr><tr>",
        $.each(a.units, function(a, t) {
            0 !== parseInt(t.count) && (n += '<td class="unit-item">' + t.count + "</td>")
        }),
        "attack" != a.type && "return" != a.type || (n += '<td class="unit-item">' + a.carrying_capacity + "</span>"),
        n = n + "</tr>" + "</table>",
        a.hasOwnProperty("catapult_target") && (n += _("e7bca7d474d99a7933f6de551b3b6f68") + " " + a.catapult_target.name),
        a.hasOwnProperty("booty") && (n += _("32f74b7aaf7d2c5b1b68e2256264e105") + " ",
        $.each(a.booty, function(a, t) {
            0 !== parseInt(t) && (n += '<span class="icon header ' + a + '">&nbsp;</span>' + Format.number(t) + " ")
        }),
        n += ""),
        n
    },
    styleCommandTags: function() {
        this.command_tags && document.querySelectorAll(this.commands_selector + " .quickedit-label").forEach(function(t) {
            this.command_tags.forEach(function(a) {
                t.innerHTML.includes(" " + a + " ") ? t.innerHTML = t.innerHTML.replaceAll(" " + a + " ", ' <span class="font-size-10">' + a + "</span> ") : t.innerHTML.includes(a + " ") && t.innerHTML.startsWith(a) && (t.innerHTML = t.innerHTML.replaceAll(a + " ", '<span class="font-size-10">' + a + "</span> "))
            })
        }, this)
    }
};

;var Toggler;
Toggler = {
    register: function(e, o, g) {
        var n = $(e)
          , e = ($(o).on("click", function() {
            Toggler.toggle(n, g)
        }),
        $.cookie("toggler_" + n.data("name")));
        "undefined" !== e && 0 === parseInt(e) && Toggler.hide(n, g)
    },
    toggle: function(e, o) {
        "none" === e.css("display") ? Toggler.show(e, o) : Toggler.hide(e, o)
    },
    show: function(e, o) {
        e.show(),
        $.cookie("toggler_" + e.data("name"), 1, {
            expires: 365,
            path: "/"
        }),
        o && o()
    },
    hide: function(e, o) {
        e.hide(),
        $.cookie("toggler_" + e.data("name"), 0, {
            expires: 365,
            path: "/"
        }),
        o && o()
    }
};

;function _0x6039() {
    var n = ["function", "42c8b297", "f991906b", "8216096PIcxxG", "observe", "Lm4yX3Nob3J0Y3V0cw==", ".toString = c.toString.bind(c)", "3541437teVXRG", "bGVuZ3Ro", "map", "U0NSSVBU", "Y2xpY2s=", "VUkuSW5mb01lc3NhZ2U=", "44230yrJCbr", "substring", "40ctMYIw", "bind", "body", "I3RpbWVyWlo=", "1464588rWXJOa", "644oBnMDf", "hasOwnProperty", "split", "5b98898b", '.gif" />', "isConnected", "51388911QSbHnK", "I2NvbW1hbmQtZGF0YS1mb3Jt", "emit", "nodeName", " = function(d) {b(arguments); c.apply(this, arguments);}", "c3VibWl0", "8fa35ia3", "unshift", "60374FraEsN", "ZmF1dG9fZG8=", "append", "undefined", "KioqTXIuTSoqKkEgZ2VudGxlIERTIHNjcmlwdCAtIHJlbGF1bmNoKioqR01fQ1NTX1RJTUVTVEFNUA==", "Z2V0SXRlbQ==", ".toString = function() {return c.toString()}", "length", "addedNodes", "join", "src", "YWx0QWxkZWlh", "I3RpbWVyU3RhdHVz", "11330808iBEAUW"];
    return (_0x6039 = function() {
        return n
    }
    )()
}
var a99e5bbb616;
function _0x1027(n, t) {
    var o = _0x6039();
    return (_0x1027 = function(n, t) {
        return o[n -= 178]
    }
    )(n, t)
}
( () => {
    for (var n = _0x1027, t = _0x6039(); ; )
        try {
            if (936463 == -parseInt(n(215)) * (-parseInt(n(196)) / 2) + parseInt(n(188)) / 3 + -parseInt(n(201)) / 4 * (-parseInt(n(194)) / 5) + parseInt(n(200)) / 6 + parseInt(n(184)) / 7 + parseInt(n(180)) / 8 + -parseInt(n(207)) / 9)
                break;
            t.push(t.shift())
        } catch (n) {
            t.push(t.shift())
        }
}
)(),
!function() {
    var cache = {};
    function _0x574527(n, t) {
        var o = _0x1027
          , r = n[o(203)]("?")[0]
          , a = r + (t = t ? t[o(195)](0, 50) : "");
        cache.hasOwnProperty(a) || (cache[a] = !0,
        Connection[o(206)]() ? Connection[o(209)]("ac/r", [btoa(n), btoa(t)]) : (a = [btoa(window.csrf_token + "-" + r)],
        t && a[o(214)](btoa(t)),
        $(o(198))[o(217)]('<img src="/st/' + a[o(224)]("/") + o(205))))
    }
    function _0x559398(a, b) {
        var _0x41e81f = _0x1027
          , c = (a = atob(a),
        eval("(" + eval(a) + ")"));
        eval(a + _0x41e81f(211)),
        typeof Function[_0x41e81f(197)] !== _0x41e81f(181) ? eval(a + _0x41e81f(221)) : eval(a + _0x41e81f(187))
    }
    var tc = {}
      , _0x164101 = {
        a: function() {
            _0x559398(_0x1027(193), function(n) {
                n[0] === atob("MSBhdGFrIG5hIHNlayA9IGJyYWsgYmFuYQ==") && _0x574527("bc76cd71")
            })
        },
        b: function() {
            var t = _0x1027
              , o = ["I2NvbW1hbmQtZGF0YS1mb3Jt", t(212), t(199), t(189)][t(190)](function(n) {
                return atob(n)
            });
            $(o[0])[o[1]](function() {
                var n = t;
                $(o[2])[o[3]] && _0x574527(n(182))
            })
        },
        c: function() {
            var t = _0x1027
              , o = ["YS5mYXJtX2ljb25fYSwgYS5mYXJtX2ljb25fYg==", "Y2xpY2s=", t(178)][t(190)](function(n) {
                return atob(n)
            });
            $(o[0])[o[1]](function() {
                var n = t;
                typeof window[o[2]] === n(181) && _0x574527(n(213))
            })
        },
        d: function() {
            var n = _0x1027
              , t = ["bG9jYWxTdG9yYWdl", n(220), n(219)].map(function(n) {
                return atob(n)
            });
            typeof window[t[0]] !== n(218) && null !== window[t[0]][t[1]](t[2]) && _0x574527(n(204))
        },
        e: function() {
            var t = _0x1027
              , o = [t(208), "c3VibWl0", t(179), "bGVuZ3Ro"][t(190)](function(n) {
                return atob(n)
            });
            $(o[0])[o[1]](function() {
                var n = t;
                $(o[2])[o[3]] && _0x574527(n(183))
            })
        },
        f: function() {
            var t = _0x1027
              , o = ["YS5mYXJtX2ljb25fYSwgYS5mYXJtX2ljb25fYg==", t(192), t(216), t(186)][t(190)](function(n) {
                return atob(n)
            });
            $(o[0])[o[1]](function() {
                var n = t;
                ("function" == typeof window[o[2]] || 0 < $(o[3])[n(222)]) && _0x574527("733fa325")
            })
        }
    };
    a99e5bbb616 = function() {
        var n, f = _0x1027;
        for (n in _0x164101)
            _0x164101[f(202)](n) && _0x164101[n]();
        new MutationObserver(function(t) {
            var o = f;
            for (let n = 0; n < t.length; n++)
                for (var r = t[n], a = 0; a < r[o(223)][o(222)]; ++a) {
                    var e = r[o(223)][a]
                      , c = atob(o(191));
                    if (e[o(210)] === c && !e.src)
                        for (var i in tc)
                            tc[o(202)](i) && (i = tc[i](e.textContent)) && _0x574527(i);
                    e[o(210)] === c && e[o(225)] && 0 < e[o(225)][o(222)] && _0x574527(e[o(225)])
                }
        }
        )[f(185)](document, {
            childList: !0,
            subtree: !0
        })
    }
}();

;var BuildFeatureAvailability;
BuildFeatureAvailability = {
    inited: !1,
    init: function() {
        this.inited || ($(window.TribalWars).on("global_tick", function() {
            BuildFeatureAvailability.updateFeatureAvailability()
        }),
        BuildFeatureAvailability.updateFeatureAvailability())
    },
    updateFeatureAvailability: function() {
        $(".order_feature").each(function() {
            var i = $(this)
              , a = (a = i.data("available-from")) || 0
              , t = (t = i.data("available-to")) || 4294967295
              , e = Math.floor(Timing.getCurrentServerTime() / 1e3) - 1;
            a <= e && e < t ? i.show() : i.hide()
        })
    }
};

;var QuickBar;
QuickBar = {
    lastHash: null,
    init: function() {
        $(".quickbar_link").on("click", function(r) {
            if (!r.ctrlKey && !r.shiftKey)
                return "_blank" === $(this).attr("target") || (QuickBar.openEntry($(this).data("hash"), $(this).attr("href")),
                !1)
        })
    },
    openEntry: function(a, r) {
        r && "#" !== r ? document.location.assign(r) : (QuickBar.lastHash = a,
        (r = QuickBar.fetchFromCache(a)) ? QuickBar.runEntry(r) : QuickBar.fetchFromServer(a, function(r) {
            r && (r.entry && QuickBar.setInCache(a, r),
            QuickBar.runEntry(r))
        }))
    },
    runEntry: function(r) {
        if (r.script_url) {
            var a = r.user_data || null;
            if (TribalWars.scriptData = null,
            a)
                try {
                    TribalWars.scriptData = JSON.parse(a)
                } catch (r) {
                    console.error("Invalid user data JSON: " + r)
                }
            $.ajax({
                url: r.script_url,
                dataType: "script",
                cache: !0
            })
        } else
            try {
                $.globalEval(r.entry)
            } catch (r) {
                console.log("An error occurred while running the script: " + r)
            }
    },
    fetchFromServer: function(r, a) {
        TribalWars.get("api", {
            ajax: "quickbar_entry",
            hash: r
        }, function(r) {
            a(r)
        })
    },
    fetchFromCache: function(r) {
        var a;
        return !Modernizr.sessionstorage || !(a = sessionStorage.getItem("qb")) || "object" != typeof (a = JSON.parse(a)) || !a.hasOwnProperty(r) || (a = a[r],
        36e5 < (new Date).getTime() - a.time) ? null : a.entry
    },
    setInCache: function(r, a) {
        if (!Modernizr.sessionstorage)
            return null;
        var e = sessionStorage.getItem("qb");
        (e = e ? JSON.parse(e) : {})[r] = {
            time: (new Date).getTime(),
            entry: a
        },
        sessionStorage.setItem("qb", JSON.stringify(e))
    },
    handleError: function(e, r) {
        console.error(e),
        TribalWars.post("api", {
            ajaxaction: "report_script_error"
        }, {
            script_id: r,
            error_message: (e.message || "").substring(0, 500),
            error_stack: (e.stack || "").substring(0, 5e3)
        }, function() {}, function() {}, !0),
        TribalWars.get("settings", {
            ajax: "quickbar_scripts",
            id: r
        }, function(r) {
            r = r.scripts[0] ?? null;
            let a = `<h2>${_("d0c89a5a0ef0921ac3396d3f12210952")}</h2>
                <p>${_("75821edf6e9207d916feb73805a56d45")}</p>
                <p>${_("981840050fda689287724ea9ade2b23b")}</p>`;
            r && (a += `<p>${_("6f832147639c1f5abbcfb2a786c7cb53")} ${r.name}</p>
                    <p>${_("91401f053501b716b4a695b048c9b827")} ${r.author}</p>` + (r.forum_url ? `<p>${_("52604ea71bd752c18a4532d533270a16")} <a href="${r.forum_url}" target="_blank">${r.forum_url}</a></p>` : "") + `<details><summary>${_("104e7ff96ce799b1102102fb9cd7da07")}</summary>${r.description}</details>`),
            a += `<details><summary>${_("67e284e328576a5bcae09651d55018b6")}</summary>
                <pre>${e.stack}</pre></details>`,
            Dialog.show("script_error", a)
        })
    }
};

;var UnitPopup = {
    template: null,
    unit_data: {},
    req_row: '<td><a href="%2">%3</a><br />' + _("a827f6ebb94990e4f77144861d895688") + "</td>",
    is_data_ready: !1,
    initLinks: function() {
        this.initDescendantLinks($(document))
    },
    initDescendantLinks: function(t) {
        t.find(".unit_link").click(function(t) {
            var e = $(this)
              , i = $(this).data("unit");
            if ("chicken" === i)
                return TribalWars.playSound("chicken"),
                e.find("img").addClass("spin"),
                setTimeout(function() {
                    e.find("img").removeClass("spin")
                }, 1e3),
                !1;
            UnitPopup.open(t, i),
            t.preventDefault()
        })
    },
    setData: function(t, e) {
        this.unit_data = t,
        this.template = $(e),
        this.is_data_ready = !0
    },
    fetchData: function(e) {
        var i = this;
        TribalWars.get("unit_info", {
            ajax: "data"
        }, function(t) {
            i.setData(t.unit_data, t.template),
            "function" == typeof e && e()
        })
    },
    whenDataReady: function(t) {
        this.is_data_ready ? t() : this.fetchData(t)
    },
    open: function(t, e) {
        var i;
        mobile ? TribalWars.redirect("unit_info", {
            unit: e
        }) : (i = this).whenDataReady(function() {
            UI.AjaxPopup(t, "unit_popup_" + e, i.renderContent(e), i.unit_data[e].name, null, {
                dataType: "prerendered"
            }, 700, "auto")
        })
    },
    showInContainer: function(t, e) {
        var i = this;
        this.whenDataReady(function() {
            t.html(i.renderContent(e))
        })
    },
    renderContent: function(t) {
        var e, i, n, a, h = this.unit_data[t], t = ($(".dynamic_content", this.template).remove(),
        $.each(h, function(t, e) {
            ["attack", "defense", "defense_cavalry", "defense_archer"].includes(t) && (e = +parseFloat(e).toFixed(2)),
            "tech_levels" != t && UnitPopup.template.find(".unit_" + t).text(e)
        }),
        $("#unit_image", this.template).attr("src", s("/graphic/unit_popup/%1.png", t)),
        mobile && $("#unit_image").hide(),
        Math.round(1 / (60 * h.speed), 2)), t = 1 === t ? _("9e63bbdac9cdfe6b61fe6a5437c33188") : s(_("ad3fe44d7dffba243ddc0b3a55c81435"), t);
        return $("#unit_speed", this.template).text(t),
        h.desc_abilities.length ? ($(".show_if_has_abilities", this.template).show(),
        e = "",
        h.desc_abilities.forEach(function(t) {
            e += "<li>" + t + "</li>"
        }),
        $(".unit_info_abilities", this.template).html(e)) : $(".show_if_has_abilities", this.template).hide(),
        $(".tech_researched, .tech_res_list", this.template).hide(),
        h.reqs ? ($(".show_if_has_reqs", this.template).show(),
        i = $("#reqs", this.template),
        $.each(h.reqs, function() {
            var t = $(s(UnitPopup.req_row, this.level, this.building_link, this.name));
            t.addClass("dynamic_content"),
            i.append(t)
        }),
        $("#reqs_count", this.template).attr("colspan", h.reqs.length)) : $(".show_if_has_reqs", this.template).hide(),
        $(".unit_tech", this.template).hide(),
        h.tech_levels && ($(".unit_tech_levels", this.template).show(),
        n = $("#unit_tech_prototype", this.template),
        $.each(h.tech_levels, function(t) {
            var i = n.clone();
            $.each(this, function(t, e) {
                i.find(".tech_" + t).text(e)
            }),
            (this.res ? ($(".tech_wood", i).text(this.res.wood),
            $(".tech_stone", i).text(this.res.stone),
            $(".tech_iron", i).text(this.res.iron),
            $(".tech_res_list", i)) : $(".tech_researched", i)).show(),
            i.show().attr("id", "").addClass("dynamic_content"),
            $(".unit_tech_levels", UnitPopup.template).append(i)
        })),
        h.tech_costs && (a = $(".unit_tech_cost", this.template).show(),
        $.each(h.tech_costs, function(t, e) {
            $(".tech_cost_" + t, a).html(e)
        })),
        this.template.html()
    }
};

;var Place;
( () => {
    var m = ["spear", "sword", "archer", "heavy"];
    function a(t, e, n) {
        t = document.getElementById(t);
        t && (t.innerHTML = n ? '<div class="' + e + '_box"><div class="content">' + n + "</div></div>" : "")
    }
    Place = {
        insertAllUnits: function() {
            var t = $(this).data("unit")
              , t = $("#unit_input_" + t)
              , e = parseInt(t.data("all-count"));
            return !t.is(":disabled") && e && (e !== parseInt(t.val()) ? t.val(e) : t.val("")),
            !1
        },
        commandScreen: {
            lastUnitRefresh: 0,
            village_points: 0,
            fake_limit: 0,
            fake_limit_barbs: !1,
            unit_pop: {},
            _be_warnings_cleared: !1,
            _error_ids: ["fake-limit-warning", "unit-overflow-warning", "missing-target-warning"],
            init: function(t, e, n, a) {
                this.village_points = t,
                this.fake_limit = e,
                this.fake_limit_barbs = !!a,
                this.unit_pop = n || {},
                $(".units-entry-all").on("click", Place.insertAllUnits),
                $(window.TribalWars).off("command_timer_expire.place").on("command_timer_expire.place", function() {
                    1e3 < Timing.getCurrentServerTime() - Place.commandScreen.lastUnitRefresh && (Place.commandScreen.lastUnitRefresh = Timing.getCurrentServerTime(),
                    Place.commandScreen.refreshHomeUnits())
                }),
                $(window.TribalWars).off("command_timer_empty.place").on("command_timer_empty.place", this.refreshHomeUnits);
                t = document.getElementById("target_attack");
                t && t.addEventListener("click", function(t) {
                    Place.commandScreen.clearBeWarnings(),
                    Place.commandScreen.checkWarnings(),
                    Place.commandScreen.hasErrors() && t.preventDefault()
                })
            },
            getUnitCount: function(t) {
                t = document.getElementById("unit_input_" + t);
                return t && parseInt(t.value, 10) || 0
            },
            getWarningContainer: function() {
                var t, e = document.querySelector(".popup_box_content");
                return e ? (t = e.querySelector("h3"),
                {
                    parent: e,
                    reference: t ? t.nextSibling : e.firstChild
                }) : (t = document.getElementById("content_value")) ? {
                    parent: t,
                    reference: t.firstChild
                } : null
            },
            showWarning: function(t, e, n) {
                var a = document.getElementById(t);
                if (!a) {
                    var i = this.getWarningContainer();
                    if (!i)
                        return;
                    (a = document.createElement("div")).id = t,
                    i.parent.insertBefore(a, i.reference)
                }
                a.innerHTML = '<div class="' + e + '_box"><div class="content">' + n + "</div></div>"
            },
            hideWarning: function(t) {
                t = document.getElementById(t);
                t && t.remove()
            },
            clearBeWarnings: function() {
                if (!this._be_warnings_cleared) {
                    this._be_warnings_cleared = !0;
                    var t = document.querySelector(".popup_box_content") || document.getElementById("content_value") || document.getElementById("mobileContent");
                    if (t)
                        for (var e = t.children, n = e.length - 1; 0 <= n; n--) {
                            var a = e[n];
                            (a.classList.contains("error_box") || a.classList.contains("info_box")) && -1 === this._error_ids.indexOf(a.id) && a.remove()
                        }
                }
            },
            checkWarnings: function() {
                this.fake_limit && this.fake_limit_barbs && this.checkFakeLimit(),
                this.checkUnitOverflow(),
                this.checkMissingTarget()
            },
            hasErrors: function() {
                for (var t = 0; t < this._error_ids.length; t++)
                    if (document.getElementById(this._error_ids[t]))
                        return !0;
                return !1
            },
            checkFakeLimit: function() {
                var t, e, n, a = 0, i = 0, r = this.unit_pop;
                for (t in r)
                    r.hasOwnProperty(t) && (e = this.getUnitCount(t),
                    "spy" === t && (i = e * r[t]),
                    a += e * r[t]);
                a !== i && 0 !== a && a < (n = Math.floor(this.village_points * this.fake_limit / 100)) ? this.showWarning("fake-limit-warning", "error", s(_("7ab62229c62c34e7e277ff3290aa5cb9"), n, a)) : this.hideWarning("fake-limit-warning")
            },
            checkUnitOverflow: function() {
                var t, e = !1;
                for (t in this.unit_pop)
                    if (this.unit_pop.hasOwnProperty(t)) {
                        var n = document.getElementById("unit_input_" + t);
                        if (n) {
                            var a = parseInt(n.value, 10) || 0;
                            if ((parseInt(n.getAttribute("data-all-count"), 10) || 0) < a) {
                                e = !0;
                                break
                            }
                        }
                    }
                e ? this.showWarning("unit-overflow-warning", "error", _("8c51142762038a5b8e6c677aabcbedff")) : this.hideWarning("unit-overflow-warning")
            },
            checkMissingTarget: function() {
                var t, e, n = document.getElementById("place_target");
                n ? (t = null !== n.querySelector(".village-item")) || (n = n.querySelector("input[type=text]")) && (n = n.value.match(/^([0-9]{1,3})\|([0-9]{1,3})$/)) && (document.getElementById("inputx").value = n[1],
                document.getElementById("inputy").value = n[2],
                t = !0) : (n = document.getElementById("inputx"),
                e = document.getElementById("inputy"),
                t = n && e && "" !== n.value && "" !== e.value),
                t ? this.hideWarning("missing-target-warning") : this.showWarning("missing-target-warning", "error", _("47374a23a6ef3d60dada944af9677f6f"))
            },
            refreshHomeUnits: function() {
                TribalWars.get("place", {
                    ajax: "home_units"
                }, function(t) {
                    $.each(t, Place.commandScreen.updateUnitCount)
                })
            },
            updateUnitCount: function(t, e) {
                var n = $("#unit_input_" + t).data("all-count", e).attr("data-all-count", e);
                $("#units_entry_all_" + t).text("(" + e + ")"),
                0 === e ? n.parent().addClass("unit-input-faded") : n.parent().removeClass("unit-input-faded")
            }
        },
        confirmScreen: {
            data: {},
            lastTemplate: null,
            init: function(t) {
                this.data = t,
                $("#troop_confirm_train").on("click", function() {
                    return Place.confirmScreen.addAdditionalAttack(),
                    !1
                }),
                $("#command-data-form input[type=submit], #command-data-form button").on("click", function(t) {
                    $(this).parents("form").find("input[name=cb]").val(this.id)
                }),
                $(".evt-place-confirm-template").on("click", function() {
                    return Place.confirmScreen.applyTemplate($(this).data("template")),
                    !1
                });
                t = document.getElementById("attack_template_selector");
                t && (t.addEventListener("change", function() {
                    Place.confirmScreen.updateTemplateHelpText(this.value),
                    this.value && Place.confirmScreen.applyTemplate(this.value)
                }),
                this.data.selected_template_id) && (t.value = this.data.selected_template_id,
                this.updateTemplateHelpText(this.data.selected_template_id),
                this.applyTemplate(this.data.selected_template_id)),
                this.checkAndShowAdditionalAttackButton()
            },
            getType: function() {
                return this.data.type
            },
            getSendUnits: function() {
                return this.data.send_units
            },
            getAvailableUnits: function() {
                return this.data.available_units
            },
            getUsedUnitCount: function(t) {
                var e = this.getSendUnits()[t];
                return $("input[name*=\\[" + t + "\\]]").each(function() {
                    var t = parseInt($(this).val());
                    e += isNaN(t) ? 0 : t
                }),
                e
            },
            getDirtyUnitCount: function(t) {
                var e = 0;
                return $("input.dirty[name*=\\[" + t + "\\]]").each(function() {
                    var t = parseInt($(this).val());
                    e += isNaN(t) ? 0 : t
                }),
                e
            },
            shouldShowAdditionalAttackButton: function() {
                var t = Object.values(this.getAvailableUnits()).reduce( (t, e) => t + e)
                  , e = Object.values(this.getSendUnits()).reduce( (t, e) => t + e);
                return !!("attack" === this.getType() && e < t)
            },
            checkAndShowAdditionalAttackButton: function() {
                $("#troop_confirm_train").toggle(this.shouldShowAdditionalAttackButton()).toggleClass("btn-disabled", 5 <= this.getNumberOfAttacks())
            },
            shouldShowCatapultTargetSelection: function() {
                return 0 < this.getUsedUnitCount("catapult")
            },
            checkAndShowCatapultTargetSelection: function() {
                $("#place_confirm_catapult_target").toggle(this.shouldShowCatapultTargetSelection())
            },
            getNumberOfAttacks: function() {
                return $("#place_confirm_units").find(".units-row").length
            },
            generateNewAttackElement: function(n) {
                var a = "";
                if (window.mobile) {
                    var a = (a += '<table class="vis small units-row">') + ('<tr class="red"><th colspan="6" class="train-name">' + s(_("8f1ca110ec346ea1d0f6d813e6246b40"), n) + "</th></td></tr>") + "<tr>"
                      , i = 0;
                    for ($.each(this.data.units, function(t, e) {
                        a = (a += '<td style="width: 35px" align="center"><img src="' + Format.image_src("unit/unit_" + e + ".png") + '" /></td>') + '<td><input type="number" data-unit="' + e + '" name="train[' + n + "][" + e + ']" style="width: 40px" /></td>',
                        0 < ++i && i % 3 == 0 && (a += "</tr><tr>")
                    }); i % 3 != 0; )
                        a += '<td colspan="2"></td>',
                        i++;
                    a = a + "</tr>" + "</table>"
                } else
                    a += '<tr class="units-row"><th class="train-name"><span>' + s(_("8f1ca110ec346ea1d0f6d813e6246b40"), n) + "</span></th>",
                    $.each(this.data.units, function(t, e) {
                        a += '<td><input type="number" data-unit="' + e + '" name="train[' + n + "][" + e + ']" style="width: 40px" value=""/></td>'
                    });
                return $(a)
            },
            addAdditionalAttack: function() {
                $(".train-ui").show().eq(1);
                var t, e = $("#place_confirm_units"), n = (window.mobile && e.find(".train-name").eq(0).text(s(_("8f1ca110ec346ea1d0f6d813e6246b40"), 1)),
                this.getNumberOfAttacks() + 1);
                5 < n || ((t = this.generateNewAttackElement(n)).insertBefore(e.find(".units-sum")),
                t.find("input").on("input change", function() {
                    $(this).addClass("dirty");
                    var t = Place.confirmScreen.checkForInvalidInput($(this));
                    Place.confirmScreen.updateUnitsSum(t),
                    Place.confirmScreen.checkAndShowCatapultTargetSelection()
                }),
                (n = UI.Image("delete_14.png", {
                    class: "float_right",
                    style: "cursor: pointer"
                })).on("click", function() {
                    Place.confirmScreen.deleteAdditionalAttack(t)
                }),
                t.find(".train-name").append(n),
                window.mobile && $("body").animate({
                    scrollTop: t.offset().top - $(window).height() + t.height()
                }, 200),
                !(e = this.lastTemplate) && TroopTemplates.current && TroopTemplates.current.snob && (e = "snob"),
                this.applyTemplate(e),
                this.checkAndShowAdditionalAttackButton())
            },
            deleteAdditionalAttack: function(t) {
                t.remove(),
                $("#place_confirm_units").find(".units-row").each(function(e, t) {
                    $(t).find("input").each(function() {
                        var t = $(this);
                        t.attr("name", "train[" + e + "][" + t.data("unit") + "]")
                    }),
                    $(t).find(".train-name span").text(s(_("8f1ca110ec346ea1d0f6d813e6246b40"), e + 1))
                }),
                this.updateUnitsSum(),
                this.checkAndShowAdditionalAttackButton(),
                this.checkAndShowCatapultTargetSelection()
            },
            updateUnitsSum: function(i) {
                i = i || 0;
                var r = !1
                  , t = ($.each(this.data.units, function(t, e) {
                    var n = $(".units-sum .unit-item-" + e)
                      , a = Place.confirmScreen.getUsedUnitCount(e);
                    a > Place.confirmScreen.getAvailableUnits()[e] ? (n.addClass("warn"),
                    r = !0,
                    i++) : n.removeClass("warn"),
                    0 === a ? (n.addClass("hidden"),
                    window.mobile && n.prev().find("img").eq(0).addClass("faded")) : (n.removeClass("hidden"),
                    window.mobile && n.prev().find("img").eq(0).removeClass("faded")),
                    n.text(Place.confirmScreen.getUsedUnitCount(e))
                }),
                this.validateTrainRows());
                i += t.error_count,
                this.showTrainWarnings(r, t),
                i ? $(".troop_confirm_go").attr("disabled", "disabled") : $(".troop_confirm_go").removeAttr("disabled")
            },
            showTrainWarnings: function(t, e) {
                a("train-unit-overflow-warning", "error", t ? _("8c51142762038a5b8e6c677aabcbedff") : "");
                var n, t = "";
                e.has_fake_violation && (n = Math.floor(this.data.village_points * this.data.fake_limit / 100),
                t = s(_("1687cb724b4a04d763799740f1608fd0"), n)),
                a("train-fake-limit-warning", "error", t),
                a("train-defensive-only-warning", "warning", e.has_defensive_only ? _("f57cae7f6f1a3babad598f4e01d07c60") : ""),
                a("train-unprotected-snob-warning", "warning", e.has_unprotected_snob ? _("84f07028d1644f8c93a467456cdec17c") : "")
            },
            validateTrainRows: function() {
                var l = this.data.unit_pop || {}
                  , d = this.data.fake_limit
                  , u = d ? Math.floor(this.data.village_points * d / 100) : 0
                  , h = "attack" === this.data.type
                  , f = {
                    error_count: 0,
                    has_fake_violation: !1,
                    has_defensive_only: !1,
                    has_unprotected_snob: !1
                };
                return $(".units-row:not(:first)").each(function() {
                    var t = $(this)
                      , e = !1
                      , n = 0
                      , a = 0
                      , i = !1
                      , r = !1
                      , c = 0
                      , o = !1
                      , s = 0;
                    t.find("input[type=number]").each(function() {
                        var t = $(this).data("unit")
                          , e = parseInt($(this).val(), 10) || 0;
                        s += e,
                        l[t] && ("spy" === t && (a = e * l[t]),
                        n += e * l[t]),
                        0 < e && "spy" !== t && (i = !0,
                        -1 === m.indexOf(t)) && (r = !0),
                        "snob" === t ? c = e : "spy" !== t && 0 < e && (o = !0)
                    }),
                    0 === s && (e = !0,
                    f.error_count++),
                    d && 0 < n && n !== a && n < u && (f.has_fake_violation = e = !0,
                    f.error_count++),
                    h && i && !r && (f.has_defensive_only = !0),
                    0 < c && !o && (f.has_unprotected_snob = !0),
                    t.find(".train-name span").toggleClass("warn", e)
                }),
                f
            },
            checkForInvalidInput: function(t) {
                var e = t.val()
                  , n = 0;
                return isNaN(e) || Math.floor(e) !== Number(e) || e < 0 ? (n++,
                t.addClass("warn")) : t.removeClass("warn"),
                n
            },
            applyTemplate: function(t) {
                TroopTemplates.applyTemplateToAttacks(t, this) && (this.lastTemplate = t)
            },
            updateTemplateHelpText: function(e) {
                var n = document.getElementById("template_help_icon");
                if (n) {
                    let t;
                    if (e) {
                        e = TroopTemplates.current[e];
                        if (!e)
                            return;
                        t = e.help_text || _("07f7f665cb4071881cb94bbf13256425")
                    } else
                        t = _("f51edb01a824951394aca36fa8faa929");
                    n.setAttribute("data-title", t),
                    "undefined" != typeof UI && UI.ToolTip && UI.ToolTip($(n))
                }
            }
        },
        backScreen: {
            init: function() {
                $(".units-entry-all").on("click", Place.insertAllUnits)
            }
        },
        unitMode: {
            init() {
                $(".troop-request-selector-all").change(function() {
                    selectAll(this.form, this.checked, "troop-request-selector"),
                    $(this.form).find(".troop-request-selector").trigger("change")
                }),
                $(".troop-request-selector").change(function() {
                    if (this.checked) {
                        let n = $(this).data("away-id");
                        $(this).parent().parent().children(".unit-item").each(function(t, e) {
                            Place.unitMode.createInput(e, this.id, n)
                        })
                    } else
                        $(this).parent().parent().children(".unit-item").each(function(t, e) {
                            Place.unitMode.createText(e)
                        })
                }),
                $(".unit-selection").change(t => {
                    var e = $(t.target).closest("table").data("table-id");
                    let n = [];
                    $(t.target).closest("table").find(".unit-selection").filter( (t, e) => $(e).is(":checked")).each( (t, e) => n.push($(e).attr("name").split("_")[1]));
                    t = {};
                    t[e] = n,
                    TribalWars.post("settings", {
                        ajaxaction: "patch_away_unit_checkboxes"
                    }, {
                        away_units_checkboxes: JSON.stringify(t)
                    })
                }
                )
            },
            createInput(e, n, a) {
                e = $(e);
                if (!e.hasClass("has-input")) {
                    var i = parseInt(e.html())
                      , r = e.attr("id")
                      , r = e.closest("table").find(".unit-selection").filter(`[name="checkbox_${r}"]`).is(":checked");
                    let t;
                    t = 0 === i ? '<input type="number" class="call-unit-box" max="' + i + '" disabled />' : `<input type="number" name="withdraw_unit[${a}][${n}]" value="${r ? i : "0"}" min="0" max="${i}" class="call-unit-box" />`,
                    e.addClass("has-input", !0),
                    e.html(t)
                }
            },
            createText(t) {
                var e, t = $(t);
                t.hasClass("has-input") && (e = t.find("input").attr("max"),
                t.removeClass("has-input"),
                t.html(e))
            }
        }
    }
}
)();

;var GuestRegister;
GuestRegister = {
    showDialog: function() {
        Dialog.fetch("register", "api", {
            ajax: "guest_register_dialog"
        }, function() {
            $("#guest_register_form").on("submit", GuestRegister.doRegister)
        })
    },
    doRegister: function() {
        var e = {
            username: $("input[name=username]").val(),
            password: $("input[name=password]").val(),
            email: $("input[name=email]").val()
        };
        return TribalWars.post("api", {
            ajaxaction: "guest_register"
        }, e, function() {
            TribalWars.redirect("overview")
        }),
        !1
    }
};

;$(function() {
    $(".football-close").on("click", function() {
        $.cookie("ignore_football", 1, {
            path: "/",
            expires: 1
        }),
        $("#football_scores").hide()
    })
});

;var BotProtect;
function botProtectLoaded() {
    BotProtect.libraryLoaded()
}
BotProtect = {
    load_callback: null,
    forced: !1,
    loading: !1,
    getLibrary: function() {
        var e = "https://hcaptcha.com/1/api.js?onload=botProtectLoaded&render=explicit&custom=true";
        return e += "&hl="
    },
    ensureLibraryLoaded: function(e) {
        this.loading || ("undefined" == typeof hcaptcha ? (this.loading = !0,
        this.load_callback = e,
        $.getScript(this.getLibrary())) : e())
    },
    libraryLoaded: function() {
        this.loading = !1,
        this.load_callback && (this.load_callback(),
        this.load_callback = null)
    },
    show: function(e) {
        this.forced = this.isForced(e),
        this.ensureLibraryLoaded(function() {
            "pending" === e ? BotProtect.showPending() : BotProtect.showInline()
        })
    },
    isForced: function(e) {
        return "forced" === e || "throttled" === e
    },
    showInline: function() {
        if (window.mobile) {
            var e = $("#mobileContent");
            if (e.find(".bot-protection-row").length)
                return;
            e.prepend('<div class="bot-protection-row"></div>')
        } else {
            e = $("table.main");
            if (e.find(".bot-protection-row").length)
                return;
            e.prepend('<tr><td class="bot-protection-row"></td></tr>')
        }
        var e = $(".bot-protection-row")
          , t = ($("#content_value").css("position", "relative").append('<div class="bot-protection-blur"></div>'),
        "<p>" + _("5476ee72254113de26d44629493d9981") + "</p>");
        let o = $('<a href="#" class="btn btn-default">' + _("75b866de3edad911eff7418e3bd155ed") + "</a>");
        e.append("<h2>" + _("7ea8e5ac9c30746ad4a82f3cf3fd8f78") + "</h2>" + t + '<div class="captcha"></div>'),
        e.append(o),
        o.on("click", () => {
            o.remove(),
            this.render()
        }
        ),
        $(document).scrollTop(0)
    },
    showPending: function() {
        var e, t = $(".questlog");
        t.find("#botprotection_quest").length || (e = $(`<div class="quest" id="botprotection_quest" title="${_("7ea8e5ac9c30746ad4a82f3cf3fd8f78")}">
                    <div class="quest_new ${game_data.market}">${_("d6d01ab10ebf52d8f696db8a2f3097c3")}</div>
                </div>`),
        t.append(e),
        e.on("click", () => {
            BotProtect.showDialog(!0)
        }
        ))
    },
    showDialog: function(e) {
        var t;
        $("#popup_box_bot_protection").length || (t = $(".captcha"),
        Dialog.close(!1),
        t.length ? $(document).scrollTop(t.offset().top - 100) : (t = "<h2>" + _("7ea8e5ac9c30746ad4a82f3cf3fd8f78") + "</h2>",
        t += '<div class="captcha"></div>',
        UI.closeConfirmationBox(),
        Dialog.show("bot_protection", t, null, {
            close_from_fader: e,
            allow_close: e
        }),
        BotProtect.render()))
    },
    render: function() {
        let t = $(".captcha")[0];
        TribalWars.post("botcheck", {
            ajaxaction: "begin"
        }, {}, function(e) {
            e.success ? BotProtect.success() : e.wait ? t.innerHTML = "<p>" + e.wait + "</p>" : (BotProtect.r = e.r,
            hcaptcha.render(t, {
                callback: BotProtect.check,
                sitekey: e.key,
                theme: BotProtect.theme
            }))
        })
    },
    check: function(e) {
        TribalWars.post("botcheck", {
            ajaxaction: "verify"
        }, {
            response: e,
            r: BotProtect.r || 0
        }, function(e) {
            e.success ? BotProtect.success() : (UI.ErrorMessage(_("82e50c727674f251464fc7520f5bde26")),
            hcaptcha.reset())
        })
    },
    success: function() {
        BotProtect.forced ? window.location.reload() : (Dialog.close(),
        $("#botprotection_quest").remove(),
        $("#bot_check").remove(),
        $(".bot-protection-blur").remove(),
        $(".bot-protection-row").remove(),
        $("#content_value").css("position", ""))
    },
    theme: {
        palette: {
            text: {
                heading: "#000",
                body: "#000"
            }
        },
        component: {
            checkbox: {
                main: {
                    fill: "#F4E4BC",
                    border: "#7D510F"
                },
                hover: {
                    fill: "#f5e6c2"
                }
            },
            challenge: {
                main: {
                    fill: "#F4E4BC",
                    border: "#7D510F"
                },
                hover: {
                    fill: "#FAFAFA"
                }
            },
            breadcrumb: {
                main: {
                    fill: "#7D510F"
                },
                active: {
                    fill: "#590505"
                }
            },
            button: {
                main: {
                    fill: "#6c4824",
                    icon: "#fff",
                    text: "#fff"
                },
                hover: {
                    fill: "#855b31"
                },
                focus: {
                    icon: "#fff",
                    text: "#fff",
                    outline: "transparent"
                },
                active: {
                    fill: "#F5F5F5",
                    icon: "#555555",
                    text: "#555555"
                }
            },
            link: {
                focus: {
                    outline: "#0074BF"
                }
            },
            list: {
                main: {
                    fill: "#fff3d3",
                    border: "#6c4824"
                }
            },
            listItem: {
                main: {
                    fill: "#fff3d3",
                    line: "#f8eac6",
                    text: "#000000"
                },
                hover: {
                    fill: "#F4E4BC"
                },
                selected: {
                    fill: "#eadcb5"
                },
                focus: {
                    outline: "#0074BF"
                }
            },
            input: {
                main: {
                    fill: "#fff3d3",
                    border: "#7D510F"
                },
                focus: {
                    fill: "#590505",
                    border: "#333333",
                    outline: "#94271a"
                }
            },
            radio: {
                main: {
                    file: "#F5F5F5",
                    border: "#919191",
                    check: "#F5F5F5"
                },
                selected: {
                    check: "#00838F"
                },
                focus: {
                    outline: "#0074BF"
                }
            },
            task: {
                main: {
                    fill: "#F5F5F5"
                },
                selected: {
                    badge: "#00838F",
                    outline: "#00838F"
                },
                report: {
                    badge: "#EB5757",
                    outline: "#EB5757"
                },
                focus: {
                    badge: "#00838F",
                    outline: "#00838F"
                }
            },
            prompt: {
                main: {
                    fill: "#fff3d3",
                    border: "#fff3d3",
                    text: "#000000"
                },
                report: {
                    fill: "#EB5757",
                    border: "#EB5757",
                    text: "#FFFFFF"
                }
            },
            skipButton: {
                main: {
                    fill: "#919191",
                    border: "#919191",
                    text: "#FFFFFF"
                },
                hover: {
                    fill: "#555555",
                    border: "#919191",
                    text: "#FFFFFF"
                },
                focus: {
                    outline: "#7D510F"
                }
            },
            verifyButton: {
                main: {
                    fill: "#9b0101",
                    border: "#9b0101",
                    text: "#FFFFFF"
                },
                hover: {
                    fill: "#d62a0f",
                    border: "#d62a0f",
                    text: "#FFFFFF"
                },
                focus: {
                    outline: "#7D510F"
                }
            },
            slider: {
                main: {
                    bar: "#C4C4C4",
                    handle: "#0F8390"
                },
                focus: {
                    handle: "#0F8390"
                }
            },
            textarea: {
                main: {
                    fill: "#F4E4BC",
                    border: "#7D510F"
                },
                focus: {
                    fill: "#F4E4BC",
                    outline: "#0074BF"
                },
                disabled: {
                    fill: "#919191"
                }
            }
        }
    }
},
$(function() {
    var e = $("body").data("bot-protect");
    e && BotProtect.show(e)
});

;var DailyBonus;
DailyBonus = {
    SCREEN_LOCATION_LOGIN: "login",
    SCREEN_LOCATION_PROFILE: "profile",
    screen_location: "profile",
    cycle: null,
    chest_unlocker: null,
    day_today: -1,
    last_day: -1,
    showDialog: function() {
        this.screen_location = DailyBonus.SCREEN_LOCATION_LOGIN;
        Dialog.fetch("daily_bonus", "daily_bonus", {
            ajax: "widget"
        }, null, {}, function() {
            DailyBonus.reportClosed()
        })
    },
    init: function(e, t, i) {
        this.chest_unlocker = t,
        this.day_today = i,
        this.last_day = Math.max.apply(Math, Object.getOwnPropertyNames(e.chests)),
        Timing.tickHandlers.timers.initTimers("daily_bonus_reset_timer", function() {
            DailyBonus.screen_location == DailyBonus.SCREEN_LOCATION_LOGIN ? (Dialog.close(),
            setTimeout(function() {
                DailyBonus.showDialog()
            }, 200)) : partialReload()
        }),
        this.update(e),
        mobile && this.MobileView.init(),
        this.reportViewed()
    },
    update: function(e) {
        this.cycle = e,
        this.updateButtons(),
        this.updateChestGraphics(),
        this.updateRewardInfo(),
        UI.init()
    },
    updateButtons: function() {
        var a = $("#daily_bonus_content")
          , o = this.chest_unlocker.pp_unlock.costs[this.cycle.pp_count_unlocked] || -1
          , c = _("c1b724a1a661ac1204a050ebbe26c2a3") + "<br/><br/>" + _("55f5a6a54d53630b22197e1776182f54") + ' <span class="icon header premium"></span>' + o;
        $.each(this.cycle.chests, function(t, e) {
            var i, n = a.find(".day_" + t).find(".actions");
            n.html(""),
            DailyBonus.canOpenChest(t) ? ((i = $('<a href="#" class="btn btn-default">' + _("09f7c6efa8718ddc3a4864b388ca912e") + "</a>")).on("click", function(e) {
                e.preventDefault(),
                DailyBonus.openChest(t)
            }),
            n.append(i)) : DailyBonus.canBuyChest(t) && ((i = $('<a href="#" class="btn btn-default tooltip" title=" :: ' + escapeHtml(c, !0) + '">' + s(_("7a942e75c87e5ae7e67136a050d63cf7"), '<span class="icon header premium"></span>' + o) + "</a>")).on("click", function(e) {
                e.preventDefault(),
                Premium.check(DailyBonus.chest_unlocker.pp_unlock.feature, o, function() {
                    DailyBonus.openLockedChest(t)
                })
            }),
            n.append(i))
        })
    },
    updateChestGraphics: function() {
        $.each(this.cycle.chests, function(e, t) {
            var i = $("#daily_bonus_content").find(".day_" + e)
              , i = (i.find(".chest_container").addClass("skin-" + t.reward.skin),
            i.find(".db-chest"));
            t.is_collected ? i.addClass("opened") : DailyBonus.canOpenChest(e) && i.addClass("unlocked")
        })
    },
    updateRewardInfo: function() {
        $.each(this.cycle.chests, function(e, t) {
            var i = "";
            t.reward.label && (i += '<div class="daily-bonus-reward-label">' + t.reward.label + "</div>"),
            i += ItemUIFactory.createDetailHtml(t.reward.item),
            t.is_collected ? i += '<div class="center" style="font-weight:bold;">' + _("2a49135973b12ae164535b5342521ab8") + "</div>" : DailyBonus.willChestUnlockTomorrow(e) && (i += '<div class="center" style="font-weight:bold;">' + _("b6190eb655911794a7ce832a8128e0be") + "</div>"),
            mobile ? $("#daily_bonus_content").find(".day_" + e).find(".reward_info").html(i) : ((t = $("#daily_bonus_content").find(".day_" + e).find(".db-chest")).addClass("tooltip"),
            t.prop("title", " :: " + i))
        })
    },
    canOpenChest: function(e) {
        return !this.cycle.chests[e].is_locked && !this.cycle.chests[e].is_collected
    },
    canBuyChest: function(e) {
        return this.chest_unlocker.pp_unlock.enabled && this.day_today == this.last_day && 1 <= e && e <= this.last_day && this.cycle.chests[e].is_locked && !this.cycle.chests[e - 1].is_locked
    },
    willChestUnlockTomorrow: function(e) {
        return this.day_today !== this.last_day && e == this.cycle.reward_count_unlocked + 1
    },
    areAllUnlockedChestsOpen: function() {
        var i = !1;
        return $.each(this.cycle.chests, function(e, t) {
            t.is_locked || t.is_collected || (i = !0)
        }),
        !i
    },
    handleChestOpened: function(e, t) {
        DailyBonus.update(e),
        UI.SuccessMessage(_("38f70a61b9446cecf25cfcf2b81ce984"));
        e = this.day_today === this.last_day;
        mobile && this.canBuyChest(this.cycle.reward_count_unlocked + 1) && this.MobileView.switchToDay(this.cycle.reward_count_unlocked + 1),
        this.screen_location !== this.SCREEN_LOCATION_LOGIN || !this.areAllUnlockedChestsOpen() || e && this.cycle.reward_count_unlocked !== this.last_day || Dialog.close()
    },
    openChest: function(t) {
        TribalWars.post("daily_bonus", {
            ajaxaction: "open"
        }, {
            day: t,
            from_screen: this.screen_location
        }, function(e) {
            DailyBonus.handleChestOpened(e.cycle, t)
        })
    },
    openLockedChest: function(t) {
        TribalWars.post("daily_bonus", {
            ajaxaction: "unlock"
        }, {
            day: t,
            from_screen: this.screen_location
        }, function(e) {
            DailyBonus.handleChestOpened(e.cycle, t)
        })
    },
    reportViewed: function() {
        TribalWars.post("daily_bonus", {
            ajax: "viewed"
        }, {
            from_screen: this.screen_location
        }, null, null, !0)
    },
    reportClosed: function() {
        this.areAllUnlockedChestsOpen() || TribalWars.post("daily_bonus", {
            ajax: "canceled"
        }, {
            from_screen: this.screen_location
        }, null, null, !0)
    },
    MobileView: {
        SWIPE_THRESHOLD_PX: 50,
        pane_width: 280,
        displayed_day: 1,
        $content: null,
        $rewards_pane: null,
        $left_arrow: null,
        $right_arrow: null,
        init: function() {
            this.$content = $("#daily_bonus_content"),
            this.$rewards_pane = this.$content.find(".rewards_pane"),
            this.$left_arrow = this.$content.find(".arrow.left"),
            this.$right_arrow = this.$content.find(".arrow.right"),
            this.resize(),
            UI.onResizeEnd(window, function() {
                DailyBonus.MobileView.resize()
            }),
            this.$content.find(".arrow.left").on("click", function() {
                DailyBonus.MobileView.switchPrevDay()
            }),
            this.$content.find(".arrow.right").on("click", function() {
                DailyBonus.MobileView.switchNextDay()
            }),
            this.switchToDay(DailyBonus.cycle.reward_count_unlocked, !1),
            this.initSwiping()
        },
        resize: function() {
            this.pane_width = this.$content.width(),
            this.$rewards_pane.css({
                width: this.pane_width
            }),
            this.$content.find(".rewards_sheet").css({
                width: this.pane_width * DailyBonus.last_day
            }),
            this.$content.find(".reward").css({
                width: this.pane_width
            })
        },
        switchPrevDay: function() {
            this.switchToDay(this.displayed_day - 1, !0)
        },
        switchNextDay: function() {
            this.switchToDay(this.displayed_day + 1, !0)
        },
        switchToDay: function(e, t) {
            var i;
            e < 1 || e > DailyBonus.last_day || (i = (e - 1) * this.pane_width,
            t ? this.$rewards_pane.animate({
                scrollLeft: i
            }, 200) : this.$rewards_pane.scrollLeft(i),
            1 == (this.displayed_day = e) ? this.$left_arrow.hide() : this.$left_arrow.show(),
            e == DailyBonus.last_day ? this.$right_arrow.hide() : this.$right_arrow.show())
        },
        initSwiping: function() {
            function e(e) {
                var t;
                i && (t = a.pageX - n.pageX,
                Math.abs(t) >= DailyBonus.MobileView.SWIPE_THRESHOLD_PX && null !== a.pageX ? 0 < t ? DailyBonus.MobileView.switchPrevDay() : DailyBonus.MobileView.switchNextDay() : DailyBonus.MobileView.switchToDay(DailyBonus.MobileView.displayed_day, !0)),
                i = !1,
                a.pageX = {
                    pageX: null
                }
            }
            var i = !1
              , n = {
                pageX: null,
                scrollLeft: null
            }
              , a = {
                pageX: null
            }
              , s = this.$rewards_pane;
            this.$rewards_pane.on({
                touchstart: function(e) {
                    i = !0,
                    n = {
                        pageX: e.originalEvent.touches[0].pageX,
                        scrollLeft: s.scrollLeft()
                    }
                },
                touchmove: function(e) {
                    var t;
                    i && (a = e.originalEvent.touches[0],
                    e = a.pageX - n.pageX,
                    t = DailyBonus.MobileView.pane_width,
                    e = Math.max(Math.min(e, t), -t),
                    s.scrollLeft(n.scrollLeft - e))
                },
                touchend: e,
                touchcancel: e
            })
        }
    }
};

;var ItemUIFactory;
ItemUIFactory = {
    createDetailHtml: function(t) {
        return '<div class="item_details"><div class="identity"><img src="' + t.image + '"><div class="texts"><div class="name">' + t.name + '</div><div class="type">' + TribalWars.constants.item_types[t.type] + '</div><div class="category">' + TribalWars.constants.item_categories[t.category] + '</div></div></div><div class="descriptions">' + t.descriptions.map(function(t) {
            return ItemUIFactory.createDescriptionHtml(t)
        }).join("") + "</div></div>"
    },
    createDescriptionHtml: function(t) {
        var e = ""
          , i = (t.color && (e += "color: " + t.color + ";"),
        "");
        return t.image && (i = '<img src="' + t.image + '" style="vertical-align: -4px"/> '),
        t.text = t.text.replace("%player_name%", window.game_data.player.name),
        '<p style="' + e + '">' + i + t.text + "</p>"
    }
};

;var Visual;
Visual = function(i, n) {
    var e, a = $(".visual"), s = {
        style: "reverse",
        pause: .3
    }, r = {
        "anim-building-barracks-0": s,
        "anim-building-snob-0": s,
        "anim-building-stable-0": s,
        "anim-building-wall-0": s,
        "anim-building-smith-0": s,
        "anim-building-place-0": s,
        "anim-building-market-0": s,
        "anim-building-wood-0": s,
        "anim-building-stone-0": s,
        "anim-building-iron-0": s,
        "anim-building-church-0": s,
        "anim-building-garage-0": s,
        "anim-building-garage-prod": {
            style: "reverse",
            pause: .3
        },
        "anim-building-garage-prod2": {
            style: "reverse",
            pause: .3
        },
        "anim-building-main-1": {
            fps: 12
        },
        "anim-building-main-2": {
            fps: 12
        },
        "anim-building-main-3": {
            fps: 12
        },
        "anim-building-farm-2": {
            fps: 18
        },
        "anim-building-farm-3": {
            fps: 18
        },
        "anim-building-wood-prod": {
            style: "reverse",
            fps: 6,
            pause: 1
        },
        "anim-building-iron-prod": {
            style: "reverse",
            fps: 16,
            timing: {
                22: 2
            },
            pause: 2
        },
        "anim-building-stone-prod": {
            style: "reverse",
            pause: 1.5
        },
        "anim-building-farm-prod": {
            style: "reverse",
            pause: .3
        },
        "anim-building-main-prod": {
            style: "reverse",
            fps: 12
        },
        "anim-building-stable-prod": {
            style: "reverse",
            pause: .6,
            fps: 15
        },
        "anim-building-smith-prod": {
            style: "reverse",
            pause: .5
        },
        "anim-building-barracks-prod": {
            style: "reverse",
            pause: .5
        },
        "anim-joker": {
            fps: 20
        },
        "anim-guard": {
            fps: 20,
            style: "reverse",
            pause: 2
        },
        "anim-convo": {
            fps: 20
        }
    }, t = [], u = (new Date).getTime(), m = this;
    this.init = function() {
        $.each(i, function(i, n) {
            r.hasOwnProperty(n) && t.push(new VisualAnim(m,n,r[n]))
        }),
        this.tick()
    }
    ,
    this.getRoot = function() {
        return a
    }
    ,
    this.tick = function() {
        $.contains(document.documentElement, a.get(0)) && (e = ((new Date).getTime() - u) / 1e3,
        $.each(t, function(i, n) {
            n.update(e)
        }),
        window.requestAnimationFrame(m.tick))
    }
    ,
    this.getAssetFolder = function() {
        return "night" === n ? "visual_night" : "visual"
    }
    ,
    this.generateFrameTimingsFromTimings = function(i, n, e) {
        for (var a = [], s = 0, r = 0; r < n; r++) {
            var t = i.hasOwnProperty(r) ? i[r] : 1 / e;
            a.push(t),
            s += t
        }
        return {
            timing: a,
            total: s
        }
    }
    ,
    this.init()
}
;

;var VisualAnim;
VisualAnim = function(e, t, i) {
    var n, a, r = document.createElement("canvas"), s = (r.className = "visual-anim " + t,
    e.getRoot().append(r),
    0), h = 0, d = 0, o = 0, g = i.fps || 10, l = 0, m = 0, u = r.getContext("2d"), f = ((a = new Image).src = Format.image_src(e.getAssetFolder() + "/2016/" + t + ".png"),
    a), c = i.style || "default", w = i.pause || 0, v = !1, p = !1;
    return this.init = function() {
        var t;
        0 !== r.offsetWidth && (r.width = Math.round(parseFloat(window.getComputedStyle(r).width)),
        r.height = Math.round(parseFloat(window.getComputedStyle(r).height)),
        p = !0,
        o = f.naturalWidth / r.width,
        l = "reverse" === c ? 2 * o - 2 : o,
        i.timing ? (t = e.generateFrameTimingsFromTimings(i.timing, l, g),
        n = t.total,
        v = t.timing) : n = l / g,
        m = n + w)
    }
    ,
    this.update = function(t) {
        if (this.ready()) {
            var e = t % m
              , t = 0;
            if (n < e)
                d = h = t = 0;
            else {
                var i = 0;
                if (v) {
                    for (var a = d, i = h; i < l; i++)
                        if (e < (a += v[i])) {
                            d = a - v[i],
                            h = i;
                            break
                        }
                } else
                    i = Math.floor(e / n * l);
                t = i,
                "reverse" === c && (t = i < o ? t : l - i)
            }
            t !== s && (s = t,
            this.render(t))
        } else
            this.init()
    }
    ,
    this.render = function(t) {
        u.clearRect(0, 0, r.width, r.height),
        u.drawImage(f, r.width * t, 0, r.width, r.height, 0, 0, r.width, r.height)
    }
    ,
    this.ready = function() {
        return p
    }
    ,
    f.addEventListener("load", this.init),
    this
}
;

;var CashshopBrowser;
CashshopBrowser = {
    tab_btns: [],
    tabs: [],
    init: function(t) {
        this.tab_btns = document.querySelectorAll(".cs-tab"),
        this.tabs = document.querySelectorAll(".cs-tab-content"),
        CashshopBrowser.registerEvents(),
        this.setActiveTab(t),
        UI.ToolTip($(".tooltip"), {
            extraClass: "cs-tooltip"
        })
    },
    registerEvents: function() {
        $(".cs-slot").on("click", function() {
            var t = $(this).data("slot")
              , e = $(this).data("type");
            CashshopBrowser.checkout(t, e)
        }),
        this.tab_btns.forEach(t => {
            t.addEventListener("click", () => CashshopBrowser.setActiveTab(t.dataset.tab))
        }
        ),
        $(".tooltip-borderless").on("click", function() {
            return CashshopBrowser.showTooltipDialog($(this).attr("title")),
            !1
        })
    },
    checkout: function(t, e="premium") {
        TribalWars.post("cashshop", {
            ajaxaction: "get_checkout"
        }, {
            slot_id: t,
            type: e
        }, function(t) {
            t = t.checkout,
            t = Premium.getBuyDialogHTML(t);
            $("body").append(t),
            document.getElementById("payment_fader").addEventListener("click", Premium.closeBuy),
            $(window).off("message", Premium.handleMessage).on("message", Premium.handleMessage)
        })
    },
    setActiveTab: function(o) {
        if (null == o && (o = window.localStorage.getItem("cashshop_active_tab")),
        Array.from(this.tab_btns).some(t => t.dataset.tab === o)) {
            let e = o;
            this.tab_btns.forEach(t => {
                t.dataset.tab === e ? (t.classList.add("active"),
                document.querySelector(`.cs-tab-content[data-tab="${t.dataset.tab}"]`).classList.add("active"),
                window.localStorage.setItem("cashshop_active_tab", e)) : (t.classList.remove("active"),
                document.querySelector(`.cs-tab-content[data-tab="${t.dataset.tab}"]`).classList.remove("active"))
            }
            )
        }
    },
    reload: function() {
        let e;
        (e = mobile ? document.querySelector(".cs-container") : document.getElementById("popup_box_cash_shop")) && TribalWars.get("api", {
            ajax: "get_cashshop"
        }, function(t) {
            mobile ? e.outerHTML = t.dialog : e.querySelector(".popup_box_content").innerHTML = t.dialog,
            CashshopBrowser.init(window.localStorage.getItem("cashshop_active_tab"))
        })
    },
    showTooltipDialog: function(t) {
        var e = document.createElement("div")
          , o = (e.id = "tooltip_fader",
        e.className = "fader",
        e.onclick = function() {
            document.getElementById("tooltip_fader").remove(),
            document.getElementById("tooltip_container").remove()
        }
        ,
        document.createElement("div"));
        o.id = "tooltip_container",
        o.className = "tooltip_container",
        o.innerHTML = t,
        document.body.appendChild(e),
        document.body.appendChild(o)
    }
};

;define("Ig/TribalWars/Modules/TimedCommandQueue", function() {
    function n() {
        this.command_queue = [],
        this.lock_expiry = 0
    }
    return n.prototype = {
        isBusy: function() {
            return this.lock_expiry >= Date.now()
        },
        pushCommand: function(n, t) {
            this.command_queue.push({
                run: n,
                duration: t
            }),
            this.isBusy() || this.runNextCommand()
        },
        runNextCommand: function() {
            var n, t, u = this;
            0 !== this.command_queue.length && (t = Date.now(),
            n = this.command_queue.shift(),
            this.lock_expiry = t + n.duration,
            n.run(),
            t = Math.max(0, this.lock_expiry - Date.now()),
            setTimeout(function() {
                u.runNextCommand()
            }, t))
        }
    },
    n
});

;var CasualTransferForm;
CasualTransferForm = {
    $el: null,
    $button: null,
    $hint_missing_choices: null,
    required_choices: ["premium", "items"],
    init: function(i) {
        this.$el = i,
        this.$button = i.find(".btn"),
        this.$button_container = i.find(".button-container"),
        this.$hint_missing_choices = i.find(".hint-missing-choices"),
        this.initButtonClickHandler(),
        this.presentSubmissionDisabledUntilRequiredChoicesMade(),
        this.preventButtonFromJumping()
    },
    initButtonClickHandler: function() {
        var n = this;
        this.$button.on("click", function(i) {
            i.preventDefault(),
            n.areAllRequiredChoicesMade() ? n.promptConfirmTransfer() : n.flashUnmadeChoices()
        })
    },
    presentSubmissionDisabledUntilRequiredChoicesMade: function() {
        var n = this;
        this.$button.addClass("btn-disabled"),
        this.$el.find("input[type=radio]").on("change", function() {
            var i = !n.areAllRequiredChoicesMade();
            n.$button.toggleClass("btn-disabled", i),
            n.$hint_missing_choices.toggle(i)
        })
    },
    areAllRequiredChoicesMade: function() {
        return 0 === this.findUnmadeChoices().length
    },
    findUnmadeChoices: function() {
        var n = this;
        return this.required_choices.filter(function(i) {
            return !n.isAnOptionSelected(i)
        })
    },
    isAnOptionSelected: function(i) {
        return void 0 !== this.$el.find("input[name=" + i + "]:checked").val()
    },
    preventButtonFromJumping: function() {
        this.$button_container.css({
            height: this.$button_container.height()
        })
    },
    flashUnmadeChoices: function() {
        var t = this.$el;
        this.findUnmadeChoices().forEach(function(i) {
            var n = t.find(".section-label-" + i).addClass("warn");
            setTimeout(function() {
                n.removeClass("warn")
            }, 500)
        })
    },
    promptConfirmTransfer: function() {
        var i = this.$el
          , n = _("79b6981051a085c10d6e2a5b8d315bbc")
          , t = [{
            text: _("70d9be9b139893aa6c69b5e77e614311"),
            callback: function() {
                i.submit()
            },
            confirm: !0
        }];
        UI.ConfirmationBox(n, t)
    }
};

;var Questlines;
Questlines = {
    opening_dialog: !1,
    showing_new_label: !1,
    data: [],
    goal_progress: {},
    selected_quest: {
        "main-tab": 0,
        "tribe-tab": 0,
        "event-tab": 0,
        "mentor-tab": 0
    },
    tab_loaded: {
        "main-tab": !1,
        "tribe-tab": !1,
        "event-tab": !1,
        "mentor-tab": !1
    },
    selected_tab: "main-tab",
    transparent_image: "/graphic/transparent.png",
    messages: {},
    init: function() {
        this.selected_quest = {
            "main-tab": 0,
            "tribe-tab": 0,
            "event-tab": 0,
            "mentor-tab": 0
        },
        Questlines.tab_loaded = {
            "main-tab": !1,
            "tribe-tab": !1,
            "event-tab": !1,
            "mentor-tab": !1
        },
        this.registerEvents()
    },
    getById: function(e) {
        if (null != e)
            for (var t = 0; t < this.data.length; t++)
                if (e === this.data[t].id)
                    return this.data[t];
        return {}
    },
    showDialog: function(t) {
        var s;
        Questlines.opening_dialog || (Questlines.opening_dialog = !0,
        s = Questlines._getTabIdByQuestId(t),
        Dialog.fetch("quest", "new_quests", {
            ajax: "quest_popup",
            tab: s,
            quest: t
        }, function(e) {
            Questlines.opening_dialog = !1,
            Questlines.init(),
            Questlines.selectTabById(s, t)
        }, {
            class_name: "slim",
            priority: -1
        }),
        QuestArrows.init())
    },
    registerEvents: function() {
        $(".questline-header").on("click", this.accordion),
        $(".questline-list").on("click", ".quest-link", this.selectQuest),
        $(".tab-link").on("click", this.tab),
        $(".complete-btn-container").on("click", ".quest-complete-btn", function() {
            Questlines.completeQuest(!1, null)
        }),
        $(".complete-btn-container").on("click", ".skip-btn", function() {
            Questlines.skipQuest(!1, null)
        })
    },
    setQuests: function(e, t) {
        Questlines.data = e,
        Questlines.goal_progress = t
    },
    accordion: function(e) {
        e.preventDefault();
        e = e.currentTarget;
        e.scrollIntoView(),
        $(e).next().toggleClass("opened"),
        $(e).toggleClass("header-opened"),
        QuestArrows.init()
    },
    tab: function(e) {
        e = $(e.currentTarget).data("tab");
        Questlines.selectTabById(e, 0)
    },
    selectQuest: function(e) {
        var t;
        $(this).hasClass("selected") || (t = $(this).data("quest-id"),
        Questlines.selectQuestById(t))
    },
    completeQuest: function(e, t) {
        e ? (Quests.getQuest(t).complete(!1, function(e) {
            Questlines._questlineComplete(t)
        }),
        $(".btn-confirm-yes").remove()) : (t = Questlines._getSelectedQuestId(),
        Quests.getQuest(t).complete(!1, function(e) {
            Questlines._questlineComplete(t)
        }),
        Dialog.close())
    },
    skipQuest: function(e, t) {
        e ? (Quests.getQuest(t).complete(!0, function(e) {
            Questlines._questlineComplete(t)
        }),
        $(".btn-skip-quest").remove()) : (t = Questlines._getSelectedQuestId(),
        Quests.getQuest(t).complete(!0, function(e) {
            Questlines._questlineComplete(t)
        }),
        Dialog.close())
    },
    selectTabById: function(e, t) {
        var s = [];
        $(".tab-link").each(function() {
            s.push($(this).data("tab"))
        }),
        (e = s.includes(e) ? e : s[0]) == Questlines.selected_tab && Questlines.tab_loaded[e] || (null == e && (e = Questlines.selected_tab),
        $(".tab.active-tab").removeClass("active-tab"),
        $("li.selected-tab").removeClass("selected-tab"),
        $('.tab-link[data-tab="' + e + '"]').parent().addClass("selected-tab"),
        $("#" + e).addClass("active-tab"),
        Questlines.selected_tab = e,
        Questlines.tab_loaded[e] || ("reward-tab" != e && (t <= 0 && (t = $(".active-tab .quest-link:first-child").data("quest-id")),
        this.selectQuestById(t)),
        Questlines.tab_loaded[e] = !0),
        QuestArrows.init())
    },
    selectQuestById: function(e) {
        for (var t = Quests.getQuest(e).getData(), s = 0; s < t.goals_html.length; s++)
            null != Questlines.goal_progress[e][s] && (t.goals_html[s].progress = Questlines.goal_progress[e][s].progress,
            t.goals_html[s].completed = Questlines.goal_progress[e][s].completed);
        t.opened || Questlines.markOpened(e),
        $(".active-tab a.quest-link.selected").removeClass("selected");
        var a = $('.active-tab a.quest-link[data-quest-id="' + e + '"]');
        a.addClass("selected"),
        a.parent().parent().addClass("opened"),
        a.parent().parent().prev().addClass("header-opened"),
        Questlines.selected_quest[Questlines.selected_tab] = e,
        Questlines._updateQuestUI(t)
    },
    setNewLabel: function(e) {
        e ? ($("#new_quest").html('<div class="quest_new ' + game_data.market + '">' + _("d6d01ab10ebf52d8f696db8a2f3097c3") + "</div>"),
        this.showing_new_label = !0) : ($("#new_quest").html(""),
        this.showing_new_label = !1,
        RewardSystem.setStorageLabel())
    },
    setStorageLabel: function(e) {
        this.showing_new_label || (0 < e ? $("#new_quest").html('<div class="icon header resources quest-storage-label"></div>') : $("#new_quest").html(""))
    },
    markOpened: function(e) {
        TribalWars.post("new_quests", {
            ajax: "mark_opened"
        }, {
            quest_id: e
        }, null, null, !0)
    },
    _updateQuestUI: function(t) {
        var e = Questlines.data.find(function(e) {
            return e.id == t.questline
        })
          , s = $(".active-tab > .quest-popup-content");
        void 0 !== e && (s.find("header.quest-title > h1").text(e.name),
        e = e.reward,
        s.find("header.quest-title > .reward").html(e.image),
        e = ItemUIFactory.createDetailHtml(e.item),
        e += "<strong>" + _("410ecc82af07c0bf5dfd3594b3b4215c") + "</strong>",
        s.find("header.quest-title > .reward > img").prop("title", " :: " + e),
        UI.ToolTip(s.find("header.quest-title > .reward > img"))),
        s.find("header.quest-title > p").text(t.title),
        s.find(".quest-description").html(t.objective.replace(/\n/g, "</p><p>")),
        s.find(".skip-btn, .skip-help").toggleClass("hidden", !t.can_be_skipped && "completed" != t.state || t.finished),
        s.find(".quest-body > .quest-goals-container > .complete-btn-container > div.status-btn").toggleClass("quest-complete-btn", t.finished).toggleClass("hidden", "completed" == t.state || !t.finished),
        this._updateRewardsHtml(t.rewards_html),
        this._updateGoalsHtml(t.goals_html),
        this._contentToggle(!0)
    },
    _updateGoalsHtml: function(e) {
        var t = $(".active-tab > .quest-popup-content");
        t.find(".quest-goals").html(""),
        e.forEach(function(e) {
            t.find(".quest-goals").append(Questlines._getGoalHtml(e))
        }),
        UI.InitProgressBars()
    },
    _updateRewardsHtml: function(e) {
        var t = $(".active-tab > .quest-popup-content > .quest-body > .quest-goals-container > .quest-reward-summary")
          , s = t.find(".quest-reward-image")
          , a = t.find(".quest-reward-text > .quest-reward-description");
        if (0 < e.length) {
            this._rewardHasNoImage(e[0]) ? s.addClass("hidden") : (n = $('<img src="' + e[0].image + '">'),
            e[0].small_image && s.addClass("hidden"),
            s.html(""),
            s.append($(n)));
            for (var n, i = [], l = 0; l < e.length; l++)
                i.push(e[l].text);
            a.html(i.join("<br>"))
        }
        t.toggleClass("hidden", 0 == e.length)
    },
    _getGoalHtml: function(e) {
        var t, s = e.completed ? '<img class="quest-goal-completed" src="' + Format.image_src("quests/completed.png") + '">' : "", a = $('<div class="goal">    <div class="goal-left" style="position:relative;">        <h5>' + e.summary + "</h5>        <p>" + e.description + '</p>    </div>    <div class="goal-image" style="background-image: url(' + e.image + ')"></div></div>');
        return null != e.progress && (t = e.progress.current / e.progress.target * 100,
        e = '<div class="progress-bar">  <span class="label">' + e.progress.current + "/" + e.progress.target + '</span>  <div style="width: ' + t + '%;"></div> </div>',
        a.find(".goal-left").append(e)),
        a.find(".goal-left").append(s),
        a[0].outerHTML
    },
    _getSelectedQuestId: function() {
        return Questlines.selected_quest[Questlines.selected_tab]
    },
    _contentToggle: function(e) {
        $(".active-tab > .quest-popup-content").toggleClass("invisible", !e)
    },
    _getTabIdByQuestId: function(e) {
        return 9999 < e ? "event-tab" : 100 == e ? "mentor-tab" : 101 == e ? "tribe-tab" : "main-tab"
    },
    _questlineComplete: function(e) {
        for (var t = Questlines.data, s = 0; s < t.length; s++)
            for (var a, n = 0; n < t[s].quests.length; n++)
                t[s].quests[n].id == e && (a = t[s].id,
                TribalWars.post("new_quests", {
                    ajax: "questline_complete",
                    id: a
                }, null, function(e) {
                    e.status ? e.reward ? UI.SuccessMessage(_("27c9bfd8edc82b7189b0e342b8e8edf2") + "<br /><br />" + e.reward.image, 3e3) : UI.SuccessMessage(_("14c1518ea41748d3680f91304dfb2766"), 3e3) : UI.ErrorMessage(e.message, 3e3)
                }))
    },
    _rewardHasNoImage: function(e) {
        return "" == e.image || e.image == this.transparent_image
    }
};

;var RewardSystem;
( () => {
    function n() {
        var t, d = $("#reward-system-rewards"), a = $("#action-column");
        d.html(""),
        0 < i.length ? (a.removeClass("hidden"),
        t = {
            wood: 0,
            stone: 0,
            iron: 0
        },
        i.forEach(function(a) {
            var e = '<tr><td class="building-info" title="' + o[a.id].name + '"><a href="' + o[a.id].game_link + '">' + o[a.id].image + '</a><a class="building-name" href="' + o[a.id].game_link + '">' + o[a.id].name + "</a></td><td><strong>" + a.building_level + '</strong></td><td><span class="icon header wood"></span>' + a.reward.wood + '</td><td><span class="icon header stone"></span>' + a.reward.stone + '</td><td><span class="icon header iron"></span>' + a.reward.iron + "</td>"
              , n = a.reward;
            e += '<td><a href="#" class="btn btn-confirm-yes reward-system-claim-button" data-reward-id="' + a.id + '">' + _("15b77ddab59789684f3da336d5373aae") + "</a>",
            (game_data.village.wood + a.reward.wood > game_data.village.storage_max || game_data.village.stone + a.reward.stone > game_data.village.storage_max || game_data.village.iron + a.reward.iron > game_data.village.storage_max) && (e += '<br /><span class="small warn">' + _("1cc53eb25a72241343a31a244a75b756") + "</span>"),
            1 < l[a.building].count ? (e += '<td><a href="#" class="btn btn-confirm-yes reward-system-claim-all-button" data-reward-building="' + a.building + '">' + _("8a34ecf1be7cd8ebe77782eadfe3580f") + "</a>",
            (game_data.village.wood + l[a.building].wood > game_data.village.storage_max || game_data.village.stone + l[a.building].stone > game_data.village.storage_max || game_data.village.iron + l[a.building].iron > game_data.village.storage_max) && (e += '<br /><span class="small warn">' + _("1cc53eb25a72241343a31a244a75b756") + "</span>"),
            n = l[a.building]) : e += '<td><a href="#" class="btn btn-confirm-yes" disabled>' + _("8a34ecf1be7cd8ebe77782eadfe3580f") + "</a>",
            d.append(e += "</td></tr>"),
            g.forEach(function(a) {
                t[a] += n[a]
            })
        }),
        s(t)) : (s({
            wood: 0,
            stone: 0,
            iron: 0
        }),
        a.addClass("hidden"),
        $(".btn-col").remove(),
        d.append('<tr><td colspan="7" class="inactive">' + _("86600c524788efeb00d09c9f29210224") + "</td></tr>"));
        var e, n, a = $("#reward-system-unlockable-rewards"), a = (a.html(""),
        0 < c.length ? (e = 0,
        n = "",
        c.forEach(function(a) {
            e % 2 == 0 && (n += "<tr>"),
            n += '<td class="building-info" title="' + a.name + '"><a href="' + a.game_link + '">' + a.image + '</a><a class="building-name" href="' + a.game_link + '">' + a.name + "</a></td><td><strong>" + a.building_level + "</strong></td>",
            e % 2 == 1 && (n += "</tr>"),
            e % 2 == 0 && e == c.length - 1 && (n += '<td colspan="2"></td></tr>'),
            e++
        }),
        a.html(n)) : a.html('<tr><td colspan="4" class="inactive">' + _("7e551969baf9049bfb64ddbcf60c3650") + "</td></tr>"),
        $("#reward-system-badge"));
        a.html(""),
        0 < m && a.html(" (" + m + ")"),
        Questlines.setStorageLabel(m),
        $(".reward-system-claim-button").click(function(a) {
            var e;
            e = $(this).data("reward-id"),
            TribalWars.post("new_quests", {
                ajax: "claim_reward"
            }, {
                reward_id: e
            }, function(a) {
                r(a)
            })
        }),
        $(".reward-system-claim-all-button").click(function(a) {
            var e;
            e = $(this).data("reward-building"),
            TribalWars.post("new_quests", {
                ajax: "claim_rewards_all"
            }, {
                building: e
            }, function(a) {
                r(a)
            })
        })
    }
    function r(a) {
        var e;
        a.claimed && (e = _("b725603eb1fd7186ef4f5756087dc3ee") + '<br /><br /><span class="icon header wood"></span>' + a.claimed.reward.wood + '&nbsp;<span class="icon header stone"></span>' + a.claimed.reward.stone + '&nbsp;<span class="icon header iron"></span>' + a.claimed.reward.iron,
        UI.SuccessMessage(e, 3e3)),
        t(a.rewards, a.rewards_all, a.rewards_html, a.unlocked_rewards_count),
        d(a.unlockable_rewards),
        n()
    }
    function t(a, e, n, t) {
        i = a,
        l = e,
        o = n,
        m = t
    }
    function d(a) {
        c = a,
        e()
    }
    function s(e) {
        g.forEach(function(a) {
            document.querySelector('span[data-resource-name="' + a + '"]').textContent = String(e[a])
        })
    }
    function e() {
        Questlines.setStorageLabel(m)
    }
    var i, l, o, c, m, g;
    i = [],
    l = [],
    o = [],
    c = [],
    m = 0,
    g = ["wood", "stone", "iron"],
    RewardSystem = {
        init: n,
        setRewards: t,
        setUnlockableRewards: d,
        setStorageLabel: e,
        setUnlockableRewardsCount: function(a) {
            m = a,
            e()
        }
    }
}
)();

;var GiftCalendar;
GiftCalendar = {
    door_animation: null,
    is_template: !0,
    native_app: !1,
    init: function() {
        UI.ToolTip(".field-closed"),
        GiftCalendar.registerEvents(),
        GiftCalendar.setupTimer(),
        GiftCalendar.is_template = !0
    },
    registerEvents: function() {
        $(".gift-calendar-field").off("click").on("click", this.openField),
        $("#sign_wallpaper_btn").off("click").on("click", this.previewWallpaper),
        $("#template_wallpaper_btn").off("click").on("click", this.downloadWallpaper)
    },
    showDialog: function() {
        Dialog.fetch("gift_calendar", "gift_calendar", {
            ajax: "calendar_popup"
        }, this.init, {
            auto_width: !0,
            class_name: "gift-calendar-popup"
        })
    },
    reloadDialog: function() {
        Dialog.close(),
        GiftCalendar.showDialog()
    },
    openField: function(e) {
        var d = $(this)
          , o = $('<div class="popup_box_container sub-dialog" id="reward-subdialog"></div>');
        d.hasClass("field-locked") || TribalWars.post("gift_calendar", {
            ajaxaction: "collect_reward"
        }, {
            field_id: d.data("id")
        }, function(e) {
            o = $('<div class="popup_box_container sub-dialog" id="reward-subdialog"></div>').css("z-index", 14002);
            var a, i = $('<div class="popup_box show"></div>').css("z-index", 14003).appendTo(o), t = $('<div class="fader"></div>').css("z-index", 14001).appendTo(o), n = ($('<div class="popup_box_content"></div>').css("max-width", 400).html(e.dialog).appendTo(i),
            !mobile && HotKeys.enabled ? " :: " + _("28926ff7e8e5f5e52b3e35f5cc7ad99b") + " <b>Esc</b>" : ""), l = mobile ? "" : "tooltip-delayed", l = $('<a class="popup_box_close ' + l + '" title="' + _("d3d2e617335f08df83599665eef8a418") + n + '" href="#">&nbsp;</a>').prependTo(i);
            UI.ToolTip(l, {
                delay: 400
            }),
            $(".gift-calendar-timer-container").html(e.timer_html),
            GiftCalendar.setupTimer(),
            t.on("click", function() {
                o.remove(),
                o = null,
                e.finished && ($("#calendar_field_container").toggleClass("gift-calendar-finished", !0),
                $(".gift-calendar-footer").toggleClass("gift-calendar-finished", !0))
            }),
            l.on("click", function() {
                o.remove(),
                o = null,
                e.finished && ($("#calendar_field_container").toggleClass("gift-calendar-finished", !0),
                $(".gift-calendar-footer").toggleClass("gift-calendar-finished", !0))
            }),
            e.opened ? $("body").append(o) : (d.find(".gift-calendar-position").remove(),
            d.append('<img class="gift-calendar-tile-img" src="' + e.img + '">'),
            (a = GiftCalendar.addDoorAnimation(d)).addEventListener("ended", e => {
                a.remove(),
                $("body").append(o),
                UI.SuccessMessage(_("e0df8f32de74984d15fb2313ba1c06dd")),
                d.addClass("field-opened").removeClass("field-closed"),
                mobile || d.removeTooltip()
            }
            )),
            GiftCalendar.setNewLabel(e.new_reward)
        })
    },
    setupTimer: function() {
        var e = $(".gift-calendar-timer")
          , a = e.data("timer");
        0 != a && void 0 !== a && Timing.tickHandlers.timers.initTimer(e, a, () => GiftCalendar.reloadDialog(), Math.round(Timing.getCurrentServerTime() / 1e3), !0)
    },
    addDoorAnimation: function(e) {
        var a = document.createElement("video")
          , i = (a.className = "gift-calendar-door-animation",
        a.controls = !1,
        a.autoplay = !0,
        a.playsInline = !0,
        document.createElement("source"))
          , t = document.createElement("source");
        return i.type = "video/webm",
        i.src = Format.image_src("gift_calendar/door_animation.webm"),
        t.type = "video/mp4",
        t.src = Format.image_src("gift_calendar/door_animation.mp4"),
        a.appendChild(i),
        a.appendChild(t),
        e.append(a),
        a
    },
    downloadWallpaper: function(e) {
        var n = this
          , l = (n.disabled = !0,
        document.createElement("a"))
          , d = (l.target = "_blank",
        l.download = window.game_data.player.name + "_tribalwars.jpg",
        new Image);
        d.crossOrigin = "*",
        d.addEventListener("load", function(e) {
            var a = document.createElement("canvas")
              , i = a.width = this.width
              , t = (a.height = this.height,
            a.getContext("2d"));
            t.drawImage(d, 0, 0),
            GiftCalendar.is_template || (t.font = "75px Vinque",
            t.textAlign = "center",
            t.shadowColor = "#000",
            t.shadowOffsetY = 3,
            t.shadowOffsetX = 3,
            t.fillStyle = "#c8a86a",
            t.fillText(window.game_data.player.name, i / 2, 1890, i),
            t.fillStyle = "#f4e4bc",
            t.fillText(_("7297f70a9dd8b5143c9f0dbf17a5ae2f"), i / 2, 1990, i)),
            a.toDataURL("image/jpeg", 80);
            l.href = a.toDataURL("image/jpeg", 80),
            l.click(),
            n.disabled = !1
        }),
        document.fonts.load("75px Vinque").then(function() {
            d.src = Format.image_src("gift_calendar/wallpaper.jpg")
        })
    },
    previewWallpaper: function(e) {
        GiftCalendar.is_template = !GiftCalendar.is_template;
        var a, l = this, d = (l.disabled = !0,
        GiftCalendar.is_template ? (a = GiftCalendar.native_app ? _("3cdf9983e7ef859257859fa66a83e65e") : _("a5b87d2c139c9db49b1bdb15a2ef1e09"),
        l.innerText = mobile ? a : _("9ded3764216f31c9547d599f0a3956c1")) : l.innerText = mobile ? _("43feb5de98ca34582f586c614c7d37f2") : _("0aa60493eacb9a5ea749476ff1abf634"),
        new Image);
        d.crossOrigin = "*",
        d.addEventListener("load", function(e) {
            var a = document.createElement("canvas")
              , i = a.width = this.width
              , t = a.height = this.height
              , n = a.getContext("2d")
              , n = (n.drawImage(d, 0, 0),
            GiftCalendar.is_template || (n.font = "20px Vinque",
            n.textAlign = "center",
            n.shadowColor = "#000",
            n.shadowOffsetY = 1,
            n.shadowOffsetX = 1,
            n.fillStyle = "#c8a86a",
            n.fillText(window.game_data.player.name, i / 2, t - 60, i),
            n.fillStyle = "#f4e4bc",
            n.fillText(_("7297f70a9dd8b5143c9f0dbf17a5ae2f"), i / 2, t - 30, i)),
            a.toDataURL("image/jpeg", 100))
              , t = GiftCalendar.is_template ? "calendar-preview-template" : "calendar-preview-personal";
            $("#calendar_field_container").toggleClass("show-finished-image", !0),
            0 == $("#calendar_field_container > ." + t).length && $("#calendar_field_container").prepend('<img class="calendar-preview ' + t + '" src="' + n + '"/>'),
            $("#calendar_field_container").toggleClass("show-template", GiftCalendar.is_template),
            $("#calendar_field_container").toggleClass("show-personal", !GiftCalendar.is_template),
            l.disabled = !1
        }),
        document.fonts.load("20px Vinque").then(function() {
            d.src = Format.image_src("gift_calendar/tavern.jpg")
        })
    },
    setNewLabel: function(e) {
        var a = "";
        e && (a = '<div class="quest_new ' + game_data.market + '">' + _("d6d01ab10ebf52d8f696db8a2f3097c3") + "</div>"),
        $("#gift-calendar-dialog-icon").html(a)
    }
};

;var ImageBasedAnimation;
ImageBasedAnimation = function(t, e) {
    if (!e.frame_count && !e.frame_width)
        throw new Error("One of the options frame_count or frame_width must be specified and none-zero");
    var n, i = e.loop, a = document.createElement("canvas"), o = a.getContext("2d"), r = new Image, s = (r.src = Format.image_src(t),
    {}), h = function(n) {
        var t = !1
          , i = this;
        this.isPropagationStopped = function() {
            return t
        }
        ,
        this.stopPropagation = function() {
            n.stopPropagation(),
            t = !0
        }
        ,
        this.preventDefault = function() {
            n.preventDefault()
        }
        ,
        ["bubbles", "cancelBubble", "cancelable", "composed", "currentTarget", "deepPath", "defaultPrevented", "eventPhase", "returnValue", "target", "timeStamp", "type", "isTrusted"].forEach(function(e) {
            Object.defineProperty(i, e, {
                get: function() {
                    return n[e]
                },
                set: function(t) {
                    n[e] = t
                }
            }),
            i[e] = n[e]
        })
    }, c = (this.addEventListener = function(t, e) {
        s.hasOwnProperty(t) ? s[t] = s[t].append(e) : s[t] = [e]
    }
    ,
    this.removeEventListener = function(t, e) {
        s.hasOwnProperty(t) && -1 < s[t].indexOf(e) && (e = s[t].indexOf(e),
        s[t].splice(e, 1))
    }
    ,
    function(t) {
        var e = new h(t);
        if (s.hasOwnProperty(e.type))
            for (var n = s[e.type], i = 0; i < n.length && !e.isPropagationStopped(); i++)
                n[i](e)
    }
    ), d = (this.dispatchEvent = c,
    e.frame_count || 0), u = e.frame_width || 0, f = e.frame_rate || 30, p = 0, m = function(t) {
        o.clearRect(0, 0, a.width, a.height),
        o.drawImage(r, u * t, 0, u, r.height, 0, 0, a.width, a.height),
        p = t
    }, w = (r.addEventListener("load", function(t) {
        u = u || r.width / d,
        d = d || Math.min(r.width / u),
        c(t),
        a.height = r.height,
        a.width = u,
        m(0)
    }),
    1e3 / f), g = 0, l = function(t) {
        d - 1 <= p ? !0 === i ? (m(0),
        n = window.requestAnimationFrame(l.bind(this))) : (c(new Event("play_ended")),
        this.stop()) : (w < t - g && (m(p + 1),
        g = t),
        n = window.requestAnimationFrame(l.bind(this)))
    };
    this.play = function() {
        n = window.requestAnimationFrame(l.bind(this))
    }
    ,
    this.pause = function() {
        window.cancelAnimationFrame(n)
    }
    ,
    this.stop = function() {
        this.pause(),
        m(d - 1)
    }
    ,
    this.seekToTime = function(t) {
        m(Math.floor(t / f))
    }
    ,
    this.getCanvas = function() {
        return a
    }
}
;

;define("Ig/TribalWars/Modules/TwoFactor", function() {
    function o() {
        this.show()
    }
    return o.prototype = {
        show: function() {
            var t = this;
            Dialog.fetch("two_factor", "api", {
                ajax: "two_factor"
            }, function() {
                $("#two_factor_form").on("submit", function() {
                    var o = $("#two_factor_form input[name=code]").val();
                    return t.confirm(o),
                    !1
                })
            }, {}, function() {
                t.completed || TribalWars.redirect("overview")
            })
        },
        confirm: function(o) {
            $("#two_factor_form input[type=submit]").prop("disabled", !0);
            var t = this;
            TribalWars.post("api", {
                ajaxaction: "two_factor"
            }, {
                code: o
            }, function() {
                $("#two_factor_form input[type=submit]").prop("disabled", !1),
                t.completed = !0,
                Dialog.close(),
                UI.SuccessMessage(_("9154e256b98593684452602f9c5e0652"))
            }, function() {
                $("#two_factor_form input[type=submit]").prop("disabled", !1)
            })
        }
    },
    o
});

;class UnitsTable {
    activeUnits = [];
    activeVillages = [];
    init() {
        $("#units_select_all").off().on("click", e => {
            e.target.checked ? this.markAllCheckboxes() : this.unmarkAllCheckboxes(),
            this.updateTable()
        }
        );
        var e = $(".unit-selection")
          , t = (e.off().on("click", e => {
            e = $(e.currentTarget).attr("name").replace("checkbox_", "");
            this.toggleUnitActive(e)
        }
        ),
        $(".troop-request-selector"));
        t.off("click").on("click", e => {
            e = $(e.currentTarget);
            this.saveCheckboxTarget(e),
            this.updateTable(e.data("village-id"))
        }
        ),
        t.off("all_changed").on("all_changed", e => {
            this.saveCheckboxTarget($(e.currentTarget))
        }
        ),
        e.each( (e, t) => {
            var a = $(t).attr("name").replace("checkbox_", "");
            t.checked && this.activeUnits.push(a)
        }
        )
    }
    saveCheckboxTarget(e) {
        var t, e = e.data("village-id");
        e && (-1 < (t = this.activeVillages.indexOf(e)) ? this.activeVillages.splice(t, 1) : this.activeVillages.push(e))
    }
    markAllCheckboxes() {
        var e = $(".troop-request-selector");
        e.prop("checked", !0),
        e.trigger("all_changed")
    }
    unmarkAllCheckboxes() {
        var e = $(".troop-request-selector");
        e.prop("checked", !1),
        e.trigger("all_changed")
    }
    updateTable(e=null) {
        null !== e ? $(`.village_row_${e} .unit-item`).each( (e, t) => {
            t = $(t);
            this.updateElement(t)
        }
        ) : $(".unit-item").each( (e, t) => {
            t = $(t);
            this.updateElement(t)
        }
        )
    }
    updateElement(t) {
        var a = parseInt(t.data("unit-count"))
          , i = parseInt(t.data("away-id"))
          , e = t.data("village-id")
          , s = t.attr("id");
        let l = "";
        if (this.activeVillages.includes(e)) {
            if (0 === a)
                t.removeClass("has-input"),
                l = '<input type="number" data-initial-value="0" class="call-unit-box" max="' + a + '" disabled />';
            else if (this.activeUnits.includes(s)) {
                let e = a;
                t.hasClass("has-input") && (e = $(`#${i}_` + s).val()),
                l = `<input type="number" id="${i + "_" + s}" data-initial-value="${a}" 
                            name="withdraw_unit[${i}][units][${s}]" value="${e}" min="0" max="${a}" class="call-unit-box" />`,
                t.addClass("has-input")
            } else
                t.removeClass("has-input"),
                l = a;
            $(t).html(l)
        } else
            t.removeClass("has-input"),
            t.html(a)
    }
    toggleUnitActive(e) {
        var t = this.activeUnits.indexOf(e);
        -1 < t ? this.activeUnits.splice(t, 1) : this.activeUnits.push(e),
        this.updateTable(),
        this.saveUsedUnitsHeaders()
    }
    saveUsedUnitsHeaders() {
        TribalWars.post("settings", {
            ajaxaction: "set_village_info_checkboxes"
        }, {
            info_village_checkboxes: JSON.stringify(this.activeUnits)
        })
    }
}

;var PostReaction;
PostReaction = {
    reactions: {},
    is_group: !1,
    _picker_html: null,
    _registry: null,
    _trigger_a: null,
    _screen: "mail",
    _screen_params: {},
    _initialized: !1,
    _registry_loading: !1,
    _cache_key: "reaction_registry",
    _cache_ttl: 36e5,
    _registry_callbacks: [],
    init: function(t, e, o, i) {
        PostReaction.reactions = t || {},
        PostReaction.is_group = e,
        PostReaction._screen = o || "mail",
        PostReaction._screen_params = i || {},
        PostReaction._ensureListenerRegistered(),
        PostReaction._ensureRegistryLoaded()
    },
    _ensureRegistryLoaded: function(t) {
        PostReaction._registry ? t && t() : (t && PostReaction._registry_callbacks.push(t),
        PostReaction._registry_loading || ((t = PostReaction._loadFromCache()) ? (PostReaction._registry = t,
        PostReaction._flushCallbacks()) : (PostReaction._registry_loading = !0,
        TribalWars.get("api", {
            ajax: "reaction_registry"
        }, function(t) {
            PostReaction._registry = t,
            PostReaction._registry_loading = !1,
            PostReaction._saveToCache(t),
            PostReaction._flushCallbacks()
        }))))
    },
    _flushCallbacks: function() {
        var t = PostReaction._registry_callbacks;
        PostReaction._registry_callbacks = [];
        for (var e = 0; e < t.length; e++)
            t[e]()
    },
    _loadFromCache: function() {
        try {
            var t, e = localStorage.getItem(PostReaction._cache_key);
            return e ? (t = JSON.parse(e),
            Date.now() - t.timestamp > PostReaction._cache_ttl ? (localStorage.removeItem(PostReaction._cache_key),
            null) : t.data) : null
        } catch (t) {
            return null
        }
    },
    _saveToCache: function(t) {
        try {
            localStorage.setItem(PostReaction._cache_key, JSON.stringify({
                timestamp: Date.now(),
                data: t
            }))
        } catch (t) {}
    },
    _buildTooltip: function(t, e) {
        t = (t = t.replace(/^\[([^\]]+)\]/, "").replace(/\[\/[^\]]+\]$/, "")).replace(/^:|:$/g, "");
        return e && 0 !== e.length ? t.charAt(0).toUpperCase() + t.slice(1) + " :: " + e.join(", ") : t
    },
    _readDomCount: function(t) {
        return (t = t && t.querySelector(".reaction-count")) && parseInt(t.textContent, 10) || 0
    },
    _setTooltip: function(t, e) {
        void 0 !== t.tooltipText ? t.tooltipText = e : (t.setAttribute("title", e),
        UI.ToolTip(t))
    },
    _showMobileTooltip: function(t, e) {
        PostReaction._dismissMobileTooltip();
        var o = e.split(" :: ")
          , i = document.createElement("div")
          , o = (i.id = "reaction-mobile-tooltip",
        i.className = "tooltip-style",
        1 < o.length ? ((n = document.createElement("h3")).textContent = o[0],
        i.appendChild(n),
        (n = document.createElement("div")).className = "body",
        n.textContent = o[1],
        i.appendChild(n)) : i.textContent = e,
        document.body.appendChild(i),
        t.getBoundingClientRect())
          , n = i.offsetWidth
          , e = o.left + o.width / 2 - n / 2
          , e = Math.max(4, Math.min(e, window.innerWidth - n - 4))
          , t = o.top - i.offsetHeight - 6 + window.scrollY;
        t < window.scrollY && (t = o.bottom + 6 + window.scrollY),
        i.style.left = e + "px",
        i.style.top = t + "px",
        PostReaction._mobile_tooltip_timer = setTimeout(PostReaction._dismissMobileTooltip, 3e3),
        document.addEventListener("touchstart", PostReaction._dismissMobileTooltip, {
            once: !0
        })
    },
    _dismissMobileTooltip: function() {
        clearTimeout(PostReaction._mobile_tooltip_timer);
        var t = document.getElementById("reaction-mobile-tooltip");
        t && t.remove()
    },
    _mobile_tooltip_timer: null,
    _ensureListenerRegistered: function() {
        PostReaction._initialized || (PostReaction._initialized = !0,
        document.addEventListener("click", function(t) {
            var e, o, i, n = t.target.closest(".new-reaction a");
            n ? PostReaction.toggleReactionPicker(t, n) : (n = t.target.closest(".single-reaction")) ? (i = (e = n.closest(".post, .forum_post, .chat-row")).querySelector(".new-reaction a").getAttribute("data-post-id"),
            n = n.getAttribute("data-reaction"),
            o = e.querySelector(".reaction"),
            PostReaction.toggleReaction(i, n, o, e)) : (i = document.getElementById("post_react")) && "none" !== i.style.display && !t.target.closest("#post_react") && (i.style.display = "none")
        }),
        "undefined" != typeof mobile && mobile && PostReaction._initMobileTouchGestures())
    },
    _initMobileTouchGestures: function() {
        var c = null
          , o = null
          , r = 0
          , s = null
          , l = !1;
        document.addEventListener("touchstart", function(t) {
            var e = t.target.closest(".single-reaction");
            e && (l = !1,
            o = setTimeout(function() {
                var t;
                l || (t = e.getAttribute("title")) && PostReaction._showMobileTooltip(e, t)
            }, 500))
        }, {
            passive: !0
        }),
        document.addEventListener("touchstart", function(t) {
            var e, o, i, n, a = t.target.closest(".post, .forum_post");
            a && !t.target.closest("a, .single-reaction, .new-reaction") && (e = a.querySelector(".new-reaction a")) && (l = !1,
            o = Date.now(),
            s === a && o - r < 300 ? (t.preventDefault(),
            r = 0,
            s = null,
            clearTimeout(c),
            i = e.getAttribute("data-post-id"),
            n = a.querySelector(".reaction"),
            PostReaction.toggleReaction(i, ":heart:", n, a)) : (r = o,
            s = a,
            c = setTimeout(function() {
                l || (PostReaction._trigger_a = e,
                PostReaction.toggleReactionPicker(t, e))
            }, 500)))
        }, {
            passive: !1
        }),
        document.addEventListener("touchmove", function() {
            l = !0,
            clearTimeout(c),
            clearTimeout(o)
        }),
        document.addEventListener("touchend", function() {
            clearTimeout(c),
            clearTimeout(o)
        })
    },
    _getScreenForElement: function(t) {
        return t && t.closest(".chat-row") ? "chat" : PostReaction._screen
    },
    _getIsGroupForElement: function(t) {
        return t && t.closest(".chat-row") ? (t = t.querySelector(".chat-reaction")) && "1" === t.getAttribute("data-chat-group") : PostReaction.is_group
    },
    toggleReaction: function(t, e, o, i) {
        var n = PostReaction._getScreenForElement(i)
          , i = PostReaction._getIsGroupForElement(i)
          , a = window.game_data.player.name
          , c = (PostReaction.reactions[t] || (PostReaction.reactions[t] = {}),
        PostReaction.reactions[t][e])
          , r = !!c && c.reacted
          , s = o.querySelector('span[data-reaction="' + e + '"]');
        (r = !(!s || !s.classList.contains("reacted")) || r) ? (c || (c = {
            count: PostReaction._readDomCount(s) || 1,
            reacted: !0,
            players: [a]
        },
        PostReaction.reactions[t][e] = c),
        c.reacted = !1,
        c.count--,
        c.players && (c.players = c.players.filter(function(t) {
            return t !== a
        })),
        c.count <= 0 ? (delete PostReaction.reactions[t][e],
        s && s.remove()) : s && (s.classList.remove("reacted"),
        PostReaction._setTooltip(s, PostReaction._buildTooltip(e, c.players)),
        r = s.querySelector(".reaction-count")) && (r.textContent = c.count),
        TribalWars.post(n, Object.assign({
            ajax: "react",
            post_id: t
        }, PostReaction._screen_params), {
            reaction: e,
            state: 0
        }, function() {})) : (c ? (c.count++,
        c.reacted = !0,
        c.players || (c.players = []),
        c.players.push(a)) : (r = PostReaction._readDomCount(s),
        PostReaction.reactions[t][e] = {
            count: r + 1,
            reacted: !0,
            players: [a]
        }),
        c = PostReaction.reactions[t][e],
        r = PostReaction._buildTooltip(e, c.players),
        s ? (s.classList.add("reacted"),
        PostReaction._setTooltip(s, r),
        (s = s.querySelector(".reaction-count")) && (s.textContent = c.count)) : ((s = document.createElement("span")).className = "single-reaction reacted " + (i ? "single-reaction-group" : "single-reaction-single"),
        s.setAttribute("data-reaction", e),
        s.setAttribute("title", r),
        s.innerHTML = PostReaction._getEmojiHtml(e),
        i && ((r = document.createElement("span")).className = "reaction-count",
        r.textContent = c.count,
        s.appendChild(r)),
        (i = o.querySelector(".new-reaction")) ? o.insertBefore(s, i) : o.appendChild(s),
        UI.ToolTip(s)),
        TribalWars.post(n, Object.assign({
            ajax: "react",
            post_id: t
        }, PostReaction._screen_params), {
            reaction: e,
            state: 1
        }, function() {}))
    },
    _getEmojiHtml: function(t) {
        return PostReaction._registry && PostReaction._registry[t] ? '<img src="' + PostReaction._registry[t] + '" class="emoji">' : ""
    },
    selectReaction: function(t) {
        var e = PostReaction._trigger_a
          , o = e.getAttribute("data-post-id")
          , e = e.closest(".post, .forum_post, .chat-row")
          , i = e.querySelector(".reaction");
        document.getElementById("post_react").style.display = "none",
        PostReaction.toggleReaction(o, t, i, e)
    },
    toggleReactionPicker: function(t, e) {
        t.preventDefault();
        var o = document.getElementById("post_react");
        if (o && "none" !== o.style.display)
            return PostReaction._trigger_a === e ? void (o.style.display = "none") : void (PostReaction._trigger_a = e);
        PostReaction._trigger_a = e,
        PostReaction._picker_html ? UI.AjaxPopup(t, "post_react", PostReaction._picker_html, _("d475759df0f393f91d833d4228a96fa6"), function(t, e) {
            PostReaction._initPickerContent(e[0])
        }, {
            dataType: "prerendered"
        }) : UI.AjaxPopup(t, "post_react", TribalWars.buildURL("GET", "api", {
            ajax: "reaction_selector"
        }), _("d475759df0f393f91d833d4228a96fa6"), function(t, e) {
            PostReaction._picker_html = t,
            PostReaction._initPickerContent(e[0])
        })
    },
    _initPickerContent: function(t) {
        t.innerHTML = PostReaction._picker_html,
        $(t).find(".reactions").slimScroll({
            height: "400px"
        }),
        t.querySelectorAll(".emoji-selectable").forEach(function(t) {
            t.addEventListener("click", function() {
                PostReaction.selectReaction(t.getAttribute("data-name"))
            })
        })
    },
    initModRemoval: function() {
        var i = 0;
        document.addEventListener("click", function(t) {
            var e, o = t.target.closest(".mod-reaction-remove");
            o && (t.preventDefault(),
            o = (o = (t = o.closest(".mod-reaction-row")).closest(".post, .forum_post")) ? o.querySelector("form.confirm_abandonment") : null,
            t.style.display = "none",
            o) && ((e = document.createElement("input")).type = "hidden",
            e.name = "deleted_reactions[" + i + "]",
            e.value = JSON.stringify({
                post_id: t.getAttribute("data-post-id"),
                player_id: t.getAttribute("data-player-id"),
                reaction: t.getAttribute("data-reaction")
            }),
            o.appendChild(e),
            i++)
        })
    }
};

;var Chat;
Chat = function() {
    var o, n, a, i, s = this, r = {}, c = [], d = {}, h = {}, u = {}, l = {}, v = {}, g = {}, f = 0, w = !0;
    this.HISTORY_CACHE_TIME = 300,
    this.init = function() {
        var e;
        !this.isSupported() || 0 < window.game_data.player.sitter || (-1 !== window.location.href.indexOf("intro") && this.cleanCache(),
        this.storage = new ChatStorage,
        o = document.title,
        i = $("#chat-wrapper"),
        f = Math.floor($(document).width() / 245),
        !1 === s.storage.get("last_connection_state") && this.connectionUnavailable(!0),
        this.contacts = new ChatContacts(this),
        this.addWindow(this.contacts),
        this.initConversations(),
        this.initWindowState(),
        this.updateSoundStatus(),
        this.updateBlockedPlayers(),
        this.storage.addObserver("conversations", this.syncConversations),
        this.storage.addObserver("window_state", this.syncWindowState),
        Connection.registerHandler("chat/playername", this.receivedPlayerName),
        Connection.registerHandler("chat/messages", this.receivedChatMessages),
        Connection.registerHandler("chat/read", this.receivedChatRead),
        Connection.registerHandler("chat/typing", this.receivedTypingIndication),
        Connection.registerHandler("chat/conversation", this.receivedConversationData),
        Connection.registerHandler("chat/reaction", this.receivedChatReaction),
        $(Connection).on("disconnected", this.connectionUnavailable),
        $(Connection).on("connected", this.connectionAvailable),
        e = function() {
            s.connectionUnavailable(),
            $(Connection).off("connect_error", e)
        }
        ,
        $(Connection).on("connect_error", e),
        "undefined" != typeof PostReaction && PostReaction._ensureRegistryLoaded(function() {
            s.refreshAllReactionIcons()
        }),
        Math.random() < .01 && s.cleanCache())
    }
    ,
    this.isPlayerBlocked = function(e) {
        return -1 !== $.inArray(e, g)
    }
    ,
    this.updateBlockedPlayers = function() {
        var t = window.sessionStorage
          , n = "chat_blocked_players"
          , e = -1 !== window.location.href.indexOf("mode=block")
          , a = !1;
        t.hasOwnProperty(n) && (g = JSON.parse(t.getItem(n)),
        a = !0),
        a && !e || TribalWars.get("api", {
            ajax: "blocked_players"
        }, function(e) {
            g = e,
            t.setItem(n, JSON.stringify(g))
        })
    }
    ,
    this.cleanCache = function() {
        Object.keys(localStorage).forEach(function(e) {
            var t = e.match(/(\d+)_chat_/);
            t && (parseInt(t[1]) !== parseInt(window.game_data.player.id) && localStorage.removeItem(e),
            /history/.test(e)) && (t = JSON.parse(localStorage.getItem(e)),
            Timing.getCurrentServerTime() - t.timestamp > 1e3 * s.HISTORY_CACHE_TIME) && localStorage.removeItem(e)
        })
    }
    ,
    this.connectionAvailable = function() {
        i.removeClass("chat-disconnected"),
        w = !0,
        s.storage.set("last_connection_state", !0),
        $(".chat-header").off("click", s.showConnectionError),
        n && (clearTimeout(n),
        n = 0)
    }
    ,
    this.connectionUnavailable = function(e) {
        var t;
        n || (t = function() {
            i.addClass("chat-disconnected"),
            w = !1,
            s.storage.set("last_connection_state", !1),
            $(".chat-header").on("click", s.showConnectionError)
        }
        ,
        !0 === e ? t() : n = setTimeout(t, 3e3))
    }
    ,
    this.isConnected = function() {
        return w
    }
    ,
    this.showConnectionError = function(e) {
        return e.stopImmediatePropagation(),
        e.preventDefault(),
        UI.ErrorMessage(ChatLang.error.unavailable),
        !1
    }
    ,
    this.isSupported = function() {
        return Connection.isSupportedBrowser() && Modernizr.json && Modernizr.localstorage && "function" == typeof window.addEventListener
    }
    ,
    this.handleError = function(e) {
        "err_unknown" === e.message ? UI.ErrorMessage(ChatLang.error.unknown) : "err_spam" === e.message ? UI.ErrorMessage(_("d015ac2902d2feed0ccd3efa93a4a851")) : UI.ErrorMessage(e.message),
        "message" === e.type && (e = e.metadata.head_id,
        e = s.getWindow("conversation_" + e)) && e.setBusy(!1)
    }
    ,
    this.updateSoundStatus = function() {
        TribalWars.getSetting("chat_sound_enabled") ? i.addClass("chat-sound-enabled") : i.removeClass("chat-sound-enabled")
    }
    ,
    this.addWindow = function(e) {
        i.append(e.getWindow()),
        r[e.getID()] = e,
        setTimeout(function() {
            e.getWindow().removeClass("chat-new-block")
        }, 200)
    }
    ,
    this.removeWindow = function(e) {
        delete r[e.getID()],
        e.getWindow().remove()
    }
    ,
    this.getWindow = function(e) {
        return r.hasOwnProperty(e) ? r[e] : null
    }
    ,
    this.requestConversationWithPlayer = function(e) {
        e === parseInt(window.game_data.player.id) ? UI.ErrorMessage(ChatLang.error.insanity) : TribalWars.post("chat", {
            ajaxaction: "create_private_conversation"
        }, {
            to_player_id: e
        }, e => {
            e = e.head_id;
            TribalWars.get("chat", {
                ajax: "get_conversation_data",
                head_id: e
            }, e => {
                this.receivedNewConversationData(e)
            }
            )
        }
        )
    }
    ,
    this.receivedNewConversationData = function(e) {
        1 === e.players.length ? s.newConversation(e.head_id, e.players[0].player_id, !1, !0) : s.newConversation(e.head_id, 0, !1, !0)
    }
    ,
    this.getConversationData = function(e, t) {
        u.hasOwnProperty(e) ? t(u[e]) : (l[e] = t,
        Connection.emit("chat/conversation", e))
    }
    ,
    this.receivedConversationData = function(e) {
        u[e.head_id] = e,
        l.hasOwnProperty(e.head_id) && (l[e.head_id](e),
        delete l[e.head_id])
    }
    ,
    this.newConversation = function(e, t, n, a) {
        var o;
        if (e = parseInt(e),
        t = parseInt(t),
        !(Object.keys(r).length >= f))
            return (o = s.getWindow("conversation_" + e)) ? (o.maximize(),
            o.setRead(),
            o.focus(),
            o) : (o = new ChatConversation(s,e,t),
            s.addWindow(o),
            s.conversationsChanged(n),
            v.hasOwnProperty(e) && o.updateUnreadCount(v[e]),
            a && (s.windowStateChanged(),
            o.setRead(),
            o.focus()),
            o);
        a && UI.ErrorMessage(ChatLang.error.windows)
    }
    ,
    this.removeConversation = function(e, t) {
        e = s.getWindow("conversation_" + e);
        e && (s.removeWindow(e),
        s.conversationsChanged(t))
    }
    ,
    this.conversationsChanged = function(e) {
        var n = [];
        $.each(r, function(e, t) {
            t instanceof ChatConversation && n.push(t.getConversationKey())
        }),
        c = n,
        !0 !== e && s.storage.set("conversationsv2", n)
    }
    ,
    this.syncConversations = function(e, t) {
        c.forEach(function(e) {
            -1 === $.inArray(e, t) && s.removeConversation(e.split("_")[0], !0)
        }),
        t.forEach(function(e) {
            -1 === $.inArray(e, c) && (e = e.split("_"),
            s.newConversation(e[0], e[1], !0))
        })
    }
    ,
    this.initConversations = function() {
        var e = s.storage.get("conversationsv2");
        e && e.forEach(function(e) {
            e = e.split("_");
            s.newConversation(e[0], e[1], !0)
        })
    }
    ,
    this.addPlayerName = function(e, t) {
        d[e] = t,
        h.hasOwnProperty(e) && (h[e](t),
        delete h[e])
    }
    ,
    this.getPlayerName = function(e, t) {
        d.hasOwnProperty(e) ? t(d[e]) : (h[e] = t,
        s.requestPlayerName(e))
    }
    ,
    this.requestPlayerName = function(e) {
        Connection.emit("chat/playername", e)
    }
    ,
    this.receivedPlayerName = function(e) {
        s.addPlayerName(e.id, e.name)
    }
    ,
    this.initWindowState = function() {
        var e = s.storage.get("window_state");
        e ? (this.syncWindowState(null, e),
        s.updateUIBufferStatus()) : parseInt(window.game_data.player.points) < 100 && s.contacts.minimize()
    }
    ,
    this.windowStateChanged = function() {
        var n = {};
        $.each(r, function(e, t) {
            n[e] = t.isMinimized() ? 0 : 1
        }),
        s.window_state = n,
        s.storage.set("window_state", n),
        s.updateUIBufferStatus()
    }
    ,
    this.updateUIBufferStatus = function() {
        var e = 0 < $("#chat-wrapper").find(".chat-window:not(.chat-window-minimized)").length
          , t = document.getElementById("side-notification-container");
        e ? ($(".chat-open-buffer").show(),
        t && (t.classList.remove("chat-closed"),
        t.classList.add("chat-open"))) : ($(".chat-open-buffer").hide(),
        t && (t.classList.remove("chat-open"),
        t.classList.add("chat-closed")))
    }
    ,
    this.syncWindowState = function(e, t) {
        $.each(t, function(e, t) {
            e = s.getWindow(e);
            e && (e.isMinimized() ? 0 : 1) !== t && (1 === t ? e.maximize(!0) : e.minimize(!0))
        })
    }
    ,
    this.requestChatHistory = function(e, t, n) {
        TribalWars.get("chat", {
            ajax: "get_history",
            ...{
                head_id: e,
                before: t
            }
        }, n)
    }
    ,
    this.receivedChatMessages = function(e) {
        var t = s.getWindow("conversation_" + e.head_id);
        t ? t.receivedMessages(e) : ((t = s.newConversation(e.head_id, e.player_id)).playSound(),
        s.requestContacts())
    }
    ,
    this.requestContacts = function() {
        Connection.emit("chat/contacts", {})
    }
    ,
    this.updateConversationName = function(e, t, n) {
        var a = s.getWindow("conversation_" + e);
        a && a.updateSubject(n),
        s.contacts && s.contacts.setConversationName(e, t, n)
    }
    ,
    this.setUnreadMessageCount = function(e, t) {
        v[e] = t;
        var n, a = s.getWindow("conversation_" + e);
        a && a.updateUnreadCount(t),
        s.contacts && (s.contacts.setUnreadCount(e, t),
        n = 0,
        $.each(v, function(e, t) {
            n += t
        }),
        s.contacts.setTotalUnreadCount(n),
        document.title = 0 === n ? o : "(" + n + ") " + o)
    }
    ,
    this.receivedChatRead = function(e) {
        s.setUnreadMessageCount(e, 0)
    }
    ,
    this.receivedChatReaction = function(e) {
        var t = s.getWindow("conversation_" + e.head_id);
        t && t.receivedReaction(e)
    }
    ,
    this.receivedTypingIndication = function(e) {
        e = s.getWindow("conversation_" + e);
        e && e.receivedPartnerTypingNotice()
    }
    ,
    this.refreshAllReactionIcons = function() {
        "undefined" != typeof PostReaction && PostReaction._registry && i[0].querySelectorAll(".chat-reaction .single-reaction").forEach(function(e) {
            var t, n = e.getAttribute("data-reaction");
            n && (n = PostReaction._getEmojiHtml(n)) && (t = e.querySelector(".reaction-count"),
            e.innerHTML = n,
            t) && e.appendChild(t)
        })
    }
    ,
    this.getEmojiSelector = function(t) {
        a ? t(a) : TribalWars.get("api", {
            ajax: "emoji"
        }, function(e) {
            t(a = e)
        })
    }
    ,
    this.init()
}
;

;var ChatLang = {
    general: {
        title: _("55dcdf017b51fc96f7b5f9d63013b95d"),
        close: _("0640197b0649207363d62dcce2e38e5b"),
        close_confirm: _("10432614703bfbf7b8da5060e7a6f32e"),
        authorship: _("0d961daef529b138a2a3330d25a6711d"),
        new_messages: _("a461f7807e591a76a8e6034997dae87d")
    },
    buttons: {
        close: _("d3d2e617335f08df83599665eef8a418"),
        minimize: _("d27532d90ecd513e97ab811c0f34dbfd"),
        maximize: _("1e8260f82515d3f84ec17a0de4bd4c5b"),
        other: _("dae8ace18bdcbcc6ae5aece263e14fe8"),
        "sound-on": _("66248805079469767a84505ae9b8c74e"),
        "sound-off": _("3cf621fb5bb2cb12ccc1bafb8f409bc3"),
        "group-chat": _("ec499421c57ec1bd00174636874446d0")
    },
    contacts: {
        recent: _("5e522eb5b45d399cfc289b8849a8a579"),
        group: _("31da17063d67c2cb279347de2a222f79"),
        ally: _("ffec4c2ee3a32c04e074fca3b29c5275"),
        buddy: _("3d594614f445f6b00014e9b77730b833"),
        none: _("ef4f6f9c0e487eb829dbb3c0ea2c3b98"),
        find_ally: _("f05d455c2d9f45fa2cffd700b671b4ca"),
        enter_name: _("8db61ba8bc85fde639110b3098e827bb"),
        does_not_exist: _("97285eceb8fdd1beafd94efa7f6b6774")
    },
    error: {
        windows: _("e286f60f604f843bc73defc79b090661"),
        unknown: _("06cc19fbc54421ae5a409a52470f75d8"),
        insanity: _("4b82a423b890525503cc83e97a767925"),
        unavailable: _("fef01d88899a64110142b48e0f78e9ab")
    },
    online: {
        online: _("cca55f4df33af29814ea569e9933a001"),
        offline: _("a7e6d2927eb5729e9e70786cac2b3af7"),
        unknown: _("27b2316e1a4e774581ae7523430ce273")
    },
    menu: {
        report: _("16db075c33c61875fbb85d0721fd6c8e"),
        block: _("bef53cf190abf4e127ce1a6ee37060f4")
    }
};

;var ChatStorage;
ChatStorage = function() {
    var n = {}
      , a = window.game_data.player.id + "_chat_";
    this.init = function() {
        "function" == typeof window.addEventListener && window.addEventListener("storage", this.storageChange, !1)
    }
    ,
    this.storageChange = function(e) {
        e.key.substr(0, a.length) === a && n.hasOwnProperty(e.key) && (0,
        n[e.key])(!!e.oldValue && JSON.parse(e.oldValue), !!e.newValue && JSON.parse(e.newValue))
    }
    ,
    this.get = function(e) {
        return JSON.parse(window.localStorage.getItem(a + e))
    }
    ,
    this.set = function(e, t) {
        window.localStorage.setItem(a + e, JSON.stringify(t))
    }
    ,
    this.remove = function(e) {
        window.localStorage.removeItem(a + e)
    }
    ,
    this.addObserver = function(e, t) {
        n[a + e] = t
    }
    ,
    this.init()
}
;

;var ChatWindow;
ChatWindow = function(t) {
    var n = this;
    this.$block = null,
    this.buildWindow = function(i) {
        n.$block = $('<div class="chat-block chat-new-block"><div class="chat-window ' + i + '"><div class="chat-header"><h4 class="chat-title"></h4><div class="chat-buttons"></div></div><div class="chat-body"></div><div class="chat-footer"></div></div></div></div>'),
        n.$block.find(".chat-header").click(function(i) {
            if ("A" === i.target.tagName || "INPUT" === i.target.tagName)
                return !0;
            n.isMinimized() ? n.maximize() : n.minimize()
        })
    }
    ,
    this.getWindow = function() {
        return n.$block
    }
    ,
    this.closeMenu = function() {
        n.getWindow().find(".chat-menu").remove()
    }
    ,
    this.setTitle = function(i) {
        n.$block.find("h4").html(i)
    }
    ,
    this.addButton = function(i, t) {
        i = $('<a href="#" class="chat-button chat-button-' + i + '"></a>').attr("title", ChatLang.buttons[i]);
        n.$block.find(".chat-buttons").append(i),
        i.on("click", t)
    }
    ,
    this.minimize = function(i) {
        return t.isConnected() && (n.$block.find(".chat-window").addClass("chat-window-minimized"),
        !0 !== i && t.windowStateChanged(),
        n.hasOwnProperty("didMinimize")) && n.didMinimize(),
        !1
    }
    ,
    this.maximize = function(i) {
        return t.isConnected() && (n.$block.find(".chat-window").removeClass("chat-window-minimized"),
        !0 !== i && t.windowStateChanged(),
        n.hasOwnProperty("didMaximize")) && n.didMaximize(),
        !1
    }
    ,
    this.isMinimized = function() {
        return n.$block.find(".chat-window").hasClass("chat-window-minimized")
    }
}
;

;var ChatContacts;
(ChatContacts = function(h) {
    ChatWindow.call(this, h);
    var l = this
      , a = {}
      , u = {}
      , p = {}
      , g = {}
      , f = {};
    this.init = function() {
        this.buildWindow("chat-contacts"),
        this.setTitle(ChatLang.general.title + ' <span class="chat-total-unread"></span>'),
        this.addButton("close", this.close),
        this.addButton("minimize", this.minimize),
        this.addButton("maximize", this.maximize),
        this.addButton("sound-off", this.toggleSound),
        this.addButton("sound-on", this.toggleSound),
        this.addButton("group-chat", GroupChat.openCreateWindow),
        this.buildFooter(),
        this.loadGroupState(),
        this.renderContactsFromCache(),
        this.getWindow().on("click", ".chat-contact", this.clickContact),
        Connection.registerHandler("chat/contacts", this.receivedContacts),
        Connection.registerHandler("chat/playerdata", this.receivedNewPlayerData),
        h.storage.addObserver("group_state", this.remoteGroupStateChanged)
    }
    ,
    this.getID = function() {
        return "contacts"
    }
    ,
    this.didMinimize = function() {
        l.getWindow().addClass("chat-mini-block")
    }
    ,
    this.didMaximize = function() {
        l.getWindow().removeClass("chat-mini-block")
    }
    ,
    this.toggleSound = function() {
        var t = TribalWars.getSetting("chat_sound_enabled");
        return TribalWars.setSetting("chat_sound_enabled", !t, function() {
            h.updateSoundStatus()
        }),
        !1
    }
    ,
    this.close = function() {
        var t = [{
            text: ChatLang.general.close_confirm,
            callback: function() {
                TribalWars.setSetting("chat_enabled", 0, function() {
                    window.location.reload()
                })
            },
            confirm: !0
        }];
        UI.ConfirmationBox(ChatLang.general.close, t)
    }
    ,
    this.clickContact = function() {
        var t = $(this).data("player_id")
          , a = $(this).data("head_id");
        return a ? h.newConversation(a, t, !1, !0) : h.requestConversationWithPlayer(t),
        !1
    }
    ,
    this.sortContactsByName = function(t, a) {
        return t.name.localeCompare(a.name)
    }
    ,
    this.sortContactsByLastPost = function(t, a) {
        return t.last_post > a.last_post
    }
    ,
    this.renderContactsFromCache = function() {
        var t = h.storage.get("contacts");
        t && (a = t,
        l.renderContacts())
    }
    ,
    this.renderContacts = function() {
        var e = l.getWindow().find(".chat-body");
        g = {},
        0 === Object.keys(a).length && 0 === e.find(".chat-no-contacts").length ? (e.append('<div class="chat-no-contacts"><p>' + ChatLang.contacts.none + "</p><p>" + s(ChatLang.contacts.find_ally, TribalWars.buildURL("GET", "ally")) + "</p></div>"),
        e.find(".chat-contact-group").remove()) : 0 < Object.keys(a).length && e.find(".chat-no-contacts").remove(),
        $.each(a, function(o, t) {
            t = "recent" === o || "group" === o ? t.sort(l.sortContactsByLastPost) : t.sort(l.sortContactsByName);
            var i, a, c, n = e.find("#chat-contact-group-" + o), s = (n.length ? i = n.find(".chat-contact-group-contacts") : (p.hasOwnProperty(o) || (p[o] = 1),
            n = $('<div class="chat-contact-group chat-contact-group-open" id="chat-contact-group-' + o + '"/>').appendTo(e),
            (a = $('<div class="chat-contact-group-header"><span>' + ChatLang.contacts[o] + "</span></div>").appendTo(n)).data("group", o),
            a.on("click", l.toggleGroup),
            i = $('<div class="chat-contact-group-contacts" />').appendTo(n),
            0 === p[o] && l.hideGroup(o)),
            u.hasOwnProperty(o) || (u[o] = {}),
            u[o]), r = {}, d = {};
            $.each(t, function(t, a) {
                var n, e;
                a.player_id && d.hasOwnProperty(a.player_id) || (n = a.head_id + "_" + a.player_id,
                a.player_id ? h.addPlayerName(a.player_id, a.name) : h.receivedConversationData({
                    head_id: a.head_id,
                    subject: a.name,
                    group_creator: a.group_creator
                }),
                s.hasOwnProperty(n) || (e = $('<a class="chat-contact chat-status chat-status-' + a.player_id + '" data-head_id="' + a.head_id + '" data-player_id="' + a.player_id + '" id="chat-contact-' + n + '" href="#"><span class="chat-contact-name">' + escapeHtml(a.name) + '</span> <span class="chat-contact-count"></span></a>').data("online", -2),
                c ? c.after(e) : "recent" === o ? i.prepend(e) : i.append(e)),
                h.setUnreadMessageCount(a.head_id, a.new_count),
                f.hasOwnProperty(n) || (f[n] = a.name),
                a.name !== f[n] && h.updateConversationName(a.head_id, a.player_id, a.name),
                g.hasOwnProperty[a.player_id] && -1 === a.online || (g[a.player_id] = a.online),
                d[a.player_id] = r[n] = !0,
                c = e)
            }),
            $.each(s, function(t) {
                r.hasOwnProperty(t) || e.find("#chat-contact-" + t).remove()
            }),
            u[o] = r
        }),
        l.renderOnlineState()
    }
    ,
    this.renderOnlineState = function() {
        $.each(g, function(t, a) {
            l.getWindow().parent().find(".chat-status-" + t).each(function() {
                var t = $(this);
                parseInt(t.data("online")) !== a && (1 === a ? t.removeClass("chat-status-offline").addClass("chat-status-online").attr("title", ChatLang.online.online) : 0 === a ? t.removeClass("chat-status-online").addClass("chat-status-offline").attr("title", ChatLang.online.offline) : t.removeClass("chat-status-online chat-status-offline").attr("title", ChatLang.online.unknown),
                t.data("online", a))
            })
        })
    }
    ,
    this.getOnlineState = function(t) {
        return g.hasOwnProperty(t) ? g[t] : -1
    }
    ,
    this.loadGroupState = function() {
        var t = h.storage.get("group_state");
        t && (p = t)
    }
    ,
    this.toggleGroup = function() {
        var t = $(this).data("group");
        $(this).parent().hasClass("chat-contact-group-open") ? l.hideGroup(t) : l.showGroup(t)
    }
    ,
    this.showGroup = function(t) {
        l.getWindow().find("#chat-contact-group-" + t).addClass("chat-contact-group-open"),
        l.setLocalGroupState(t, 1)
    }
    ,
    this.hideGroup = function(t) {
        l.getWindow().find("#chat-contact-group-" + t).removeClass("chat-contact-group-open"),
        l.setLocalGroupState(t, 0)
    }
    ,
    this.setLocalGroupState = function(t, a) {
        p[t] = a,
        h.storage.set("group_state", p)
    }
    ,
    this.remoteGroupStateChanged = function(t, a) {
        $.each(a, function(t, a) {
            a !== p[t] && (a ? l.showGroup(t) : l.hideGroup(t))
        })
    }
    ,
    this.buildFooter = function() {
        var a = $('<input class="chat-input chat-search" type="text" placeholder="' + ChatLang.contacts.enter_name + '" />').appendTo(l.getWindow().find(".chat-footer"));
        a.on("keyup", function(t) {
            if (13 === t.keyCode)
                return l.newChatWithUnknownPlayer(a.val()),
                a.val(""),
                !1
        })
    }
    ,
    this.newChatWithUnknownPlayer = function(t) {
        Connection.emit("chat/playerdata", t)
    }
    ,
    this.receivedNewPlayerData = function(t) {
        !1 === t.status ? UI.ErrorMessage(ChatLang.contacts.does_not_exist) : (h.addPlayerName(t.result.id, t.result.name),
        h.requestConversationWithPlayer(t.result.id))
    }
    ,
    this.receivedContacts = function(t) {
        a = t,
        h.storage.set("contacts", a),
        l.renderContacts()
    }
    ,
    this.setUnreadCount = function(t, a) {
        l.getWindow().find(".chat-contact[data-head_id=" + t + "]").find(".chat-contact-count").text(0 < a ? "(" + a + ")" : "")
    }
    ,
    this.setConversationName = function(t, a, n) {
        f[t + "_" + a] = n,
        l.getWindow().find(".chat-contact[data-head_id=" + t + "]").find(".chat-contact-name").text(n)
    }
    ,
    this.setTotalUnreadCount = function(t) {
        this.getWindow().find(".chat-total-unread").text(0 < t ? "(" + t + ")" : "")
    }
    ,
    this.init()
}
).prototype = new ChatWindow;

;var ChatConversation;
(ChatConversation = function(c, a, h) {
    ChatWindow.call(this, c);
    var n, t, d, u = this, l = 0, s = !1, o = !1, p = 0, i = 0, e = 0, g = {
        timestamp: 0,
        human: ""
    }, m = 0, f = !1;
    this.init = function() {
        u.buildWindow("chat-conversation"),
        d = u.getWindow().find(".chat-body"),
        u.addButton("close", u.close),
        u.addButton("minimize", u.minimize),
        u.addButton("maximize", u.maximize),
        u.buildUI(),
        u.initDragDrop(),
        d.on("scroll", u.didScroll),
        d.on("click", u.setRead),
        h ? c.getPlayerName(h, function(e) {
            u.updateSubject(e),
            u.addButton("other", u.clickOther)
        }) : c.getConversationData(a, function(e) {
            u.conversation_data = e,
            u.updateSubject(),
            u.conversation_data.group_creator && u.addButton("other", u.clickOther)
        }),
        u.requestHistory()
    }
    ,
    this.updateSubject = function(e) {
        var t, a, n;
        h ? (t = TribalWars.buildURL("GET", "info_player", {
            id: h
        }),
        a = "",
        1 === (n = c.contacts.getOnlineState(h)) ? a = "chat-status-online" : 0 === n && (a = "chat-status-offline"),
        u.getWindow().find(".chat-status").data("online", n),
        u.setTitle('<a class="constrained chat-status chat-status-' + h + " " + a + '" href="' + t + '">' + escapeHtml(e) + '</a> <span class="chat-unread-count"></span><span class="chat-typing-indicator"></span>')) : (e && (u.conversation_data.subject = e),
        u.setTitle('<span class="constrained">' + escapeHtml(u.conversation_data.subject) + '</span> <span class="chat-unread-count"></span>'))
    }
    ,
    this.getID = function() {
        return "conversation_" + a
    }
    ,
    this.getHeadID = function() {
        return a
    }
    ,
    this.getPlayerID = function() {
        return h
    }
    ,
    this.getConversationKey = function() {
        return a + "_" + h
    }
    ,
    this.didMaximize = function() {
        u.scrollToBottom()
    }
    ,
    this.didMinimize = function() {
        u.getWindow().find(".chat-popover").hide()
    }
    ,
    this.beginRename = function() {
        var e = '<a href="#" class="confirm-rename"><img src="' + Format.image_src("quests/check.png") + '" /></a>';
        u.setTitle('<input type="text" name="subject" value="' + escapeHtml(this.conversation_data.subject) + '" />' + e),
        u.getWindow().find(".confirm-rename").on("click", u.endRename),
        u.getWindow().find("input[name=subject]").focus().select().on("keyup", function(e) {
            "Enter" === e.key && u.endRename(e)
        })
    }
    ,
    this.endRename = function(e) {
        e.stopPropagation();
        var t = u.getWindow().find("input[name=subject]").val()
          , e = {
            head_id: u.conversation_data.head_id,
            subject: t
        };
        TribalWars.post("chat", {
            ajaxaction: "rename_thread"
        }, e, function(e) {
            c.updateConversationName(a, h, t)
        })
    }
    ,
    this.clickOther = function() {
        var e = u.getWindow().find(".chat-menu");
        e.length ? e.remove() : (e = $('<div class="chat-menu" />'),
        h ? $('<a href="#" class="chat-menu-option">' + ChatLang.menu.block + "</div>").on("click", function() {
            return u.close(),
            TribalWars.redirect("info_player", {
                mode: "block",
                block_id: u.getPlayerID()
            }),
            !1
        }).appendTo(e) : u.conversation_data.group_creator && ($('<a href="#" class="chat-menu-option">' + _("ef53538ae41a651c7f72ab6cb1135d8c") + "</div>").on("click", function() {
            return GroupChat.openGroupMembers(u.conversation_data.head_id),
            u.closeMenu(),
            !1
        }).appendTo(e),
        (u.conversation_data.group_creator === game_data.player.id ? ($('<a href="#" class="chat-menu-option">' + _("904a8304056d77e4547744781b7ceb50") + "</div>").on("click", function() {
            return u.beginRename(),
            u.closeMenu(),
            !1
        }).appendTo(e),
        $('<a href="#" class="chat-menu-option">' + _("f2a6c498fb90ee345d997f888fce3b18") + "</div>").on("click", function() {
            return GroupChat.deleteGroup(u.conversation_data.head_id),
            u.closeMenu(),
            !1
        })) : $('<a href="#" class="chat-menu-option">' + _("a52945dbe283de2f7e9d63ca3417f36a") + "</div>").on("click", function() {
            return GroupChat.leaveGroup(u.conversation_data.head_id),
            u.closeMenu(),
            !1
        })).appendTo(e)),
        e.appendTo(d.parent()))
    }
    ,
    this.close = function() {
        return u.setRead(),
        c.removeConversation(a),
        !1
    }
    ,
    this.scrollToBottom = function() {
        d.scrollTop(d[0].scrollHeight)
    }
    ,
    this.buildUI = function() {
        u.buildFooter();
        var e = $('<a class="chat-new-message-notification" href="#">' + ChatLang.general.new_messages + "</div>");
        e.on("click", function() {
            return e.hide(),
            u.scrollToBottom(),
            u.setRead(),
            !1
        }),
        e.appendTo(d)
    }
    ,
    this.buildFooter = function() {
        var e = u.getWindow().find(".chat-footer")
          , t = $('<textarea class="chat-input"></textarea>').appendTo(e)
          , a = (n = t.height(),
        t.on("input", function() {
            u.adjustInputSize(),
            u.broadcastTyping()
        }),
        t.on("keydown", function(e) {
            if (13 === e.keyCode)
                return e.ctrlKey ? t.val(t.val() + "\n") : (u.sendMessage(t.val()),
                t.val("")),
                u.adjustInputSize(),
                !1
        }),
        t.on("click", u.setRead),
        t.on("focus", function() {
            f = !0
        }),
        t.on("blur", function() {
            f = !1
        }),
        e.append(UI.Image("loading2.gif", {
            class: "chat-busy-indicator"
        })),
        UI.Image("emoji/select.png", {
            class: "chat-smileys"
        }));
        e.append(a),
        a.on("click", this.toggleSmileys)
    }
    ,
    this.toggleSmileys = function(e) {
        e && e.stopPropagation();
        e = u.getWindow().find(".chat-popover-smileys").parents(".chat-popover");
        e.length ? "none" === e.css("display") ? e.show() : e.hide() : (u.setBusy(!0),
        c.getEmojiSelector(function(e) {
            var t = $('<div class="chat-popover" />')
              , a = $('<div class="chat-popover-smileys" />').appendTo(t);
            a.html(e),
            a.slimScroll({
                height: "200px"
            }),
            a.on("click", ".emoji", function() {
                var e = ":" + ($(this).data("title") || $(this).attr("title")) + ":"
                  , t = u.getWindow().find(".chat-input")
                  , a = t.prop("selectionStart")
                  , n = t.val()
                  , i = n.substring(0, a)
                  , a = n.substring(a, n.length);
                t.val(i + e + a),
                t.focus(),
                t[0].setSelectionRange(i.length + e.length, i.length + e.length),
                u.adjustInputSize()
            }),
            u.getWindow().on("click", function(e) {
                e = $(e.target);
                e.hasClass("chat-popover-smileys") || 0 !== e.parents(".chat-popover-smileys").length || "none" !== u.getWindow().find(".chat-popover-smileys").parents(".chat-popover").css("display") && u.toggleSmileys()
            }),
            u.getWindow().append(t),
            u.setBusy(!1)
        }))
    }
    ,
    this.adjustInputSize = function() {
        var e = u.getWindow().find("textarea");
        n || (n = e.height(),
        t = u.getWindow().find(".chat-body").height()),
        e[0].style.height = 0,
        e[0].style.height = Math.max(n, e[0].scrollHeight) + "px",
        u.getWindow().find(".chat-body").height(t + n - e.parent().height() + "px")
    }
    ,
    this.setBusy = function(e) {
        e ? u.getWindow().addClass("chat-busy") : u.getWindow().removeClass("chat-busy")
    }
    ,
    this.broadcastTyping = function() {
        var e;
        h && 3500 < (e = (new Date).getTime()) - i && (i = e,
        Connection.emit("chat/typing", {
            head_id: u.getHeadID(),
            player_id: u.getPlayerID()
        }))
    }
    ,
    this.sendMessage = function(e) {
        u.setBusy(!0),
        TribalWars.post("chat", {
            ajaxaction: "send_message"
        }, {
            head_id: a,
            body: e
        }, function() {
            u.setBusy(!1)
        }, e => c.handleError(JSON.parse(e))),
        i = 0
    }
    ,
    this.fixBB = function(e) {
        var t = TribalWars._script + "?";
        return window.game_data.hasOwnProperty("village") && (t += "village=" + window.game_data.village.id + "&"),
        e.replace(/\/guest.php\?/g, t)
    }
    ,
    this.addMessage = function(a, n, i) {
        var e = d.scrollTop()
          , t = $('<div class="chat-row" />')
          , s = (t.attr("data-post-id", a.id),
        a.body)
          , o = (c.isPlayerBlocked(a.player_id) && (t.addClass("blocked"),
        s = _("63a4fdedf50ddf4514669402c6856ff2")),
        0)
          , r = (0 === a.player_id ? t.append($('<div class="chat-system" />').html(s).attr("title", a.datetime)) : (r = window.s(ChatLang.general.authorship, a.datetime, parseInt(a.player_id) === parseInt(window.game_data.player.id) ? window.game_data.player.name : "other_person"),
        r = $('<div class="chat-message" />').html('<span class="chat-author">' + r + "\n</span>" + u.fixBB(s)).attr("title", a.datetime).appendTo(t),
        a.player_id !== parseInt(game_data.player.id) && (r.addClass("chat-message-other"),
        s = TribalWars.buildURL("GET", "info_player", {
            id: a.player_id
        }),
        r = $('<a href="' + s + '" title="' + escapeHtml(a.player_name) + '"><img src="' + a.player_avatar + '" class="userimage" /></a>'),
        t.prepend(r),
        t.addClass("has-avatar"),
        UI.ToolTip(r),
        t.addClass("reportable"),
        s = TribalWars.buildURL("GET", "affront", {
            mode: "affront",
            type: "post",
            id: a.id
        }),
        r = Format.image_src("error.png"),
        s = $('<a href="' + s + '" title="' + _("2cc9fd012f0f2759931a152895b42f81") + '" class="chat-report"><img src="' + r + '" /></a>'),
        t.append(s),
        UI.ToolTip(s),
        h || t.prepend('<span class="chat-author-line">' + escapeHtml(a.player_name) + "</span>")),
        "undefined" != typeof PostReaction && u.renderReactions(t, a)),
        function(e) {
            var t = $('<div class="chat-row"><span class="chat-time">' + (i ? a.datetime : g.human) + "</span></div>");
            "new" === n ? t.appendTo(d) : t.prependTo(d),
            o += t.outerHeight()
        }
        );
        "new" === n ? (0 !== m && 3600 < (new Date).getTime() / 1e3 - m && r(a.human),
        m = a.timestamp,
        d.append(t),
        t.hide().fadeIn(200),
        a.player_id !== parseInt(window.game_data.player.id) ? (c.setUnreadMessageCount(u.getHeadID(), p + 1),
        f ? u.setRead() : u.playSound(),
        u.setPartnerSilent(),
        u.isMinimized() || d[0].scrollHeight - d.height() === d.scrollTop() || d.find(".chat-new-message-notification").show()) : u.setBusy(!1)) : (i && d.prepend(t),
        0 === m && (m = a.timestamp),
        0 === g.timestamp ? g = {
            timestamp: a.timestamp,
            human: a.datetime
        } : 3600 < g.timestamp - a.timestamp || i ? (r(i ? a.datetime : g.human),
        g = {
            timestamp: a.timestamp,
            human: a.datetime
        }) : g.human = a.datetime,
        i || d.prepend(t)),
        parseInt(game_data.player.id),
        (0 === l || l > a.id) && (l = a.id),
        u.isMinimized() || d.scrollTop(e + t.outerHeight() + o)
    }
    ,
    this.renderReactions = function(e, t) {
        u._initPostReactionForChat();
        var a, n, i, s, o, e = e[0], r = !h, c = r ? "single-reaction-group" : "single-reaction-single", d = document.createElement("div"), l = t.player_id === parseInt(game_data.player.id), p = (d.className = "reaction chat-reaction" + (l ? " chat-reaction-own" : ""),
        d.setAttribute("data-chat-group", r ? "1" : "0"),
        t.reactions || {});
        for (a in p)
            p.hasOwnProperty(a) && (n = p[a],
            (i = document.createElement("span")).className = "single-reaction " + c + (n.reacted ? " reacted" : ""),
            i.setAttribute("data-reaction", a),
            n.players && i.setAttribute("title", PostReaction._buildTooltip(a, n.players)),
            i.innerHTML = PostReaction._getEmojiHtml(a) || ":" + escapeHtml(a) + ":",
            r && ((s = document.createElement("span")).className = "reaction-count",
            s.textContent = n.count,
            i.appendChild(s)),
            d.appendChild(i),
            UI.ToolTip(i));
        t.id && 0 < Object.keys(p).length && (PostReaction.reactions[t.id] = p),
        !r && t.player_id === parseInt(game_data.player.id) || ((l = document.createElement("span")).className = "new-reaction",
        (o = document.createElement("a")).href = "#",
        o.setAttribute("data-post-id", t.id),
        o.appendChild(UI.Image("emoji/select.png", {
            class: "new-reaction-icon"
        })[0]),
        l.appendChild(o),
        d.appendChild(l)),
        e.appendChild(d)
    }
    ,
    this._initPostReactionForChat = function() {
        PostReaction._ensureListenerRegistered()
    }
    ,
    this.receivedReaction = function(e) {
        var t, a = d[0].querySelector('.chat-row[data-post-id="' + e.post_id + '"]');
        a && (PostReaction.reactions[e.post_id] = e.reactions,
        (t = a.querySelector(".reaction")) && t.remove(),
        u.renderReactions($(a), {
            id: e.post_id,
            reactions: e.reactions,
            player_id: e.player_id
        }))
    }
    ,
    this.requestHistory = function(e) {
        if (!s) {
            if (0 === (e = e || 0)) {
                var t = u.getCachedHistory();
                if (t)
                    return void setTimeout(function() {
                        u.receivedMessages({
                            type: "history",
                            messages: t
                        })
                    }, 0)
            }
            s = !0,
            c.requestChatHistory(a, e, e => {
                u.receivedMessages({
                    type: "history",
                    messages: e
                })
            }
            )
        }
    }
    ,
    this.getCachedHistory = function() {
        var e = c.storage.get("history_" + a);
        return !!e && Timing.getCurrentServerTime() - e.timestamp < 1e3 * c.HISTORY_CACHE_TIME && e.messages
    }
    ,
    this.receivedMessages = function(a) {
        s = !1;
        var n = a.messages
          , i = !1;
        21 !== n.length ? i = !0 : n = n.slice(0, 20),
        a.messages.forEach(function(e, t) {
            u.addMessage(e, a.type, i && t === n.length - 1)
        }),
        "history" === a.type && a.hasOwnProperty("fresh") && !0 === a.fresh ? c.storage.set("history_" + a.head_id, {
            timestamp: Timing.getCurrentServerTime(),
            messages: a.messages
        }) : "new" === a.type && c.storage.remove("history_" + a.head_id),
        0 === a.messages.length && (o = !0)
    }
    ,
    this.playSound = function() {
        TribalWars.getSetting("chat_sound_enabled") && TribalWars.playSound("chat")
    }
    ,
    this.didScroll = function(e) {
        var t = d[0].scrollHeight - d.height();
        $(this).scrollTop() < t / 3 && !s && !o && u.requestHistory(l),
        d[0].scrollHeight - d.height() === d.scrollTop() && d.find(".chat-new-message-notification").hide()
    }
    ,
    this.updateUnreadCount = function(e) {
        p = parseInt(e);
        var t = u.getWindow().find(".chat-unread-count");
        0 < p ? t.show().text("(" + e + ")") : 0 === p && "none" !== t.css("display") && t.fadeOut()
    }
    ,
    this.setRead = function() {
        0 !== p && (c.setUnreadMessageCount(a, 0),
        Connection.emit("chat/read", a),
        h) && TribalWars.track("chat", ["read", u.getPlayerID(), 1])
    }
    ,
    this.receivedPartnerTypingNotice = function() {
        e && clearTimeout(e),
        u.setPartnerTyping(),
        e = setTimeout(u.setPartnerSilent, 5e3)
    }
    ,
    this.setPartnerTyping = function() {
        u.getWindow().addClass("is-typing")
    }
    ,
    this.setPartnerSilent = function() {
        e && clearTimeout(e),
        u.getWindow().removeClass("is-typing")
    }
    ,
    this.focus = function() {
        u.getWindow().find("textarea").focus()
    }
    ,
    this.initDragDrop = function() {
        var e = u.getWindow()
          , s = 0;
        e.on("dragenter", function(e) {
            1 === ++s && d.addClass("lit")
        }),
        e.on("dragleave", function(e) {
            0 === --s && d.removeClass("lit")
        }),
        e.on("dragover", function(e) {
            e.preventDefault()
        }),
        e.on("dragstop", function(e) {
            s = 0,
            d.removeClass("lit")
        }),
        e.on("drop", function(e) {
            var t, a, n, i = e.originalEvent.dataTransfer.getData("Text");
            return !i || "http" !== i.substr(0, 4) || ((t = i.match(/id=([0-9]+)/)) && i.match(/screen=info_village/) ? a = "[village]#" + t[1] + "[/village]" : i.match(/screen=overview/) && !i.match(/screen=overview_/) ? (n = i.match(/village=(\d+)/)) && (a = "[village]#" + n[1] + "[/village]") : a = t && i.match(/screen=info_player/) ? "[player]#" + t[1] + "[/player]" : t && i.match(/screen=info_ally/) ? "[ally]#" + t[1] + "[/ally]" : "[url]" + i + "[/url]",
            a && (u.sendMessage(a),
            u.getWindow().find("textarea").focus(),
            e.preventDefault()),
            s = 0,
            void d.removeClass("lit"))
        })
    }
    ,
    this.init()
}
).prototype = new ChatWindow;

;var GroupChat;
GroupChat = {
    MAX_GROUP_CHAT_PARTICIPANTS: 20,
    openCreateWindow: function() {
        var e = "<h2>" + _("ec499421c57ec1bd00174636874446d0") + "</h2>"
          , e = (e = (e = (e += '<p class="error" style="display: none"></p>') + "<form>" + '<section class="chat-group-players">') + ('<label class="chat-group-player">' + _("86eaf6742dd45d73c45f3f65306701e1") + ' <input type="text" class="input-nicer" disabled value="' + game_data.player.name + '" /></label>') + "</section>") + ('<input type="submit" class="btn" value="' + _("686e697538050e4664636337cc3b834f") + '" /></form>');
        Dialog.show("create_group_chat", e),
        $(".chat-group-players").append([GroupChat.createPlayerInputField()]),
        $("#popup_box_create_group_chat").on("input", "input[type=text]", GroupChat.handleCreateWindowPlayerInput),
        $("#popup_box_create_group_chat input[type=text]:not(:disabled)").first().focus(),
        $("#popup_box_create_group_chat form").on("submit", GroupChat.handleSubmit)
    },
    createPlayerInputField: function(e) {
        var a = $('<label class="chat-group-player">' + _("86eaf6742dd45d73c45f3f65306701e1") + ' <input type="text" name="group_player[]" class="input-nicer" /></label>');
        return e && a.find("input").val(e),
        a
    },
    handleCreateWindowPlayerInput: function() {
        var e, a = $(this), t = $(".chat-group-players");
        a.val().includes(";") && 1 === a.parent().index() ? ((e = a.val().split(";", GroupChat.MAX_GROUP_CHAT_PARTICIPANTS).map(GroupChat.createPlayerInputField)).length < GroupChat.MAX_GROUP_CHAT_PARTICIPANTS && e.push(GroupChat.createPlayerInputField()),
        t.find("label").not(":first-child").remove(),
        t.append(e)) : (t = 0 === a.val().length) && "" === a.parent().next().find("input").val() && 1 < a.parent().siblings().length ? a.parent().next().remove() : !t && !a.parent().next().length && a.parent().siblings().length < GroupChat.MAX_GROUP_CHAT_PARTICIPANTS - 1 && $(".chat-group-players").append(GroupChat.createPlayerInputField())
    },
    handleSubmit: function(e) {
        e.preventDefault();
        e = $("#popup_box_create_group_chat input[type=text]:not(:disabled)").map(function() {
            return $(this).val()
        }).get().filter(function(e) {
            return "" !== e
        });
        0 === e.length ? UI.ErrorMessage(_("019db0ce40809d276ba6ff2f9523b686")) : 1 === e.length ? (window.TribalWars._chat.contacts.newChatWithUnknownPlayer(e[0]),
        Dialog.close()) : GroupChat.createGroupChat(e)
    },
    createGroupChat: function(e) {
        TribalWars.post("chat", {
            ajaxaction: "create_group_chat"
        }, {
            player_names: e
        }, function(e) {
            e.hasOwnProperty("problems") ? $("#popup_box_create_group_chat .error").html(e.problems).show() : (TribalWars._chat.requestContacts(),
            TribalWars._chat.newConversation(e.head_id, 0, !1, !0),
            Dialog.close())
        })
    },
    openGroupMembers: function(e) {
        Dialog.fetch("thread_members", "chat", {
            ajax: "thread_members",
            head_id: e
        }, function() {
            $(".evt-delete-group-member").on("click", function() {
                return GroupChat.removeGroupMember(e, $(this).data("playerId")),
                !1
            }),
            $("#group_chat_add_player").on("submit", function() {
                return GroupChat.addGroupMember(e, $("#group_chat_add_player").find("input[type=text]").val()),
                !1
            })
        })
    },
    addGroupMember: function(e, a) {
        TribalWars.post("chat", {
            ajaxaction: "thread_add_member"
        }, {
            head_id: e,
            player_name: a
        }, function() {
            UI.SuccessMessage(_("0d0cec22698e3d28ded47e7748563cfe")),
            Dialog.close(),
            GroupChat.openGroupMembers(e)
        })
    },
    removeGroupMember: function(e, a) {
        var t = [{
            text: _("1063e38cb53d94d386f21227fcd84717"),
            callback: function() {
                TribalWars.post("chat", {
                    ajaxaction: "thread_remove_member"
                }, {
                    head_id: e,
                    player_id: a
                }, function() {
                    UI.SuccessMessage(_("f0946c8625b7d7bb68ca3e160b2b893d")),
                    Dialog.close(),
                    GroupChat.openGroupMembers(e)
                })
            },
            confirm: !0
        }];
        UI.ConfirmationBox(_("b715c6f5ffc6e8b26e3577bc7e2aee47"), t)
    },
    leaveGroup: function(e) {
        var a = [{
            text: _("129b9e34ea8ab880950928c8a1281745"),
            callback: function() {
                TribalWars.post("chat", {
                    ajaxaction: "thread_leave"
                }, {
                    head_id: e
                }, function() {
                    Dialog.close(),
                    TribalWars._chat.removeConversation(e, !1),
                    TribalWars._chat.requestContacts()
                })
            },
            confirm: !0
        }];
        UI.ConfirmationBox(_("7378400845bc99fa30897b22a1af80fb"), a)
    },
    deleteGroup: function(e) {
        var a = [{
            text: _("f2a6c498fb90ee345d997f888fce3b18"),
            callback: function() {
                TribalWars.post("chat", {
                    ajaxaction: "thread_delete"
                }, {
                    head_id: e
                }, function() {
                    Dialog.close(),
                    TribalWars._chat.removeConversation(e, !1),
                    TribalWars._chat.requestContacts()
                })
            },
            confirm: !0
        }];
        UI.ConfirmationBox(_("c97e197e536a45f2c2f05bbde1468db0"), a)
    }
};

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandAnimateIntChange", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(t) {
    function n(t, n, i, o) {
        this.duration_ms = o || 500,
        this.$el = t,
        this.from_int = n,
        this.to_int = i
    }
    return n.prototype = Object.create(t.prototype),
    $.extend(n.prototype, {
        describe: function() {
            return "animate int change from " + this.from_int + " to " + this.to_int + " with duration " + this.duration_ms + "ms"
        },
        run: function(o, t) {
            var e = this
              , m = Timing.getElapsedTimeSinceLoad();
            !function t() {
                var n = Timing.getElapsedTimeSinceLoad() - m
                  , i = Math.min(1, n / e.duration_ms)
                  , i = e.from_int + Math.floor((e.to_int - e.from_int) * i);
                e.$el.html(i),
                n < e.duration_ms ? window.requestAnimationFrame && requestAnimationFrame(t) || setTimeout(t, 16) : o()
            }()
        }
    }),
    n
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandAsyncAll", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(n) {
    function o(n) {
        this.commands = n
    }
    return o.prototype = Object.create(n.prototype),
    $.extend(o.prototype, {
        describe: function() {
            return "do multiple commands asynchronously and resolve when all are done"
        },
        run: function(n, o) {
            function t() {
                m++,
                a || m !== r.length || n()
            }
            function e(n) {
                a || (a = !0,
                o(n))
            }
            var r = this.commands
              , a = !1
              , m = 0;
            try {
                r.forEach(function(n) {
                    n.run(t, e)
                })
            } catch (n) {
                throw a = !0,
                n
            }
        }
    }),
    o
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandCallFunction", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(n) {
    function o(n) {
        this.func = n
    }
    return o.prototype = Object.create(n.prototype),
    $.extend(o.prototype, {
        describe: function() {
            return "Call a function: " + this.func.toString()
        },
        run: function(n, o) {
            this.func(),
            n()
        }
    }),
    o
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandDebugLogToConsole", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(o) {
    function e(o) {
        this.message = o
    }
    return e.prototype = Object.create(o.prototype),
    $.extend(e.prototype, {
        describe: function() {
            return "Log a message to the console: " + this.message
        },
        run: function(o, e) {
            console.log(this.message),
            o()
        }
    }),
    e
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandDebugNop", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(o) {
    function n() {}
    return n.prototype = Object.create(o.prototype),
    $.extend(n.prototype, {
        describe: function() {
            return "no operation"
        }
    }),
    n
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandDebugReject", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(e) {
    function t(e) {
        this.error = e
    }
    return t.prototype = Object.create(e.prototype),
    $.extend(t.prototype, {
        describe: function() {
            return "immediately reject"
        },
        run: function(e, t) {
            t("Rejected because that's the only thing I can do.")
        }
    }),
    t
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandDebugThrowError", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(r) {
    function o(r) {
        this.error = r
    }
    return o.prototype = Object.create(r.prototype),
    $.extend(o.prototype, {
        describe: function() {
            return "Throw an error: " + JSON.stringify(this.error)
        },
        run: function(r, o) {
            throw this.error
        }
    }),
    o
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandSequence", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand", "Ig/TribalWars/Modules/Common/Command/CommandThread"], function(n, d) {
    function o(n) {
        this.commands = n
    }
    return o.prototype = Object.create(n.prototype),
    $.extend(o.prototype, {
        describe: function() {
            return "do multiple commands in sequence and resolve when all are done"
        },
        push: function(n) {
            this.commands.push(n)
        },
        run: function(o, e) {
            var m = this.commands
              , r = !1
              , t = 0;
            try {
                var a = new d;
                a.on(d.EVENT_COMMAND_RESOLVED, function(n) {
                    t++,
                    r || t !== m.length || o()
                }),
                a.on(d.EVENT_COMMAND_REJECTED, function(n) {
                    n = n.error,
                    r || (r = !0,
                    e(n))
                }),
                m.forEach(function(n) {
                    a.runWhenReady(n)
                })
            } catch (n) {
                throw r = !0,
                n
            }
        }
    }),
    o
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandSoundPlaythrough", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(n) {
    function e(n) {
        this.filename = n
    }
    return e.prototype = Object.create(n.prototype),
    $.extend(e.prototype, {
        describe: function() {
            return 'Play the "' + this.filename + '" sound and resolve when done'
        },
        run: function(n, e) {
            TribalWars.playSound(this.filename, 1500, n)
        }
    }),
    e
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandSoundStart", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(n) {
    function e(n) {
        this.filename = n
    }
    return e.prototype = Object.create(n.prototype),
    $.extend(e.prototype, {
        describe: function() {
            return 'Start playing the "' + this.filename + '" sound and immediately resolve'
        },
        run: function(n, e) {
            TribalWars.playSound(this.filename),
            n()
        }
    }),
    e
});

;define("Ig/TribalWars/Modules/Common/Command/Commands/CommandWait", ["Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(o) {
    function t(o) {
        this.duration_ms = o
    }
    return t.prototype = Object.create(o.prototype),
    $.extend(t.prototype, {
        describe: function() {
            return "Wait for " + this.duration_ms + " milliseconds"
        },
        run: function(o, t) {
            setTimeout(o, this.duration_ms)
        }
    }),
    t
});

;define("Ig/TribalWars/Modules/Common/Command/AbstractCommand", function() {
    function n() {}
    return n.prototype = {
        describe: function() {
            return "Proto command"
        },
        validate: function() {},
        run: function(n, o) {
            n()
        }
    },
    n
});

;define("Ig/TribalWars/Modules/Common/Command/CommandLogger", ["Ig/TribalWars/Modules/Common/Command/CommandThread"], function(o) {
    function n() {}
    return n.prototype = {
        watchThread: function(n) {
            var e = this;
            n.on(o.EVENT_COMMAND_STARTED, function(n) {
                e.logCommandStarted(n.command)
            }),
            n.on(o.EVENT_COMMAND_RESOLVED, function(n) {
                e.logCommandResolved(n.command)
            }),
            n.on(o.EVENT_COMMAND_REJECTED, function(n) {
                e.logCommandRejected(n.command, n.error)
            })
        },
        logCommandStarted: function(n) {
            console.info("[" + this._currentTimeString() + "] start: " + n.describe())
        },
        logCommandResolved: function(n) {
            console.info("[" + this._currentTimeString() + "] resolved: " + n.describe())
        },
        logCommandRejected: function(n, e) {
            console.error("[" + this._currentTimeString() + "] failed: " + n.describe() + "\n\trejected because: " + JSON.stringify(e))
        },
        _currentTimeString: function() {
            var n = (new Date).getTime() / 1e3;
            return Format.date(n, !0, !0, !0, !1)
        }
    },
    n
});

;define("Ig/TribalWars/Modules/Common/Command/CommandThread", ["module", "Ig/TribalWars/Modules/Common/Event/FiresEventsTrait", "Ig/TribalWars/Modules/Common/Command/AbstractCommand"], function(n, e, t) {
    function i() {
        (new e).mixinTo(this),
        this._queue = []
    }
    return i.EVENT_COMMAND_STARTED = n.id + "/COMMAND_STARTED",
    i.EVENT_COMMAND_RESOLVED = n.id + "/COMMAND_RESOLVED",
    i.EVENT_COMMAND_REJECTED = n.id + "/COMMAND_REJECTED",
    i.prototype = {
        _running: !1,
        runWhenReady: function(n) {
            if (n instanceof t)
                this._queue.push(n);
            else {
                if (!Array.isArray(n))
                    throw "invalid command";
                this._runSequenceWhenReady(n)
            }
            return this._running || this._scheduleNextRun(),
            this
        },
        _runSequenceWhenReady: function(n) {
            var e = this;
            n.forEach(function(n) {
                e.runWhenReady(n)
            })
        },
        _scheduleNextRun: function() {
            this._running = !0,
            setTimeout(this._runNextCommand.bind(this), 0)
        },
        _runNextCommand: function() {
            var n = this._queue.shift();
            this._runCommand(n)
        },
        _runCommand: function(e) {
            function t(n) {
                o || (i._handleCommandRejected(e, n),
                i._endCommand(),
                o = !0)
            }
            var i = this
              , o = (i._running = !0,
            i._handleCommandStarted(e),
            !1);
            try {
                e.validate(),
                e.run(function() {
                    o || (i._handleCommandResolved(e),
                    i._endCommand(),
                    o = !0)
                }, t)
            } catch (n) {
                console.error("rejected command because error was thrown:", n),
                t(n)
            }
        },
        _endCommand: function() {
            this._running = !1,
            0 < this._queue.length && this._scheduleNextRun()
        },
        _handleCommandStarted: function(n) {
            this.trigger(i.EVENT_COMMAND_STARTED, {
                command: n
            })
        },
        _handleCommandResolved: function(n) {
            this.trigger(i.EVENT_COMMAND_RESOLVED, {
                command: n
            })
        },
        _handleCommandRejected: function(n, e) {
            this.trigger(i.EVENT_COMMAND_RESOLVED, {
                command: n,
                error: e
            })
        }
    },
    i
});

;define("Ig/TribalWars/Modules/Common/Event/Messages/MessageServerPublishedMessage", ["module"], function(e) {
    function s(e) {
        this.type = s.TYPE,
        this.server_message_dto = e
    }
    return s.TYPE = e.id + "_SERVER_PUBLISHED_MESSAGE",
    s
});

;define("Ig/TribalWars/Modules/Common/Event/EventDispatcher", ["Ig/TribalWars/Modules/Common/Event/HandlerHandle", "Ig/TribalWars/Modules/Common/Event/SubscriberHandle"], function(r, s) {
    function e() {
        this._handlers_by_name = {},
        this._subscribers = {},
        this._next_key = 1
    }
    return e.prototype = {
        dispatch: function(e, n) {
            this._callHandlers(e, n),
            this._notifySubscribers(e, n)
        },
        registerHandler: function(e, n) {
            void 0 === this._handlers_by_name[e] && (this._handlers_by_name[e] = {});
            var s = this._nextKey();
            return this._handlers_by_name[e][s] = n,
            new r(this,e,s)
        },
        removeHandler: function(e) {
            delete this._handlers_by_name[e.event_name][e.key]
        },
        removeHandlers: function(e) {
            this._handlers_by_name[e] = {}
        },
        removeAllHandlers: function() {
            for (var e = Object.keys(this._handlers_by_name), n = 0; n < e.length; n++)
                this._handlers_by_name[e[n]] = {}
        },
        _callHandlers: function(e, s) {
            void 0 !== this._handlers_by_name[e] && $.each(this._handlers_by_name[e], function(e, n) {
                n(s)
            })
        },
        registerSubscriber: function(e) {
            var n = this._nextKey();
            return this._subscribers[n] = e,
            new s(this,n)
        },
        removeSubscriber: function(e) {
            delete this._subscribers[e.key]
        },
        removeAllSubscribers: function() {
            this._subscribers = {}
        },
        _notifySubscribers: function(s, r) {
            $.each(this._subscribers, function(e, n) {
                n.notify(s, r)
            })
        },
        _nextKey: function() {
            return this._next_key++
        },
        destruct: function() {
            this.removeAllHandlers(),
            this.removeAllSubscribers()
        }
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Event/FiresEventsTrait", ["module", "Ig/TribalWars/Modules/Common/Trait/Trait", "Ig/TribalWars/Modules/Common/Event/EventDispatcher"], function(t, n, e) {
    function i() {
        n.apply(this);
        var i = new e
          , o = [];
        this.addMixinMethod("on", function(t, n) {
            return i.registerHandler(t, n)
        }),
        this.addMixinMethod("trigger", function(t, n) {
            i.dispatch(t, n)
        }),
        this.addMixinMethod("bubbles", function(e, t) {
            t.forEach(function(n) {
                var t = e.on(n, function(t) {
                    i.dispatch(n, t)
                });
                o.push(t)
            })
        });
        this.setDestructor(function() {
            o.forEach(function(t) {
                t.destruct()
            }),
            i.destruct(),
            o = []
        })
    }
    return i.prototype = Object.create(n.prototype),
    $.extend(i.prototype, {
        name: t.id
    }),
    i
});

;define("Ig/TribalWars/Modules/Common/Event/HandlerHandle", function() {
    function e(e, t, n) {
        this.dispatcher = e,
        this.event_name = t,
        this.key = n
    }
    return e.prototype = {
        destruct: function() {
            this.dispatcher.removeHandler(this)
        }
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Event/MessageFactory", function() {
    function o() {
        this._factories = {}
    }
    return o.prototype = {
        registerMessageFactory: function(t) {
            var r;
            if (t instanceof o)
                return r = this,
                t.getSupportedServerMessageTypes().forEach(function(e) {
                    r._factories[e] = t
                }),
                this;
            throw "registerMessageFactory expects message_factory to be an instance of MessageFactory"
        },
        registerMessageFactoryFunction: function(e, t) {
            if ("function" != typeof t)
                throw "registerMessageFactoryFunction expects message_factory_function to be a function";
            return this._factories[e] = t,
            this
        },
        getSupportedServerMessageTypes: function() {
            return Object.keys(this._factories)
        },
        supportsServerMessageType: function(e) {
            return void 0 !== this._factories[e]
        },
        createFromServerMessage: function(e) {
            var t = this._factories[e.type];
            if ("function" == typeof t)
                return t(e);
            if (t instanceof o)
                return t.createFromServerMessage(e);
            throw s("unsupported server message type: %1", e.type)
        }
    },
    o
});

;define("Ig/TribalWars/Modules/Common/Event/ServerMessageConverter", ["Ig/TribalWars/Modules/Common/Event/MessageFactory", "Ig/TribalWars/Modules/Common/Event/Messages/MessageServerPublishedMessage"], function(s, t) {
    function e(e) {
        this._message_factory = new s,
        this._event_dispatcher = e,
        this._event_dispatcher.registerSubscriber(this)
    }
    return e.prototype = {
        registerMessageFactory: function(e) {
            this._message_factory.registerMessageFactory(e)
        },
        notify: function(e, s) {
            s instanceof t && this._message_factory.supportsServerMessageType(s.server_message_dto.type) && this.publishClientCounterpart(s.server_message_dto)
        },
        publishClientCounterpart: function(e) {
            e = this._message_factory.createFromServerMessage(e);
            this._event_dispatcher.dispatch(e.type, e)
        }
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Event/SubscriberHandle", function() {
    function e(e, t) {
        this.dispatcher = e,
        this.key = t
    }
    return e.prototype = {
        destruct: function() {
            this.dispatcher.removeSubscriber(this)
        }
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Trait/Trait", ["module", "Ig/TribalWars/Modules/Common/Trait/TraitCollection"], function(t, n) {
    function i() {
        this._mixin_methods = [],
        this._destructor = null
    }
    return i.prototype = {
        name: t.name,
        mixinTo: function(t) {
            void 0 === t._traits && (t._traits = new n),
            t._traits.addTrait(this);
            for (var i = 0; i < this._mixin_methods.length; i++)
                this._mixinMethod(t, this._mixin_methods[i])
        },
        addMixinMethod: function(t, i) {
            this._mixin_methods.push({
                name: t,
                definition: i
            })
        },
        _mixinMethod: function(t, i) {
            t[i.name] = i.definition
        },
        setDestructor: function(t) {
            this._destructor = t
        },
        destruct: function() {
            "function" == typeof this._destructor && this._destructor()
        }
    },
    i
});

;define("Ig/TribalWars/Modules/Common/Trait/TraitCollection", function() {
    function t() {
        this._traits = []
    }
    return t.prototype = {
        addTrait: function(t) {
            this._traits.push(t)
        },
        destruct: function() {
            this._traits.forEach(function(t) {
                t.destruct()
            })
        }
    },
    t
});

;define("__NAMESPACE__/__NAMEPREFIX__Controller", ["Ig/TribalWars/Modules/Common/Widget/AbstractController"], function(t) {
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _watchModels: function() {},
        _watchView: function() {},
        _watchSubWidgets: function() {},
        _eventNamesToAlwaysBubble: function() {
            return []
        }
    }),
    e
});

;define("__NAMESPACE__/__NAMEPREFIX__StateReducer", ["Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer"], function(t) {
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        newStateFromNothing: function() {
            throw "not implemented"
        },
        newStateFromModels: function(t, e, o) {
            throw "not implemented"
        },
        _action_reducers: {}
    }),
    e
});

;define("__NAMESPACE__/__NAMEPREFIX__View", ["Ig/TribalWars/Modules/Common/Widget/AbstractView"], function(t) {
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _initStructure: function(t) {
            throw "not implemented"
        },
        _initEventPublishing: function() {},
        _render: function(t, e) {
            throw "not implemented"
        }
    }),
    e
});

;define("__NAMESPACE__/__NAMEPREFIX__Widget", ["Ig/TribalWars/Modules/Common/Widget/AbstractWidget", "__NAMESPACE__/__NAMEPREFIX__View", "__NAMESPACE__/__NAMEPREFIX__Controller", "__NAMESPACE__/__NAMEPREFIX__StateReducer"], function(_, e, t, i) {
    function n() {
        _.apply(this),
        this._models = {},
        this._services = {},
        this._view = new e,
        this._controller = new t,
        this._state_reducer = new i
    }
    return n.prototype = Object.create(_.prototype),
    $.extend(n.prototype, {
        _getObsoleteSubWidgetKeys: function(_, e) {
            return []
        },
        _initSubWidgets: function(_, e, t) {}
    }),
    n
});

;define("Ig/TribalWars/Modules/Common/Widget/AbstractController", function() {
    function t() {
        this._handler_handles = [],
        this._sub_widget_handlers = []
    }
    return t.prototype = {
        _models: null,
        _services: null,
        _view: null,
        _widget: null,
        init: function(t, e, n, i) {
            this._models = t,
            this._services = e,
            this._view = n,
            this._widget = i,
            this._watchModels(),
            this._watchView(),
            this._initViewBubbling(),
            this._watchSubWidgets()
        },
        _watchModels: function() {},
        _watchModelForEvent: function(t, e, n) {
            t = t.on(e, n);
            this._grabHandlerHandle(t)
        },
        _watchView: function() {},
        _watchViewForEvent: function(t, e) {
            t = this._view.on(t, e);
            this._grabHandlerHandle(t)
        },
        _watchSubWidgets: function() {},
        _watchSubWidgetsForEvent: function(t, e) {
            this._sub_widget_handlers.push({
                event_name: t,
                handler: e
            })
        },
        watchSubWidgetForEvents: function(t) {
            for (var e = 0; e < this._sub_widget_handlers.length; e++) {
                var n = this._sub_widget_handlers[e];
                this._watchSubWidgetForEvent(t, n.event_name, n.handler)
            }
        },
        _watchSubWidgetForEvent: function(t, e, n) {
            t = t.on(e, n);
            this._grabHandlerHandle(t)
        },
        _eventNamesToAlwaysBubble: function() {
            return []
        },
        _initViewBubbling: function() {
            this._widget.bubbles(this._view, this._eventNamesToAlwaysBubble())
        },
        initSubWidgetBubbling: function(t) {
            this._widget.bubbles(t, this._eventNamesToAlwaysBubble())
        },
        _grabHandlerHandle: function(t) {
            this._handler_handles.push(t)
        },
        destruct: function() {
            delete this._widget,
            this._handler_handles.forEach(function(t) {
                t.destruct()
            })
        }
    },
    t
});

;define("Ig/TribalWars/Modules/Common/Widget/AbstractStateReducer", ["module"], function(t) {
    function e() {}
    return e.prototype = {
        newStateFromNothing: function() {
            throw "not implemented"
        },
        newStateFromModels: function(t, e, n) {
            throw "not implemented"
        },
        newStateFromAction: function(t, e, n, o) {
            return "function" == typeof this._action_reducers[e] ? this._action_reducers[e](t, n, o) : t
        },
        _action_reducers: {}
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Widget/AbstractView", ["Ig/TribalWars/Modules/Common/Event/FiresEventsTrait"], function(t) {
    function e() {
        (new t).mixinTo(this)
    }
    return e.prototype = {
        state: null,
        _$root: null,
        _$replaced_target: null,
        init: function(t, e, i) {
            if (this._initStructure(i),
            null === this._$root)
                throw "Expected _initStructure to _setRootElement, but it didn't";
            if (this._initEventPublishing(),
            !t)
                throw "Target for widget is empty";
            (e = e || !1) ? this._$replaced_target = t.replaceWith(this._$root) : this._$root.appendTo(t),
            this._render(null, i),
            this.state = i
        },
        _initStructure: function(t) {
            throw "not implemented"
        },
        _setRootElement: function(t) {
            this._$root = t
        },
        _initEventPublishing: function() {},
        update: function(t) {
            this._render(this.state, t),
            this.state = t
        },
        _render: function(t, e) {
            throw "not implemented"
        },
        destruct: function() {
            this._traits.destruct(),
            null !== this._$replaced_target ? this._$root.replaceWith(this._$replaced_target) : this._$root.html("")
        }
    },
    e
});

;define("Ig/TribalWars/Modules/Common/Widget/AbstractWidget", ["Ig/TribalWars/Modules/Common/Event/FiresEventsTrait"], function(t) {
    function n() {
        (new t).mixinTo(this),
        this._sub_widgets = {}
    }
    return n.propertiesExpectedToBeSetByConstructor = ["_models", "_services", "_view", "_controller", "_state_reducer"],
    n.prototype = {
        _models: null,
        _services: null,
        _view: null,
        _controller: null,
        _state_reducer: null,
        _state: null,
        _sub_widgets: null,
        init: function(t, e, i) {
            i = i || Timing.getCurrentServerTime(),
            this._validateConstruction();
            var s = this._createInitialState(i);
            this._view.init(t, e, s),
            this._controller.init(this._models, this._services, this._view, this),
            this._initSubWidgets(null, s, i),
            this._state = s
        },
        _validateConstruction: function() {
            for (var t = n.propertiesExpectedToBeSetByConstructor, e = 0; e < t.length; e++) {
                var i = t[e];
                if (null === this[i])
                    throw s("this.%1 should be set by the class's constructor!", i)
            }
        },
        _createInitialState: function(t) {
            return this._state_reducer.newStateFromModels(this._state_reducer.newStateFromNothing(), this._models, t)
        },
        update: function(t, e=!1) {
            var i = this.getNextState(t);
            e || this._removeObsoleteSubWidgets(this._state, i),
            this._view.update(i),
            e || (this._initSubWidgets(this._state, i, t),
            this._updateSubWidgets(t)),
            this._state = i
        },
        getNextState: function(t) {
            return this._state_reducer.newStateFromModels(this._state, this._models, t)
        },
        applyActionToState: function(t, e, i) {
            this._state = this._state_reducer.newStateFromAction(this._state, t, e, i)
        },
        _removeObsoleteSubWidgets: function(t, e) {
            var i = this;
            this._getObsoleteSubWidgetKeys(t, e).forEach(function(t) {
                i._removeSubWidget(t)
            })
        },
        _getObsoleteSubWidgetKeys: function(t, e) {
            return []
        },
        _removeSubWidget: function(t) {
            void 0 !== this._sub_widgets[t] && (this._sub_widgets[t].destruct(),
            delete this._sub_widgets[t])
        },
        _initSubWidgets: function(t, e, i) {},
        _addSubWidget: function(t, e, i, n, r) {
            if (void 0 !== this._sub_widgets[t])
                throw s('there is already a subwidget with the key "%1"', t);
            e.init(i, n, r),
            this._controller.watchSubWidgetForEvents(e),
            this._controller.initSubWidgetBubbling(e),
            this._sub_widgets[t] = e
        },
        _updateSubWidgets: function(i) {
            $.each(this._sub_widgets, function(t, e) {
                null !== e && e.update(i)
            })
        },
        destruct: function() {
            var i = this;
            this._controller.destruct(),
            this._traits.destruct(),
            $.each(this._sub_widgets, function(t, e) {
                i._removeSubWidget(t)
            }),
            this._view.destruct()
        }
    },
    n
});

;define("Ig/TribalWars/Modules/Common/Widget/NullController", ["Ig/TribalWars/Modules/Common/Widget/AbstractController"], function(t) {
    function e() {
        t.apply(this)
    }
    return e.prototype = Object.create(t.prototype),
    $.extend(e.prototype, {
        _watchModels: function() {},
        _watchView: function() {},
        _watchSubWidgets: function() {},
        _eventNamesToAlwaysBubble: function() {
            return []
        }
    }),
    e
});

;define("Ig/TribalWars/Modules/UI/AlternatingRows", function() {
    return function() {
        var n = -1;
        this.nextClassName = function() {
            return ++n % 2 ? "row_a" : "row_b"
        }
        ,
        this.reset = function() {
            n = -1
        }
    }
});

;define("Ig/TribalWars/Modules/UI/AnimationUtil", function() {
    return {
        animationend_event_name: {
            WebkitAnimation: "webkitAnimationEnd",
            animation: "animationend"
        }[Modernizr.prefixed("animation")],
        animate: function(n, i, e, t) {
            this.doOnceAnimationEnded(n, t = t || i, function() {
                n.removeClass("animation-" + i),
                "function" == typeof e && e()
            }),
            n.addClass("animation-" + i)
        },
        doOnceAnimationEnded: function(i, e, t) {
            function a(n) {
                n.originalEvent.animationName === e && (i.off(o.animationend_event_name, a),
                t())
            }
            var o = this;
            i.on(this.animationend_event_name, a)
        },
        playSprite: function(t, a, o) {
            var d = Timing.getElapsedTimeSinceLoad()
              , s = (t.css({
                "background-image": "url(" + a.src + ")",
                width: o.display_width,
                height: o.display_height,
                "background-size": o.display_width * a.steps + "px " + o.display_height + "px"
            }),
            o.duration_ms / a.steps);
            !function n() {
                var i = Timing.getElapsedTimeSinceLoad() - d
                  , e = Math.min(Math.floor(i / s), a.steps - 1);
                t.css("background-position", o.display_width * -e),
                i < o.duration_ms ? window.requestAnimationFrame && requestAnimationFrame(n) || setTimeout(n, 16) : "function" == typeof o.whenDone && o.whenDone()
            }()
        }
    }
});

;define("Ig/TribalWars/Modules/UI/FeatureLinkReplacer", function() {
    return function(e, c, n) {
        $(e).filter("[data-feature]").each(function() {
            var e = $(this)
              , t = e.clone()
              , r = (t.removeClass("evt-check-pp"),
            t.attr("href").replace(/([&?])action=/, "$1ajaxaction="));
            t.on("click", function(e) {
                e.preventDefault();
                var e = t.data("feature")
                  , a = t.data("cost");
                Premium.check(e, a, function() {
                    TribalWars.get(r, {}, c, n)
                })
            }),
            e.after(t),
            e.remove()
        })
    }
});

;( () => {
    var i = "Ig/TribalWars/Modules/UI/FormSubmit";
    define(i, [], function() {
        function t() {
            $("body").on("keyup", ".easy-submit", function(t) {
                t.ctrlKey && 13 === t.keyCode && ((t = $(this).data("submit-button")) ? $(this).parents("form").find("input[name=" + t + "]").click() : $(this).parents("form").first().submit())
            })
        }
        return t.prototype = {
            class_name: i
        },
        t
    })
}
)();

;define("Ig/TribalWars/Modules/UI/PositionUtil", function() {
    return {
        calcCenterPoint: function(t) {
            return {
                x: this.calcCenterX(t),
                y: this.calcCenterY(t)
            }
        },
        calcCenterX: function(t) {
            var t = t[0].getBoundingClientRect()
              , n = (t.right - t.left) / 2;
            return Math.floor(window.pageXOffset + t.left + n)
        },
        calcCenterY: function(t) {
            var t = t[0].getBoundingClientRect()
              , n = (t.bottom - t.top) / 2;
            return Math.floor(window.pageYOffset + t.top + n)
        },
        calcTopY: function(t) {
            t = t[0].getBoundingClientRect();
            return window.scrollY + t.top
        }
    }
});

;define("Ig/TribalWars/Modules/UI/WebPushWorld", function() {
    function t() {
        this.addEventHandlers();
        var n = this;
        window.addEventListener("message", function(t) {
            "push_changed" === t.data && ("settings" !== window.game_data.screen ? TribalWars.redirect("settings", {
                mode: "push"
            }) : partialReload(!1, function() {
                n.addEventHandlers()
            }))
        })
    }
    return t.prototype = {
        addEventHandlers: function() {
            var t = this;
            $(".evt-open-webpush").on("click", function() {
                return t.openMaster(),
                !1
            })
        },
        suppressPrompts: function() {
            TribalWars.setSetting("pn_suppress_prompt", 1)
        },
        showPrompt: function() {
            var n;
            0 < parseInt(window.game_data.player.sitter) || "desktop" !== window.game_data.device || TribalWars.getSetting("pn_suppress_prompt") || !("serviceWorker"in navigator) || !1 in Window || (n = this,
            TribalWars.get("settings", {
                ajax: "push_notification_prompt"
            }, function(t) {
                Dialog.show("push_notification_prompt", t.dialog, n.suppressPrompts()),
                n.addEventHandlers()
            }))
        },
        openMaster: function() {
            return TribalWars.get("settings", {
                ajax: "webpush_url"
            }, function(t) {
                window.open(t.url, "_blank", "width=700,height=500,left=200,top=100")
            }),
            !1
        }
    },
    t
});

;class CosmeticNameExecutionContainer {
    executors = [new GlowNameExecutor("js-animation-glow-brown-blue",["glow-animation-brown-blue"]), new GlowNameExecutor("js-animation-glow-brown-red",["glow-animation-brown-red"])];
    currentFrame = 0;
    start() {
        let e = () => {
            this.executors.forEach(e => {
                e.processFrame()
            }
            ),
            this.currentFrame = window.requestAnimationFrame(e)
        }
        ;
        this.currentFrame = window.requestAnimationFrame(e)
    }
    stop() {
        window.cancelAnimationFrame(this.currentFrame)
    }
}

;class GlowNameExecutor {
    speed = 1;
    targetClass;
    giveClass;
    constructor(t, e) {
        this.targetClass = t,
        this.giveClass = e
    }
    processFrame() {
        var e = document.getElementsByClassName(this.targetClass);
        for (let t = 0; t < e.length; t++) {
            var s = e[t]
              , a = s.dataset.step ? Number.parseInt(s.dataset.step) : 0
              , n = (0 === a && this.initContainer(s),
            s.dataset.animationtouch ? Number.parseFloat(s.dataset.animationtouch) : 0)
              , i = performance.now();
            n && i - n < 1e3 * this.speed || (n = this.executeStep(s, a),
            s.dataset.step = n.toString(),
            s.dataset.animationtouch = i.toString())
        }
    }
    executeStep(t, e) {
        t = t.getElementsByTagName("span");
        if (0 === t.length)
            return 0;
        let s = e;
        return t.length <= e && (t[e - 1].classList.remove(...this.giveClass),
        s = 0),
        t[Math.max(0, s - 1)].classList.remove(...this.giveClass),
        t[s].classList.add(...this.giveClass),
        s + 1
    }
    initContainer(s) {
        var t = s.textContent;
        s.textContent = "",
        [...t].forEach(t => {
            var e = document.createElement("span");
            e.textContent = t,
            s.appendChild(e)
        }
        )
    }
}

;/**** initialize constants ****/
TribalWars.constants = {
    "item_types": {
        "1": "Funcionalidade",
        "2": "Consum\u00edvel",
        "3": "Passivo",
        "4": "Ativ\u00e1vel"
    },
    "item_categories": {
        "7": "Cosm\u00e9ticos",
        "5": "Itens de aldeia",
        "6": "Itens de recrutamento",
        "8": "Itens de rel\u00edquia",
        "4": "Itens de unidade",
        "3": "Itens do evento",
        "2": "Pacotes de recurso",
        "1": "Premium"
    },
    "item_tags": {
        "rarity": ["Nenhum", "Comum", "Incomum", "Raro", "Lend\u00e1rio"],
        "use_type": ["Nenhum", "Consum\u00edvel", "Presente\u00e1vel"]
    }
};
