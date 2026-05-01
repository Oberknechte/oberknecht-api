"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSingleChatSetting = void 0;
const updateChatSettings_1 = require("../endpoints/updateChatSettings");
class updateSingleChatSetting {
    static slow = (sym, broadcasterID, wait_time, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { slow_mode: true, slow_mode_wait_time: wait_time }, customtoken); };
    static slowOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { slow_mode: false }, customtoken); };
    static followers = (sym, broadcasterID, duration, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { follower_mode: true, follower_mode_duration: duration }, customtoken); };
    static followersOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { follower_mode: false }, customtoken); };
    static subscribers = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { subscriber_mode: true }, customtoken); };
    static subscribersOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { subscriber_mode: false }, customtoken); };
    static emote = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { emote_mode: true }, customtoken); };
    static emoteOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { emote_mode: false }, customtoken); };
    static r9k = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { unique_chat_mode: true }, customtoken); };
    static r9kOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { unique_chat_mode: false }, customtoken); };
    static chatdelay = (sym, broadcasterID, duration, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { non_moderator_chat_delay: true, non_moderator_chat_delay_duration: duration }, customtoken); };
    static chatdelayOff = (sym, broadcasterID, customtoken) => { return (0, updateChatSettings_1.updateChatSettings)(sym, broadcasterID, { non_moderator_chat_delay: false }, customtoken); };
}
exports.updateSingleChatSetting = updateSingleChatSetting;
;
