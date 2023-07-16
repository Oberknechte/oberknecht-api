import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName } from "oberknecht-utils";
import {
  announcementColors,
  announcementColorsType,
} from "../types/endpoints/annoucement";

export async function announce(
  sym: string,
  broadcaster_id: string | undefined,
  message: string,
  color?: announcementColorsType /** @default color "primary" */,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error("sym and customtoken is undefined"));
    if (!(message ?? undefined)) return reject(Error(`message is undefined`));

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

    let reqbody = {
      message: message,
    };

    if ((color ?? undefined) && announcementColors.includes(color))
      reqbody["color"] = color;

    request(
      `${urls._url(
        "twitch",
        "announce"
      )}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`,
      {
        method: urls._method("twitch", "announce"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(reqbody),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "announce"))
          return reject(Error(e ?? r.body));

        return resolve();
      }
    );
  });
}
