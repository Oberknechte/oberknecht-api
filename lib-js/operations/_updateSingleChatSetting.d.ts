export declare class _updateSingleChatSetting {
    static slow: (sym: string, broadcaster_id: string, wait_time: number, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static slowOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static followers: (sym: string, broadcaster_id: string, duration: number, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static followersOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static subscribers: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static subscribersOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static emote: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static emoteOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static r9k: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static r9kOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static chatdelay: (sym: string, broadcaster_id: string, duration: number, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static chatdelayOff: (sym: string, broadcaster_id: string, customtoken: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
}
