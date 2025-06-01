export type IDecodeOptions = {
    functions?: null | ((data: any) => any);
    classes?: null | ((data: any) => any);
    errors?: null | ((data: any) => any);
};
export default function decode(variable: string, options?: IDecodeOptions): any;
