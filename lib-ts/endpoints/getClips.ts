import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  cleanChannelName,
  convertToArray,
  joinUrlQuery,
  regex,
} from "oberknecht-utils";
import { getClipsResponse } from "../types/endpoints/getClips";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getClips(
  sym: string,
  broadcasterID?: string,
  ids?: string | string[],
  gameID?: string,
  startedAt?: string,
  endedAt?: string,
  first?: number,
  before?: string,
  after?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let ids_ = convertToArray(ids, false);

  ids_ = ids_.map((a) =>
    a.replace(
      /^(https?:\/\/)*(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\/(\w+\/clip\/)*/,
      ""
    )
  );

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  return new Promise<getClipsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getClips")}${joinUrlQuery(
        [
          "broadcaster_id",
          "game_id",
          "started_at",
          "ended_at",
          "first",
          "before",
          "after",
        ],
        [
          broadcasterID,
          gameID,
          startedAt,
          endedAt,
          first?.toString(),
          before,
          after,
        ],
        true
      )}${ids_.length === 0 ? "" : joinUrlQuery("id", ids_, false, false)}`,
      {
        method: urls._method("twitch", "getClips"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getClips"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
