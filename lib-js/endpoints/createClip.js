"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClip = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getuser_1 = require("../operations/_getuser");
async function createClip(sym, broadcasterID, hasDelay, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcasterID_ = broadcasterID ?? __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcasterID_ = a.user_id;
            })
                .catch(reject);
        }
        if (!oberknecht_utils_1.regex.numregex().test(broadcasterID_)) {
            await (0, _getuser_1._getuser)(sym, broadcasterID_).then((u) => {
                broadcasterID_ = u[1];
            });
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "createClip")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "has_delay"], [broadcasterID_, hasDelay], true)}`, {
            method: urls_1.urls._method("twitch", "createClip"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "createClip"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.createClip = createClip;
