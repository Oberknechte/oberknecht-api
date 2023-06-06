export declare const chatSettingsKeys: readonly ["emote_mode", "follower_mode", "follower_mode_duration", "non_moderator_chat_delay", "non_moderator_chat_delay_duration", "slow_mode", "slow_mode_wait_time", "subscriber_mode", "unique_chat_mode"];
export type chatSettingEntry = {
    "broadcaster_id"?: string;
    "slow_mode"?: boolean;
    "slow_mode_wait_time"?: null | number;
    "follower_mode"?: boolean;
    "follower_mode_duration"?: null | number;
    "subscriber_mode"?: boolean;
    "emote_mode"?: boolean;
    "unique_chat_mode"?: boolean;
    "non_moderator_chat_delay"?: boolean;
    "non_moderator_chat_delay_duration"?: null | number;
};
export type chatSettingsResponse = {
    "data": Array<chatSettingEntry>;
};
export type getChatSettingsResponse = chatSettingsResponse;
export type updateChatSettingsResponse = chatSettingsResponse;
