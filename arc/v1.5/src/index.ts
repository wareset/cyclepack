// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

import type { IEncodeOptions } from './encode'
import type { IDecodeOptions } from './decode'
export type { IEncodeOptions, IDecodeOptions, IEncodeOptions as IUnevalOptions }

export { default as decode } from './decode'
export { default as encode } from './encode'
export { default as uneval } from './uneval'
