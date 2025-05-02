import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  addEventsubSubscription as addEventsubSubscription_,
  eventsubSubscriptionVersionType,
} from "../types/endpoints/eventsub";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function addEventsubSubscription(
  sym: string,
  type: string,
  version: eventsubSubscriptionVersionType,
  condition: any,
  transport: any,
  customToken?: string
) {
  return new Promise<addEventsubSubscription_>(async (resolve, reject) => {
    checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
    checkThrowMissingParams(
      [type, condition, transport],
      ["type", "condition", "transport"]
    );

    if (!(version ?? undefined)) version = "1";

    validateTokenBR(sym, customToken)
      .then((t) => {
        let { clientID, accessToken } = t;

        request(
          `${urls._url("twitch", "eventsubSubscriptions")}`,
          {
            method: urls._method("twitch", "eventsubSubscriptions"),
            headers: urls.twitch._headers(sym, accessToken, clientID),
            body: JSON.stringify({
              type: type,
              version: version,
              condition: condition,
              transport: transport,
            }),
          },
          (e, r) => {
            if (e || r.status !== urls._code("twitch", "eventsubSubscriptions"))
              return reject(Error(e?.stack ?? r?.data));

            return resolve(r.data);
          }
        );
      })
      .catch(reject);
  });
}
