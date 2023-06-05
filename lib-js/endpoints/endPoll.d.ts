import { pollStatusType, endPollResponse } from "../types/endpoints/poll";
export declare function endPoll(sym: string, id: string, status: pollStatusType, customtoken?: string): Promise<endPollResponse>;
