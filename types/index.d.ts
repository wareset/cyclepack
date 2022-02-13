declare const build: (v: any, proxyForFunctions?: TypeBuildProxyForFunctions) => string;
declare const parse: (a: string, proxyForFunctions?: TypeParseProxyForFunctions) => any;
export declare type TypeBuildProxyForFunctions = (fn: Function) => string;
export declare type TypeParseProxyForFunctions = (fname: string) => any;
export { build, parse };
declare const _default: {
    build: (v: any, proxyForFunctions?: TypeBuildProxyForFunctions) => string;
    parse: (a: string, proxyForFunctions?: TypeParseProxyForFunctions) => any;
};
export default _default;
