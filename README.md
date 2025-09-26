# cyclepack

Данная библиотека умеет "упаковывать"/"распаковывать", а так же создавать "eval" код для разных javascript объектов и примитивов. Она очень похожа на библиотеки [devalue](https://github.com/sveltejs/devalue) и ей подобные, но имеет больше возможностей и настроек.

## Зачем?

Из всех существующих решений найти подходящий инструмент не удалось.

Например `devalue`, кажется самой лучшей, но:

```js
// version 5.1.1
import * as devalue from 'devalue'

const data = [Symbol.for('123')]

const str = devalue.stringify(data)
console.log(str) // [[1],Symbol(123)]

const obj = devalue.parse(str)
// Упадёт с ошибкой:
/*
01:58:43.123 VM106446:1 Uncaught SyntaxError: Unexpected token 'S',
"[[1],Symbol(123)]" is not valid JSON
    at JSON.parse (<anonymous>)
    at parse (build.js:233:25)
    at build.js:617:15
    at build.js:628:3
parse @ build.js:233
(анонимная) @ build.js:617
(анонимная) @ build.js:628
*/
```

Именно поэтому и приходится писать собственные решения.

## Установка:

На `npm` лежит первая версия, написанная несколько лет назад и использовать её не стоит. Здесь лежит вторая версия, но она еще не добавлена на `npm` и поэтому, чтобы установить её с `github`, нужно прописать следующее в `package.json`:

package.json

```json
{
  "dependencies": {
    "cyclepack": "wareset/cyclepack"
  }
}
```

## Примеры:

Примитивы:

```js
import * as cyclepack from 'cyclepack'

console.log(cyclepack.encode(123)) // '123'
console.log(cyclepack.encode('123')) // 't123'
console.log(cyclepack.encode(Symbol.for('123'))) // 'k1·123'
console.log(cyclepack.encode(null)) // 'n'
console.log(cyclepack.encode(void 0)) // ''
```

Объект с объектным прототипом:

```js
import * as cyclepack from 'cyclepack'

// Создадим объект с прототипом
const proto = { a: 1 }
proto.self = proto

const object = Object.create(proto)
object.b = 2
object[Symbol.for('123')] = 123

// наш объект
const data = object

// превращаем его в строку
const str = cyclepack.encode(data)
console.log(str)
// P1_6:5,8:7·O1_3:2,4:1·1·ta·tself·2·tb·123·k7

// возвращаем из строки первоначальный объект
const obj = cyclepack.decode(str)

// obj и data будут полностью эквивалентны
// 'node:assert'
assert.deepStrictEqual(obj, data)

// превратим объект в исполняемый код
const forEval = cyclepack.uneval(data)
console.log(forEval)
/*
(function() {
var
v2=1,
v3="a",
v4="self",
v1={},
v5=2,
v6="b",
v7=123,
v8=Symbol.for(v7),
v0=Object.create(v1)
v1[v3]=v2
v1[v4]=v1
v0[v6]=v5
v0[v8]=v7
return v0
})()
*/
```

## Инструкция:

В `cyclepack` входят 3 функции `encode`, `decode` и `uneval`:

```typescript
interface IEncodeOrUnevalOptions {
  filterByList?: any[]
  filterByFunction?: (Any) => boolean

  removeArrayHoles?: boolean
  removeEmptyObjects?: boolean

  prepareFunctions?: null | ((Function) => any)
  prepareClasses?: null | ((Object) => any)
  prepareErrors?: null | ((Error) => any)
}

function encode(data: any, options?: IEncodeOrUnevalOptions): string
function uneval(data: any, options?: IEncodeOrUnevalOptions): string

interface IDecodeOptions {
  prepareFunctions?: null | ((data) => any)
  prepareClasses?: null | ((data) => any)
  prepareErrors?: null | ((data) => any)
}

function decode(data: string, options?: IDecodeOptions): any
```

Основная задача данной библиотеки - упаковать данные для передачи между сервером и клиентом, или создать готовые данные (через uneval) чтобы вставить их в шаблон для SSR, например. Но часто не все данные нужны для передачи. Поэтому у функций есть опции, которые позволят подготовить все данные более правильно.

### Options: filterByList

Массив `filterByList` позволяет исключить какие-либо данные из упаковки.

Например:

```js
import * as cyclepack from 'cyclepack'

// Какие-то данные
const data = {
  ondrag: null,
  ondragend: [-1, 0, NaN, 1],
  ondragenter: null,
  ondragleave: [0, -0, NaN, 1],
  ondragover: null,
  ondragstart: null,
}

// Нам нужно передать только актуальные значения
// и отфильтровать 'null', '0' и 'NaN'
const options = {
  filterByList: [null, 0, NaN],
}

const str = cyclepack.encode(data, options)
// O1_5:1,7:6·A4_2,4:3·-1·1·3·tondragend·A4·tondragleave

const obj = cyclepack.decode(str)
// Результат:
obj ===
  {
    ondragend: [-1, , , 1],
    ondragleave: [, , , 1],
  }

const forEval = cyclepack.uneval(data, options)
// Результат:
/*
(function() {
var
v2=-1,
v3=1,
v1=Array(4),
v4="ondragend",
v5=Array(4),
v6="ondragleave",
v0={}
v1[0]=v2
v1[3]=v3
v0[v4]=v1
v5[3]=v3
v0[v6]=v5
return v0
})()
*/
```

### Options: filterByFunction

Функция `filterByFunction` работает как `filter` у массива.

Например:

```js
import * as cyclepack from 'cyclepack'

const data = [
  0,
  'ondrag',
  -3,
  'ondragend',
  9,
  'ondragenter',
  -0,
  'ondragleave',
  4,
]

// Например, удалим все строки из упаковки
const options = {
  filterByFunction: (v) => typeof v !== 'string',
}

const str = cyclepack.encode(data, options)
// A9_1,3:2,5:4,7:6,8:5·0·-3·2·9·4·-0·6·8

const obj = cyclepack.decode(str)
// Результат:
obj === [0, , -3, , 9, , 0, , 4]

const forEval = cyclepack.uneval(data, options)
// Результат:
/*
(function() {
var
v1=0,
v2=-3,
v3=9,
v4=-0,
v5=4,
v0=Array(9)
v0[0]=v1
v0[2]=v2
v0[4]=v3
v0[6]=v4
v0[8]=v5
return v0
})()
*/
```

### Options: removeArrayHoles

По умолчанию `cyclepack` оставляет "дыры" в массивах. Опция `removeArrayHoles` позволяет убрать их.

Пример:

```js
import * as cyclepack from 'cyclepack'

// Массив из примера выше
const data = [0, , -3, , 9, , 0, , 4]

const options = {
  removeArrayHoles: true,
}

const str = cyclepack.encode(data, options)
// A0_1,2,3,1,4·0·-3·9·4

const obj = cyclepack.decode(str)
// Результат:
obj === [0, -3, 9, 0, 4]

const forEval = cyclepack.uneval(data, options)
// Результат:
/*
(function() {
var
v1=0,
v2=-3,
v3=9,
v4=4,
v0=[]
v0[0]=v1
v0[1]=v2
v0[2]=v3
v0[3]=v1
v0[4]=v4
return v0
})()
*/
```

### Options: removeEmptyObjects

Опция `removeEmptyObjects` позволяет удалить все пустые `объекты`. А так же пустые `массивы`, `Map` и `Set`.

Пример:

```js
import * as cyclepack from 'cyclepack'

{
  const data = {
    not_empty: 1,

    empty_object: { q: {} },
    empty_array: [{}, []],
    // поведение с упаковкой Map будет объяснено ниже
    empty_Map: new Map([[1, {}]]),
    empty_Set: new Set([{}, []]),
  }

  const options = {
    removeEmptyObjects: true,
  }

  const str = cyclepack.encode(data, options)
  // O1_2:1·1·tnot_empty

  const obj = cyclepack.decode(str)
  // Результат:
  obj ===
    {
      not_empty: [1],
    }

  const forEval = cyclepack.uneval(data, options)
  // Результат:
  /*
(function() {
var
v1=1,
v2="not_empty",
v0={}
v0[v2]=v1
return v0
})()
*/
}

// `cyclepack` рекурсивно пропускал все пустые объекты.
// В итоге в результат попал только главный объект со
// свойством 'not_empty', которое равно '1'
// а теперь удалим и его:

{
  const data = {
    empty_object: { q: {} },
    empty_array: [{}, []],
    empty_Set: new Set([{}, []]),
  }

  const options = {
    removeEmptyObjects: true,
  }

  const str = cyclepack.encode(data, options)
  // '' - пустая строка

  const obj = cyclepack.decode(str)
  // Результат:
  obj === undefined

  const forEval = cyclepack.uneval(data, options)
  // Результат:
  /*
  void 0
  */
}

// Объект 'data', оказался полностью пустой и поэтому
// был полностью исключён. Это стоит иметь ввиду.
```

## Особенности упаковки javascript объектов и примитивов:

Полный список того, что упаковывается:

- Примитивы:
  - undefined
  - null
  - boolean
  - number
  - bigint
  - string
  - symbol
  - function (о функциях информация ниже)
- Базовые объекты:
  - Boolean
  - Number
  - String
  - RegExp
  - Date
  - Array
  - Object
  - Set
  - Map
  - URL
  - URLSearchParams
  - DataView
  - ArrayBuffer
- Типизированные массивы:
  - Int8Array
  - Uint8Array
  - Uint8ClampedArray
  - Int16Array
  - Uint16Array
  - Int32Array
  - Uint32Array
  - BigInt64Array
  - BigUint64Array
  - Float16Array
  - Float32Array
  - Float64Array
- Объекты ошибок (о них информация ниже):
  - Error
  - AggregateError
  - EvalError
  - RangeError
  - ReferenceError
  - SyntaxError
  - TypeError
  - URIError

У `Array` и `Map` есть определённые правила упаковки.

### Специфика Array

У массивов упаковываются не только целочисленные ключи, но и любые другие, установленные дополнительно. Например:

```js
import * as cyclepack from 'cyclepack'

const array = /\s/.exec('some string')

const str = cyclepack.encode(array)
// A1_1,3:2,5:4,7:6·t ·3·tindex·tqwe asd·tinput·u·tgroups

const obj = cyclepack.decode(str)
// obj === [' ', index: 4, input: 'some string', groups: undefined]
```

Все дополнительные свойства (`index`, `input`, `groups`) для массива, так же были сохранены. Поскольку добавление нецелочисленных ключей в массив является частой практикой, что даже подтверждается примером выше.

То есть `Array` и `Object` обрабатываются одинаково. Все остальные объекты обрабатываются в соответствии со спецификой их работы. Например:

```js
{
  const regexp = /[^]/gi
  regexp['some_key_1'] = 42

  const str = cyclepack.encode(regexp)
  // R1_2·t[^]·tgi

  const obj = cyclepack.decode(str)
  obj === new RegExp('[^]', 'gi')

  // Свойство 'some_key_1' будет проигнорировано
}

// или

{
  const set = new Set([1, 2])
  set['some_key_2'] = 42

  const str = cyclepack.encode(set)
  // S1,2·1·2

  const obj = cyclepack.decode(str)
  obj === new Set([1, 2])

  // Свойство 'some_key_2' будет проигнорировано
}

// и так далее, для всех остальных базовых объектов
```

## License

[MIT](LICENSE)
