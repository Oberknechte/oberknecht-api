"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessTokenForRT = getAccessTokenForRT;
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const _refreshRefreshToken_1 = require("../endpoints/_refreshRefreshToken");
const getValidAccessTokenForRT_1 = require("./getValidAccessTokenForRT");
function getAccessTokenForRT(sym, refreshToken) {
    return new Promise(async (resolve, reject) => {
        let tokenSplitter = (0, oberknecht_utils_1.getKeyFromObject)(__1.i.apiclientData[sym], ["jsonsplitters", "tokenSplitter"], false, true);
        if (!tokenSplitter)
            return reject(Error("Not saving tokens - this option is not usable without the splitter"));
        if (!refreshToken)
            refreshToken = __1.i.apiclientData[sym]._options.refreshToken;
        if (!refreshToken)
            return reject(Error("No refresh token specified"));
        let refreshTokenData = tokenSplitter.getKeySync([
            "refreshToken",
            refreshToken,
        ]);
        if (refreshTokenData) {
            let validAccessToken = (0, getValidAccessTokenForRT_1.getValidAccessTokenForRT)(sym, refreshToken);
            if (validAccessToken)
                return resolve(validAccessToken);
        }
        (0, _refreshRefreshToken_1._refreshRefreshToken)(sym, refreshToken).then(resolve).catch(reject);
    });
}
