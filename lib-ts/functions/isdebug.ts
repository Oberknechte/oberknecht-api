import { i } from "..";

export function isdebug(sym: string, num: number) {
    return (i.apiclientData[sym]?._options?.debug >= (num ?? 1));
};