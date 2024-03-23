import { i } from "../index";
import path from "path";
import fs from "fs";
import { jsonsplitter } from "oberknecht-jsonsplitter";

import { isdebug } from "../functions/isdebug";
import { _log } from "../functions/_log";
import { _stackname } from "../functions/_stackname";

import { _validatetoken } from "../endpoints/_validatetoken";
import { ban } from "../endpoints/ban";
import { deleteMessage } from "../endpoints/deleteMessage";
import { getUsers } from "../endpoints/getUsers";
import { _getUsers } from "../endpoints/_getUsers";
import { shoutout } from "../endpoints/shoutout";
import { ban as timeout } from "../endpoints/ban";
import { unban } from "../endpoints/unban";
import { whisper } from "../endpoints/whisper";
import { announce } from "../endpoints/announce";
import { getChatSettings } from "../endpoints/getChatSettings";
import { updateChatSettings } from "../endpoints/updateChatSettings";
import { updateSingleChatSetting } from "../operations/updateSingleChatSetting";
import { getStreams } from "../endpoints/getStreams";
import { mod } from "../endpoints/mod";
import { unmod } from "../endpoints/unmod";
import { vip } from "../endpoints/vip";
import { unvip } from "../endpoints/unvip";
import { updateColor } from "../endpoints/updateColor";
import { getColor } from "../endpoints/getColor";
import { raid } from "../endpoints/raid";
import { getChannelFollowers } from "../endpoints/getChannelFollowers";
import { cancelRaid } from "../endpoints/cancelRaid";

import { addEventsubSubscription } from "../endpoints/addEventsubSubscription";
import { getEventsubSubscriptions } from "../endpoints/getEventsubSubscriptions";
import { deleteEventsubSubscription } from "../endpoints/deleteEventsubSubscription";
import { getBroadcasterSubscriptions } from "../endpoints/getBroadcasterSubscriptions";

import { colorsType } from "../types/endpoints/color";
import { announcementColorsType } from "../types/endpoints/annoucement";
import { eventsubSubscriptionTypesType } from "../types/endpoints/eventsub";
import { eventsubSubscriptionVersionType } from "../types/endpoints/eventsub";
import { chatSettingEntry } from "../types/endpoints/chatSettings";
import { oberknechtAPIOptionsType } from "../types/oberknechtAPIOptions";
import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { getChannels } from "../endpoints/getChannels";
import { updateChannel } from "../endpoints/updateChannel";
import { channelData as channelDataType } from "../types/endpoints/updateChannel";
import { getPolls } from "../endpoints/getPolls";
import { createPoll } from "../endpoints/createPoll";
import { choices, pollStatusType } from "../types/endpoints/poll";
import { endPoll } from "../endpoints/endPoll";
import { getGames } from "../endpoints/getGames";
import { createPrediction } from "../endpoints/createPrediction";
import {
  createPredictionOutcomesType,
  endPredictionStatusType,
} from "../types/endpoints/predictions";
import { endPrediction } from "../endpoints/endPrediction";
import { getPredictions } from "../endpoints/getPredictions";
import { _revoketoken } from "../endpoints/_revoketoken";
import { getClips } from "../endpoints/getClips";
import { createClip } from "../endpoints/createClip";
import { getFollowedChannels } from "../endpoints/getFollowedChannels";
import { request } from "oberknecht-request";
import { getModeratedChannels } from "../endpoints/getModeratedChannels";
import { _refreshRefreshToken } from "../endpoints/_refreshRefreshToken";
import { _validateRefreshTokenCode } from "../endpoints/_validateRefreshTokenCode";
import { validateTokenWR } from "../functions/validateTokenWR";
import { validateTokenBR } from "../functions/validateTokenBR";
import { _getUser } from "../endpoints/_getUser";
import { getChannelModerators } from "../endpoints/getChannelModerators";
import { getValidAccessTokenForRT } from "../functions/getValidAccessTokenForRT";
let clientSymNum = 0;

