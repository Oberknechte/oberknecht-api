export declare const pollStatus: readonly ["TERMINATED", "ARCHIVED"];
export declare type pollStatusType = typeof pollStatus[number];
export declare const pollChoiceStatus: readonly ["ACTIVE", "COMPLETED", "TERMINATED", "ARCHIVED", "MODERATED", "INVALID"];
export declare type pollChoiceStatusType = typeof pollChoiceStatus[number];
export declare type choiceEntry = {
    title: string;
};
export declare type choices = Array<choiceEntry>;
export declare type pollEntry = {
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
export declare type pollResponseChoice = {
    id: string;
    title: string;
    votes: number;
    channel_points_votes: number;
    bits_votes: number;
};
export declare type endPollResponse = {
    data: Array<pollEntry>;
};
export declare type createPollResponse = {
    data: Array<pollEntry>;
};
export declare type getPollResponse = {
    data: Array<pollEntry>;
    pagination: {} | {
        cursor: string;
    };
};
