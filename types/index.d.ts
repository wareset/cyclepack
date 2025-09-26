export type { EncodeOrUnevalOptions, DecodeOptions } from './__core__/types';
import { default as decode } from './__core__/decode';
import { default as encode } from './__core__/encode';
import { default as uneval } from './__core__/uneval';
export { encode, decode, uneval };
declare const _default: {
    encode: typeof encode;
    decode: typeof decode;
    uneval: typeof uneval;
};
export default _default;
