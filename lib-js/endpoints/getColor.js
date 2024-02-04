"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getUsers_1 = require("./_getUsers");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function getColor(sym, userID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    let userID_ = (0, oberknecht_utils_1.convertToArray)(userID, false).map((a) => (0, oberknecht_utils_1.cleanChannelName)(a));
    let userLogins_ = userID_.filter((a) => !__1.i.regex.numregex().test(a) && __1.i.regex.twitch.usernamereg().test(a));
    userID_ = userID_.filter((a) => __1.i.regex.numregex().test(a));
    let { clientID, accessToken, userID: _userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    if (userLogins_.length > 0) {
        await (0, _getUsers_1._getUsers)(sym, userLogins_).then((u) => {
            userID_.push(...Object.keys(u.ids));
        });
    }
    if (userID_.length === 0)
        userID_.push(_userID);
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getColor")}${(0, oberknecht_utils_1.joinUrlQuery)("user_id", userID_, true)}`, {
            method: urls_1.urls._method("twitch", "getColor"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getColor"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getColor = getColor;
