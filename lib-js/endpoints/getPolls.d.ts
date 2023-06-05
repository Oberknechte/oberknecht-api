import { getPollResponse } from "../types/endpoints/poll";
export declare function getPolls(sym: string, id?: string, first?: string, after?: string, customtoken?: string): Promise<getPollResponse>;
