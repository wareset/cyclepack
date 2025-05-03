import { jsonParse, getGlobalObject, base64ToArrayBuffer } from './utils'

const FUNCTIONS: any = {}
const ERRORS: any = {}
const CLASSES: any = {}
function createCustomError(s: string) {
  let res: any
  try {
    res = Function(
      `return class ${s} extends Error {
        constructor(mes) {
          super(mes)
          this.name = "CyclepackError_${s}"
        }
      }`
    )()
  } catch {
    res = class CyclepackError extends Error {
      override name: string
      constructor(mes: any) {
        super(mes)
        this.name = s
      }
    }
  }
  return res
}

function createClass(s: string) {
  let res: any
  try {
    res = Function(`return function CyclepackClass_${s}() {}`)()
  } catch {
    res = function CyclepackClass() {}
  }
  return res
}

export default function unpack(
  variable: string,
  replace?: {
    functions?: null | ((data: any) => any)
    classes?: null | ((data: any) => any)
    errors?: null | ((data: any) => any)
  }
) {
  const data = jsonParse(variable)
  const temp: any = { '-1': null, '-2': void 0, '-3': void 0 }

  let functions: any
  let classes: any
  let errors: any
  if (replace) {
    functions = replace.functions
    classes = replace.classes
    errors = replace.errors
  }

  function setObjProps(o: any, a: any) {
    if (a)
      for (let i = 0, l = a.length; i < l; ) o[parse(a[i++])] = parse(a[i++])
  }

  function parse(idx: number) {
    if (!(idx in temp)) {
      let v = data[idx]
      switch (typeof v) {
        case 'undefined':
        case 'boolean':
        case 'number':
          temp[idx] = v
          break
        case 'string': {
          const t = v.slice(1)
          switch (v[0]) {
            // case 'u':
            //   v = void 0
            //   break
            // case 'b':
            //   v = !!+t
            //   break
            case 'n':
              v = +t
              break
            case 'i':
              v = BigInt(t)
              break
            case 't':
              v = t
              break
            case 's':
              v = Symbol.for(parse(+t))
              break
            case 'f':
              v =
                FUNCTIONS[t] ||
                (FUNCTIONS[t] = Function('return (' + t + ')')())
              break
            // case 'o':
            //   v = null
            //   break
          }
          temp[idx] = v
          break
        }
        case 'object':
          let s: any = v.length
          switch (parse(v[0])) {
            case 'F':
              temp[idx] = s < 2 ? null : functions && functions(parse(v[1]))
              break
            case 'B':
              temp[idx] = new Boolean(parse(v[1]))
              break
            case 'N':
              temp[idx] = new Number(parse(v[1]))
              break
            case 'T':
              temp[idx] = new String(parse(v[1]))
              break
            case 'R':
              temp[idx] = new RegExp(parse(v[1]), s > 2 ? parse(v[2]) : void 0)
              break
            case 'D':
              temp[idx] = new Date(s > 1 ? parse(v[1]) : NaN)
              break

            case 'E':
              if (s > 3) {
                s =
                  getGlobalObject()[(s = parse(v[1]))] ||
                  ERRORS[s] ||
                  (ERRORS[s] = createCustomError(s))
                temp[idx] = s = new s(parse(v[2]))
                s.stack = parse(v[3])
                setObjProps(s, v[4])
              } else {
                temp[idx] = s < 2 ? null : errors && errors(parse(v[1]))
              }
              break

            case 'A':
              temp[idx] = s = Array(parse(v[1]))
              if (v[2])
                for (let a = v[2], i = a.length; i-- > 0; ) s[i] = parse(a[i])
              setObjProps(s, v[3])
              break

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
            case 'TA':
              s = getGlobalObject()[parse(v[1])]
              temp[idx] = new s(parse(v[2]))
              break
            case 'AB':
              temp[idx] = base64ToArrayBuffer(parse(v[1]))
              break

            case 'S':
              temp[idx] = s = new Set()
              if (v[1])
                for (let a = v[1], i = 0, l = a.length; i < l; )
                  s.add(parse(a[i++]))
              break
            case 'M':
              temp[idx] = s = new Map()
              if (v[1])
                for (let a = v[1], i = 0, l = a.length; i < l; )
                  s.set(parse(a[i++]), parse(a[i++]))
              break

            case 'O':
              temp[idx] = s = parse(v[1]) ? {} : Object.create(null)
              setObjProps(s, v[2])
              break

            case 'C':
              temp[idx] = s < 2 ? null : classes && classes(parse(v[1]))
              break

            case 'OC':
              s = CLASSES[(s = parse(v[1]))] || (CLASSES[s] = createClass(s))
              temp[idx] = s = new s()
              if (v[2])
                for (let a = v[2], i = 0, l = a.length; i < l; )
                  s[parse(a[i++])] = parse(a[i++])
              break
          }
      }
    }
    return temp[idx]
  }

  return data && data.length ? parse(0) : variable
}
