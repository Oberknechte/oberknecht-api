import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { raidResponse } from "../types/endpoints/raid";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function raid(
  sym: string,
  fromBroadcasterID: string | undefined,
  toBroadcasterID: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams(
    [fromBroadcasterID, toBroadcasterID],
    ["fromBroadcasterID", "toBroadcasterID"]
  );

  let toBroadcasterID_ = cleanChannelName(toBroadcasterID);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let fromBroadcasterID_ = cleanChannelName(fromBroadcasterID) ?? userID;

  if (checkTwitchUsername(fromBroadcasterID_))
    await _getUser(sym, fromBroadcasterID_).then((u) => {
      fromBroadcasterID_ = u.id;
    });

  if (checkTwitchUsername(toBroadcasterID_))
    await _getUser(sym, toBroadcasterID_).then((u) => {
      toBroadcasterID_ = u.id;
    });

  return new Promise<raidResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "raid")}${joinUrlQuery(
        ["from_broadcaster_id", "to_broadcaster_id"],
        [fromBroadcasterID_, toBroadcasterID_],
        true
      )}`,
      {
        method: urls._method("twitch", "raid"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "raid"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
