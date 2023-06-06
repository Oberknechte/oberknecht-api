"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announce = void 0;
const request_1 = __importDefault(require("request"));
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const oberknecht_utils_1 = require("oberknecht-utils");
const annoucement_1 = require("../types/endpoints/annoucement");
async function announce(sym, broadcaster_id, message, color /** @default color "primary" */, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error("sym and customtoken is undefined"));
        if (!(message ?? undefined))
            return reject(Error(`message is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let moderator_id = __1.i.apiclientData[sym]?._options?.userid;
        let broadcaster_id_ = (0, oberknecht_utils_1.cleanChannelName)(broadcaster_id);
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                moderator_id = a.user_id;
                clientid = a.client_id;
                if (!broadcaster_id_)
                    broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        if (!__1.i.regex.numregex().test(broadcaster_id_) && __1.i.regex.twitch.usernamereg().test(broadcaster_id_)) {
            await (0, _getuser_1._getuser)(sym, broadcaster_id_)
                .then(u => {
                broadcaster_id_ = u[1];
            })
                .catch();
        }
        ;
        broadcaster_id_ = (broadcaster_id_ ?? __1.i.apiclientData[sym]?._options?.userid);
        let reqbody = {
            "message": message
        };
        // @ts-ignore
        if ((color ?? undefined) && annoucement_1.announcementColors.includes(color.toLowerCase()))
            reqbody["color"] = color;
        (0, request_1.default)(`${urls_1.urls._url("twitch", "announcement")}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`, { method: urls_1.urls.twitch.announcement.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "announcement")))
                return reject(Error(e ?? r.body));
            return resolve();
        });
    });
}
exports.announce = announce;
;
