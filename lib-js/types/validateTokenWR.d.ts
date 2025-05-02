import { validateTokenResponse } from "./endpoints/validateToken";
export declare type validateTokenWRType = validateTokenResponse & {
    refreshToken?: string;
};
