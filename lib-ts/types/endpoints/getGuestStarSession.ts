export type guestStarEntry = {
  slot_id: string;
  user_id: string;
  user_display_name: string;
  user_login: string;
  is_live: boolean;
  volume: number;
  assigned_at: string;
  audio_settings: {
    is_available: boolean;
    is_host_enabled: boolean;
    is_guest_enabled: boolean;
  };
  video_settings: {
    is_available: boolean;
    is_host_enabled: boolean;
    is_guest_enabled: boolean;
  };
};

export type getGuestStarSessionResponse = {
  data: [
    {
      id: string;
      guests: guestStarEntry[];
    }
  ];
};
