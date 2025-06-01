import { stringEncode, arrayBufferToBase64, keyToNumMayBe } from './utils'

export type IEncodeOptions = {
  allowNulls?: boolean
  allowUndefineds?: boolean
  allowEmptyObjects?: boolean
  functions?: null | ((fn: (...a: any) => any) => any)
  classes?: null | ((object: { [k: string]: any }) => any)
  errors?: null | ((object: Error) => any)
}

export default function encode(
  variable: any,
  options?: IEncodeOptions
) {
  const IS_NAN = {}
  const IS_NEG_ZERO = {}

  const listOrigin: any[] = []
  const listResult: any[] = []
  const listIgnore: any[] = []

  const toAnchor = parse

  let allowNulls: any
  let allowUndefineds: any
  let allowEmptyObjects: any
  let functions: any
  let classes: any
  let errors: any
  if (options) {
    allowNulls = options.allowNulls
    allowUndefineds = options.allowUndefineds
    allowEmptyObjects = options.allowEmptyObjects
    functions = options.functions
    classes = options.classes
    errors = options.errors
  }

  function check_1(v: any) {
    // return true
    return (allowUndefineds || v !== void 0) && (allowNulls || v !== null)
  }

  function check_2(i: number) {
    // return true
    return i !== -3 // && (allowUndefineds || i !== -2) && (allowNulls || i !== -1)
  }

  function getObjProps(o: any) {
    const res: any[] = []
    for (const k in o) {
      if (check_1(o[k])) {
        const v = parse(o[k])
        if (check_2(v)) {
          res.push(parse(keyToNumMayBe(k)), v)
        }
      }
    }
    return res.length ? `,[${res}]` : ''
  }

  function parse(v: any) {
    let idx: number
    if (v === null) {
      idx = -1
    } else if (v === void 0) {
      idx = -2
    } else if (listIgnore.indexOf(v) > -1) {
      idx = -3
    } else {
      let n = v !== v ? IS_NAN : v === 0 && 1 / v < 0 ? IS_NEG_ZERO : v
      idx = listOrigin.indexOf(n)
      if (idx < 0) {
        idx = listOrigin.length
        listOrigin[idx] = n

        let type: any = typeof v
        switch (type) {
          // case 'undefined':
          //   n = NaN // '"u"'
          //   break
          case 'boolean':
            n = `${v}`
            break
          case 'number':
            n = isFinite(v) ? (n === IS_NEG_ZERO ? '-0' : `${v}`) : `"n${v}"`
            break
          case 'bigint':
            n = `"i${v}"`
            break
          case 'string':
            n = `"t${stringEncode(v)}"`
            break
          case 'symbol':
            n = `"s${parse(v.toString().slice(7, -1))}"`
            break
          case 'function':
            n = functions && functions(v)
            n =
              n != null
                ? `[${toAnchor('F')},${parse(n)}]`
                : n === null
                  ? NaN // '"o"' // `[${toAnchor('F')}]`
                  : `"f${stringEncode(v.toString())}"`
            break
          default:
            switch ((type = Object.prototype.toString.call(v).slice(8, -1))) {
              // case 'Null':
              //   n = '"o"'
              //   break
              case 'Boolean':
                n = `[${toAnchor('B')},${parse(+v)}]`
                break
              case 'Number':
                n = `[${toAnchor('N')},${parse(+v)}]`
                break
              case 'String':
                n = `[${toAnchor('T')},${parse(v.toString())}]`
                break

              case 'RegExp':
                n = v.flags ? `,${parse(v.flags)}` : ''
                n = `[${toAnchor('R')},${parse(v.source)}${n}]`
                break

              case 'Date':
                n = isNaN(v.getDate()) ? '' : `,${parse(v.toISOString())}`
                n = `[${toAnchor('D')}${n}]`
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
                  n = `[${toAnchor('E')},${parse(n)}]`
                } else if (n === null) {
                  n = NaN // '"o"' // `[${toAnchor('E')}]`
                } else {
                  n = `[${toAnchor('E')},${parse(v.constructor.name || v.name)},${parse(v.message)},${parse(v.stack)}${getObjProps(v)}]`
                }
                break
              }

              // Indexed collections
              case 'Array': {
                const arr: number[] = []
                const obj: number[] = []
                n = 0
                for (const key in v) {
                  if (check_1(v[key])) {
                    const val = parse(v[key])
                    if (check_2(val))
                      if (+key === n++) {
                        arr.push(val)
                      } else {
                        n = NaN
                        obj.push(parse(keyToNumMayBe(key)), val)
                      }
                  }
                }
                n = v.length
                n = obj.length
                  ? `[${toAnchor('A')},${parse(n)},[${arr}],[${obj}]]`
                  : arr.length
                    ? `[${toAnchor('A')},${parse(n)},[${arr}]]`
                    : allowEmptyObjects
                      ? `[${toAnchor('A')},${parse(n)}]`
                      : NaN
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
                n = `[${toAnchor('TA')},${parse(type)},${parse(v.buffer)}]`
                break
              // Structured data
              case 'ArrayBuffer':
                n = `[${toAnchor('AB')},${parse(arrayBufferToBase64(v))}]`
                break

              // Keyed collections
              case 'Map':
                // n = []
                // for (const a of v) n.push('[' + parse(a[0]), parse(a[1]) + ']')
                v.forEach(
                  function (this: number[], value: any, key: any) {
                    if (check_1(key) || check_1(value)) {
                      key = parse(key)
                      value = parse(value)
                      if (check_2(key) || check_2(value)) {
                        this.push(key, value)
                      }
                    }
                  },
                  (n = [])
                )
                n = n.length ? `,[${n}]` : ''
                n = n || allowEmptyObjects ? `[${toAnchor('M')}${n}]` : NaN
                break
              case 'Set':
                // n = []
                // for (const value of v) n.push(parse(value))
                v.forEach(
                  function (this: number[], value: any) {
                    if (check_1(value) && check_2((value = parse(value)))) {
                      this.push(value)
                    }
                  },
                  (n = [])
                )
                n = n.length ? `,[${n}]` : ''
                n = n || allowEmptyObjects ? `[${toAnchor('S')}${n}]` : NaN
                break

              default:
                type = Object.getPrototypeOf(v)
                if (!type || type === Object.prototype) {
                  n = getObjProps(v)
                  n =
                    n || allowEmptyObjects
                      ? `[${toAnchor('O')},${parse(type ? 1 : 0)}${n}]`
                      : NaN
                } else {
                  n = classes && classes(v)
                  if (n != null) {
                    n = `[${toAnchor('C')},${parse(n)}]`
                  } else if (n === null) {
                    n = NaN // '"o"' // `[${toAnchor('C')}]`
                  } else {
                    type = type.constructor || Object
                    n = getObjProps(v)
                    n =
                      n || allowEmptyObjects
                        ? `[${toAnchor('OC')},${parse(type.name)}${n}]`
                        : NaN
                  }
                }
            }
        }

        if (n === n) {
          listResult[idx] = n
        } else {
          listIgnore.push(listOrigin.pop())
          // listIgnore.push(listOrigin.splice(idx, 1))
          idx = -3
        }
      }
    }
    return idx
  }

  variable = parse(variable) === -1 ? null : void 0
  return listResult.length ? '[' + listResult.join(',') + ']' : variable
}
