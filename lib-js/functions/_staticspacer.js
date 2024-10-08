"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._staticspacer = _staticspacer;
function _staticspacer(spacerwidth /* Number of tabs */, spacercontent, spacecolor) {
    let color = (() => {
        if (!spacecolor)
            return "";
        if (typeof spacecolor === "string") {
            return spacecolor;
        }
        if (spacercontent == "[ERROR]") {
            return "\x1b[4;1;31m";
        }
        return "\x1b[4;1;36m";
    });
    let sw = spacerwidth * 8;
    let s = sw - spacercontent.length;
    let sr = spacercontent;
    if (s > 0) {
        let st = (s >= 8 ? ` `.repeat(8).repeat(Math.floor(s / 8)) : '');
        let ss = " ".repeat(s % 8);
        sr = `${color()}${sr}\x1b[0m${ss}${st}`;
    }
    ;
    return sr;
}
;
