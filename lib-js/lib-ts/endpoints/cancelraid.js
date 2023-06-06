"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelraid = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const _getuser_1 = require("../operations/_getuser");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function cancelraid(sym, broadcaster_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(broadcaster_id);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                if (!broadcaster_id_)
                    broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(broadcaster_id_) && __1.i.regex.twitch.usernamereg().test(broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, broadcaster_id_)
                .then(u => {
                broadcaster_id_ = u[1];
            })
                .catch();
        }
        ;
        broadcaster_id_ = (broadcaster_id_ ?? __1.i.apiclientData[sym]?._options?.userid);
        (0, request_1.default)(`${urls_1.urls._url("twitch", "cancelraid")}?broadcaster_id=${broadcaster_id_}`, { method: urls_1.urls.twitch.cancelraid.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "cancelraid"))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.cancelraid = cancelraid;
;
