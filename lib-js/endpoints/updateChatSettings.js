"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatSettings = updateChatSettings;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const oberknecht_utils_1 = require("oberknecht-utils");
const chatSettings_1 = require("../types/endpoints/chatSettings");
const checkTwitchUsername_1 = require("../functions/checkTwitchUsername");
const _getUser_1 = require("./_getUser");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
const ignoredIfFalsy = {
    slow_mode: "slow_mode_wait_time",
    follower_mode: "follower_mode_duration",
    non_moderator_chat_delay: "non_moderator_chat_delay_duration",
};
const correctedSettings = {
    slow_mode_wait_time: {
        matches: [0, "0"],
        key: "slow_mode",
        value: false,
        skip: true,
    },
    // ↑ Sets key slow_mode to false if inputted wait_time is 0 and doesn't append key slow_mode_wait_time on request body
};
async function updateChatSettings(sym, broadcasterID, settings, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([settings], ["settings"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let moderatorID = userID;
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    if ((0, checkTwitchUsername_1.checkTwitchUsername)(broadcasterID_))
        await (0, _getUser_1._getUser)(sym, broadcasterID_).then((u) => {
            broadcasterID_ = u.id;
        });
    let reqbody = {};
    Object.keys(settings).forEach((setting) => {
        let settingValue = settings[setting];
        if (reqbody[setting] ||
            !chatSettings_1.chatSettingsKeys.includes(setting) ||
            (Object.values(ignoredIfFalsy).includes(setting) &&
                settings[Object.keys(ignoredIfFalsy)[Object.values(ignoredIfFalsy).indexOf(setting)]] === false))
            return;
        let correctedSetting = correctedSettings[setting];
        if (correctedSetting && correctedSetting.matches.includes(settingValue)) {
            reqbody[correctedSetting.key] = correctedSetting.value;
            if (correctedSetting.skip)
                return;
        }
        reqbody[setting] = settingValue;
    });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updateChatSettings")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id", "moderator_id"], [broadcasterID_, moderatorID], true)}`, {
            method: urls_1.urls._method("twitch", "updateChatSettings"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify(reqbody),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "updateChatSettings"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve(r.data);
        });
    });
}
