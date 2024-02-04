import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { joinUrlQuery } from "oberknecht-utils";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function deleteEventsubSubscription(
  sym: string,
  id: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([id], ["id"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );
  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "deleteEventsubSubscription")}${joinUrlQuery(
        "id",
        id,
        true
      )}`,
      {
        method: urls._method("twitch", "deleteEventsubSubscription"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (
          e ||
          r.status !== urls._code("twitch", "deleteEventsubSubscription")
        )
          return reject(Error(e.stack ?? r.data));

        return resolve();
      }
    );
  });
}
