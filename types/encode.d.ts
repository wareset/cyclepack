export type IEncodeOptions = {
    allowNulls?: boolean;
    allowUndefineds?: boolean;
    allowEmptyObjects?: boolean;
    functions?: null | ((fn: (...a: any) => any) => any);
    classes?: null | ((object: {
        [k: string]: any;
    }) => any);
    errors?: null | ((object: Error) => any);
};
export default function encode(variable: any, options?: IEncodeOptions): any;
