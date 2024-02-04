import { createPredictionOutcomesType, createPredictionResponse } from "../types/endpoints/predictions";
export declare function createPrediction(sym: string, title: string, outcomes: createPredictionOutcomesType, predictionWindow?: number, 
/** @default predictionWindow 60 */
broadcasterID?: undefined, customToken?: string): Promise<createPredictionResponse>;
