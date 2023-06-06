"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._wf = void 0;
const _mainpath_1 = require("../functions/_mainpath");
const fs_1 = __importDefault(require("fs"));
function _wf(sym, wfpath, wffile) {
    if (!wfpath)
        throw new Error(`_wf: wfpath is undefined`);
    if (!wffile)
        throw new Error(`_wf: wffile is undefined`);
    wfpath = (0, _mainpath_1._mainpath)(sym, wfpath);
    try {
        switch (typeof wffile) {
            case "string":
                {
                    fs_1.default.writeFileSync(wfpath, wffile, "utf-8");
                    break;
                }
                ;
            case "object":
                {
                    fs_1.default.writeFileSync(wfpath, JSON.stringify(wffile), "utf-8");
                    break;
                }
                ;
            default:
                {
                    throw new Error(`_wf: typeof wffile is ${typeof wffile} (expected string or object)`);
                }
                ;
        }
        ;
    }
    catch (e) {
        throw new Error(`_wf: Could not write file\n${e}`);
    }
    ;
}
exports._wf = _wf;
;
