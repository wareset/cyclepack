const __Object__ = Object
const __String__ = String
const __OPROTO__ = __Object__.prototype

const setId = (arr: [number]): string => {
  let num = ++arr[0], s = ''
  for (let t: number; num > 0;) {
    t = (num - 1) % 26, s = __String__.fromCharCode(97 + t) + s
    num = (num - t) / 26 | 0
  }
  return s
}

const REG_NOT_INT = /^0\d|\D/
const stringifyFast = (s: any): string => '"' + s + '"'

const _run_ = (
  v: any, cache: Map<any, string>, id: [number], cb: Function | null
): string => {
  const key = cache.get(v)
  if (key) return key!
  cache.set(v, setId(id))
  switch (__OPROTO__.toString.call(v).slice(8, -1)) {

    case 'BigInt':
      return 'L' + _run_('' + v, cache, id, cb)

    case 'Object': {
      let res = ''
      for (const k in v) {
        if (__OPROTO__.hasOwnProperty.call(v, k)) {
          res += _run_(k, cache, id, cb) + ':' + _run_(v[k], cache, id, cb) + ','
        }
      }
      return '{' + res.slice(0, -1) + '}'
    }
    case 'Function':
      return 'E' + _run_('' + (cb && cb(v) || v.name), cache, id, cb)
    case 'Boolean':
      return 'B' + +v
    case 'Symbol':
      return 'H' + _run_(v.toString().slice(7, -1), cache, id, cb)

    case 'Number':
      return v === +v
        ? v < 0 ? '-' + _run_(-v, cache, id, cb) : '' + v
        : 'N' + _run_(+v, cache, id, cb)
    case 'Date':
      return 'D' + _run_(v.getTime(), cache, id, cb)

    case 'String':
      return v === '' + v
        ? v !== '' + +v ? JSON.stringify(v) : 'Q' + _run_(+v, cache, id, cb)
        : 'S' + _run_('' + v, cache, id, cb)
    case 'RegExp':
      return 'R' + _run_(v.source + ',' + v.flags, cache, id, cb)

    case 'Array': {
      let res = ''
      let i = 0, j: number
      for (const k in v) {
        if (REG_NOT_INT.test(k)) res += _run_(k, cache, id, cb) + ':'
        else if ((j = +k) > i++) for (;i <= j; i++) res += ','
        res += _run_(v[k], cache, id, cb) + ','
      }
      if ((j = v.length) > i) for (;i <= j; i++) res += ','
      return '[' + res.slice(0, -1) + ']'
    }
    case 'Int8Array':
      return `I8A${stringifyFast(v)}`
    case 'Uint8Array':
      return `U8A${stringifyFast(v)}`
    case 'Uint8ClampedArray':
      return `U8C${stringifyFast(v)}`
    case 'Int16Array':
      return `I16${stringifyFast(v)}`
    case 'Uint16Array':
      return `U16${stringifyFast(v)}`
    case 'Int32Array':
      return `I32${stringifyFast(v)}`
    case 'Uint32Array':
      return `U32${stringifyFast(v)}`
    case 'Float32Array':
      return `F32${stringifyFast(v)}`
    case 'Float64Array':
      return `F64${stringifyFast(v)}`

    case 'Map': {
      const data: [string, any, [number], any] = ['', cache, id, cb]
      // eslint-disable-next-line func-names
      v.forEach(function (v: any, k: any) {
        // @ts-ignore
        this[0] += _run_(k, this[1], this[2], this[3]) + ':' + _run_(v, this[1], this[2], this[3]) + ','
      }, data)
      return `M(${data[0].slice(0, -1)})`
    }
    case 'Set': {
      const data: [string, any, [number], any] = ['', cache, id, cb]
      // eslint-disable-next-line func-names
      v.forEach(function (v: any) {
        // @ts-ignore
        this[0] += _run_(v, this[1], this[2], this[3]) + ','
      }, data)
      return `T(${data[0].slice(0, -1)})`
    }
      
    case 'ArrayBuffer':
      return `AB${stringifyFast(new Uint8Array(new DataView(v).buffer))}`
    case 'DataView':
      return `AV${stringifyFast(new Uint8Array(v.buffer))}`
    default:
      console.warn(v)
      return 'a'
  }
}

const DEFS_FOR_STRINGIFY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, true, false, 1 / 0, -1 / 0]
  .map((v, k) => [v, setId([k])]) as any

const build = (v: any, proxyForFunctions?: TypeBuildProxyForFunctions): string =>
  _run_(v, new Map(DEFS_FOR_STRINGIFY), [17], proxyForFunctions!)

