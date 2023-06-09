import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import { _validatetoken } from "./_validatetoken";
import { joinUrlQuery } from "oberknecht-utils";

export async function deleteEventsubSubscription(
  sym: string,
  id: string,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(id ?? undefined)) return reject(Error(`id is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;

    if (customtoken ?? undefined) {
      await _validatetoken(sym, customtoken)
        .then((a) => {
          clientid = a.client_id;
        })
        .catch();
    }

    request(
      `${urls._url("twitch", "deleteEventsubSubscription")}${joinUrlQuery(
        "id",
        id,
        true
      )}`,
      {
        method: urls._method("twitch", "deleteEventsubSubscription"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (
          e ||
          r.statusCode !== urls._code("twitch", "deleteEventsubSubscription")
        )
          return reject(Error(e ?? r.body));

        return resolve();
      }
    );
  });
}
