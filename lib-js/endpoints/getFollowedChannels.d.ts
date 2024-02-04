import { getFollowedChannelsResponse } from "../types/endpoints/getFollowedChannels";
export declare function getFollowedChannels(sym: string, broadcasterID?: string, first?: string, after?: string, userID?: undefined, customToken?: string): Promise<getFollowedChannelsResponse>;
