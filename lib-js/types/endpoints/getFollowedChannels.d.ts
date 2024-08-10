export type followedChannelEntry = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    followed_at: string;
};
export type getFollowedChannelsResponse = {
    total: number;
    data: followedChannelEntry[];
    pagination: {} | {
        cursor: string;
    };
};
