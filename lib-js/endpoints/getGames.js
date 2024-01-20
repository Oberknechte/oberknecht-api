"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getGames(sym, ids, names, igdbIDs, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(ids ?? undefined) && !(names ?? undefined) && !(igdbIDs ?? undefined))
            return reject(Error(`ids, names and igbdIDs is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
        let names_ = (0, oberknecht_utils_1.convertToArray)(names, false);
        let igdbIDs_ = (0, oberknecht_utils_1.convertToArray)(igdbIDs, false);
        names_.push(...ids_.filter((a) => !__1.i.regex.numregex().test(a)));
        ids_ = ids_.filter((a) => __1.i.regex.numregex().test(a));
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getGames")}${(0, oberknecht_utils_1.joinUrlQuery)(["id", "name", "igdb_id"], [ids_, names_.map((a) => encodeURI(a)), igdbIDs_], true)}`, {
            method: urls_1.urls._method("twitch", "getGames"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getGames"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getGames = getGames;
