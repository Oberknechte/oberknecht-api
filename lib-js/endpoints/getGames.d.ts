import { getGamesResponse } from "../types/endpoints/getGames";
export declare function getGames(sym: string, ids?: string | string[], names?: string | string[], igdbIDs?: string | string[], customToken?: string): Promise<getGamesResponse>;
