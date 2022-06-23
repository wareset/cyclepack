const __OPROTO__ = Object.prototype

const setId = (arr: [number]): string => {
  let num = ++arr[0], s = ''
  for (let t: number; num > 0;) {
    t = (num - 1) % 26, s = String.fromCharCode(97 + t) + s
    num = (num - t) / 26 | 0
  }
  return s
}

const REG_NOT_INT = /^0\d|\D/
const stringify = (s: any, esc: boolean): string =>
  (s = JSON.stringify(s), !esc ? s : JSON.stringify(s).slice(1, -1))
const stringifyFast = (s: any, esc: boolean): string =>
  esc ? '\\"' + s + '\\"' : '"' + s + '"'

const createObject: typeof _run_ = (v, cache, id, cb, esc): string => {
  let res = '{', sep = ''
  for (const k in v) {
    if (__OPROTO__.hasOwnProperty.call(v, k)) {
      res += sep + _run_(k, cache, id, cb, esc) +
        ':' + _run_(v[k], cache, id, cb, esc), sep = ','
    }
  }
  return res + '}'
}

const _run_ = (
  v: any, cache: Map<any, string>, id: [number], cb: Function | null, esc: boolean
): string => {
  let n = cache.get(v)
  if (n) return n!
  cache.set(v, setId(id))
  switch (n = __OPROTO__.toString.call(v).slice(8, -1)) {
    case 'BigInt':
      return 'L' + _run_('' + v, cache, id, cb, esc)

    case 'Object':
      return createObject(v, cache, id, cb, esc)
    case 'Function':
      return 'Z' + _run_('' + (cb && cb(v) || v.name), cache, id, cb, esc)
    case 'Boolean':
      return 'B' + +v
    case 'Symbol':
      return 'H' + _run_(v.toString().slice(7, -1), cache, id, cb, esc)

    // case 'EvalError':
    // case 'RangeError':
    // case 'ReferenceError':
    // case 'SyntaxError':
    // case 'TypeError':
    // case 'URIError':
    case 'Error': {
      let res = createObject(v, cache, id, cb, esc).slice(0, -1)
      if (res.length > 1) res += ','
      return 'E' + v.name.slice(0, 2) + res +
      _run_('message', cache, id, cb, esc) + ':' + _run_(v.message, cache, id, cb, esc) +
      '}'
    }

    case 'Number':
      return v === +v
        ? v < 0 ? '-' + _run_(-v, cache, id, cb, esc) : '' + v
        : 'N' + _run_(+v, cache, id, cb, esc)
    case 'Date':
      return 'D' + _run_(v.getTime(), cache, id, cb, esc)

    case 'String':
      return v === '' + v
        ? v !== '' + +v ? stringify(v, esc) : 'Q' + _run_(+v, cache, id, cb, esc)
        : 'S' + _run_('' + v, cache, id, cb, esc)
    case 'RegExp':
      return 'R' + _run_(v.source + ',' + v.flags, cache, id, cb, esc)

    case 'Array': {
      let res = '[', sep = ''
      let i = 0, j: number
      for (const k in v) {
        if (REG_NOT_INT.test(k)) res += sep + _run_(k, cache, id, cb, esc) + ':', sep = ''
        else if ((j = +k) > i++) for (;i <= j; i++) res += ','
        res += sep + _run_(v[k], cache, id, cb, esc), sep = ','
      }
      if ((j = v.length) > i) for (;i <= j; i++) res += sep, sep = ','
      return res + ']'
    }

    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      return `${n[0] + n[4] + n[5]}${v.length}${stringifyFast(v, esc)}`

    case 'Map': {
      const data: [string, any, [number], any, boolean, string] = ['M(', cache, id, cb, esc, '']
      // eslint-disable-next-line func-names
      v.forEach(function (this: typeof data, v: any, k: any) {
        this[0] += this[5] + _run_(k, this[1], this[2], this[3], this[4]) +
          ':' + _run_(v, this[1], this[2], this[3], this[4]), this[5] = ','
      }, data)
      return data[0] + ')'
    }
    case 'Set': {
      const data: [string, any, [number], any, boolean, string] = ['T(', cache, id, cb, esc, '']
      // eslint-disable-next-line func-names
      v.forEach(function (this: typeof data, v: any) {
        this[0] += this[5] + _run_(v, this[1], this[2], this[3], this[4]), this[5] = ','
      }, data)
      return data[0] + ')'
    }
      
    case 'ArrayBuffer':
    case 'DataView':
      return `A${n[0]}${(v = new Int8Array(n[0] === 'D' ? v.buffer : v)).length}${stringifyFast(v, esc)}`
    default:
      console.warn('cyclepack:', v)
      return createObject(v, cache, id, cb, esc)
  }
}

