import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { pollStatusType, endPollResponse } from "../types/endpoints/poll";
import { i } from "..";

export async function endPoll(
  sym: string,
  id: string,
  status: pollStatusType,
  customtoken?: string
) {
  return new Promise<endPollResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(id ?? undefined) || !(status ?? undefined))
      return reject(Error("id or status is undefined"));

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
      id: id,
      status: status,
    };

    request(
      `${urls._url("twitch", "endPoll")}`,
      {
        method: urls._method("twitch", "endPoll"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(body),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "endPoll"))
          return reject(Error(e ?? r.data));

        
        return resolve(r.data);
      }
    );
  });
}
