/* eslint-disable */
/*
dester builds:
index.ts
*/
var e = Object.prototype, r = e => {
    for (var r, a = ++e[0], t = ""; a > 0; ) r = (a - 1) % 26, t = String.fromCharCode(97 + r) + t, 
    a = (a - r) / 26 | 0;
    return t;
}, a = /^0\d|\D/, t = (e, r) => r ? '\\"' + e + '\\"' : '"' + e + '"', s = (r, a, t, s, c) => {
    var i = "{", o = "";
    for (var u in r) e.hasOwnProperty.call(r, u) && (i += o + n(u, a, t, s, c) + ":" + n(r[u], a, t, s, c), 
    o = ",");
    return i + "}";
}, n = (c, i, o, u, l) => {
    var f = i.get(c);
    if (f) return f;
    switch (i.set(c, r(o)), f = e.toString.call(c).slice(8, -1)) {
      case "BigInt":
        return "L" + n("" + c, i, o, u, l);

      case "Object":
        return s(c, i, o, u, l);

      case "Function":
        return "Z" + n("" + (u && u(c) || c.name), i, o, u, l);

      case "Boolean":
        return "B" + +c;

      case "Symbol":
        return "H" + n(c.toString().slice(7, -1), i, o, u, l);

      case "Error":
        var h = s(c, i, o, u, l).slice(0, -1);
        return h.length > 1 && (h += ","), "E" + c.name.slice(0, 2) + h + n("message", i, o, u, l) + ":" + n(c.message, i, o, u, l) + "}";

      case "Number":
        return c === +c ? c < 0 ? "-" + n(-c, i, o, u, l) : "" + c : "N" + n(+c, i, o, u, l);

      case "Date":
        return "D" + n(c.getTime(), i, o, u, l);

      case "String":
        return c === "" + c ? c !== "" + +c ? ((e, r) => (e = JSON.stringify(e), r ? JSON.stringify(e).slice(1, -1) : e))(c, l) : "Q" + n(+c, i, o, u, l) : "S" + n("" + c, i, o, u, l);

      case "RegExp":
        return "R" + n(c.source + "," + c.flags, i, o, u, l);

      case "Array":
        var b, y = "[", v = "", k = 0;
        for (var g in c) {
            if (a.test(g)) y += v + n(g, i, o, u, l) + ":", v = ""; else if ((b = +g) > k++) for (;k <= b; k++) y += ",";
            y += v + n(c[g], i, o, u, l), v = ",";
        }
        if ((b = c.length) > k) for (;k <= b; k++) y += v, v = ",";
        return y + "]";

      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
        return "" + (f[0] + f[4] + f[5]) + c.length + t(c, l);

      case "Map":
        var A = [ "M(", i, o, u, l, "" ];
        return c.forEach((function(e, r) {
            this[0] += this[5] + n(r, this[1], this[2], this[3], this[4]) + ":" + n(e, this[1], this[2], this[3], this[4]), 
            this[5] = ",";
        }), A), A[0] + ")";

      case "Set":
        var p = [ "T(", i, o, u, l, "" ];
        return c.forEach((function(e) {
            this[0] += this[5] + n(e, this[1], this[2], this[3], this[4]), this[5] = ",";
        }), p), p[0] + ")";

      case "ArrayBuffer":
      case "DataView":
        return "A" + f[0] + (c = new Int8Array("D" === f[0] ? c.buffer : c)).length + t(c, l);

      default:
        return console.warn("cyclepack:", c), s(c, i, o, u, l);
    }
}, c = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, a) => [ e, r([ a ]) ])), i = (e, r, a) => (a ? '"' : "") + n(e, new Map(c), [ 17 ], r, a) + (a ? '"' : ""), o = /[a-z]/, u = /["/{}[\]():,]/, l = (e, a) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[c[n][1]] = c[n][0];
    for (var i, l, h, b, y, v = [], k = {
        v: v,
        t: "[",
        i: 0
    }, g = [ k ], A = v, p = [], w = e.length - 1, S = -1; S++ < w; ) {
        switch (h = !0, y = e[S]) {
          case "B":
            l = new Boolean(+e[++S]);
            break;

          case "E":
            switch (e[++S] + e[++S]) {
              case "Ev":
                l = EvalError;
                break;

              case "Ra":
                l = RangeError;
                break;

              case "Re":
                l = ReferenceError;
                break;

              case "Sy":
                l = SyntaxError;
                break;

              case "Ty":
                l = TypeError;
                break;

              case "UR":
                l = URIError;
                break;

              default:
                l = Error;
            }
            i = {
                v: l = new l(""),
                t: e[++S]
            };
            break;

          case "I":
          case "U":
          case "F":
            switch (e[++S] + e[++S]) {
              case "Ar":
                l = Int8Array;
                break;

              case "8A":
                l = Uint8Array;
                break;

              case "8C":
                l = Uint8ClampedArray;
                break;

              case "6A":
                l = Int16Array;
                break;

              case "16":
                l = Uint16Array;
                break;

              case "2A":
                l = Int32Array;
                break;

              case "32":
                l = Uint32Array;
                break;

              case "t3":
                l = Float32Array;
                break;

              case "t6":
                l = Float64Array;
                break;

              default:
                throw y;
            }
            for (y = ""; '"' !== e[++S]; ) y += e[S];
            l = new l(+y);
            for (var E = 0, d = ""; ;) if ("," === e[++S] || '"' === e[S]) {
                if (l[E++] = +d, d = "", '"' === e[S]) break;
            } else d += e[S];
            break;

          case "A":
            for (y = e[++S], l = ""; '"' !== e[++S]; ) l += e[S];
            l = new Int8Array(+l);
            for (var m = 0, I = ""; ;) if ("," === e[++S] || '"' === e[S]) {
                if (l[m++] = +I, I = "", '"' === e[S]) break;
            } else I += e[S];
            l = l.buffer, "D" === y && (l = new DataView(l));
            break;

          case "L":
          case "D":
          case "N":
          case "-":
          case "Q":
          case "H":
          case "S":
          case "R":
          case "Z":
            p.push(y);
            continue;

          case '"':
            for (var R = !1; S++ < w && (y += e[S], R || '"' !== e[S]); R = !R && "\\" === e[S]) ;
            l = JSON.parse(y);
            break;

          case "{":
            i = {
                v: l = {},
                t: y
            };
            break;

          case "[":
            i = {
                v: l = [],
                t: y,
                i: 0
            };
            break;

          case "T":
            i = {
                v: l = new Set,
                t: y
            }, S++;
            break;

          case "M":
            i = {
                v: l = new Map,
                t: y
            }, S++;
            break;

          case "]":
          case "}":
          case ")":
            g.pop(), l = k.v, k = g[g.length - 1];
            continue;

          case ",":
            A = v, "[" === k.t && (k.v.length = ++k.i);
            continue;

          case ":":
            A = l, "[" === k.t && (k.v.length = k.i--);
            continue;

          default:
            for (;S++ < w && !u.test(e[S]) ? y += e[S] : (S--, 0); ) ;
            l = o.test(y[0]) ? (h = !1, s[y]) : +y;
        }
        if (p.length) {
            for (y = l, b = []; p.length; ) b.push(l = f(p.pop(), l, a));
            for (;b.length; ) s[r(t)] = b.pop();
            h && (s[r(t)] = y, h = !1);
        }
        h && (s[r(t)] = l), "[" === k.t ? A === v ? k.v[k.i] = l : (k.v[A] = l, A = v) : "T" === k.t ? k.v.add(l) : A !== v && ("{" === k.t ? k.v[A] = l : k.v.set(A, l), 
        A = v), i && (g.push(k = i), i = null);
    }
    return v[0];
}, f = (e, r, a) => {
    switch (e) {
      case "-":
        return - +r;

      case "Q":
        return "" + r;

      case "L":
        return BigInt(r);

      case "H":
        return Symbol(r);

      case "D":
        return new Date(+r);

      case "N":
        return new Number(r);

      case "S":
        return new String(r);

      case "R":
        return new RegExp(r.slice(0, e = r.lastIndexOf(",")), r.slice(e + 1));

      default:
        return a && a(r) || "%" + r + "%";
    }
}, h = {
    pack: i,
    unpack: l
};

export { h as default, i as pack, l as unpack };
