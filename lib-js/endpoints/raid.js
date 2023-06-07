"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raid = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function raid(sym, from_broadcaster_id, to_broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(from_broadcaster_id ?? undefined) || !(to_broadcaster_id ?? undefined))
            return reject(Error(`from_broadcaster_id or to_broadcaster_id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let from_broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(from_broadcaster_id);
        let to_broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(to_broadcaster_id);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                if (!from_broadcaster_id_)
                    from_broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(from_broadcaster_id_) && __1.i.regex.twitch.usernamereg().test(from_broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, from_broadcaster_id_)
                .then(u => {
                from_broadcaster_id_ = u[1];
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(to_broadcaster_id_) && __1.i.regex.twitch.usernamereg().test(to_broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, to_broadcaster_id_)
                .then(u => {
                to_broadcaster_id_ = u[1];
            })
                .catch();
        }
        ;
        from_broadcaster_id_ = (from_broadcaster_id_ ?? __1.i.apiclientData[sym]?._options?.userid);
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "raid")}?from_broadcaster_id=${from_broadcaster_id_}&to_broadcaster_id=${to_broadcaster_id_}`, { method: urls_1.urls.twitch.raid.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "raid"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.raid = raid;
;
