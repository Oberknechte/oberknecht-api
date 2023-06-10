import { i } from "../index";
import path from "path";
import fs from "fs";
import { jsonsplitter } from "@jubewe/jsonsplitter";

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
import { cancelRaid } from "../endpoints/cancelraid";
import { _getuser } from "../operations/_getuser";

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
let clientSymNum = 0;

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

  verified = false;
  userssplitter: jsonsplitter;
  userssplitterpromise;
  _options: oberknechtAPIOptionsType;

  constructor(options: oberknechtAPIOptionsType) {
    if (options.skipCreation) return;
    if (!options?.token) throw Error(`token is undefined`);
    let data = (i.apiclientData[this.symbol] = {} as Record<string, any>);
    options.startPath = path.resolve(process.cwd(), options.startPath ?? "./");
    options.saveIDsPath = path.resolve(
      options.startPath,
      options.saveIDsPath ?? "./userids"
    );
    options.debug = options.debug ?? 1;

    this._options = data._options = options;
    if (options.saveIDs) {
      if (!data.jsonsplitters) data.jsonsplitters = {};
      let userssplitter = (data.jsonsplitters.users = this.userssplitter = new jsonsplitter(
        {
          debug: options.debug,
          startpath: options.startPath,
          max_keys_in_file: 2000,
        }
      ));

      if (
        !fs.existsSync(options.startPath) ||
        Object.keys(userssplitter._mainpaths).length === 0
      ) {
        this.userssplitterpromise = userssplitter.createSync({
          logins: {},
          ids: {},
          details: {},
        });
      }
    }

    if (isdebug(this.symbol, 2))
      _log(
        1,
        `${_stackname("Oberknecht-API")[3]} Initialized \n\t> Startpath: ${
          options.startPath
        }`
      );
  }

  async verify() {
    return new Promise<void>(async (resolve) => {
      if (this.userssplitterpromise) await this.userssplitterpromise;

      await _validatetoken(this._options.token).then((t) => {
        this.verified = true;
        i.apiclientData[this.symbol]._options = {
          ...i.apiclientData[this.symbol]._options,
          clientid: t.client_id,
          userid: t.user_id,
          login: t.login,
          token_scopes: t.scopes,
        };

        if (isdebug(this.symbol, 2))
          _log(
            1,
            `${_stackname("Oberknecht-API")[3]} Logged in as ${t.login} (${
              t.user_id
            })`
          );
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

  _validatetoken = (customtoken: string) => {
    return _validatetoken(this.symbol, customtoken);
  };
  _getUsers = (
    logins: string | string[] | undefined,
    ids?: string | string[] | undefined,
    noautofilterids?: Boolean,
    customtoken?: string
  ) => {
    return _getUsers(this.symbol, logins, ids, noautofilterids, customtoken);
  };
  _getUser = (user: string) => {
    return _getuser(this.symbol, user);
  };

  ban = (
    broadcaster_id: string,
    target_user_id: string,
    reason,
    customtoken?: string
  ) => {
    return ban(
      this.symbol,
      broadcaster_id,
      target_user_id,
      reason,
      customtoken
    );
  };
  deleteMessage = (
    broadcaster_id: string,
    message_id: string,
    customtoken?: string
  ) => {
    return deleteMessage(this.symbol, broadcaster_id, message_id, customtoken);
  };
  delete = this.deleteMessage;
  clearChat = (broadcaster_id: string, customtoken?: string) => {
    return deleteMessage(this.symbol, broadcaster_id, undefined, customtoken);
  };
  getUsers = (
    logins: string | string[],
    ids?: string | string[],
    noautofilterids?: boolean,
    customtoken?: string
  ) => {
    return getUsers(this.symbol, logins, ids, noautofilterids, customtoken);
  };
  shoutout = (
    from_broadcaster_id: string,
    to_broadcaster_id: string,
    customtoken?: string
  ) => {
    return shoutout(
      this.symbol,
      from_broadcaster_id,
      to_broadcaster_id,
      customtoken
    );
  };
  timeout = (
    broadcaster_id: string,
    target_user_id: string,
    duration: string,
    reason?: string,
    customtoken?: string
  ) => {
    return timeout(
      this.symbol,
      broadcaster_id,
      target_user_id,
      duration,
      reason,
      customtoken
    );
  };
  unban = (
    broadcaster_id: string,
    target_user_id: string,
    customtoken?: string
  ) => {
    return unban(this.symbol, broadcaster_id, target_user_id, customtoken);
  };
  untimeout = this.unban;
  whisper = (to_user_id: string, message: string, customtoken: string) => {
    return whisper(this.symbol, to_user_id, message, customtoken);
  };

  announce = (
    broadcaster_id: string,
    message: string,
    color: announcementColorsType,
    customtoken?: string
  ) => {
    return announce(this.symbol, broadcaster_id, message, color, customtoken);
  };
  updateChatSettings = (
    broadcaster_id: string,
    settings: chatSettingEntry,
    customtoken?: string
  ) => {
    return updateChatSettings(
      this.symbol,
      broadcaster_id,
      settings,
      customtoken
    );
  };

  slow = (broadcaster_id: string, wait_time: number, customtoken?: string) => {
    return updateSingleChatSetting.slow(
      this.symbol,
      broadcaster_id,
      wait_time,
      customtoken
    );
  };
  slowOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.slowOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };

  followers = (
    broadcaster_id: string,
    duration?: number,
    customtoken?: string
  ) => {
    return updateSingleChatSetting.followers(
      this.symbol,
      broadcaster_id,
      duration,
      customtoken
    );
  };
  followersOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.followersOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };

  subscribers = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.subscribers(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };
  subscribersOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.subscribersOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };

  emote = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.emote(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };
  emoteOnly = this.emote;
  emoteOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.emoteOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };
  emoteOnlyOff = this.emoteOff;

  r9k = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.r9k(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };
  uniqueChat = this.r9k;
  r9kOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.r9kOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };
  uniqueChatOff = this.r9kOff;

  chatdelay = (
    broadcaster_id: string,
    duration: 2 | 4 | 6,
    customtoken?: string
  ) => {
    return updateSingleChatSetting.chatdelay(
      this.symbol,
      broadcaster_id,
      duration,
      customtoken
    );
  };
  chatdelayOff = (broadcaster_id: string, customtoken?: string) => {
    return updateSingleChatSetting.chatdelayOff(
      this.symbol,
      broadcaster_id,
      customtoken
    );
  };

  getChatSettings = (broadcaster_id: string, customtoken?: string) => {
    return getChatSettings(this.symbol, broadcaster_id, customtoken);
  };
  getStreams = (filters: getStreamsFiltersType, customtoken?: string) => {
    return getStreams(this.symbol, filters, customtoken);
  };

  mod = (user_id: string, customtoken?: string) => {
    return mod(this.symbol, user_id, customtoken);
  };
  unmod = (
    broadcaster_id: string | undefined,
    user_id: string,
    customtoken?: string
  ) => {
    return unmod(this.symbol, broadcaster_id, user_id, customtoken);
  };

  vip = (to_user_id: string, customtoken?: string) => {
    return vip(this.symbol, to_user_id, customtoken);
  };
  unvip = (
    broadcaster_id: string | undefined,
    user_id: string,
    customtoken?: string
  ) => {
    return unvip(this.symbol, broadcaster_id, user_id, customtoken);
  };

  updateColor = (color: colorsType, customtoken?: string) => {
    return updateColor(this.symbol, color, customtoken);
  };
  getColor = (userids: string | string[], customtoken?: string) => {
    return getColor(this.symbol, userids, customtoken);
  };

  raid = (
    from_broadcaster_id: string | undefined,
    to_broadcaster_id: string,
    customtoken?: string
  ) => {
    return raid(
      this.symbol,
      from_broadcaster_id,
      to_broadcaster_id,
      customtoken
    );
  };
  cancelraid = (broadcaster_id: string | undefined, customtoken?: string) => {
    return cancelRaid(this.symbol, broadcaster_id, customtoken);
  };
  unraid = this.cancelraid;

  getChannelFollowers = (
    broadcaster_id?: string,
    user_id?: string,
    customtoken?: string
  ) => {
    return getChannelFollowers(
      this.symbol,
      broadcaster_id,
      user_id,
      customtoken
    );
  };
  addEventsubSubscription = (
    type: eventsubSubscriptionTypesType,
    version: eventsubSubscriptionVersionType,
    condition: any,
    transport: any,
    customtoken?: string
  ) => {
    return addEventsubSubscription(
      this.symbol,
      type,
      version,
      condition,
      transport,
      customtoken
    );
  };
  getEventsubSubscriptions = (customtoken?: string) => {
    return getEventsubSubscriptions(this.symbol, customtoken);
  };
  deleteEventsubSubscription = (id: string, customtoken?: string) => {
    return deleteEventsubSubscription(this.symbol, id, customtoken);
  };

  getGames = (
    ids?: string | string[],
    names?: string | string[],
    igdbIDs?: string | string[],
    customtoken?: string
  ) => {
    return getGames(this.symbol, ids, names, igdbIDs, customtoken);
  };
  getBroadcasterSubscriptions = (
    customtoken: string,
    user_id?: string,
    first?: string,
    after?: string,
    before?: string
  ) => {
    return getBroadcasterSubscriptions(
      this.symbol,
      customtoken,
      user_id,
      first,
      after,
      before
    );
  };
  getChannels = (broadcaster_ids: string | string[], customtoken?: string) => {
    return getChannels(this.symbol, broadcaster_ids, customtoken);
  };
  updateChannel = (channelData: channelDataType, customtoken?: string) => {
    return updateChannel(this.symbol, channelData, customtoken);
  };
  getPolls = (id?: string, first?: number, after?: string) => {
    return getPolls(this.symbol, id, first, after, after);
  };
  createPoll = (
    title: string,
    choices: choices,
    duration: number,
    channelPointsVotingEnabled?: boolean,
    channelPointsPerVote?: number,
    customtoken?: string
  ) => {
    return createPoll(
      this.symbol,
      title,
      choices,
      duration,
      channelPointsVotingEnabled,
      channelPointsPerVote,
      customtoken
    );
  };
  endPoll = (id: string, status: pollStatusType, customtoken?: string) => {
    return endPoll(this.symbol, id, status, customtoken);
  };
  getPredictions = (
    ids?: string | string[],
    first?: number,
    after?: string,
    customtoken?: string
  ) => {
    return getPredictions(this.symbol, ids, first, after, customtoken);
  };
  createPrediction = (
    title: string,
    outcomes: createPredictionOutcomesType,
    predictionWindow: number,
    customtoken?: string
  ) => {
    return createPrediction(
      this.symbol,
      title,
      outcomes,
      predictionWindow,
      customtoken
    );
  };
  endPrediction = (
    id: string,
    status: endPredictionStatusType,
    winningOutcomeID?: string,
    customtoken?: string
  ) => {
    return endPrediction(
      this.symbol,
      id,
      status,
      winningOutcomeID,
      customtoken
    );
  };
}
