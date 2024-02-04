import { validateTokenResponse, validateTokenResponseOld } from "../types/endpoints/validateToken";
export declare function _validatetoken<useOldFormatType extends boolean>(sym: string | undefined, customToken?: string, useOldFormat?: useOldFormatType): Promise<useOldFormatType extends true ? validateTokenResponseOld : validateTokenResponse>;
