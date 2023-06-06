import { channelFollowersResponse } from "../types/endpoints/getChannelFollowers";
export declare function getChannelFollowers(sym: string, broadcaster_id: string, user_id?: string, customtoken?: string): Promise<channelFollowersResponse>;
