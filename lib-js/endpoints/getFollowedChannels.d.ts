import { getFollowedChannelsResponse } from "../types/endpoints/getFollowedChannels";
export declare function getFollowedChannels(sym: string, userID?: undefined | string, broadcasterID?: string, first?: string, after?: string, customtoken?: string): Promise<getFollowedChannelsResponse>;
