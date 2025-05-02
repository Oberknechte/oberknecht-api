import { checkThrowMissingParams } from "../../functions/checkThrowMissingParams";
import { getConduitsResponse } from "../../types/endpoints/conduits/getConduits";
import { urls } from "../../variables/urls";
import { request } from "oberknecht-request";
import { validateTokenBR } from "../../functions/validateTokenBR";

export async function createConduits(
  sym: string,
  shardCount: number,
  customToken?: string
) {
  checkThrowMissingParams([shardCount], ["shardCount"], true);
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  return new Promise<getConduitsResponse>(async (resolve, reject) => {
    request(
      urls._url("twitch", "conduits", "createConduits"),
      {
        method: urls._method("twitch", "conduits", "createConduits"),
        body: JSON.stringify({
          shard_count: shardCount,
        }),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (
          e ||
          r.status !== urls._code("twitch", "conduits", "createConduits")
        )
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
