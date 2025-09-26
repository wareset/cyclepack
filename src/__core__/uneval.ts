import { EncodeOrUnevalOptions } from './types'
import { stringEncode } from './utils/string'
import {
  __String__ as String,
  keyToNumMayBe,
  getGlobalThis,
  noopReturnTrue,
  noopReturnFirst,
  checkIsCircularError,
  isPrototypeLikeObject,
} from './utils/others'

// function setId(num: number): string {
//   num++
//   const s: string[] = []
//   for (let fromCharCode = String.fromCharCode, t: number; num > 0; ) {
//     s.push(fromCharCode(97 + (t = (num - 1) % 26)))
//     num = ((num - t) / 26) | 0
//   }
//   return s.join('')
// }

// const pattern = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$'
// function setId(num: number): string {
//   num++
//   const s: string[] = []
//   for (let l = pattern.length, t: number; num > 0; ) {
//     s.push(pattern[(t = (num - 1) % l)])
//     num = ((num - t) / l) | 0
//   }
//   return s.join('')
// }

const getGlobal = `var G="object";G=typeof globalThis===G?globalThis:typeof global===G?global:typeof window===G?window:typeof self===G?self:Function("return this")()||{}`

function checkParsedKey(v: string) {
  return v !== 'void 0'
}

/*@__NO_SIDE_EFFECTS__*/
export default function uneval(data: any, options?: EncodeOrUnevalOptions) {
  options || (options = {})
  const IS_NAN = {}
  const IS_NEG_ZERO = {}

  const listOrigin: any[] = []
  const listResult: any[] = []
  const listValues: any[] = []
  const listClassesAndGlobal: any[] = []

  const filterByList: any[] = (options.filterByList || []).slice()
  const filterByFunction = options.filterByFunction || noopReturnTrue

  let allowAllDeep = 0
  const allowArrayHoles = !options.removeArrayHoles
  const allowEmptyObjects = !options.removeEmptyObjects
  const prepareFunctions = options.prepareFunctions
  const prepareClasses = options.prepareClasses
  const prepareErrors = options.prepareErrors

  let globalIsAdded = 0
  let CyclepackClass: any
  function createClass(type: string, short: string) {
    globalIsAdded || (globalIsAdded = listClassesAndGlobal.push(getGlobal))

    if (!CyclepackClass) {
      CyclepackClass = {}
      listClassesAndGlobal.push(
        `var CyclepackClass=G.CyclepackClass||(G.CyclepackClass=Object.create(null))
function c(f,v){Object.defineProperty(f.prototype,"_CyclepackClass",{value:v})}
function n(v){return new CyclepackClass[v]()}`
      )
    }
    if (!(type in CyclepackClass)) {
      const escType = (CyclepackClass[type] = `"${stringEncode(type)}"`)
      const className = `CyclepackClass[${escType}]`
      listClassesAndGlobal.push(
        `${className}||c(${className}=function(){},${escType})`
      )
    }
    return `n(${short})`
  }

  function getSymbols(o: any, key: string): boolean {
    let res = false
    let k: any, v: any
    for (let a = Object.getOwnPropertySymbols(o), i = 0; i < a.length; i++) {
      try {
        v = o[(k = a[i])]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res = true
        listValues.push(`${key}[${parse(k, 1)}]=${v}`)
      }
    }
    return res
  }

  function getObjProps(o: any, key: string, ignoreArrayVoids?: boolean) {
    let res = false
    let idx = 0
    let k: any, v: any
    for (k in o) {
      try {
        v = o[k]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res = true
        listValues.push(
          `${key}[${
            k !== (k = keyToNumMayBe(k))
              ? ignoreArrayVoids && k === k >>> 0
                ? idx++
                : k
              : parse(k, 1)
          }]=${v}`
        )
      }
    }
    return getSymbols(o, key) || res
  }

  function getObjPropsWithProto(o: any, key: string) {
    let res = false
    let i = 0
    let k: any, v: any
    for (let a = Object.keys(o); i < a.length; ++i) {
      try {
        v = o[(k = a[i])]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res = true
        listValues.push(
          `${key}[${k !== (k = keyToNumMayBe(k)) ? k : parse(k, 1)}]=${v}`
        )
      }
    }
    return getSymbols(o, key) || res
  }

  const global = getGlobalThis()
  const checkClasses = prepareClasses
    ? function (v: any, type: any, funcName: string) {
        let n = v
        if (type !== global[funcName].prototype) {
          n = prepareClasses(v)
          if (n === null) {
            n = NaN
          } else if (n === void 0) {
            n = v
          } else if (typeof n !== 'string') {
            n = parse(n, 1, 1)
          }
        }
        return n
      }
    : prepareClasses === null
      ? function (v: any, type: any, funcName: string) {
          return type !== global[funcName].prototype ? NaN : v
        }
      : noopReturnFirst

  function parse(v: any, allowAll?: 1 | 0, setAllowAllDeep?: 1 | 0) {
    setAllowAllDeep && ++allowAllDeep
    allowAll || (allowAll = allowAllDeep as 1)
    if (
      allowAll ||
      (!filterByList.includes(v) &&
        (filterByFunction(v) || (filterByList.push(v), false)))
    ) {
      let n = v !== v ? IS_NAN : v === 0 && 1 / v < 0 ? IS_NEG_ZERO : v
      let idx: number | string = listOrigin.indexOf(n)
      if (idx < 0) {
        idx = listOrigin.length
        listOrigin[idx] = n
        idx = 'v' + idx
        // idx = setId(idx)

        let type: any = typeof v
        switch (type) {
          case 'undefined':
            n = 'void 0'
            break
          case 'boolean':
            n = v ? '!0' : '!1'
            break
          case 'number':
            n = n === IS_NEG_ZERO ? '-0' : String(v)
            break
          case 'bigint':
            n = `BigInt(${v})`
            break
          case 'string':
            n = `"${stringEncode(v)}"`
            break
          case 'symbol':
            n = parse(keyToNumMayBe(String(v).slice(7, -1)), 1)
            n = `Symbol.for(${n})`
            break
          case 'function':
            n = prepareFunctions && prepareFunctions(v)
            if (n == null) {
              n = NaN
            } else if (typeof n !== 'string') {
              checkIsCircularError(n, v)
              n = parse(n, 1, 1)
            }
            break
          default:
            if (v === null) {
              n = 'null'
            } else {
              type = Object.getPrototypeOf(v)

              switch ((n = Object.prototype.toString.call(v).slice(8, -1))) {
                case 'Boolean':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = `new Boolean(${+v})`
                  }
                  break
                case 'Number':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = `new Number(${parse(+v, 1)})`
                  }
                  break
                case 'String':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = `new String(${parse(keyToNumMayBe(String(v)), 1)})`
                  }
                  break

                case 'RegExp':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = String(v)
                  }
                  break
                case 'Date':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = isNaN(v.getDate()) ? 'NaN' : parse(v.toISOString(), 1)
                    n = `new Date(${n})`
                  }
                  break

                // Errors
                // case 'AggregateError':
                // case 'EvalError':
                // case 'RangeError':
                // case 'ReferenceError':
                // case 'SyntaxError':
                // case 'TypeError':
                // case 'URIError':
                case 'Error':
                  n = prepareErrors && prepareErrors(v)
                  if (n === null) {
                    n = NaN
                  } else if (n === void 0) {
                    globalIsAdded ||
                      (globalIsAdded = listClassesAndGlobal.push(getGlobal))
                    n = [
                      parse(String(v.constructor.name), 1),
                      parse(String(v.message), 1),
                      v.stack ? parse(v.stack, 1) : 0,
                      v.errors ? parse(v.errors, 1) : 0,
                      'cause' in v ? `{cause:${parse(v.cause, 1)}}` : '{}',
                    ]
                    n = `(function(f,m,s,e,c){
var _,F=G[f]
try{_= e?(new F([],m,c)):(new F(m,c))}catch{_=new Error(m,c);_._CyclepackError=f}
e&&(_.errors=e);s&&(_.stack=s);return _
})(${n})`
                  } else if (typeof n !== 'string') {
                    checkIsCircularError(n, v)
                    n = parse(n, 1, 1)
                  }
                  break

                // Indexed collections
                case 'Array': {
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = getObjProps(v, idx, !(allowAllDeep || allowArrayHoles))
                    n =
                      n || allowAll || allowEmptyObjects
                        ? allowAllDeep || allowArrayHoles
                          ? `Array(${v.length})`
                          : '[]'
                        : NaN
                  }
                  break
                }

                // Keyed collections
                case 'Set':
                  if ((n = checkClasses(v, type, n)) === v) {
                    v.forEach(
                      function (this: any, v: any) {
                        if (checkParsedKey((v = parse(v)))) {
                          this.b = 1
                          listValues.push(`${this.i}.add(${v})`)
                        }
                      },
                      (n = { b: 0, i: idx })
                    )
                    n = n.b || allowAll || allowEmptyObjects ? 'new Set()' : NaN
                  }
                  break
                case 'Map':
                  if ((n = checkClasses(v, type, n)) === v) {
                    v.forEach(
                      function (this: any, v: any, k: any) {
                        const listOriginLength = listOrigin.length
                        const listValuesLength = listValues.length
                        const listResultLength = listResult.length
                        if (checkParsedKey((k = parse(k, 1)))) {
                          if (checkParsedKey((v = parse(v)))) {
                            this.b = 1
                            listValues.push(`${this.i}.set(${k},${v})`)
                          } else {
                            listOrigin.length = listOriginLength
                            listValues.length = listValuesLength
                            listResult.length = listResultLength
                          }
                        }
                      },
                      (n = { b: 0, i: idx })
                    )
                    n = n.b || allowAll || allowEmptyObjects ? 'new Map()' : NaN
                  }
                  break

                // URL
                case 'URL':
                case 'URLSearchParams':
                  if ((n = checkClasses(v, type, (type = n))) === v) {
                    n = `new ${type}(${parse(String(v), 1)})`
                  }
                  break
                // Typed Arrays
                case 'DataView':
                case 'Int8Array':
                case 'Uint8Array':
                case 'Uint8ClampedArray':
                case 'Int16Array':
                case 'Uint16Array':
                case 'Int32Array':
                case 'Uint32Array':
                case 'BigInt64Array':
                case 'BigUint64Array':
                case 'Float16Array':
                case 'Float32Array':
                case 'Float64Array':
                  if ((n = checkClasses(v, type, (type = n))) === v) {
                    n = `new ${type}(${parse(v.buffer, 1)})`
                  }
                  break

                // Structured data
                case 'ArrayBuffer':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = `(new Uint8Array([${new Uint8Array(v)}])).buffer`
                  }
                  break

                default:
                  if (!type || type === Object.prototype) {
                    // Native Object
                    n = getObjProps(v, idx)
                    n =
                      n || allowAll || allowEmptyObjects
                        ? type
                          ? `{}`
                          : `Object.create(null)`
                        : NaN
                  } else if (isPrototypeLikeObject(type)) {
                    // Object.create({ ... })
                    type = parse(type)
                    checkParsedKey(type) || (type = null)
                    n = getObjPropsWithProto(v, idx)
                    n =
                      n || type || allowAll || allowEmptyObjects
                        ? `Object.create(${type})`
                        : NaN
                  } else {
                    n = prepareClasses && prepareClasses(v)
                    if (n === null) {
                      n = NaN
                    } else if (n === void 0) {
                      // CyclepackClass
                      type = String(type.constructor.name)
                      n = getObjProps(v, idx)
                      n =
                        n || allowAll || allowEmptyObjects
                          ? createClass(type, parse(type, 1))
                          : NaN
                    } else if (typeof n !== 'string') {
                      // User Class
                      checkIsCircularError(n, v)
                      n = parse(n, 1, 1)
                    }
                  }
              }
            }
        }

        if (n === n) {
          v = idx
          listResult.push(`${v}=${n}`)
        } else {
          v = 'void 0'
          filterByList.push(listOrigin.pop())
          // listIgnore.push(listOrigin.splice(idx, 1))
        }
      } else {
        v = 'v' + idx
        // v = setId(idx)
      }
    } else {
      v = 'void 0'
    }
    setAllowAllDeep && --allowAllDeep
    return v
  }

  parse(data)

  let res: string
  switch (listClassesAndGlobal.length + listResult.length + listValues.length) {
    case 0:
      res = 'void 0'
      break
    case 1:
      res = listResult[0].slice(3)
      break
    default:
      listClassesAndGlobal.push('var')
      res = `(function() {
${listClassesAndGlobal.join('\n')}
${listResult.join(',\n')}
${listValues.join('\n')}
return v0
})()`
  }

  return res
}