request(null, null, null, {
  returnAfter: true,
  callbackOptions: {
    callback: (a) => {},
  },
  options: {
    timeout: 5000,
  },
  returnOriginalResponse: true,
  // delayBetweenRequests: 100,
});

export class oberknechtAPI {
  readonly #symbol: string = `oberknechtAPI-${clientSymNum++}`;
  get symbol() {
    return this.#symbol;
  }
  get options() {
    return i.apiclientData[this.symbol]?._options;
  }

  static get options(): oberknechtAPIOptionsType {
    return this.options;
  }
  static get symbol() {
    return this.symbol;
  }
  get clientData() {
    return i.apiclientData[this.symbol];
  }

  verified = false;
  userssplitter: jsonsplitter;
  tokenSplitter: jsonsplitter;
  userssplitterpromise;
  _options: oberknechtAPIOptionsType;

  constructor(options: oberknechtAPIOptionsType) {
    let _options: oberknechtAPIOptionsType = options ?? {};

    if (_options.skipCreation) return;
    // if (!options?.token) throw Error(`token is undefined`);
    let data = (i.apiclientData[this.symbol] = {} as Record<string, any>);
    _options.startPath = path.resolve(
      process.cwd(),
      _options.startPath ?? "./data/oberknecht-api"
    );
    _options.saveIDsPath = path.resolve(
      _options.startPath,
      _options.saveIDsPath ?? "./userids"
    );
    _options.debug = _options.debug ?? 1;

    this._options = data._options = _options;
    if (_options.saveIDs) {
      if (!data.jsonsplitters) data.jsonsplitters = {};
      let userssplitter = (data.jsonsplitters.users = this.userssplitter = new jsonsplitter(
        {
          debug: _options.debug,
          startpath: _options.saveIDsPath,
          max_keys_in_file: 2000,
        }
      ));

      if (
        !fs.existsSync(_options.saveIDsPath) ||
        Object.keys(userssplitter._mainPaths).length === 0
      ) {
        this.userssplitterpromise = userssplitter.createSync({
          logins: {},
          ids: {},
          details: {},
        });
      }
    }

    if (!_options.noSaveTokens) {
      if (!data.jsonsplitters) data.jsonsplitters = {};
      let tokenSplitter = (data.jsonsplitters.tokenSplitter = this.tokenSplitter = new jsonsplitter(
        {
          debug: _options.debug,
          startpath: "./data/tokens",
          ...(_options.tokenSplitterOptions ?? {}),
        }
      ));

      //   [userID]: {refreshTokens: {[<refreshToken>]: {}}, accessTokens: {[<accessToken>]: {}}}
      //   [refreshToken]: {<refreshToken>: {accessTokens: [accessToken]: {}}, userID: <userID>}
      //   [accessToken]: {...accessTokenData, expiresAt: number, refreshToken: <refreshToken>}
    }

    if (isdebug(this.symbol, 2))
      _log(
        1,
        `${_stackname("Oberknecht-API")[3]} Initialized \n\t> Startpath: ${
          _options.startPath
        }`
      );
  }

  async verify() {
    return new Promise<void>(async (resolve, reject) => {
      if (this.userssplitterpromise) await this.userssplitterpromise;

      if (this._options.refreshToken) {
        await validateTokenBR(this.symbol)
          .then((t) => {
            this.verified = true;
            i.apiclientData[this.symbol]._options = {
              ...i.apiclientData[this.symbol]._options,
              clientid: t.clientID,
              userid: t.userID,
              login: t.userLogin,
              token_scopes: t.scopes,
            };

            if (isdebug(this.symbol, 2))
              _log(
                1,
                `${_stackname("Oberknecht-API")[3]} Logged in as ${
                  t.userLogin
                } (${t.userID}) (Via Refresh-Token)`
              );
          })
          .catch(reject);
      }

      if (this._options.token)
        await _validatetoken(undefined, this._options.token, false)
          .then((t) => {
            this.verified = true;
            i.apiclientData[this.symbol]._options = {
              ...i.apiclientData[this.symbol]._options,
              clientid: t.clientID,
              userid: t.userID,
              login: t.userLogin,
              token_scopes: t.scopes,
            };

            if (isdebug(this.symbol, 2))
              _log(
                1,
                `${_stackname("Oberknecht-API")[3]} Logged in as ${
                  t.userLogin
                } (${t.userID})`
              );
          })
          .catch((e) => {
            return reject(e);
          });

      resolve();
    });
  }

