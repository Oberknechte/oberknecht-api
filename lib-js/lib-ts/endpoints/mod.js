"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const request_1 = __importDefault(require("request"));
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
async function mod(sym, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(user_id ?? undefined))
            return reject(Error(`user_id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let user_id_ = (0, oberknecht_utils_1.cleanChannelName)((0, oberknecht_utils_1.recreate)(user_id));
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                broadcaster_id_ = a.user_id;
                clientid = a.client_id;
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(user_id_) && __1.i.regex.twitch.usernamereg().test(user_id_)) {
            await (0, _getuser_1._getuser)(sym, user_id_)
                .then(u => {
                user_id_ = u[1];
            })
                .catch();
        }
        ;
        (0, request_1.default)(`${urls_1.urls._url("twitch", "mod")}?broadcaster_id=${broadcaster_id_}&user_id=${user_id_}`, { method: urls_1.urls.twitch.mod.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "mod")))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.mod = mod;
;
