"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsubSubscriptions = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function getEventsubSubscriptions(sym, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getEventsubSubscriptions")}`, {
            method: urls_1.urls._method("twitch", "getEventsubSubscriptions"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e ||
                r.status !== urls_1.urls._code("twitch", "getEventsubSubscriptions"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getEventsubSubscriptions = getEventsubSubscriptions;
