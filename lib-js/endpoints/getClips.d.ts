import { getClipsResponse } from "../types/endpoints/getClips";
export declare function getClips(sym: string, broadcaster_id?: string, ids?: string | string[], gameID?: string, startedAt?: string, endedAt?: string, first?: number, before?: string, after?: string, customtoken?: string): Promise<getClipsResponse>;
