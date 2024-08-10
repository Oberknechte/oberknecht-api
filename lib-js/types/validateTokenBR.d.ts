import { validateTokenResponse } from "./endpoints/validateToken";
export type validateTokenBRType = validateTokenResponse & {
    refreshToken?: string;
    accessToken: string;
};
