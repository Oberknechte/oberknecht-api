import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery } from "oberknecht-utils";
import { getFollowedChannelsResponse } from "../types/endpoints/getFollowedChannels";

export async function getFollowedChannels(
  sym: string,
  userID?: undefined | string,
  broadcasterID?: string,
  first?: string,
  after?: string,
  customtoken?: string
) {
  return new Promise<getFollowedChannelsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    userID = i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          userID = a.user_id;
        })
        .catch(reject);
    };

    request(
      `${urls._url("twitch", "getFollowedChannels")}${joinUrlQuery(
        ["user_id", "broadcaster_id", "first", "after"],
        [userID, broadcasterID, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getFollowedChannels"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "getFollowedChannels"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
