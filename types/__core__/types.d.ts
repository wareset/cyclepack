export type EncodeOrUnevalOptions = {
    filterByList?: any[];
    filterByFunction?: (v: any) => boolean;
    removeArrayHoles?: boolean;
    removeEmptyObjects?: boolean;
    prepareFunctions?: null | ((fn: (...a: any[]) => any) => any);
    prepareClasses?: null | ((ob: {
        [k: string | number | symbol]: any;
    }) => any);
    prepareErrors?: null | ((er: Error) => any);
};
export type DecodeOptions = {
    prepareFunctions?: (data: any) => any;
    prepareClasses?: (data: any) => any;
    prepareErrors?: (data: any) => any;
};
