/* eslint-disable */
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = String, r = e.fromCharCode, a = JSON, t = a.stringify, n = Object.prototype, s = n.hasOwnProperty, c = n.toString, i = Boolean, o = Error, u = a.parse, f = Date, l = Number, h = RegExp;

function b(e) {
    for (var a, t = ++e[0], n = ""; t > 0; ) n = r(97 + (a = (t - 1) % 26)) + n, t = (t - a) / 26 | 0;
    return n;
}

var y = /^0\d|\D/;

function v(e, r) {
    return r ? '\\"' + e + '\\"' : '"' + e + '"';
}

var k = function(e, r, a, t, n) {
    var c = "{", i = "";
    for (var o in e) s.call(e, o) && (c += i + A(o, r, a, t, n) + ":" + A(e[o], r, a, t, n), 
    i = ",");
    return c + "}";
};

function A(e, r, a, n, s) {
    var i = r.get(e);
    if (i) return i;
    switch (r.set(e, b(a)), i = c.call(e).slice(8, -1)) {
      case "BigInt":
        return "L" + A("" + e, r, a, n, s);

      case "Object":
        return k(e, r, a, n, s);

      case "Function":
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return "Z" + A("" + (n && n(e) || e.name), r, a, n, s);

      case "Boolean":
        return "P" + +e;

      case "Symbol":
        return "H" + A(e.toString().slice(7, -1), r, a, n, s);

      case "Error":
        var o = k(e, r, a, n, s).slice(0, -1);
        return o.length > 1 && (o += ","), "E" + e.name.slice(0, 2) + o + A("message", r, a, n, s) + ":" + A(e.message, r, a, n, s) + "}";

      case "Number":
        return e === +e ? e < 0 ? "-" + A(-e, r, a, n, s) : "" + e : "N" + A(+e, r, a, n, s);

      case "Date":
        return "D" + A(e.getTime(), r, a, n, s);

      case "String":
        return e === "" + e ? e !== "" + +e ? function(e, r) {
            return e = t(e), r ? t(e).slice(1, -1) : e;
        }(e, s) : "Q" + A(+e, r, a, n, s) : "S" + A("" + e, r, a, n, s);

      case "RegExp":
        return "R" + A(e.source + "," + e.flags, r, a, n, s);

      case "Array":
        var u, f = "[", l = "", h = 0;
        for (var g in e) {
            if (y.test(g)) f += l + A(g, r, a, n, s) + ":", l = ""; else if ((u = +g) > h++) for (;h <= u; h++) f += ",";
            f += l + A(e[g], r, a, n, s), l = ",";
        }
        if ((u = e.length) > h) for (;h <= u; h++) f += l, l = ",";
        return f + "]";

      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array":
        return "" + (i[0] + i[4] + i[5]) + e.length + v(e, s);

      case "Map":
        var p = [ "M(", r, a, n, s, "" ];
        return e.forEach((function(e, r) {
            this[0] += this[5] + A(r, this[1], this[2], this[3], this[4]) + ":" + A(e, this[1], this[2], this[3], this[4]), 
            this[5] = ",";
        }), p), p[0] + ")";

      case "Set":
        var w = [ "T(", r, a, n, s, "" ];
        return e.forEach((function(e) {
            this[0] += this[5] + A(e, this[1], this[2], this[3], this[4]), this[5] = ",";
        }), w), w[0] + ")";

      case "ArrayBuffer":
      case "DataView":
        return "A" + i[0] + (e = new Int8Array("D" === i[0] ? e.buffer : e)).length + v(e, s);

      default:
        return console.warn("cyclepack:", e), k(e, r, a, n, s);
    }
}

var g = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, !0, !1, 1 / 0, -1 / 0 ].map((function(e, r) {
    return [ e, b([ r ]) ];
}));

function p(e, r, a) {
    return (a ? '"' : "") + A(e, new Map(g), [ 17 ], r, a) + (a ? '"' : "");
}

