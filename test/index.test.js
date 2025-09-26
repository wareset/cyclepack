const { encode, decode, uneval } = require('../dist/index')

function _eval_(input) {
  return Function(`return (${input})`)()
}

test('Base: without options', function () {
  const fixtures = {
    basics: [
      // primitives
      {
        value: void 0,
        encode: '',
        uneval: 'void 0',
      },
      {
        value: [void 0],
        encode: 'A1_1·u',
        uneval: `
(function() {
var
v1=void 0,
v0=Array(1)
v0[0]=v1
return v0
})()
        `.trim(),
      },
      {
        value: null,
        encode: 'n',
        uneval: 'null',
      },
      {
        value: true,
        encode: 'b1',
        uneval: '!0',
      },
      {
        value: false,
        encode: 'b0',
        uneval: '!1',
      },
      {
        value: 0,
        encode: '0',
        uneval: '0',
      },
      {
        value: -0,
        encode: '-0',
        uneval: '-0',
      },
      {
        value: 1,
        encode: '1',
        uneval: '1',
      },
      {
        value: -1,
        encode: '-1',
        uneval: '-1',
      },
      {
        value: 1.1,
        encode: '1.1',
        uneval: '1.1',
      },
      {
        value: -1.1,
        encode: '-1.1',
        uneval: '-1.1',
      },
      {
        value: NaN,
        encode: '+NaN',
        uneval: 'NaN',
      },
      {
        value: +Infinity,
        encode: '+Infinity',
        uneval: 'Infinity',
      },
      {
        value: -Infinity,
        encode: '-Infinity',
        uneval: '-Infinity',
      },
      {
        value: 123n,
        encode: 'i123',
        uneval: 'BigInt(123)',
      },
      {
        value: -123n,
        encode: 'i-123',
        uneval: 'BigInt(-123)',
      },
      {
        value: `'"·\\text`,
        encode: `t'\\"\\u00b7\\\\text`,
        uneval: `"'\\"\\u00b7\\\\text"`,
      },
      {
        value: Symbol.for('123'),
        encode: 'k1·123',
        uneval: `
(function() {
var
v1=123,
v0=Symbol.for(v1)

return v0
})()
        `.trim(),
      },
      // objects
      {
        value: new Boolean(true),
        encode: 'B1',
        uneval: 'new Boolean(1)',
      },
      {
        value: new Boolean(false),
        encode: 'B0',
        uneval: 'new Boolean(0)',
      },
      {
        value: new Number(123),
        encode: 'N1·123',
        uneval: `
(function() {
var
v1=123,
v0=new Number(v1)

return v0
})()
        `.trim(),
      },
      {
        value: new String(123),
        encode: 'T1·123',
        uneval: `
(function() {
var
v1=123,
v0=new String(v1)

return v0
})()
        `.trim(),
      },

      {
        value: /[^]/,
        encode: 'R1·t[^]',
        uneval: '/[^]/',
      },
      {
        value: /[^'"]/gi,
        encode: 'R1_2·t[^\'\\"]·tgi',
        uneval: '/[^\'"]/gi',
      },

      {
        value: new Date('2025-08-17T15:58:25.929Z'),
        encode: 'D1·t2025-08-17T15:58:25.929Z',
        uneval: `
(function() {
var
v1="2025-08-17T15:58:25.929Z",
v0=new Date(v1)

return v0
})()
        `.trim(),
      },
      {
        value: new Date(NaN),
        encode: 'D',
        uneval: 'new Date(NaN)',
        // JEST не может сравнить невалидные даты
        // expect(new Date(NaN)).toStrictEqual(new Date(NaN))
        notDecode: true,
      },
      {
        value: new URL('https://user:password@example.com/path?foo=bar#hash'),
        encode:
          'U1_2·tURL·thttps://user:password@example.com/path?foo=bar#hash',
        uneval: `
(function() {
var
v1="https://user:password@example.com/path?foo=bar#hash",
v0=new URL(v1)

return v0
})()
        `.trim(),
      },
      {
        value: new URLSearchParams('foo=1&foo=2&baz=<+>'),
        encode: 'U1_2·tURLSearchParams·tfoo=1&foo=2&baz=%3C+%3E',
        uneval: `
(function() {
var
v1="foo=1&foo=2&baz=%3C+%3E",
v0=new URLSearchParams(v1)

return v0
})()
        `.trim(),
      },
    ],

    arrays: [
      {
        value: [],
        encode: 'A0',
        uneval: 'Array(0)',
      },
      {
        value: [, ,],
        encode: 'A2',
        uneval: 'Array(2)',
      },
      {
        value: [0, , 0, ,],
        encode: 'A4_1,2:1·0·2',
        uneval: `
(function() {
var
v1=0,
v0=Array(4)
v0[0]=v1
v0[2]=v1
return v0
})()
        `.trim(),
      },
      {
        value: (() => {
          const a = [0, , 0, ,]
          // @ts-ignore
          a.key = 'value'
          return a
        })(),
        encode: 'A4_1,2:1,4:3·0·2·tvalue·tkey',
        uneval: `
(function() {
var
v1=0,
v2="value",
v3="key",
v0=Array(4)
v0[0]=v1
v0[2]=v1
v0[v3]=v2
return v0
})()
        `.trim(),
      },
    ],

    keyed_collections: [
      {
        value: new Set(),
        encode: 'S',
        uneval: 'new Set()',
      },
      {
        value: new Set([11, 22, 33]),
        encode: 'S1,2,3·11·22·33',
        uneval: `
(function() {
var
v1=11,
v2=22,
v3=33,
v0=new Set()
v0.add(v1)
v0.add(v2)
v0.add(v3)
return v0
})()
        `.trim(),
      },
      {
        value: new Map(),
        encode: 'M',
        uneval: 'new Map()',
      },
      {
        value: new Map([
          [11, 22],
          [33, 44],
        ]),
        encode: 'M1,2,3,4·11·22·33·44',
        uneval: `
(function() {
var
v1=11,
v2=22,
v3=33,
v4=44,
v0=new Map()
v0.set(v1,v2)
v0.set(v3,v4)
return v0
})()
        `.trim(),
      },
    ],

    structured_data_and_typed_arrays: [
      // Structured data
      {
        value: new ArrayBuffer(0),
        encode: 'Y',
        uneval: '(new Uint8Array([])).buffer',
      },
      {
        value: new ArrayBuffer(1),
        encode: 'YAA==',
        uneval: '(new Uint8Array([0])).buffer',
      },
      {
        value: new ArrayBuffer(2),
        encode: 'YAAA=',
        uneval: '(new Uint8Array([0,0])).buffer',
      },
      {
        value: new ArrayBuffer(3),
        encode: 'YAAAA',
        uneval: '(new Uint8Array([0,0,0])).buffer',
      },
      {
        value: new ArrayBuffer(8),
        encode: 'YAAAAAAAAAAA=',
        uneval: '(new Uint8Array([0,0,0,0,0,0,0,0])).buffer',
      },

      {
        value: new DataView(new ArrayBuffer(2)),
        encode: 'U1_2·tDataView·YAAA=',
        uneval: `
(function() {
var
v1=(new Uint8Array([0,0])).buffer,
v0=new DataView(v1)

return v0
})()
        `.trim(),
      },

      // Typed Arrays
      {
        value: new Int8Array(2),
        encode: 'U1_2·tInt8Array·YAAA=',
        uneval: `
(function() {
var
v1=(new Uint8Array([0,0])).buffer,
v0=new Int8Array(v1)

return v0
})()
        `.trim(),
      },
      {
        value: new Int8Array([21, 31]),
        encode: 'U1_2·tInt8Array·YFR8=',
        uneval: `
(function() {
var
v1=(new Uint8Array([21,31])).buffer,
v0=new Int8Array(v1)

return v0
})()
        `.trim(),
      },
      {
        value: new Uint8Array([21, 31]),
        encode: 'U1_2·tUint8Array·YFR8=',
      },
      {
        value: new Uint8ClampedArray([21, 31]),
        encode: 'U1_2·tUint8ClampedArray·YFR8=',
      },
      {
        value: new Uint16Array([21, 31]),
        encode: 'U1_2·tUint16Array·YFQAfAA==',
      },
      {
        value: new Uint32Array([21, 31]),
        encode: 'U1_2·tUint32Array·YFQAAAB8AAAA=',
      },
      {
        value: new Float32Array([21, 31]),
        encode: 'U1_2·tFloat32Array·YAACoQQAA+EE=',
      },
      {
        value: new Float64Array([21, 31]),
        encode: 'U1_2·tFloat64Array·YAAAAAAAANUAAAAAAAAA/QA==',
      },
      {
        value: new BigUint64Array([21n, 31n]),
        encode: 'U1_2·tBigUint64Array·YFQAAAAAAAAAfAAAAAAAAAA==',
        uneval: `
(function() {
var
v1=(new Uint8Array([21,0,0,0,0,0,0,0,31,0,0,0,0,0,0,0])).buffer,
v0=new BigUint64Array(v1)

return v0
})()
        `.trim(),
      },
    ],

    objects: [
      // simple
      {
        value: {},
        encode: 'O1',
        uneval: '{}',
      },
      {
        value: { __proto__: null },
        encode: 'O0',
        uneval: 'Object.create(null)',
      },
      {
        value: Object.create(null),
        encode: 'O0',
        uneval: 'Object.create(null)',
      },

      {
        value: { q: 11, w: 22, e: 33 },
        encode: 'O1_2:1,4:3,6:5·11·tq·22·tw·33·te',
      },
      {
        value: { 0: 11, 1: 22, 3: 33 },
        encode: 'O1_1,2,4:3·11·22·33·3',
        uneval: `
(function() {
var
v1=11,
v2=22,
v3=33,
v0={}
v0[0]=v1
v0[1]=v2
v0[3]=v3
return v0
})()
        `.trim(),
      },
      // symbols
      {
        value: { [Symbol.for('123')]: 11 },
        encode: 'O1_2:1·11·k3·123',
        uneval: `
(function() {
var
v1=11,
v3=123,
v2=Symbol.for(v3),
v0={}
v0[v2]=v1
return v0
})()
        `.trim(),
      },
      // with object custom prototype
      {
        value: Object.create({}),
        encode: 'P1·O1',
        uneval: `
(function() {
var
v1={},
v0=Object.create(v1)

return v0
})()
        `.trim(),
      },
      {
        value: Object.create([]),
        encode: 'P1·A0',
        uneval: `
(function() {
var
v1=Array(0),
v0=Object.create(v1)

return v0
})()
        `.trim(),
      },
      {
        value: (() => {
          const a = {}
          a._a = a
          a[Symbol.for('1')] = 1
          const b = Object.create(a)
          b._a = a
          b._b = b
          b[Symbol.for('2')] = 2
          return b
        })(),
        encode: 'P1_2:1,5:0,7:6·O1_2:1,4:3·t_a·1·k3·t_b·2·k6',
      },
    ],
  }

  for (const k in fixtures) {
    console.log(k)
    for (const data of fixtures[k]) {
      // console.log(data.name)
      if (!data.notEncode) {
        expect(encode(data.value)).toStrictEqual(data.encode)
      }
      if (!data.notDecode) {
        expect(decode(data.encode)).toStrictEqual(data.value)
      }
      if (data.uneval) {
        expect(uneval(data.value)).toStrictEqual(data.uneval)
        if (!data.notDecode) {
          expect(_eval_(data.uneval)).toStrictEqual(data.value)
        }
      }
    }
  }
})

test('Options: filterByList', function () {
  const fixtures = [
    {
      value: 1,
      filterByList: [1],
      encode: '',
      uneval: 'void 0',
      decode: void 0,
    },
    {
      value: NaN,
      filterByList: [NaN],
      encode: '',
      uneval: 'void 0',
      decode: void 0,
    },
    {
      value: [NaN],
      filterByList: [NaN],
      encode: 'A1',
      uneval: 'Array(1)',
      decode: [,],
    },
    {
      value: { q: 1, w: 2, e: 3 },
      filterByList: ['q', 2],
      encode: 'O1_2:1,4:3·1·tq·3·te',
      uneval: `
(function() {
var
v1=1,
v2="q",
v3=3,
v4="e",
v0={}
v0[v2]=v1
v0[v4]=v3
return v0
})()
      `.trim(),
      decode: { q: 1, e: 3 },
    },
    {
      value: [1, 0, 2, -0, 3, NaN, 4, '', 5],
      filterByList: [0, NaN, ''],
      encode: 'A9_1,2:2,4:3,5:4,7:6·1·2·3·4·6·5·8',
      uneval: `
(function() {
var
v1=1,
v2=2,
v3=3,
v4=4,
v5=5,
v0=Array(9)
v0[0]=v1
v0[2]=v2
v0[4]=v3
v0[6]=v4
v0[8]=v5
return v0
})()
      `.trim(),
      decode: [1, , 2, , 3, , 4, , 5],
    },
  ]

  for (const data of fixtures) {
    const opts = { filterByList: data.filterByList }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)
    expect(decode(data.encode)).toStrictEqual(data.decode)
    expect(_eval_(data.uneval)).toStrictEqual(data.decode)
  }
})

