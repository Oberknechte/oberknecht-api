import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { _getUsers } from "../endpoints/_getUsers";
import { convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getChannelsResponse } from "../types/endpoints/getChannels";

export async function getChannels(sym: string, broadcaster_ids?: string | string[], customtoken?: string) {
    return new Promise<getChannelsResponse>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let broadcaster_ids_ = convertToArray(broadcaster_ids, false);

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    if (broadcaster_ids_.length === 0) broadcaster_ids_.push(a.user_id);
                })
                .catch();
        } else {
            if (broadcaster_ids_.length === 0) broadcaster_ids_.push(i.apiclientData[sym]?._options?.userid);
        };

        let broadcaster_logins = broadcaster_ids_.filter(a => !i.regex.numregex().test(a) && i.regex.twitch.usernamereg().test(a));
        broadcaster_ids_ = broadcaster_ids_.filter(a => i.regex.numregex().test(a));

        if (broadcaster_logins.length > 0) {
            await _getUsers(sym, broadcaster_logins)
                .then(broadcasters => {
                    broadcaster_ids_.push(...Object.keys(broadcasters.ids));
                })
                .catch();
        };

        request(`${urls._url("twitch", "getChannels")}${joinUrlQuery("broadcaster_id", broadcaster_ids_, true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "getChannels"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};