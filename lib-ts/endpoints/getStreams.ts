import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery, recreate } from "oberknecht-utils";
import { getStreamsFiltersType } from "../types/endpoints/getStreams";
import { getStreamsResponse } from "../types/endpoints/getStreams";

export async function getStreams(
  sym: string,
  filters?: getStreamsFiltersType,
  customtoken?: string
) {
  return new Promise<getStreamsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let filters_: getStreamsFiltersType = recreate(filters ?? {});

    if (customtoken ?? undefined) {
      await _validatetoken(sym, customtoken)
        .then((a) => {
          clientid = a.client_id;
        })
        .catch();
    }

    let reqqueryparams = "";
    Object.keys(filters_)?.forEach((filter) => {
      reqqueryparams += joinUrlQuery(
        filter,
        filters_[filter],
        reqqueryparams.length === 0 ? true : false
      );
    });

    request(
      `${urls._url("twitch", "getStreams")}${reqqueryparams}`,
      {
        method: urls._method("twitch", "getStreams"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.statusCode !== urls._code("twitch", "getStreams"))
          return reject(Error(e ?? r.body));

        let dat = JSON.parse(r.body);

        if (i.apiclientData[sym]?._options?.saveIDs) {
          dat.data.forEach(async (a) => {
            await i.apiclientData[sym].jsonsplitters.users.addKey(
              ["logins", a.user_login],
              a.user_id
            );
            await i.apiclientData[sym].jsonsplitters.users.addKey(
              ["ids", a.user_id],
              a.user_login
            );
          });
        }

        return resolve(dat);
      }
    );
  });
}
