import { streamLanguagesType } from "./getStreams";
export declare type channelEntry = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: streamLanguagesType;
    game_id: string;
    game_name: string;
    title: string;
    delay: number;
    tags: string[];
};
export declare type getChannelsResponse = {
    data: Array<channelEntry>;
};
