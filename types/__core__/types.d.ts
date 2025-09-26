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
    prepareFunctions?: null | ((data: any) => any);
    prepareClasses?: null | ((data: any) => any);
    prepareErrors?: null | ((data: any) => any);
};
