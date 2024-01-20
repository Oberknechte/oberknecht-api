import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { regex } from "oberknecht-utils";

export async function _revoketoken(
  sym: string | undefined,
  token: string,
  clientID?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    let token_ = token;
    let clientID_ = clientID;
    let resolved;
    let resolve2 = () => {
      resolved = true;
      resolve(this);
    };

    if (!token) return reject(Error("token required"));
    if (!clientID) {
      await _validatetoken(undefined, token)
        .then((tokenData) => {
          clientID_ = tokenData.client_id;
        })
        .catch((e) => {
          try {
            let em = JSON.parse(e.message);
            if (em.status === 401) return resolve2();
          } catch (e2) {}

          return reject(e);
        });
    }

    if (resolved) return;

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
          return reject(Error(e ?? r.data));

        return resolve2();
      }
    );
  });
}
