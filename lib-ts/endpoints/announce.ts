import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import {
  announcementColors,
  announcementColorsType,
} from "../types/endpoints/annoucement";
import { _getUser } from "./_getUser";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function announce(
  sym: string,
  broadcasterID: string | undefined,
  message: string,
  color?: announcementColorsType /** @default color "primary" */,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([message], ["message"]);

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

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "announce")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id"],
        [broadcasterID_, moderatorID],
        true
      )}`,
      {
        method: urls._method("twitch", "announce"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          message: message,
          ...(color && announcementColors.includes(color)
            ? { color: color }
            : {}),
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "announce"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
