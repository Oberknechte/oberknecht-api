"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModeratedChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getModeratedChannels(sym, userID, first, after, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let userID_ = userID ?? __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                userID_ = a.user_id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getModeratedChannels")}${(0, oberknecht_utils_1.joinUrlQuery)(["user_id", "first", "after"], [userID_, first, after], true)}`, {
            method: urls_1.urls._method("twitch", "getModeratedChannels"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getModeratedChannels"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getModeratedChannels = getModeratedChannels;
