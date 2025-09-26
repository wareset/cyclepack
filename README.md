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

То есть, если при упаковке данных в них, даже случайно окажется `Symbol`, `devalue` упакует их без каких-либо предупреждений. Но, при попытке распаковать эти данные, всё упадёт.

Именно поэтому и приходится писать собственные решения.

## Установка:

На `npm` лежит первая версия `cyclepack`, написанная несколько лет назад и использовать её не стоит. Здесь сейчас лежит вторая версия, но она еще не добавлена на `npm` и поэтому, чтобы установить её с `github`, нужно прописать следующее в `package.json`:

package.json

```json
{
  "dependencies": {
    "cyclepack": "wareset/cyclepack"
  }
}
```

## Наглядный пример возможностей:

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

// упаковываем его в строку
const str = cyclepack.encode(data)
console.log(str)
// P1_6:5,8:7·O1_3:2,4:1·1·ta·tself·2·tb·123·k7

// возвращаем из строки первоначальный объект
const obj = cyclepack.decode(str)

// obj и data будут полностью идентичны
// 'node:assert'
assert.deepStrictEqual(obj, data)
// далее, в качестве идентичности,
// будет использоваться такая форма записи:
obj == data

// превратим объект в исполняемый код
const forEval = cyclepack.uneval(data)
eval(forEval) == data
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

Основная задача данной библиотеки - упаковать данные для передачи между сервером и клиентом, или создать готовые данные (через uneval) чтобы, например, вставить их в шаблон для SSR. Но часто не все данные нужны для передачи. Поэтому у функций есть опции, которые позволят подготовить все данные более правильно.

### Options: filterByList

Массив `filterByList` позволяет исключить какие-либо значения из упаковки.

#### Например:

```js
import * as cyclepack from 'cyclepack'

// Какие-то данные
const data = {
  map: new Map([[NaN, 42], [999, 0]]),
  ondragend: 0,
  ondragenter: null,
  ondragleave: [0, -0, NaN, 1],
  ondragover: NaN,
  ondragstart: null,
}

const options = {
  // Нам нужно передать только актуальные значения
  // и исключить 'null', '0' и 'NaN':
  filterByList: [null, 0, NaN],
}

const str = cyclepack.encode(data, options)
// O1_4:1,8:5·M2,3·+NaN·42·tmap·A4_7:6·1·3·tondragleave

const obj = cyclepack.decode(str)
// Результат:
// Все 'null', '0' и 'NaN' были исключены,
// но в 'Map' ключ 'NaN' остался, потому что
// значение '42' без него существовать не может
obj ==
  {
    map: new Map([[NaN, 42]])
    ondragleave: [, , , 1],
  }

const forEval = cyclepack.uneval(data, options)
// Результат:
eval(forEval) == obj
/*
(function() {
var
v2=NaN,
v3=42,
v1=new Map(),
v4="map",
v6=1,
v5=Array(4),
v7="ondragleave",
v0={}
v1.set(v2,v3)
v0[v4]=v1
v5[3]=v6
v0[v7]=v5
return v0
})()
*/
```

### Options: filterByFunction

Функция `filterByFunction` оставляет только те значения, при которых возвращает положительный результат (как `filter` у массива).

#### Например:

```js
import * as cyclepack from 'cyclepack'

const data = [
  1,
  null,
  -0,
  2,
  'ondrag',
  0,
  3,
  'ondragend',
  NaN,
  4,
  'ondragenter',
  -0,
  5,
]

const options = {
  // Это осталось с прошлого примера чтобы показать,
  // что все опции могут работать одновременно:
  filterByList: [null, 0, NaN],
  // Например, так мы исключим все строки:
  filterByFunction: (v) => typeof v !== 'string',
}

const str = cyclepack.encode(data, options)
// A13_1,3:2,4:3,6:5,8:7·1·2·3·6·4·9·5·12

const obj = cyclepack.decode(str)
// Результат:
// Исчезли все 'null', '0' и 'NaN', а так же все строки
obj == [1, , , 2, , , 3, , , 4, , , 5]

const forEval = cyclepack.uneval(data, options)
// Результат:
eval(forEval) == obj
/*
(function() {
var
v1=1,
v2=2,
v3=3,
v4=4,
v5=5,
v0=Array(13)
v0[0]=v1
v0[3]=v2
v0[6]=v3
v0[9]=v4
v0[12]=v5
return v0
})()
*/
```

