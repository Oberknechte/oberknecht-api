"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._revoketoken = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function _revoketoken(sym, token, clientID) {
    return new Promise(async (resolve, reject) => {
        let token_ = token;
        let clientID_ = clientID;
        let resolved;
        let resolve2 = () => {
            resolved = true;
            resolve(this);
        };
        if (!token)
            return reject(Error("token required"));
        if (!clientID) {
            await (0, _validatetoken_1._validatetoken)(undefined, token)
                .then((tokenData) => {
                clientID_ = tokenData.client_id;
            })
                .catch((e) => {
                try {
                    let em = JSON.parse(e.message);
                    if (em.status === 401)
                        return resolve2();
                }
                catch (e2) { }
                return reject(e);
            });
        }
        if (resolved)
            return;
        (0, oberknecht_request_1.request)(`https://id.twitch.tv/oauth2/revoke`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `client_id=${clientID_}&token=${token_}`,
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "revokeToken"))
                return reject(Error(e.stack ?? r.data));
            return resolve2();
        });
    });
}
exports._revoketoken = _revoketoken;
