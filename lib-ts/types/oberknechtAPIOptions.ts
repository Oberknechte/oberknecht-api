import { jsonsplitteroptions } from "oberknecht-jsonsplitter/lib-ts/types/jsonsplitter.options";

type clientIDType = string;
type clientSecretType = string;

export type oberknechtAPIOptionsType = {
  token?: string;
  refreshToken?: string;
  clientSecrets?: clientSecretType | Record<clientIDType, clientSecretType>;
  debug?: number;
  startPath?: string;
  // starting at project dir (process.cwd())
  saveIDs?: boolean;
  noSaveTokens?: boolean;
  autoRefreshRefreshTokens?: boolean;
  tokenSplitterOptions?: jsonsplitteroptions;
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
