import { request } from "oberknecht-request";
import { i } from "..";
import { _getuser } from "../operations/_getuser";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName } from "oberknecht-utils";

export async function cancelRaid(
  sym: string,
  broadcaster_id?: string | undefined,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id_ = cleanChannelName(broadcaster_id);

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

    broadcaster_id_ = broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

    request(
      `${urls._url("twitch", "cancelRaid")}?broadcaster_id=${broadcaster_id_}`,
      {
        method: urls._method("twitch", "cancelRaid"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "cancelRaid"))
          return reject(Error(e ?? r.body));

        return resolve();
      }
    );
  });
}
