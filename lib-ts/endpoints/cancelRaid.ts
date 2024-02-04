import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { validateTokenWR } from "../functions/validateTokenWR";
import { _getUser } from "./_getUser";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function cancelRaid(
  sym: string,
  broadcasterID?: string | undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "cancelRaid")}${joinUrlQuery(
        ["broadcaster_id"],
        [broadcasterID_],
        true
      )}`,
      {
        method: urls._method("twitch", "cancelRaid"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "cancelRaid"))
          return reject(Error(e.stack ?? r.data));

        return resolve();
      }
    );
  });
}
