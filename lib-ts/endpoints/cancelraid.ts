import request from "request";
import { i } from "..";
import { _getuser } from "../operations/_getuser";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName } from "oberknecht-utils";

export async function cancelraid(sym: string, broadcaster_id?: string | undefined, customtoken?: string) {
    return new Promise<void>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id_ = cleanChannelName(broadcaster_id);

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    if (!broadcaster_id_) broadcaster_id_ = a.user_id;
                })
                .catch();
        };

        if (!i.regex.numregex().test(broadcaster_id_) && i.regex.twitch.usernamereg().test(broadcaster_id_)) {
            await _getuser(sym, broadcaster_id_)
                .then(u => {
                    broadcaster_id_ = u[1];
                })
                .catch();
        };

        broadcaster_id_ = (broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid);

        request(`${urls._url("twitch", "cancelraid")}?broadcaster_id=${broadcaster_id_}`, { method: urls.twitch.cancelraid.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "cancelraid")) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};