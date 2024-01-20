"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClips = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
const _getuser_1 = require("../operations/_getuser");
async function getClips(sym, broadcaster_id, ids, gameID, startedAt, endedAt, first, before, after, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = broadcaster_id ?? __1.i.apiclientData[sym]?._options?.userid;
        let ids_ = (0, oberknecht_utils_1.convertToArray)(ids, false);
        ids_ = ids_.map((a) => a.replace(/^(https?:\/\/)*(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\/(\w+\/clip\/)*/, ""));
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                clientid = a.client_id;
            })
                .catch(reject);
        }
        if (!oberknecht_utils_1.regex.numregex().test(broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, broadcaster_id_).then((u) => {
                broadcaster_id_ = u[1];
            });
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "getClips")}${(0, oberknecht_utils_1.joinUrlQuery)([
            "broadcaster_id",
            "game_id",
            "started_at",
            "ended_at",
            "first",
            "before",
            "after",
        ], [
            broadcaster_id,
            gameID,
            startedAt,
            endedAt,
            first?.toString(),
            before,
            after,
        ], true, false)}${ids_.length === 0 ? "" : (0, oberknecht_utils_1.joinUrlQuery)("id", ids_, false, false)}`, {
            method: urls_1.urls._method("twitch", "getClips"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "getClips"))
                return reject(Error(e ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.getClips = getClips;
