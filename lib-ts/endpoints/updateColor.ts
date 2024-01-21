import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { colorsType } from "../types/endpoints/color";

export async function updateColor(
  sym: string,
  color: colorsType,
  customtoken?: string
) {
  return new Promise<void>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(color ?? undefined)) return reject(Error(`color is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let userid = i.apiclientData[sym]?._options?.userid;

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          clientid = a.client_id;
          userid = a.user_id;
        })
        .catch(reject);
    }

    request(
      `${urls._url("twitch", "updateColor")}?user_id=${userid}&color=${color}`,
      {
        method: urls._method("twitch", "updateColor"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "updateColor"))
          return reject(Error(e.stack ?? r.data));

        return resolve();
      }
    );
  });
}
