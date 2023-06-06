import { chatSettingEntry } from "../types/endpoints/chatSettings";
export declare function updateChatSettings(sym: string, broadcaster_id: string | undefined, settings: chatSettingEntry, customtoken?: string): Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
