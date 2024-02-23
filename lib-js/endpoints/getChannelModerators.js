"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelModerators = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getChannelModerators(sym, broadcasterID, userID, first, after, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let userID_ = (0, oberknecht_utils_1.cleanChannelName)(userID);
    let { clientID, accessToken, userID: _userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = _userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(userID_))
        await (0, _getUser_1._getUser)(sym, userID_).then((u) => {
            userID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getChannelModerators")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "user_id", "first", "after"], [broadcasterID_, userID_, first, after], true)}`, {
            method: urls_1.urls._method("twitch", "getChannelModerators"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getChannelModerators"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getChannelModerators = getChannelModerators;