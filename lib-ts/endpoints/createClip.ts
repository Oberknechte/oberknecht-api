import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { _getuser } from "../operations/_getuser";
import { createClipResponse } from "../types/endpoints/createClip";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function createClip(
  sym: string,
  broadcasterID?: string,
  hasDelay?: boolean,
  customToken?: string
) {
  return new Promise<createClipResponse>(async (resolve, reject) => {
    checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

    let { clientID, accessToken, userID } = await validateTokenBR(
      sym,
      customToken
    );

    let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

    if (checkTwitchUsername(broadcasterID_)) {
      await _getUser(sym, broadcasterID_).then((u) => {
        broadcasterID_ = u.id;
      });
    }

    request(
      `${urls._url("twitch", "createClip")}${joinUrlQuery(
        ["broadcaster_id", "has_delay"],
        [broadcasterID_, hasDelay.toString()],
        true
      )}`,
      {
        method: urls._method("twitch", "createClip"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "createClip"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
