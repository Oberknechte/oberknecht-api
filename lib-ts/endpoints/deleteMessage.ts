import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName } from "oberknecht-utils";

export async function deleteMessage(
  sym: string,
  broadcaster_id: string | undefined,
  message_id?: string,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
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
        "deleteMessage"
      )}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}${
        message_id ? `&message_id=${message_id}` : ""
      }`,
      {
        method: urls._method("twitch", "deleteMessage"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "deleteMessage"))
          return reject(Error(e ?? r.data));

        return resolve();
      }
    );
  });
}
