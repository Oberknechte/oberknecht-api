import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";
import { channelModeratorsResponse } from "../types/endpoints/getChannelModerators";

export async function getChannelModerators(
  sym: string,
  broadcasterID: string,
  userID?: string,
  first?: string,
  after?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let userID_ = cleanChannelName(userID);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = _userID;

  if (checkTwitchUsername(userID_))
    await _getUser(sym, userID_).then((u) => {
      userID_ = u.id;
    });

  return new Promise<channelModeratorsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getChannelModerators")}${joinUrlQuery(
        ["broadcaster_id", "user_id", "first", "after"],
        [broadcasterID_, userID_, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getChannelModerators"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getChannelModerators"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
