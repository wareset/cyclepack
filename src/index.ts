// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects

export type { EncodeOrUnevalOptions, DecodeOptions } from './__core__/types'

import { default as decode } from './__core__/decode'
import { default as encode } from './__core__/encode'
import { default as uneval } from './__core__/uneval'

export { encode, decode, uneval }
export default { encode, decode, uneval }
