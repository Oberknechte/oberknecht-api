export declare const userTypes: string[];
export declare type userTypesType = typeof userTypes[number];
export declare const broadcasterTypes: string[];
export declare type broadcasterTypesType = typeof broadcasterTypes[number];
export declare type loginsEntry = {
    [key: string]: string;
};
export declare type idsEntry = {
    [key: string]: string;
};
export declare type detailsEntry = {
    [key: string]: userEntry;
};
export declare type getUsersResolveType = {
    logins: loginsEntry;
    ids: idsEntry;
    details: detailsEntry;
    loginsInvalid: string[];
};
export declare type userEntry = {
    id: string;
    login: string;
    display_name: string;
    type: userTypesType;
    broadcaster_type: broadcasterTypesType;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email?: string;
    created_at: string;
    displayNameParsed: string;
    _lastUpdated: number;
};
export declare type getUsersResponse = {
    data: Array<userEntry>;
};
