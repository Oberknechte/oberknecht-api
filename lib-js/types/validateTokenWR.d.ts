import { validateTokenResponse } from "./endpoints/validateToken";
export type validateTokenWRType = validateTokenResponse & {
    refreshToken?: string;
};
