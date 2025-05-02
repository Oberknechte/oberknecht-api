"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isdebug = void 0;
const __1 = require("..");
function isdebug(sym, num) {
    return (__1.i.apiclientData[sym]?._options?.debug >= (num ?? 1));
}
exports.isdebug = isdebug;
;
