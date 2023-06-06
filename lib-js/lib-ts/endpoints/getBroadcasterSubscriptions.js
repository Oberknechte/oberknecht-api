"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBroadcasterSubscriptions = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getBroadcasterSubscriptions(sym, customtoken, user_id, first, after, before) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        let user_id_ = (0, oberknecht_utils_1.convertToArray)(user_id, false);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        (0, request_1.default)(`${urls_1.urls._url("twitch", "getBroadcasterSubscriptions")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "user_id", "first", "after", "before"], [broadcaster_id_, user_id_, first, after, before], true)}`, { headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.getBroadcasterSubscriptions = getBroadcasterSubscriptions;
;
