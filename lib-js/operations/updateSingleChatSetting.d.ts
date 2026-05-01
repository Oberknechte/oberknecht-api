export declare class updateSingleChatSetting {
    static slow: (sym: string, broadcasterID: string | undefined, wait_time: number, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static slowOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static followers: (sym: string, broadcasterID: string | undefined, duration?: number, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static followersOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static subscribers: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static subscribersOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static emote: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static emoteOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static r9k: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static r9kOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static chatdelay: (sym: string, broadcasterID: string | undefined, duration: number, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    static chatdelayOff: (sym: string, broadcasterID: string | undefined, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
}
