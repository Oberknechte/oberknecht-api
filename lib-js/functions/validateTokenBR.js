"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenBR = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const _validatetoken_1 = require("../endpoints/_validatetoken");
const _refreshRefreshToken_1 = require("../endpoints/_refreshRefreshToken");
const getAccessTokenForRT_1 = require("./getAccessTokenForRT");
function validateTokenBR(sym, accessOrRefreshToken) {
    return new Promise(async (resolve, reject) => {
        let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
        let accessToken;
        if (accessOrRefreshToken) {
            if (tokenSplitter.getKeySync(["refreshToken", accessOrRefreshToken]))
                accessToken = (await (0, getAccessTokenForRT_1.getAccessTokenForRT)(sym, accessOrRefreshToken))
                    ?.accessToken;
            else
                accessToken = accessOrRefreshToken;
        }
        else {
            if (__1.i.apiclientData[sym]._options.refreshToken)
                accessToken = (await (0, getAccessTokenForRT_1.getAccessTokenForRT)(sym))?.accessToken;
            else
                accessToken = __1.i.apiclientData[sym]._options.token;
        }
        if (!accessToken)
            return reject(Error("No access token"));
        let tokenData = !tokenSplitter
            ? undefined
            : tokenSplitter.getKeySync(["accessToken", accessToken]);
        if (!tokenData)
            return (0, _validatetoken_1._validatetoken)(sym, accessToken, false)
                .then((r) => {
                resolve({
                    accessToken: accessToken,
                    ...r,
                });
            })
                .catch((e) => {
                if (!e.message.includes("code 401"))
                    reject(e);
            });
        if (tokenData.expiresAt && tokenData.expiresAt > Date.now())
            return resolve({
                ...tokenData,
                accessToken: accessToken,
            });
        let refreshToken = tokenData.refreshToken;
        if (!refreshToken)
            return reject(Error(JSON.stringify({
                error: "Token expired (no refresh token)",
                tokenData: tokenData,
            })));
        (0, _refreshRefreshToken_1._refreshRefreshToken)(sym, refreshToken).then(resolve).catch(reject);
    });
}
exports.validateTokenBR = validateTokenBR;
