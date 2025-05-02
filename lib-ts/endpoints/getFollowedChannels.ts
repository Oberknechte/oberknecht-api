import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { getFollowedChannelsResponse } from "../types/endpoints/getFollowedChannels";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getFollowedChannels(
  sym: string,
  broadcasterID?: string,
  first?: string,
  after?: string,
  userID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let broadcasterID_ = broadcasterID;

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let userID_ = cleanChannelName(userID) ?? _userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  return new Promise<getFollowedChannelsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getFollowedChannels")}${joinUrlQuery(
        ["user_id", "broadcaster_id", "first", "after"],
        [userID_, broadcasterID_, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getFollowedChannels"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getFollowedChannels"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
