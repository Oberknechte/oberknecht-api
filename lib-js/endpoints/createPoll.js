"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = void 0;
const oberknecht_request_1 = require("oberknecht-request");
const __1 = require("..");
const urls_1 = require("../variables/urls");
const _validatetoken_1 = require("./_validatetoken");
async function createPoll(sym, title, choices /* Min. 2, Max. 5 */, duration /* in Seconds, Min. 15, Max 1800 */, channelPointsVotingEnabled, channelPointsPerVote, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)))
            return reject(Error(`sym and customtoken are undefined`));
        let clientid = __1.i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = __1.i.apiclientData[sym]?._options?.userid;
        if ((customtoken ?? undefined)) {
            await (0, _validatetoken_1._validatetoken)(sym, customtoken)
                .then(a => {
                clientid = a.client_id;
                broadcaster_id_ = a.user_id;
            })
                .catch();
        }
        ;
        let body = {
            broadcaster_id: broadcaster_id_,
            title: title,
            choices: choices,
            duration: duration,
            ...(channelPointsVotingEnabled ? { channel_points_voting_enabled: channelPointsVotingEnabled } : {}),
            ...(channelPointsPerVote ? { channel_points_per_vote: channelPointsPerVote } : {})
        };
        (0, oberknecht_request_1.request)(`${urls_1.urls._url("twitch", "createPoll")}`, { method: urls_1.urls.twitch.createPoll.method, headers: urls_1.urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || (r.statusCode !== urls_1.urls._code("twitch", "createPoll")))
                return reject(Error(e ?? r.body));
            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
}
exports.createPoll = createPoll;
;
