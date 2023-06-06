"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mainpath = void 0;
const path_1 = __importDefault(require("path"));
const __1 = require("..");
function _mainpath(sym, path_) {
    let startPath = (__1.i.apiclientData?.[sym]?._options?.startPath ?? path_1.default.resolve(path_1.default.dirname(__dirname), "../"));
    if (!path_ || (path_?.length ?? 0) === 0) {
        return path_1.default.resolve(startPath, "./");
    }
    else {
        if (Array.isArray(path_))
            path_ = path_1.default.resolve(...path_);
        if (!path_.startsWith(startPath))
            path_ = path_1.default.resolve(startPath, path_);
        return path_;
    }
    ;
}
exports._mainpath = _mainpath;
;
