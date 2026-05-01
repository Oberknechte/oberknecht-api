export type channelModeratorEntry = {
    user_id: string;
    user_name: string;
    user_login: string;
};
export type channelModeratorsResponse = {
    total: number;
    data: Array<channelModeratorEntry>;
    pagination: {
        cursor: string;
    };
};
