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
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return "Z" + n("" + (u && u(c) || c.name), i, o, u, l);

      case "Boolean":
        return "P" + +c;

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
        var b, y = "[", g = "", A = 0;
        for (var k in c) {
            if (a.test(k)) y += g + n(k, i, o, u, l) + ":", g = ""; else if ((b = +k) > A++) for (;A <= b; A++) y += ",";
            y += g + n(c[k], i, o, u, l), g = ",";
        }
        if ((b = c.length) > A) for (;A <= b; A++) y += g, g = ",";
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
      case "BigInt64Array":
      case "BigUint64Array":
        return "" + (f[0] + f[4] + f[5]) + c.length + t(c, l);

      case "Map":
        var v = [ "M(", i, o, u, l, "" ];
        return c.forEach((function(e, r) {
            this[0] += this[5] + n(r, this[1], this[2], this[3], this[4]) + ":" + n(e, this[1], this[2], this[3], this[4]), 
            this[5] = ",";
        }), v), v[0] + ")";

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
    for (var i, l, h, b, y, g = [], A = {
        v: g,
        t: "[",
        i: 0
    }, k = [ A ], v = g, p = [], w = e.length - 1, E = -1; E++ < w; ) {
        switch (h = !0, y = e[E]) {
          case "P":
            l = new Boolean(+e[++E]);
            break;

          case "E":
            switch (e[++E] + e[++E]) {
              case "Ag":
                l = AggregateError;
                break;

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
                t: e[++E]
            };
            break;

          case "I":
          case "U":
          case "F":
            switch (e[++E] + e[++E]) {
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
            for (y = ""; '"' !== e[++E]; ) y += e[E];
            l = new l(+y);
            for (var S = 0, I = ""; ;) if ("," === e[++E] || '"' === e[E]) {
                if (l[S++] = +I, I = "", '"' === e[E]) break;
            } else I += e[E];
            break;

          case "B":
            switch (e[++E] + e[++E]) {
              case "nt":
                l = BigInt64Array;
                break;

              case "in":
                l = BigUint64Array;
                break;

              default:
                throw y;
            }
            for (y = ""; '"' !== e[++E]; ) y += e[E];
            l = new l(+y);
            for (var d = 0, m = ""; ;) if ("," === e[++E] || '"' === e[E]) {
                if (l[d++] = BigInt(m), m = "", '"' === e[E]) break;
            } else m += e[E];
            break;

          case "A":
            for (l = "", y = e[++E]; '"' !== e[++E]; ) l += e[E];
            l = new Int8Array(+l);
            for (var U = 0, B = ""; ;) if ("," === e[++E] || '"' === e[E]) {
                if (l[U++] = +B, B = "", '"' === e[E]) break;
            } else B += e[E];
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
            for (var R = !1; E++ < w && (y += e[E], R || '"' !== e[E]); R = !R && "\\" === e[E]) ;
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
            }, E++;
            break;

          case "M":
            i = {
                v: l = new Map,
                t: y
            }, E++;
            break;

          case "]":
          case "}":
          case ")":
            k.pop(), l = A.v, A = k[k.length - 1];
            continue;

          case ",":
            v = g, "[" === A.t && (A.v.length = ++A.i);
            continue;

          case ":":
            v = l, "[" === A.t && (A.v.length = A.i--);
            continue;

          default:
            for (;E++ < w && !u.test(e[E]) ? y += e[E] : (E--, 0); ) ;
            l = o.test(y[0]) ? (h = !1, s[y]) : +y;
        }
        if (p.length) {
            for (y = l, b = []; p.length; ) b.push(l = f(p.pop(), l, a));
            for (;b.length; ) s[r(t)] = b.pop();
            h && (s[r(t)] = y, h = !1);
        }
        h && (s[r(t)] = l), "[" === A.t ? v === g ? A.v[A.i] = l : (A.v[v] = l, v = g) : "T" === A.t ? A.v.add(l) : v !== g && ("{" === A.t ? A.v[v] = l : A.v.set(v, l), 
        v = g), i && (k.push(A = i), i = null);
    }
    return g[0];
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
