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
    for (var u in e) r.hasOwnProperty.call(e, u) && (n += i + c(u, a, t, s) + ":" + c(e[u], a, t, s), 
    i = ",");
    return n + "}";
}, c = (e, i, u, o) => {
    var l = i.get(e);
    if (l) return l;
    switch (i.set(e, a(u)), r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + c("" + e, i, u, o);

      case "Object":
        return n(e, i, u, o);

      case "Function":
        return "F" + c("" + (o && o(e) || e.name), i, u, o);

      case "Boolean":
        return "B" + +e;

      case "Symbol":
        return "H" + c(e.toString().slice(7, -1), i, u, o);

      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        var f = n(e, i, u, o).slice(0, -1);
        return f.length > 1 && (f += ","), "E" + e.name.slice(0, 2) + f + c("message", i, u, o) + ":" + c(e.message, i, u, o) + "}";

      case "Number":
        return e === +e ? e < 0 ? "-" + c(-e, i, u, o) : "" + e : "N" + c(+e, i, u, o);

      case "Date":
        return "D" + c(e.getTime(), i, u, o);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + c(+e, i, u, o) : "S" + c("" + e, i, u, o);

      case "RegExp":
        return "R" + c(e.source + "," + e.flags, i, u, o);

      case "Array":
        var h, v = "[", y = "", b = 0;
        for (var A in e) {
            if (t.test(A)) v += y + c(A, i, u, o) + ":", y = ""; else if ((h = +A) > b++) for (;b <= h; b++) v += ",";
            v += y + c(e[A], i, u, o), y = ",";
        }
        if ((h = e.length) > b) for (;b <= h; b++) v += y, y = ",";
        return v + "]";

      case "Int8Array":
        return "I8A" + s(e);

      case "Uint8Array":
        return "U8A" + s(e);

      case "Uint8ClampedArray":
        return "U8C" + s(e);

      case "Int16Array":
        return "I16" + s(e);

      case "Uint16Array":
        return "U16" + s(e);

      case "Int32Array":
        return "I32" + s(e);

      case "Uint32Array":
        return "U32" + s(e);

      case "Float32Array":
        return "Y32" + s(e);

      case "Float64Array":
        return "Y64" + s(e);

      case "Map":
        var E = [ "M(", i, u, o, "" ];
        return e.forEach((function(e, r) {
            this[0] += this[4] + c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]), 
            this[4] = ",";
        }), E), E[0] + ")";

      case "Set":
        var p = [ "T(", i, u, o, "" ];
        return e.forEach((function(e) {
            this[0] += this[4] + c(e, this[1], this[2], this[3]), this[4] = ",";
        }), p), p[0] + ")";

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn("cyclepack:", e), n(e, i, u, o);
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), u = (e, r) => c(e, new Map(i), [ 17 ], r), o = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, u, f, v, y = [], b = {
        v: y,
        t: "[",
        i: 0
    }, A = [ b ], E = y, p = [], w = e.length - 1, g = -1; g++ < w; ) {
        switch (f = !0, v = e[g]) {
          case "B":
            u = new Boolean(+e[++g]);
            break;

          case "I":
          case "U":
          case "Y":
            var k = void 0;
            switch (v += e[++g] + e[++g]) {
              case "I8A":
                k = Int8Array;
                break;

              case "U8A":
                k = Uint8Array;
                break;

              case "U8C":
                k = Uint8ClampedArray;
                break;

              case "I16":
                k = Int16Array;
                break;

              case "U16":
                k = Uint16Array;
                break;

              case "I32":
                k = Int32Array;
                break;

              case "U32":
                k = Uint32Array;
                break;

              case "Y32":
                k = Float32Array;
                break;

              case "Y64":
                k = Float64Array;
                break;

              default:
                throw v;
            }
            u = new k(e.slice(g += 2, g = e.indexOf('"', ++g)).split(","));
            break;

          case "E":
            var U = void 0;
            switch (v += e[++g] + e[++g]) {
              case "EEv":
                U = EvalError;
                break;

              case "ERa":
                U = RangeError;
                break;

              case "ERe":
                U = ReferenceError;
                break;

              case "ESy":
                U = SyntaxError;
                break;

              case "ETy":
                U = TypeError;
                break;

              case "EUR":
                U = URIError;
                break;

              default:
                U = Error;
            }
            c = {
                v: u = new U(""),
                t: e[++g]
            };
            break;

          case "A":
            var d = "B" !== e[++g];
            u = new Uint8Array(e.slice(g += 2, g = e.indexOf('"', ++g)).split(",")).buffer, 
            d && (u = new DataView(u));
            break;

          case "L":
          case "D":
          case "N":
          case "-":
          case "Q":
          case "H":
          case "S":
          case "R":
          case "F":
            p.push(v);
            continue;

          case '"':
            for (var I = !1; g++ < w && (v += e[g], I || '"' !== e[g]); I = !I && "\\" === e[g]) ;
            u = JSON.parse(v);
            break;

          case "{":
            c = {
                v: u = {},
                t: v
            };
            break;

          case "[":
            c = {
                v: u = [],
                t: v,
                i: 0
            };
            break;

          case "T":
            c = {
                v: u = new Set,
                t: v
            }, g++;
            break;

          case "M":
            c = {
                v: u = new Map,
                t: v
            }, g++;
            break;

          case "]":
          case "}":
          case ")":
            A.pop(), u = b.v, b = A[A.length - 1];
            continue;

          case ",":
            E = y, "[" === b.t && (b.v.length = ++b.i);
            continue;

          case ":":
            E = u, "[" === b.t && (b.v.length = b.i--);
            continue;

          default:
            for (;g++ < w && !l.test(e[g]) ? v += e[g] : (g--, 0); ) ;
            u = o.test(v[0]) ? (f = !1, s[v]) : +v;
        }
        if (p.length) {
            for (var S = u, R = []; p.length; ) R.push(u = h(p.pop(), u, r));
            for (;R.length; ) s[a(t)] = R.pop();
            f && (s[a(t)] = S, f = !1);
        }
        f && (s[a(t)] = u), "[" === b.t ? E === y ? b.v[b.i] = u : (b.v[E] = u, E = y) : "T" === b.t ? b.v.add(u) : E !== y && ("{" === b.t ? b.v[E] = u : b.v.set(E, u), 
        E = y), c && (A.push(b = c), c = null);
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
}, v = {
    build: u,
    parse: f
};

export { u as build, v as default, f as parse };
