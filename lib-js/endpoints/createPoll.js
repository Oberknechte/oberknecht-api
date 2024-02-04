"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const urls_1 = require("../variables/urls");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const oberknecht_utils_1 = require("oberknecht-utils");
const checkThrowMissingParams_1 = require("../functions/checkThrowMissingParams");
async function createPoll(sym, title, choices /* Min. 2, Max. 5 */, duration /* in Seconds, Min. 15, Max 1800 */, channelPointsVotingEnabled, channelPointsPerVote, broadcasterID, customToken) {
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([sym, customToken], ["sym", "customToken"], true);
    (0, checkThrowMissingParams_1.checkThrowMissingParams)([title, choices, duration], ["title", "choices", "duration"]);
    let { clientID, accessToken, userID } = await (0, validateTokenBR_1.validateTokenBR)(sym, customToken);
    let broadcasterID_ = (0, oberknecht_utils_1.cleanChannelName)(broadcasterID) ?? userID;
    return new Promise(async (resolve, reject) => {
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "createPoll")}`, {
            method: urls_1.urls._method("twitch", "createPoll"),
            headers: urls_1.urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify({
                broadcaster_id: broadcasterID_,
                title: title,
                choices: choices,
                duration: duration,
                ...(!(0, oberknecht_utils_1.isNullUndefined)(channelPointsVotingEnabled)
                    ? { channel_points_voting_enabled: channelPointsVotingEnabled }
                    : {}),
                ...(!(0, oberknecht_utils_1.isNullUndefined)(channelPointsPerVote)
                    ? { channel_points_per_vote: channelPointsPerVote }
                    : {}),
            }),
        }, (e, r) => {
            if (e || r.status !== urls_1.urls._code("twitch", "createPoll"))
                return reject(Error(e.stack ?? r.data));
            return resolve(r.data);
        });
    });
}
exports.createPoll = createPoll;
