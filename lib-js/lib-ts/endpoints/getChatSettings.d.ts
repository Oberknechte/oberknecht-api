import { chatSettingsResponse } from "../types/endpoints/chatSettings";
export declare function getChatSettings(sym: string, broadcaster_id?: string, customtoken?: string): Promise<chatSettingsResponse>;
