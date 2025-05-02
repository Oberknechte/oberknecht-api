import { userEntry } from "./endpoints/_getUsers";
export declare type ids = Record<string, string>;
export declare type logins = Record<string, string>;
export declare type details = Record<string, userEntry>;
export declare type _getUsersResponse = {
    ids: ids;
    logins: logins;
    details: details;
    loginsInvalid: string[];
};
