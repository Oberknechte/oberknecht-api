import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery } from "oberknecht-utils";
import { getModeratedChannelsResponse } from "../types/endpoints/getModeratedChannels";

export async function getModeratedChannels(
  sym: string,
  userID?: string,
  first?: number,
  after?: string,
  customtoken?: string
) {
  return new Promise<getModeratedChannelsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let userID_ = userID ?? i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          userID_ = a.user_id;
        })
        .catch(reject);
    }

    request(
      `${urls._url("twitch", "getModeratedChannels")}${joinUrlQuery(
        ["user_id", "first", "after"],
        [userID_, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getModeratedChannels"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getModeratedChannels"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
