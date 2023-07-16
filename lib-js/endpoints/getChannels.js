"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const _getUsers_1 = require("../endpoints/_getUsers");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getChannels(sym, broadcaster_ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_ids_ = (0, oberknecht_utils_1.convertToArray)(broadcaster_ids, false);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                if (broadcaster_ids_.length === 0)
                    broadcaster_ids_.push(a.user_id);
            })
                .catch(reject);
        }
        else {
            if (broadcaster_ids_.length === 0)
                broadcaster_ids_.push(__1.i.apiclientData[sym]?._options?.userid);
        }
        let broadcaster_logins = broadcaster_ids_.filter((a) => !__1.i.regex.numregex().test(a) && __1.i.regex.twitch.usernamereg().test(a));
        broadcaster_ids_ = broadcaster_ids_.filter((a) => __1.i.regex.numregex().test(a));
        if (broadcaster_logins.length > 0) {
            await (0, _getUsers_1._getUsers)(sym, broadcaster_logins)
                .then((broadcasters) => {
                broadcaster_ids_.push(...Object.keys(broadcasters.ids));
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getChannels")}${(0, oberknecht_utils_1.joinUrlQuery)("broadcaster_id", broadcaster_ids_, true)}`, {
            method: urls_1.urls._method("twitch", "getChannels"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getChannels"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.getChannels = getChannels;
