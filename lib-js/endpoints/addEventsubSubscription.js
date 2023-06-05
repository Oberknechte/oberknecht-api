"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventsubSubscription = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function addEventsubSubscription(sym, type, version, condition, transport, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || (!(type ?? undefined) || !(condition ?? undefined) || !(transport ?? undefined)))
            return reject(Error(`sym and customtoken or type, condition and transport is undefined`));
        if (!(version ?? undefined))
            version = "1";
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
            })
                .catch();
        }
        ;
        let body = {
            type: type,
            version: version,
            condition: condition,
            transport: transport
        };
        (0, request_1.default)(`${urls_1.urls._url("twitch", "eventsubSubscriptions")}`, { method: urls_1.urls.twitch.eventsubSubscriptions.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || r.statusCode !== urls_1.urls._code("twitch", "eventsubSubscriptions"))
                return reject(Error(e ?? r.body));
            return resolve(JSON.parse(r.body));
        });
    });
}
exports.addEventsubSubscription = addEventsubSubscription;
;
