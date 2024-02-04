import { getBroadcasterSubscriptionsResponse } from "../types/endpoints/getBroadcasterSubscriptions";
export declare function getBroadcasterSubscriptions(sym: string, userID?: string, first?: string, after?: string, before?: string, broadcasterID?: string, customToken?: string): Promise<getBroadcasterSubscriptionsResponse>;
