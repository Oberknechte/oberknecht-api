export declare const colors: readonly ["blue", "blue_violet", "cadet_blue", "chocolate", "coral", "dodger_blue", "firebrick", "golden_rod", "green", "hot_pink", "orange_red", "red", "sea_green", "spring_green", "yellow_green"];
export type colorsType = typeof colors[number] | string;
export type colorEntry = {
    "user_id": string;
    "user_name": string;
    "user_login": string;
    "color": string;
};
export type getColorResponse = {
    "data": Array<colorEntry>;
};
