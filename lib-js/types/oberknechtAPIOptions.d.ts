export type oberknechtAPIOptionsType = {
    token?: string;
    debug?: number;
    startPath?: string;
    saveIDs?: boolean;
    saveIDsPath?: string;
    filechange_interval?: number;
    skipCreation?: boolean;
    use3rdparty?: {
        getUsers?: boolean;
    };
    maxcacheage?: {
        getUsers?: number;
    };
};