var w = /[a-z]/, d = /["/{}[\]():,]/;

function E(e, r) {
    for (var a = [ 17 ], t = {}, n = a[0]; n-- > 0; ) t[g[n][1]] = g[n][0];
    for (var s, c, f, l, h, y = [], v = {
        v: y,
        t: "[",
        i: 0
    }, k = [ v ], A = y, p = [], E = e.length - 1, S = -1; S++ < E; ) {
        switch (f = !0, h = e[S]) {
          case "P":
            c = new i(+e[++S]);
            break;

          case "E":
            switch (e[++S] + e[++S]) {
              case "Ag":
                c = AggregateError;
                break;

              case "Ev":
                c = EvalError;
                break;

              case "Ra":
                c = RangeError;
                break;

              case "Re":
                c = ReferenceError;
                break;

              case "Sy":
                c = SyntaxError;
                break;

              case "Ty":
                c = TypeError;
                break;

              case "UR":
                c = URIError;
                break;

              default:
                c = o;
            }
            s = {
                v: c = new c(""),
                t: e[++S]
            };
            break;

          case "I":
          case "U":
          case "F":
            switch (e[++S] + e[++S]) {
              case "Ar":
                c = Int8Array;
                break;

              case "8A":
                c = Uint8Array;
                break;

              case "8C":
                c = Uint8ClampedArray;
                break;

              case "6A":
                c = Int16Array;
                break;

              case "16":
                c = Uint16Array;
                break;

              case "2A":
                c = Int32Array;
                break;

              case "32":
                c = Uint32Array;
                break;

              case "t3":
                c = Float32Array;
                break;

              case "t6":
                c = Float64Array;
                break;

              default:
                throw h;
            }
            for (h = ""; '"' !== e[++S]; ) h += e[S];
            c = new c(+h);
            for (var m = 0, U = ""; ;) if ("," === e[++S] || '"' === e[S]) {
                if (c[m++] = +U, U = "", '"' === e[S]) break;
            } else U += e[S];
            break;

          case "B":
            switch (e[++S] + e[++S]) {
              case "nt":
                c = BigInt64Array;
                break;

              case "in":
                c = BigUint64Array;
                break;

              default:
                throw h;
            }
            for (h = ""; '"' !== e[++S]; ) h += e[S];
            c = new c(+h);
            for (var B = 0, R = ""; ;) if ("," === e[++S] || '"' === e[S]) {
                if (c[B++] = BigInt(R), R = "", '"' === e[S]) break;
            } else R += e[S];
            break;

          case "A":
            for (c = "", h = e[++S]; '"' !== e[++S]; ) c += e[S];
            c = new Int8Array(+c);
            for (var D = 0, F = ""; ;) if ("," === e[++S] || '"' === e[S]) {
                if (c[D++] = +F, F = "", '"' === e[S]) break;
            } else F += e[S];
            c = c.buffer, "D" === h && (c = new DataView(c));
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
            p.push(h);
            continue;

          case '"':
            for (var x = !1; S++ < E && (h += e[S], x || '"' !== e[S]); x = !x && "\\" === e[S]) ;
            c = u(h);
            break;

          case "{":
            s = {
                v: c = {},
                t: h
            };
            break;

          case "[":
            s = {
                v: c = [],
                t: h,
                i: 0
            };
            break;

          case "T":
            s = {
                v: c = new Set,
                t: h
            }, S++;
            break;

          case "M":
            s = {
                v: c = new Map,
                t: h
            }, S++;
            break;

          case "]":
          case "}":
          case ")":
            k.pop(), c = v.v, v = k[k.length - 1];
            continue;

          case ",":
            A = y, "[" === v.t && (v.v.length = ++v.i);
            continue;

          case ":":
            A = c, "[" === v.t && (v.v.length = v.i--);
            continue;

          default:
            for (;S++ < E && !d.test(e[S]) ? h += e[S] : (S--, 0); ) ;
            c = w.test(h[0]) ? (f = !1, t[h]) : +h;
        }
        if (p.length) {
            for (h = c, l = []; p.length; ) l.push(c = I(p.pop(), c, r));
            for (;l.length; ) t[b(a)] = l.pop();
            f && (t[b(a)] = h, f = !1);
        }
        f && (t[b(a)] = c), "[" === v.t ? A === y ? v.v[v.i] = c : (v.v[A] = c, A = y) : "T" === v.t ? v.v.add(c) : A !== y && ("{" === v.t ? v.v[A] = c : v.v.set(A, c), 
        A = y), s && (k.push(v = s), s = null);
    }
    return y[0];
}

function I(r, a, t) {
    switch (r) {
      case "-":
        return - +a;

      case "Q":
        return "" + a;

      case "L":
        return BigInt(a);

      case "H":
        return Symbol(a);

      case "D":
        return new f(+a);

      case "N":
        return new l(a);

      case "S":
        return new e(a);

      case "R":
        return new h(a.slice(0, r = a.lastIndexOf(",")), a.slice(r + 1));

      default:
        return t && t(a) || "%" + a + "%";
    }
}

const S = {
    pack: p,
    unpack: E
};

exports.default = S, exports.pack = p, exports.unpack = E;
