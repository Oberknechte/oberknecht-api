import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { pollStatusType, endPollResponse } from "../types/endpoints/poll";
import { validateTokenBR } from "../functions/validateTokenBR";
import { cleanChannelName } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function endPoll(
  sym: string,
  id: string,
  status: pollStatusType,
  broadcasterID: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([id, status], ["id", "status"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  return new Promise<endPollResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "endPoll")}`,
      {
        method: urls._method("twitch", "endPoll"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          broadcaster_id: broadcasterID_,
          id: id,
          status: status,
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "endPoll"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
