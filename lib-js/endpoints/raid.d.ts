import { raidResponse } from "../types/endpoints/raid";
export declare function raid(sym: string, fromBroadcasterID: string | undefined, toBroadcasterID: string, customToken?: string): Promise<raidResponse>;
