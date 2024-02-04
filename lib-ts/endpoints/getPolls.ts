import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { getPollResponse } from "../types/endpoints/poll";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getPolls(
  sym: string,
  id?: string | string[],
  first?: number,
  after?: string,
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  return new Promise<getPollResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getPolls")}${joinUrlQuery(
        ["broadcaster_id", "id", "first", "after"],
        [broadcasterID_, id, first?.toString(), after],
        true
      )}`,
      {
        method: urls._method("twitch", "getPolls"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getPolls"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
