import { validateTokenResponse } from "./validateToken";
export declare type refreshRefreshTokenResponse = validateTokenResponse & {
    refreshToken: string;
    accessToken: string;
};
