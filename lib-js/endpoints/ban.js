"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ban = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function ban(sym, broadcaster_id, target_user_id, duration, reason, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error("sym and customtoken is undefined"));
        if (!(target_user_id ?? undefined))
            return reject(Error(`target_user_id is undefined`));
        let broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(broadcaster_id);
        let target_user_id_ = (0, oberknecht_utils_1.cleanChannelName)(target_user_id);
        let moderator_id = __1.i.apiclientData[sym]?._options?.userid;
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                moderator_id = a.user_id;
                clientid = a.client_id;
                if (!broadcaster_id_)
                    broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        if (!__1.i.regex.numregex().test(broadcaster_id_) &&
            __1.i.regex.twitch.usernamereg().test(broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, broadcaster_id_)
                .then((u) => {
                broadcaster_id_ = u[1];
            })
                .catch();
        }
        broadcaster_id_ = broadcaster_id_ ?? __1.i.apiclientData[sym]?._options?.userid;
        if (!__1.i.regex.numregex().test(target_user_id_)) {
            await (0, _getuser_1._getuser)(sym, target_user_id_)
                .then((u) => {
                target_user_id_ = u[1];
            })
                .catch();
        }
        let reqbody = {
            data: {
                user_id: target_user_id_,
            },
        };
        if (reason ?? undefined)
            reqbody.data.reason = reason.substring(0, 500);
        if (duration ?? undefined)
            reqbody.data.duration = duration;
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "bans")}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`, {
            method: urls_1.urls._method("twitch", "bans"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
            body: JSON.stringify(reqbody),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "bans"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.ban = ban;
