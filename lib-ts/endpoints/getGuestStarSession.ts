import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { validateTokenBR } from "../functions/validateTokenBR";
import {
  cleanChannelName,
  isNullUndefined,
  joinUrlQuery,
} from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";
import { getGuestStarSessionResponse } from "../types/endpoints/getGuestStarSession";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";

export async function getGuestStarSession(
  sym: string,
  broadcasterID?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (!checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  return new Promise<getGuestStarSessionResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getGuestStarSession")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id"],
        [broadcasterID_, userID],
        true
      )}`,
      {
        method: urls._method("twitch", "getGuestStarSession"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getGuestStarSession"))
          return reject(Error(JSON.stringify(e?.stack ?? r?.data ?? e)));

        return resolve(r.data);
      }
    );
  });
}
