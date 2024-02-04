import { jsonsplitteroptions } from "oberknecht-jsonsplitter/lib-ts/types/jsonsplitter.options";
declare type clientIDType = string;
declare type clientSecretType = string;
export declare type oberknechtAPIOptionsType = {
    token?: string;
    refreshToken?: string;
    clientSecrets?: clientSecretType | Record<clientIDType, clientSecretType>;
    debug?: number;
    startPath?: string;
    saveIDs?: boolean;
    noSaveTokens?: boolean;
    autoRefreshRefreshTokens?: boolean;
    tokenSplitterOptions?: jsonsplitteroptions;
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
export {};
