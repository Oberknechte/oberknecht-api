import { getKeyFromObject } from "oberknecht-utils";
import { i } from "..";
import { jsonsplitter } from "oberknecht-jsonsplitter";
import { _validatetoken } from "../endpoints/_validatetoken";
import { _refreshRefreshToken } from "../endpoints/_refreshRefreshToken";
import { validateTokenWRType } from "../types/validateTokenWR";

export function validateTokenWR(
  sym: string,
  accessToken?: string,
  noRefresh?: boolean
) {
  let tokenSplitter: jsonsplitter = getKeyFromObject(
    i.apiclientData[sym],
    ["jsonsplitters", "tokenSplitter"],
    false,
    true
  );
  let tokenData = !tokenSplitter
    ? undefined
    : tokenSplitter.getKeySync(["accessToken", accessToken]);

  if (!tokenData) return _validatetoken(sym, accessToken, false);

  return new Promise<validateTokenWRType>(async (resolve, reject) => {
    if ((tokenData.expiresAt && tokenData.expiresAt > Date.now()) || noRefresh)
      return resolve(tokenData);

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

    if (noRefresh)
      return reject(
        Error(
          JSON.stringify({
            error: "Token expired (not refreshing)",
            tokenData: tokenData,
          })
        )
      );

    _refreshRefreshToken(sym, refreshToken).then(resolve).catch(reject);
  });
}
