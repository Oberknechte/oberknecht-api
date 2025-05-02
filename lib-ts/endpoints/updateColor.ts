import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { colorsType } from "../types/endpoints/color";
import { validateTokenBR } from "../functions/validateTokenBR";
import { joinUrlQuery } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function updateColor(
  sym: string,
  color: colorsType,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([color], ["color"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "updateColor")}${joinUrlQuery(
        ["user_id", "color"],
        [userID, color],
        true
      )}${joinUrlQuery(["userID", "color"], [userID, color])}`,
      {
        method: urls._method("twitch", "updateColor"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "updateColor"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
