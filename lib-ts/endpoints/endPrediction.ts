import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  endPredictionResponse,
  endPredictionStatusType,
} from "../types/endpoints/predictions";
import { validateTokenBR } from "../functions/validateTokenBR";
import { cleanChannelName, isNullUndefined } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function endPrediction(
  sym: string,
  id: string,
  status: endPredictionStatusType,
  winningOutcomeID?: string,
  /* ↑ Required if status = "RESOLVED" */
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([id, status], ["id", "status"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  return new Promise<endPredictionResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "endPrediction")}`,
      {
        method: urls._method("twitch", "endPrediction"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          broadcaster_id: broadcasterID_,
          id: id,
          status: status,
          ...(!isNullUndefined(winningOutcomeID)
            ? { winning_outcome_id: winningOutcomeID }
            : {}),
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "endPrediction"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
