"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsubSubscriptions = getEventsubSubscriptions;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getEventsubSubscriptions(sym, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getEventsubSubscriptions")}`, {
            method: urls_1.urls._method("twitch", "getEventsubSubscriptions"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e ||
                r.status !== urls_1.urls._code("twitch", "getEventsubSubscriptions"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
