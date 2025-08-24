import type { IEncodeOrUnevalOptions } from './types'
import { stringEncode } from './utils/string'
import { arrayBufferToBase64 } from './utils/base64'
import {
  keyToNumMayBe,
  getGlobalThis,
  noopReturnTrue,
  noopReturnFirst,
  isObjectPrototype,
  checkIsCircularError,
} from './utils/others'

function checkParsedKey(i: number) {
  return i > -1
}

export default function encode(
  variable: any,
  options?: IEncodeOrUnevalOptions
) {
  options || (options = {})
  const IS_NAN = {}
  const IS_NEG_ZERO = {}

  const listValues: any[] = []
  const listResult: any[] = []

  const filterByList: any[] = options.filterByList
    ? options.filterByList.slice()
    : []
  const filterByFunction = options.filterByFunction || noopReturnTrue

  let allowAll = 0
  const allowArrayHoles = !options.removeArrayHoles
  const allowEmptyObjects = !options.removeEmptyObjects
  const prepareFunctions = options.prepareFunctions
  const prepareClasses = options.prepareClasses
  const prepareErrors = options.prepareErrors

  function getObjProps(o: any, ignoreArrayVoids?: boolean) {
    const res: (string | number)[] = []
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
        res.push((k = keyToNumMayBe(k)) === idx ? v : parse(k, true) + ':' + v)
        idx++
      }
    }
    return res.length ? '_' + res.join(',') : ''
  }

  function getObjPropsWithProto(o: any) {
    const res: (string | number)[] = []
    let idx = 0
    let k: any, v: any
    for (let a = Object.keys(o), i = 0; i < a.length; i++) {
      try {
        v = o[(k = a[i])]
      } catch (e) {
        // console.error(e)
        continue
      }
      if (checkParsedKey((v = parse(v)))) {
        res.push((k = keyToNumMayBe(k)) === idx ? v : parse(k, true) + ':' + v)
        idx++
      }
    }
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
            n = 'C' + parse(n, true)
          }
        }
        return n
      }
    : noopReturnFirst

  function parse(v: any, setAllowAll?: true): number {
    setAllowAll && allowAll++
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
            n = v ? 't' : 'f'
            break
          case 'number':
            n = isFinite(v)
              ? n === IS_NEG_ZERO
                ? '-0'
                : '' + v
              : (v < 0 ? '' : '+') + v
            break
          case 'bigint':
            n = 'i' + v
            break
          case 'string':
            n = 's' + stringEncode(v)
            break
          case 'symbol':
            n = `k` + parse(keyToNumMayBe(v.toString().slice(7, -1)), true)
            break
          case 'function':
            if (prepareFunctions && (n = prepareFunctions(v)) != null) {
              checkIsCircularError(n, v)
              n = 'm' + parse(n, true)
            } else {
              n = NaN
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
                    n = +v ? 'T' : 'F'
                  }
                  break
                case 'Number':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'N' + parse(+v, true)
                  }
                  break
                case 'String':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'W' + parse(keyToNumMayBe('' + v), true)
                  }
                  break
                case 'RegExp':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n =
                      'R' +
                      parse('' + v.source, true) +
                      (v.flags ? '_' + parse('' + v.flags, true) : '')
                  }
                  break
                case 'Date':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = isNaN(v.getDate())
                      ? 'D'
                      : 'D' + parse(v.toISOString(), true)
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
                    allowAll++
                    n =
                      'E' +
                      parse('' + v.constructor.name) +
                      '_' +
                      parse('' + v.message) +
                      '_' +
                      ('cause' in v ? parse(v.cause) : '') +
                      '_' +
                      (v.stack ? parse(v.stack) : '') +
                      (v.errors ? '_' + parse(v.errors) : '')
                    allowAll--
                  } else {
                    checkIsCircularError(n, v)
                    n = 'E' + parse(n)
                  }
                  break

                // Indexed collections
                case 'Array':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = getObjProps(v, !(allowAll || allowArrayHoles))
                    n =
                      n || allowAll || allowEmptyObjects
                        ? 'A' + (allowAll || allowArrayHoles ? v.length : 0) + n
                        : NaN
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
                    n = 'U' + parse(type, true) + '_' + parse(v.buffer, true)
                  }
                  break

                // Structured data
                case 'ArrayBuffer':
                  if ((n = checkClasses(v, type, n)) === v) {
                    n = 'Y' + arrayBufferToBase64(v)
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
                        if (checkParsedKey((v = parse(v)))) {
                          this.push(parse(k, true), v)
                        }
                      },
                      (n = [])
                    )
                    n = n.join(',')
                    n = n || allowAll || allowEmptyObjects ? 'M' + n : NaN
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
                  } else {
                    n = prepareClasses && prepareClasses(v)
                    if (n === null) {
                      n = NaN
                    } else if (n === void 0) {
                      if (isObjectPrototype(type)) {
                        // Object.create({ ... })
                        n = parse(type)
                        n = (n < 0 ? '' : n) + getObjPropsWithProto(v)
                        n = n || allowAll || allowEmptyObjects ? 'P' + n : NaN
                      } else {
                        // Class
                        n = getObjProps(v)
                        n =
                          n || allowAll || allowEmptyObjects
                            ? 'G' + parse('' + type.constructor.name, true) + n
                            : NaN
                      }
                    } else {
                      checkIsCircularError(n, v)
                      n = 'C' + parse(n, true)
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
    setAllowAll && allowAll--
    return idx
  }

  parse(variable)
  return listResult.join('·')
}
