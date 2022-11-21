const cyclepack = require('../index').default
const { pack, unpack } = require('../index')

function thereandback(v) { return unpack(pack(v)) }

function compare(v) {
  expect(thereandback(v)).toStrictEqual(v)
  expect(unpack(JSON.parse(pack(v, null, true)))).toStrictEqual(v)
}

test('Base:', function() {
  compare(null)
  compare(void 0)

  const symbol = Symbol(42)
  expect(thereandback(symbol).toString()).toStrictEqual(symbol.toString())

  compare('')
  compare('42')
  compare('\n\n\\\\\\\n\r\n\\\\n\nnn\\\nn\n\n\nn\t')
  compare('\'\\$\'`\\`""``\\`\\`\\`"`\'\\"`\n`"\\n\'`\n\\n')

  compare({})
  compare([])
  compare({ q: '' })
  // eslint-disable-next-line comma-spacing
  compare(['some',,,, '\0`\ntext\t"\t', ,,, '',,,])

  compare(0)
  // todo
  // compare(-0)
  compare(42)
  compare(NaN)
  compare(-Infinity)
  compare([NaN, -Infinity, 42e42, 2343n])

  compare(true)
  compare(false)
  compare([true, false])

  // eslint-disable-next-line no-new-wrappers
  compare(new String(42))
  // eslint-disable-next-line no-new-wrappers
  compare(new Number(42))
  // eslint-disable-next-line no-new-wrappers
  compare(new Boolean(1))
  // eslint-disable-next-line no-new-wrappers
  compare(new Boolean(0))
  compare(new Array(42))

  const array = [1,,, 4, 5,,, 8, 9]
  array.qwe = 1212, array['0123'] = 11, array[1.23] = 13
  compare(array)
  // eslint-disable-next-line array-bracket-spacing
  const array2 = [1,,, [{ 4: 4 }, 5,,, ], [, 8, 9]]
  compare(array2)

  compare(new Date())
  compare(new Date(343454343))

  compare(/\s[^,]+/gi)

  compare(new Set())
  compare(new Map())
  compare(new Set([1, 2, 3]))
  compare(new Map([[1, 2], [3, 4]]))
})

test('Deep:', function() {
  const numbers = [[[42, NaN, 2343n, 34,,, 2, -42, -333, 333, 424,, 24,, 424, 22, 4]]]
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
  compare(FINAL_OBJECT)

  // let's create a string from it
  const packedString = cyclepack.pack(FINAL_OBJECT)
  console.log(packedString)

  const packedStringStringify = cyclepack.pack(FINAL_OBJECT, null, true)
  console.log(packedStringStringify)

  // let's restore our object
  const unpackedObject = cyclepack.unpack(packedString)

  // let's restore our object
  expect(unpackedObject).toStrictEqual(FINAL_OBJECT) // there will be true
})

test('ArrayBuffers and TypedArrays:', function() {
  const ab = new ArrayBuffer(8)
  // todo: not work
  // compare(ab)
  compare(new Int8Array(ab))

  const f32 = new Float64Array([1, 2.5, 3])
  compare(f32)

  const ab2 = f32.buffer
  compare(ab2)

  const dv = [ab2, new DataView(ab2), new DataView(ab)]
  compare(dv)

  const i8a = new Int8Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(i8a)
  compare(i8a.buffer)

  const u8ca = new Uint8ClampedArray([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(u8ca)
  compare(u8ca.buffer)

  const u8a = new Uint8Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(u8a)
  // todo: not work
  // compare(u8a.buffer)
  expect(thereandback(u8a.buffer)).toEqual(u8a.buffer)

  const i16a = new Int16Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(i16a)
  compare(i16a.buffer)

  const u16a = new Uint16Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(u16a)
  compare(u16a.buffer)

  const i32a = new Int32Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(i32a)
  compare(i32a.buffer)

  const u32a = new Int32Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(u32a)
  compare(u32a.buffer)

  const f32a = new Float32Array([1, 2.5, 3, 1, 2.5, 3, 7, 8])
  compare(f32a)
  compare(f32a.buffer)

  const bi64a = new BigInt64Array(2)
  compare(bi64a)
  compare(bi64a.buffer)

  const bu64a = new BigUint64Array(2)
  compare(bu64a)
  compare(bu64a.buffer)
})

test('Functions:', function() {
  function someFunc() {}
  function someFunc2() {}

  const stringWithoutProxy = pack(someFunc)
  // console.log(stringWithoutProxy)
  const unpackWithoutProxy = unpack(stringWithoutProxy)
  // console.log(unpackWithoutProxy)
  expect(unpackWithoutProxy).toStrictEqual('%someFunc%')

  const packed = pack([someFunc, someFunc2], function(func) {
    if (func === someFunc) return 'FN_UNIQUE_ID'
    return null
  })

  const unpacked = unpack(packed, function(fname) {
    if (fname === 'FN_UNIQUE_ID') return someFunc
    return null
  })

  // console.log(packed)
  // console.log(unpacked)
  expect(unpacked).toStrictEqual([someFunc, '%someFunc2%'])
})

// eslint-disable-next-line jest/no-commented-out-tests
// test('Errors:', () => {
//   expect([new Error('')]).toStrictEqual(new Error(''))
// })
