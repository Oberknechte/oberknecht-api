"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowedChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getuser_1 = require("../operations/_getuser");
async function getFollowedChannels(sym, userID, broadcasterID, first, after, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        userID = __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                userID = a.user_id;
            })
                .catch(reject);
        }
        if (broadcasterID &&
            !__1.i.regex.numregex().test(broadcasterID) &&
            __1.i.regex.twitch.usernamereg().test(broadcasterID)) {
            await (0, _getuser_1._getuser)(sym, broadcasterID)
                .then((u) => {
                broadcasterID = u[1];
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getFollowedChannels")}${(0, oberknecht_utils_1.joinUrlQuery)(["user_id", "broadcaster_id", "first", "after"], [userID, broadcasterID, first, after], true)}`, {
            method: urls_1.urls._method("twitch", "getFollowedChannels"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getFollowedChannels"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.getFollowedChannels = getFollowedChannels;
