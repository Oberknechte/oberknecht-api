export declare const oberknechtAPIOptions: {
    debug: number;
    token: string;
    startPath: string;
    saveIDs: boolean;
    saveIDsPath: string;
    filechange_interval: number;
    use3rdparty: {
        getUsers: boolean;
    };
    maxcacheage: {
        getUsers: number;
    };
};
export type oberknechtAPIOptionsType = {
    token: string;
    debug?: number;
    startPath?: string;
    saveIDs?: boolean;
    saveIDsPath?: string;
    filechange_interval?: number;
    use3rdparty?: {
        getUsers?: boolean;
    };
    maxcacheage?: {
        getUsers?: number;
    };
};
