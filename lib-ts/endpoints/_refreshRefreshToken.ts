import { request } from "oberknecht-request";
import { i } from "..";
import { jsonsplitter } from "oberknecht-jsonsplitter";
import { getKeyFromObject, isNullUndefined } from "oberknecht-utils";
import { _validatetoken } from "./_validatetoken";
import { refreshRefreshTokenResponse } from "../types/endpoints/refreshRefreshToken";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function _refreshRefreshToken(
  sym: string | undefined,
  refreshToken: string,
  clientID?: string,
  clientSecret?: string
) {
  checkThrowMissingParams([sym, refreshToken], ["sym", "refreshToken"]);

  return new Promise<refreshRefreshTokenResponse>((resolve, reject) => {
    let refreshToken_ = refreshToken;
    let clientID_ = clientID ?? i.apiclientData[sym]._options.clientid;
    let clientSecret_ =
      clientSecret ??
      i.apiclientData[sym]._options.clientSecrets?.[clientID_] ??
      i.apiclientData[sym]._options.clientSecrets;

    request(
      `https://id.twitch.tv/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeURI(
          `grant_type=refresh_token&refresh_token=${refreshToken_}&client_id=${clientID_}&client_secret=${clientSecret_}`
        ),
      },
      async (e, r) => {
        if (e || r.status !== 200) return reject(Error(e.stack ?? r.data));

        let accessToken = r.data.access_token;

        await _validatetoken(sym, accessToken, false)
          .then((tokenData) => {
            let accessTokenData = {
              refreshToken: refreshToken,
              clientID: tokenData.clientID,
              userLogin: tokenData.userLogin,
              userID: tokenData.userID,
              scopes: tokenData.scopes,
              expiresAt: tokenData.expiresAt,
            };

            let accessTokenDataR = {
              ...accessTokenData,
              accessToken: accessToken,
            };

            if (
              getKeyFromObject(i.apiclientData, [
                sym,
                "_options",
                "noSaveTokens",
              ])
            )
              return resolve(accessTokenDataR);

            let tokenSplitter: jsonsplitter = getKeyFromObject(
              i.apiclientData[sym],
              ["jsonsplitters", "tokenSplitter"],
              false,
              true
            );
            if (!tokenSplitter)
              throw Error(
                "Not saving access tokens - set option noSaveTokens to false to use this"
              );

            tokenSplitter.addKeySync(
              ["refreshToken", refreshToken, "accessTokens", accessToken],
              {}
            );

            tokenSplitter.addKeySync(
              ["userID", tokenData.userID, "refreshTokens", refreshToken],
              {}
            );

            tokenSplitter.addKeySync(
              ["userID", tokenData.userID, "accessTokens", accessToken],
              {}
            );

            tokenSplitter.addKeySync(
              ["accessToken", accessToken],
              accessTokenData
            );

            if (
              isNullUndefined(
                tokenSplitter.getKeySync([
                  "refreshToken",
                  refreshToken,
                  "accessTokenNum",
                ])
              )
            )
              tokenSplitter.addKeySync(
                ["refreshToken", refreshToken, "accessTokenNum"],
                Object.keys(
                  tokenSplitter.getKeySync([
                    "refreshToken",
                    refreshToken,
                    "accessTokens",
                  ])
                ).length
              );
            else
              tokenSplitter.editKeyAddSync(
                ["refreshToken", refreshToken, "accessTokenNum"],
                1
              );

            return resolve(accessTokenDataR);
          })
          .catch((e) =>
            reject(Error("Could not validate access token", { cause: e }))
          );
      }
    );
  });
}
