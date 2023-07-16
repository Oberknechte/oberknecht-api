import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName } from "oberknecht-utils";
import { chatSettingsResponse } from "../types/endpoints/chatSettings";

export async function getChatSettings(
  sym: string,
  broadcaster_id?: string,
  customtoken?: string
) {
  return new Promise<chatSettingsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let moderator_id = i.apiclientData[sym]?._options?.userid;
    let broadcaster_id_ = cleanChannelName(broadcaster_id);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          moderator_id = a.user_id;
          clientid = a.client_id;
          if (!broadcaster_id_) broadcaster_id_ = a.user_id;
        })
        .catch(reject);
    }

    if (
      !i.regex.numregex().test(broadcaster_id_) &&
      i.regex.twitch.usernamereg().test(broadcaster_id_)
    ) {
      await _getuser(sym, broadcaster_id_)
        .then((u) => {
          broadcaster_id_ = u[1];
        })
        .catch(reject);
    }

    broadcaster_id_ = broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

    request(
      `${urls._url(
        "twitch",
        "getChatSettings"
      )}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`,
      {
        method: urls._method("twitch", "getChatSettings"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "getChatSettings"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
