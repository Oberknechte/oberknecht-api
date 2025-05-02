"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenWR = validateTokenWR;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
const _validatetoken_1 = require("../endpoints/_validatetoken");
const _refreshRefreshToken_1 = require("../endpoints/_refreshRefreshToken");
function validateTokenWR(sym, accessToken, noRefresh) {
    let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
    let tokenData = !tokenSplitter
        ? undefined
        : tokenSplitter.getKeySync(["accessToken", accessToken]);
    if (!tokenData)
        return (0, _validatetoken_1._validatetoken)(sym, accessToken, false);
    return new Promise(async (resolve, reject) => {
        if ((tokenData.expiresAt && tokenData.expiresAt > Date.now()) || noRefresh)
            return resolve(tokenData);
        let refreshToken = tokenData.refreshToken;
        if (!refreshToken)
            return reject(Error(JSON.stringify({
                error: "Token expired (no refresh token)",
                tokenData: tokenData,
            })));
        if (noRefresh)
            return reject(Error(JSON.stringify({
                error: "Token expired (not refreshing)",
                tokenData: tokenData,
            })));
        (0, _refreshRefreshToken_1._refreshRefreshToken)(sym, refreshToken).then(resolve).catch(reject);
    });
}
