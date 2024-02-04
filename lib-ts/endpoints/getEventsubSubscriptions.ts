import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { getEventsubSubscriptionsResponse } from "../types/endpoints/eventsub";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getEventsubSubscriptions(
  sym: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  return new Promise<getEventsubSubscriptionsResponse>(
    async (resolve, reject) => {
      request(
        `${urls._url("twitch", "getEventsubSubscriptions")}`,
        {
          method: urls._method("twitch", "getEventsubSubscriptions"),
          headers: urls.twitch._headers(sym, accessToken, clientID),
        },
        (e, r) => {
          if (
            e ||
            r.status !== urls._code("twitch", "getEventsubSubscriptions")
          )
            return reject(Error(e.stack ?? r.data));

          return resolve(r.data);
        }
      );
    }
  );
}
