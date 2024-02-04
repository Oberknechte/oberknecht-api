import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { getModeratedChannelsResponse } from "../types/endpoints/getModeratedChannels";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getModeratedChannels(
  sym: string,
  first?: number,
  after?: string,
  userID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let userID_ = cleanChannelName(userID) ?? _userID;

  return new Promise<getModeratedChannelsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getModeratedChannels")}${joinUrlQuery(
        ["user_id", "first", "after"],
        [userID_, first?.toString(), after],
        true
      )}`,
      {
        method: urls._method("twitch", "getModeratedChannels"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getModeratedChannels"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
