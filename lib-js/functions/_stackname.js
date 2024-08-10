"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._stackname = _stackname;
const _staticspacer_1 = require("./_staticspacer");
function _stackname(...args) {
    let opt = [...arguments][0];
    // let args = [...arguments];
    if (!(opt ?? undefined) && !isNaN(opt))
        args.shift();
    let stackret = args.map(a => {
        if (typeof a === "string") {
            return `[${a.toUpperCase()}]`;
        }
        else {
            return `nameerr`;
        }
    });
    let stackcolor = (stackret.some(s2 => { return s2 == "[ERROR]"; }) ? "\x1b[4;31m" : "\x1b[4;1;36m");
    switch (opt) {
        default: {
            return [
                stackret.join(" "),
                stackret,
                stackret.map(s => { return (0, _staticspacer_1._staticspacer)(2, s, stackcolor); }),
                stackret.map(s => { return (0, _staticspacer_1._staticspacer)(2, s, stackcolor); }).join(" ")
            ];
        }
        case 1: {
            return [
                stackret.join(" "),
                stackret,
                stackret.map(s => { return (0, _staticspacer_1._staticspacer)(2, s); }),
                stackret.map(s => { return (0, _staticspacer_1._staticspacer)(2, s); }).join(" ")
            ];
        }
    }
}
;
