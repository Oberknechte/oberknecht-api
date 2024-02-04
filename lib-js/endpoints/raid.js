"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raid = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function raid(sym, fromBroadcasterID, toBroadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([fromBroadcasterID, toBroadcasterID], ["fromBroadcasterID", "toBroadcasterID"]);
    let toBroadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(toBroadcasterID);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let fromBroadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(fromBroadcasterID) ?? userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(fromBroadcasterID_))
        await (0, _getUser_1._getUser)(sym, fromBroadcasterID_).then((u) => {
            fromBroadcasterID_ = u.id;
        });
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(toBroadcasterID_))
        await (0, _getUser_1._getUser)(sym, toBroadcasterID_).then((u) => {
            toBroadcasterID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "raid")}${(0, oberknecht_utils_1.joinUrlQuery)(["from_broadcaster_id", "to_broadcaster_id"], [fromBroadcasterID_, toBroadcasterID_], true)}`, {
            method: urls_1.urls._method("twitch", "raid"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "raid"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.raid = raid;