### Options: removeArrayHoles

По умолчанию `cyclepack` оставляет "дыры" в массивах. Опция `removeArrayHoles` позволяет убрать их.

#### Пример:

```js
import * as cyclepack from 'cyclepack'

const data = new Map([
  [
    // key
    [1, 0, , 2, , null],
    // value
    [3, NaN, , 4, , -0],
  ],
])

const options = {
  // Это осталось с прошлого примера:
  filterByList: [null, 0, NaN],
  // Уберём "дыры" из массивов:
  removeArrayHoles: true,
}

const str = cyclepack.encode(data, options)
// M1,4·A0_2,3·1·2·A0_5,6·3·4

const obj = cyclepack.decode(str)
// Результат:
// Исчезли все 'null', '0', 'NaN' и все "дыры" в массивах
obj ==
  new Map([
    [
      // key
      [1, 2],
      // value
      [3, 4],
    ],
  ])

const forEval = cyclepack.uneval(data, options)
// Результат:
eval(forEval) == obj
/*
(function() {
var
v2=1,
v3=2,
v1=[],
v5=3,
v6=4,
v4=[],
v0=new Map()
v1[0]=v2
v1[1]=v3
v4[0]=v5
v4[1]=v6
v0.set(v1,v4)
return v0
})()
*/
```

### Options: removeEmptyObjects

Опция `removeEmptyObjects` позволяет удалить все пустые `объекты`. А так же пустые `массивы`, `Map` и `Set`.

#### Пример:

```js
import * as cyclepack from 'cyclepack'

{
  const data = {
    not_empty: 1,

    empty_object: { q: { w: -0 } },
    empty_array: [{}, [0, -0, NaN]],
    empty_Map: new Map([[1, {}]]),
    empty_Set: new Set([{}, [NaN]]),
  }

  const options = {
    // Это осталось с прошлого примера:
    filterByList: [0, NaN],
    // Исключим все пустые объекты:
    removeEmptyObjects: true,
  }

  const str = cyclepack.encode(data, options)
  // O1_2:1·1·tnot_empty

  const obj = cyclepack.decode(str)
  // Результат:
  obj == { not_empty: [1] }

  const forEval = cyclepack.uneval(data, options)
  // Результат:
  eval(forEval) == obj
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

// Значения '0' и 'NaN' были исключены через 'filterByList' и
// `cyclepack` рекурсивно исключал все условно пустые объекты.
// В итоге в результат попал только главный объект со
// свойством 'not_empty', которое равно '1'
// а теперь удалим и его:

{
  const data = {
    empty_object: { q: { w: -0 } },
    empty_array: [{}, [0, -0, NaN]],
    empty_Map: new Map([[1, {}]]),
    empty_Set: new Set([{}, [NaN]]),
  }

  const options = {
    filterByList: [0, NaN],
    removeEmptyObjects: true,
  }

  const str = cyclepack.encode(data, options)
  // '' - пустая строка

  const obj = cyclepack.decode(str)
  // Результат:
  obj == undefined

  const forEval = cyclepack.uneval(data, options)
  // Результат:
  eval(forEval) == obj
  /*
  void 0
  */
}

// Объект 'data', оказался полностью пустой и
// поэтому был полностью убран. Это стоит иметь ввиду.
```

### Options: prepareFunctions

Функция `prepareFunctions` используется для подготовки функций к упаковке/распаковке (`encode`/`decode`) или передаче к исполнению (`uneval`).

#### Пример, где `prepareFunctions` равна `void 0` или `null`:

