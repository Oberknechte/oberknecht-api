export declare type channelFollowerEntry = {
    user_id: string;
    user_name: string;
    user_login: string;
    followed_at: string;
};
export declare type channelFollowersResponse = {
    total: number;
    data: Array<channelFollowerEntry>;
    pagination: {
        cursor: string;
    };
};
