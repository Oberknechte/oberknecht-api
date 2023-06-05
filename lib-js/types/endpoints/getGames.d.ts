export type gameEntry = {
    "id": string;
    "name": string;
    "box_art_url": string;
    "igdb_id": string;
};
export type getGamesResponse = {
    "data": Array<gameEntry>;
    "pagination": {
        "cursor": string;
    };
};
