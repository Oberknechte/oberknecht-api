import { eventsubSubscriptionVersionType } from "../types/endpoints/eventsub";
export declare function addEventsubSubscription(sym: string, type: string, version: eventsubSubscriptionVersionType, condition: any, transport: any, customToken?: string): Promise<import("../types/endpoints/eventsub").getEventsubSubscriptionsResponse>;
