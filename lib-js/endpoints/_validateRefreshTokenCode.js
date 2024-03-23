"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._validateRefreshTokenCode = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const _validatetoken_1 = require("./_validatetoken");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function _validateRefreshTokenCode(sym, code, redirectURL, clientID, clientSecret) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, code, redirectURL], ["sym", "code", "redirectURL"]);
    let clientID_ = clientID ?? __1.i.apiclientData[sym]._options.clientid;
    let clientSecret_ = clientSecret ??
        __1.i.apiclientData[sym]._options.clientSecrets?.[clientID_] ??
        __1.i.apiclientData[sym]._options.clientSecrets;
    return new Promise((resolve, reject) => {
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeURI(`client_id=${clientID_}&client_secret=${clientSecret_}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectURL}`),
        }, async (e, r) => {
            if (e || r.status !== 200)
                return reject(Error(e?.stack ?? r?.data ?? e));
            let refreshToken = r.data.refresh_token;
            let accessToken = r.data.access_token;
            let scopes = r.data.scope;
            let refreshTokenData = {
                expiresAt: Date.now() + r.data.expires_in * 1000,
                clientID: clientID_,
            };
            await (0, _validatetoken_1._validatetoken)(sym, accessToken, false)
                .then((tokenData) => {
                let accessTokenData = {
                    refreshToken: refreshToken,
                    clientID: tokenData.clientID,
                    userLogin: tokenData.userLogin,
                    userID: tokenData.userID,
                    scopes: tokenData.scopes,
                    expiresAt: tokenData.expiresAt,
                };
                let re = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    refreshTokenData: refreshTokenData,
                    accessTokenData: accessTokenData,
                    tokenType: r.data.token_type,
                };
                if ((0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData, [
                    sym,
                    "_options",
                    "noSaveTokens",
                ]))
                    return resolve(re);
                let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
                if (!tokenSplitter)
                    throw Error("Not saving access tokens - set option noSaveTokens to false to use this");
                tokenSplitter.addKeySync(["refreshToken", refreshToken], {
                    ...refreshTokenData,
                    userID: tokenData.userID,
                    scopes: accessTokenData.scopes,
                });
                tokenSplitter.addKeySync(["refreshToken", refreshToken, "accessTokens", accessToken], {});
                tokenSplitter.addKeySync(["userID", tokenData.userID, "refreshTokens", refreshToken], {});
                tokenSplitter.addKeySync(["userID", tokenData.userID, "accessTokens", accessToken], {});
                tokenSplitter.addKeySync(["accessToken", accessToken], accessTokenData);
                if ((0, oberknecht_utils_1.isNullUndefined)(tokenSplitter.getKeySync([
                    "refreshToken",
                    refreshToken,
                    "accessTokenNum",
                ])))
                    tokenSplitter.addKeySync(["refreshToken", refreshToken, "accessTokenNum"], Object.keys(tokenSplitter.getKeySync([
                        "refreshToken",
                        refreshToken,
                        "accessTokens",
                    ])).length);
                else
                    tokenSplitter.editKeyAddSync(["refreshToken", refreshToken, "accessTokenNum"], 1);
                return resolve(re);
            })
                .catch((e) => reject(Error("Could not validate access token", { cause: e })));
        });
    });
}
exports._validateRefreshTokenCode = _validateRefreshTokenCode;
