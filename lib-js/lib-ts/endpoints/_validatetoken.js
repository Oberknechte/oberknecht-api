"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._validatetoken = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
async function _validatetoken(sym, customtoken) {
    return new Promise((resolve, reject) => {
        let customtoken_ = customtoken;
        if (!customtoken) {
            customtoken_ = sym;
            sym = undefined;
        }
        ;
        (0, request_1.default)(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `OAuth ${customtoken_ ?? __1.i.apiclientData[sym]?._options?.token}`
            }
        }, (e, r) => {
            if (e || r.statusCode !== 200)
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports._validatetoken = _validatetoken;
;
