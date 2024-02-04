"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._validatetoken = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function _validatetoken(sym, customToken, useOldFormat) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym], ["sym"], true);
    return new Promise((resolve, reject) => {
        let customtoken_ = customToken;
        if (sym && !customToken) {
            customtoken_ = sym;
            sym = undefined;
        }
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `OAuth ${customtoken_ ?? __1.i.apiclientData[sym]?._options?.token}`,
            },
        }, (e, r) => {
            if (e || r.status !== 200)
                return reject(Error(e.stack ?? r.data));
            let tokenData = r.data;
            let accessTokenData = {
                expiresAt: tokenData.expiresAt,
                clientID: tokenData.client_id,
                scopes: tokenData.scopes,
                userID: tokenData.user_id,
                userLogin: tokenData.login,
            };
            let re = {
                ...(useOldFormat === true ? r.data : accessTokenData),
                expiresAt: Date.now() + r.data.expires_in * 1000,
            };
            if ((0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData, [sym, "_options", "noSaveTokens"]))
                return resolve(re);
            return resolve(re);
        });
    });
}
exports._validatetoken = _validatetoken;
