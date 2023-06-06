import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { getStreamsResponse } from "../types/endpoints/getStreams";
export declare function getStreams(sym: string, filters?: getStreamsFiltersType, customtoken?: string): Promise<getStreamsResponse>;
