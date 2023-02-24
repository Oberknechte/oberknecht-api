let i = require("../index");

const _validatetoken = require("../endpoints/_validatetoken");
const ban = require("../endpoints/ban");
const deleteMessage = require("../endpoints/deleteMessage");
const getUsers = require("../endpoints/getUsers");
const shoutout = require("../endpoints/shoutout");
const timeout = require("../endpoints/timeout");
const unban = require("../endpoints/unban");
const whisper = require("../endpoints/whisper");
const announce = require("../endpoints/announce");
const updateChatSettings = require("../endpoints/updateChatSettings");

const getChatSettings = require("../endpoints/getChatSettings");
const getStreams = require("../endpoints/getStreams");
const mod = require("../endpoints/mod");
const unmod = require("../endpoints/unmod");
const vip = require("../endpoints/vip");
const unvip = require("../endpoints/unvip");
const updateColor = require("../endpoints/updateColor");
const getColor = require("../endpoints/getColor");
const raid = require("../endpoints/raid");

const chatSettings = require("../arguments/chatSettings");
const oberknechtAPIOptions = require("../arguments/oberknechtAPIOptions");
const updateChatColorColors = require("../arguments/updateChatColorColors");
const getStreamsFilters = require("../arguments/getStreamsFilters");
const cancelraid = require("../endpoints/cancelraid");

class oberknechtAPI {
    #symbol = Symbol();
    get symbol() { return this.#symbol };
    _options = oberknechtAPIOptions;
    verified = false;

    /** @param {oberknechtAPIOptions} options */
    constructor(options) {
        if (!options.token) throw new Error(`token is undefined`);

        this.#symbol = Symbol();
        this._options = options;
        i.apiclientData[this.symbol] = {
            _options: {
                token: options.token
            }
        };
    };

    verify = () => {
        this.verified = true;
        return _validatetoken(this._options.token)
            .then(t => {
                i.apiclientData[this.symbol]._options = {
                    ...i.apiclientData[this.symbol]._options,
                    clientid: t.client_id,
                    userid: t.user_id,
                    username: t.login,
                    token_scopes: t.scopes
                };
            });
    };

    _validatetoken = (customtoken) => { return _validatetoken(this.symbol, customtoken) };
    ban = (broadcaster_id, target_user_id, reason, customtoken) => { return ban(this.symbol, broadcaster_id, target_user_id, reason, customtoken) };
    deleteMessage = (broadcaster_id, message_id, customtoken) => { return deleteMessage(this.symbol, broadcaster_id, message_id, customtoken) };
    clearChat = (broadcaster_id, customtoken) => { return deleteMessage(this.symbol, broadcaster_id, undefined, customtoken) };
    getUsers = (logins, ids, customtoken) => { return getUsers(this.symbol, logins, ids, customtoken) };
    shoutout = (from_broadcaster_id, to_broadcaster_id, customtoken) => { return shoutout(this.symbol, from_broadcaster_id, to_broadcaster_id, customtoken) };
    timeout = (broadcaster_id, target_user_id, duration, reason, customtoken) => { return timeout(this.symbol, broadcaster_id, target_user_id, duration, reason, customtoken) };
    unban = (broadcaster_id, target_user_id, customtoken) => { return unban(this.symbol, broadcaster_id, target_user_id, customtoken) };
    whisper = (from_user_id, to_user_id, message) => { return whisper(this.symbol, from_user_id, to_user_id, message) };

    announce = (broadcaster_id, message, color, customtoken) => { return announce(this.symbol, broadcaster_id, message, color, customtoken) };
    /** @param {chatSettings} settings */
    updateChatSettings = (broadcaster_id, settings, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, settings, customtoken) };

    slow = (broadcaster_id, wait_time, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { slow_mode: true, slow_mode_wait_time: wait_time }, customtoken) };
    slowOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { slow_mode: false }, customtoken) };

    followers = (broadcaster_id, duration, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { follower_mode: true, follower_mode_duration: duration }, customtoken) };
    followersOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { follower_mode: false }, customtoken) };

    subscribers = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { subscriber_mode: true }, customtoken) };
    subscribersOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { subscriber_mode: false }, customtoken) };

    emote = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { emote_mode: true }, customtoken) };
    emoteOnly = this.emote;
    emoteOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { emote_mode: false }, customtoken) };
    emoteOnlyOff = this.emoteOff;

    r9k = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { unique_chat_mode: true }, customtoken) };
    uniqueChat = this.r9k;
    r9kOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { unique_chat_mode: false }, customtoken) };
    uniqueChatOff = this.r9kOff;

    chatdelay = (broadcaster_id, duration, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { non_moderator_chat_delay: true, non_moderator_chat_delay_duration: duration }, customtoken) };
    chatdelayOff = (broadcaster_id, customtoken) => { return updateChatSettings(this.symbol, broadcaster_id, { non_moderator_chat_delay: false }, customtoken) };

    getChatSettings = (broadcaster_id, customtoken) => { return getChatSettings(this.symbol, broadcaster_id, customtoken) };
    /** @param {getStreamsFilters} filters */
    getStreams = (filters, customtoken) => { return getStreams(this.symbol, filters, customtoken) };

    mod = (user_id, customtoken) => { return mod(this.symbol, null, user_id, customtoken) };
    unmod = (user_id, customtoken) => { return unmod(this.symbol, null, user_id, customtoken) };

    vip = (user_id, customtoken) => { return vip(this.symbol, null, user_id, customtoken) };
    unvip = (user_id, customtoken) => { return unvip(this.symbol, null, user_id, customtoken) };

    /** @param {updateChatColorColors} color */
    updateColor = (color, customtoken) => { return updateColor(this.symbol, color, customtoken) };
    getColor = (userids, customtoken) => { return getColor(this.symbol, userids, customtoken) };

    raid = (from_broadcaster_id, to_broadcaster_id) => { return raid(this.symbol, from_broadcaster_id, to_broadcaster_id) };
    cancelraid = (broadcaster_id) => { return cancelraid(this.symbol, broadcaster_id) };
    unraid = this.cancelraid;
};

module.exports = oberknechtAPI;