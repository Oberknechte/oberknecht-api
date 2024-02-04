import { choices as choices_, createPollResponse } from "../types/endpoints/poll";
export declare function createPoll(sym: string, title: string, choices: choices_, duration: number, channelPointsVotingEnabled?: boolean, channelPointsPerVote?: number, broadcasterID?: undefined, customToken?: string): Promise<createPollResponse>;
