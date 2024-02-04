"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._refreshRefreshToken = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const _validatetoken_1 = require("./_validatetoken");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function _refreshRefreshToken(sym, refreshToken, clientID, clientSecret) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, refreshToken], ["sym", "refreshToken"]);
    return new Promise((resolve, reject) => {
        let refreshToken_ = refreshToken;
        let clientID_ = clientID ?? __1.i.apiclientData[sym]._options.clientid;
        let clientSecret_ = clientSecret ??
            __1.i.apiclientData[sym]._options.clientSecrets?.[clientID_] ??
            __1.i.apiclientData[sym]._options.clientSecrets;
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeURI(`grant_type=refresh_token&refresh_token=${refreshToken_}&client_id=${clientID_}&client_secret=${clientSecret_}`),
        }, async (e, r) => {
            if (e || r.status !== 200)
                return reject(Error(e.stack ?? r.data));
            let accessToken = r.data.access_token;
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
                let accessTokenDataR = {
                    ...accessTokenData,
                    accessToken: accessToken,
                };
                if ((0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData, [
                    sym,
                    "_options",
                    "noSaveTokens",
                ]))
                    return resolve(accessTokenDataR);
                let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
                if (!tokenSplitter)
                    throw Error("Not saving access tokens - set option noSaveTokens to false to use this");
                tokenSplitter.addKeySync(["refreshToken", refreshToken, "accessTokens", accessToken], {});
                tokenSplitter.addKeySync(["userID", tokenData.userID, "refreshTokens", refreshToken], {});
                tokenSplitter.addKeySync(["userID", tokenData.userID, "accessTokens", accessToken], {});
                tokenSplitter.addKeySync(["accessToken", accessToken], accessTokenData);
                return resolve(accessTokenDataR);
            })
                .catch((e) => reject(Error("Could not validate access token", { cause: e })));
        });
    });
}
exports._refreshRefreshToken = _refreshRefreshToken;
