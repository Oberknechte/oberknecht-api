import { validateRefreshTokenCodeResponse } from "../types/endpoints/validateRefreshTokenCode";
export declare function _validateRefreshTokenCode(sym: string | undefined, code: string, redirectURL: string, clientID?: string, clientSecret?: string | undefined): Promise<validateRefreshTokenCodeResponse>;
