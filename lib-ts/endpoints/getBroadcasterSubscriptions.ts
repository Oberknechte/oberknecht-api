import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery, convertToArray } from "oberknecht-utils";
import { getBroadcasterSubscriptionsResponse } from "../types/endpoints/getBroadcasterSubscriptions";

export async function getBroadcasterSubscriptions(sym: string, customtoken?: string, user_id?: string, first?: string, after?: string, before?: string) {
    return new Promise<getBroadcasterSubscriptionsResponse>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = i.apiclientData[sym]?._options?.userid;
        let user_id_ = convertToArray(user_id, false);

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    broadcaster_id_ = a.user_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "getBroadcasterSubscriptions")}${joinUrlQuery(["broadcaster_id", "user_id", "first", "after", "before"], [broadcaster_id_, user_id_, first, after, before], true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};