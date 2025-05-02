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

export async function deleteGuestStarSlot(
  sym: string,
  guestID: string,
  shouldReinvite: boolean = false,
  slotID?: string,
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

  let sessionID_ = sessionID;

  let guestID_ = guestID;
  if (checkTwitchUsername(guestID_))
    await _getUser(sym, guestID_).then((u) => {
      guestID_ = u.id;
    });

  let slotID_ = slotID;

  if (!sessionID_ || !slotID_)
    await getGuestStarSession(sym, broadcasterID_, customToken).then((r) => {
      sessionID_ = r.data[0].id;
      slotID_ = r.data[0].guests.filter(
        (a) => a.user_id.toString() === guestID_.toString()
      )[0].slot_id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "deleteGuestStarSlot")}${joinUrlQuery(
        [
          "broadcaster_id",
          "moderator_id",
          "session_id",
          "guest_id",
          "slot_id",
          "should_reinvite_guest",
        ],
        [
          broadcasterID_,
          userID,
          sessionID_,
          guestID_,
          slotID_,
          shouldReinvite ? "true" : "false",
        ],
        true
      )}`,
      {
        method: urls._method("twitch", "deleteGuestStarSlot"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "deleteGuestStarSlot"))
          return reject(Error(JSON.stringify(e?.stack ?? r?.data ?? e)));

        return resolve();
      }
    );
  });
}
