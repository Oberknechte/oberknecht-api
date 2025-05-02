"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConduits = createConduits;
const checkThrowMissingParams_1 = require("../../functions/checkThrowMissingParams");
const urls_1 = require("../../variables/urls");
const oberknecht_request_1 = require("oberknecht-request");
const validateTokenBR_1 = require("../../functions/validateTokenBR");
async function createConduits(sym, shardCount, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([shardCount], ["shardCount"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(urls_1.urls._url("twitch", "conduits", "createConduits"), {
            method: urls_1.urls._method("twitch", "conduits", "createConduits"),
            body: JSON.stringify({
                shard_count: shardCount,
            }),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e ||
                r.status !== urls_1.urls._code("twitch", "conduits", "createConduits"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
