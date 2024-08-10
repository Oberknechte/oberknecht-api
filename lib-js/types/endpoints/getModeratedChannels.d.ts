export type moderatedChannelEntry = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
};
export type getModeratedChannelsResponse = {
    data: moderatedChannelEntry[];
    pagination: {
        cursor: string;
    };
};
