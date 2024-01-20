"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColor = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
async function updateColor(sym, color, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(color ?? undefined))
            return reject(Error(`color is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let userid = __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                userid = a.user_id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updateColor")}?user_id=${userid}&color=${color}`, {
            method: urls_1.urls._method("twitch", "updateColor"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "updateColor"))
                return reject(Error(e ?? r.data));
            return resolve();
        });
    });
}
exports.updateColor = updateColor;
