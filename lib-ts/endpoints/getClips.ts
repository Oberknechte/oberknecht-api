import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { convertToArray, joinUrlQuery, regex } from "oberknecht-utils";
import { _getuser } from "../operations/_getuser";
import { getClipsResponse } from "../types/endpoints/getClips";

export async function getClips(
  sym: string,
  broadcaster_id?: string,
  ids?: string | string[],
  gameID?: string,
  startedAt?: string,
  endedAt?: string,
  first?: number,
  before?: string,
  after?: string,
  customtoken?: string
) {
  return new Promise<getClipsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let broadcaster_id_ =
      broadcaster_id ?? i.apiclientData[sym]?._options?.userid;
    let ids_ = convertToArray(ids, false);

    ids_ = ids_.map((a) =>
      a.replace(
        /^(https?:\/\/)*(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b\/(\w+\/clip\/)*/,
        ""
      )
    );

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
        })
        .catch(reject);
    }

    if (!regex.numregex().test(broadcaster_id_)) {
      await _getuser(sym, broadcaster_id_).then((u) => {
        broadcaster_id_ = u[1];
      });
    }

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
          broadcaster_id,
          gameID,
          startedAt,
          endedAt,
          first?.toString(),
          before,
          after,
        ],
        true,
        false
      )}${ids_.length === 0 ? "" : joinUrlQuery("id", ids_, false, false)}`,
      {
        method: urls._method("twitch", "getClips"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "getClips"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);
        return resolve(dat);
      }
    );
  });
}
