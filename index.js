/* eslint-disable */
/*
dester builds:
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = String, r = Object.prototype, a = r => {
    for (var a, t = ++r[0], s = ""; t > 0; ) a = (t - 1) % 26, s = e.fromCharCode(97 + a) + s, 
    t = (t - a) / 26 | 0;
    return s;
}, t = /^0\d|\D/, s = e => '"' + e + '"', n = (e, a, t, s) => {
    var n = "";
    for (var i in e) r.hasOwnProperty.call(e, i) && (n += c(i, a, t, s) + ":" + c(e[i], a, t, s) + ",");
    return n;
}, c = (e, i, o, u) => {
    var l = i.get(e);
    if (l) return l;
    switch (i.set(e, a(o)), r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + c("" + e, i, o, u);

      case "Object":
        return "{" + n(e, i, o, u).slice(0, -1) + "}";

      case "Function":
        return "F" + c("" + (u && u(e) || e.name), i, o, u);

      case "Boolean":
        return "B" + +e;

      case "Symbol":
        return "H" + c(e.toString().slice(7, -1), i, o, u);

      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        return "E" + e.name.slice(0, 2) + "{" + n(e, i, o, u) + c("message", i, o, u) + ":" + c(e.message, i, o, u) + "}";

      case "Number":
        return e === +e ? e < 0 ? "-" + c(-e, i, o, u) : "" + e : "N" + c(+e, i, o, u);

      case "Date":
        return "D" + c(e.getTime(), i, o, u);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + c(+e, i, o, u) : "S" + c("" + e, i, o, u);

      case "RegExp":
        return "R" + c(e.source + "," + e.flags, i, o, u);

      case "Array":
        var f, v = "", b = 0;
        for (var y in e) {
            if (t.test(y)) v += c(y, i, o, u) + ":"; else if ((f = +y) > b++) for (;b <= f; b++) v += ",";
            v += c(e[y], i, o, u) + ",";
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
        var p = [ "", i, o, u ];
        return e.forEach((function(e, r) {
            this[0] += c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]) + ",";
        }), p), "M(" + p[0].slice(0, -1) + ")";

      case "Set":
        var h = [ "", i, o, u ];
        return e.forEach((function(e) {
            this[0] += c(e, this[1], this[2], this[3]) + ",";
        }), h), "T(" + h[0].slice(0, -1) + ")";

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn("cyclepack:", e), "{" + n(e, i, o, u).slice(0, -1) + "}";
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), o = (e, r) => c(e, new Map(i), [ 17 ], r), u = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, o, f, b, y = [], p = {
        v: y,
        t: "[",
        i: 0
    }, h = [ p ], A = y, E = [], w = e.length - 1, k = -1; k++ < w; ) {
        switch (f = !0, b = e[k]) {
          case "B":
            o = new Boolean(+e[++k]);
            break;

          case "I":
          case "U":
          case "Y":
            var g = void 0;
            switch (b += e[++k] + e[++k]) {
              case "I8A":
                g = Int8Array;
                break;

              case "U8A":
                g = Uint8Array;
                break;

              case "U8C":
                g = Uint8ClampedArray;
                break;

              case "I16":
                g = Int16Array;
                break;

              case "U16":
                g = Uint16Array;
                break;

              case "I32":
                g = Int32Array;
                break;

              case "U32":
                g = Uint32Array;
                break;

              case "Y32":
                g = Float32Array;
                break;

              case "Y64":
                g = Float64Array;
                break;

              default:
                throw b;
            }
            o = new g(e.slice(k += 2, k = e.indexOf('"', ++k)).split(","));
            break;

          case "E":
            var U = void 0;
            switch (b += e[++k] + e[++k]) {
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
                v: o = new U(""),
                t: e[++k]
            };
            break;

          case "A":
            var d = "B" !== e[++k];
            o = new Uint8Array(e.slice(k += 2, k = e.indexOf('"', ++k)).split(",")).buffer, 
            d && (o = new DataView(o));
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
            E.push(b);
            continue;

          case '"':
            for (var I = !1; k++ < w && (b += e[k], I || '"' !== e[k]); I = !I && "\\" === e[k]) ;
            o = JSON.parse(b);
            break;

          case "{":
            c = {
                v: o = {},
                t: b
            };
            break;

          case "[":
            c = {
                v: o = [],
                t: b,
                i: 0
            };
            break;

          case "T":
            c = {
                v: o = new Set,
                t: b
            }, k++;
            break;

          case "M":
            c = {
                v: o = new Map,
                t: b
            }, k++;
            break;

          case "]":
          case "}":
          case ")":
            h.pop(), o = p.v, p = h[h.length - 1];
            continue;

          case ",":
            A = y, "[" === p.t && (p.v.length = ++p.i);
            continue;

          case ":":
            A = o, "[" === p.t && (p.v.length = p.i--);
            continue;

          default:
            for (;k++ < w && !l.test(e[k]) ? b += e[k] : (k--, 0); ) ;
            o = u.test(b[0]) ? (f = !1, s[b]) : +b;
        }
        if (E.length) {
            for (var S = o, R = []; E.length; ) R.push(o = v(E.pop(), o, r));
            for (;R.length; ) s[a(t)] = R.pop();
            f && (s[a(t)] = S, f = !1);
        }
        f && (s[a(t)] = o), "[" === p.t ? A === y ? p.v[p.i] = o : (p.v[A] = o, A = y) : "T" === p.t ? p.v.add(o) : A !== y && ("{" === p.t ? p.v[A] = o : p.v.set(A, o), 
        A = y), c && (h.push(p = c), c = null);
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
    build: o,
    parse: f
};

exports.build = o, exports.default = b, exports.parse = f;
