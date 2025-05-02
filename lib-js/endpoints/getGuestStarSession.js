"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuestStarSession = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
async function getGuestStarSession(sym, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(broadcasterID_))
        await (0, _getUser_1._getUser)(sym, broadcasterID_).then((u) => {
            broadcasterID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getGuestStarSession")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "moderator_id"], [broadcasterID_, userID], true)}`, {
            method: urls_1.urls._method("twitch", "getGuestStarSession"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getGuestStarSession"))
                return reject(Error(JSON.stringify(e?.stack ?? r?.data ?? e)));
            return resolve(r.data);
        });
    });
}
exports.getGuestStarSession = getGuestStarSession;
