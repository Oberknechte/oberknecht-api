export const oberknechtAPIOptions = {
  debug: Number(),
  token: String(),
  startPath: String() ?? "package path",
  saveIDs: Boolean(),
  // starting at project dir (process.cwd())
  saveIDsPath: String(),
  filechange_interval: Number() ?? 10000,
  skipCreation: Boolean(),
  // ivr.fi
  use3rdparty: {
    getUsers: Boolean(),
  },
  maxcacheage: {
    getUsers: Number(),
  },
};

export type oberknechtAPIOptionsType = {
  token: string;
  debug?: number;
  startPath?: string;
  saveIDs?: boolean;
  // starting at project dir (process.cwd())
  saveIDsPath?: string;
  filechange_interval?: number;
  skipCreation?: boolean;
  // ivr.fi
  use3rdparty?: {
    getUsers?: boolean;
  };
  maxcacheage?: {
    getUsers?: number;
  };
};
