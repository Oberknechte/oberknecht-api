import { _mainpath } from "../functions/_mainpath";
import fs from "fs";

export function _wf(sym: string, wfpath: string, wffile: any) {
    if (!wfpath) throw new Error(`_wf: wfpath is undefined`);
    if (!wffile) throw new Error(`_wf: wffile is undefined`);
    wfpath = _mainpath(sym, wfpath);

    try {
        switch (typeof wffile) {
            case "string": {
                fs.writeFileSync(wfpath, wffile, "utf-8");
                break;
            };

            case "object": {
                fs.writeFileSync(wfpath, JSON.stringify(wffile), "utf-8");
                break;
            };

            default: {
                throw new Error(`_wf: typeof wffile is ${typeof wffile} (expected string or object)`);
            };
        };
    } catch (e) {
        throw new Error(`_wf: Could not write file\n${e}`);
    };
};