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
      case "Boolean":
        return "B" + +e;

      case "Number":
        return e === +e ? e < 0 ? "-" + n(-e, c, i, u) : "" + e : "N" + n(+e, c, i, u);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + n(+e, c, i, u) : "S" + n("" + e, c, i, u);

      case "Symbol":
        return "H" + n(e.toString().slice(7, -1), c, i, u);

      case "BigInt":
        return "L" + n("" + e, c, i, u);

      case "Date":
        return "D" + n(e.toJSON(), c, i, u);

      case "RegExp":
        return "R" + n(e.source + "," + e.flags, c, i, u);

      case "Function":
        return "E" + n("" + (u && u(e) || e.name), c, i, u);

      case "Array":
        var l, f = "", p = 0;
        for (var h in e) {
            if (t.test(h)) f += n(h, c, i, u) + ":"; else if ((l = +h) > p++) for (;p <= l; p++) f += ",";
            f += n(e[h], c, i, u) + ",";
        }
        if ((l = e.length) > p) for (;p <= l; p++) f += ",";
        return "[" + f.slice(0, -1) + "]";

      case "Set":
        var v = [ "", c, i, u ];
        return e.forEach((function(e) {
            this[0] += n(e, this[1], this[2], this[3]) + ",";
        }), v), "T(" + v[0].slice(0, -1) + ")";

      case "Map":
        var A = [ "", c, i, u ];
        return e.forEach((function(e, r) {
            this[0] += n(r, this[1], this[2], this[3]) + ":" + n(e, this[1], this[2], this[3]) + ",";
        }), A), "M(" + A[0].slice(0, -1) + ")";

      case "Object":
        var b = "";
        for (var y in e) r.hasOwnProperty.call(e, y) && (b += n(y, c, i, u) + ":" + n(e[y], c, i, u) + ",");
        return "{" + b.slice(0, -1) + "}";

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

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(e.buffer));

      default:
        return console.warn(e), "a";
    }
}, c = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), i = c.map((e => [ e[1], e[0] ])), u = (e, r) => n(e, new Map(c), [ 17 ], r), o = /[a-z]/, l = /["/{}[\]():,]/, f = (e, r) => {
    for (var t, s, n, c, u = new Map(i), f = [ 17 ], h = [], v = {
        v: h,
        t: "[",
        i: 0
    }, A = [ v ], b = h, y = [], w = e.length - 1, d = -1; d++ < w; ) {
        switch (n = !0, c = e[d]) {
          case "B":
            s = new Boolean(+e[++d]);
            break;

          case "I":
          case "U":
          case "F":
            var g = void 0;
            switch (c += e[++d] + e[++d]) {
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

              case "F32":
                g = Float32Array;
                break;

              case "F64":
                g = Float64Array;
                break;

              default:
                throw c;
            }
            s = new g(e.slice(d += 2, d = e.indexOf('"', ++d)).split(","));
            break;

          case "A":
            var U = "B" !== e[++d];
            s = new Uint8Array(e.slice(d += 2, d = e.indexOf('"', ++d)).split(",")).buffer, 
            U && (s = new DataView(s));
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
            y.push(c);
            continue;

          case '"':
            for (var k = !1; d++ < w && (c += e[d], k || '"' !== e[d]); k = !k && "\\" === e[d]) ;
            s = JSON.parse(c);
            break;

          case "{":
            t = {
                v: s = {},
                t: c
            };
            break;

          case "[":
            t = {
                v: s = [],
                t: c,
                i: 0
            };
            break;

          case "T":
            t = {
                v: s = new Set,
                t: c
            }, d++;
            break;

          case "M":
            t = {
                v: s = new Map,
                t: c
            }, d++;
            break;

          case "]":
          case "}":
          case ")":
            A.pop(), s = v.v, v = A[A.length - 1];
            continue;

          case ",":
            b = h, "[" === v.t && (v.v.length = ++v.i);
            continue;

          case ":":
            b = s, "[" === v.t && (v.v.length = v.i--);
            continue;

          default:
            for (;d++ < w && !l.test(e[d]) ? c += e[d] : (d--, 0); ) ;
            s = o.test(c[0]) ? (n = !1, u.get(c)) : +c;
        }
        if (y.length) {
            for (var I = s, S = []; y.length; ) S.push(s = p(y.pop(), s, r));
            for (;S.length; ) u.set(a(f), S.pop());
            n && (u.set(a(f), I), n = !1);
        }
        n && u.set(a(f), s), "[" === v.t ? b === h ? v.v[v.i] = s : (v.v[b] = s, b = h) : "T" === v.t ? v.v.add(s) : b !== h && ("{" === v.t ? v.v[b] = s : v.v.set(b, s), 
        b = h), t && (A.push(v = t), t = null);
    }
    return h[0];
}, p = (r, a, t) => {
    switch (r) {
      case "-":
        return - +a;

      case "Q":
        return "" + a;

      case "L":
        return BigInt(a);

      case "D":
        return new Date(a);

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
    build: u,
    parse: f
};

exports.build = u, exports.default = h, exports.parse = f;
