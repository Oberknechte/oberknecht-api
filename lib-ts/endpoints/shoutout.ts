import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { i } from "..";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function shoutout(
  sym: string,
  fromBroadcasterID: string,
  toBroadcasterID: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([toBroadcasterID], ["toBroadcasterID"]);

  let toBroadcasterID_ = cleanChannelName(toBroadcasterID);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let moderatorID = userID;
  let fromBroadcasterID_ = cleanChannelName(fromBroadcasterID) ?? userID;

  if (checkTwitchUsername(fromBroadcasterID_))
    await _getUser(sym, fromBroadcasterID_).then((u) => {
      fromBroadcasterID_ = u.id;
    });

  if (checkTwitchUsername(toBroadcasterID_))
    await _getUser(sym, toBroadcasterID_).then((u) => {
      toBroadcasterID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "shoutout")}${joinUrlQuery(
        ["moderator_id", "from_broadcaster_id", "to_broadcaster_id"],
        [moderatorID, fromBroadcasterID_, toBroadcasterID_],
        true
      )}`,
      {
        method: urls._method("twitch", "shoutout"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "shoutout"))
          return reject(Error(e.stack ?? r.data));

        return resolve();
      }
    );
  });
}
