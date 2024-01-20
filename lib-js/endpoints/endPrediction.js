"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPrediction = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
async function endPrediction(sym, id, status, winningOutcomeID, 
/* ↑ Required if status = "RESOLVED" */
customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(id ?? undefined) || !(status ?? undefined))
            return reject(Error("id or status is undefined"));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch(reject);
        }
        let body = {
            broadcaster_id: broadcaster_id_,
            id: id,
            status: status,
            ...(winningOutcomeID ?? undefined
                ? { winning_outcome_id: winningOutcomeID }
                : {}),
        };
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "endPrediction")}`, {
            method: urls_1.urls._method("twitch", "endPrediction"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
            body: JSON.stringify(body),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "endPrediction"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.endPrediction = endPrediction;