const REG_LETTER = /[a-z]/
const REG_SYSTEM = /["/{}[\]():,]/
const parse = (a: string, proxyForFunctions?: TypeParseProxyForFunctions): any => {
  // const cache = new Map(DEFS_FOR_PARSE)
  const id: [number] = [17]
  const cache: { [key: string]: any } = {}
  for (let i = id[0]; i-- > 0;) cache[DEFS_FOR_STRINGIFY[i][1]] = DEFS_FOR_STRINGIFY[i][0]

  const res: any[] = []
  // eslint-disable-next-line prefer-const
  let cur: any = { v: res, t: '[', i: 0 }, newCur: any
  const queue: { v: any, t: any, i: number }[] = [cur]
  let v: any, k: any = res, needCache: boolean
  const IKS: any[] = []
  for (let s: string, l = a.length - 1, i = -1; i++ < l;) {
    needCache = true
    switch (s = a[i]) {
      case 'B':
        // eslint-disable-next-line no-new-wrappers
        v = new Boolean(+a[++i])
        break
      case 'I':
      case 'U':
      case 'F': {
        let Ctor: any
        switch (s += a[++i] + a[++i]) {
          case 'I8A':
            Ctor = Int8Array
            break
          case 'U8A':
            Ctor = Uint8Array
            break
          case 'U8C':
            Ctor = Uint8ClampedArray
            break
          case 'I16':
            Ctor = Int16Array
            break
          case 'U16':
            Ctor = Uint16Array
            break
          case 'I32':
            Ctor = Int32Array
            break
          case 'U32':
            Ctor = Uint32Array
            break
          case 'F32':
            Ctor = Float32Array
            break
          case 'F64':
            Ctor = Float64Array
            break
          default:
            throw s
        }
        v = new Ctor(a.slice(i += 2, i = a.indexOf('"', ++i)).split(','))
        break
      }
      case 'A': {
        const isDataView = a[++i] !== 'B'
        // @ts-ignore
        v = new Uint8Array(a.slice(i += 2, i = a.indexOf('"', ++i)).split(',')).buffer
        if (isDataView) v = new DataView(v)
        break
      }
      case 'L'/* BigInt */:
      case 'D'/* Date */:
      case 'N'/* Number */:
      case '-'/* Number < 0 */:
      case 'Q'/* String from Number */:
      case 'H'/* Symbol */:
      case 'S'/* new String */:
      case 'R'/* RegExp */:
      case 'E'/* Function */:
        IKS.push(s)
        continue
      case '"': {
        for (let q = !1; i++ < l && (s += a[i], q || a[i] !== '"'); q = q ? !1 : a[i] === '\\');
        v = JSON.parse(s)
        break
      }
      case '{':
        newCur = { v: v = {}, t: s }
        break
      case '[':
        newCur = { v: v = [], t: s, i: 0 }
        break
      case 'T':
        newCur = { v: v = new Set(), t: s }, i++
        break
      case 'M':
        newCur = { v: v = new Map(), t: s }, i++
        break
      case ']':
      case '}':
      case ')':
        queue.pop()
        v = cur.v
        cur = queue[queue.length - 1]
        continue
      case ',':
        k = res
        if (cur.t === '[') cur.v.length = ++cur.i
        continue
      case ':':
        k = v
        if (cur.t === '[') cur.v.length = cur.i--
        continue
      default: {
        for (;i++ < l && !REG_SYSTEM.test(a[i]) ? s += a[i] : (i--, false););
        v = REG_LETTER.test(s[0]) ? (needCache = false, cache[s]) : +s
      }
    }
    
    if (IKS.length) {
      const c = v
      const caches: any[] = []
      for (;IKS.length;) {
        caches.push(v = iksf(IKS.pop(), v, proxyForFunctions))
      }
      for (;caches.length;) cache[setId(id)] = caches.pop()

      if (needCache) cache[setId(id)] = c, needCache = false
    }
    if (needCache) cache[setId(id)] = v

    if (cur.t === '[') {
      if (k === res) cur.v[cur.i] = v
      else cur.v[k] = v, k = res
    } else if (cur.t === 'T') {
      cur.v.add(v)
    } else if (k !== res) {
      cur.t === '{' ? cur.v[k] = v : cur.v.set(k, v), k = res
    }
    
    if (newCur) queue.push(cur = newCur), newCur = null
  }

  return res[0]
}

const iksf = (ik: any, v: any, proxyForFunctions: any): any => {
  switch (ik) {
    case '-': return -+v
    case 'Q': return '' + v
    case 'L': return BigInt(v)
    case 'D': return new Date(+v)
    // eslint-disable-next-line no-new-wrappers
    case 'N': return new Number(v)
    case 'H': return Symbol(v)
    case 'S': return new __String__(v)
    case 'R': return new RegExp(v.slice(0, ik = v.lastIndexOf(',')), v.slice(ik + 1))
    default: return proxyForFunctions && proxyForFunctions(v) || `%${v}%`
  }
}

export type TypeBuildProxyForFunctions = (fn: Function) => string | null | undefined
export type TypeParseProxyForFunctions = (fname: string) => Function | null | undefined

export { build, parse }
export default { build, parse }
