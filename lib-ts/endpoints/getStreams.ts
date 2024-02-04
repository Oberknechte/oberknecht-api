import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { joinUrlQuery, recreate } from "oberknecht-utils";
import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { getStreamsResponse } from "../types/endpoints/getStreams";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getStreams(
  sym: string,
  filters?: getStreamsFiltersType,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let filters_: getStreamsFiltersType = recreate(filters ?? {});

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let reqqueryparams = "";
  Object.keys(filters_)?.forEach((filter) => {
    reqqueryparams += joinUrlQuery(
      filter,
      filters_[filter],
      reqqueryparams.length === 0 ? true : false
    );
  });

  return new Promise<getStreamsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getStreams")}${reqqueryparams}`,
      {
        method: urls._method("twitch", "getStreams"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getStreams"))
          return reject(Error(e.stack ?? r.data));

        if (i.apiclientData[sym]?._options?.saveIDs) {
          r.data.data.forEach(async (a) => {
            i.apiclientData[sym].jsonsplitters.users.addKeySync(
              ["logins", a.user_login],
              a.user_id
            );
            i.apiclientData[sym].jsonsplitters.users.addKeySync(
              ["ids", a.user_id],
              a.user_login
            );
          });
        }

        return resolve(r.data);
      }
    );
  });
}
