import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { validateTokenWR } from "../functions/validateTokenWR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function _revoketoken(
  sym: string | undefined,
  token: string,
  clientID?: string
) {
  let token_ = token;
  let clientID_ = clientID;

  checkThrowMissingParams([token], ["token"]);

  if (!clientID)
    await validateTokenWR(sym, token, true).then((r) => {
      clientID_ = r.clientID;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `https://id.twitch.tv/oauth2/revoke`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${clientID_}&token=${token_}`,
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "revokeToken"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
