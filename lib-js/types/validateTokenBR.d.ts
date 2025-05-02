import { validateTokenResponse } from "./endpoints/validateToken";
export declare type validateTokenBRType = validateTokenResponse & {
    refreshToken?: string;
    accessToken: string;
};
