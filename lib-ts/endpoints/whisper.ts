import request from "request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";

export async function whisper(sym: string, to_user_id: string, message: string, customtoken?: string) {
    return new Promise<void>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));
        if (!(to_user_id ?? undefined) || !(message ?? undefined)) return reject(Error(`to_user_id and/or message is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let from_user_id_ = i.apiclientData[sym]?._options?.userid;
        let to_user_id_ = cleanChannelName(to_user_id);

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    from_user_id_ = a.user_id;
                })
                .catch();
        };

        if (!i.regex.numregex().test(to_user_id_) && i.regex.twitch.usernamereg().test(to_user_id_)) {
            await _getuser(sym, to_user_id_)
                .then(u => {
                    to_user_id_ = u[1];
                })
                .catch();
        };

        let reqbody = {
            "message": message
        };

        request(`${urls._url("twitch", "whispers")}${joinUrlQuery(["from_user_id", "to_user_id"], [from_user_id_, to_user_id_], true)}`, { method: urls.twitch.whispers.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(reqbody) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "whispers"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};