import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { channelFollowersResponse } from "../types/endpoints/getChannelFollowers";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getChannelFollowers(
  sym: string,
  broadcasterID: string,
  userID?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let userID_ = cleanChannelName(userID);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? _userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  if (checkTwitchUsername(userID_))
    await _getUser(sym, userID_).then((u) => {
      userID_ = u.id;
    });

  return new Promise<channelFollowersResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "channelFollowers")}${joinUrlQuery(
        ["broadcaster_id", "user_id"],
        [broadcasterID_, userID_],
        true
      )}`,
      {
        method: urls._method("twitch", "channelFollowers"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "channelFollowers"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
