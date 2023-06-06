"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisper = void 0;
const request_1 = __importDefault(require("request"));
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function whisper(sym, to_user_id, message, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(to_user_id ?? undefined) || !(message ?? undefined))
            return reject(Error(`to_user_id and/or message is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let from_user_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let to_user_id_ = (0, oberknecht_utils_1.cleanChannelName)(to_user_id);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                from_user_id_ = a.user_id;
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(to_user_id_) && __1.i.regex.twitch.usernamereg().test(to_user_id_)) {
            await (0, _getuser_1._getuser)(sym, to_user_id_)
                .then(u => {
                to_user_id_ = u[1];
            })
                .catch();
        }
        ;
        let reqbody = {
            "message": message
        };
        (0, request_1.default)(`${urls_1.urls._url("twitch", "whispers")}${(0, oberknecht_utils_1.joinUrlQuery)(["from_user_id", "to_user_id"], [from_user_id_, to_user_id_], true)}`, { method: urls_1.urls.twitch.whispers.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "whispers")))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.whisper = whisper;
;
