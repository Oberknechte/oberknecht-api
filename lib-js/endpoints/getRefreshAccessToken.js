"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshAccessToken = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
async function getRefreshAccessToken(sym, refreshToken) {
    return new Promise(async (resolve, reject) => {
        let refreshTokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "refreshTokenSplitter"], false, true);
        if (!refreshTokenSplitter)
            throw Error("Not saving access tokens - set option autoRefreshRefreshTokens to true to use this");
        let refreshTokenData = refreshTokenSplitter.getKeySync(["refreshToken", refreshToken]);
    });
}
exports.getRefreshAccessToken = getRefreshAccessToken;
