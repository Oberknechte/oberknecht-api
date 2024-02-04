import { chatSettingEntry } from "../types/endpoints/chatSettings";
export declare function updateChatSettings(sym: string, broadcasterID: string | undefined, settings: chatSettingEntry, customToken?: string): Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
