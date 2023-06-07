import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { addEventsubSubscription as addEventsubSubscription_, eventsubSubscriptionVersionType } from "../types/endpoints/eventsub";

export async function addEventsubSubscription(sym: string, type: string, version: eventsubSubscriptionVersionType, condition: any, transport: any, customtoken?: string) {
    return new Promise<addEventsubSubscription_>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || (!(type ?? undefined) || !(condition ?? undefined) || !(transport ?? undefined))) return reject(Error(`sym and customtoken or type, condition and transport is undefined`));
        if (!(version ?? undefined)) version = "1";

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        let body = {
            type: type,
            version: version,
            condition: condition,
            transport: transport
        };

        request(`${urls._url("twitch", "eventsubSubscriptions")}`, { method: urls.twitch.eventsubSubscriptions.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "eventsubSubscriptions")) return reject(Error(e ?? r.body));

            return resolve(JSON.parse(r.body));
        });
    });
};