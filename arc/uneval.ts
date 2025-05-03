import { stringEncode, parseKey } from './utils'

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
  const IS_EMPTY_VALUE = {}

  // (function() {})()

  const listOrigin: any[] = []
  const listResult: any[] = []
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
    return v !== IS_EMPTY_VALUE
  }

  function getObjProps(o: any) {
    const res: any[] = []
    for (const k in o)
      if (check_1(o[k]))
        res.push(`_[${parse(parseKey(k))}]=${o[k] === o ? '_' : parse(o[k])}`)
    return res.join('\n')
  }

  function parse(v: any) {
    if (check_1(v)) {
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
            n = n !== void 0 ? parse(n) : `${v}`
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
                if (n !== void 0) {
                  n = parse(n)
                } else {
                  n = v.constructor.name || v.name
                  n = `(function(_){
_=${parse(v.message)}
try{
_=new ${n}(_)
}catch{
_=new Error(_)
}
_.stack=${parse(v.stack)}
${getObjProps(v)}
return _
})()`
                }
                break
              }

              // Indexed collections
              case 'Array': {
                n = false
                const arr: string[] = Array(v.length)
                const obj: string[] = []
                let k: any
                for (k in v) {
                  k = parseKey(k)
                  if (check_1(v[k])) {
                    if (v[k] === v) {
                      obj.push(`_[${parse(k)}] = _`)
                    } else if (k === (k | 0)) {
                      n = true
                      arr[k] = parse(v[k])
                    } else {
                      obj.push(`_[${parse(k)}] = ${parse(v[k])}`)
                    }
                  }
                }
                if (!allowEmptyObjects && !n && !obj.length) {
                  n = parse(void 0)
                } else {
                  n = n ? `[${arr},]` : `Array(${v.length})`
                  if (obj.length) {
                    n = `(function(_){
${obj.join('\n')}
return _
})(${n})`
                  }
                }
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
                  function (this: any, v: any, k: any, t: any) {
                    if (check_1(k) || check_1(v)) {
                      this.a.push(
                        '[' + (k === t ? ((this._ = 1), '_') : parse(k)),
                        (v === t ? ((this._ = 1), '_') : parse(v)) + ']'
                      )
                    }
                  },
                  (n = { a: [], _: 0 })
                )

                if (n._) {
                  n = `(function(_,a,i){
a=[${n.a}]
if (_.set)for(i=0;i<a.length;i++)_.set(a[i][0],a[i][1])
return _
})(new Map())`
                } else {
                  n = `new Map([${n.a}])`
                }
                break
              case 'Set':
                v.forEach(
                  function (this: any, v: any, _: any, t: any) {
                    if (check_1(v)) {
                      this.a.push(v === t ? ((this._ = 1), '_') : parse(v))
                    }
                  },
                  (n = { a: [], _: 0 })
                )

                if (n._) {
                  n = `(function(_,a,i){
a=[${n.a}]
if (_.add)for(i=0;i<a.length;i++)_.add(a[i])
return _
})(new Set())`
                } else {
                  n = `new Set([${n.a}])`
                }
                break

              default:
                type = Object.getPrototypeOf(v)
                if (
                  type &&
                  type !== Object.prototype &&
                  (n = classes && classes(v)) !== void 0
                ) {
                  n = parse(n)
                } else {
                  n = getObjProps(v)
                  type = type ? `{}` : `Object.create(null)`
                  if (n) {
                    n = `(function(_){
${n}
return _
})(${type})`
                  } else {
                    n = type
                  }
                }
            }
        }

        listResult.push(`${(v = 'v' + idx)}=${n}`)
      } else {
        v = 'v' + idx
      }
    } else {
      v = IS_EMPTY_VALUE
    }

    // console.log(v, listOrigin[idx])
    // console.log(111, listOrigin[idx])
    return v
  }

  parse(variable)

  let res: string
  console.log(listResult)
  // switch (listResult.length) {
  //   case 0:
  //     res = 'void 0'
  //     break
  //   case 1:
  //     res = listResult[0].slice(3)
  //     break
  //   default:
  res = `(function() {
var
${listResult.join(',\n')}
return v0
})()`
  // }

  return res
}
