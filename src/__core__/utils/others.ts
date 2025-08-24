export function noopReturnFirst(v: any) {
  return v
}

export function noopReturnTrue() {
  return true
}

export function keyToNumMayBe(s: string) {
  const n = +s
  return s !== '' + n ? s : n
}

let globalObject: any
// export function getGlobalThis() {
//   let obj = 'object'
//   return (
//     globalObject ||
//     (globalObject =
//       (typeof globalThis === obj && globalThis) ||
//       (typeof global === obj && global) ||
//       (typeof window === obj && window) ||
//       (typeof self === obj && self) ||
//       Function('return this')()) ||
//     {}
//   )
// }
export function getGlobalThis() {
  const object = 'object'
  return (
    globalObject ||
    (globalObject =
      typeof globalThis === object
        ? globalThis
        : typeof window === object
          ? window
          : typeof global === object
            ? global
            : typeof self === object
              ? self
              : Function('return this')() || {})
  )
}

export function isObjectPrototype(prototype: any) {
  return (
    (typeof prototype.constructor !== 'function' ||
      prototype.constructor.prototype !== prototype) &&
    typeof prototype === 'object'
  )
}

// function objectValues(obj: object) {
//   return Object.keys(obj).map(function (this: any, v: string) {
//     return this[v]
//   }, obj)
// }
// export function isObjectPrototype(prototype: any) {
//   if (
//     (typeof prototype.constructor !== 'function' ||
//       prototype.constructor.prototype !== prototype) &&
//     typeof prototype === 'object'
//   ) {
//     try {
//       ;(Object.values || objectValues)(prototype)
//       return true
//     } catch {
//       console.error(prototype)
//     }
//   }
//   return false
// }

export function checkIsCircularError(a: any, b: any) {
  if (a === b) {
    console.error(a)
    throw 'Cyclepack: circular'
  }
}