test('Options: filterByFunction', function () {
  const fixtures = [
    {
      value: 1,
      encode: '',
      uneval: 'void 0',
      decode: void 0,
    },
    {
      value: NaN,
      encode: '',
      uneval: 'void 0',
      decode: void 0,
    },
    {
      value: [NaN],
      encode: 'A1',
      uneval: 'Array(1)',
      decode: [,],
    },
    {
      value: { q: 'a', w: 2, e: 3 },
      encode: 'O1_2:1·ta·tq',
      uneval: `
(function() {
var
v1="a",
v2="q",
v0={}
v0[v2]=v1
return v0
})()
      `.trim(),
      decode: { q: 'a' },
    },
    {
      value: ['a', 0, true, -0, 'b', -Infinity, 'c'],
      encode: 'A7_1,3:2,5:4,7:6·ta·b1·2·tb·4·tc·6',
      uneval: `
(function() {
var
v1="a",
v2=!0,
v3="b",
v4="c",
v0=Array(7)
v0[0]=v1
v0[2]=v2
v0[4]=v3
v0[6]=v4
return v0
})()
      `.trim(),
      decode: ['a', , true, , 'b', , 'c'],
    },
    {
      value: new Set(['a', 1, 'b', 2]),
      encode: 'S1,2·ta·tb',
      uneval: `
(function() {
var
v1="a",
v2="b",
v0=new Set()
v0.add(v1)
v0.add(v2)
return v0
})()
      `.trim(),
      decode: new Set(['a', 'b']),
    },
    {
      value: new Map([
        [1, 2],
        ['a', 3],
        [4, 'b'],
      ]),
      encode: 'M1,2·4·tb',
      uneval: `
(function() {
var
v1=4,
v2="b",
v0=new Map()
v0.set(v1,v2)
return v0
})()
      `.trim(),
      decode: new Map([[4, 'b']]),
    },
  ]

  const filterByFunction = (v) => typeof v !== 'number'
  for (const data of fixtures) {
    const opts = { filterByFunction }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)
    expect(decode(data.encode)).toStrictEqual(data.decode)
    expect(_eval_(data.uneval)).toStrictEqual(data.decode)
  }
})

