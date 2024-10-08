"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPredictions = getPredictions;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getPredictions(sym, ids, first, after, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getPredictions")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "id", "first", "after"], [broadcasterID_, ids_, first?.toString(), after], true)}`, {
            method: urls_1.urls._method("twitch", "getPredictions"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getPredictions"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
