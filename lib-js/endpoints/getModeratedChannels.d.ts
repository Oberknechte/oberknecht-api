import { getModeratedChannelsResponse } from "../types/endpoints/getModeratedChannels";
export declare function getModeratedChannels(sym: string, userID?: string, first?: number, after?: string, customtoken?: string): Promise<getModeratedChannelsResponse>;
