const { encode, decode, uneval } = require('../dist/index')

function encode_only(input, output, inputProps) {
  expect(encode(input, inputProps)).toStrictEqual(output)
}

function encode_decode(input, output = input, inputProps, outputProps) {
  expect(decode(encode(input, inputProps), outputProps)).toStrictEqual(output)

  if (!outputProps) {
    expect(Function(`return (${uneval(input, inputProps)})`)()).toStrictEqual(
      output
    )
  }
}

test('encode: primitives', function () {
  // null
  encode_only(null, 'n')
  encode_only(null, '', { filterByList: [null] })
  encode_decode(null)

  // undefined
  encode_only(void 0, 'u')
  encode_only(void 0, '', { filterByList: [void 0] })
  encode_decode(void 0)

  // boolean
  encode_only(true, 't')
  encode_only(true, '', { filterByList: [true] })
  encode_decode(true)
  encode_only(false, 'f')
  encode_only(false, '', { filterByList: [false] })
  encode_decode(false)

  // number
  encode_only(0, '0')
  encode_only(0, '', { filterByList: [0] })
  encode_decode(0)
  encode_only(-0, '-0')
  encode_only(-0, '', { filterByList: [0] })
  encode_decode(-0)
  encode_only(42.42, '42.42')
  encode_only(-42.42, '-42.42')
  encode_decode(42.42)
  encode_only(NaN, '+NaN')
  encode_only(NaN, '', { filterByList: [NaN] })
  encode_decode(NaN)
  encode_only(+Infinity, '+Infinity')
  encode_only(+Infinity, '', { filterByList: [+Infinity] })
  encode_decode(+Infinity)
  encode_only(-Infinity, '-Infinity')
  encode_only(-Infinity, '', { filterByList: [-Infinity] })
  encode_decode(-Infinity)

  // bigint
  encode_only(123456789n, 'i123456789')
  encode_decode(123456789n)
  encode_only(-123456789n, 'i-123456789')
  encode_decode(-123456789n)

  // string
  encode_only('Base', 'sBase')
  encode_decode('Base')
  const string = 'Строка·с·точками'
  encode_only(string, 'sСтрока\\u00b7с\\u00b7точками')
  encode_decode(string)

  // symbol
  encode_only(Symbol('Any'), 'k1·sAny')
  encode_only(Symbol('123'), 'k1·123')
  encode_decode(Symbol.for('12345'))
})

