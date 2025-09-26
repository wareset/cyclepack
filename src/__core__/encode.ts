import type { IEncodeOrUnevalOptions } from './types'
import { stringEncode } from './utils/string'
import { arrayBufferToBase64 } from './utils/base64'
import {
  __String__ as String,
  keyToNumMayBe,
  getGlobalThis,
  noopReturnTrue,
  noopReturnFirst,
  checkIsCircularError,
  isPrototypeLikeObject,
} from './utils/others'

function checkParsedKey(i: number) {
  return i > -1
}

/*@__NO_SIDE_EFFECTS__*/
export default function encode(data: any, options?: IEncodeOrUnevalOptions) {
  options || (options = {})
  const IS_NAN = {}
  const IS_NEG_ZERO = {}

  const listValues: any[] = []
  const listResult: any[] = []

  const filterByList: any[] = (options.filterByList || []).slice()
  const filterByFunction = options.filterByFunction || noopReturnTrue

  let allowAllDeep = 0
  const allowArrayHoles = !options.removeArrayHoles
  const allowEmptyObjects = !options.removeEmptyObjects
  const prepareFunctions = options.prepareFunctions
  const prepareClasses = options.prepareClasses
  const prepareErrors = options.prepareErrors

  function getSymbols(o: any) {
    const res: string[] = []
    let k: any, v: any
    for (let a = Object.getOwnPropertySymbols(o), i = 0; i < a.length; ++i) {
      try {
        v = o[(k = a[i])]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res.push(parse(k, 1) + ':' + v)
      }
    }
    return res.join(',')
  }

  function getObjProps(o: any, ignoreArrayVoids?: boolean) {
    const res: string[] = []
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
        if (ignoreArrayVoids) idx = k >>> 0
        res.push((k = keyToNumMayBe(k)) === idx ? v : parse(k, 1) + ':' + v)
        ++idx
      }
    }
    if ((v = getSymbols(o))) res.push(v)
    return res.length ? '_' + res.join(',') : ''
  }

  function getObjPropsWithProto(o: any) {
    const res: string[] = []
    let idx = 0
    let k: any, v: any
    for (let a = Object.keys(o), i = 0; i < a.length; ++i) {
      try {
        v = o[(k = a[i])]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res.push((k = keyToNumMayBe(k)) === idx ? v : parse(k, 1) + ':' + v)
        ++idx
      }
    }
    if ((v = getSymbols(o))) res.push(v)
    return res.length ? '_' + res.join(',') : ''
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
          } else {
            n = 'C' + parse(n, 1, 1)
          }
        }
        return n
      }
    : prepareClasses === null
      ? function (v: any, type: any, funcName: string) {
          return type !== global[funcName].prototype ? NaN : v
        }
      : noopReturnFirst

  function parse(v: any, allowAll?: 1 | 0, setAllowAllDeep?: 1 | 0): number {
    setAllowAllDeep && ++allowAllDeep
    allowAll || (allowAll = allowAllDeep as 1)
    let idx: number
    if (
      allowAll ||
      (!filterByList.includes(v) &&
        (filterByFunction(v) || (filterByList.push(v), false)))
    ) {
      let n = v !== v ? IS_NAN : v === 0 && 1 / v < 0 ? IS_NEG_ZERO : v
      idx = listValues.indexOf(n)

      if (idx < 0) {
        let type: any = typeof v
        idx = listValues.length
        listValues[idx] = n

        switch (type) {
          case 'undefined':
            n = 'u'
            break
          case 'boolean':
            n = 'b' + +v
            break
          case 'number':
            n = isFinite(v)
              ? n === IS_NEG_ZERO
                ? '-0'
                : String(v)
              : v < 0
                ? String(v)
                : '+' + v
            break
          case 'bigint':
            n = 'i' + v
            break
          case 'string':
            n = 't' + stringEncode(v)
            break
          case 'symbol':
            n = `k` + parse(keyToNumMayBe(String(v).slice(7, -1)), 1)
            break
          case 'function':
            n = prepareFunctions && prepareFunctions(v)
            if (n == null) {
              n = NaN
            } else {
              checkIsCircularError(n, v)
              n = 'f' + parse(n, 1, 1)
            }
            break
          default:
            if (v === null) {
              n = 'n'
            } else {
              type = Object.getPrototypeOf(v)

              switch ((n = Object.prototype.toString.call(v).slice(8, -1))) {
                case 'Boolean':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'B' + +v
                  }
                  break
                case 'Number':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'N' + parse(+v, 1)
                  }
                  break
                case 'String':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'T' + parse(keyToNumMayBe(String(v)), 1)
                  }
                  break
                case 'RegExp':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n =
                      'R' +
                      parse(String(v.source), 1) +
                      (v.flags ? '_' + parse(String(v.flags), 1) : '')
                  }
                  break
                case 'Date':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = isNaN(v.getDate())
                      ? 'D'
                      : 'D' + parse(v.toISOString(), 1)
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
                    n =
                      'E' +
                      parse(String(v.constructor.name), 1) +
                      '_' +
                      parse(String(v.message), 1) +
                      '_' +
                      ('cause' in v ? parse(v.cause, 1) : '') +
                      '_' +
                      (v.stack ? parse(v.stack, 1) : '') +
                      (v.errors ? '_' + parse(v.errors, 1) : '')
                  } else {
                    checkIsCircularError(n, v)
                    n = 'E' + parse(n, 1, 1)
                  }
                  break

                // Indexed collections
                case 'Array':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = getObjProps(v, !(allowAllDeep || allowArrayHoles))
                    n =
                      n || allowAll || allowEmptyObjects
                        ? 'A' +
                          (allowAllDeep || allowArrayHoles ? v.length : 0) +
                          n
                        : NaN
                  }
                  break

                // Keyed collections
                case 'Set':
                  if ((n = checkClasses(v, type, n)) === v) {
                    v.forEach(
                      function (this: number[], v: any) {
                        if (checkParsedKey((v = parse(v)))) {
                          this.push(v)
                        }
                      },
                      (n = [])
                    )
                    n = n.join(',')
                    n = n || allowAll || allowEmptyObjects ? 'S' + n : NaN
                  }
                  break
                case 'Map':
                  if ((n = checkClasses(v, type, n)) === v) {
                    v.forEach(
                      function (this: number[], v: any, k: any) {
                        const listValuesLength = listValues.length
                        const listResultLength = listResult.length
                        if (checkParsedKey((k = parse(k, 1)))) {
                          if (checkParsedKey((v = parse(v)))) {
                            this.push(k, v)
                          } else {
                            listValues.length = listValuesLength
                            listResult.length = listResultLength
                          }
                        }
                      },
                      (n = [])
                    )
                    n = n.join(',')
                    n = n || allowAll || allowEmptyObjects ? 'M' + n : NaN
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
                    n = 'U' + parse(type, 1) + '_' + parse(v.buffer, 1)
                  }
                  break

                // Structured data
                case 'ArrayBuffer':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'Y' + arrayBufferToBase64(v)
                  }
                  break

                case 'URL':
                case 'URLSearchParams':
                  if ((n = checkClasses(v, type, (type = n))) === v) {
                    n = 'U' + parse(type, 1) + '_' + parse(String(v), 1)
                  }
                  break

                // case 'Object':
                default:
                  if (!type || type === Object.prototype) {
                    // Native Object
                    n = getObjProps(v)
                    n =
                      n || allowAll || allowEmptyObjects
                        ? 'O' + (type ? 1 : 0) + n
                        : NaN
                  } else if (isPrototypeLikeObject(type)) {
                    // Object.create({ ... })
                    n = parse(type)
                    n = (n < 0 ? '' : n) + getObjPropsWithProto(v)
                    n = n || allowAll || allowEmptyObjects ? 'P' + n : NaN
                  } else {
                    n = prepareClasses && prepareClasses(v)
                    if (n === null) {
                      n = NaN
                    } else if (n === void 0) {
                      // CyclepackClass
                      n = getObjProps(v)
                      n =
                        n || allowAll || allowEmptyObjects
                          ? 'G' + parse(String(type.constructor.name), 1) + n
                          : NaN
                    } else {
                      // User Class
                      checkIsCircularError(n, v)
                      n = 'C' + parse(n, 1, 1)
                    }
                  }
              }
            }
        }

        if (n === n) {
          listResult[idx] = n
        } else {
          filterByList.push(listValues.pop())
          idx = -1
        }
      }
    } else {
      idx = -1
    }
    setAllowAllDeep && --allowAllDeep
    return idx
  }

  parse(data)
  return (data = listResult.join('·')) === 'u' ? '' : data
}
