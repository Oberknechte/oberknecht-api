import { validateTokenResponse } from "./validateToken";
export declare type validateRefreshTokenCodeResponse = {
    accessToken: string;
    refreshToken: string;
    refreshTokenData: refreshTokenData;
    accessTokenData: refreshAccessTokenDataType;
    tokenType: "bearer" | string;
};
declare type refreshTokenData = {
    expiresAt: number;
    clientID: string;
};
export declare type refreshAccessTokenDataType = validateTokenResponse & {
    refreshToken: string;
};
export {};