test('encode: standard objects', function () {
  // Boolean
  encode_only(new Boolean(true), 'T')
  encode_decode(new Boolean(true))
  encode_only(new Boolean(false), 'F')
  encode_decode(new Boolean(false))

  // Number
  encode_only(new Number(0), 'N1·0')
  encode_decode(new Number(0))
  encode_only(new Number(-0), 'N1·-0')
  encode_decode(new Number(-0))
  encode_only(new Number(42.42), 'N1·42.42')
  encode_only(new Number(-42.42), 'N1·-42.42')
  encode_only(new Number(NaN), 'N1·+NaN')
  encode_decode(new Number(NaN))
  encode_only(new Number(+Infinity), 'N1·+Infinity')
  encode_only(new Number(-Infinity), 'N1·-Infinity')

  // String
  encode_only(new String('Base'), 'W1·sBase')
  encode_only(new String('-123'), 'W1·-123')
  encode_decode(new String('-12345'))

  // RegExp
  let regexp = /\s*[^'"`·[\]]/
  encode_only(regexp, 'R1·s\\\\s*[^\'\\"`\\u00b7[\\\\]]')
  encode_decode(regexp)
  regexp = /\s*[^'"`·[\]]/gi
  encode_only(regexp, 'R1_2·s\\\\s*[^\'\\"`\\u00b7[\\\\]]·sgi')
  encode_decode(regexp)

  // Date
  encode_only(new Date(NaN), 'D')
  const date = new Date('2025-08-17T15:58:25.929Z')
  encode_only(date, 'D1·s2025-08-17T15:58:25.929Z')
  encode_decode(date)
})

test('encode: array', function () {
  // Array
  let array
  array = []
  encode_only(array, 'A0')
  encode_decode(array)
  encode_only(array, '', { removeEmptyObjects: true })
  encode_decode([array, 1], [, 1], { removeEmptyObjects: true })
  array = [null, 1, void 0, 3, [], , 6, ,]
  encode_decode(array)
  encode_decode(array, [, 1, , 3, [], , 6, ,], {
    filterByList: [null, void 0],
  })
  encode_decode(array, [null, 1, void 0, 3, , , 6, ,], {
    removeEmptyObjects: true,
  })
  encode_decode(array, [, 1, , 3, , , 6, ,], {
    filterByList: [null, void 0],
    removeEmptyObjects: true,
  })
  encode_decode(array, [null, 1, void 0, 3, [], 6], {
    removeArrayHoles: true,
  })
  encode_decode(array, [1, 3, 6], {
    filterByList: [null, void 0],
    removeEmptyObjects: true,
    removeArrayHoles: true,
  })

  encode_decode(array, [null, , void 0, , [], , , ,], {
    filterByFunction: (v) => typeof v !== 'number',
  })
  encode_decode(array, [null, void 0, []], {
    filterByFunction: (v) => typeof v !== 'number',
    removeArrayHoles: true,
  })
  encode_decode(array, [[]], {
    filterByList: [null, void 0],
    filterByFunction: (v) => typeof v !== 'number',
    removeArrayHoles: true,
  })
  encode_decode(array, [null, void 0], {
    filterByFunction: (v) => typeof v !== 'number',
    removeEmptyObjects: true,
    removeArrayHoles: true,
  })
})

test('encode: functions', function () {
  function FuncName() {}

  encode_only(FuncName, '')
  encode_only(FuncName, '', { prepareFunctions: () => null })
  encode_only(FuncName, '', { prepareFunctions: () => void 0 })

  encode_decode(FuncName, [12], { prepareFunctions: () => [12] })
  encode_decode(FuncName, [[], null], {
    filterByList: [null],
    removeEmptyObjects: true,
    prepareFunctions: () => [[], null],
  })
})

test('encode: keyed collections', function () {
  const set = new Set()
  const map = new Map()

  encode_only(set, 'S')
  set.add([])
  encode_only(set, '', { filterByList: [set] })
  encode_only(set, '', { removeEmptyObjects: true })
  encode_only(set, '', { filterByFunction: (v) => !(v instanceof Set) })
  encode_decode(set)

  encode_only(map, 'M')
  map.set(12, [])
  encode_only(map, '', { filterByList: [map] })
  encode_only(map, '', { removeEmptyObjects: true })
  encode_only(map, '', { filterByFunction: (v) => !(v instanceof Map) })
  encode_decode(map)
})

test('encode: typed arrays', function () {
  encode_decode(new Int8Array(2))
  encode_decode(new Int8Array([21, 31]))

  encode_decode(new Uint8Array(2))
  encode_decode(new Uint8Array([21, 31]))

  encode_decode(new Uint8ClampedArray(2))
  encode_decode(new Uint8ClampedArray([21, 31]))

  encode_decode(new Int16Array(2))
  encode_decode(new Int16Array([21, 31]))

  encode_decode(new Uint16Array(2))
  encode_decode(new Uint16Array([21, 31]))

  encode_decode(new Int32Array(2))
  encode_decode(new Int32Array([21, 31]))

  encode_decode(new Uint32Array(2))
  encode_decode(new Uint32Array([21, 31]))

  encode_decode(new Float32Array(2))
  encode_decode(new Float32Array([21, 31]))

  encode_decode(new Float64Array(2))
  encode_decode(new Float64Array([21, 31]))

  encode_decode(new BigInt64Array(2))
  encode_decode(new BigInt64Array([21n, 31n]))

  encode_decode(new BigUint64Array(2))
  encode_decode(new BigUint64Array([21n, 31n]))
})

test('encode: objects', function () {
  encode_decode({})
  encode_decode(Object.create(null))

  const a = { a: 1 }
  a._a = a
  const b = Object.create(a)
  b.b = 2
  b._a = a
  b._b = b
  const c = Object.create(b)
  c.c = 3
  c._a = a
  c._b = b
  c._c = c

  encode_decode(a)
  encode_decode(b)
  encode_decode(c)
})

test('encode: errors', function () {
  let e = new Error('12')
  encode_decode(e)

  e = new Error('asd', { cause: 12 })
  encode_decode(e)

  e = new AggregateError([1, 2, 3], 'asd', { cause: 12 })
  encode_decode(e)
})
