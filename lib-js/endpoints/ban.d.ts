import { banResponse } from "../types/endpoints/ban";
export declare function ban(sym: string, broadcaster_id: string | undefined, target_user_id: string, reason?: string, duration?: string, customtoken?: string): Promise<banResponse>;
