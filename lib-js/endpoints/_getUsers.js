"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getUsers = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const getUsers_1 = require("./getUsers");
async function _getUsers(sym, logins, ids, noautofilterids /* Prevent filtering of number entries (ids) in logins */, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error("sym and customtoken is undefined"));
        if ((!(logins ?? undefined) && !(ids ?? undefined)))
            return reject(Error("logins and ids is undefined"));
        let logins_ = (0, oberknecht_utils_1.convertToArray)(logins, false).map(a => (0, oberknecht_utils_1.cleanChannelName)(a));
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false).map(a => String(a).toLowerCase());
        if (!noautofilterids) {
            let idsinlogins = logins_.filter(a => __1.i.regex.numregex().test(a));
            if ((idsinlogins.length > 0)) {
                ids_ = [...ids_, ...idsinlogins];
                idsinlogins.forEach(a => logins_.splice(logins_.indexOf(a)));
            }
            ;
        }
        ;
        let r = {
            logins: {},
            ids: {},
            details: {},
            loginsInvalid: []
        };
        let requestnew = [];
        r.loginsInvalid = logins_.filter(a => !oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        logins_ = logins_.filter(a => oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        if (__1.i.apiclientData[sym]?._options?.saveIDs) {
            (0, oberknecht_utils_1.recreate)(logins_).forEach(login => {
                let u = __1.i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync(["logins", login]);
                if (u) {
                    let details = __1.i.apiclientData[sym].jsonsplitters.users.getKeySync(["details", u]);
                    r.logins[login] = u;
                    r.ids[u] = login;
                    if (!details || !details._lastUpdated || (__1.i.apiclientData[sym].maxcacheage?.getUsers && (details._lastUpdated < (Date.now() - __1.i.apiclientData[sym].maxcacheage.getUsers))))
                        requestnew.push(u);
                    else
                        r.details[u] = details;
                    logins_.splice(logins_.indexOf(login), 1);
                }
                ;
            });
            (0, oberknecht_utils_1.recreate)(ids_).forEach(id => {
                let u = __1.i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync(["ids", id]);
                if (u) {
                    let details = __1.i.apiclientData[sym].jsonsplitters.users.getKeySync(["details", id]);
                    r.logins[u] = id;
                    r.ids[id] = u;
                    if (!details || !details._lastUpdated || (__1.i.apiclientData[sym].maxcacheage?.getUsers && (details._lastUpdated < (Date.now() - __1.i.apiclientData[sym].maxcacheage.getUsers))))
                        requestnew.push(id);
                    else
                        r.details[id] = details;
                    ids_.splice(ids_.indexOf(id), 1);
                }
                ;
            });
        }
        ;
        if (requestnew.length > 0) {
            await (0, getUsers_1.getUsers)(sym, [], requestnew, true)
                .then(users => {
                Object.keys(users.details).forEach(a => r.details[a] = users.details[a]);
            })
                .catch();
        }
        ;
        if (logins_.length === 0 && ids_.length === 0)
            return resolve(r);
        (0, getUsers_1.getUsers)(sym, logins_, ids_, noautofilterids, customtoken)
            .then(async (dat) => {
            Object.keys(dat.details).forEach(a => {
                let b = dat.details[a];
                r.ids[b.id] = b.login;
                r.logins[b.login] = b.id;
                r.details[b.id] = b;
            });
            return resolve(r);
        })
            .catch(e => {
            return reject(Error("Could not get users", { "cause": e }));
        });
    });
}
exports._getUsers = _getUsers;
;
