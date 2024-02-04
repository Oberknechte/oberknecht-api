"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowedChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getFollowedChannels(sym, broadcasterID, first, after, userID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let broadcasterID_ = broadcasterID;
    let { clientID, accessToken, userID: _userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let userID_ = (0, oberknecht_utils_1.cleanChannelName)(userID) ?? _userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(broadcasterID_))
        await (0, _getUser_1._getUser)(sym, broadcasterID_).then((u) => {
            broadcasterID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getFollowedChannels")}${(0, oberknecht_utils_1.joinUrlQuery)(["user_id", "broadcaster_id", "first", "after"], [userID_, broadcasterID_, first, after], true)}`, {
            method: urls_1.urls._method("twitch", "getFollowedChannels"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getFollowedChannels"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getFollowedChannels = getFollowedChannels;
