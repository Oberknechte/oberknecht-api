export type colorEntry = {
    "user_id": string,
    "user_name": string,
    "user_login": string,
    "color": string
};

export type getColorResponse = {
    "data": Array<colorEntry>
}; 