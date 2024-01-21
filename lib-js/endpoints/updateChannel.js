"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChannel = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
const __1 = require("..");
const oberknecht_utils_1 = require("oberknecht-utils");
const getGames_1 = require("./getGames");
async function updateChannel(sym, channelData, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) && !(customtoken ?? undefined))
            return reject(Error(`sym and customtoken are undefined`));
        if (!(channelData ?? undefined))
            return reject(Error(`channelData is undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id = __1.i.apiclientData[sym]?._options?.userid;
        let channelData_ = (0, oberknecht_utils_1.recreate)(channelData);
        if (customtoken ?? undefined) {
            await (0, _validatetoken_1._validatetoken)(undefined, customtoken)
                .then((a) => {
                broadcaster_id = a.user_id;
                clientid = a.client_id;
            })
                .catch(reject);
        }
        if (channelData.game_id && !__1.i.regex.numregex().test(channelData.game_id)) {
            await (0, getGames_1.getGames)(sym, [], channelData.game_id)
                .then((dat) => {
                if (dat.data?.[0]?.id)
                    channelData_.game_id = dat.data[0]?.id;
            })
                .catch(reject);
        }
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "updateChannel")}?broadcaster_id=${broadcaster_id}`, {
            method: urls_1.urls._method("twitch", "updateChannel"),
            headers: urls_1.urls.twitch._headers(sym, customtoken, clientid),
            body: JSON.stringify(channelData_),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "updateChannel"))
                return reject(Error(e.stack ?? r.data));
            return resolve();
        });
    });
}
exports.updateChannel = updateChannel;
