"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtAPIOptions = void 0;
exports.oberknechtAPIOptions = {
    debug: Number(),
    token: String(),
    startPath: String() ?? "package path",
    saveIDs: Boolean(),
    // starting at project dir (process.cwd())
    saveIDsPath: String(),
    filechange_interval: Number() ?? 10000,
    skipCreation: Boolean(),
    // ivr.fi
    use3rdparty: {
        getUsers: Boolean(),
    },
    maxcacheage: {
        getUsers: Number(),
    },
};
