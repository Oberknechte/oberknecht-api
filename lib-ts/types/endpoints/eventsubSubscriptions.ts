import { eventsubSubscriptionStatusType, eventsubSubscriptionTypesType, eventsubSubscriptionVersionType, eventsubSubscriptionTransportMethodType } from "./eventsub";

type transport1 = { "method": eventsubSubscriptionTransportMethodType, "callback": string };
type transport2 = { "method": eventsubSubscriptionTransportMethodType, "callback": string, "session_id": string, "connected_at": string, "disconnected_at": string };

export type eventsubSubscriptionEntry = {
    "id": string,
    "status": eventsubSubscriptionStatusType,
    "type": eventsubSubscriptionTypesType,
    "version": eventsubSubscriptionVersionType,
    "condition": object,
    "created_at": string,
    "transport": transport1 | transport2,
    "cost": number
};

export type eventsubSubscriptionsResponse = {
    "total": number,
    "data": Array<eventsubSubscriptionEntry>,
    "total_cost": number,
    "max_total_cost": number,
    "pagination": {} | { "cursor": string }
};