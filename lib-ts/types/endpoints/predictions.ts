export const predictionStatus = [
  "ACTIVE",
  "CANCELED",
  "LOCKED",
  "RESOLVED",
] as const;
export type predictionStatusType = typeof predictionStatus[number];

export const endPredictionStatus = ["RESOLVED", "CANCELED", "LOCKED"] as const;
export type endPredictionStatusType = typeof endPredictionStatus[number];

export type predictionPredictorEntry = {
  user_id: string;
  user_name: string;
  user_login: string;
  channel_points_used: number;
  channel_points_won: number;
};

export type predictionOutcomeEntry = {
  id: string;
  title: string;
  users: number;
  channel_points: number;
  top_predictors: null | predictionPredictorEntry;
  color: "BLUE" | "PINK";
};

export type createPredictionOutcomeEntry = {
  title: string;
};

export type createPredictionOutcomesType = Array<createPredictionOutcomeEntry>;

export type predictionEntry = {
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

export type getPredictionResponse = {
  data: Array<predictionEntry>;
  pagination: {
    cursor?: string;
  };
};

export type createPredictionResponse = {
  data: Array<predictionEntry>;
};

export type endPredictionResponse = createPredictionResponse;
