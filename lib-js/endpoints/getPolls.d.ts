import { getPollResponse } from "../types/endpoints/poll";
export declare function getPolls(sym: string, id?: string | string[], first?: number, after?: string, broadcasterID?: undefined, customToken?: string): Promise<getPollResponse>;
