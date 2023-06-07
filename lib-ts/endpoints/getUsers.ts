import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { chunkArray, cleanChannelName, convertToArray, firstCap, isNaM, joinUrlQuery, regex } from "oberknecht-utils";
import { getUsersResolveType } from "../types/endpoints/_getUsers";

export async function getUsers(sym: string, logins?: string | string[], ids?: string | string[], noautofilterids?: Boolean /* Prevent filtering of number entries (ids) in logins */, customtoken?: string) {
    return new Promise<getUsersResolveType>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let logins_ = convertToArray(logins, false).map(a => cleanChannelName(a));
        let ids_ = convertToArray(ids, false).map(a => a?.toLowerCase()).filter(a => regex.numregex().test(String(a)));

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        if (!noautofilterids) {
            let idsinlogins = logins_.filter(a => regex.numregex().test(a));
            if (!(ids ?? undefined) && (idsinlogins.length > 0)) {
                ids_ = [...ids_, ...idsinlogins];
                idsinlogins.forEach(a => logins_.splice(logins_.indexOf(a)));
            };
        };

        let loginsInvalid = logins_.filter(a => !regex.twitch.usernamereg().test(a));
        logins_ = logins_.filter(a => regex.twitch.usernamereg().test(a));

        let chunks = chunkArray([...logins_, ...ids_], (i.apiclientData[sym]._options.use3rdparty?.getUsers ? 50 : 100));
        let ret: getUsersResolveType = {
            logins: {},
            ids: {},
            details: {},
            loginsInvalid: loginsInvalid
        };

        await Promise.all(
            chunks.map((chunk: string[]) => {
                let chunkLogins = chunk.filter(a => logins_.includes(a));
                let chunkIDs = chunk.filter(a => ids_.includes(a));
                return new Promise<void>((resolve2, reject2) => {
                    let url = `${urls._url("twitch", "users")}${joinUrlQuery("login", chunkLogins, true)}${joinUrlQuery("id", chunkIDs, (chunkLogins.length == 0 ? true : false))}`;
                    if (i.apiclientData[sym]._options?.use3rdparty?.getUsers) url = `${urls._url("ivrfitwitch", "users")}${(chunkLogins.length > 0 ? `?login=${chunkLogins}` : "")}${(chunkIDs.length > 0 ? `${(chunkLogins.length > 0 ? "&" : "?")}id=${chunkIDs}` : "")}`

                    request(url, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
                        if (e || (r.statusCode !== 200)) return reject2(Error(e ?? r.body));

                        let dat = JSON.parse(r.body);

                        let d = (i.apiclientData[sym]._options?.use3rdparty?.getUsers ? dat : dat.data);

                        d.forEach(a => {
                            let b = {
                                ...a,
                                _lastUpdated: Date.now(),
                                displayNameParsed: (!isNaM(a.display_name) ? a.display_name : firstCap(a.login))
                            };

                            if (i.apiclientData[sym]?._options?.saveIDs) {
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["logins", a.login], a.id);
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["ids", a.id], a.login);

                                if (!i.apiclientData[sym].jsonsplitters.users.getKeySync(["details"], true)) i.apiclientData[sym].jsonsplitters.users.addKeySync(["details"], {});
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["details", a.id], b);
                            };

                            ret.logins[a.login] = a.id;
                            ret.ids[a.id] = a.login;
                            ret.details[a.id] = b;
                        });

                        return resolve2();
                    });
                });
            })
        )
            .then(() => {
                return resolve(ret);
            });
    });
};