test('Options: removeArrayHoles', function () {
  const fixtures = [
    {
      value: [, , 'a', , 1, , 'b', 2, , 'c', ,],
      encode: 'A0_1,2,3·ta·tb·tc',
      uneval: `
(function() {
var
v1="a",
v2="b",
v3="c",
v0=[]
v0[0]=v1
v0[1]=v2
v0[2]=v3
return v0
})()
      `.trim(),
      decode: ['a', 'b', 'c'],
    },
  ]
  const filterByFunction = (v) => typeof v !== 'number'
  for (const data of fixtures) {
    const opts = { filterByFunction, removeArrayHoles: true }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)
    expect(decode(data.encode)).toStrictEqual(data.decode)
    expect(_eval_(data.uneval)).toStrictEqual(data.decode)
  }
})

test('Options: removeEmptyObjects', function () {
  const fixtures = [
    {
      value: [, {}, new Set([[]]), ,],
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: {},
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new Set([[], {}]),
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new Map([
        [1, []],
        [2, {}],
      ]),
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new Map([[{}, 1]]),
      encode: 'M1,2·O1·1',
      uneval: `
(function() {
var
v1={},
v2=1,
v0=new Map()
v0.set(v1,v2)
return v0
})()
    `.trim(),
      decode: new Map([[{}, 1]]),
    },
    {
      value: (() => {
        const a = {}
        const b = Object.create(a)
        return b
      })(),
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: (() => {
        const a = { q: 1 }
        const b = Object.create(a)
        return b
      })(),
      encode: 'P1·O1_3:2·1·tq',
      uneval: `
(function() {
var
v2=1,
v3="q",
v1={},
v0=Object.create(v1)
v1[v3]=v2
return v0
})()
    `.trim(),
      decode: (() => {
        const a = { q: 1 }
        const b = Object.create(a)
        return b
      })(),
    },
    {
      value: (() => {
        const b = Object.create({})
        b.q = 1
        return b
      })(),
      encode: 'P_2:1·1·tq',
      uneval: `
(function() {
var
v1=1,
v2="q",
v0=Object.create(null)
v0[v2]=v1
return v0
})()
    `.trim(),
      decode: (() => {
        const b = Object.create(null)
        b.q = 1
        return b
      })(),
    },
  ]

  for (const data of fixtures) {
    const opts = { removeEmptyObjects: true }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)
    expect(decode(data.encode)).toStrictEqual(data.decode)
    expect(_eval_(data.uneval)).toStrictEqual(data.decode)
  }
})

