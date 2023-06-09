"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrediction = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function createPrediction(sym, title, outcomes, predictionWindow, 
/* ↑ in seconds */
/** @default predictionWindow 60 */
customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(title ?? undefined) || !(outcomes ?? undefined))
            return reject(Error(`title, outcomes or prediction_window is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then((a) => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        let body = {
            broadcaster_id: broadcaster_id_,
            title: title,
            outcomes: outcomes,
            prediction_window: predictionWindow ?? 60,
        };
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "createPrediction")}`, {
            method: urls_1.urls._method("twitch", "createPrediction"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
            body: JSON.stringify(body),
        }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "createPrediction"))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.createPrediction = createPrediction;
