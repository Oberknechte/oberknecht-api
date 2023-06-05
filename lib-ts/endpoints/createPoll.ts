import request from "request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { choices as choices_, createPollResponse } from "../types/endpoints/poll";

export async function createPoll(sym: string, title: string, choices: choices_ /* Min. 2, Max. 5 */, duration: Number /* in Seconds, Min. 15, Max 1800 */, channelPointsVotingEnabled?: boolean, channelPointsPerVote?: boolean, customtoken?: string) {
    return new Promise<createPollResponse>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));
        
        let clientid = i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = i.apiclientData[sym]?._options?.userid;
        
        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    broadcaster_id_ = a.user_id;
                })
                .catch();
        };

        let body = {
            broadcaster_id: broadcaster_id_,
            title: title,
            choices: choices,
            duration: duration,
            ...(channelPointsVotingEnabled ? { channel_points_voting_enabled: channelPointsVotingEnabled } : {}),
            ...(channelPointsPerVote ? { channel_points_per_vote: channelPointsPerVote } : {})
        };

        request(`${urls._url("twitch", "createPoll")}`, { method: urls.twitch.createPoll.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "createPoll"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};