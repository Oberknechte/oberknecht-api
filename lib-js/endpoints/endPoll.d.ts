import { pollStatusType, endPollResponse } from "../types/endpoints/poll";
export declare function endPoll(sym: string, id: string, status: pollStatusType, broadcasterID: undefined, customToken?: string): Promise<endPollResponse>;
