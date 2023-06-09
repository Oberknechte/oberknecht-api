import { getPredictionResponse } from "../types/endpoints/predictions";
export declare function getPredictions(sym: string, ids?: string | string[], first?: number, after?: string, customtoken?: string): Promise<getPredictionResponse>;
