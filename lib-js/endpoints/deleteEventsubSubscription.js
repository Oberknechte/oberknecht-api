"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventsubSubscription = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function deleteEventsubSubscription(sym, id, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([id], ["id"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "deleteEventsubSubscription")}${(0, oberknecht_utils_1.joinUrlQuery)("id", id, true)}`, {
            method: urls_1.urls._method("twitch", "deleteEventsubSubscription"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e ||
                r.status !== urls_1.urls._code("twitch", "deleteEventsubSubscription"))
                return reject(Error(e.stack ?? r.data));
            return resolve();
        });
    });
}
exports.deleteEventsubSubscription = deleteEventsubSubscription;
