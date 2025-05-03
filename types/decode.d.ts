export default function unpack(variable: string, replace?: {
    functions?: null | ((data: any) => any);
    classes?: null | ((data: any) => any);
    errors?: null | ((data: any) => any);
}): any;
