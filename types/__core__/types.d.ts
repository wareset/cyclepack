export interface IEncodeOrUnevalOptions {
    filterByList?: any[];
    filterByFunction?: (v: any) => unknown;
    removeArrayHoles?: boolean;
    removeEmptyObjects?: boolean;
    prepareFunctions?: null | ((fn: (...a: any[]) => any) => any);
    prepareClasses?: null | ((ob: {
        [k: string | number | symbol]: any;
    }) => any);
    prepareErrors?: null | ((er: Error) => any);
}
export interface IDecodeOptions {
    prepareFunctions?: null | ((data: any) => any);
    prepareClasses?: null | ((data: any) => any);
    prepareErrors?: null | ((data: any) => any);
}
