import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";

import {
  createPredictionOutcomesType,
  createPredictionResponse,
} from "../types/endpoints/predictions";

export async function createPrediction(
  sym: string,
  title: string,
  outcomes: createPredictionOutcomesType,
  predictionWindow?: number,
  /* ↑ in seconds */
  /** @default predictionWindow 60 */
  customtoken?: string
) {
  return new Promise<createPredictionResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(title ?? undefined) || !(outcomes ?? undefined))
      return reject(Error(`title, outcomes or prediction_window is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id_ = i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          broadcaster_id_ = a.user_id;
        })
        .catch(reject);
    }

    let body = {
      broadcaster_id: broadcaster_id_,
      title: title,
      outcomes: outcomes,
      prediction_window: predictionWindow ?? 60,
    };

    request(
      `${urls._url("twitch", "createPrediction")}`,
      {
        method: urls._method("twitch", "createPrediction"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(body),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "createPrediction"))
          return reject(Error(e.stack ?? r.data));

        
        return resolve(r.data);
      }
    );
  });
}
