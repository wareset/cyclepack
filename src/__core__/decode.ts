import type { IDecodeOptions } from './types'
import { getGlobalThis } from './utils/others'
import { base64ToArrayBuffer } from './utils/base64'
import { stringEncode, stringDecode } from './utils/string'

const CLASSES: any = {}
function createClass(s: string) {
  if (!(s in CLASSES)) {
    let res: any
    try {
      res = Function(
        `var CyclepackClass={};return CyclepackClass["${stringEncode(s)}"]=function(){}`
      )()
    } catch {
      res = function CyclepackClass(this: any) {}
    }
    Object.defineProperty(res.prototype, '_CyclepackClass', {
      configurable: true,
      enumerable: false,
      value: s,
      writable: true,
    })
    CLASSES[s] = res
  }
  return new CLASSES[s]()
}

function slice_1(s: string) {
  return s.slice(1)
}
function slice_1_and_split(s: string) {
  return s.slice(1).split('_')
}

export default function decode(variable: string, options?: IDecodeOptions) {
  let result!: any
  if (variable && typeof variable === 'string') {
    const data = variable.split('·')
    if (data.length) {
      const global = getGlobalThis()
      const objectCreate = Object.create
      const temp: any = objectCreate(null)
      temp[-1] = void 0

      options || (options = {})
      const prepareFunctions = options.prepareFunctions
      const prepareClasses = options.prepareClasses
      const prepareErrors = options.prepareErrors

      function setObjProps(o: any, a: any) {
        if (a) {
          a = a.split(',')
          for (let v: any, i = 0; i < a.length; i++) {
            v = a[i].split(':')
            if (v.length === 1) o[i] = parse(v[0])
            else o[parse(v[0])] = parse(v[1])
          }
        }
      }

      function parse(idx: string) {
        if (!(idx in temp)) {
          let s: any
          let v: any = data[+idx]
          // temp[idx] = null

          switch (v[0]) {
            // undefined
            case 'u':
              s = void 0
              break
            // boolean
            case 't':
            case 'f':
              s = v === 't'
              break
            // bigint
            case 'i':
              s = BigInt(slice_1(v))
              break
            // string
            case 's':
              s = stringDecode(slice_1(v))
              break
            // symbol
            case 'k':
              s = Symbol.for(parse(slice_1(v)))
              break
            // function
            case 'm':
              s = parse(slice_1(v))
              prepareFunctions && (s = prepareFunctions(s))
              break

            // null
            case 'n':
              s = null
              break

            // Boolean
            case 'T':
            case 'F':
              s = new Boolean(v === 'T')
              break
            case 'N':
              s = new Number(parse(slice_1(v)))
              break
            case 'W':
              s = new String(parse(slice_1(v)))
              break
            case 'R':
              v = slice_1_and_split(v)
              s = new RegExp(parse(v[0]), v[1] ? parse(v[1]) : void 0)
              break
            case 'D':
              v = slice_1(v)
              s = new Date(v ? parse(v) : NaN)
              break

            // Errors
            case 'E':
              v = slice_1_and_split(v)
              if (v.length < 2) {
                s = parse(v[0])
                prepareErrors && (s = prepareErrors(s))
              } else {
                v[0] = parse(v[0])
                v[1] = parse(v[1])
                v[5] = v[2] ? { cause: 1 } : void 0
                try {
                  s = global[v[0]]
                  s = v[4] ? new s([], v[1], v[5]) : new s(v[1], v[5])
                } catch {
                  s = new Error(v[1], v[5])
                  s._CyclepackError = v[0]
                }
                temp[idx] = s
                v[2] && (s.cause = parse(v[2]))
                v[3] && (s.stack = parse(v[3]))
                v[4] && (s.errors = parse(v[4]))
              }
              break

            case 'A':
              v = slice_1_and_split(v)
              temp[idx] = s = Array(+v[0])
              setObjProps(s, v[1])
              break

            // Typed Arrays
            // case 'DataView':
            // case 'Int8Array':
            // case 'Uint8Array':
            // case 'Uint8ClampedArray':
            // case 'Int16Array':
            // case 'Uint16Array':
            // case 'Int32Array':
            // case 'Uint32Array':
            // case 'Float32Array':
            // case 'Float64Array':
            // case 'BigInt64Array':
            // case 'BigUint64Array':
            case 'U':
              v = slice_1_and_split(v)
              s = new global[parse(v[0])](parse(v[1]))
              // s = s ? new s(parse(v[1])) : parse(v[1])
              break
            // ArrayBuffer
            case 'Y':
              s = base64ToArrayBuffer(slice_1(v))
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
            // Class
            case 'C':
              s = parse(slice_1(v))
              prepareClasses && (s = prepareClasses(s))
              break
            // CyclepackClass
            case 'G':
              v = slice_1_and_split(v)
              temp[idx] = s = createClass(parse(v[0]))
              setObjProps(s, v[1])
              break

            default:
              s = +v
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
