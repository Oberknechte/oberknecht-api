import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName } from "oberknecht-utils";
import { raidResponse } from "../types/endpoints/raid";

export async function raid(
  sym: string,
  from_broadcaster_id: string | undefined,
  to_broadcaster_id: string,
  customtoken?: string
) {
  return new Promise<raidResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (
      !(from_broadcaster_id ?? undefined) ||
      !(to_broadcaster_id ?? undefined)
    )
      return reject(
        Error(`from_broadcaster_id or to_broadcaster_id is undefined`)
      );

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let from_broadcaster_id_ = cleanChannelName(from_broadcaster_id);
    let to_broadcaster_id_ = cleanChannelName(to_broadcaster_id);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          if (!from_broadcaster_id_) from_broadcaster_id_ = a.user_id;
        })
        .catch(reject);
    }

    if (
      !i.regex.numregex().test(from_broadcaster_id_) &&
      i.regex.twitch.usernamereg().test(from_broadcaster_id_)
    ) {
      await _getuser(sym, from_broadcaster_id_)
        .then((u) => {
          from_broadcaster_id_ = u[1];
        })
        .catch(reject);
    }

    if (
      !i.regex.numregex().test(to_broadcaster_id_) &&
      i.regex.twitch.usernamereg().test(to_broadcaster_id_)
    ) {
      await _getuser(sym, to_broadcaster_id_)
        .then((u) => {
          to_broadcaster_id_ = u[1];
        })
        .catch(reject);
    }

    from_broadcaster_id_ =
      from_broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

    request(
      `${urls._url(
        "twitch",
        "raid"
      )}?from_broadcaster_id=${from_broadcaster_id_}&to_broadcaster_id=${to_broadcaster_id_}`,
      {
        method: urls._method("twitch", "raid"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "raid"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
