"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._revoketoken = _revoketoken;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenWR_1 = require("../functions/validateTokenWR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function _revoketoken(sym, token, clientID) {
    let token_ = token;
    let clientID_ = clientID;
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([token], ["token"]);
    if (!clientID)
        await (0, validateTokenWR_1.validateTokenWR)(sym, token, true).then((r) => {
            clientID_ = r.clientID;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/revoke`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `client_id=${clientID_}&token=${token_}`,
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "revokeToken"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve();
        });
    });
}
