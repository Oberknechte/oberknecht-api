export declare const scopes: string[];
export declare type scopesType = typeof scopes[number];
export declare type validateTokenResponseOld = {
    client_id: string;
    login: string;
    scopes: scopesType[];
    user_id: string;
    expires_in: number;
    expiresAt: number;
};
export declare type validateTokenResponse = {
    clientID: string;
    userLogin: string;
    scopes: scopesType[];
    userID: string;
    expiresAt: number;
};
