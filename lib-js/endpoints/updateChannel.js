"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChannel = updateChannel;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const getGames_1 = require("./getGames");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function updateChannel(sym, channelData, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([channelData], ["channelData"]);
    let channelData_ = (0, oberknecht_utils_1.recreate)(channelData);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    if (channelData.game_id && !__1.i.regex.numregex().test(channelData.game_id))
        await (0, getGames_1.getGames)(sym, [], channelData.game_id).then((dat) => {
            if (dat.data?.[0]?.id)
                channelData_.game_id = dat.data[0]?.id;
        });
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updateChannel")}${(0, oberknecht_utils_1.joinUrlQuery)(["broadcaster_id"], [broadcasterID_], true)}`, {
            method: urls_1.urls._method("twitch", "updateChannel"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify(channelData_),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "updateChannel"))
                return reject(Error(e?.stack ?? r?.data));
            return resolve();
        });
    });
}