test('Options: prepareFunctions', function () {
  const fixtures = [
    {
      value: () => {},
      prepareFunctions: void 0, // like null
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: [() => {}],
      prepareFunctions: null,
      encode: 'A1',
      uneval: `Array(1)`,
      decode: [,],
    },
    {
      value: { q: () => {} },
      prepareFunctions: null,
      encode: 'O1',
      uneval: `{}`,
      decode: {},
    },
    {
      value: new Set([() => {}]),
      prepareFunctions: null,
      encode: 'S',
      uneval: `new Set()`,
      decode: new Set(),
    },
    {
      value: new Map([['q', () => {}]]),
      prepareFunctions: null,
      encode: 'M',
      uneval: `new Map()`,
      decode: new Map(),
    },
    {
      value: new Map([[() => {}, 1]]),
      prepareFunctions: null,
      encode: 'M',
      uneval: `new Map()`,
      decode: new Map(),
    },
    {
      value: function Fn() {},
      prepareFunctions: () => 12,
      prepareFunctionsDecode: (v) => [v],
      encode: 'f1·12',
      uneval: `
(function() {
var
v1=12,
v0=v1

return v0
})()
      `.trim(),
      decode: [12],
    },
    {
      value: function Fn() {},
      prepareFunctions: (v) => v + '',
      prepareFunctionsDecode: (v) => [v],
      encode: 'f1·tfunction Fn() {}',
      uneval: `function Fn() {}`,
      decode: ['function Fn() {}'],
    },
  ]

  const filterByFunction = (v) => typeof v !== 'string'
  for (const data of fixtures) {
    const opts = { filterByFunction, prepareFunctions: data.prepareFunctions }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)

    const optsDecode = {
      filterByFunction,
      prepareFunctions: data.prepareFunctionsDecode,
    }
    expect(decode(data.encode, optsDecode)).toStrictEqual(data.decode)
  }
})

