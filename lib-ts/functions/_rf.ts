import { _mainpath } from "../functions/_mainpath";
import fs from "fs";

export function _rf(sym: string, rfpath: string, parse_json: boolean) {
    if (!rfpath) throw new Error(`_rf: rfpath is undefined`);
    rfpath = _mainpath(sym, rfpath);

    try {
        if (fs.existsSync(rfpath)) {
            let file = fs.readFileSync(rfpath, "utf-8");
            if (rfpath.endsWith(".json") && parse_json) {
                if (typeof file === "string" && typeof JSON.parse(file) === "object") return JSON.parse(file);
                return {};
            } else {
                return file;
            };
        } else {
            throw new Error(`_rf: File does not exist\nPath: ${rfpath}`);
        }
    } catch (e) {
        throw new Error(`_rf: Could not read file\n${e}`);
    };
};