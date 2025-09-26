export const __String__ = String

export function noopReturnFirst(v: any) {
  return v
}

export function noopReturnNaN() {
  return NaN
}

export function noopReturnTrue() {
  return true
}

export function keyToNumMayBe(s: string) {
  const n = +s
  return s !== __String__(n) ? s : n
}

let globalObject: any
export function getGlobalThis() {
  if (!globalObject) {
    const object = 'object'
    globalObject =
      typeof globalThis === object
        ? globalThis
        : typeof window === object
          ? window
          : typeof global === object
            ? global
            : typeof self === object
              ? self
              : Function('return this')() || {}
  }
  return globalObject
}

export function isPrototypeLikeObject(prototype: any) {
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
// export function isPrototypeLikeObject(prototype: any) {
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
