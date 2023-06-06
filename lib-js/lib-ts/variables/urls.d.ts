export declare class urls {
    static twitch: {
        new (): {};
        _base: string;
        _headers: (sym: string, customtoken: any, customclientid: any) => {
            "Content-Type": string;
            Authorization: string;
        };
        whispers: {
            endpoint: string;
            method: string;
            code: number;
        };
        users: {
            endpoint: string;
        };
        streams: {
            endpoint: string;
        };
        shoutouts: {
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
        deletemessage: {
            endpoint: string;
            method: string;
            code: number;
        };
        announcement: {
            endpoint: string;
            method: string;
            code: number;
        };
        updatechatsettings: {
            endpoint: string;
            method: string;
        };
        getchatsettings: {
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
        updatecolor: {
            endpoint: string;
            method: string;
            code: number;
        };
        getcolor: {
            endpoint: string;
        };
        raid: {
            endpoint: string;
            method: string;
        };
        cancelraid: {
            endpoint: string;
            method: string;
            code: number;
        };
        channelfollowers: {
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
}
