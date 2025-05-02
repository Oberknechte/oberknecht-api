import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _getUsers } from "../endpoints/_getUsers";
import { convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getChannelsResponse } from "../types/endpoints/getChannels";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getChannels(
  sym: string,
  broadcaster_ids?: string | string[],
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let broadcaster_ids_ = convertToArray(broadcaster_ids, false);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcaster_logins = broadcaster_ids_.filter((a) =>
    checkTwitchUsername(a)
  );
  broadcaster_ids_ = broadcaster_ids_.filter((a) => i.regex.numregex().test(a));

  if (broadcaster_logins.length > 0) {
    await _getUsers(sym, broadcaster_logins).then((broadcasters) => {
      broadcaster_ids_.push(...Object.keys(broadcasters.ids));
    });
  }

  return new Promise<getChannelsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getChannels")}${joinUrlQuery(
        "broadcaster_id",
        broadcaster_ids_,
        true
      )}`,
      {
        method: urls._method("twitch", "getChannels"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getChannels"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