const DEFS_FOR_STRINGIFY =
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, void 0, NaN, true, false, 1 / 0, -1 / 0]
    .map((v, k) => [v, setId([k])]) as any

const pack = (
  thing: any, proxyForFunctions?: TypeBuildProxyForFunctions | null, stringify?: boolean
): string =>
  (stringify ? '"' : '') +
  _run_(thing, new Map(DEFS_FOR_STRINGIFY), [17], proxyForFunctions!, stringify!) +
  (stringify ? '"' : '')

const REG_LETTER = /[a-z]/
const REG_SYSTEM = /["/{}[\]():,]/
const unpack = (a: string, proxyForFunctions?: TypeParseProxyForFunctions): any => {
  const id: [number] = [17]
  const cache: { [key: string]: any } = {}
  for (let i = id[0]; i-- > 0;) cache[DEFS_FOR_STRINGIFY[i][1]] = DEFS_FOR_STRINGIFY[i][0]

  const res: any[] = []
  let cur: any = { v: res, t: '[', i: 0 }, newCur: any
  const queue: { v: any, t: any, i: number }[] = [cur]
  let v: any, k: any = res, needCache: boolean, caches: any[]
  const IKS: any[] = []
  for (let s: string, l = a.length - 1, i = -1; i++ < l;) {
    needCache = true
    switch (s = a[i]) {
      case 'B':
        // eslint-disable-next-line no-new-wrappers
        v = new Boolean(+a[++i])
        break
      case 'E'/* Error */: {
        switch (a[++i] + a[++i]) {
          case 'Ev': v = EvalError; break
          case 'Ra': v = RangeError; break
          case 'Re': v = ReferenceError; break
          case 'Sy': v = SyntaxError; break
          case 'Ty': v = TypeError; break
          case 'UR': v = URIError; break
          case 'Er':
          default: v = Error
        }
        newCur = { v: v = new v(''), t: a[++i] }
        break
      }
      case 'I':
      case 'U':
      case 'F': {
        switch (a[++i] + a[++i]) {
          case 'Ar': v = Int8Array; break
          case '8A': v = Uint8Array; break
          case '8C': v = Uint8ClampedArray; break
          case '6A': v = Int16Array; break
          case '16': v = Uint16Array; break
          case '2A': v = Int32Array; break
          case '32': v = Uint32Array; break
          case 't3': v = Float32Array; break
          case 't6': v = Float64Array; break
          default: throw s
        }
        s = ''; for (;a[++i] !== '"';) s += a[i]; v = new v(+s)
        for (let k = 0, n = ''; ;) {
          if (a[++i] === ',' || a[i] === '"') {
            v[k++] = +n, n = ''; if (a[i] === '"') break
          } else n += a[i]
        }
        break
      }
      case 'A': {
        s = a[++i]
        v = ''; for (;a[++i] !== '"';) v += a[i]; v = new Int8Array(+v)
        for (let k = 0, n = ''; ;) {
          if (a[++i] === ',' || a[i] === '"') {
            v[k++] = +n, n = ''; if (a[i] === '"') break
          } else n += a[i]
        }
        v = v.buffer
        if (s === 'D') v = new DataView(v)
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
      case 'Z'/* Function */:
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
        queue.pop(), v = cur.v
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
      s = v, caches = []
      for (;IKS.length;) {
        caches.push(v = iksf(IKS.pop(), v, proxyForFunctions))
      }
      for (;caches.length;) cache[setId(id)] = caches.pop()

      if (needCache) cache[setId(id)] = s, needCache = false
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
    case 'H': return Symbol(v)
    case 'D': return new Date(+v)
    // eslint-disable-next-line no-new-wrappers
    case 'N': return new Number(v)
    // eslint-disable-next-line no-new-wrappers
    case 'S': return new String(v)
    case 'R': return new RegExp(v.slice(0, ik = v.lastIndexOf(',')), v.slice(ik + 1))
    
    default: return proxyForFunctions && proxyForFunctions(v) || `%${v}%`
  }
}

export type TypeBuildProxyForFunctions = (fn: Function) => string | null | undefined
export type TypeParseProxyForFunctions = (fname: string) => Function | null | undefined

export { pack, unpack }
export default { pack, unpack }
