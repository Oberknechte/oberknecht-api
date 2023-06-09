export const pollStatus = ["TERMINATED", "ARCHIVED"] as const;
export type pollStatusType = typeof pollStatus[number];

export const pollChoiceStatus = [
  "ACTIVE",
  "COMPLETED",
  "TERMINATED",
  "ARCHIVED",
  "MODERATED",
  "INVALID",
] as const;
export type pollChoiceStatusType = typeof pollChoiceStatus[number];

export type choiceEntry = {
  title: string;
  // ↑ Max. 25 chars
};

export type choices = Array<choiceEntry>;

export type pollEntry = {
  id: string;
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  title: string;
  choices: Array<choiceEntry>;
  bits_voting_enabled: boolean;
  bits_per_vote: Number;
  channel_points_voting_enabled: boolean;
  channel_points_per_vote: number;
  status: pollChoiceStatusType;
  duration: number;
  started_at: string;
};

export type pollResponseChoice = {
  id: string;
  title: string;
  votes: number;
  channel_points_votes: number;
  bits_votes: number;
};

export type endPollResponse = {
  data: Array<pollEntry>;
};

export type createPollResponse = {
  data: Array<pollEntry>;
};

export type getPollResponse = {
  data: Array<pollEntry>;
  pagination: {} | { cursor: string };
};
