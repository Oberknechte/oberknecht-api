export declare const scopes: string[];
export type scopesType = typeof scopes[number];
export type validateTokenResponse = {
    "client_id": string;
    "login": string;
    "scopes": scopesType;
    "user_id": string;
    "expires_in": number;
};
