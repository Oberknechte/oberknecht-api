import { banResponse } from "../types/endpoints/ban";
export declare function ban(sym: string, broadcasterID: string | undefined, targetUserID: string, reason?: string, duration?: number, customToken?: string): Promise<banResponse>;
