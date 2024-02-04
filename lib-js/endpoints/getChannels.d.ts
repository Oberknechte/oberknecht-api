import { getChannelsResponse } from "../types/endpoints/getChannels";
export declare function getChannels(sym: string, broadcaster_ids?: string | string[], customToken?: string): Promise<getChannelsResponse>;
