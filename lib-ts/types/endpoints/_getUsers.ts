export const userTypes = ["", "staff"];
export type userTypesType = typeof userTypes[number];
export const broadcasterTypes = ["", "affiliate", "partner"];
export type broadcasterTypesType = typeof broadcasterTypes[number];

export type loginsEntry = { [key: string]: string };
export type idsEntry = { [key: string]: string };

export type detailsEntry = { [key: string]: userEntry };

export type getUsersResolveType = {
    logins: loginsEntry,
    ids: idsEntry,
    details: detailsEntry,
    loginsInvalid: string[]
};

export type userEntry = {
    "id": string,
    "login": string,
    "display_name": string,
    "type": userTypesType,
    "broadcaster_type": broadcasterTypesType,
    "description": string,
    "profile_image_url": string,
    "offline_image_url": string,
    "view_count": number,
    "email": string,
    "created_at": string,
    "displayNameParsed": string,
    "_lastUpdated": number
};

export type getUsersResponse = {
    "data": Array<userEntry>
};