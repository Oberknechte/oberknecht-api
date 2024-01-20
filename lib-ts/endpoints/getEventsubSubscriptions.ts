import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { getEventsubSubscriptionsResponse } from "../types/endpoints/eventsub";

export async function getEventsubSubscriptions(
  sym: string,
  customtoken?: string
) {
  return new Promise<getEventsubSubscriptionsResponse>(
    async (resolve, reject) => {
      if (!(sym ?? undefined) && !(customtoken ?? undefined))
        return reject(Error(`sym and customtoken are undefined`));

      let clientid = i.apiclientData[sym]?._options?.clientid;

      if (customtoken ?? undefined) {
        await _validatetoken(undefined, customtoken)
          .then((a) => {
            clientid = a.client_id;
          })
          .catch(reject);
      }

      request(
        `${urls._url("twitch", "getEventsubSubscriptions")}`,
        {
          method: urls._method("twitch", "getEventsubSubscriptions"),
          headers: urls.twitch._headers(sym, customtoken, clientid),
        },
        (e, r) => {
          if (
            e ||
            r.status !== urls._code("twitch", "getEventsubSubscriptions")
          )
            return reject(Error(e ?? r.data));

          return resolve(r.data);
        }
      );
    }
  );
}
