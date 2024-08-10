"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getUsers = _getUsers;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const getUsers_1 = require("./getUsers");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function _getUsers(sym, logins, ids, noautofilterids /* Prevent filtering of number entries (ids) in logins */, customToken, refreshCache) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([logins, ids], ["logins", "ids"], true);
    return new Promise(async (resolve, reject) => {
        let logins_ = (0, oberknecht_utils_1.convertToArray)(logins, false).map((a) => String((0, oberknecht_utils_1.cleanChannelName)(a).toLowerCase()));
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false).map((a) => String(a).toLowerCase());
        if (!noautofilterids) {
            let idsinlogins = logins_.filter((a) => __1.i.regex.numregex().test(a));
            if (idsinlogins.length > 0) {
                ids_ = [...ids_, ...idsinlogins];
                logins_ = logins_.filter((a) => !__1.i.regex.numregex().test(a));
            }
        }
        let r = {
            logins: {},
            ids: {},
            details: {},
            loginsInvalid: [],
        };
        let requestnew = [];
        r.loginsInvalid = logins_.filter((a) => !oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        logins_ = logins_.filter((a) => oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        if (!refreshCache && __1.i.apiclientData[sym]?._options?.saveIDs) {
            (0, oberknecht_utils_1.recreate)(logins_).forEach((login) => {
                let u = __1.i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync([
                    "logins",
                    login,
                ]);
                if (u) {
                    let details = __1.i.apiclientData[sym].jsonsplitters.users.getKeySync([
                        "details",
                        u,
                    ]);
                    r.logins[login] = u;
                    r.ids[u] = login;
                    if (!details ||
                        !details._lastUpdated ||
                        (__1.i.apiclientData[sym].maxcacheage?.getUsers &&
                            details._lastUpdated <
                                Date.now() - __1.i.apiclientData[sym].maxcacheage.getUsers))
                        requestnew.push(u);
                    else
                        r.details[u] = details;
                    logins_.splice(logins_.indexOf(login), 1);
                }
            });
            (0, oberknecht_utils_1.recreate)(ids_).forEach((id) => {
                let u = __1.i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync([
                    "ids",
                    id,
                ]);
                if (u) {
                    let details = __1.i.apiclientData[sym].jsonsplitters.users.getKeySync([
                        "details",
                        id,
                    ]);
                    r.logins[u] = id;
                    r.ids[id] = u;
                    if (!details ||
                        !details._lastUpdated ||
                        (__1.i.apiclientData[sym].maxcacheage?.getUsers &&
                            details._lastUpdated <
                                Date.now() - __1.i.apiclientData[sym].maxcacheage.getUsers))
                        requestnew.push(id);
                    else
                        r.details[id] = details;
                    ids_.splice(ids_.indexOf(id), 1);
                }
            });
        }
        if (requestnew.length > 0) {
            await (0, getUsers_1.getUsers)(sym, [], requestnew, true)
                .then((users) => {
                Object.keys(users.details).forEach((a) => {
                    if (users.details[a].email)
                        delete users.details[a].email;
                    r.details[a] = users.details[a];
                });
            })
                .catch((e) => { });
        }
        if (logins_.length === 0 && ids_.length === 0)
            return resolve(r);
        (0, getUsers_1.getUsers)(sym, logins_, ids_, noautofilterids, customToken)
            .then(async (dat) => {
            Object.keys(dat.details).forEach((a) => {
                let b = dat.details[a];
                r.ids[b.id] = b.login;
                r.logins[b.login] = b.id;
                if (b.email)
                    delete b.email;
                r.details[b.id] = b;
            });
            return resolve(r);
        })
            .catch((e) => {
            return reject(Error("Could not get users", { cause: e }));
        });
    });
}
