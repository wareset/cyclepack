const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export function base64Encode(data: string) {
  // data = encodeURIComponent(data)

  const res: string[] = []
  let len = data.length
  let i: number = 0

  let char0: number, char1: number, char2: number

  for (let l = len - 3; i <= l; i += 3) {
    res.push(
      b64[(char0 = data.charCodeAt(i)) >>> 2],
      b64[((char0 & 3) << 4) | ((char1 = data.charCodeAt(i + 1)) >>> 4)],
      b64[((char1 & 15) << 2) | ((char2 = data.charCodeAt(i + 2)) >>> 6)],
      b64[char2 & 63]
    )
  }
  if ((len %= 3) === 2) {
    res.push(
      b64[(char0 = data.charCodeAt(i)) >>> 2],
      b64[((char0 & 3) << 4) | ((char1 = data.charCodeAt(i + 1)) >>> 4)],
      b64[(char1 & 15) << 2],
      '='
    )
  } else if (len === 1) {
    res.push(
      b64[(char0 = data.charCodeAt(i)) >>> 2],
      b64[(char0 & 3) << 4],
      '=='
    )
  }

  return res.join('')
}

export function base64Decode(data: string) {
  const res: string[] = []
  const len = data.length

  let i = 0
  // let a: number
  let b: number
  let c: number
  // let d: number

  const fc = String.fromCharCode
  for (i = 0; i < len; i += 4) {
    res.push(
      fc((b64.indexOf(data[i]) << 2) | ((b = b64.indexOf(data[i + 1])) >>> 4)),
      fc(((b << 4) & 0xf0) | (((c = b64.indexOf(data[i + 2])) >>> 2) & 0x0f)),
      fc(((c << 6) & 0xc0) | b64.indexOf(data[i + 3]))
    )
  }

  if (data[len - 2] === '=') res.length -= 2
  else if (data[len - 1] === '=') res.length--

  // return decodeURIComponent(res.join(''))
  return res.join('')
}

// export const stringToBase64: (s: string) => string =
//   typeof btoa === 'function'
//     ? btoa
//     : function (s: string): string {
//         return Buffer.from(s).toString('base64')
//       }
export function arrayBufferToBase64(v: ArrayBuffer) {
  const dv = new DataView(v)
  const byteLength = dv.byteLength
  const arr: string[] = Array(byteLength)
  const fromCharCode = String.fromCharCode
  for (let i = 0; i < byteLength; i++) arr[i] = fromCharCode(dv.getUint8(i))
  return base64Encode(arr.join(''))
}

// export const base64ToString: (s: string) => string =
//   typeof atob === 'function'
//     ? atob
//     : function (s: string): string {
//         return Buffer.from(s, 'base64').toString()
//       }
export function base64ToArrayBuffer(s: string) {
  s = base64Decode(s)
  const length = s.length
  const ab = new ArrayBuffer(length)
  const dv = new DataView(ab)
  for (let i = 0; i < length; i++) dv.setUint8(i, s.charCodeAt(i))
  return ab
}
