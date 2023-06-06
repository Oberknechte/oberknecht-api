export declare const eventsubSubscriptionStatus: readonly ["enabled", "webhook_callback_verification_pending", "webhook_callback_verification_failed", "notification_failures_exceeded", "authorization_revoked", "moderator_removed", "user_removed", "version_removed", "websocket_disconnected", "websocket_failed_ping_pong", "websocket_received_inbound_traffic", "websocket_connection_unused", "websocket_internal_error", "websocket_network_timeout", "websocket_network_error"];
export type eventsubSubscriptionStatusType = typeof eventsubSubscriptionStatus[number];
export declare const eventsubSubscriptionTransportMethods: readonly ["webhook", "websocket"];
export type eventsubSubscriptionTransportMethodType = typeof eventsubSubscriptionTransportMethods[number];
export declare const eventsubSubscriptionTypes: readonly ["channel.update", "channel.follow", "channel.subscribe", "channel.subscription.end", "channel.subscription.gift", "channel.subscription.message", "channel.cheer", "channel.raid", "channel.ban", "channel.unban", "channel.moderator.add", "channel.moderator.remove", "channel.guest_star_session.begin", "channel.guest_star_session.end", "channel.guest_star_guest.update", "channel.guest_star_slot.update", "channel.guest_star_settings.update", "channel.channel_points_custom_reward.add", "channel.channel_points_custom_reward.update", "channel.channel_points_custom_reward.remove", "channel.channel_points_custom_reward_redemption.add", "channel.channel_points_custom_reward_redemption.update", "channel.poll.begin", "channel.poll.progress", "channel.poll.end", "channel.prediction.begin", "channel.prediction.progress", "channel.prediction.lock", "channel.prediction.end", "channel.charity_campaign.donate", "channel.charity_campaign.start", "channel.charity_campaign.progress", "channel.charity_campaign.stop", "drop.entitlement.grant", "extension.bits_transaction.create", "channel.goal.begin", "channel.goal.progress", "channel.goal.end", "channel.hype_train.begin", "channel.hype_train.progress", "channel.hype_train.end", "channel.shield_mode.begin", "channel.shield_mode.end", "channel.shoutout.create", "channel.shoutout.receive", "stream.online", "stream.offline", "user.authorization.grant", "user.authorization.revoke", "user.update"];
export type eventsubSubscriptionTypesType = typeof eventsubSubscriptionTypes[number];
export declare const eventsubSubscriptionVersions: readonly ["1", "2", "beta"];
export type eventsubSubscriptionVersionType = typeof eventsubSubscriptionVersions[number];
export type eventsubSubscriptionEntry = {
    "id": string;
    "status": eventsubSubscriptionStatusType;
    "type": eventsubSubscriptionTypesType;
    "version": eventsubSubscriptionVersionType;
    "condition": object;
    "created_at": string;
    "transport": {
        "method": eventsubSubscriptionTransportMethodType;
    };
    "cost": number;
};
export type getEventsubSubscriptionsResponse = {
    "total": number;
    "data": Array<eventsubSubscriptionEntry>;
    "total_cost": number;
    "max_total_cost": number;
    "pagination": object;
};
export type addEventsubSubscription = getEventsubSubscriptionsResponse;
