import { jsonsplitter } from "oberknecht-jsonsplitter";
import { colorsType } from "../types/endpoints/color";
import { announcementColorsType } from "../types/endpoints/annoucement";
import { eventsubSubscriptionTypesType } from "../types/endpoints/eventsub";
import { eventsubSubscriptionVersionType } from "../types/endpoints/eventsub";
import { chatSettingEntry } from "../types/endpoints/chatSettings";
import { oberknechtAPIOptionsType } from "../types/oberknechtAPIOptions";
import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { channelData as channelDataType } from "../types/endpoints/updateChannel";
import { choices, pollStatusType } from "../types/endpoints/poll";
import { createPredictionOutcomesType, endPredictionStatusType } from "../types/endpoints/predictions";
export declare class oberknechtAPI {
    #private;
    get symbol(): string;
    get options(): any;
    static get options(): oberknechtAPIOptionsType;
    static get symbol(): any;
    get clientData(): any;
    verified: boolean;
    userssplitter: jsonsplitter;
    tokenSplitter: jsonsplitter;
    userssplitterpromise: any;
    _options: oberknechtAPIOptionsType;
    constructor(options: oberknechtAPIOptionsType);
    verify(): Promise<void>;
    destroy(): Promise<void>;
    _validatetoken: (customToken: string, useOldFormat?: boolean) => Promise<import("../types/endpoints/validateToken").validateTokenResponseOld | import("../types/endpoints/validateToken").validateTokenResponse>;
    _validateRefreshTokenCode: (code: string, redirectURL: string, clientID?: string, clientSecret?: string) => Promise<import("../types/endpoints/validateRefreshTokenCode").validateRefreshTokenCodeResponse>;
    _refreshRefreshToken: (refreshToken: string, clientID: string, clientSecret: string) => Promise<import("../types/endpoints/refreshRefreshToken").refreshRefreshTokenResponse>;
    _revoketoken: (token: string, clientID?: string) => Promise<void>;
    _getUsers: (logins: string | string[] | undefined, ids?: string | string[] | undefined, noautofilterids?: Boolean, customToken?: string) => Promise<import("../types/_getUsers")._getUsersResponse>;
    _getUser: (user: string) => Promise<import("../types/endpoints/_getUsers").userEntry>;
    ban: (broadcasterID: string, targetUserID: string, reason: string, customToken?: string) => Promise<import("../types/endpoints/ban").banResponse>;
    deleteMessage: (broadcasterID: string, messageID: string, customToken?: string) => Promise<void>;
    delete: (broadcasterID: string, messageID: string, customToken?: string) => Promise<void>;
    clearChat: (broadcasterID: string, customToken?: string) => Promise<void>;
    getUsers: (logins: string | string[], ids?: string | string[], noautofilterids?: boolean, customToken?: string) => Promise<import("../types/endpoints/_getUsers").getUsersResolveType>;
    shoutout: (fromBroadcasterID: string, toBroadcasterID: string, customToken?: string) => Promise<void>;
    timeout: (broadcasterID: string, targetUserID: string, duration: number, reason?: string, customToken?: string) => Promise<import("../types/endpoints/ban").banResponse>;
    unban: (broadcasterID: string, targetUserID: string, customToken?: string) => Promise<void>;
    untimeout: (broadcasterID: string, targetUserID: string, customToken?: string) => Promise<void>;
    whisper: (toUserID: string, message: string, customToken: string) => Promise<void>;
    announce: (broadcasterID: string, message: string, color: announcementColorsType, customToken?: string) => Promise<void>;
    updateChatSettings: (broadcasterID: string, settings: chatSettingEntry, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    slow: (broadcasterID: string, waitTime: number, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    slowOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    followers: (broadcasterID: string, duration?: number, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    followersOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    subscribers: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    subscribersOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emote: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOnly: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOnlyOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    r9k: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    uniqueChat: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    r9kOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    uniqueChatOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    chatdelay: (broadcasterID: string, duration: 2 | 4 | 6, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    chatdelayOff: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    getChatSettings: (broadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    getStreams: (filters: getStreamsFiltersType, customToken?: string) => Promise<import("../types/endpoints/getStreams").getStreamsResponse>;
    mod: (userID: string, broadcasterID?: undefined, customToken?: string) => Promise<void>;
    unmod: (broadcasterID: string | undefined, userID: string, customToken?: string) => Promise<void>;
    vip: (toUserID: string, broadcasterID?: undefined, customToken?: string) => Promise<void>;
    unvip: (broadcasterID: string | undefined, userID: string, customToken?: string) => Promise<void>;
    updateColor: (color: colorsType, customToken?: string) => Promise<void>;
    getColor: (userIDs: string | string[], customToken?: string) => Promise<import("../types/endpoints/color").getColorResponse>;
    raid: (fromBroadcasterID: string | undefined, toBroadcasterID: string, customToken?: string) => Promise<import("../types/endpoints/raid").raidResponse>;
    cancelraid: (broadcasterID: string | undefined, customToken?: string) => Promise<void>;
    unraid: (broadcasterID: string | undefined, customToken?: string) => Promise<void>;
    getChannelFollowers: (broadcasterID?: string, userID?: string, customToken?: string) => Promise<import("../types/endpoints/getChannelFollowers").channelFollowersResponse>;
    addEventsubSubscription: (type: eventsubSubscriptionTypesType, version: eventsubSubscriptionVersionType, condition: any, transport: any, customToken?: string) => Promise<import("../types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    getEventsubSubscriptions: (customToken?: string) => Promise<import("../types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    deleteEventsubSubscription: (id: string, customToken?: string) => Promise<void>;
    getGames: (ids?: string | string[], names?: string | string[], igdbIDs?: string | string[], customToken?: string) => Promise<import("../types/endpoints/getGames").getGamesResponse>;
    getBroadcasterSubscriptions: (userID?: string, first?: string, after?: string, before?: string, broadcasterID?: undefined, customToken?: string) => Promise<import("../types/endpoints/getBroadcasterSubscriptions").getBroadcasterSubscriptionsResponse>;
    getChannels: (broadcasterIDs: string | string[], customToken?: string) => Promise<import("../types/endpoints/getChannels").getChannelsResponse>;
    updateChannel: (channelData: channelDataType, customToken?: string) => Promise<void>;
    getPolls: (id?: string, first?: number, after?: string, customToken?: string) => Promise<import("../types/endpoints/poll").getPollResponse>;
    createPoll: (title: string, choices: choices, duration: number, channelPointsVotingEnabled?: boolean, channelPointsPerVote?: number, customToken?: string) => Promise<import("../types/endpoints/poll").createPollResponse>;
    endPoll: (id: string, status: pollStatusType, customToken?: string) => Promise<import("../types/endpoints/poll").endPollResponse>;
    getPredictions: (ids?: string | string[], first?: number, after?: string, customToken?: string) => Promise<import("../types/endpoints/predictions").getPredictionResponse>;
    createPrediction: (title: string, outcomes: createPredictionOutcomesType, predictionWindow: number, customToken?: string) => Promise<import("../types/endpoints/predictions").createPredictionResponse>;
    endPrediction: (id: string, status: endPredictionStatusType, winningOutcomeID?: string, customToken?: string) => Promise<import("../types/endpoints/predictions").createPredictionResponse>;
    getClips: (broadcasterID?: string, ids?: string | string[], gameID?: string, startedAt?: string, endedAt?: string, first?: number, before?: string, after?: string, customToken?: string) => Promise<import("../types/endpoints/getClips").getClipsResponse>;
    createClip: (broadcasterID: string, hasDelay?: boolean) => Promise<import("../types/endpoints/createClip").createClipResponse>;
    getFollowedChannels: (broadcasterID?: string, first?: string, after?: string, userID?: undefined, customToken?: string) => Promise<import("../types/endpoints/getFollowedChannels").getFollowedChannelsResponse>;
    getModeratedChannels: (first?: number, after?: string, userID?: undefined, customToken?: string) => Promise<import("../types/endpoints/getModeratedChannels").getModeratedChannelsResponse>;
    getChannelModerators: (userID?: string, first?: string, after?: string, broadcasterID?: string, customToken?: string) => Promise<import("../types/endpoints/getChannelModerators").channelModeratorsResponse>;
}
