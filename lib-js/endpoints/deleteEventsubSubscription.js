"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventsubSubscription = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function deleteEventsubSubscription(sym, id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(id ?? undefined))
            return reject(Error(`id is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch();
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "deleteEventsubSubscription")}${(0, oberknecht_utils_1.joinUrlQuery)("id", id, true)}`, {
            method: urls_1.urls._method("twitch", "deleteEventsubSubscription"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e ||
                r.statusCode !== urls_1.urls._code("twitch", "deleteEventsubSubscription"))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.deleteEventsubSubscription = deleteEventsubSubscription;
