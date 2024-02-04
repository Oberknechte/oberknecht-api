import { getClipsResponse } from "../types/endpoints/getClips";
export declare function getClips(sym: string, broadcasterID?: string, ids?: string | string[], gameID?: string, startedAt?: string, endedAt?: string, first?: number, before?: string, after?: string, customToken?: string): Promise<getClipsResponse>;
