import { DecodeOptions } from './types'
import { __String__ as String, getGlobalThis } from './utils/others'
import { base64ToArrayBuffer } from './utils/base64'
import { stringEncode, stringDecode } from './utils/string'

let CyclepackClass: any
function createClass(s: string) {
  if (!CyclepackClass) {
    getGlobalThis().CyclepackClass = CyclepackClass = Object.create(null)
  }

  if (!(s in CyclepackClass)) {
    let res: any
    try {
      res = Function(
        `return CyclepackClass["${stringEncode(s)}"]=function(){}`
      )()
    } catch {
      res = function CyclepackClass(this: any) {}
    }
    Object.defineProperty(res.prototype, '_CyclepackClass', { value: s })
    CyclepackClass[s] = res
  }
  return new CyclepackClass[s]()
}

function slice_1(s: string) {
  return s.slice(1)
}
function slice_1_and_split(s: string) {
  return s.slice(1).split('_')
}

/*@__NO_SIDE_EFFECTS__*/
export default function decode(data: string, options?: DecodeOptions) {
  let result!: any
  if (data && typeof data === 'string') {
    // код библиотечный, поэтому нечего переменной зря пропадать
    data = data.split('·') as any
    if (data.length) {
      options || (options = {})
      const prepareFunctions = options.prepareFunctions
      const prepareClasses = options.prepareClasses
      const prepareErrors = options.prepareErrors

      const global = getGlobalThis()
      const objectCreate = Object.create
      const temp: any = objectCreate(null)
      temp[-1] = void 0

      function setObjProps(o: any, a: any) {
        if (a) {
          a = a.split(',')
          for (let v: any, i = 0; i < a.length; ++i) {
            v = a[i].split(':')
            if (v.length === 1) o[i] = parse(v[0])
            else o[parse(v[0])] = parse(v[1])
          }
        }
      }

      function parse(idx: string) {
        if (idx && !(idx in temp)) {
          let s: any
          let v: any = data[+idx]
          // temp[idx] = null
          if (v)
            switch (v[0]) {
              // undefined
              case 'u':
                s = void 0
                break
              // boolean
              case 'b':
                s = !!+v[1]
                break
              // number
              default:
                s = +v
                break
              // bigint
              case 'i':
                s = BigInt(slice_1(v))
                break
              // string
              case 't':
                s = stringDecode(slice_1(v))
                break
              // symbol
              case 'k':
                s = Symbol.for(parse(slice_1(v)))
                break
              // function
              case 'f':
                if ((v = slice_1(v))) {
                  s = parse(v)
                  prepareFunctions && (s = prepareFunctions(s))
                }
                break

              // null
              case 'n':
                s = null
                break

              // Boolean
              case 'B':
                s = new Boolean(+v[1])
                break
              // Number
              case 'N':
                s = new Number(parse(slice_1(v)))
                break
              // String
              case 'T':
                s = new String(parse(slice_1(v)))
                break
              // RegExp
              case 'R':
                v = slice_1_and_split(v)
                s = new RegExp(parse(v[0]), v[1] ? parse(v[1]) : void 0)
                break
              // Date
              case 'D':
                v = slice_1(v)
                s = new Date(v ? parse(v) : NaN)
                break

              // Errors
              case 'E':
                v = slice_1_and_split(v)
                if (v.length < 2) {
                  if (v[0]) {
                    s = parse(v[0])
                    prepareErrors && (s = prepareErrors(s))
                  }
                } else {
                  temp[idx] = s = new ((v[0] && global[parse(v[0])]) || Error)(
                    '',
                    v[2] ? { cause: 1 } : void 0
                  )
                  v[1] && (s.message = parse(v[1]))
                  v[2] && (s.cause = parse(v[2]))
                  v[3] && (s.stack = parse(v[3]))
                  v[4] && (s.name = parse(v[4]))
                }
                break

              // Array
              case 'A':
                v = slice_1_and_split(v)
                temp[idx] = s = Array(+v[0])
                setObjProps(s, v[1])
                break

              // Set
              case 'S':
                temp[idx] = s = new Set()
                if ((v = slice_1(v))) {
                  for (let a = v.split(','), i = 0, l = a.length; i < l; )
                    s.add(parse(a[i++]))
                }
                break
              //Map
              case 'M':
                temp[idx] = s = new Map()
                if ((v = slice_1(v))) {
                  for (let a = v.split(','), i = 0, l = a.length; i < l; )
                    s.set(parse(a[i++]), parse(a[i++]))
                }
                break

              // URL
              // URLSearchParams
              // and
              // Typed Arrays:
              // DataView
              // Int8Array
              // Uint8Array
              // Uint8ClampedArray
              // Int16Array
              // Uint16Array
              // Int32Array
              // Uint32Array
              // Float32Array
              // Float64Array
              // BigInt64Array
              // BigUint64Array
              case 'U':
                v = slice_1_and_split(v)
                if ((s = parse(v[0])) && (s = global[s])) {
                  s = new s(parse(v[1]))
                }
                break
              // ArrayBuffer
              case 'Y':
                s = base64ToArrayBuffer(slice_1(v))
                break

              // Native Object
              case 'O':
                v = slice_1_and_split(v)
                temp[idx] = s = +v[0] ? {} : objectCreate(null)
                setObjProps(s, v[1])
                break
              // Object.create({ ... })
              case 'P':
                v = slice_1_and_split(v)
                temp[idx] = s = objectCreate(v[0] ? parse(v[0]) : null)
                setObjProps(s, v[1])
                break
              // CyclepackClass
              case 'G':
                v = slice_1_and_split(v)
                temp[idx] = s = createClass(parse(v[0]))
                setObjProps(s, v[1])
                break
              // User Class
              case 'C':
                if ((v = slice_1(v))) {
                  s = parse(v)
                  prepareClasses && (s = prepareClasses(s))
                }
                break
            }

          temp[idx] = s
        }

        return temp[idx]
      }

      result = parse('0')
    }
  }

  return result
}
