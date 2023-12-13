export declare class urls {
    static twitch: {
        new (): {};
        _base: string;
        _headers: (sym: string, customtoken: any, customclientid: any) => {
            "Content-Type": string;
            Authorization: string;
        };
        revokeToken: {
            method: string;
        };
        whisper: {
            endpoint: string;
            method: string;
            code: number;
        };
        users: {
            endpoint: string;
        };
        getStreams: {
            endpoint: string;
        };
        shoutout: {
            endpoint: string;
            method: string;
            code: number;
        };
        bans: {
            endpoint: string;
            method: string;
        };
        unban: {
            endpoint: string;
            method: string;
            code: number;
        };
        deleteMessage: {
            endpoint: string;
            method: string;
            code: number;
        };
        announce: {
            endpoint: string;
            method: string;
            code: number;
        };
        updateChatSettings: {
            endpoint: string;
            method: string;
        };
        getChatSettings: {
            endpoint: string;
            method: string;
        };
        mod: {
            endpoint: string;
            method: string;
            code: number;
        };
        unmod: {
            endpoint: string;
            method: string;
            code: number;
        };
        vip: {
            endpoint: string;
            method: string;
            code: number;
        };
        unvip: {
            endpoint: string;
            method: string;
            code: number;
        };
        updateColor: {
            endpoint: string;
            method: string;
            code: number;
        };
        getColor: {
            endpoint: string;
        };
        raid: {
            endpoint: string;
            method: string;
        };
        cancelRaid: {
            endpoint: string;
            method: string;
            code: number;
        };
        channelFollowers: {
            endpoint: string;
        };
        eventsubSubscriptions: {
            endpoint: string;
            method: string;
            code: number;
        };
        getEventsubSubscriptions: {
            endpoint: string;
        };
        deleteEventsubSubscription: {
            endpoint: string;
            method: string;
        };
        getBroadcasterSubscriptions: {
            endpoint: string;
        };
        updateChannel: {
            endpoint: string;
            method: string;
            code: number;
        };
        getChannels: {
            endpoint: string;
        };
        getGames: {
            endpoint: string;
        };
        getPolls: {
            endpoint: string;
        };
        createPoll: {
            endpoint: string;
            method: string;
        };
        endPoll: {
            endpoint: string;
            method: string;
        };
        getPredictions: {
            endpoint: string;
        };
        createPrediction: {
            endpoint: string;
            method: string;
        };
        endPrediction: {
            endpoint: string;
            method: string;
        };
        getClips: {
            endpoint: string;
        };
        createClip: {
            endpoint: string;
            method: string;
            code: number;
        };
        getFollowedChannels: {
            endpoint: string;
        };
    };
    static ivrfitwitch: {
        new (): {};
        _base: string;
        users: {
            endpoint: string;
        };
    };
    static _: (...args: any) => any;
    static _url: (...args2: any) => any;
    static _code: (...args2: any) => any;
    static _method: (...args2: any) => any;
}