test('Options: prepareErrors', function () {
  class CustomError1 extends Error {}
  globalThis.CustomError1 = CustomError1

  const stack = 'Error\n    at http://localhost:3000/js/build.js:17:17'

  const fixtures = [
    {
      value: new Error(),
      prepareErrors: null,
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new Error(),
      prepareErrors: () => 'new Error(12)',
      prepareErrorsDecode: (v) => [v],
      encode: 'E1·tnew Error(12)',
      uneval: `new Error(12)`,
      decode: ['new Error(12)'],
    },
    {
      value: new Error(),
      prepareErrors: () => 12,
      prepareErrorsDecode: (v) => [v],
      encode: 'E1·12',
      uneval: `
(function() {
var
v1=12,
v0=v1

return v0
})()
    `.trim(),
      decode: [12],
    },
    {
      value: (() => {
        const error = new ReferenceError()
        error.stack = stack
        return error
      })(),
      prepareErrors: void 0,
      encode:
        'E1_2__3·tReferenceError·t·tError\\n    at http://localhost:3000/js/build.js:17:17',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var
v1="ReferenceError",
v2="",
v3="Error\\n    at http://localhost:3000/js/build.js:17:17",
v0=(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(v1,v2,v3,0,{})

return v0
})()
    `.trim(),
    },
    {
      value: (() => {
        const error = new Error('MESSAGE', { cause: 'CAUSE' })
        error.stack = stack
        return error
      })(),
      prepareErrors: void 0,
      encode:
        'E1_2_3_4·tError·tMESSAGE·tCAUSE·tError\\n    at http://localhost:3000/js/build.js:17:17',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var
v1="Error",
v2="MESSAGE",
v3="Error\\n    at http://localhost:3000/js/build.js:17:17",
v4="CAUSE",
v0=(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(v1,v2,v3,0,{cause:v4})

return v0
})()
    `.trim(),
    },
    {
      value: (() => {
        const error = new AggregateError([1, 2])
        error.stack = stack
        return error
      })(),
      prepareErrors: void 0,
      encode:
        'E1_2__3_4·tAggregateError·t·tError\\n    at http://localhost:3000/js/build.js:17:17·A2_5,6·1·2',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var
v1="AggregateError",
v2="",
v3="Error\\n    at http://localhost:3000/js/build.js:17:17",
v5=1,
v6=2,
v4=Array(2),
v0=(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(v1,v2,v3,v4,{})
v4[0]=v5
v4[1]=v6
return v0
})()
    `.trim(),
    },
    {
      value: (() => {
        const error = new CustomError1('123')
        error.stack = stack
        return error
      })(),
      prepareErrors: void 0,
      encode:
        'E1_2__3·tCustomError1·t123·tError\\n    at http://localhost:3000/js/build.js:17:17',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var
v1="CustomError1",
v2="123",
v3="Error\\n    at http://localhost:3000/js/build.js:17:17",
v0=(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(v1,v2,v3,0,{})

return v0
})()
    `.trim(),
    },
    {
      value: (() => {
        class CustomError2 extends Error {}
        const error = new CustomError2('123')
        error.stack = stack
        return error
      })(),
      prepareErrors: void 0,
      encode:
        'E1_2__3·tCustomError2·t123·tError\\n    at http://localhost:3000/js/build.js:17:17',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var
v1="CustomError2",
v2="123",
v3="Error\\n    at http://localhost:3000/js/build.js:17:17",
v0=(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(v1,v2,v3,0,{})

return v0
})()
    `.trim(),
      decode: (() => {
        const error = new Error('123')
        error.stack = stack
        error._CyclepackError = 'CustomError2'
        return error
      })(),
    },
  ]

  for (const data of fixtures) {
    const opts = { prepareErrors: data.prepareErrors }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)

    if (data.prepareErrorsDecode) {
      const optsDecode = { prepareErrors: data.prepareErrorsDecode }
      expect(decode(data.encode, optsDecode)).toStrictEqual(data.decode)
    } else if ('decode' in data) {
      expect(decode(data.encode)).toStrictEqual(data.decode)
      expect(_eval_(data.uneval)).toStrictEqual(data.decode)
    } else {
      expect(decode(data.encode)).toStrictEqual(data.value)
      expect(_eval_(data.uneval)).toStrictEqual(data.value)
    }
  }
})

test('Options: prepareClasses', function () {
  class CustomArray extends Array {}
  class CustomClass {
    q = 1
  }
  class CustomClass_2 {
    w = 2
  }

  const fixtures = [
    {
      value: new CustomArray(8),
      prepareClasses: null,
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new CustomArray(8),
      prepareClasses: void 0,
      encode: 'A8',
      uneval: `Array(8)`,
      decode: Array(8),
    },
    {
      value: new CustomArray(8),
      prepareClasses: () => 12,
      prepareClassesDecode: (v) => [v],
      encode: 'C1·12',
      uneval: `
(function() {
var
v1=12,
v0=v1

return v0
})()
      `.trim(),
      decode: [12],
    },
    {
      value: new CustomArray(8),
      prepareClasses: () => '{}',
      encode: 'C1·t{}',
      uneval: `{}`,
      // decode: '{}',
    },
    {
      value: new CustomClass(),
      prepareClasses: null,
      encode: '',
      uneval: `void 0`,
      decode: void 0,
    },
    {
      value: new CustomClass(),
      prepareClasses: () => '{}',
      encode: 'C1·t{}',
      uneval: `{}`,
      // decode: '{}',
    },
    {
      value: new CustomClass(),
      prepareClasses: void 0,
      encode: 'G3_2:1·1·tq·tCustomClass',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var CyclepackClass = G.CyclepackClass || (G.CyclepackClass = {})
function c(f,v){Object.defineProperty(f.prototype,"_CyclepackClass",{value:v,enumerable:!1,configurable:!0,writable:!0})}
function n(v){return new CyclepackClass[v]()}
CyclepackClass["CustomClass"]||c(CyclepackClass["CustomClass"]=function(){},"CustomClass")
var
v1=1,
v2="q",
v3="CustomClass",
v0=n(v3)
v0[v2]=v1
return v0
})()
    `.trim(),
      get decode() {
        const res = new globalThis.CyclepackClass.CustomClass()
        res.q = 1
        return res
      },
    },
    {
      value: [new CustomClass(), new CustomClass_2()],
      prepareClasses: void 0,
      encode: 'A2_1,5·G4_3:2·1·tq·tCustomClass·G8_7:6·2·tw·tCustomClass_2',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var CyclepackClass = G.CyclepackClass || (G.CyclepackClass = {})
function c(f,v){Object.defineProperty(f.prototype,"_CyclepackClass",{value:v,enumerable:!1,configurable:!0,writable:!0})}
function n(v){return new CyclepackClass[v]()}
CyclepackClass["CustomClass"]||c(CyclepackClass["CustomClass"]=function(){},"CustomClass")
CyclepackClass["CustomClass_2"]||c(CyclepackClass["CustomClass_2"]=function(){},"CustomClass_2")
var
v2=1,
v3="q",
v4="CustomClass",
v1=n(v4),
v6=2,
v7="w",
v8="CustomClass_2",
v5=n(v8),
v0=Array(2)
v1[v3]=v2
v0[0]=v1
v5[v7]=v6
v0[1]=v5
return v0
})()
    `.trim(),
      get decode() {
        const c1 = new globalThis.CyclepackClass.CustomClass()
        c1.q = 1
        const c2 = new globalThis.CyclepackClass.CustomClass_2()
        c2.w = 2
        return [c1, c2]
      },
    },
    {
      value: Object.create(new CustomClass()),
      prepareClasses: void 0,
      encode: 'P1·G4_3:2·1·tq·tCustomClass',
      uneval: `
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var CyclepackClass = G.CyclepackClass || (G.CyclepackClass = {})
function c(f,v){Object.defineProperty(f.prototype,"_CyclepackClass",{value:v,enumerable:!1,configurable:!0,writable:!0})}
function n(v){return new CyclepackClass[v]()}
CyclepackClass["CustomClass"]||c(CyclepackClass["CustomClass"]=function(){},"CustomClass")
var
v2=1,
v3="q",
v4="CustomClass",
v1=n(v4),
v0=Object.create(v1)
v1[v3]=v2
return v0
})()
    `.trim(),
      get decode() {
        const res = new globalThis.CyclepackClass.CustomClass()
        res.q = 1
        return Object.create(res)
      },
    },
  ]

  for (const data of fixtures) {
    const opts = { prepareClasses: data.prepareClasses }
    expect(encode(data.value, opts)).toStrictEqual(data.encode)
    expect(uneval(data.value, opts)).toStrictEqual(data.uneval)

    if (data.prepareClassesDecode) {
      const optsDecode = { prepareClasses: data.prepareClassesDecode }
      expect(decode(data.encode, optsDecode)).toStrictEqual(data.decode)
    } else if ('decode' in data) {
      expect(decode(data.encode)).toStrictEqual(data.decode)
      expect(_eval_(data.uneval)).toStrictEqual(data.decode)
    }
  }
})
