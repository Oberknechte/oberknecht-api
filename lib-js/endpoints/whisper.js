"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisper = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function whisper(sym, to_user_id, message, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(to_user_id ?? undefined) || !(message ?? undefined))
            return reject(Error(`to_user_id and/or message is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let from_user_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let to_user_id_ = (0, oberknecht_utils_1.cleanChannelName)(to_user_id);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                from_user_id_ = a.user_id;
            })
                .catch(reject);
        }
        if (!__1.i.regex.numregex().test(to_user_id_) &&
            __1.i.regex.twitch.usernamereg().test(to_user_id_)) {
            await (0, _getuser_1._getuser)(sym, to_user_id_)
                .then((u) => {
                to_user_id_ = u[1];
            })
                .catch(reject);
        }
        let reqbody = {
            message: message,
        };
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "whisper")}${(0, oberknecht_utils_1.joinUrlQuery)(["from_user_id", "to_user_id"], [from_user_id_, to_user_id_], true)}`, {
            method: urls_1.urls._method("twitch", "whisper"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
            body: JSON.stringify(reqbody),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "whisper"))
                return reject(Error(e.stack ?? r.data));
            return resolve();
        });
    });
}
exports.whisper = whisper;