  async destroy() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.userssplitter.destroy();
      } catch (e) {}

      delete i.apiclientData[this.symbol];

      return resolve();
    });
  }

  _validatetoken = (customToken: string, useOldFormat?: boolean) => {
    return _validatetoken(this.symbol, customToken, useOldFormat);
  };

  _validateRefreshTokenCode = (
    code: string,
    redirectURL: string,
    clientID?: string,
    clientSecret?: string
  ) => {
    return _validateRefreshTokenCode(
      this.symbol,
      code,
      redirectURL,
      clientID,
      clientSecret
    );
  };

  _refreshRefreshToken = (
    refreshToken: string,
    clientID: string,
    clientSecret: string
  ) => {
    return _refreshRefreshToken(
      this.symbol,
      refreshToken,
      clientID,
      clientSecret
    );
  };

  _getDataForRefreshToken = (refreshToken: string) => {
    return this.tokenSplitter.getKeySync(["refreshToken", refreshToken]);
  };

  _getValidAccessTokenForRT = (refreshToken: string) => {
    return getValidAccessTokenForRT(this.symbol, refreshToken);
  };

  _getDataForAccessToken = (accessToken: string) => {
    return this.tokenSplitter.getKeySync(["accessToken", accessToken]);
  }

  _revoketoken = (token: string, clientID?: string) => {
    return _revoketoken(this.symbol, token, clientID);
  };

  _getUsers = (
    logins: string | string[] | undefined,
    ids?: string | string[] | undefined,
    noautofilterids?: Boolean,
    customToken?: string,
    refreshCache?: boolean
  ) => {
    return _getUsers(
      this.symbol,
      logins,
      ids,
      noautofilterids,
      customToken,
      refreshCache
    );
  };
  _getUser = (user: string, refreshCache?: boolean) => {
    return _getUser(this.symbol, user, refreshCache);
  };

  ban = (
    broadcasterID: string,
    targetUserID: string,
    reason: string,
    customToken?: string
  ) => {
    return ban(
      this.symbol,
      broadcasterID,
      targetUserID,
      reason,
      undefined,
      customToken
    );
  };
  deleteMessage = (
    broadcasterID: string,
    messageID: string,
    customToken?: string
  ) => {
    return deleteMessage(this.symbol, broadcasterID, messageID, customToken);
  };
  delete = this.deleteMessage;
  clearChat = (broadcasterID: string, customToken?: string) => {
    return deleteMessage(this.symbol, broadcasterID, undefined, customToken);
  };
  getUsers = (
    logins: string | string[],
    ids?: string | string[],
    noautofilterids?: boolean,
    customToken?: string
  ) => {
    return getUsers(this.symbol, logins, ids, noautofilterids, customToken);
  };
  shoutout = (
    fromBroadcasterID: string,
    toBroadcasterID: string,
    customToken?: string
  ) => {
    return shoutout(
      this.symbol,
      fromBroadcasterID,
      toBroadcasterID,
      customToken
    );
  };
  timeout = (
    broadcasterID: string,
    targetUserID: string,
    duration: number,
    reason?: string,
    customToken?: string
  ) => {
    return timeout(
      this.symbol,
      broadcasterID,
      targetUserID,
      reason,
      duration,
      customToken
    );
  };
  unban = (
    broadcasterID: string,
    targetUserID: string,
    customToken?: string
  ) => {
    return unban(this.symbol, broadcasterID, targetUserID, customToken);
  };
  untimeout = this.unban;
  whisper = (toUserID: string, message: string, customToken: string) => {
    return whisper(this.symbol, toUserID, message, customToken);
  };

  announce = (
    broadcasterID: string,
    message: string,
    color: announcementColorsType,
    customToken?: string
  ) => {
    return announce(this.symbol, broadcasterID, message, color, customToken);
  };
  updateChatSettings = (
    broadcasterID: string,
    settings: chatSettingEntry,
    customToken?: string
  ) => {
    return updateChatSettings(
      this.symbol,
      broadcasterID,
      settings,
      customToken
    );
  };

  slow = (broadcasterID: string, waitTime: number, customToken?: string) => {
    return updateSingleChatSetting.slow(
      this.symbol,
      broadcasterID,
      waitTime,
      customToken
    );
  };
  slowOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.slowOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };

  followers = (
    broadcasterID: string,
    duration?: number,
    customToken?: string
  ) => {
    return updateSingleChatSetting.followers(
      this.symbol,
      broadcasterID,
      duration,
      customToken
    );
  };
  followersOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.followersOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };

  subscribers = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.subscribers(
      this.symbol,
      broadcasterID,
      customToken
    );
  };
  subscribersOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.subscribersOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };

  emote = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.emote(
      this.symbol,
      broadcasterID,
      customToken
    );
  };
  emoteOnly = this.emote;
  emoteOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.emoteOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };
  emoteOnlyOff = this.emoteOff;

  r9k = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.r9k(this.symbol, broadcasterID, customToken);
  };
  uniqueChat = this.r9k;
  r9kOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.r9kOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };
  uniqueChatOff = this.r9kOff;

  chatdelay = (
    broadcasterID: string,
    duration: 2 | 4 | 6,
    customToken?: string
  ) => {
    return updateSingleChatSetting.chatdelay(
      this.symbol,
      broadcasterID,
      duration,
      customToken
    );
  };
  chatdelayOff = (broadcasterID: string, customToken?: string) => {
    return updateSingleChatSetting.chatdelayOff(
      this.symbol,
      broadcasterID,
      customToken
    );
  };

  getChatSettings = (broadcasterID: string, customToken?: string) => {
    return getChatSettings(this.symbol, broadcasterID, customToken);
  };
  getStreams = (filters: getStreamsFiltersType, customToken?: string) => {
    return getStreams(this.symbol, filters, customToken);
  };

  mod = (userID: string, broadcasterID?: undefined, customToken?: string) => {
    return mod(this.symbol, userID, broadcasterID, customToken);
  };
  unmod = (
    broadcasterID: string | undefined,
    userID: string,
    customToken?: string
  ) => {
    return unmod(this.symbol, broadcasterID, userID, customToken);
  };

  vip = (toUserID: string, broadcasterID?: undefined, customToken?: string) => {
    return vip(this.symbol, toUserID, broadcasterID, customToken);
  };
  unvip = (
    broadcasterID: string | undefined,
    userID: string,
    customToken?: string
  ) => {
    return unvip(this.symbol, broadcasterID, userID, customToken);
  };

  updateColor = (color: colorsType, customToken?: string) => {
    return updateColor(this.symbol, color, customToken);
  };
  getColor = (userIDs: string | string[], customToken?: string) => {
    return getColor(this.symbol, userIDs, customToken);
  };

  raid = (
    fromBroadcasterID: string | undefined,
    toBroadcasterID: string,
    customToken?: string
  ) => {
    return raid(this.symbol, fromBroadcasterID, toBroadcasterID, customToken);
  };
  cancelraid = (broadcasterID: string | undefined, customToken?: string) => {
    return cancelRaid(this.symbol, broadcasterID, customToken);
  };
  unraid = this.cancelraid;

  getChannelFollowers = (
    broadcasterID?: string,
    userID?: string,
    customToken?: string
  ) => {
    return getChannelFollowers(this.symbol, broadcasterID, userID, customToken);
  };
  addEventsubSubscription = (
    type: eventsubSubscriptionTypesType,
    version: eventsubSubscriptionVersionType,
    condition: any,
    transport: any,
    customToken?: string
  ) => {
    return addEventsubSubscription(
      this.symbol,
      type,
      version,
      condition,
      transport,
      customToken
    );
  };
  getEventsubSubscriptions = (customToken?: string) => {
    return getEventsubSubscriptions(this.symbol, customToken);
  };
  deleteEventsubSubscription = (id: string, customToken?: string) => {
    return deleteEventsubSubscription(this.symbol, id, customToken);
  };

  getGames = (
    ids?: string | string[],
    names?: string | string[],
    igdbIDs?: string | string[],
    customToken?: string
  ) => {
    return getGames(this.symbol, ids, names, igdbIDs, customToken);
  };
  getBroadcasterSubscriptions = (
    userID?: string,
    first?: string,
    after?: string,
    before?: string,
    broadcasterID?: undefined,
    customToken?: string
  ) => {
    return getBroadcasterSubscriptions(
      this.symbol,
      userID,
      first,
      after,
      before,
      broadcasterID,
      customToken
    );
  };
  getChannels = (broadcasterIDs: string | string[], customToken?: string) => {
    return getChannels(this.symbol, broadcasterIDs, customToken);
  };
  updateChannel = (channelData: channelDataType, customToken?: string) => {
    return updateChannel(this.symbol, channelData, undefined, customToken);
  };
  getPolls = (
    id?: string,
    first?: number,
    after?: string,
    customToken?: string
  ) => {
    return getPolls(this.symbol, id, first, after, undefined, customToken);
  };
  createPoll = (
    title: string,
    choices: choices,
    duration: number,
    channelPointsVotingEnabled?: boolean,
    channelPointsPerVote?: number,
    customToken?: string
  ) => {
    return createPoll(
      this.symbol,
      title,
      choices,
      duration,
      channelPointsVotingEnabled,
      channelPointsPerVote,
      undefined,
      customToken
    );
  };
  endPoll = (id: string, status: pollStatusType, customToken?: string) => {
    return endPoll(this.symbol, id, status, undefined, customToken);
  };
  getPredictions = (
    ids?: string | string[],
    first?: number,
    after?: string,
    customToken?: string
  ) => {
    return getPredictions(
      this.symbol,
      ids,
      first,
      after,
      undefined,
      customToken
    );
  };
  createPrediction = (
    title: string,
    outcomes: createPredictionOutcomesType,
    predictionWindow: number,
    customToken?: string
  ) => {
    return createPrediction(
      this.symbol,
      title,
      outcomes,
      predictionWindow,
      undefined,
      customToken
    );
  };
  endPrediction = (
    id: string,
    status: endPredictionStatusType,
    winningOutcomeID?: string,
    customToken?: string
  ) => {
    return endPrediction(
      this.symbol,
      id,
      status,
      winningOutcomeID,
      undefined,
      customToken
    );
  };

  getClips = (
    broadcasterID?: string,
    ids?: string | string[],
    gameID?: string,
    startedAt?: string,
    endedAt?: string,
    first?: number,
    before?: string,
    after?: string,
    customToken?: string
  ) => {
    return getClips(
      this.symbol,
      broadcasterID,
      ids,
      gameID,
      startedAt,
      endedAt,
      first,
      before,
      after,
      customToken
    );
  };

  createClip = (broadcasterID: string, hasDelay?: boolean) => {
    return createClip(this.symbol, broadcasterID, hasDelay);
  };

  getFollowedChannels = (
    broadcasterID?: string,
    first?: string,
    after?: string,
    userID?: undefined,
    customToken?: string
  ) => {
    return getFollowedChannels(
      this.symbol,
      broadcasterID,
      first,
      after,
      userID,
      customToken
    );
  };

  getModeratedChannels = (
    first?: number,
    after?: string,
    userID?: undefined,
    customToken?: string
  ) => {
    return getModeratedChannels(this.symbol, first, after, userID, customToken);
  };
  getChannelModerators = (
    userID?: string,
    first?: string,
    after?: string,
    broadcasterID?: string,
    customToken?: string
  ) => {
    return getChannelModerators(
      this.symbol,
      broadcasterID,
      userID,
      first,
      after,
      customToken
    );
  };
}
