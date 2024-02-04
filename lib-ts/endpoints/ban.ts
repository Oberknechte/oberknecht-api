import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { banResponse } from "../types/endpoints/ban";
import { _getUser } from "./_getUser";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function ban(
  sym: string,
  broadcasterID: string | undefined,
  targetUserID: string,
  reason?: string,
  duration?: number,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([targetUserID], ["targetUserID"]);

  let targetUserID_ = cleanChannelName(targetUserID);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let moderatorID = userID;
  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  if (checkTwitchUsername(targetUserID_))
    await _getUser(sym, targetUserID_).then((u) => {
      targetUserID_ = u.id;
    });

  return new Promise<banResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "bans")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id"],
        [broadcasterID_, moderatorID],
        true
      )}`,
      {
        method: urls._method("twitch", "bans"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          data: {
            user_id: targetUserID_,
            ...(reason ? { reason: reason.slice(0, 500) } : {}),
            ...(duration ? { duration: duration } : {}),
          },
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "bans"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
