import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName, convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getColorResponse } from "../types/endpoints/color";
import { _getUsers } from "./_getUsers";

export async function getColor(sym: string, userID: string | string[], customtoken?: string) {
    return new Promise<getColorResponse>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let userID_ = convertToArray(userID, false).map(a => cleanChannelName(a));
        let userLogins_ = userID_.filter(a => !i.regex.numregex().test(a) && i.regex.twitch.usernamereg().test(a));
        userID_ = userID_.filter(a => i.regex.numregex().test(a));

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    if (userID_.length === 0) userID_.push(a.user_id);
                })
                .catch();
        } else {
            if (userID_.length === 0) userID_.push(i.apiclientData[sym]?._options?.userid);
        };

        if (userLogins_.length > 0) {
            await _getUsers(sym, userLogins_)
                .then(u => {
                    userID_.push(...Object.keys(u.ids));
                })
                .catch();
        };

        request(`${urls._url("twitch", "getcolor")}${joinUrlQuery("user_id", userID_, true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "getcolor")) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};