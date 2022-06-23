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
        for (var p in e) {
            if (t.test(p)) b += v + c(p, i, o, u) + ":", v = ""; else if ((h = +p) > y++) for (;y <= h; y++) b += ",";
            b += v + c(e[p], i, o, u), v = ",";
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
        var A = [ "M(", i, o, u, "" ];
        return e.forEach((function(e, r) {
            this[0] += this[4] + c(r, this[1], this[2], this[3]) + ":" + c(e, this[1], this[2], this[3]), 
            this[4] = ",";
        }), A), A[0] + ")";

      case "Set":
        var k = [ "T(", i, o, u, "" ];
        return e.forEach((function(e) {
            this[0] += this[4] + c(e, this[1], this[2], this[3]), this[4] = ",";
        }), k), k[0] + ")";

      case "ArrayBuffer":
      case "DataView":
        return "A" + l[0] + (e = new Int8Array("D" === l[0] ? e.buffer : e)).length + s(e);

      default:
        return console.warn("cyclepack:", e), n(e, i, o, u);
    }
}, i = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), o = (e, r) => c(e, new Map(i), [ 17 ], r), u = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[i[n][1]] = i[n][0];
    for (var c, o, f, b, v, y = [], p = {
        v: y,
        t: "[",
        i: 0
    }, A = [ p ], k = y, g = [], w = e.length - 1, d = -1; d++ < w; ) {
        switch (f = !0, v = e[d]) {
          case "B":
            o = new Boolean(+e[++d]);
            break;

          case "E":
            switch (e[++d] + e[++d]) {
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
                t: e[++d]
            };
            break;

          case "I":
          case "U":
          case "F":
            switch (e[++d] + e[++d]) {
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
            for (v = ""; '"' !== e[++d]; ) v += e[d];
            o = new o(+v);
            for (var E = 0, S = ""; ;) if ("," === e[++d] || '"' === e[d]) {
                if (o[E++] = +S, S = "", '"' === e[d]) break;
            } else S += e[d];
            break;

          case "A":
            for (v = e[++d], o = ""; '"' !== e[++d]; ) o += e[d];
            o = new Int8Array(+o);
            for (var m = 0, I = ""; ;) if ("," === e[++d] || '"' === e[d]) {
                if (o[m++] = +I, I = "", '"' === e[d]) break;
            } else I += e[d];
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
            g.push(v);
            continue;

          case '"':
            for (var R = !1; d++ < w && (v += e[d], R || '"' !== e[d]); R = !R && "\\" === e[d]) ;
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
            }, d++;
            break;

          case "M":
            c = {
                v: o = new Map,
                t: v
            }, d++;
            break;

          case "]":
          case "}":
          case ")":
            A.pop(), o = p.v, p = A[A.length - 1];
            continue;

          case ",":
            k = y, "[" === p.t && (p.v.length = ++p.i);
            continue;

          case ":":
            k = o, "[" === p.t && (p.v.length = p.i--);
            continue;

          default:
            for (;d++ < w && !l.test(e[d]) ? v += e[d] : (d--, 0); ) ;
            o = u.test(v[0]) ? (f = !1, s[v]) : +v;
        }
        if (g.length) {
            for (v = o, b = []; g.length; ) b.push(o = h(g.pop(), o, r));
            for (;b.length; ) s[a(t)] = b.pop();
            f && (s[a(t)] = v, f = !1);
        }
        f && (s[a(t)] = o), "[" === p.t ? k === y ? p.v[p.i] = o : (p.v[k] = o, k = y) : "T" === p.t ? p.v.add(o) : k !== y && ("{" === p.t ? p.v[k] = o : p.v.set(k, o), 
        k = y), c && (A.push(p = c), c = null);
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

exports.build = o, exports.default = b, exports.parse = f;
