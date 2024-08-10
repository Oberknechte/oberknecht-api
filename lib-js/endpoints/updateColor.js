"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColor = updateColor;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function updateColor(sym, color, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([color], ["color"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updateColor")}${(0, oberknecht_utils_1.joinUrlQuery)(["user_id", "color"], [userID, color], true)}${(0, oberknecht_utils_1.joinUrlQuery)(["userID", "color"], [userID, color])}`, {
            method: urls_1.urls._method("twitch", "updateColor"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "updateColor"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve();
        });
    });
}
