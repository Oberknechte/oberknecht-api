import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName } from "oberknecht-utils";

export async function unvip(
  sym: string,
  broadcaster_id: string | undefined,
  user_id: string,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(broadcaster_id ?? undefined) || !(user_id ?? undefined))
      return reject(Error(`broadcaster_id and/or user_id is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id_ = cleanChannelName(broadcaster_id);
    let user_id_ = cleanChannelName(user_id);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
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

    if (
      !i.regex.numregex().test(user_id_) &&
      i.regex.twitch.usernamereg().test(user_id_)
    ) {
      await _getuser(sym, user_id_)
        .then((u) => {
          user_id_ = u[1];
        })
        .catch(reject);
    }

    broadcaster_id_ = broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

    request(
      `${urls._url(
        "twitch",
        "unvip"
      )}?broadcaster_id=${broadcaster_id_}&user_id=${user_id_}`,
      {
        method: urls._method("twitch", "unvip"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "unvip"))
          return reject(Error(e ?? r.data));

        return resolve();
      }
    );
  });
}
