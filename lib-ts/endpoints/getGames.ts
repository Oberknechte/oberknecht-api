import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { convertToArray, joinUrlQuery } from "oberknecht-utils";
import { getGamesResponse } from "../types/endpoints/getGames";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getGames(
  sym: string,
  ids?: string | string[],
  names?: string | string[],
  igdbIDs?: string | string[],
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([ids, names, igdbIDs], ["ids", "names", "igdbIDs"]);

  let ids_ = convertToArray(ids, false);
  let names_ = convertToArray(names, false);
  let igdbIDs_ = convertToArray(igdbIDs, false);

  names_.push(...ids_.filter((a) => !i.regex.numregex().test(a)));
  ids_ = ids_.filter((a) => i.regex.numregex().test(a));

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  return new Promise<getGamesResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getGames")}${joinUrlQuery(
        ["id", "name", "igdb_id"],
        [ids_, names_.map((a) => encodeURI(a)), igdbIDs_],
        true
      )}`,
      {
        method: urls._method("twitch", "getGames"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getGames"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
