export default function pack(variable: any, replace?: {
    allowNulls?: boolean;
    allowUndefineds?: boolean;
    allowEmptyObjects?: boolean;
    functions?: null | ((fn: (...a: any) => any) => any);
    classes?: null | ((object: {
        [k: string]: any;
    }) => any);
    errors?: null | ((object: Error) => any);
}): any;
