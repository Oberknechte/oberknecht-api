import { channelModeratorsResponse } from "../types/endpoints/getChannelModerators";
export declare function getChannelModerators(sym: string, broadcasterID: string, userID?: string, first?: string, after?: string, customToken?: string): Promise<channelModeratorsResponse>;
