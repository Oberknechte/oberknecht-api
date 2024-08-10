"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidAccessTokenForRT = getValidAccessTokenForRT;
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
function getValidAccessTokenForRT(sym, refreshToken) {
    let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
    if (!tokenSplitter)
        return undefined;
    let accessTokens = tokenSplitter.getKeySync(["refreshToken", refreshToken, "accessTokens"]) ??
        {};
    let validAccessTokens = Object.keys(accessTokens)
        .map((a) => [a, tokenSplitter.getKeySync(["accessToken", a])])
        .filter((a) => a[1].expiresAt > Date.now())
        .sort((a, b) => (a[1].scopes ?? []).length - (b[1].scopes ?? []).length);
    let validAccessToken = validAccessTokens[0];
    let r = validAccessToken?.[1];
    if (r)
        r = { ...r, accessToken: validAccessToken[0] };
    return r;
}
