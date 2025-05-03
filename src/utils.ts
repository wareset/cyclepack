const rx_escapable =
  /[<\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
export function stringEncode(s: string): string {
  return s.replace(rx_escapable, function (v) {
    switch (v) {
      // case '"':
      //   return '\\"'
      case '\\':
        return '\\\\'
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '\t':
        return '\\t'
      case '\b':
        return '\\b'
      case '\f':
        return '\\f'
      default:
        return '\\u' + ('0000' + v.charCodeAt(0).toString(16)).slice(-4)
    }
  })
}

const rx_for_decode = /\\u(....)|\\.?/g
export function stringDecode(s: string): string {
  return s.replace(rx_for_decode, function (v, unicode) {
    switch (v[1]) {
      case 'n':
        return '\n'
      case 'r':
        return '\r'
      case 't':
        return '\t'
      case 'b':
        return '\b'
      case 'f':
        return '\f'
      case 'u':
        return String.fromCharCode(parseInt(unicode, 16))
      default:
        return v[1] || ''
    }
  })
}

const _btoa: (s: string) => string =
  typeof btoa !== 'undefined'
    ? btoa
    : function (s: string): string {
        return Buffer.from(s).toString('base64')
      }

const _atob: (s: string) => string =
  typeof atob !== 'undefined'
    ? atob
    : function (s: string): string {
        return Buffer.from(s, 'base64').toString()
      }

// function base64Encode(s: string): string {
//   return _btoa(
//     encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function (_, p1) {
//       return String.fromCharCode(+('0x' + p1))
//     })
//   )
// }

// function base64Decode(s: string): string {
//   const res: string[] = []
//   for (let a = _atob(s), i = 0, l = a.length; i < l; i++) {
//     res.push('%' + ('00' + a.charCodeAt(i).toString(16)).slice(-2))
//   }
//   return decodeURIComponent(res.join(''))
// }

export function arrayBufferToBase64(v: ArrayBuffer) {
  const dv = new DataView(v)
  const byteLength = dv.byteLength
  const arr: string[] = Array(byteLength)
  const fromCharCode = String.fromCharCode
  for (let i = 0; i < byteLength; i++) arr[i] = fromCharCode(dv.getUint8(i))
  return _btoa(arr.join(''))
}

export function base64ToArrayBuffer(s: string) {
  s = _atob(s)
  const length = s.length
  const ab = new ArrayBuffer(length)
  const dv = new DataView(ab)
  for (let i = 0; i < length; i++) dv.setUint8(i, s.charCodeAt(i))
  return ab
}

// export function isPrimitiveValue(v: any) {
//   return Object(v) !== v
// }

// export function isPlainObject(v: any): v is { [key: string]: any } {
//   return (
//     v != null && ((v = Object.getPrototypeOf(v)) === Object.prototype || !v)
//   )
// }

let globalObject: any
export function getGlobalObject() {
  return (
    globalObject ||
    (globalObject =
      (typeof globalThis === 'object' && globalThis) ||
      (typeof window === 'object' && window) ||
      (typeof global === 'object' && global) ||
      (typeof self === 'object' && self) ||
      // (function (this: any) {
      //   return this
      // })() ||
      Function('return this')())
  )
}

// const rx_json = /\{|\}|\[|\]|,|:|"(?:[^\\"]|\\.)*"|[^{}[\],:"\s]+/g
const rx_json = /\{|\}|\[|\]|,|:|"|[^{}[\],:"\s]+/g
const META: any = { b: '\b', t: '\t', n: '\n', f: '\f', r: '\r' }
export function jsonParse(s: string) {
  let env: (typeof cur)[] = []
  let cur: { t: '[' | '{'; o: any } = { t: '[', o: env }

  const VAL_VOID = {}
  let val: any = VAL_VOID
  if (s) {
    rx_json.lastIndex = 0
    let key: any

    const toInt = parseInt
    const fromCode = String.fromCharCode

    let m: RegExpExecArray | null, c: string

    const save = function (key: any, val: any) {
      val !== VAL_VOID && (cur.t === '[' ? cur.o.push(val) : (cur.o[key] = val))
      return val
    }
    for (; (m = rx_json.exec(s)); ) {
      switch ((c = m[0])) {
        case ':':
          key = val
          break
        case ',':
          save(key, val), (val = VAL_VOID)
          break
        case '[':
          env.push((cur = { t: c, o: save(key, []) }))
          break
        case '{':
          env.push((cur = { t: c, o: save(key, {}) }))
          break
        case ']':
        case '}':
          save(key, val), (val = VAL_VOID)
          env.pop(), (cur = env[env.length - 1])
          break
        case '"': {
          const raw: string[] = []
          let i = m.index
          for (let l = s.length; ++i < l && s[i] !== c; )
            raw.push(
              s[i] !== '\\'
                ? s[i]
                : s[++i] in META
                  ? META[s[i]]
                  : s[i] === 'u'
                    ? fromCode(toInt(s[++i] + s[++i] + s[++i] + s[++i], 16))
                    : s[i] || ''
            )
          rx_json.lastIndex = i + 1
          val = raw.join('')
          break
        }
        default:
          val =
            c === 'false'
              ? false
              : c === 'true'
                ? true
                : c === 'null'
                  ? null
                  : +c
      }
    }
  }

  return env.length ? cur : val !== VAL_VOID ? val : void 0
}

export function keyToNumMayBe(s: string) {
  const n = +s
  return s !== '' + n ? s : n
}
