import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { chatSettingsResponse } from "../types/endpoints/chatSettings";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getChatSettings(
  sym: string,
  broadcasterID?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

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

  return new Promise<chatSettingsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getChatSettings")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id"],
        [broadcasterID_, moderatorID],
        true
      )}`,
      {
        method: urls._method("twitch", "getChatSettings"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getChatSettings"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
