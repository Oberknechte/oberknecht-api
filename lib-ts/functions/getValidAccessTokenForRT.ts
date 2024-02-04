import { jsonsplitter } from "oberknecht-jsonsplitter";
import { i } from "..";
import { getKeyFromObject } from "oberknecht-utils";
import { refreshRefreshTokenResponse } from "../types/endpoints/refreshRefreshToken";

export function getValidAccessTokenForRT(
  sym: string,
  refreshToken: string
): refreshRefreshTokenResponse | undefined {
  let tokenSplitter: jsonsplitter = getKeyFromObject(
    i.apiclientData[sym],
    ["jsonsplitters", "tokenSplitter"],
    false,
    true
  );

  if (!tokenSplitter) return undefined;

  let accessTokens =
    tokenSplitter.getKeySync(["refreshToken", refreshToken, "accessTokens"]) ??
    {};

  let validAccessTokens = Object.keys(accessTokens)
    .map((a) => [a, tokenSplitter.getKeySync(["accessToken", a])])
    .filter((a) => a[1].expiresAt > Date.now())
    .sort((a, b) => (a[1].scopes ?? []).length - (b[1].scopes ?? []).length);

  let validAccessToken = validAccessTokens[0];
  let r = validAccessToken?.[1];
  if (r) r = { ...r, accessToken: validAccessToken[0] };

  return r;
}
