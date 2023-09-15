import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { joinUrlQuery, regex } from "oberknecht-utils";
import { _getuser } from "../operations/_getuser";
import { createClipResponse } from "../types/endpoints/createClip";

export async function createClip(
  sym: string,
  broadcasterID: string,
  hasDelay?: boolean,
  customtoken?: string
) {
  return new Promise<createClipResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcasterID_ =
      broadcasterID ?? i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          broadcasterID_ = a.user_id;
        })
        .catch(reject);
    }

    if (!regex.numregex().test(broadcasterID_)) {
      await _getuser(sym, broadcasterID_).then((u) => {
        broadcasterID_ = u[1];
      });
    }

    request(
      `${urls._url("twitch", "createClip")}${joinUrlQuery(
        ["broadcaster_id", "has_delay"],
        [broadcasterID_, hasDelay],
        true
      )}`,
      {
        method: urls._method("twitch", "createClip"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "createClip"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
