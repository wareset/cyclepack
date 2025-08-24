const rx_escapable =
  /[·"\\<\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
function replaceForEncode(v: string) {
  switch (v) {
    case '"':
      return '\\"'
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
}
export function stringEncode(s: string): string {
  return s.replace(rx_escapable, replaceForEncode)
}

const rx_for_decode = /\\u([\da-zA-Z]{4})|\\.?/g
function replaceForDecode(v: string, unicode: string) {
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
}
export function stringDecode(s: string): string {
  return s.replace(rx_for_decode, replaceForDecode)
}
