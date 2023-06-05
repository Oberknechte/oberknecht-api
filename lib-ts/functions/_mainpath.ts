import path from "path";
import { i } from "..";

export function _mainpath(sym: string, path_: string) {
    let startPath = (i.apiclientData?.[sym]?._options?.startPath ?? path.resolve(path.dirname(__dirname), "../"));

    if (!path_ || (path_?.length ?? 0) === 0) {
        return path.resolve(startPath, "./");
    } else {
        if (Array.isArray(path_)) path_ = path.resolve(...path_);
        if (!path_.startsWith(startPath)) path_ = path.resolve(startPath, path_);
        return path_;
    };
};