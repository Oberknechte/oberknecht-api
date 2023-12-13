export declare const scopes: string[];
export declare type scopesType = typeof scopes[number];
export declare type validateTokenResponse = {
    client_id: string;
    login: string;
    scopes: scopesType;
    user_id: string;
    expires_in: number;
};
