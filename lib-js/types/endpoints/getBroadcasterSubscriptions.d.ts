import { subscriptionTiersType } from "./subscription.tier";
export type getBroadcasterSubscriptionEntry = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    gifter_id: string;
    gifter_login: string;
    gifter_name: string;
    is_gift: boolean;
    tier: subscriptionTiersType;
    plan_name: string;
    user_id: string;
    user_name: string;
    user_login: string;
};
export type getBroadcasterSubscriptionsResponse = {
    data: Array<getBroadcasterSubscriptionEntry>;
    pagination: {
        cursor: string;
    };
    total: number;
    points: number;
};
