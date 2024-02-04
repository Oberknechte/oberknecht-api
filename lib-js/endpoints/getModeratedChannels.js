"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModeratedChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getModeratedChannels(sym, first, after, userID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let { clientID, accessToken, userID: _userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let userID_ = (0, oberknecht_utils_1.cleanChannelName)(userID) ?? _userID;
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getModeratedChannels")}${(0, oberknecht_utils_1.joinUrlQuery)(["user_id", "first", "after"], [userID_, first?.toString(), after], true)}`, {
            method: urls_1.urls._method("twitch", "getModeratedChannels"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getModeratedChannels"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getModeratedChannels = getModeratedChannels;
