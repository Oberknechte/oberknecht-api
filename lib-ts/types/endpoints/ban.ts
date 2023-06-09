export type banEntry = {
  broadcaster_id: string;
  moderator_id: string;
  user_id: string;
  created_at: string;
  end_time: string;
};

export type banResponse = {
  data: Array<banEntry>;
};
