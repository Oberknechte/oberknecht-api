export type raidEntry = {
    "created_at": string,
    "is_mature": boolean
};

export type raidResponse = {
    "data": Array<raidEntry>
};