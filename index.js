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
}, t = /^0\d|\D/, s = e => '"' + e + '"', n = (e, c, i, u) => {
    var o = c.get(e);
    if (o) return o;
    switch (c.set(e, a(i)), r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + n("" + e, c, i, u);

      case "Object":
        var l = "";
        for (var f in e) r.hasOwnProperty.call(e, f) && (l += n(f, c, i, u) + ":" + n(e[f], c, i, u) + ",");
        return "{" + l.slice(0, -1) + "}";

      case "Function":
        return "E" + n("" + (u && u(e) || e.name), c, i, u);

      case "Boolean":
        return "B" + +e;

      case "Symbol":
        return "H" + n(e.toString().slice(7, -1), c, i, u);

      case "Number":
        return e === +e ? e < 0 ? "-" + n(-e, c, i, u) : "" + e : "N" + n(+e, c, i, u);

      case "Date":
        return "D" + n(e.getTime(), c, i, u);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + n(+e, c, i, u) : "S" + n("" + e, c, i, u);

      case "RegExp":
        return "R" + n(e.source + "," + e.flags, c, i, u);

      case "Array":
        var h, v = "", p = 0;
        for (var A in e) {
            if (t.test(A)) v += n(A, c, i, u) + ":"; else if ((h = +A) > p++) for (;p <= h; p++) v += ",";
            v += n(e[A], c, i, u) + ",";
        }
        if ((h = e.length) > p) for (;p <= h; p++) v += ",";
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
        return "F32" + s(e);

      case "Float64Array":
        return "F64" + s(e);

      case "Map":
        var b = [ "", c, i, u ];
        return e.forEach((function(e, r) {
            this[0] += n(r, this[1], this[2], this[3]) + ":" + n(e, this[1], this[2], this[3]) + ",";
        }), b), "M(" + b[0].slice(0, -1) + ")";

      case "Set":
        var y = [ "", c, i, u ];
        return e.forEach((function(e) {
            this[0] += n(e, this[1], this[2], this[3]) + ",";
        }), y), "T(" + y[0].slice(0, -1) + ")";

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn(e), "a";
    }
}, c = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), i = (e, r) => n(e, new Map(c), [ 17 ], r), u = /[a-z]/, o = /["/{}[\]():,]/, l = (e, r) => {
    for (var t = [ 17 ], s = {}, n = t[0]; n-- > 0; ) s[c[n][1]] = c[n][0];
    for (var i, l, h, v, p = [], A = {
        v: p,
        t: "[",
        i: 0
    }, b = [ A ], y = p, w = [], d = e.length - 1, g = -1; g++ < d; ) {
        switch (h = !0, v = e[g]) {
          case "B":
            l = new Boolean(+e[++g]);
            break;

          case "I":
          case "U":
          case "F":
            var U = void 0;
            switch (v += e[++g] + e[++g]) {
              case "I8A":
                U = Int8Array;
                break;

              case "U8A":
                U = Uint8Array;
                break;

              case "U8C":
                U = Uint8ClampedArray;
                break;

              case "I16":
                U = Int16Array;
                break;

              case "U16":
                U = Uint16Array;
                break;

              case "I32":
                U = Int32Array;
                break;

              case "U32":
                U = Uint32Array;
                break;

              case "F32":
                U = Float32Array;
                break;

              case "F64":
                U = Float64Array;
                break;

              default:
                throw v;
            }
            l = new U(e.slice(g += 2, g = e.indexOf('"', ++g)).split(","));
            break;

          case "A":
            var k = "B" !== e[++g];
            l = new Uint8Array(e.slice(g += 2, g = e.indexOf('"', ++g)).split(",")).buffer, 
            k && (l = new DataView(l));
            break;

          case "L":
          case "D":
          case "N":
          case "-":
          case "Q":
          case "H":
          case "S":
          case "R":
          case "E":
            w.push(v);
            continue;

          case '"':
            for (var I = !1; g++ < d && (v += e[g], I || '"' !== e[g]); I = !I && "\\" === e[g]) ;
            l = JSON.parse(v);
            break;

          case "{":
            i = {
                v: l = {},
                t: v
            };
            break;

          case "[":
            i = {
                v: l = [],
                t: v,
                i: 0
            };
            break;

          case "T":
            i = {
                v: l = new Set,
                t: v
            }, g++;
            break;

          case "M":
            i = {
                v: l = new Map,
                t: v
            }, g++;
            break;

          case "]":
          case "}":
          case ")":
            b.pop(), l = A.v, A = b[b.length - 1];
            continue;

          case ",":
            y = p, "[" === A.t && (A.v.length = ++A.i);
            continue;

          case ":":
            y = l, "[" === A.t && (A.v.length = A.i--);
            continue;

          default:
            for (;g++ < d && !o.test(e[g]) ? v += e[g] : (g--, 0); ) ;
            l = u.test(v[0]) ? (h = !1, s[v]) : +v;
        }
        if (w.length) {
            for (var S = l, m = []; w.length; ) m.push(l = f(w.pop(), l, r));
            for (;m.length; ) s[a(t)] = m.pop();
            h && (s[a(t)] = S, h = !1);
        }
        h && (s[a(t)] = l), "[" === A.t ? y === p ? A.v[A.i] = l : (A.v[y] = l, y = p) : "T" === A.t ? A.v.add(l) : y !== p && ("{" === A.t ? A.v[y] = l : A.v.set(y, l), 
        y = p), i && (b.push(A = i), i = null);
    }
    return p[0];
}, f = (r, a, t) => {
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
}, h = {
    build: i,
    parse: l
};

exports.build = i, exports.default = h, exports.parse = l;
