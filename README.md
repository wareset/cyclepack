# cyclepack
Packing and unpacking of built-in objects while preserving instances

It is needed to transfer large and complex data between the client and the server, or between workers

It seems that all standard JavaScript objects are supported

## Usage
```js
import cyclepack from 'cyclepack';
// or import { build, parse } from 'cyclepack'
// or const cyclepack = require('cyclepack').default

// let's create an object with many recursive instances
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
const FINAL = [set, object, map, set, object, array]

// let's create a string from it
const packedString = cyclepack.build(FINAL)
console.log(packedString)
// [T(b,{"numbers":[[[42,m,LQ2343,34,,,c,-y,424,,24,,ae,22,e]],"object":s]},[,,,"some",v,,,,v,,Qy,"texts":ai,u:s],I16"0,0",s),{Qa:an,"array":[{al:ai},{"regex":R"\\s[^,]+,gi"},,,,au,n,{u:v,"date":D1644779546922},an,aq],al:ai,"set":s,"map":M({ap:aq}:s,{ba:s}:ai,s:s),at:au,ax:ay,u:v,ah:an},bc,s,an,aq]

// let's restore our object
const unpackedObject = cyclepack.parse(packedString)

// compare objects (jest)
test('Compare:', () => {
  expect(unpackedObject).toEqual(FINAL) // there will be true
})
```

## Transfer of functions
The `cyclepack` will not transfer the source code of any functions. Instead, their names will be transmitted. And when unpacking, they will be wrapped in a sign `%`:
```js
import cyclepack from 'cyclepack';

const someFunc = () => {}

const packed = cyclepack.build(someFunc)
console.log(packed) // E"someFunc"

const unpacked = cyclepack.parse(packed)
console.log(unpacked) // %someFunc%
```

But, to identify the functions, the `cyclepack` has a second parameter `proxyForFunctions`:
```js
import cyclepack from 'cyclepack';

const someFunc = () => {}
const someFunc2 = () => {}

const packed = cyclepack.build([someFunc, someFunc2], (func) => {
  if (func === someFunc) return 'FN_UNIQUE_ID'
  return null
})
console.log(packed) // [E"FN_UNIQUE_ID",E"someFunc2"]

const unpacked = cyclepack.parse(packed, (fname) => {
  if (fname === 'FN_UNIQUE_ID') return someFunc
  return null
})
console.log(unpacked) // [someFunc, '%someFunc2%']

test('Compare:', () => {
  expect(unpacked).toEqual([someFunc, '%someFunc2%']) // there will be true
})
```

## License
[MIT](LICENSE)
