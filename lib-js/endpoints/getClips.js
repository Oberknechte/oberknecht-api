"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClips = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getClips(sym, broadcasterID, ids, gameID, startedAt, endedAt, first, before, after, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
    ids_ = ids_.map((a) => a.replace(/^(https?:\/\/)*(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\/(\w+\/clip\/)*/, ""));
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(broadcasterID_))
        await (0, _getUser_1._getUser)(sym, broadcasterID_).then((u) => {
            broadcasterID_ = u.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getClips")}${(0, oberknecht_utils_1.joinUrlQuery)([
            "broadcaster_id",
            "game_id",
            "started_at",
            "ended_at",
            "first",
            "before",
            "after",
        ], [
            broadcasterID,
            gameID,
            startedAt,
            endedAt,
            first?.toString(),
            before,
            after,
        ], true)}${ids_.length === 0 ? "" : (0, oberknecht_utils_1.joinUrlQuery)("id", ids_, false, false)}`, {
            method: urls_1.urls._method("twitch", "getClips"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getClips"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getClips = getClips;
