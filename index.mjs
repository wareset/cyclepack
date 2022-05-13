/* eslint-disable */
/*
dester builds:
index.ts
*/
var e = String, r = Object.prototype, a = r => {
    for (var a, t = ++r[0], n = ""; t > 0; ) a = (t - 1) % 26, n = e.fromCharCode(97 + a) + n, 
    t = (t - a) / 26 | 0;
    return n;
}, t = /^0\d|\D/, n = e => '"' + e + '"', s = (e, c, i, u) => {
    var l = c.get(e);
    if (l) return l;
    switch (c.set(e, a(i)), r.toString.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + s("" + e, c, i, u);

      case "Object":
        var o = "";
        for (var f in e) r.hasOwnProperty.call(e, f) && (o += s(f, c, i, u) + ":" + s(e[f], c, i, u) + ",");
        return "{" + o.slice(0, -1) + "}";

      case "Function":
        return "E" + s("" + (u && u(e) || e.name), c, i, u);

      case "Boolean":
        return "B" + +e;

      case "Symbol":
        return "H" + s(e.toString().slice(7, -1), c, i, u);

      case "Number":
        return e === +e ? e < 0 ? "-" + s(-e, c, i, u) : "" + e : "N" + s(+e, c, i, u);

      case "Date":
        return "D" + s(e.getTime(), c, i, u);

      case "String":
        return e === "" + e ? e !== "" + +e ? JSON.stringify(e) : "Q" + s(+e, c, i, u) : "S" + s("" + e, c, i, u);

      case "RegExp":
        return "R" + s(e.source + "," + e.flags, c, i, u);

      case "Array":
        var h, v = "", A = 0;
        for (var y in e) {
            if (t.test(y)) v += s(y, c, i, u) + ":"; else if ((h = +y) > A++) for (;A <= h; A++) v += ",";
            v += s(e[y], c, i, u) + ",";
        }
        if ((h = e.length) > A) for (;A <= h; A++) v += ",";
        return "[" + v.slice(0, -1) + "]";

      case "Int8Array":
        return "I8A" + n(e);

      case "Uint8Array":
        return "U8A" + n(e);

      case "Uint8ClampedArray":
        return "U8C" + n(e);

      case "Int16Array":
        return "I16" + n(e);

      case "Uint16Array":
        return "U16" + n(e);

      case "Int32Array":
        return "I32" + n(e);

      case "Uint32Array":
        return "U32" + n(e);

      case "Float32Array":
        return "F32" + n(e);

      case "Float64Array":
        return "F64" + n(e);

      case "Map":
        var b = [ "", c, i, u ];
        return e.forEach((function(e, r) {
            this[0] += s(r, this[1], this[2], this[3]) + ":" + s(e, this[1], this[2], this[3]) + ",";
        }), b), "M(" + b[0].slice(0, -1) + ")";

      case "Set":
        var p = [ "", c, i, u ];
        return e.forEach((function(e) {
            this[0] += s(e, this[1], this[2], this[3]) + ",";
        }), p), "T(" + p[0].slice(0, -1) + ")";

      case "ArrayBuffer":
        return "AB" + n(new Uint8Array(new DataView(e).buffer));

      case "DataView":
        return "AV" + n(new Uint8Array(e.buffer));

      default:
        return console.warn(e), "a";
    }
}, c = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map(((e, r) => [ e, a([ r ]) ])), i = (e, r) => s(e, new Map(c), [ 17 ], r), u = /[a-z]/, l = /["/{}[\]():,]/, o = (e, r) => {
    for (var t = [ 17 ], n = {}, s = t[0]; s-- > 0; ) n[c[s][1]] = c[s][0];
    for (var i, o, h, v, A = [], y = {
        v: A,
        t: "[",
        i: 0
    }, b = [ y ], p = A, w = [], g = e.length - 1, U = -1; U++ < g; ) {
        switch (h = !0, v = e[U]) {
          case "B":
            o = new Boolean(+e[++U]);
            break;

          case "I":
          case "U":
          case "F":
            var d = void 0;
            switch (v += e[++U] + e[++U]) {
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
                throw v;
            }
            o = new d(e.slice(U += 2, U = e.indexOf('"', ++U)).split(","));
            break;

          case "A":
            var k = "B" !== e[++U];
            o = new Uint8Array(e.slice(U += 2, U = e.indexOf('"', ++U)).split(",")).buffer, 
            k && (o = new DataView(o));
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
            for (var I = !1; U++ < g && (v += e[U], I || '"' !== e[U]); I = !I && "\\" === e[U]) ;
            o = JSON.parse(v);
            break;

          case "{":
            i = {
                v: o = {},
                t: v
            };
            break;

          case "[":
            i = {
                v: o = [],
                t: v,
                i: 0
            };
            break;

          case "T":
            i = {
                v: o = new Set,
                t: v
            }, U++;
            break;

          case "M":
            i = {
                v: o = new Map,
                t: v
            }, U++;
            break;

          case "]":
          case "}":
          case ")":
            b.pop(), o = y.v, y = b[b.length - 1];
            continue;

          case ",":
            p = A, "[" === y.t && (y.v.length = ++y.i);
            continue;

          case ":":
            p = o, "[" === y.t && (y.v.length = y.i--);
            continue;

          default:
            for (;U++ < g && !l.test(e[U]) ? v += e[U] : (U--, 0); ) ;
            o = u.test(v[0]) ? (h = !1, n[v]) : +v;
        }
        if (w.length) {
            for (var S = o, m = []; w.length; ) m.push(o = f(w.pop(), o, r));
            for (;m.length; ) n[a(t)] = m.pop();
            h && (n[a(t)] = S, h = !1);
        }
        h && (n[a(t)] = o), "[" === y.t ? p === A ? y.v[y.i] = o : (y.v[p] = o, p = A) : "T" === y.t ? y.v.add(o) : p !== A && ("{" === y.t ? y.v[p] = o : y.v.set(p, o), 
        p = A), i && (b.push(y = i), i = null);
    }
    return A[0];
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
    parse: o
};

export { i as build, h as default, o as parse };
