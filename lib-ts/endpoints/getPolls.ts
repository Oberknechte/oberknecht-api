import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery } from "oberknecht-utils";
import { getPollResponse } from "../types/endpoints/poll";

export async function getPolls(
  sym: string,
  id?: string | string[],
  first?: number,
  after?: string,
  customtoken?: string
) {
  return new Promise<getPollResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id = i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          broadcaster_id = a.user_id;
        })
        .catch(reject);
    }

    request(
      `${urls._url("twitch", "getPolls")}${joinUrlQuery(
        ["broadcaster_id", "id", "first", "after"],
        [broadcaster_id, id, first, after],
        true
      )}`,
      {
        method: urls._method("twitch", "getPolls"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getPolls"))
          return reject(Error(e.stack ?? r.data));

        
        return resolve(r.data);
      }
    );
  });
}
