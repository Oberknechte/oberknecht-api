import { request } from "oberknecht-request";
import { i } from "..";
import {
  validateTokenResponse,
  validateTokenResponseOld,
} from "../types/endpoints/validateToken";
import { getKeyFromObject } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function _validatetoken<useOldFormatType extends boolean>(
  sym: string | undefined,
  customToken?: string,
  useOldFormat?: useOldFormatType
) {
  checkThrowMissingParams([sym], ["sym"], true);

  return new Promise<
    useOldFormatType extends true
      ? validateTokenResponseOld
      : validateTokenResponse
  >((resolve, reject) => {
    let customtoken_ = customToken;
    if (sym && !customToken) {
      customtoken_ = sym;
      sym = undefined;
    }

    request(
      `https://id.twitch.tv/oauth2/validate`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `OAuth ${
            customtoken_ ?? i.apiclientData[sym]?._options?.token
          }`,
        },
      },
      (e, r) => {
        if (e || r.status !== 200) return reject(Error(e.stack ?? r.data));

        let tokenData = r.data;
        let accessTokenData = {
          expiresAt: tokenData.expiresAt,
          clientID: tokenData.client_id,
          scopes: tokenData.scopes,
          userID: tokenData.user_id,
          userLogin: tokenData.login,
        };

        let re = {
          ...(useOldFormat === true ? r.data : accessTokenData),
          expiresAt: Date.now() + r.data.expires_in * 1000,
        };

        if (
          getKeyFromObject(i.apiclientData, [sym, "_options", "noSaveTokens"])
        )
          return resolve(re);

        return resolve(re);
      }
    );
  });
}
