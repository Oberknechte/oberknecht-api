"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPoll = void 0;
const request_1 = __importDefault(require("request"));
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
async function endPoll(sym, id, status, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?.options?.userid;
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        let body = {
            broadcaster_id: broadcaster_id_,
            id: id,
            status: status
        };
        (0, request_1.default)(`${urls_1.urls._url("twitch", "endPoll")}`, { method: urls_1.urls.twitch.endPoll.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "endPoll")))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.endPoll = endPoll;
;
