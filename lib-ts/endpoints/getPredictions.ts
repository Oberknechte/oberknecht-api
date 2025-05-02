import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  cleanChannelName,
  convertToArray,
  joinUrlQuery,
} from "oberknecht-utils";
import { getPredictionResponse } from "../types/endpoints/predictions";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getPredictions(
  sym: string,
  ids?: string | string[],
  first?: number,
  after?: string,
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let ids_ = convertToArray(ids, false);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  return new Promise<getPredictionResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getPredictions")}${joinUrlQuery(
        ["broadcaster_id", "id", "first", "after"],
        [broadcasterID_, ids_, first?.toString(), after],
        true
      )}`,
      {
        method: urls._method("twitch", "getPredictions"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getPredictions"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
