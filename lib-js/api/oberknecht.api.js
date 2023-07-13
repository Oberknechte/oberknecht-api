"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtAPI = void 0;
const index_1 = require("../index");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const jsonsplitter_1 = require("@jubewe/jsonsplitter");
const isdebug_1 = require("../functions/isdebug");
const _log_1 = require("../functions/_log");
const _stackname_1 = require("../functions/_stackname");
const _validatetoken_1 = require("../endpoints/_validatetoken");
const ban_1 = require("../endpoints/ban");
const deleteMessage_1 = require("../endpoints/deleteMessage");
const getUsers_1 = require("../endpoints/getUsers");
const _getUsers_1 = require("../endpoints/_getUsers");
const shoutout_1 = require("../endpoints/shoutout");
const ban_2 = require("../endpoints/ban");
const unban_1 = require("../endpoints/unban");
const whisper_1 = require("../endpoints/whisper");
const announce_1 = require("../endpoints/announce");
const getChatSettings_1 = require("../endpoints/getChatSettings");
const updateChatSettings_1 = require("../endpoints/updateChatSettings");
const updateSingleChatSetting_1 = require("../operations/updateSingleChatSetting");
const getStreams_1 = require("../endpoints/getStreams");
const mod_1 = require("../endpoints/mod");
const unmod_1 = require("../endpoints/unmod");
const vip_1 = require("../endpoints/vip");
const unvip_1 = require("../endpoints/unvip");
const updateColor_1 = require("../endpoints/updateColor");
const getColor_1 = require("../endpoints/getColor");
const raid_1 = require("../endpoints/raid");
const getChannelFollowers_1 = require("../endpoints/getChannelFollowers");
const cancelraid_1 = require("../endpoints/cancelraid");
const _getuser_1 = require("../operations/_getuser");
const addEventsubSubscription_1 = require("../endpoints/addEventsubSubscription");
const getEventsubSubscriptions_1 = require("../endpoints/getEventsubSubscriptions");
const deleteEventsubSubscription_1 = require("../endpoints/deleteEventsubSubscription");
const getBroadcasterSubscriptions_1 = require("../endpoints/getBroadcasterSubscriptions");
const getChannels_1 = require("../endpoints/getChannels");
const updateChannel_1 = require("../endpoints/updateChannel");
const getPolls_1 = require("../endpoints/getPolls");
const createPoll_1 = require("../endpoints/createPoll");
const endPoll_1 = require("../endpoints/endPoll");
const getGames_1 = require("../endpoints/getGames");
const createPrediction_1 = require("../endpoints/createPrediction");
const endPrediction_1 = require("../endpoints/endPrediction");
const getPredictions_1 = require("../endpoints/getPredictions");
let clientSymNum = 0;
class oberknechtAPI {
    #symbol = `oberknechtAPI-${clientSymNum++}`;
    get symbol() {
        return this.#symbol;
    }
    get options() {
        return index_1.i.apiclientData[this.symbol]?._options;
    }
    static get options() {
        return this.options;
    }
    static get symbol() {
        return this.symbol;
    }
    verified = false;
    userssplitter;
    userssplitterpromise;
    _options;
    constructor(options) {
        let _options = options ?? {};
        if (_options.skipCreation)
            return;
        // if (!options?.token) throw Error(`token is undefined`);
        let data = (index_1.i.apiclientData[this.symbol] = {});
        _options.startPath = path_1.default.resolve(process.cwd(), _options.startPath ?? "./");
        _options.saveIDsPath = path_1.default.resolve(_options.startPath, _options.saveIDsPath ?? "./data/oberknecht-api/userids");
        _options.debug = _options.debug ?? 1;
        this._options = data._options = _options;
        if (_options.saveIDs) {
            if (!data.jsonsplitters)
                data.jsonsplitters = {};
            let userssplitter = (data.jsonsplitters.users = this.userssplitter = new jsonsplitter_1.jsonsplitter({
                debug: _options.debug,
                startpath: _options.saveIDsPath,
                max_keys_in_file: 2000,
            }));
            if (!fs_1.default.existsSync(_options.saveIDsPath) ||
                Object.keys(userssplitter._mainpaths).length === 0) {
                this.userssplitterpromise = userssplitter.createSync({
                    logins: {},
                    ids: {},
                    details: {},
                });
            }
        }
        if ((0, isdebug_1.isdebug)(this.symbol, 2))
            (0, _log_1._log)(1, `${(0, _stackname_1._stackname)("Oberknecht-API")[3]} Initialized \n\t> Startpath: ${_options.startPath}`);
    }
    async verify() {
        return new Promise(async (resolve, reject) => {
            if (this.userssplitterpromise)
                await this.userssplitterpromise;
            if (this._options.token)
                await (0, _validatetoken_1._validatetoken)(this._options.token)
                    .then((t) => {
                    this.verified = true;
                    index_1.i.apiclientData[this.symbol]._options = {
                        ...index_1.i.apiclientData[this.symbol]._options,
                        clientid: t.client_id,
                        userid: t.user_id,
                        login: t.login,
                        token_scopes: t.scopes,
                    };
                    if ((0, isdebug_1.isdebug)(this.symbol, 2))
                        (0, _log_1._log)(1, `${(0, _stackname_1._stackname)("Oberknecht-API")[3]} Logged in as ${t.login} (${t.user_id})`);
                })
                    .catch((e) => {
                    return reject(e);
                });
            resolve();
        });
    }
    async destroy() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.userssplitter.destroy();
            }
            catch (e) { }
            delete index_1.i.apiclientData[this.symbol];
            return resolve();
        });
    }
    _validatetoken = (customtoken) => {
        return (0, _validatetoken_1._validatetoken)(this.symbol, customtoken);
    };
    _getUsers = (logins, ids, noautofilterids, customtoken) => {
        return (0, _getUsers_1._getUsers)(this.symbol, logins, ids, noautofilterids, customtoken);
    };
    _getUser = (user) => {
        return (0, _getuser_1._getuser)(this.symbol, user);
    };
    ban = (broadcaster_id, target_user_id, reason, customtoken) => {
        return (0, ban_1.ban)(this.symbol, broadcaster_id, target_user_id, reason, undefined, customtoken);
    };
    deleteMessage = (broadcaster_id, message_id, customtoken) => {
        return (0, deleteMessage_1.deleteMessage)(this.symbol, broadcaster_id, message_id, customtoken);
    };
    delete = this.deleteMessage;
    clearChat = (broadcaster_id, customtoken) => {
        return (0, deleteMessage_1.deleteMessage)(this.symbol, broadcaster_id, undefined, customtoken);
    };
    getUsers = (logins, ids, noautofilterids, customtoken) => {
        return (0, getUsers_1.getUsers)(this.symbol, logins, ids, noautofilterids, customtoken);
    };
    shoutout = (from_broadcaster_id, to_broadcaster_id, customtoken) => {
        return (0, shoutout_1.shoutout)(this.symbol, from_broadcaster_id, to_broadcaster_id, customtoken);
    };
    timeout = (broadcaster_id, target_user_id, duration, reason, customtoken) => {
        return (0, ban_2.ban)(this.symbol, broadcaster_id, target_user_id, reason, duration, customtoken);
    };
    unban = (broadcaster_id, target_user_id, customtoken) => {
        return (0, unban_1.unban)(this.symbol, broadcaster_id, target_user_id, customtoken);
    };
    untimeout = this.unban;
    whisper = (to_user_id, message, customtoken) => {
        return (0, whisper_1.whisper)(this.symbol, to_user_id, message, customtoken);
    };
    announce = (broadcaster_id, message, color, customtoken) => {
        return (0, announce_1.announce)(this.symbol, broadcaster_id, message, color, customtoken);
    };
    updateChatSettings = (broadcaster_id, settings, customtoken) => {
        return (0, updateChatSettings_1.updateChatSettings)(this.symbol, broadcaster_id, settings, customtoken);
    };
    slow = (broadcaster_id, wait_time, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.slow(this.symbol, broadcaster_id, wait_time, customtoken);
    };
    slowOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.slowOff(this.symbol, broadcaster_id, customtoken);
    };
    followers = (broadcaster_id, duration, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.followers(this.symbol, broadcaster_id, duration, customtoken);
    };
    followersOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.followersOff(this.symbol, broadcaster_id, customtoken);
    };
    subscribers = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.subscribers(this.symbol, broadcaster_id, customtoken);
    };
    subscribersOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.subscribersOff(this.symbol, broadcaster_id, customtoken);
    };
    emote = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.emote(this.symbol, broadcaster_id, customtoken);
    };
    emoteOnly = this.emote;
    emoteOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.emoteOff(this.symbol, broadcaster_id, customtoken);
    };
    emoteOnlyOff = this.emoteOff;
    r9k = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.r9k(this.symbol, broadcaster_id, customtoken);
    };
    uniqueChat = this.r9k;
    r9kOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.r9kOff(this.symbol, broadcaster_id, customtoken);
    };
    uniqueChatOff = this.r9kOff;
    chatdelay = (broadcaster_id, duration, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.chatdelay(this.symbol, broadcaster_id, duration, customtoken);
    };
    chatdelayOff = (broadcaster_id, customtoken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.chatdelayOff(this.symbol, broadcaster_id, customtoken);
    };
    getChatSettings = (broadcaster_id, customtoken) => {
        return (0, getChatSettings_1.getChatSettings)(this.symbol, broadcaster_id, customtoken);
    };
    getStreams = (filters, customtoken) => {
        return (0, getStreams_1.getStreams)(this.symbol, filters, customtoken);
    };
    mod = (user_id, customtoken) => {
        return (0, mod_1.mod)(this.symbol, user_id, customtoken);
    };
    unmod = (broadcaster_id, user_id, customtoken) => {
        return (0, unmod_1.unmod)(this.symbol, broadcaster_id, user_id, customtoken);
    };
    vip = (to_user_id, customtoken) => {
        return (0, vip_1.vip)(this.symbol, to_user_id, customtoken);
    };
    unvip = (broadcaster_id, user_id, customtoken) => {
        return (0, unvip_1.unvip)(this.symbol, broadcaster_id, user_id, customtoken);
    };
    updateColor = (color, customtoken) => {
        return (0, updateColor_1.updateColor)(this.symbol, color, customtoken);
    };
    getColor = (userids, customtoken) => {
        return (0, getColor_1.getColor)(this.symbol, userids, customtoken);
    };
    raid = (from_broadcaster_id, to_broadcaster_id, customtoken) => {
        return (0, raid_1.raid)(this.symbol, from_broadcaster_id, to_broadcaster_id, customtoken);
    };
    cancelraid = (broadcaster_id, customtoken) => {
        return (0, cancelraid_1.cancelRaid)(this.symbol, broadcaster_id, customtoken);
    };
    unraid = this.cancelraid;
    getChannelFollowers = (broadcaster_id, user_id, customtoken) => {
        return (0, getChannelFollowers_1.getChannelFollowers)(this.symbol, broadcaster_id, user_id, customtoken);
    };
    addEventsubSubscription = (type, version, condition, transport, customtoken) => {
        return (0, addEventsubSubscription_1.addEventsubSubscription)(this.symbol, type, version, condition, transport, customtoken);
    };
    getEventsubSubscriptions = (customtoken) => {
        return (0, getEventsubSubscriptions_1.getEventsubSubscriptions)(this.symbol, customtoken);
    };
    deleteEventsubSubscription = (id, customtoken) => {
        return (0, deleteEventsubSubscription_1.deleteEventsubSubscription)(this.symbol, id, customtoken);
    };
    getGames = (ids, names, igdbIDs, customtoken) => {
        return (0, getGames_1.getGames)(this.symbol, ids, names, igdbIDs, customtoken);
    };
    getBroadcasterSubscriptions = (customtoken, user_id, first, after, before) => {
        return (0, getBroadcasterSubscriptions_1.getBroadcasterSubscriptions)(this.symbol, customtoken, user_id, first, after, before);
    };
    getChannels = (broadcaster_ids, customtoken) => {
        return (0, getChannels_1.getChannels)(this.symbol, broadcaster_ids, customtoken);
    };
    updateChannel = (channelData, customtoken) => {
        return (0, updateChannel_1.updateChannel)(this.symbol, channelData, customtoken);
    };
    getPolls = (id, first, after) => {
        return (0, getPolls_1.getPolls)(this.symbol, id, first, after, after);
    };
    createPoll = (title, choices, duration, channelPointsVotingEnabled, channelPointsPerVote, customtoken) => {
        return (0, createPoll_1.createPoll)(this.symbol, title, choices, duration, channelPointsVotingEnabled, channelPointsPerVote, customtoken);
    };
    endPoll = (id, status, customtoken) => {
        return (0, endPoll_1.endPoll)(this.symbol, id, status, customtoken);
    };
    getPredictions = (ids, first, after, customtoken) => {
        return (0, getPredictions_1.getPredictions)(this.symbol, ids, first, after, customtoken);
    };
    createPrediction = (title, outcomes, predictionWindow, customtoken) => {
        return (0, createPrediction_1.createPrediction)(this.symbol, title, outcomes, predictionWindow, customtoken);
    };
    endPrediction = (id, status, winningOutcomeID, customtoken) => {
        return (0, endPrediction_1.endPrediction)(this.symbol, id, status, winningOutcomeID, customtoken);
    };
}
exports.oberknechtAPI = oberknechtAPI;
