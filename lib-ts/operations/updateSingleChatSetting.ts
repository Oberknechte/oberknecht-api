import { updateChatSettings } from "../endpoints/updateChatSettings";

export class updateSingleChatSetting {
    static slow = (sym: string, broadcasterID: string | undefined, wait_time: number, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { slow_mode: true, slow_mode_wait_time: wait_time }, customtoken) };
    static slowOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { slow_mode: false }, customtoken) };
    static followers = (sym: string, broadcasterID: string | undefined, duration?: number, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { follower_mode: true, follower_mode_duration: duration }, customtoken) };
    static followersOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { follower_mode: false }, customtoken) };
    static subscribers = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { subscriber_mode: true }, customtoken) };
    static subscribersOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { subscriber_mode: false }, customtoken) };
    static emote = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { emote_mode: true }, customtoken) };
    static emoteOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { emote_mode: false }, customtoken) };
    static r9k = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { unique_chat_mode: true }, customtoken) };
    static r9kOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { unique_chat_mode: false }, customtoken) };
    static chatdelay = (sym: string, broadcasterID: string | undefined, duration: number, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { non_moderator_chat_delay: true, non_moderator_chat_delay_duration: duration }, customtoken) };
    static chatdelayOff = (sym: string, broadcasterID: string | undefined, customtoken?: string) => { return updateChatSettings(sym, broadcasterID, { non_moderator_chat_delay: false }, customtoken) };
};