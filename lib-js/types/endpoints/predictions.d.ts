export declare const predictionStatus: readonly ["ACTIVE", "CANCELED", "LOCKED", "RESOLVED"];
export declare type predictionStatusType = typeof predictionStatus[number];
export declare const endPredictionStatus: readonly ["RESOLVED", "CANCELED", "LOCKED"];
export declare type endPredictionStatusType = typeof endPredictionStatus[number];
export declare type predictionPredictorEntry = {
    user_id: string;
    user_name: string;
    user_login: string;
    channel_points_used: number;
    channel_points_won: number;
};
export declare type predictionOutcomeEntry = {
    id: string;
    title: string;
    users: number;
    channel_points: number;
    top_predictors: null | predictionPredictorEntry;
    color: "BLUE" | "PINK";
};
export declare type createPredictionOutcomeEntry = {
    title: string;
};
export declare type createPredictionOutcomesType = Array<createPredictionOutcomeEntry>;
export declare type predictionEntry = {
    id: string;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    title: string;
    winning_outcome_id: null | string;
    outcomes: Array<predictionOutcomeEntry>;
    prediction_window: number;
    status: predictionStatusType;
    created_at: string;
    ended_at: null | string;
    locked_at: null | string;
};
export declare type getPredictionResponse = {
    data: Array<predictionEntry>;
    pagination: {
        cursor?: string;
    };
};
export declare type createPredictionResponse = {
    data: Array<predictionEntry>;
};
export declare type endPredictionResponse = createPredictionResponse;
