"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreams = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getStreams(sym, filters, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let filters_ = (0, oberknecht_utils_1.recreate)((filters ?? {}));
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
            })
                .catch();
        }
        ;
        let reqqueryparams = "";
        Object.keys(filters_)?.forEach(filter => {
            reqqueryparams += (0, oberknecht_utils_1.joinUrlQuery)(filter, filters_[filter], (reqqueryparams.length === 0 ? true : false));
        });
        (0, request_1.default)(`${urls_1.urls._url("twitch", "streams")}${reqqueryparams}`, { headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            if (__1.i.apiclientData[sym]?._options?.saveIDs) {
                dat.data.forEach(async (a) => {
                    await __1.i.apiclientData[sym].jsonsplitters.users.addKey(["logins", a.user_login], a.user_id);
                    await __1.i.apiclientData[sym].jsonsplitters.users.addKey(["ids", a.user_id], a.user_login);
                });
            }
            ;
            return resolve(dat);
        });
    });
}
exports.getStreams = getStreams;
;