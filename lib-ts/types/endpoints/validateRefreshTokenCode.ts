import { scopes, scopesType, validateTokenResponse } from "./validateToken";

export type validateRefreshTokenCodeResponse = {
  accessToken: string;
  refreshToken: string;
  refreshTokenData: refreshTokenData;
  accessTokenData: refreshAccessTokenDataType;
  tokenType: "bearer" | string;
};

type refreshTokenData = {
  expiresAt: number;
  clientID: string;
};

export type refreshAccessTokenDataType = validateTokenResponse & {
  refreshToken: string;
};
