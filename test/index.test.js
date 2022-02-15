const cyclepack = require('../index').default
const { build, parse } = require('../index')

const thereandback = (v) => parse(build(v))

test('Base:', () => {
  expect(thereandback(null)).toEqual(null)
  expect(thereandback(void 0)).toEqual(void 0)

  const symbol = Symbol(42)
  expect(thereandback(symbol).toString()).toEqual(symbol.toString())

  expect(thereandback('')).toEqual('')
  expect(thereandback('42')).toEqual('42')
  const texts = ['some', '\0`\ntext\t"\t', '']
  expect(thereandback(texts)).toEqual(texts)
  expect(thereandback({ q: '' })).toEqual({ q: '' })

  expect(thereandback(42)).toEqual(42)
  const numbers = [NaN, -Infinity, 42e42, 2343n]
  expect(thereandback(numbers)).toEqual(numbers)

  const booleans = [true, false]
  expect(thereandback(booleans)).toEqual(booleans)

  expect(thereandback({})).toEqual({})
  // eslint-disable-next-line no-new-wrappers
  expect(thereandback(new String(42))).toEqual(new String(42))
  // eslint-disable-next-line no-new-wrappers
  expect(thereandback(new Number(42))).toEqual(new Number(42))
  // eslint-disable-next-line no-new-wrappers
  expect(thereandback(new Boolean(1))).toEqual(new Boolean(1))

  expect(thereandback([])).toEqual([])
  expect(thereandback(new Array(12))).toEqual(new Array(12))
  const array = [1,,, 4, 5,,, 8, 9]
  array.qwe = 1212, array['0123'] = 11
  expect(thereandback(array)).toEqual(array)
  // eslint-disable-next-line array-bracket-spacing
  const array2 = [1,,, [{ 4: 4 }, 5,,, ], [, 8, 9]]
  expect(thereandback(array2)).toEqual(array2)

  const date = new Date()
  expect(thereandback(date)).toEqual(date)

  const regex = /\s[^,]+/gi
  expect(thereandback(regex)).toEqual(regex)
  expect(thereandback([regex, regex])).toEqual([regex, regex])

  const set = new Set([1, 2, 3])
  expect(thereandback(set)).toEqual(set)
  const map = new Map([[1, 2], [3, 4]])
  expect(thereandback(map)).toEqual(map)
  expect(thereandback(new Set())).toEqual(new Set())
  expect(thereandback(new Map())).toEqual(new Map())

  const int8 = new Int8Array(64)
  expect(thereandback(int8)).toEqual(int8)
})

test('Deep:', () => {
  const numbers = [[[42, NaN, 2343n, 34,,, 2, -42, 424,, 24,, 424, 22, 4]]]
  const texts = [,,, 'some', numbers, ,,, numbers,, '42']
  const set = new Set([1, { numbers }, texts, new Int16Array(2)])
  const date = new Date()
  const regex = /\s[^,]+/gi
  const array = [{ texts }, { regex }, ,,, regex, true, { numbers, date }]
  const map = new Map([[{ array }, set], [{ set }, texts], [set, set]])
  const object = { array, texts, set, map, regex, date, numbers }
  set.add(set)
  array.push(object, array)
  texts.texts = texts
  object.object = object[0] = object
  texts.numbers = numbers.object = set

  // it turned out to be a very strange object
  const FINAL_OBJECT = [set, object, map, set, object, array]

  // let's create a string from it
  const packedString = cyclepack.build(FINAL_OBJECT)
  console.log(packedString)

  // let's restore our object
  const unpackedObject = cyclepack.parse(packedString)

  // let's restore our object
  expect(unpackedObject).toEqual(FINAL_OBJECT) // there will be true
})

test('ArrayBuffer:', () => {
  const ab = new Float64Array([1, 2.5, 3]).buffer
  expect(thereandback(ab)).toEqual(ab)

  // console.log(stringify(ab))

  const dv = [ab, new DataView(ab)]
  expect(thereandback(dv)).toEqual(dv)
})

test('Functions:', () => {
  const someFunc = () => {}
  const someFunc2 = () => {}

  const stringWithoutProxy = build(someFunc)
  // console.log(stringWithoutProxy)
  const unpackWithoutProxy = parse(stringWithoutProxy)
  // console.log(unpackWithoutProxy)
  expect(unpackWithoutProxy).toEqual('%someFunc%')

  const packed = build([someFunc, someFunc2], (func) => {
    if (func === someFunc) return 'FN_UNIQUE_ID'
    return null
  })

  const unpacked = parse(packed, (fname) => {
    if (fname === 'FN_UNIQUE_ID') return someFunc
    return null
  })

  // console.log(packed)
  // console.log(unpacked)
  expect(unpacked).toEqual([someFunc, '%someFunc2%'])
})