```js
import * as cyclepack from 'cyclepack'

const options = {
  // Все эти опции полностью эквивалентны
  // и любая функция будет исключена:
  prepareFunctions: void 0,
  prepareFunctions: null,
  prepareFunctions: () => void 0,
  prepareFunctions: () => null,
}

const data = {
  fn: () => {},
  map: new Map([[() => {}, 42]]),
}

const str = cyclepack.encode(data, options)
// O1_2:1·M·tmap

const obj = cyclepack.decode(str)
// Результат:
// Все функции были исключены.
// Значение '42' из 'Map' так же пропало, потому что
// не может существовать без ключа, который был функцией.
obj == { map: new Map([]) }

const forEval = cyclepack.uneval(data, options)
// Результат:
eval(forEval) == obj
/*
(function() {
var
v1=new Map(),
v2="map",
v0={}
v0[v2]=v1
return v0
})()
*/
```

#### Используем `prepareFunctions` в `encode`/`decode`:

```js
import * as cyclepack from 'cyclepack'

const my_super_fn = () => {}

const data = {
  fn_1: my_super_fn,
  fn_2: () => {},
  str: 'some string',
}

const optionsForEncode = {
  // укажем для примера:
  filterByFunction: (v) => typeof v !== 'string',
  // Подготовим функцию к упаковке.
  // Используем самый простой способ, чтобы была понятна суть:
  prepareFunctions: (fn) => {
    if (fn === my_super_fn) return 'MY_SUPER_FN'
  },
}

const str = cyclepack.encode(data, optionsForEncode)
// O1_3:1·f2·tMY_SUPER_FN·tfn_1

const obj = cyclepack.decode(str)
// Результат:
obj == { fn_1: 'MY_SUPER_FN' }

/*
Функция 'fn_2' была исключена, а вот для 'fn_1' вернулась
строка 'MY_SUPER_FN', даже не смотря на то, что у нас стоит 
'filterByFunction', которая фильтрует все строки (и из-за неё
была отфильтрована строка 'some string').

Важно:
При вызове 'prepareFunctions', 'prepareClasses' и 'prepareErrors',
никакие модификации ('filterByList', 'filterByFunction',
'removeArrayHoles', 'removeEmptyObjects') к возвращающему значению
не применяются.
*/

/*
А теперь поймаем 'MY_SUPER_FN':
*/

const optionsForDecode = {
  prepareFunctions: (v) => {
    if (v === 'MY_SUPER_FN') return my_super_fn
  },
}

const obj_2 = cyclepack.decode(str, optionsForDecode)
// Результат:
// Ключ 'fn_1' хранит 'my_super_fn', как и у объекта 'data'
obj_2 == { fn_1: my_super_fn }
```

#### Используем `prepareFunctions` в `uneval`:

```js
import * as cyclepack from 'cyclepack'

const my_super_fn = () => {}

const data = {
  fn_1: my_super_fn,
  fn_2: () => {},
}

{
  const optionsForUneval = {
    // укажем для примера:
    filterByFunction: (v) => typeof v !== 'string',
    // Если возвращается не строка, то значение будет упаковано,
    // но без каких-либо модификаций (типа 'filterByFunction'):
    prepareFunctions: (fn) => {
      if (fn === my_super_fn) return ['MY_SUPER_FN']
    },
  }

  const forEval = cyclepack.uneval(data, optionsForUneval)
  // Результат:
  eval(forEval) == { fn_1: ['MY_SUPER_FN'] }
  /*
(function() {
var
v3="MY_SUPER_FN",
v2=Array(1),
v1=v2,
v4="fn_1",
v0={}
v2[0]=v3
v0[v4]=v1
return v0
})()
  */
}

{
  const optionsForEncode = {
    // Если возвращается строка, то она будет помещена
    // в финальный результат как есть, без изменений:
    prepareFunctions: (fn) => {
      if (fn === my_super_fn) return 'my_super_fn'
    },
  }
  const forEval = cyclepack.uneval(data, optionsForUneval)
  // Результат:
  // Строка 'my_super_fn' помещена в 'forEval' без изменений
  // Нужно иметь это ввиду и помнить об XSS уязвимостях
  eval(forEval) == { fn_1: my_super_fn }
  /*
(function() {
var
v1=my_super_fn,
v2="fn_1",
v0={}
v0[v2]=v1
return v0
})()
  */
}
```

### Options: prepareClasses

Функция `prepareClasses` используется для подготовки классовых объектов к упаковке/распаковке (`encode`/`decode`) или передаче к исполнению (`uneval`).

