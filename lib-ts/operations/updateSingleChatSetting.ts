import { updateChatSettings } from "../endpoints/updateChatSettings";

export class updateSingleChatSetting {
    static slow = (sym: string, broadcaster_id: string, wait_time: number, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { slow_mode: true, slow_mode_wait_time: wait_time }, customtoken) };
    static slowOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { slow_mode: false }, customtoken) };
    static followers = (sym: string, broadcaster_id: string, duration: number, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { follower_mode: true, follower_mode_duration: duration }, customtoken) };
    static followersOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { follower_mode: false }, customtoken) };
    static subscribers = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { subscriber_mode: true }, customtoken) };
    static subscribersOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { subscriber_mode: false }, customtoken) };
    static emote = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { emote_mode: true }, customtoken) };
    static emoteOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { emote_mode: false }, customtoken) };
    static r9k = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { unique_chat_mode: true }, customtoken) };
    static r9kOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { unique_chat_mode: false }, customtoken) };
    static chatdelay = (sym: string, broadcaster_id: string, duration: number, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { non_moderator_chat_delay: true, non_moderator_chat_delay_duration: duration }, customtoken) };
    static chatdelayOff = (sym: string, broadcaster_id: string, customtoken: string) => { return updateChatSettings(sym, broadcaster_id, { non_moderator_chat_delay: false }, customtoken) };
};