"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBroadcasterSubscriptions = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getBroadcasterSubscriptions(sym, customtoken, user_id, first, after, before) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let user_id_ = (0, oberknecht_utils_1.convertToArray)(user_id, false);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getBroadcasterSubscriptions")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "user_id", "first", "after", "before"], [broadcaster_id_, user_id_, first, after, before], true)}`, {
            method: urls_1.urls._method("twitch", "getBroadcasterSubscriptions"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e ||
                r.status !== urls_1.urls._code("twitch", "getBroadcasterSubscriptions"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getBroadcasterSubscriptions = getBroadcasterSubscriptions;
