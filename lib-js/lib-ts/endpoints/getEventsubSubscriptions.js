"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsubSubscriptions = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function getEventsubSubscriptions(sym, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
            })
                .catch();
        }
        ;
        (0, request_1.default)(`${urls_1.urls._url("twitch", "getEventsubSubscriptions")}`, { headers: urls_1.urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "getEventsubSubscriptions"))
                return reject(Error(e ?? r.body));
            return resolve(JSON.parse(r.body));
        });
    });
}
exports.getEventsubSubscriptions = getEventsubSubscriptions;
;
