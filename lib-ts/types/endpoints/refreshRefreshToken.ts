import { validateTokenResponse } from "./validateToken";

export type refreshRefreshTokenResponse = validateTokenResponse & {
  refreshToken: string;
  accessToken: string;
};
