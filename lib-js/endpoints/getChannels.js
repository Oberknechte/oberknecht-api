"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _getUsers_1 = require("../endpoints/_getUsers");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getChannels(sym, broadcaster_ids, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let broadcaster_ids_ = (0, oberknecht_utils_1.convertToArray)(broadcaster_ids, false);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcaster_logins = broadcaster_ids_.filter((a) => (0, checkTwitchUsername_1.checkTwitchUsername)(a));
    broadcaster_ids_ = broadcaster_ids_.filter((a) => __1.i.regex.numregex().test(a));
    if (broadcaster_logins.length > 0) {
        await (0, _getUsers_1._getUsers)(sym, broadcaster_logins).then((broadcasters) => {
            broadcaster_ids_.push(...Object.keys(broadcasters.ids));
        });
    }
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getChannels")}${(0, oberknecht_utils_1.joinUrlQuery)("broadcaster_id", broadcaster_ids_, true)}`, {
            method: urls_1.urls._method("twitch", "getChannels"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getChannels"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getChannels = getChannels;
