"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGames = getGames;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getGames(sym, ids, names, igdbIDs, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([ids, names, igdbIDs], ["ids", "names", "igdbIDs"], true);
    let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
    let names_ = (0, oberknecht_utils_1.convertToArray)(names, false);
    let igdbIDs_ = (0, oberknecht_utils_1.convertToArray)(igdbIDs, false);
    names_.push(...ids_.filter((a) => !__1.i.regex.numregex().test(a)));
    ids_ = ids_.filter((a) => __1.i.regex.numregex().test(a));
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getGames")}${(0, oberknecht_utils_1.joinUrlQuery)(["id", "name", "igdb_id"], [ids_, names_.map((a) => encodeURI(a)), igdbIDs_], true)}`, {
            method: urls_1.urls._method("twitch", "getGames"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getGames"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
