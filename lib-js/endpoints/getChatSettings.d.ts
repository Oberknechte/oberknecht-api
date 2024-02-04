import { chatSettingsResponse } from "../types/endpoints/chatSettings";
export declare function getChatSettings(sym: string, broadcasterID?: string, customToken?: string): Promise<chatSettingsResponse>;
