import { userEntry } from "./endpoints/_getUsers";

export type ids = Record<string, string>;
export type logins = Record<string, string>;
export type details = Record<string, userEntry>;

export type _getUsersResponse = {
    "ids": ids,
    "logins": logins,
    "details": details,
    "loginsInvalid": string[]
};