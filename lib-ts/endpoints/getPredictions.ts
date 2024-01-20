import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getPredictionResponse } from "../types/endpoints/predictions";

export async function getPredictions(
  sym: string,
  ids?: string | string[],
  first?: number,
  after?: string,
  customtoken?: string
) {
  return new Promise<getPredictionResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id = i.apiclientData[sym]?._options?.userid;

    let ids_ = convertToArray(ids, false);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          broadcaster_id = a.user_id;
        })
        .catch(reject);
    }

    request(
      `${urls._url("twitch", "getPredictions")}${joinUrlQuery(
        ["broadcaster_id", "id", "first", "after"],
        [broadcaster_id, ids, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getPredictions"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getPredictions"))
          return reject(Error(e ?? r.data));

        
        return resolve(r.data);
      }
    );
  });
}
