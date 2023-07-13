export type oberknechtAPIOptionsType = {
  token?: string;
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
