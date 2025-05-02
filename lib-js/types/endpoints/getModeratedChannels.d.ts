export declare type moderatedChannelEntry = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
};
export declare type getModeratedChannelsResponse = {
    data: moderatedChannelEntry[];
    pagination: {
        cursor: string;
    };
};
