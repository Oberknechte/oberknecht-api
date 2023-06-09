"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolls = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
async function getPolls(sym, id, first, after, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id = __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcaster_id = a.user_id;
            })
                .catch();
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getPolls")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "id", "first", "after"], [broadcaster_id, id, first, after], true)}`, {
            method: urls_1.urls._method("twitch", "getPolls"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getPolls"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.getPolls = getPolls;
