import { streamLanguagesType } from "./getStreams";
export type channelEntry = {
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
export type getChannelsResponse = {
    data: Array<channelEntry>;
};
