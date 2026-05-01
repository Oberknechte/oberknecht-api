"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisper = whisper;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function whisper(sym, toUserID, message, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([toUserID, message], ["toUserID", "message"]);
    let toUserID_ = (0, oberknecht_utils_1.cleanChannelName)(toUserID);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let fromUserID_ = userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(toUserID_))
        await (0, _getUser_1._getUser)(sym, toUserID_).then((u) => {
            toUserID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "whisper")}${(0, oberknecht_utils_1.joinUrlQuery)(["from_user_id", "to_user_id"], [fromUserID_, toUserID_], true)}`, {
            method: urls_1.urls._method("twitch", "whisper"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify({
                message: message,
            }),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "whisper"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve();
        });
    });
}
