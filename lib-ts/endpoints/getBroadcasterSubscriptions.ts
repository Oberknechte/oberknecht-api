import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { getBroadcasterSubscriptionsResponse } from "../types/endpoints/getBroadcasterSubscriptions";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getBroadcasterSubscriptions(
  sym: string,
  userID?: string,
  first?: string,
  after?: string,
  before?: string,
  broadcasterID?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let userID_ = cleanChannelName(userID);
  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(userID_))
    await _getUser(sym, userID_).then((u) => {
      userID_ = u.id;
    });

  return new Promise<getBroadcasterSubscriptionsResponse>(
    async (resolve, reject) => {
      request(
        `${urls._url("twitch", "getBroadcasterSubscriptions")}${joinUrlQuery(
          ["broadcaster_id", "user_id", "first", "after", "before"],
          [broadcasterID_, userID_, first, after, before],
          true
        )}`,
        {
          method: urls._method("twitch", "getBroadcasterSubscriptions"),
          headers: urls.twitch._headers(sym, accessToken, clientID),
        },
        (e, r) => {
          if (
            e ||
            r.status !== urls._code("twitch", "getBroadcasterSubscriptions")
          )
            return reject(Error(e.stack ?? r.data));

          return resolve(r.data);
        }
      );
    }
  );
}
