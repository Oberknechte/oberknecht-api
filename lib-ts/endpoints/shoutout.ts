import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";

export async function shoutout(
  sym: string,
  from_broadcaster_id: string | undefined,
  to_broadcaster_id: string,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (
      !(from_broadcaster_id ?? undefined) ||
      !(to_broadcaster_id ?? undefined)
    )
      return reject(
        Error(`from_broadcaster_id and/or to_broadcaster_id is undefined`)
      );

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let moderator_id = i.apiclientData[sym]?._options?.userid;
    let from_broadcaster_id_ = cleanChannelName(from_broadcaster_id);
    let to_broadcaster_id_ = cleanChannelName(to_broadcaster_id);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          moderator_id = a.user_id;
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
      `${urls._url("twitch", "shoutout")}${joinUrlQuery(
        ["moderator_id", "from_broadcaster_id", "to_broadcaster_id"],
        [moderator_id, from_broadcaster_id_, to_broadcaster_id_],
        true
      )}`,
      {
        method: urls._method("twitch", "shoutout"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "shoutout"))
          return reject(Error(e ?? r.body));

        return resolve();
      }
    );
  });
}
