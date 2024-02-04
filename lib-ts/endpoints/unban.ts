import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { _getUser } from "./_getUser";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function unban(
  sym: string,
  broadcasterID: string | undefined,
  userID: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([broadcasterID, userID], ["broadcasterID", "userID"]);

  let userID_ = cleanChannelName(userID);

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  let moderatorID = userID ?? _userID;
  let broadcasterID_ = cleanChannelName(broadcasterID) ?? _userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  if (checkTwitchUsername(userID_))
    await _getUser(sym, userID_).then((u) => {
      userID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "unban")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id", "user_id"],
        [broadcasterID_, moderatorID, userID_],
        true
      )}`,
      {
        method: urls._method("twitch", "unban"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "unban"))
          return reject(Error(e.stack ?? r.data));

        return resolve();
      }
    );
  });
}
