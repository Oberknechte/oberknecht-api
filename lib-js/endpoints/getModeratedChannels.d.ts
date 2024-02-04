import { getModeratedChannelsResponse } from "../types/endpoints/getModeratedChannels";
export declare function getModeratedChannels(sym: string, first?: number, after?: string, userID?: undefined, customToken?: string): Promise<getModeratedChannelsResponse>;
