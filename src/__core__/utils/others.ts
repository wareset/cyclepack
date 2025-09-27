export const ALLOWED_ERRORS = {
  __proto__: null,
  Error: 1,
  // AggregateError: 1,
  EvalError: 1,
  RangeError: 1,
  ReferenceError: 1,
  SyntaxError: 1,
  TypeError: 1,
  URIError: 1,
}

export const __String__ = String

export function noopReturnFirst(v: any) {
  return v
}

export function noopReturnTrue() {
  return true
}

export function keyToNumMayBe(s: string) {
  const n = +s
  return s !== __String__(n) ? s : n
}

export function getObjectName(obj: any) {
  return Object.prototype.toString.call(obj).slice(8, -1)
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

export function fastCheckMapKey(
  key: any,
  prepareFunctions: any,
  prepareClasses: any,
  prepareErrors: any
) {
  let res: any = true
  if (key) {
    switch (typeof key) {
      case 'function':
        res = prepareFunctions && prepareFunctions(key)
        res = res != null && res !== key
        break
      case 'object':
        if (key instanceof Error) {
          res = prepareErrors && prepareErrors(key)
          res = res !== null
        } else {
          const proto = Object.getPrototypeOf(key)
          if (
            proto &&
            proto !== Object.prototype &&
            !isPrototypeLikeObject(proto) &&
            proto !== getGlobalThis()[getObjectName(key)].prototype
          ) {
            res = prepareClasses && prepareClasses(key)
            res = res !== null
          }
        }
    }
  }
  return res
}
