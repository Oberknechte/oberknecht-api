import { request } from "oberknecht-request";
import { i } from "..";
import { urls } from "../variables/urls";
import {
  cleanChannelName,
  convertToArray,
  joinUrlQuery,
} from "oberknecht-utils";
import { getColorResponse } from "../types/endpoints/color";
import { _getUsers } from "./_getUsers";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getColor(
  sym: string,
  userID: string | string[],
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let userID_ = convertToArray(userID, false).map((a) => cleanChannelName(a));
  let userLogins_ = userID_.filter(
    (a) => !i.regex.numregex().test(a) && i.regex.twitch.usernamereg().test(a)
  );
  userID_ = userID_.filter((a) => i.regex.numregex().test(a));

  let { clientID, accessToken, userID: _userID } = await validateTokenBR(
    sym,
    customToken
  );

  if (userLogins_.length > 0) {
    await _getUsers(sym, userLogins_).then((u) => {
      userID_.push(...Object.keys(u.ids));
    });
  }

  if (userID_.length === 0) userID_.push(_userID);

  return new Promise<getColorResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "getColor")}${joinUrlQuery(
        "user_id",
        userID_,
        true
      )}`,
      {
        method: urls._method("twitch", "getColor"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "getColor"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
