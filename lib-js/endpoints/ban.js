"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ban = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getUser_1 = require("./_getUser");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function ban(sym, broadcasterID, targetUserID, reason, duration, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([targetUserID], ["targetUserID"]);
    let targetUserID_ = (0, oberknecht_utils_1.cleanChannelName)(targetUserID);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let moderatorID = userID;
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(broadcasterID_))
        await (0, _getUser_1._getUser)(sym, broadcasterID_).then((u) => {
            broadcasterID_ = u.id;
        });
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(targetUserID_))
        await (0, _getUser_1._getUser)(sym, targetUserID_).then((u) => {
            targetUserID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "bans")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "moderator_id"], [broadcasterID_, moderatorID], true)}`, {
            method: urls_1.urls._method("twitch", "bans"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify({
                data: {
                    user_id: targetUserID_,
                    ...(reason ? { reason: reason.slice(0, 500) } : {}),
                    ...(duration ? { duration: duration } : {}),
                },
            }),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "bans"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.ban = ban;
