import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName } from "oberknecht-utils";
import { banResponse } from "../types/endpoints/ban";

export async function ban(
  sym: string,
  broadcaster_id: string | undefined,
  target_user_id: string,
  duration?: string,
  reason?: string,
  customtoken?: string
) {
  return new Promise<banResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error("sym and customtoken is undefined"));
    if (!(target_user_id ?? undefined))
      return reject(Error(`target_user_id is undefined`));

    let broadcaster_id_ = cleanChannelName(broadcaster_id);
    let target_user_id_ = cleanChannelName(target_user_id);
    let moderator_id = i.apiclientData[sym]?._options?.userid;
    let clientid = i.apiclientData[sym]?._options?.clientid;

    if (customtoken ?? undefined) {
      await _validatetoken(sym, customtoken)
        .then((a) => {
          moderator_id = a.user_id;
          clientid = a.client_id;
          if (!broadcaster_id_) broadcaster_id_ = a.user_id;
        })
        .catch();
    }

    if (
      !i.regex.numregex().test(broadcaster_id_) &&
      i.regex.twitch.usernamereg().test(broadcaster_id_)
    ) {
      await _getuser(sym, broadcaster_id_)
        .then((u) => {
          broadcaster_id_ = u[1];
        })
        .catch();
    }

    broadcaster_id_ = broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

    if (!i.regex.numregex().test(target_user_id_)) {
      await _getuser(sym, target_user_id_)
        .then((u) => {
          target_user_id_ = u[1];
        })
        .catch();
    }

    let reqbody: Record<string, any> = {
      data: {
        user_id: target_user_id_,
      },
    };

    if (reason ?? undefined) reqbody.data.reason = reason.substring(0, 500);
    if (duration ?? undefined) reqbody.data.duration = duration;

    request(
      `${urls._url(
        "twitch",
        "bans"
      )}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`,
      {
        method: urls._method("twitch", "bans"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(reqbody),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "bans"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
