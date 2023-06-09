import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import {
  endPredictionResponse,
  endPredictionStatusType,
} from "../types/endpoints/predictions";

export async function endPrediction(
  sym: string,
  id: string,
  status: endPredictionStatusType,
  winningOutcomeID?: string,
  /* ↑ Required if status = "RESOLVED" */
  customtoken?: string
) {
  return new Promise<endPredictionResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(id ?? undefined) || !(status ?? undefined))
      return reject(Error("id or status is undefined"));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id_ = i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(sym, customtoken)
        .then((a) => {
          clientid = a.client_id;
          broadcaster_id_ = a.user_id;
        })
        .catch();
    }

    let body = {
      broadcaster_id: broadcaster_id_,
      id: id,
      status: status,
      ...(winningOutcomeID ?? undefined
        ? { winning_outcome_id: winningOutcomeID }
        : {}),
    };

    request(
      `${urls._url("twitch", "endPrediction")}`,
      {
        method: urls._method("twitch", "endPrediction"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(body),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "endPrediction"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
