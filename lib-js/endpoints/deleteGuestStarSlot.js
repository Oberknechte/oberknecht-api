"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGuestStarSlot = deleteGuestStarSlot;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
const getGuestStarSession_1 = require("./getGuestStarSession");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
async function deleteGuestStarSlot(sym, guestID, shouldReinvite = false, slotID, sessionID, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([guestID], ["guestID"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    let sessionID_ = sessionID;
    let guestID_ = guestID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(guestID_))
        await (0, _getUser_1._getUser)(sym, guestID_).then((u) => {
            guestID_ = u.id;
        });
    let slotID_ = slotID;
    if (!sessionID_ || !slotID_)
        await (0, getGuestStarSession_1.getGuestStarSession)(sym, broadcasterID_, customToken).then((r) => {
            sessionID_ = r.data[0].id;
            slotID_ = r.data[0].guests.filter((a) => a.user_id.toString() === guestID_.toString())[0].slot_id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "deleteGuestStarSlot")}${(0, oberknecht_utils_1.joinUrlQuery)([
            "broadcaster_id",
            "moderator_id",
            "session_id",
            "guest_id",
            "slot_id",
            "should_reinvite_guest",
        ], [
            broadcasterID_,
            userID,
            sessionID_,
            guestID_,
            slotID_,
            shouldReinvite ? "true" : "false",
        ], true)}`, {
            method: urls_1.urls._method("twitch", "deleteGuestStarSlot"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "deleteGuestStarSlot"))
                return reject(Error(JSON.stringify(e?.stack ?? r?.data ?? e)));
            return resolve();
        });
    });
}
