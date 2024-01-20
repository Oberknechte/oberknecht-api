"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getUsers(sym, logins, ids, noautofilterids /* Prevent filtering of number entries (ids) in logins */, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let logins_ = (0, oberknecht_utils_1.convertToArray)(logins, false).map((a) => (0, oberknecht_utils_1.cleanChannelName)(a));
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false).filter((a) => typeof a === "number" || oberknecht_utils_1.regex.numregex().test(a.toString()));
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch(reject);
        }
        if (!(noautofilterids ?? false)) {
            let idsinlogins = logins_.filter((a) => oberknecht_utils_1.regex.numregex().test(a));
            if (idsinlogins.length > 0) {
                ids_ = [...ids_, ...idsinlogins];
                logins_ = logins_.filter((a) => !oberknecht_utils_1.regex.numregex().test(a));
            }
        }
        let loginsInvalid = logins_.filter((a) => !oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        logins_ = logins_.filter((a) => oberknecht_utils_1.regex.twitch.usernamereg().test(a));
        let chunks = (0, oberknecht_utils_1.chunkArray)([...logins_, ...ids_], __1.i.apiclientData[sym]._options.use3rdparty?.getUsers ? 50 : 100);
        let ret = {
            logins: {},
            ids: {},
            details: {},
            loginsInvalid: loginsInvalid,
        };
        await Promise.all(chunks.map((chunk) => {
            let chunkLogins = chunk.filter((a) => logins_.includes(a));
            let chunkIDs = chunk.filter((a) => ids_.includes(a));
            return new Promise((resolve2, reject2) => {
                let urlPath = ["twitch", "users"];
                let url = `${urls_1.urls._url(...urlPath)}${(0, oberknecht_utils_1.joinUrlQuery)(["login", "id"], [chunkLogins, chunkIDs], true)}`;
                if (__1.i.apiclientData[sym]._options?.use3rdparty?.getUsers) {
                    urlPath = ["ivrfitwitch", "users"];
                    url = `${urls_1.urls._url(...urlPath)}${chunkLogins.length > 0 ? `?login=${chunkLogins}` : ""}${chunkIDs.length > 0
                        ? `${chunkLogins.length > 0 ? "&" : "?"}id=${chunkIDs}`
                        : ""}`;
                }
                (0, oberknecht_request_1.request)(url, {
                    method: urls_1.urls._method(...urlPath),
                    headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
                }, (e, r) => {
                    if (e || r.status !== urls_1.urls._code(...urlPath))
                        return reject2(Error(e ?? r.data));
                    let d = __1.i.apiclientData[sym]._options?.use3rdparty?.getUsers
                        ? r.data
                        : r.data.data;
                    d.forEach((a) => {
                        let b = {
                            ...a,
                            _lastUpdated: Date.now(),
                            displayNameParsed: !(0, oberknecht_utils_1.isNaM)(a.display_name)
                                ? a.display_name
                                : (0, oberknecht_utils_1.firstCap)(a.login),
                        };
                        if (__1.i.apiclientData[sym]?._options?.saveIDs) {
                            __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["logins", a.login], a.id);
                            __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["ids", a.id], a.login);
                            if (!__1.i.apiclientData[sym].jsonsplitters.users.getKeySync(["details"], true))
                                __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["details"], {});
                            __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["details", a.id], b);
                        }
                        ret.logins[a.login] = a.id;
                        ret.ids[a.id] = a.login;
                        ret.details[a.id] = b;
                    });
                    return resolve2();
                });
            });
        })).then(() => {
            return resolve(ret);
        });
    });
}
exports.getUsers = getUsers;
