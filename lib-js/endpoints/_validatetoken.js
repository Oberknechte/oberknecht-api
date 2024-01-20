"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._validatetoken = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
async function _validatetoken(sym, customtoken) {
    return new Promise((resolve, reject) => {
        let customtoken_ = customtoken;
        if (!customtoken) {
            customtoken_ = sym;
            sym = undefined;
        }
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `OAuth ${customtoken_ ?? __1.i.apiclientData[sym]?._options?.token}`,
            },
        }, (e, r) => {
            if (e || r.status !== 200)
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports._validatetoken = _validatetoken;
