import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getGamesResponse } from "../types/endpoints/getGames";

export async function getGames(sym: string, ids?: string | string[], names?: string | string[], igdbIDs?: string | string[], customtoken?: string) {
    return new Promise<getGamesResponse>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));
        if (!(ids ?? undefined) && !(names ?? undefined) && !(igdbIDs ?? undefined)) return reject(Error(`ids, names and igbdIDs is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let ids_ = convertToArray(ids, false);
        let names_ = convertToArray(names, false);
        let igdbIDs_ = convertToArray(igdbIDs, false);

        names_.push(...ids_.filter(a => !i.regex.numregex().test(a)));
        ids_ = ids_.filter(a => i.regex.numregex().test(a));

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "getGames")}${joinUrlQuery(["id", "name", "igdb_id"], [ids_, names_.map(a => encodeURI(a)), igdbIDs_], true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "getGames"))) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};