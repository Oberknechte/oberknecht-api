import { endPredictionStatusType } from "../types/endpoints/predictions";
export declare function endPrediction(sym: string, id: string, status: endPredictionStatusType, winningOutcomeID?: string, customtoken?: string): Promise<import("../types/endpoints/predictions").createPredictionResponse>;
