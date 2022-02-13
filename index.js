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
}, t = /^0\d|\D/, s = e => '"' + e + '"', n = (c, i, u, l) => {
    if (i.has(c)) return i.get(c);
    switch (i.set(c, a(u)), r.toString.call(c).slice(8, -1)) {
      case "Boolean":
        return "B" + +c;

      case "Number":
        return c === +c ? c < 0 ? "-" + n(-c, i, u, l) : c : "N" + n(+c, i, u, l);

      case "String":
        return c === (c = e(c)) ? c !== e(+c) ? JSON.stringify(c) : "Q" + n(+c, i, u, l) : "S" + n(c, i, u, l);

      case "Symbol":
        return "H" + n(c.toString().slice(7, -1), i, u, l);

      case "BigInt":
        return "L" + n(e(c), i, u, l);

      case "Date":
        return "D" + n(c.getTime(), i, u, l);

      case "RegExp":
        return "R" + n(c.source + "," + c.flags, i, u, l);

      case "Function":
        return "E" + n(e(l ? l(c) : c.name), i, u, l);

      case "Array":
        var o, f = "", h = 0;
        for (var p in c) {
            if (t.test(p)) f += n(p, i, u, l) + ":"; else if ((o = +p) > h++) for (;h <= o; h++) f += ",";
            f += n(c[p], i, u, l) + ",";
        }
        if ((o = c.length) > h) for (;h <= o; h++) f += ",";
        return "[" + f.slice(0, -1) + "]";

      case "Set":
        var A = [ "", i, u, l ];
        return c.forEach((function(e) {
            this[0] += n(e, this[1], this[2], this[3]) + ",";
        }), A), "T(" + A[0].slice(0, -1) + ")";

      case "Map":
        var b = [ "", i, u, l ];
        return c.forEach((function(e, r) {
            this[0] += n(r, this[1], this[2], this[3]) + ":" + n(e, this[1], this[2], this[3]) + ",";
        }), b), "M(" + b[0].slice(0, -1) + ")";

      case "Object":
        var v = "";
        for (var y in c) r.hasOwnProperty.call(c, y) && (v += n(y, i, u, l) + ":" + n(c[y], i, u, l) + ",");
        return "{" + v.slice(0, -1) + "}";

      case "Int8Array":
        return "I8A" + s(c);

      case "Uint8Array":
        return "U8A" + s(c);

      case "Uint8ClampedArray":
        return "U8C" + s(c);

      case "Int16Array":
        return "I16" + s(c);

      case "Uint16Array":
        return "U16" + s(c);

      case "Int32Array":
        return "I32" + s(c);

      case "Uint32Array":
        return "U32" + s(c);

      case "Float32Array":
        return "F32" + s(c);

      case "Float64Array":
        return "F64" + s(c);

      case "ArrayBuffer":
        return "AB" + s(new Uint8Array(new DataView(c).buffer));

      case "DataView":
        return "AV" + s(new Uint8Array(c.buffer));

      default:
        return console.warn(c), "a";
    }
}, c = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), i = c.map((e => [ e[1], e[0] ])), u = (r, a) => e(n(r, new Map(c), [ 17 ], a)), l = /[a-z]/, o = /["/{}[\]():,]/, f = (e, r) => {
    for (var t, s, n, c, u = new Map(i), f = [ 17 ], p = [], A = {
        v: p,
        t: "[",
        i: 0
    }, b = [ A ], v = p, y = [], w = e.length - 1, g = -1; g++ < w; ) {
        switch (n = !0, c = e[g]) {
          case "B":
            s = new Boolean(+e[++g]);
            break;

          case "I":
          case "U":
          case "F":
            var d = void 0;
            switch (c += e[++g] + e[++g]) {
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

              case "F32":
                d = Float32Array;
                break;

              case "F64":
                d = Float64Array;
                break;

              default:
                throw c;
            }
            s = new d(e.slice(g += 2, g = e.indexOf('"', ++g)).split(","));
            break;

          case "A":
            var U = "B" !== e[++g];
            s = new Uint8Array(e.slice(g += 2, g = e.indexOf('"', ++g)).split(",")).buffer, 
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
            for (var k = !1; g++ < w && (c += e[g], k || '"' !== e[g]); k = !k && "\\" === e[g]) ;
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
            }, g++;
            break;

          case "M":
            t = {
                v: s = new Map,
                t: c
            }, g++;
            break;

          case "]":
          case "}":
          case ")":
            b.pop(), s = A.v, A = b[b.length - 1];
            continue;

          case ",":
            v = p, "[" === A.t && (A.v.length = ++A.i);
            continue;

          case ":":
            v = s, "[" === A.t && (A.v.length = A.i--);
            continue;

          default:
            for (;g++ < w && !o.test(e[g]) ? c += e[g] : (g--, 0); ) ;
            s = l.test(c[0]) ? (n = !1, u.get(c)) : +c;
        }
        if (y.length) {
            for (var I = s, S = []; y.length; ) S.push(s = h(y.pop(), s, r));
            for (;S.length; ) u.set(a(f), S.pop());
            n && (u.set(a(f), I), n = !1);
        }
        n && u.set(a(f), s), "[" === A.t ? v === p ? A.v[A.i] = s : (A.v[v] = s, v = p) : "T" === A.t ? A.v.add(s) : v !== p && ("{" === A.t ? A.v[v] = s : A.v.set(v, s), 
        v = p), t && (b.push(A = t), t = null);
    }
    return p[0];
}, h = (r, a, t) => {
    switch (r) {
      case "-":
        return - +a;

      case "Q":
        return e(a);

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
        return t ? t(a) : "%" + a + "%";
    }
}, p = {
    build: u,
    parse: f
};

exports.build = u, exports.default = p, exports.parse = f;
