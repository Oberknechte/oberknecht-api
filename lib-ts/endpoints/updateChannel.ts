import request from "request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { recreate } from "oberknecht-utils";
import { getGames } from "./getGames";
import { channelData } from "../types/endpoints/updateChannel";

export async function updateChannel(sym: string, channelData: channelData, customtoken?: string) {
    return new Promise<void>(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken are undefined`));
        if (!(channelData ?? undefined)) return reject(Error(`channelData is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;
        let broadcaster_id = i.apiclientData[sym]?._options?.userid;
        let channelData_ = recreate(channelData);

        if ((customtoken ?? undefined)) {
            await _validatetoken(sym, customtoken)
                .then(a => {
                    broadcaster_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch();
        };

        if (channelData.game_id && !i.regex.numregex().test(channelData.game_id)) {
            await getGames(sym, [], channelData.game_id)
                .then(dat => {
                    if (dat.data?.[0]?.id) channelData_.game_id = dat.data[0]?.id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "updateChannel")}?broadcaster_id=${broadcaster_id}`, { method: urls.twitch.updateChannel.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(channelData_) }, (e, r) => {
            if (e || (r.statusCode !== urls._code("twitch", "updateChannel"))) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};