import { request } from "oberknecht-request";
import { urls } from "../variables/urls";

import {
  createPredictionOutcomesType,
  createPredictionResponse,
} from "../types/endpoints/predictions";
import { validateTokenBR } from "../functions/validateTokenBR";
import { cleanChannelName } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function createPrediction(
  sym: string,
  title: string,
  outcomes: createPredictionOutcomesType,
  predictionWindow?: number,
  /* ↑ in seconds */
  /** @default predictionWindow 60 */
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([title, outcomes], ["title", "outcomes"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;
  let predictionWindow_ = predictionWindow ?? 60;

  return new Promise<createPredictionResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "createPrediction")}`,
      {
        method: urls._method("twitch", "createPrediction"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          broadcaster_id: broadcasterID_,
          title: title,
          outcomes: outcomes,
          prediction_window: predictionWindow_,
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "createPrediction"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
