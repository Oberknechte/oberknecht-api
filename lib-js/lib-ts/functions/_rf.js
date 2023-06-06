"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._rf = void 0;
const _mainpath_1 = require("../functions/_mainpath");
const fs_1 = __importDefault(require("fs"));
function _rf(sym, rfpath, parse_json) {
    if (!rfpath)
        throw new Error(`_rf: rfpath is undefined`);
    rfpath = (0, _mainpath_1._mainpath)(sym, rfpath);
    try {
        if (fs_1.default.existsSync(rfpath)) {
            let file = fs_1.default.readFileSync(rfpath, "utf-8");
            if (rfpath.endsWith(".json") && parse_json) {
                if (typeof file === "string" && typeof JSON.parse(file) === "object")
                    return JSON.parse(file);
                return {};
            }
            else {
                return file;
            }
            ;
        }
        else {
            throw new Error(`_rf: File does not exist\nPath: ${rfpath}`);
        }
    }
    catch (e) {
        throw new Error(`_rf: Could not read file\n${e}`);
    }
    ;
}
exports._rf = _rf;
;
