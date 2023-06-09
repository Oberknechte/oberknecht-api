"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vip = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function vip(sym, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(user_id ?? undefined))
            return reject(Error(`user_id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let user_id_ = (0, oberknecht_utils_1.cleanChannelName)(user_id);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        if (!__1.i.regex.numregex().test(user_id_) &&
            __1.i.regex.twitch.usernamereg().test(user_id_)) {
            await (0, _getuser_1._getuser)(sym, user_id_)
                .then((u) => {
                user_id_ = u[1];
            })
                .catch();
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "vip")}?broadcaster_id=${broadcaster_id_}&user_id=${user_id_}`, {
            method: urls_1.urls._method("twitch", "vip"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "vip"))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.vip = vip;
