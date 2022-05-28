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
        var h, v = "[", b = "", y = 0;
        for (var p in e) {
            if (t.test(p)) v += b + c(p, i, u, o) + ":", b = ""; else if ((h = +p) > y++) for (;y <= h; y++) v += ",";
            v += b + c(e[p], i, u, o), b = ",";
        }
        if ((h = e.length) > y) for (;y <= h; y++) v += b, b = ",";
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
        var A = [ "M(", i, u, o, "" ];
        return e.forEach((function(e, r) {
            this[0] += this[4] + c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]), 
            this[4] = ",";
        }), A), A[0] + ")";

      case "Set":
        var w = [ "T(", i, u, o, "" ];
        return e.forEach((function(e) {
            this[0] += this[4] + c(e, this[1], this[2], this[3]), this[4] = ",";
        }), w), w[0] + ")";

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn("cyclepack:", e), n(e, i, u, o);
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), u = (e, r) => c(e, new Map(i), [ 17 ], r), o = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, u, f, v, b = [], y = {
        v: b,
        t: "[",
        i: 0
    }, p = [ y ], A = b, w = [], k = e.length - 1, g = -1; g++ < k; ) {
        switch (f = !0, v = e[g]) {
          case "B":
            u = new Boolean(+e[++g]);
            break;

          case "I":
          case "U":
          case "Y":
            var d = void 0;
            switch (v += e[++g] + e[++g]) {
              case "I8A":
                d = Int8Array;
                break;

              case "U8A":
                d = Uint8Array;
                break;

              case "U8C":
                d = Uint8ClampedArray;
                break;

              case "I16":
                d = Int16Array;
                break;

              case "U16":
                d = Uint16Array;
                break;

              case "I32":
                d = Int32Array;
                break;

              case "U32":
                d = Uint32Array;
                break;

              case "Y32":
                d = Float32Array;
                break;

              case "Y64":
                d = Float64Array;
                break;

              default:
                throw v;
            }
            u = new d(e.slice(g += 2, g = e.indexOf('"', ++g)).split(","));
            break;

          case "E":
            var E = void 0;
            switch (v += e[++g] + e[++g]) {
              case "EEv":
                E = EvalError;
                break;

              case "ERa":
                E = RangeError;
                break;

              case "ERe":
                E = ReferenceError;
                break;

              case "ESy":
                E = SyntaxError;
                break;

              case "ETy":
                E = TypeError;
                break;

              case "EUR":
                E = URIError;
                break;

              default:
                E = Error;
            }
            c = {
                v: u = new E(""),
                t: e[++g]
            };
            break;

          case "A":
            var U = "B" !== e[++g];
            u = new Uint8Array(e.slice(g += 2, g = e.indexOf('"', ++g)).split(",")).buffer, 
            U && (u = new DataView(u));
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
            w.push(v);
            continue;

          case '"':
            for (var I = !1; g++ < k && (v += e[g], I || '"' !== e[g]); I = !I && "\\" === e[g]) ;
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
            p.pop(), u = y.v, y = p[p.length - 1];
            continue;

          case ",":
            A = b, "[" === y.t && (y.v.length = ++y.i);
            continue;

          case ":":
            A = u, "[" === y.t && (y.v.length = y.i--);
            continue;

          default:
            for (;g++ < k && !l.test(e[g]) ? v += e[g] : (g--, 0); ) ;
            u = o.test(v[0]) ? (f = !1, s[v]) : +v;
        }
        if (w.length) {
            for (var S = u, m = []; w.length; ) m.push(u = h(w.pop(), u, r));
            for (;m.length; ) s[a(t)] = m.pop();
            f && (s[a(t)] = S, f = !1);
        }
        f && (s[a(t)] = u), "[" === y.t ? A === b ? y.v[y.i] = u : (y.v[A] = u, A = b) : "T" === y.t ? y.v.add(u) : A !== b && ("{" === y.t ? y.v[A] = u : y.v.set(A, u), 
        A = b), c && (p.push(y = c), c = null);
    }
    return b[0];
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

exports.build = u, exports.default = v, exports.parse = f;
