import { jsonsplitter } from "oberknecht-jsonsplitter";
import { i } from "..";
import { getKeyFromObject } from "oberknecht-utils";
import { _refreshRefreshToken } from "../endpoints/_refreshRefreshToken";
import { getValidAccessTokenForRT } from "./getValidAccessTokenForRT";
import { getAccessTokenForBRType } from "../types/getAccessTokenForBR";

export function getAccessTokenForRT(sym: string, refreshToken?: string) {
  return new Promise<getAccessTokenForBRType>(async (resolve, reject) => {
    let tokenSplitter: jsonsplitter = getKeyFromObject(
      i.apiclientData[sym],
      ["jsonsplitters", "tokenSplitter"],
      false,
      true
    );

    if (!tokenSplitter)
      return reject(
        Error(
          "Not saving tokens - this option is not usable without the splitter"
        )
      );

    if (!refreshToken)
      refreshToken = i.apiclientData[sym]._options.refreshToken;

    if (!refreshToken) return reject(Error("No refresh token specified"));

    let refreshTokenData = tokenSplitter.getKeySync([
      "refreshToken",
      refreshToken,
    ]);

    if (refreshTokenData) {
      let validAccessToken = getValidAccessTokenForRT(sym, refreshToken);
      if (validAccessToken) return resolve(validAccessToken);
    }

    _refreshRefreshToken(sym, refreshToken).then(resolve).catch(reject);
  });
}
