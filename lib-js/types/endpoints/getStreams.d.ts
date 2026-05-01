export type streamLanguagesType = string;
export declare const streamTypes: string[];
export type streamTypesType = typeof streamTypes[number];
export type getStreamsFiltersType = {
    user_id?: string[];
    user_login?: string[];
    game_id?: string[];
    type?: "all" | "live";
    language?: string[];
    first?: number;
    before?: string;
    after?: string;
};
export type streamEntry = {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: streamTypesType;
    title: string;
    tags: string[];
    viewer_count: number;
    started_at: string;
    language: streamLanguagesType;
    thumbnail_url: streamEntry;
    tag_ids: string[];
    is_mature: boolean;
};
export type getStreamsResponse = {
    data: Array<streamEntry>;
    pagination: {
        cursor: string;
    };
};
