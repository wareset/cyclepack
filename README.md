# cyclepack
Packing and unpacking of built-in objects while preserving instances

It is needed to transfer large and complex data between the client and the server, or between workers

It seems that all standard JavaScript objects are supported

## What is it for?

1. More efficient than JSON.stringify:
```js
import cyclepack from 'cyclepack';
// or import { pack, unpack } from 'cyclepack'
// or const { pack, unpack } = require('cyclepack')

const SOME_BIG_OBJECT = [
  { deep: 0, type: 'Keyword', value: 'function' },
  { deep: 0, type: 'Space', value: ' ' },
  { deep: 0, type: 'Identifier', value: 'App' },
  { deep: 0, type: 'Punctuator', value: '(' },
  { deep: 1, type: 'Identifier', value: 'props' },
  { deep: 0, type: 'Punctuator', value: ')' },
  { deep: 0, type: 'Space', value: ' ' },
  { deep: 0, type: 'Punctuator', value: '{' },
  { deep: 1, type: 'Space', value: '\n  ' },
  { deep: 1, type: 'Keyword', value: 'return' },
  { deep: 1, type: 'Space', value: ' ' },
  { deep: 1, type: 'JSXTagOpenerStart', value: '<' },
  { deep: 2, type: 'Identifier', value: 'div' },
  { deep: 1, type: 'JSXTagOpenerEnd', value: '>' },
  { deep: 2, type: 'JSXText', value: 'some ' },
  { deep: 2, type: 'JSXExpressionStart', value: '{' },
  { deep: 3, type: 'Numeric', value: '12' },
  { deep: 2, type: 'JSXExpressionEnd', value: '}' },
  { deep: 1, type: 'JSXTagCloserStart', value: '</' },
  { deep: 2, type: 'Identifier', value: 'div' },
  { deep: 1, type: 'JSXTagCloserEnd', value: '>' },
  { deep: 1, type: 'Space', value: '\n' },
  { deep: 0, type: 'Punctuator', value: '}' }
]

// Example JSON.stringify:
const objectToJsonStringify = JSON.stringify(SOME_BIG_OBJECT)
console.log(objectToJsonStringify.length) // 1023 symbols

// Example cyclepack.pack:
const objectToCyclePack = cyclepack.pack(SOME_BIG_OBJECT)
console.log(objectToCyclePack.length) // 570 symbols

console.log(objectToCyclePack)
// [{"deep":a,"type":"Keyword","value":"function"},{t:a,u:"Space",w:" "},{t:a,u:"Identifier",w:"App"},{t:a,u:"Punctuator",w:"("},{t:b,u:ac,w:"props"},{t:a,u:af,w:")"},{t:a,u:z,w:aa},{t:a,u:af,w:"{"},{t:b,u:z,w:"\n  "},{t:b,u:v,w:"return"},{t:b,u:z,w:aa},{t:b,u:"JSXTagOpenerStart",w:"<"},{t:c,u:ac,w:"div"},{t:b,u:"JSXTagOpenerEnd",w:">"},{t:c,u:"JSXText",w:"some "},{t:c,u:"JSXExpressionStart",w:an},{t:d,u:"Numeric",w:Q12},{t:c,u:"JSXExpressionEnd",w:"}"},{t:b,u:"JSXTagCloserStart",w:"</"},{t:c,u:ac,w:ax},{t:b,u:"JSXTagCloserEnd",w:ba},{t:b,u:z,w:"\n"},{t:a,u:af,w:bm}]

const restoringObject = cyclepack.unpack(objectToCyclePack)

// jest
expect(SOME_BIG_OBJECT).toStrictEqual(restoringObject)
// the objects are completely equal
```

2. Considers references to objects:
```js
import cyclepack from 'cyclepack';

const object = { q: 1, w: 2, e: 3 }

const SOME_BIG_OBJECT = [
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
  object,
]

// Example JSON.stringify:
const objectToJsonStringify = JSON.stringify(SOME_BIG_OBJECT)
console.log(objectToJsonStringify.length) // 441

// Example cyclepack.pack:
const objectToCyclePack = cyclepack.pack(SOME_BIG_OBJECT)
console.log(objectToCyclePack.length) // 63

console.log(objectToCyclePack)
// [{"q":b,"w":c,"e":d},s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s,s]

// jest
expect(SOME_BIG_OBJECT).toStrictEqual(cyclepack.unpack(objectToCyclePack))
// the objects are completely equal
```