В `prepareClasses` возвращаемые значения `void 0` и `null` ведут себя по разному.

#### Пример, где `prepareClasses` равна `null`:

```js
import * as cyclepack from 'cyclepack'

class CustomClass {}
class CustomArray extends Array {}

const data = {
  object: { q: 1 },
  map: new Map([[new CustomClass(), 999]]),
  customClass: new CustomClass(),
  customArray: new CustomArray(42),
}

const options = {
  // Эти опции полностью эквивалентны
  // и любой нестандартный объект будет исключён:
  prepareClasses: null,
  prepareClasses: () => null,
}

const str = cyclepack.encode(data, options)
// O1_4:1,6:5·O1_3:2·1·tq·tobject·M·tmap

const obj = cyclepack.decode(str)
// Результат:
// Все нестандартные объекты были исключены
obj ==
  {
    object: { q: 1 },
    map: new Map([]),
  }

const forEval = cyclepack.uneval(data, options)
// Результат:
eval(forEval) == obj
/*
(function() {
var
v2=1,
v3="q",
v1={},
v4="object",
v5=new Map(),
v6="map",
v0={}
v1[v3]=v2
v0[v4]=v1
v0[v6]=v5
return v0
})()
*/
```

#### Используем `prepareClasses`:

```js
import * as cyclepack from 'cyclepack'

class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const data = { vec: new Vector2D(21, 42) }

// Пример опций для 'encode'/'decode':
{
  const optionsForEncode = {
    // укажем для примера:
    filterByFunction: (v) => typeof v !== 'string',
    // Подготовим класс к упаковке.
    // Используем самый простой способ, чтобы была понятна суть:
    prepareClasses: (obj) => {
      if (obj instanceof Vector2D) return ['Vector2D', obj.x, obj.y]
    },
  }

  const str = cyclepack.encode(data, optionsForEncode)
  // O1_6:1·C2·A3_3,4,5·tVector2D·21·42·tvec

  const obj_1 = cyclepack.decode(str)
  // Результат:
  // Опция 'filterByFunction' никак не влияет на возвращаемые
  // значения 'prepareClasses' и не удаляет строку из массива
  obj_1 == { vec: ['Vector2D', 21, 42] }

  /*
  Восстановим объект класса Vector2D:
  */

  const optionsForDecode = {
    prepareClasses: (arr) => {
      if (arr[0] === 'Vector2D') return new Vector2D(arr[1], arr[2])
    },
  }

  const obj_2 = cyclepack.decode(str, optionsForDecode)
  // Результат:
  // Восстановленный объект полностью идентичен объекту 'data'
  obj_2 == { vec: new Vector2D(21, 42) }
  obj_2 == data
}

// Пример опций для 'uneval':
{
  // Пример номер 1

  const optionsForUneval_1 = {
    // Если возвращается не строка, то возвращаемое значение будет
    // упаковано, но без модификаций ('filterByList' и так далее):
    prepareClasses: (obj) => {
      if (obj instanceof Vector2D) return ['Vector2D', obj.x, obj.y]
    },
  }

  const forEval_1 = cyclepack.uneval(data, optionsForUneval_1)
  // Результат:
  eval(forEval_1) == { vec: ['Vector2D', 21, 42] }
  /*
(function() {
var
v3="Vector2D",
v4=21,
v5=42,
v2=Array(3),
v1=v2,
v6="vec",
v0={}
v2[0]=v3
v2[1]=v4
v2[2]=v5
v0[v6]=v1
return v0
})()
  */

  // Пример номер 2

  const optionsForUneval_2 = {
    // Если возвращается строка, то она встраивается в
    // финальный результат как есть, без каки-либо изменений.
    // Нужно иметь это ввиду и помнить об XSS уязвимостях:
    prepareClasses: (obj) => {
      if (obj instanceof Vector2D) return `new Vector2D(${obj.x}, ${obj.y})`
    },
  }

  const forEval_2 = cyclepack.uneval(data, optionsForUneval_2)
  // Результат:
  // Результат полностью идентичен объекту 'data'
  eval(forEval_2) == { vec: new Vector2D(21, 42) }
  eval(forEval_2) == data
  /*
(function() {
var
v1=new Vector2D(21, 42),
v2="vec",
v0={}
v0[v2]=v1
return v0
})()
  */
}
```

