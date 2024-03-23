import { request } from "oberknecht-request";
import { validateRefreshTokenCodeResponse } from "../types/endpoints/validateRefreshTokenCode";
import { i } from "..";
import { jsonsplitter } from "oberknecht-jsonsplitter";
import {
  filterByKeys,
  getKeyFromObject,
  isNullUndefined,
} from "oberknecht-utils";
import { _validatetoken } from "./_validatetoken";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function _validateRefreshTokenCode(
  sym: string | undefined,
  code: string,
  redirectURL: string,
  clientID?: string,
  clientSecret?: string | undefined
) {
  checkThrowMissingParams(
    [sym, code, redirectURL],
    ["sym", "code", "redirectURL"]
  );

  let clientID_ = clientID ?? i.apiclientData[sym]._options.clientid;
  let clientSecret_ =
    clientSecret ??
    i.apiclientData[sym]._options.clientSecrets?.[clientID_] ??
    i.apiclientData[sym]._options.clientSecrets;

  return new Promise<validateRefreshTokenCodeResponse>((resolve, reject) => {
    request(
      `https://id.twitch.tv/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeURI(
          `client_id=${clientID_}&client_secret=${clientSecret_}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectURL}`
        ),
      },
      async (e, r) => {
        if (e || r.status !== 200)
          return reject(Error(e?.stack ?? r?.data ?? e));

        let refreshToken = r.data.refresh_token;
        let accessToken = r.data.access_token;
        let scopes = r.data.scope;

        let refreshTokenData = {
          expiresAt: Date.now() + r.data.expires_in * 1000,
          clientID: clientID_,
          scopes: scopes,
        };

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

            let re: validateRefreshTokenCodeResponse = {
              accessToken: accessToken,
              refreshToken: refreshToken,
              refreshTokenData: refreshTokenData,
              accessTokenData: accessTokenData,
              tokenType: r.data.token_type,
            };

            if (
              getKeyFromObject(i.apiclientData, [
                sym,
                "_options",
                "noSaveTokens",
              ])
            )
              return resolve(re);

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

            tokenSplitter.addKeySync(["refreshToken", refreshToken], {
              ...refreshTokenData,
              userID: tokenData.userID,
            });

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

            return resolve(re);
          })
          .catch((e) =>
            reject(Error("Could not validate access token", { cause: e }))
          );
      }
    );
  });
}
