import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function vip(
  sym: string,
  userID: string,
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([userID], ["userID"]);

  let userID_ = cleanChannelName(userID);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? _userID;

  if (checkTwitchUsername(userID_))
    await _getUser(sym, userID_).then((u) => {
      userID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "vip")}${joinUrlQuery(
        ["broadcaster_id", "user_id"],
        [broadcasterID_, userID_],
        true
      )}`,
      {
        method: urls._method("twitch", "vip"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "vip"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