#### Пример, где `prepareClasses` равна `void 0`:

```js
import * as cyclepack from 'cyclepack'

class CustomArray extends Array {}

class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const data = {
  arr: new CustomArray(42),
  vec: new Vector2D(21, 42),
}

const options = {
  // Эти опции полностью эквивалентны и любой
  // нестандартный объект будет упакован автоматически:
  prepareClasses: void 0,
  prepareClasses: () => void 0,
}

const str = data.encode(data, options)
// O1_2:1,9:3·A42·tarr·G8_5:4,7:6·21·tx·42·ty·tVector2D·tvec

const obj = data.decode(str)
// Результат:
// CustomArray будет интерпретироваться как обычный массив,
// так как наследуется от стандартного массива и 'cyclepack'
// знает это. С другими стандартными объектами будет так же.
//
// А вот для Vector2D 'cyclepack' создаст свой системный
// класс с названием 'CyclepackClass.Vector2D', а так же
// скрытым свойством '_CyclepackClass: "Vector2D"'.
// Он будет храниться в 'globalThis', в объекте 'CyclepackClass'.
obj ==
  {
    arr: Array(42),
    vec: (() => {
      const res = new globalThis.CyclepackClass.Vector2D()
      res.x = 21
      res.y = 42
      return res
    })(),
  }

const forEval = cyclepack.uneval(data)
// Результат:
eval(forEval) == obj
/*
(function() {
var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}
var CyclepackClass = G.CyclepackClass || (G.CyclepackClass = {})
function c(f,v){Object.defineProperty(f.prototype,"_CyclepackClass",{value:v,enumerable:!1,configurable:!0,writable:!0})}
function n(v){return new CyclepackClass[v]()}
CyclepackClass["Vector2D"]||c(CyclepackClass["Vector2D"]=function(){},"Vector2D")
var
v1=Array(42),
v2="arr",
v4=21,
v5="x",
v6=42,
v7="y",
v8="Vector2D",
v3=n(v8),
v9="vec",
v0={}
v0[v2]=v1
v3[v5]=v4
v3[v7]=v6
v0[v9]=v3
return v0
*/
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
  - function (только через 'prepareFunctions')
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
- Объекты ошибок (включая 'prepareErrors'):
  - Error
  - AggregateError
  - EvalError
  - RangeError
  - ReferenceError
  - SyntaxError
  - TypeError
  - URIError

### Для `Array` и `Map` существуют особые правила упаковки.

#### Специфика Array

У массивов упаковываются не только целочисленные ключи, но и любые другие, установленные дополнительно. Например:

```js
import * as cyclepack from 'cyclepack'

const array = /\s/.exec('some string') // получаем массив

const str = cyclepack.encode(array)
// A1_1,3:2,5:4,7:6·t ·3·tindex·tqwe asd·tinput·u·tgroups

const obj = cyclepack.decode(str)
// obj == [' ', index: 4, input: 'some string', groups: undefined]
```

Все дополнительные свойства (`index`, `input`, `groups`) для массива, так же были сохранены. Поскольку добавление нецелочисленных ключей в массив является частой практикой, что даже подтверждается примером выше.

То есть `Array` и `Object` обрабатываются одинаково, а все остальные объекты - в соответствии со спецификой своей работы. Например:

```js
{
  const regexp = /[^]/gi
  regexp['some_key_1'] = 42

  const str = cyclepack.encode(regexp)
  // R1_2·t[^]·tgi

  const obj = cyclepack.decode(str)
  // Свойство 'some_key_1' будет проигнорировано
  obj == new RegExp('[^]', 'gi')
}

// или

{
  const set = new Set([1, 2])
  set['some_key_2'] = 42

  const str = cyclepack.encode(set)
  // S1,2·1·2

  const obj = cyclepack.decode(str)
  // Свойство 'some_key_2' будет проигнорировано
  obj == new Set([1, 2])
}

// и так далее, для всех остальных объектов
```

## License

[MIT](LICENSE)
