import { checkThrowMissingParams } from "../../functions/checkThrowMissingParams";
import { getConduitsResponse } from "../../types/endpoints/conduits/getConduits";
import { urls } from "../../variables/urls";
import { request } from "oberknecht-request";
import { validateTokenBR } from "../../functions/validateTokenBR";

export async function getConduits(sym: string, customToken?: string) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  console.log(urls._url("twitch", "conduits", "getConduits"), {
    method: urls._method("twitch", "conduits", "getConduits"),
    headers: urls.twitch._headers(sym, accessToken, clientID),
  });

  return new Promise<getConduitsResponse>(async (resolve, reject) => {
    request(
      urls._url("twitch", "conduits", "getConduits"),
      {
        method: urls._method("twitch", "conduits", "getConduits"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "conduits", "getConduits"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
