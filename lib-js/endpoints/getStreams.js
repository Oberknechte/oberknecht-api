"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreams = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getStreams(sym, filters, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let filters_ = (0, oberknecht_utils_1.recreate)(filters ?? {});
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch(reject);
        }
        let reqqueryparams = "";
        Object.keys(filters_)?.forEach((filter) => {
            reqqueryparams += (0, oberknecht_utils_1.joinUrlQuery)(filter, filters_[filter], reqqueryparams.length === 0 ? true : false);
        });
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getStreams")}${reqqueryparams}`, {
            method: urls_1.urls._method("twitch", "getStreams"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getStreams"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            if (__1.i.apiclientData[sym]?._options?.saveIDs) {
                dat.data.forEach(async (a) => {
                    __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["logins", a.user_login], a.user_id);
                    __1.i.apiclientData[sym].jsonsplitters.users.addKeySync(["ids", a.user_id], a.user_login);
                });
            }
            return resolve(dat);
        });
    });
}
exports.getStreams = getStreams;
