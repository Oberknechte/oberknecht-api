"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColor = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getUsers_1 = require("./_getUsers");
async function getColor(sym, userID, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let userID_ = (0, oberknecht_utils_1.convertToArray)(userID, false).map((a) => (0, oberknecht_utils_1.cleanChannelName)(a));
        let userLogins_ = userID_.filter((a) => !__1.i.regex.numregex().test(a) && __1.i.regex.twitch.usernamereg().test(a));
        userID_ = userID_.filter((a) => __1.i.regex.numregex().test(a));
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                clientid = a.client_id;
                if (userID_.length === 0)
                    userID_.push(a.user_id);
            })
                .catch();
        }
        else {
            if (userID_.length === 0)
                userID_.push(__1.i.apiclientData[sym]?._options?.userid);
        }
        if (userLogins_.length > 0) {
            await (0, _getUsers_1._getUsers)(sym, userLogins_)
                .then((u) => {
                userID_.push(...Object.keys(u.ids));
            })
                .catch();
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getColor")}${(0, oberknecht_utils_1.joinUrlQuery)("user_id", userID_, true)}`, {
            method: urls_1.urls._method("twitch", "getColor"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getColor"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.getColor = getColor;
