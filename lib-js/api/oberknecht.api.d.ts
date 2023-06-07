import { jsonsplitter } from "@jubewe/jsonsplitter";
import { colorsType } from "../types/endpoints/color";
import { announcementColorsType } from "../types/endpoints/annoucement";
import { eventsubSubscriptionTypesType } from "../types/endpoints/eventsub";
import { eventsubSubscriptionVersionType } from "../types/endpoints/eventsub";
import { chatSettingEntry } from "../types/endpoints/chatSettings";
import { oberknechtAPIOptionsType } from "../types/oberknechtAPIOptions";
import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { channelData as channelDataType } from "../types/endpoints/updateChannel";
import { choices, pollStatusType } from "../types/endpoints/poll";
export declare class oberknechtAPI {
    #private;
    get symbol(): string;
    get options(): any;
    static get options(): oberknechtAPIOptionsType;
    static get symbol(): any;
    verified: boolean;
    userssplitter: jsonsplitter;
    userssplitterpromise: any;
    _options: oberknechtAPIOptionsType;
    constructor(options: oberknechtAPIOptionsType);
    verify(): Promise<void>;
    destroy(): Promise<void>;
    _validatetoken: (customtoken: string) => Promise<import("../types/endpoints/validateToken").validateTokenResponse>;
    _getUsers: (logins: string | string[] | undefined, ids?: string | string[] | undefined, noautofilterids?: Boolean, customtoken?: string) => Promise<import("../types/_getUsers")._getUsersResponse>;
    _getUser: (user: string) => Promise<[string, string, Object]>;
    ban: (broadcaster_id: string, target_user_id: string, reason: any, customtoken?: string) => Promise<import("../types/endpoints/ban").banResponse>;
    deleteMessage: (broadcaster_id: string, message_id: string, customtoken?: string) => Promise<void>;
    delete: (broadcaster_id: string, message_id: string, customtoken?: string) => Promise<void>;
    clearChat: (broadcaster_id: string, customtoken?: string) => Promise<void>;
    getUsers: (logins: string | string[], ids: string | string[], noautofilterids: boolean, customtoken?: string) => Promise<import("../types/endpoints/_getUsers").getUsersResolveType>;
    shoutout: (from_broadcaster_id: string, to_broadcaster_id: string, customtoken?: string) => Promise<void>;
    timeout: (broadcaster_id: string, target_user_id: string, duration: string, reason?: string, customtoken?: string) => Promise<import("../types/endpoints/ban").banResponse>;
    unban: (broadcaster_id: string, target_user_id: string, customtoken?: string) => Promise<void>;
    untimeout: (broadcaster_id: string, target_user_id: string, customtoken?: string) => Promise<void>;
    whisper: (to_user_id: string, message: string, customtoken: string) => Promise<void>;
    announce: (broadcaster_id: string, message: string, color: announcementColorsType, customtoken?: string) => Promise<void>;
    updateChatSettings: (broadcaster_id: string, settings: chatSettingEntry, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    slow: (broadcaster_id: string, wait_time: number, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    slowOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    followers: (broadcaster_id: string, duration?: number, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    followersOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    subscribers: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    subscribersOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emote: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOnly: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    emoteOnlyOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    r9k: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    uniqueChat: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    r9kOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    uniqueChatOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    chatdelay: (broadcaster_id: string, duration: 2 | 4 | 6, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    chatdelayOff: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    getChatSettings: (broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/chatSettings").chatSettingsResponse>;
    getStreams: (filters: getStreamsFiltersType, customtoken?: string) => Promise<import("../types/endpoints/getStreams").getStreamsResponse>;
    mod: (user_id: string, customtoken?: string) => Promise<void>;
    unmod: (broadcaster_id: string | undefined, user_id: string, customtoken?: string) => Promise<void>;
    vip: (to_user_id: string, customtoken?: string) => Promise<void>;
    unvip: (broadcaster_id: string | undefined, user_id: string, customtoken?: string) => Promise<void>;
    updateColor: (color: colorsType, customtoken?: string) => Promise<void>;
    getColor: (userids: string | string[], customtoken?: string) => Promise<import("../types/endpoints/color").getColorResponse>;
    raid: (from_broadcaster_id: string | undefined, to_broadcaster_id: string, customtoken?: string) => Promise<import("../types/endpoints/raid").raidResponse>;
    cancelraid: (broadcaster_id: string | undefined, customtoken?: string) => Promise<void>;
    unraid: (broadcaster_id: string | undefined, customtoken?: string) => Promise<void>;
    getChannelFollowers: (broadcaster_id?: string, user_id?: string, customtoken?: string) => Promise<import("../types/endpoints/getChannelFollowers").channelFollowersResponse>;
    addEventsubSubscription: (type: eventsubSubscriptionTypesType, version: eventsubSubscriptionVersionType, condition: any, transport: any, customtoken?: string) => Promise<import("../types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    getEventsubSubscriptions: (customtoken?: string) => Promise<import("../types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
    deleteEventsubSubscription: (id: string, customtoken?: string) => Promise<void>;
    getBroadcasterSubscriptions: (customtoken: string, user_id?: string, first?: string, after?: string, before?: string) => Promise<import("../types/endpoints/getBroadcasterSubscriptions").getBroadcasterSubscriptionsResponse>;
    getChannels: (broadcaster_ids: string | string[], customtoken?: string) => Promise<import("../types/endpoints/getChannels").getChannelsResponse>;
    updateChannel: (channelData: channelDataType, customtoken?: string) => Promise<void>;
    getPolls: (id?: string, first?: string, after?: string) => Promise<import("../types/endpoints/poll").getPollResponse>;
    createPoll: (title: string, choices: choices, duration: number, channelPointsVotingEnabled?: boolean, channelPointsPerVote?: number, customtoken?: string) => Promise<import("../types/endpoints/poll").createPollResponse>;
    endPoll: (id: string, status: pollStatusType, customtoken?: string) => Promise<import("../types/endpoints/poll").endPollResponse>;
}
