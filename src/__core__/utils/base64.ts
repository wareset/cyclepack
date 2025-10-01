export const base64Encode: (s: string) => string =
  typeof btoa === 'function'
    ? btoa
    : function (s: string): string {
        return Buffer.from(s).toString('base64')
      }
export function arrayBufferToBase64(v: ArrayBuffer) {
  const dv = new DataView(v)
  const byteLength = dv.byteLength
  const arr: string[] = Array(byteLength)
  const fromCharCode = String.fromCharCode
  for (let i = 0; i < byteLength; ++i) arr[i] = fromCharCode(dv.getUint8(i))
  return base64Encode(arr.join(''))
}

export const base64Decode: (s: string) => string =
  typeof atob === 'function'
    ? atob
    : function (s: string): string {
        return Buffer.from(s, 'base64').toString()
      }
export function base64ToArrayBuffer(s: string) {
  s = base64Decode(s)
  const length = s.length
  const ab = new ArrayBuffer(length)
  const dv = new DataView(ab)
  for (let i = 0; i < length; ++i) dv.setUint8(i, s.charCodeAt(i))
  return ab
}
