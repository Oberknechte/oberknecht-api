export declare type gameEntry = {
    id: string;
    name: string;
    box_art_url: string;
    igdb_id: string;
};
export declare type getGamesResponse = {
    data: Array<gameEntry>;
    pagination: {
        cursor: string;
    };
};
