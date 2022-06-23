/* eslint-disable */
/*
dester builds:
index.ts
*/
var e = String, r = Object.prototype, a = r => {
    for (var a, t = ++r[0], s = ""; t > 0; ) a = (t - 1) % 26, s = e.fromCharCode(97 + a) + s, 
    t = (t - a) / 26 | 0;
    return s;
}, t = /^0\d|\D/, s = e => '"' + e + '"', n = (e, a, t, s) => {
    var n = "{", i = "";
    for (var o in e) r.hasOwnProperty.call(e, o) && (n += i + c(o, a, t, s) + ":" + c(e[o], a, t, s), 
    i = ",");
    return n + "}";
}, c = (e, i, o, u) => {
    var l = i.get(e);
    if (l) return l;
    switch (i.set(e, a(o)), l = r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + c("" + e, i, o, u);

      case "Object":
        return n(e, i, o, u);

      case "Function":
        return "Z" + c("" + (u && u(e) || e.name), i, o, u);

      case "Boolean":
        return "B" + +e;

      case "Symbol":
        return "H" + c(e.toString().slice(7, -1), i, o, u);

      case "Error":
        var f = n(e, i, o, u).slice(0, -1);
        return f.length > 1 && (f += ","), "E" + e.name.slice(0, 2) + f + c("message", i, o, u) + ":" + c(e.message, i, o, u) + "}";

      case "Number":
        return e === +e ? e < 0 ? "-" + c(-e, i, o, u) : "" + e : "N" + c(+e, i, o, u);

      case "Date":
        return "D" + c(e.getTime(), i, o, u);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + c(+e, i, o, u) : "S" + c("" + e, i, o, u);

      case "RegExp":
        return "R" + c(e.source + "," + e.flags, i, o, u);

      case "Array":
        var h, b = "[", v = "", y = 0;
        for (var A in e) {
            if (t.test(A)) b += v + c(A, i, o, u) + ":", v = ""; else if ((h = +A) > y++) for (;y <= h; y++) b += ",";
            b += v + c(e[A], i, o, u), v = ",";
        }
        if ((h = e.length) > y) for (;y <= h; y++) b += v, v = ",";
        return b + "]";

      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
        return "" + (l[0] + l[4] + l[5]) + e.length + s(e);

      case "Map":
        var k = [ "M(", i, o, u, "" ];
        return e.forEach((function(e, r) {
            this[0] += this[4] + c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]), 
            this[4] = ",";
        }), k), k[0] + ")";

      case "Set":
        var g = [ "T(", i, o, u, "" ];
        return e.forEach((function(e) {
            this[0] += this[4] + c(e, this[1], this[2], this[3]), this[4] = ",";
        }), g), g[0] + ")";

      case "ArrayBuffer":
      case "DataView":
        return "A" + l[0] + (e = new Int8Array("D" === l[0] ? e.buffer : e)).length + s(e);

      default:
        return console.warn("cyclepack:", e), n(e, i, o, u);
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), o = (e, r) => c(e, new Map(i), [ 17 ], r), u = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, o, f, b, v, y = [], A = {
        v: y,
        t: "[",
        i: 0
    }, k = [ A ], g = y, p = [], w = e.length - 1, E = -1; E++ < w; ) {
        switch (f = !0, v = e[E]) {
          case "B":
            o = new Boolean(+e[++E]);
            break;

          case "E":
            switch (e[++E] + e[++E]) {
              case "Ev":
                o = EvalError;
                break;

              case "Ra":
                o = RangeError;
                break;

              case "Re":
                o = ReferenceError;
                break;

              case "Sy":
                o = SyntaxError;
                break;

              case "Ty":
                o = TypeError;
                break;

              case "UR":
                o = URIError;
                break;

              default:
                o = Error;
            }
            c = {
                v: o = new o(""),
                t: e[++E]
            };
            break;

          case "I":
          case "U":
          case "F":
            switch (e[++E] + e[++E]) {
              case "Ar":
                o = Int8Array;
                break;

              case "8A":
                o = Uint8Array;
                break;

              case "8C":
                o = Uint8ClampedArray;
                break;

              case "6A":
                o = Int16Array;
                break;

              case "16":
                o = Uint16Array;
                break;

              case "2A":
                o = Int32Array;
                break;

              case "32":
                o = Uint32Array;
                break;

              case "t3":
                o = Float32Array;
                break;

              case "t6":
                o = Float64Array;
                break;

              default:
                throw v;
            }
            for (v = ""; '"' !== e[++E]; ) v += e[E];
            o = new o(+v);
            for (var d = 0, S = ""; ;) if ("," === e[++E] || '"' === e[E]) {
                if (o[d++] = +S, S = "", '"' === e[E]) break;
            } else S += e[E];
            break;

          case "A":
            for (v = e[++E], o = ""; '"' !== e[++E]; ) o += e[E];
            o = new Int8Array(+o);
            for (var m = 0, I = ""; ;) if ("," === e[++E] || '"' === e[E]) {
                if (o[m++] = +I, I = "", '"' === e[E]) break;
            } else I += e[E];
            o = o.buffer, "D" === v && (o = new DataView(o));
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
            p.push(v);
            continue;

          case '"':
            for (var R = !1; E++ < w && (v += e[E], R || '"' !== e[E]); R = !R && "\\" === e[E]) ;
            o = JSON.parse(v);
            break;

          case "{":
            c = {
                v: o = {},
                t: v
            };
            break;

          case "[":
            c = {
                v: o = [],
                t: v,
                i: 0
            };
            break;

          case "T":
            c = {
                v: o = new Set,
                t: v
            }, E++;
            break;

          case "M":
            c = {
                v: o = new Map,
                t: v
            }, E++;
            break;

          case "]":
          case "}":
          case ")":
            k.pop(), o = A.v, A = k[k.length - 1];
            continue;

          case ",":
            g = y, "[" === A.t && (A.v.length = ++A.i);
            continue;

          case ":":
            g = o, "[" === A.t && (A.v.length = A.i--);
            continue;

          default:
            for (;E++ < w && !l.test(e[E]) ? v += e[E] : (E--, 0); ) ;
            o = u.test(v[0]) ? (f = !1, s[v]) : +v;
        }
        if (p.length) {
            for (v = o, b = []; p.length; ) b.push(o = h(p.pop(), o, r));
            for (;b.length; ) s[a(t)] = b.pop();
            f && (s[a(t)] = v, f = !1);
        }
        f && (s[a(t)] = o), "[" === A.t ? g === y ? A.v[A.i] = o : (A.v[g] = o, g = y) : "T" === A.t ? A.v.add(o) : g !== y && ("{" === A.t ? A.v[g] = o : A.v.set(g, o), 
        g = y), c && (k.push(A = c), c = null);
    }
    return y[0];
}, h = (r, a, t) => {
    switch (r) {
      case "-":
        return - +a;

      case "Q":
        return "" + a;

      case "L":
        return BigInt(a);

      case "D":
        return new Date(+a);

      case "N":
        return new Number(a);

      case "H":
        return Symbol(a);

      case "S":
        return new e(a);

      case "R":
        return new RegExp(a.slice(0, r = a.lastIndexOf(",")), a.slice(r + 1));

      default:
        return t && t(a) || "%" + a + "%";
    }
}, b = {
    build: o,
    parse: f
};

export { o as build, b as default, f as parse };