3. Works with recursive data:
```js
import cyclepack from 'cyclepack';

const SOME_BIG_OBJECT = { q: 1, w: 2, e: 3 }
SOME_BIG_OBJECT.r = SOME_BIG_OBJECT

// FAIL
// Example JSON.stringify:
// const objectToJsonStringify = JSON.stringify(SOME_BIG_OBJECT)
// Uncaught TypeError: Converting circular structure to JSON

// Example cyclepack.pack:
const objectToCyclePack = cyclepack.pack(SOME_BIG_OBJECT)
console.log(objectToCyclePack.length) // 63

console.log(objectToCyclePack)
// {"q":b,"w":c,"e":d,"r":r}

// jest
expect(SOME_BIG_OBJECT).toStrictEqual(cyclepack.unpack(objectToCyclePack))
```

4. Restores standard JavaScript objects:
```js
import cyclepack from 'cyclepack';

const SET = new Set([1, 2, 3, 4, 5])

const setToCyclePack = cyclepack.pack(SET)

// jest
expect(SET).toStrictEqual(cyclepack.unpack(setToCyclePack))
// the objects are completely equal
```

### List of supported objects:
- BigInt
- Object
- Boolean
- Symbol
- Number
- Date
- String
- RegExp
- Array
- Map
- Set
- ArrayBuffer
- DataView
- Int8Array
- Uint8Array
- Uint8ClampedArray
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array
- BigInt64Array
- BigUint64Array
- Function* (Async and Generator) (more on this below)
- Error* (more on this below)
- AggregateError*
- EvalError*
- RangeError*
- ReferenceError*
- SyntaxError*
- TypeError*
- URIError*

### *Transfer of functions
The `cyclepack` will not transfer the source code of any functions. Instead, their names will be transmitted. And when unpacking, they will be wrapped in a sign `%`:
```js
import cyclepack from 'cyclepack';

const someFunc = () => {}

const packed = cyclepack.pack(someFunc)
console.log(packed) // Z"someFunc"

const unpacked = cyclepack.unpack(packed)
console.log(unpacked) // %someFunc%
```

But, to identify the functions, the `cyclepack` has a second parameter `proxyForFunctions`:
```js
import cyclepack from 'cyclepack';

const someFunc = () => {}
const someFunc2 = () => {}

const packed = cyclepack.pack([someFunc, someFunc2], (func) => {
  if (func === someFunc) return 'FN_UNIQUE_TEXT_ID'
  return null
})
console.log(packed) // [Z"FN_UNIQUE_TEXT_ID",Z"someFunc2"]

const unpacked = cyclepack.unpack(packed, (fnID) => {
  if (fnID === 'FN_UNIQUE_TEXT_ID') return someFunc
  return null
})
console.log(unpacked) // [someFunc, '%someFunc2%']

// jest
expect(unpacked).toStrictEqual([someFunc, '%someFunc2%']) // there will be true
```

### *Transfer Errors
```js
import cyclepack from 'cyclepack';

class ServerError extends URIError {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

const msg = {
  type: 'fail',
  data: new ServerError('Page not found', 404)
}

const msgToCyclePack = cyclepack.pack(msg)
console.log(msgToCyclePack)
// {"type":"fail","data":EUR{"code":404,"message":"Page not found"}}

const unpackedMSG = cyclepack.unpack(msgToCyclePack)
console.log(unpackedMSG)
// unpackedMSG equal to:
const res = { 
  type: 'fail', 
  data: new URIError('Page not found')
 }
res.data.code = 404
```

### Additional serialization:
Sometimes you need to pass an additional serialization string:
```js
import { pack, unpack } from 'cyclepack';

const data = ['some data']

const packed = pack(data, null, true) // the third parameter should be 'true'
console.log(JSON.stringify(pack(data)) === packed) // true

const unpacked = unpack(JSON.parse(packed))

// jest
expect(data).toStrictEqual(unpacked) // true
```

## License
[MIT](LICENSE)
