"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getUser = void 0;
const _getUsers_1 = require("./_getUsers");
function _getUser(sym, user, refreshCache) {
    return new Promise((resolve, reject) => {
        (0, _getUsers_1._getUsers)(sym, user, undefined, undefined, undefined, refreshCache)
            .then((u) => {
            if (Object.keys(u.details).length == 0)
                return reject(Error("API didn't return any data on user"));
            return resolve(u.details[Object.keys(u.details)[0]]);
        })
            .catch((e) => {
            return reject(Error("Could not get user", { cause: e }));
        });
    });
}
exports._getUser = _getUser;
