"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoutout = void 0;
const request_1 = __importDefault(require("request"));
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function shoutout(sym, from_broadcaster_id, to_broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(from_broadcaster_id ?? undefined) || !(to_broadcaster_id ?? undefined))
            return reject(Error(`from_broadcaster_id and/or to_broadcaster_id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let moderator_id = __1.i.apiclientData[sym]?._options?.userid;
        let from_broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(from_broadcaster_id);
        let to_broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(to_broadcaster_id);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                moderator_id = a.user_id;
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
        (0, request_1.default)(`${urls_1.urls._url("twitch", "shoutouts")}${(0, oberknecht_utils_1.joinUrlQuery)(["moderator_id", "from_broadcaster_id", "to_broadcaster_id"], [moderator_id, from_broadcaster_id_, to_broadcaster_id_], true)}`, { headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), method: urls_1.urls.twitch.shoutouts.method }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "shoutouts")))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.shoutout = shoutout;
;