import { channelFollowersResponse } from "../types/endpoints/getChannelFollowers";
export declare function getChannelFollowers(sym: string, broadcasterID: string, userID?: string, customToken?: string): Promise<channelFollowersResponse>;
