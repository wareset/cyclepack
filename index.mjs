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
    var n = "";
    for (var i in e) r.hasOwnProperty.call(e, i) && (n += c(i, a, t, s) + ":" + c(e[i], a, t, s) + ",");
    return n;
}, c = (e, i, u, o) => {
    var l = i.get(e);
    if (l) return l;
    switch (i.set(e, a(u)), r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + c("" + e, i, u, o);

      case "Object":
        return "{" + n(e, i, u, o).slice(0, -1) + "}";

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
        return "E" + e.name.slice(0, 2) + "{" + n(e, i, u, o) + c("message", i, u, o) + ":" + c(e.message, i, u, o) + "}";

      case "Number":
        return e === +e ? e < 0 ? "-" + c(-e, i, u, o) : "" + e : "N" + c(+e, i, u, o);

      case "Date":
        return "D" + c(e.getTime(), i, u, o);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + c(+e, i, u, o) : "S" + c("" + e, i, u, o);

      case "RegExp":
        return "R" + c(e.source + "," + e.flags, i, u, o);

      case "Array":
        var f, v = "", b = 0;
        for (var y in e) {
            if (t.test(y)) v += c(y, i, u, o) + ":"; else if ((f = +y) > b++) for (;b <= f; b++) v += ",";
            v += c(e[y], i, u, o) + ",";
        }
        if ((f = e.length) > b) for (;b <= f; b++) v += ",";
        return "[" + v.slice(0, -1) + "]";

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
        var h = [ "", i, u, o ];
        return e.forEach((function(e, r) {
            this[0] += c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]) + ",";
        }), h), "M(" + h[0].slice(0, -1) + ")";

      case "Set":
        var A = [ "", i, u, o ];
        return e.forEach((function(e) {
            this[0] += c(e, this[1], this[2], this[3]) + ",";
        }), A), "T(" + A[0].slice(0, -1) + ")";

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn(e), "l";
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), u = (e, r) => c(e, new Map(i), [ 17 ], r), o = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, u, f, b, y = [], h = {
        v: y,
        t: "[",
        i: 0
    }, A = [ h ], E = y, p = [], w = e.length - 1, g = -1; g++ < w; ) {
        switch (f = !0, b = e[g]) {
          case "B":
            u = new Boolean(+e[++g]);
            break;

          case "I":
          case "U":
          case "Y":
            var k = void 0;
            switch (b += e[++g] + e[++g]) {
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
                throw b;
            }
            u = new k(e.slice(g += 2, g = e.indexOf('"', ++g)).split(","));
            break;

          case "E":
            var U = void 0;
            switch (b += e[++g] + e[++g]) {
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
            p.push(b);
            continue;

          case '"':
            for (var I = !1; g++ < w && (b += e[g], I || '"' !== e[g]); I = !I && "\\" === e[g]) ;
            u = JSON.parse(b);
            break;

          case "{":
            c = {
                v: u = {},
                t: b
            };
            break;

          case "[":
            c = {
                v: u = [],
                t: b,
                i: 0
            };
            break;

          case "T":
            c = {
                v: u = new Set,
                t: b
            }, g++;
            break;

          case "M":
            c = {
                v: u = new Map,
                t: b
            }, g++;
            break;

          case "]":
          case "}":
          case ")":
            A.pop(), u = h.v, h = A[A.length - 1];
            continue;

          case ",":
            E = y, "[" === h.t && (h.v.length = ++h.i);
            continue;

          case ":":
            E = u, "[" === h.t && (h.v.length = h.i--);
            continue;

          default:
            for (;g++ < w && !l.test(e[g]) ? b += e[g] : (g--, 0); ) ;
            u = o.test(b[0]) ? (f = !1, s[b]) : +b;
        }
        if (p.length) {
            for (var S = u, R = []; p.length; ) R.push(u = v(p.pop(), u, r));
            for (;R.length; ) s[a(t)] = R.pop();
            f && (s[a(t)] = S, f = !1);
        }
        f && (s[a(t)] = u), "[" === h.t ? E === y ? h.v[h.i] = u : (h.v[E] = u, E = y) : "T" === h.t ? h.v.add(u) : E !== y && ("{" === h.t ? h.v[E] = u : h.v.set(E, u), 
        E = y), c && (A.push(h = c), c = null);
    }
    return y[0];
}, v = (r, a, t) => {
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
    build: u,
    parse: f
};

export { u as build, b as default, f as parse };
