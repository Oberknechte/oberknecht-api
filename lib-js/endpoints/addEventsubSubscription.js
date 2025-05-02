"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventsubSubscription = addEventsubSubscription;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function addEventsubSubscription(sym, type, version, condition, transport, customToken) {
    return new Promise(async (resolve, reject) => {
        (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
        (0, checkThrowMissingParams_1.checkThrowMissingParams)([type, condition, transport], ["type", "condition", "transport"]);
        if (!(version ?? undefined))
            version = "1";
        (0, validateTokenBR_1.validateTokenBR)(sym, customToken)
            .then((t) => {
            let { clientID, accessToken } = t;
            (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "eventsubSubscriptions")}`, {
                method: urls_1.urls._method("twitch", "eventsubSubscriptions"),
                headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
                body: JSON.stringify({
                    type: type,
                    version: version,
                    condition: condition,
                    transport: transport,
                }),
            }, (e, r) => {
                if (e || r.status !== urls_1.urls._code("twitch", "eventsubSubscriptions"))
                    return reject(Error(e?.stack ?? r?.data));
                return resolve(r.data);
            });
        })
            .catch(reject);
    });
}
