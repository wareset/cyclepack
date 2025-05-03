import { stringEncode, keyToNumMayBe } from './utils'

// function setId(num: number): string {
//   num++
//   const s: string[] = []
//   for (let fromCharCode = String.fromCharCode, t: number; num > 0; ) {
//     s.push(fromCharCode(97 + (t = (num - 1) % 26)))
//     num = ((num - t) / 26) | 0
//   }
//   return s.join('')
// }

// const pattern = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$'
// function setId(num: number): string {
//   num++
//   const s: string[] = []
//   for (let l = pattern.length, t: number; num > 0; ) {
//     s.push(pattern[(t = (num - 1) % l)])
//     num = ((num - t) / l) | 0
//   }
//   return s.join('')
// }

export default function uneval(
  variable: any,
  replace?: {
    allowNulls?: boolean
    allowUndefineds?: boolean
    allowEmptyObjects?: boolean
    functions?: null | ((fn: (...a: any) => any) => any)
    classes?: null | ((object: { [k: string]: any }) => any)
    errors?: null | ((object: Error) => any)
  }
) {
  const IS_NAN = {}
  const IS_NEG_ZERO = {}

  // (function() {})()

  const listOrigin: any[] = []
  const listResult: any[] = []
  const listIgnore: any[] = []
  const listValues: any[] = []

  let allowNulls: any
  let allowUndefineds: any
  let allowEmptyObjects: any
  let functions: any
  let classes: any
  let errors: any
  if (replace) {
    allowNulls = replace.allowNulls
    allowUndefineds = replace.allowUndefineds
    allowEmptyObjects = replace.allowEmptyObjects
    functions = replace.functions
    classes = replace.classes
    errors = replace.errors
  }

  function check_1(v: any) {
    // return true
    return (allowUndefineds || v !== void 0) && (allowNulls || v !== null)
  }

  function check_2(v: any) {
    // return true
    return v !== 'null' && v !== 'void 0'
  }

  function getObjProps(o: any, idx: number) {
    let res = false
    for (const k in o)
      if (check_1(o[k])) {
        const v = parse(o[k])
        if (check_2(v)) {
          res = true
          listValues.push(`v${idx}[${parse(keyToNumMayBe(k))}]=${v}`)
        }
      }
    return res
  }

  function parse(v: any) {
    if (check_1(v)) {
      if (listIgnore.indexOf(v) > -1) {
        v = 'void 0'
      } else {
        let n = v !== v ? IS_NAN : v === 0 && 1 / v < 0 ? IS_NEG_ZERO : v
        let idx = listOrigin.indexOf(n)
        if (idx < 0) {
          idx = listOrigin.length
          listOrigin[idx] = n

          let type: any = typeof v
          switch (type) {
            case 'undefined':
              n = 'void 0'
              break
            case 'boolean':
              n = v ? '!0' : '!1'
              break
            case 'number':
              n = n === IS_NEG_ZERO ? '-0' : `${v}`
              break
            case 'bigint':
              n = `BigInt(${v})`
              break
            case 'string':
              n = `"${stringEncode(v)}"`
              break
            case 'symbol':
              n = `Symbol.for(${parse(v.toString().slice(7, -1))})`
              break
            case 'function':
              n = functions && functions(v)
              // n = n !== void 0 ? parse(n) : `${v}`
              n = n != null ? parse(n) : n === null ? NaN : `${v}`
              break
            default:
              switch ((type = Object.prototype.toString.call(v).slice(8, -1))) {
                case 'Null':
                  n = 'null'
                  break
                case 'Boolean':
                  n = `new Boolean(${+v})`
                  break
                case 'Number':
                  n = `new Number(${parse(+v)})`
                  break
                case 'String':
                  n = `new String(${parse(v.toString())})`
                  break

                case 'RegExp':
                  n = `${v}`
                  break
                case 'Date':
                  n = isNaN(v.getDate()) ? 'NaN' : `"${v.toISOString()}"`
                  n = `new Date(${n})`
                  break

                // Error objects
                // case 'AggregateError':
                // case 'EvalError':
                // case 'RangeError':
                // case 'ReferenceError':
                // case 'SyntaxError':
                // case 'TypeError':
                // case 'URIError':
                case 'Error': {
                  n = errors && errors(v)
                  if (n != null) {
                    n = parse(n)
                  } else if (n === null) {
                    n = NaN
                  } else {
                    getObjProps(v, idx)
                    n = v.constructor.name || v.name
                    n = `(function(_){
_=${parse(v.message)}
try{
_=new ${n}(_)
}catch{
_=new Error(_)
}
_.stack=${parse(v.stack)}
return _
})()`
                  }
                  break
                }

                // Indexed collections
                case 'Array': {
                  n = false
                  for (const k in v) {
                    if (check_1(v[k])) {
                      const val = parse(v[k])
                      if (check_2(val)) {
                        n = true
                        let key = keyToNumMayBe(k)
                        if (key === k) key = parse(key)
                        listValues.push(`v${idx}[${key}]=${val}`)
                      }
                    }
                  }
                  n = n || allowEmptyObjects ? `Array(${v.length})` : NaN
                  break
                }

                case 'DataView':
                case 'Int8Array':
                case 'Uint8Array':
                case 'Uint8ClampedArray':
                case 'Int16Array':
                case 'Uint16Array':
                case 'Int32Array':
                case 'Uint32Array':
                case 'Float32Array':
                case 'Float64Array':
                case 'BigInt64Array':
                case 'BigUint64Array':
                  n = `new ${type}(${parse(v.buffer)})`
                  break
                // Structured data
                case 'ArrayBuffer':
                  n = `(new Uint8Array([${new Uint8Array(v)}])).buffer`
                  break

                // Keyed collections
                case 'Map':
                  v.forEach(
                    function (this: any, v: any, k: any) {
                      if (check_1(k) || check_1(v)) {
                        k = parse(k)
                        v = parse(v)
                        if (check_2(k) || check_2(v)) {
                          this.b = 1
                          this.a.push(k, v)
                          listValues.push(`v${this.i}.set(${k},${v})`)
                        }
                      }
                    },
                    (n = { b: 0, i: idx })
                  )
                  n = n.b || allowEmptyObjects ? 'new Map()' : NaN
                  break
                case 'Set':
                  v.forEach(
                    function (this: any, v: any, _: any) {
                      if (check_1(v) && check_2((v = parse(v)))) {
                        this.b = 1
                        listValues.push(`v${this.i}.add(${v})`)
                      }
                    },
                    (n = { b: 0, i: idx })
                  )
                  n = n.b || allowEmptyObjects ? 'new Set()' : NaN
                  break

                default:
                  type = Object.getPrototypeOf(v)
                  if (
                    type &&
                    type !== Object.prototype &&
                    (n = classes && classes(v)) != null
                  ) {
                    n = parse(n)
                  } else if (n === null) {
                    n = NaN
                  } else {
                    n = getObjProps(v, idx)
                    n =
                      n || allowEmptyObjects
                        ? type
                          ? `{}`
                          : `Object.create(null)`
                        : NaN
                  }
              }
          }

          if (n === n) {
            v = 'v' + idx
            listResult.push(`${v}=${n}`)
          } else {
            v = 'void 0'
            listIgnore.push(listOrigin.pop())
          }
        } else {
          v = 'v' + idx
        }
      }
    } else {
      v = v === null ? 'null' : 'void 0'
    }

    // console.log(v, listOrigin[idx])
    // console.log(111, listOrigin[idx])
    return v
  }

  parse(variable)

  let res: string
  console.log(listResult)
  switch (listResult.length) {
    case 0:
      res = 'void 0'
      break
    case 1:
      res = listResult[0].slice(3)
      break
    default:
      res = `(function() {
var
${listResult.join(',\n')}
${listValues.join('\n')}
return v0
})()`
  }

  return res
}
