"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreams = getStreams;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getStreams(sym, filters, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let filters_ = (0, oberknecht_utils_1.recreate)(filters ?? {});
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let reqqueryparams = "";
    Object.keys(filters_)?.forEach((filter) => {
        reqqueryparams += (0, oberknecht_utils_1.joinUrlQuery)(filter, filters_[filter], reqqueryparams.length === 0 ? true : false);
    });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getStreams")}${reqqueryparams}`, {
            method: urls_1.urls._method("twitch", "getStreams"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getStreams"))
                return reject(Error(e?.stack ?? r?.data));
            if (__1.i.apiclientData[sym]?._options?.saveIDs) {
                r.data.data.forEach(async (a) => {
                    __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["logins", a.user_login], a.user_id);
                    __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["ids", a.user_id], a.user_login);
                });
            }
            return resolve(r.data);
        });
    });
}
