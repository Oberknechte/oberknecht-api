import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  choices as choices_,
  createPollResponse,
} from "../types/endpoints/poll";
import { validateTokenBR } from "../functions/validateTokenBR";
import {
  cleanChannelName,
  isNullUndefined,
  joinUrlQuery,
} from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";
import { getGuestStarSession } from "./getGuestStarSession";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";

export async function sendGuestStarInvite(
  sym: string,
  guestID: string,
  sessionID?: string,
  broadcasterID?: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([guestID], ["guestID"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  let sessionID_ = sessionID;

  if (!sessionID_)
    await getGuestStarSession(sym, broadcasterID_, customToken).then((r) => {
      sessionID_ = r.data[0].id;
    });

  let guestID_ = guestID;
  if (checkTwitchUsername(guestID_))
    await _getUser(sym, guestID_).then((u) => {
      guestID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "sendGuestStarInvite")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id", "session_id", "guest_id"],
        [broadcasterID_, userID, sessionID_, guestID_],
        true
      )}`,
      {
        method: urls._method("twitch", "sendGuestStarInvite"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "sendGuestStarInvite"))
          return reject(Error(JSON.stringify(e?.stack ?? r?.data ?? e)));

        return resolve();
      }
    );
  });
}
