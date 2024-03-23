"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oberknechtAPI = void 0;
const index_1 = require("../index");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const oberknecht_jsonsplitter_1 = require("oberknecht-jsonsplitter");
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
const cancelRaid_1 = require("../endpoints/cancelRaid");
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
const _revoketoken_1 = require("../endpoints/_revoketoken");
const getClips_1 = require("../endpoints/getClips");
const createClip_1 = require("../endpoints/createClip");
const getFollowedChannels_1 = require("../endpoints/getFollowedChannels");
const oberknecht_request_1 = require("oberknecht-request");
const getModeratedChannels_1 = require("../endpoints/getModeratedChannels");
const _refreshRefreshToken_1 = require("../endpoints/_refreshRefreshToken");
const _validateRefreshTokenCode_1 = require("../endpoints/_validateRefreshTokenCode");
const validateTokenBR_1 = require("../functions/validateTokenBR");
const _getUser_1 = require("../endpoints/_getUser");
const getChannelModerators_1 = require("../endpoints/getChannelModerators");
const getValidAccessTokenForRT_1 = require("../functions/getValidAccessTokenForRT");
let clientSymNum = 0;
(0, oberknecht_request_1.request)(null, null, null, {
    returnAfter: true,
    callbackOptions: {
        callback: (a) => { },
    },
    options: {
        timeout: 5000,
    },
    returnOriginalResponse: true,
    // delayBetweenRequests: 100,
});
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
    get clientData() {
        return index_1.i.apiclientData[this.symbol];
    }
    verified = false;
    userssplitter;
    tokenSplitter;
    userssplitterpromise;
    _options;
    constructor(options) {
        let _options = options ?? {};
        if (_options.skipCreation)
            return;
        // if (!options?.token) throw Error(`token is undefined`);
        let data = (index_1.i.apiclientData[this.symbol] = {});
        _options.startPath = path_1.default.resolve(process.cwd(), _options.startPath ?? "./data/oberknecht-api");
        _options.saveIDsPath = path_1.default.resolve(_options.startPath, _options.saveIDsPath ?? "./userids");
        _options.debug = _options.debug ?? 1;
        this._options = data._options = _options;
        if (_options.saveIDs) {
            if (!data.jsonsplitters)
                data.jsonsplitters = {};
            let userssplitter = (data.jsonsplitters.users = this.userssplitter = new oberknecht_jsonsplitter_1.jsonsplitter({
                debug: _options.debug,
                startpath: _options.saveIDsPath,
                max_keys_in_file: 2000,
            }));
            if (!fs_1.default.existsSync(_options.saveIDsPath) ||
                Object.keys(userssplitter._mainPaths).length === 0) {
                this.userssplitterpromise = userssplitter.createSync({
                    logins: {},
                    ids: {},
                    details: {},
                });
            }
        }
        if (!_options.noSaveTokens) {
            if (!data.jsonsplitters)
                data.jsonsplitters = {};
            let tokenSplitter = (data.jsonsplitters.tokenSplitter = this.tokenSplitter = new oberknecht_jsonsplitter_1.jsonsplitter({
                debug: _options.debug,
                startpath: "./data/tokens",
                ...(_options.tokenSplitterOptions ?? {}),
            }));
            //   [userID]: {refreshTokens: {[<refreshToken>]: {}}, accessTokens: {[<accessToken>]: {}}}
            //   [refreshToken]: {<refreshToken>: {accessTokens: [accessToken]: {}}, userID: <userID>}
            //   [accessToken]: {...accessTokenData, expiresAt: number, refreshToken: <refreshToken>}
        }
        if ((0, isdebug_1.isdebug)(this.symbol, 2))
            (0, _log_1._log)(1, `${(0, _stackname_1._stackname)("Oberknecht-API")[3]} Initialized \n\t> Startpath: ${_options.startPath}`);
    }
    async verify() {
        return new Promise(async (resolve, reject) => {
            if (this.userssplitterpromise)
                await this.userssplitterpromise;
            if (this._options.refreshToken) {
                await (0, validateTokenBR_1.validateTokenBR)(this.symbol)
                    .then((t) => {
                    this.verified = true;
                    index_1.i.apiclientData[this.symbol]._options = {
                        ...index_1.i.apiclientData[this.symbol]._options,
                        clientid: t.clientID,
                        userid: t.userID,
                        login: t.userLogin,
                        token_scopes: t.scopes,
                    };
                    if ((0, isdebug_1.isdebug)(this.symbol, 2))
                        (0, _log_1._log)(1, `${(0, _stackname_1._stackname)("Oberknecht-API")[3]} Logged in as ${t.userLogin} (${t.userID}) (Via Refresh-Token)`);
                })
                    .catch(reject);
            }
            if (this._options.token)
                await (0, _validatetoken_1._validatetoken)(undefined, this._options.token, false)
                    .then((t) => {
                    this.verified = true;
                    index_1.i.apiclientData[this.symbol]._options = {
                        ...index_1.i.apiclientData[this.symbol]._options,
                        clientid: t.clientID,
                        userid: t.userID,
                        login: t.userLogin,
                        token_scopes: t.scopes,
                    };
                    if ((0, isdebug_1.isdebug)(this.symbol, 2))
                        (0, _log_1._log)(1, `${(0, _stackname_1._stackname)("Oberknecht-API")[3]} Logged in as ${t.userLogin} (${t.userID})`);
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
    _validatetoken = (customToken, useOldFormat) => {
        return (0, _validatetoken_1._validatetoken)(this.symbol, customToken, useOldFormat);
    };
    _validateRefreshTokenCode = (code, redirectURL, clientID, clientSecret) => {
        return (0, _validateRefreshTokenCode_1._validateRefreshTokenCode)(this.symbol, code, redirectURL, clientID, clientSecret);
    };
    _refreshRefreshToken = (refreshToken, clientID, clientSecret) => {
        return (0, _refreshRefreshToken_1._refreshRefreshToken)(this.symbol, refreshToken, clientID, clientSecret);
    };
    _getDataForRefreshToken = (refreshToken) => {
        return this.tokenSplitter.getKeySync(["refreshToken", refreshToken]);
    };
    _getValidAccessTokenForRT = (refreshToken) => {
        return (0, getValidAccessTokenForRT_1.getValidAccessTokenForRT)(this.symbol, refreshToken);
    };
    _getDataForAccessToken = (accessToken) => {
        return this.tokenSplitter.getKeySync(["accessToken", accessToken]);
    };
    _revoketoken = (token, clientID) => {
        return (0, _revoketoken_1._revoketoken)(this.symbol, token, clientID);
    };
    _getUsers = (logins, ids, noautofilterids, customToken, refreshCache) => {
        return (0, _getUsers_1._getUsers)(this.symbol, logins, ids, noautofilterids, customToken, refreshCache);
    };
    _getUser = (user, refreshCache) => {
        return (0, _getUser_1._getUser)(this.symbol, user, refreshCache);
    };
    ban = (broadcasterID, targetUserID, reason, customToken) => {
        return (0, ban_1.ban)(this.symbol, broadcasterID, targetUserID, reason, undefined, customToken);
    };
    deleteMessage = (broadcasterID, messageID, customToken) => {
        return (0, deleteMessage_1.deleteMessage)(this.symbol, broadcasterID, messageID, customToken);
    };
    delete = this.deleteMessage;
    clearChat = (broadcasterID, customToken) => {
        return (0, deleteMessage_1.deleteMessage)(this.symbol, broadcasterID, undefined, customToken);
    };
    getUsers = (logins, ids, noautofilterids, customToken) => {
        return (0, getUsers_1.getUsers)(this.symbol, logins, ids, noautofilterids, customToken);
    };
    shoutout = (fromBroadcasterID, toBroadcasterID, customToken) => {
        return (0, shoutout_1.shoutout)(this.symbol, fromBroadcasterID, toBroadcasterID, customToken);
    };
    timeout = (broadcasterID, targetUserID, duration, reason, customToken) => {
        return (0, ban_2.ban)(this.symbol, broadcasterID, targetUserID, reason, duration, customToken);
    };
    unban = (broadcasterID, targetUserID, customToken) => {
        return (0, unban_1.unban)(this.symbol, broadcasterID, targetUserID, customToken);
    };
    untimeout = this.unban;
    whisper = (toUserID, message, customToken) => {
        return (0, whisper_1.whisper)(this.symbol, toUserID, message, customToken);
    };
    announce = (broadcasterID, message, color, customToken) => {
        return (0, announce_1.announce)(this.symbol, broadcasterID, message, color, customToken);
    };
    updateChatSettings = (broadcasterID, settings, customToken) => {
        return (0, updateChatSettings_1.updateChatSettings)(this.symbol, broadcasterID, settings, customToken);
    };
    slow = (broadcasterID, waitTime, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.slow(this.symbol, broadcasterID, waitTime, customToken);
    };
    slowOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.slowOff(this.symbol, broadcasterID, customToken);
    };
    followers = (broadcasterID, duration, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.followers(this.symbol, broadcasterID, duration, customToken);
    };
    followersOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.followersOff(this.symbol, broadcasterID, customToken);
    };
    subscribers = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.subscribers(this.symbol, broadcasterID, customToken);
    };
    subscribersOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.subscribersOff(this.symbol, broadcasterID, customToken);
    };
    emote = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.emote(this.symbol, broadcasterID, customToken);
    };
    emoteOnly = this.emote;
    emoteOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.emoteOff(this.symbol, broadcasterID, customToken);
    };
    emoteOnlyOff = this.emoteOff;
    r9k = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.r9k(this.symbol, broadcasterID, customToken);
    };
    uniqueChat = this.r9k;
    r9kOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.r9kOff(this.symbol, broadcasterID, customToken);
    };
    uniqueChatOff = this.r9kOff;
    chatdelay = (broadcasterID, duration, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.chatdelay(this.symbol, broadcasterID, duration, customToken);
    };
    chatdelayOff = (broadcasterID, customToken) => {
        return updateSingleChatSetting_1.updateSingleChatSetting.chatdelayOff(this.symbol, broadcasterID, customToken);
    };
    getChatSettings = (broadcasterID, customToken) => {
        return (0, getChatSettings_1.getChatSettings)(this.symbol, broadcasterID, customToken);
    };
    getStreams = (filters, customToken) => {
        return (0, getStreams_1.getStreams)(this.symbol, filters, customToken);
    };
    mod = (userID, broadcasterID, customToken) => {
        return (0, mod_1.mod)(this.symbol, userID, broadcasterID, customToken);
    };
    unmod = (broadcasterID, userID, customToken) => {
        return (0, unmod_1.unmod)(this.symbol, broadcasterID, userID, customToken);
    };
    vip = (toUserID, broadcasterID, customToken) => {
        return (0, vip_1.vip)(this.symbol, toUserID, broadcasterID, customToken);
    };
    unvip = (broadcasterID, userID, customToken) => {
        return (0, unvip_1.unvip)(this.symbol, broadcasterID, userID, customToken);
    };
    updateColor = (color, customToken) => {
        return (0, updateColor_1.updateColor)(this.symbol, color, customToken);
    };
    getColor = (userIDs, customToken) => {
        return (0, getColor_1.getColor)(this.symbol, userIDs, customToken);
    };
    raid = (fromBroadcasterID, toBroadcasterID, customToken) => {
        return (0, raid_1.raid)(this.symbol, fromBroadcasterID, toBroadcasterID, customToken);
    };
    cancelraid = (broadcasterID, customToken) => {
        return (0, cancelRaid_1.cancelRaid)(this.symbol, broadcasterID, customToken);
    };
    unraid = this.cancelraid;
    getChannelFollowers = (broadcasterID, userID, customToken) => {
        return (0, getChannelFollowers_1.getChannelFollowers)(this.symbol, broadcasterID, userID, customToken);
    };
    addEventsubSubscription = (type, version, condition, transport, customToken) => {
        return (0, addEventsubSubscription_1.addEventsubSubscription)(this.symbol, type, version, condition, transport, customToken);
    };
    getEventsubSubscriptions = (customToken) => {
        return (0, getEventsubSubscriptions_1.getEventsubSubscriptions)(this.symbol, customToken);
    };
    deleteEventsubSubscription = (id, customToken) => {
        return (0, deleteEventsubSubscription_1.deleteEventsubSubscription)(this.symbol, id, customToken);
    };
    getGames = (ids, names, igdbIDs, customToken) => {
        return (0, getGames_1.getGames)(this.symbol, ids, names, igdbIDs, customToken);
    };
    getBroadcasterSubscriptions = (userID, first, after, before, broadcasterID, customToken) => {
        return (0, getBroadcasterSubscriptions_1.getBroadcasterSubscriptions)(this.symbol, userID, first, after, before, broadcasterID, customToken);
    };
    getChannels = (broadcasterIDs, customToken) => {
        return (0, getChannels_1.getChannels)(this.symbol, broadcasterIDs, customToken);
    };
    updateChannel = (channelData, customToken) => {
        return (0, updateChannel_1.updateChannel)(this.symbol, channelData, undefined, customToken);
    };
    getPolls = (id, first, after, customToken) => {
        return (0, getPolls_1.getPolls)(this.symbol, id, first, after, undefined, customToken);
    };
    createPoll = (title, choices, duration, channelPointsVotingEnabled, channelPointsPerVote, customToken) => {
        return (0, createPoll_1.createPoll)(this.symbol, title, choices, duration, channelPointsVotingEnabled, channelPointsPerVote, undefined, customToken);
    };
    endPoll = (id, status, customToken) => {
        return (0, endPoll_1.endPoll)(this.symbol, id, status, undefined, customToken);
    };
    getPredictions = (ids, first, after, customToken) => {
        return (0, getPredictions_1.getPredictions)(this.symbol, ids, first, after, undefined, customToken);
    };
    createPrediction = (title, outcomes, predictionWindow, customToken) => {
        return (0, createPrediction_1.createPrediction)(this.symbol, title, outcomes, predictionWindow, undefined, customToken);
    };
    endPrediction = (id, status, winningOutcomeID, customToken) => {
        return (0, endPrediction_1.endPrediction)(this.symbol, id, status, winningOutcomeID, undefined, customToken);
    };
    getClips = (broadcasterID, ids, gameID, startedAt, endedAt, first, before, after, customToken) => {
        return (0, getClips_1.getClips)(this.symbol, broadcasterID, ids, gameID, startedAt, endedAt, first, before, after, customToken);
    };
    createClip = (broadcasterID, hasDelay) => {
        return (0, createClip_1.createClip)(this.symbol, broadcasterID, hasDelay);
    };
    getFollowedChannels = (broadcasterID, first, after, userID, customToken) => {
        return (0, getFollowedChannels_1.getFollowedChannels)(this.symbol, broadcasterID, first, after, userID, customToken);
    };
    getModeratedChannels = (first, after, userID, customToken) => {
        return (0, getModeratedChannels_1.getModeratedChannels)(this.symbol, first, after, userID, customToken);
    };
    getChannelModerators = (userID, first, after, broadcasterID, customToken) => {
        return (0, getChannelModerators_1.getChannelModerators)(this.symbol, broadcasterID, userID, first, after, customToken);
    };
}
exports.oberknechtAPI = oberknechtAPI;
