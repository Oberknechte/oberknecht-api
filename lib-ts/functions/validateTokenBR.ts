import { getKeyFromObject } from "oberknecht-utils";
import { i } from "..";
import { jsonsplitter } from "oberknecht-jsonsplitter";
import { _validatetoken } from "../endpoints/_validatetoken";
import { _refreshRefreshToken } from "../endpoints/_refreshRefreshToken";
import { getAccessTokenForRT } from "./getAccessTokenForRT";
import { getValidAccessTokenForRT } from "./getValidAccessTokenForRT";
import { validateTokenBRType } from "../types/validateTokenBR";
import { validateTokenWRType } from "../types/validateTokenWR";

export function validateTokenBR(sym: string, accessOrRefreshToken?: string) {
  return new Promise<validateTokenBRType>(async (resolve, reject) => {
    let tokenSplitter: jsonsplitter = getKeyFromObject(
      i.apiclientData[sym],
      ["jsonsplitters", "tokenSplitter"],
      false,
      true
    );

    let accessToken;

    if (accessOrRefreshToken) {
      if (tokenSplitter.getKeySync(["refreshToken", accessOrRefreshToken]))
        accessToken = getValidAccessTokenForRT(sym, accessOrRefreshToken)
          ?.accessToken;
      else accessToken = accessOrRefreshToken;
    } else {
      if (i.apiclientData[sym]._options.refreshToken)
        accessToken = (await getAccessTokenForRT(sym))?.accessToken;
      else accessToken = i.apiclientData[sym]._options.token;
    }

    if (!accessToken) return reject(Error("No access token"));

    let tokenData: validateTokenWRType = !tokenSplitter
      ? undefined
      : tokenSplitter.getKeySync(["accessToken", accessToken]);

    if (!tokenData)
      return _validatetoken(sym, accessToken, false)
        .then((r) => {
          resolve({
            accessToken: accessToken,
            ...r,
          });
        })
        .catch((e) => {
          if (!e.message.includes("code 401")) reject(e);
        });

    if (tokenData.expiresAt && tokenData.expiresAt > Date.now())
      return resolve({
        ...tokenData,
        accessToken: accessToken,
      });

    let refreshToken = tokenData.refreshToken;
    if (!refreshToken)
      return reject(
        Error(
          JSON.stringify({
            error: "Token expired (no refresh token)",
            tokenData: tokenData,
          })
        )
      );

    _refreshRefreshToken(sym, refreshToken).then(resolve).catch(reject);
  });
}
