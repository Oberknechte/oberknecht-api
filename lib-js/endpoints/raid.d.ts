import { raidResponse } from "../types/endpoints/raid";
export declare function raid(sym: string, from_broadcaster_id: string | undefined, to_broadcaster_id: string, customtoken?: string): Promise<raidResponse>;
