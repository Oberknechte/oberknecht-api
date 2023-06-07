"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatSettings = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _getuser_1 = require("../operations/_getuser");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const chatSettings_1 = require("../types/endpoints/chatSettings");
const ignoredIfFalsy = {
    "slow_mode": "slow_mode_wait_time",
    "follower_mode": "follower_mode_duration",
    "non_moderator_chat_delay": "non_moderator_chat_delay_duration"
};
const correctedSettings = {
    "slow_mode_wait_time": {
        "matches": [0, "0"],
        "key": "slow_mode",
        "value": false,
        "skip": true
    }
    // ↑ Sets key slow_mode to false if inputted wait_time is 0 and doesn't append key slow_mode_wait_time on request body
};
async function updateChatSettings(sym, broadcaster_id, settings, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(broadcaster_id ?? undefined) || !(settings ?? undefined))
            return reject(Error(`broadcaster_id and/or settings is undefined`));
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
        let reqbody = {};
        Object.keys(settings).forEach(setting => {
            let settingValue = settings[setting];
            // @ts-ignore
            if (reqbody[setting] || !chatSettings_1.chatSettingsKeys.includes(setting) || (Object.values(ignoredIfFalsy).includes(setting) && (settings[Object.keys(ignoredIfFalsy)[Object.values(ignoredIfFalsy).indexOf(setting)]] === false)))
                return;
            let correctedSetting = correctedSettings[setting];
            if (correctedSetting && correctedSetting.matches.includes(settingValue)) {
                reqbody[correctedSetting.key] = correctedSetting.value;
                if (correctedSetting.skip)
                    return;
            }
            ;
            reqbody[setting] = settingValue;
        });
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updatechatsettings")}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`, { method: urls_1.urls.twitch.updatechatsettings.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "updatechatsettings")))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.updateChatSettings = updateChatSettings;
;
