// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

import type { IEncodeOptions } from './encode'
import type { IDecodeOptions } from './decode'
export type { IEncodeOptions, IDecodeOptions, IEncodeOptions as IUnevalOptions }

export { default as decode, default as unpack } from './decode'
export { default as encode, default as pack } from './encode'
export { default as uneval } from './uneval'
