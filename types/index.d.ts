declare const build: (thing: any, proxyForFunctions?: TypeBuildProxyForFunctions) => string;
declare const parse: (a: string, proxyForFunctions?: TypeParseProxyForFunctions) => any;
export declare type TypeBuildProxyForFunctions = (fn: Function) => string | null | undefined;
export declare type TypeParseProxyForFunctions = (fname: string) => Function | null | undefined;
export { build, parse };
declare const _default: {
    build: (thing: any, proxyForFunctions?: TypeBuildProxyForFunctions) => string;
    parse: (a: string, proxyForFunctions?: TypeParseProxyForFunctions) => any;
};
export default _default;
