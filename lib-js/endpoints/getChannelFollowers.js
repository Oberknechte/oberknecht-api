"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelFollowers = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getuser_1 = require("../operations/_getuser");
async function getChannelFollowers(sym, broadcaster_id, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(broadcaster_id);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                if (!broadcaster_id_)
                    broadcaster_id_ = a.user_id;
            })
                .catch(reject);
        }
        if (!__1.i.regex.numregex().test(broadcaster_id_) &&
            __1.i.regex.twitch.usernamereg().test(broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, broadcaster_id_)
                .then((u) => {
                broadcaster_id_ = u[1];
            })
                .catch(reject);
        }
        broadcaster_id_ = broadcaster_id_ ?? __1.i.apiclientData[sym]?._options?.userid;
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "channelFollowers")}?broadcaster_id=${broadcaster_id_}${user_id ?? undefined ? `&user_id=${user_id}` : ""}`, {
            method: urls_1.urls._method("twitch", "channelFollowers"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "channelFollowers"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getChannelFollowers = getChannelFollowers;
