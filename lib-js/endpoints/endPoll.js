"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPoll = endPoll;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function endPoll(sym, id, status, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([id, status], ["id", "status"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "endPoll")}`, {
            method: urls_1.urls._method("twitch", "endPoll"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify({
                broadcaster_id: broadcasterID_,
                id: id,
                status: status,
            }),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "endPoll"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
