"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function mod(sym, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(user_id ?? undefined))
            return reject(Error(`user_id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let user_id_ = (0, oberknecht_utils_1.cleanChannelName)(user_id);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                broadcaster_id_ = a.user_id;
                clientid = a.client_id;
            })
                .catch(reject);
        }
        if (!__1.i.regex.numregex().test(user_id_) &&
            __1.i.regex.twitch.usernamereg().test(user_id_)) {
            await (0, _getuser_1._getuser)(sym, user_id_)
                .then((u) => {
                user_id_ = u[1];
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "mod")}?broadcaster_id=${broadcaster_id_}&user_id=${user_id_}`, {
            method: urls_1.urls._method("twitch", "mod"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "mod"))
                return reject(Error(e.stack ?? r.data));
            return resolve();
        });
    });
}
exports.mod = mod;
