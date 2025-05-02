"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getuser = void 0;
const __1 = require("..");
const _getUsers_1 = require("../endpoints/_getUsers");
async function _getuser(sym, user) {
    return new Promise((resolve, reject) => {
        if (!(sym ?? undefined) || !(user ?? undefined))
            return reject(Error("no sym or users defined"));
        if (!__1.i.apiclientData[sym].cache)
            __1.i.apiclientData[sym].cache = {};
        if (!__1.i.apiclientData[sym].cache.twitch)
            __1.i.apiclientData[sym].cache.twitch = {};
        if (!__1.i.apiclientData[sym].cache.twitch.userids)
            __1.i.apiclientData[sym].cache.twitch.userids = { logins: {}, ids: {} };
        // let clientDataCacheTwitchUserids =
        //   i.apiclientData[sym].cache.twitch.userids;
        // if (clientDataCacheTwitchUserids.logins[user]) {
        //   return resolve(clientDataCacheTwitchUserids.logins[user]);
        // } else if (clientDataCacheTwitchUserids.ids[user]) {
        //   return resolve(clientDataCacheTwitchUserids.ids[user]);
        // }
        (0, _getUsers_1._getUsers)(sym, user)
            .then((u) => {
            if (Object.keys(u.details).length == 0)
                return reject(Error("API didn't return any data on user"));
            let ch = u.details[Object.keys(u.details)[0]];
            // clientDataCacheTwitchUserids.logins[ch.login] = ch.id;
            // clientDataCacheTwitchUserids.ids[ch.id] = ch.login;
            return resolve([ch.login, ch.id, ch]);
            // return resolve(class {
            //     static _raw = ch;
            //     static login = ch.login;
            //     static id = ch.id;
            // });
        })
            .catch((e) => {
            return reject(Error("Could not get user", { cause: e }));
        });
    });
}
exports._getuser = _getuser;
