import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function whisper(
  sym: string,
  toUserID: string,
  message: string,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([toUserID, message], ["toUserID", "message"]);

  let toUserID_ = cleanChannelName(toUserID);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let fromUserID_ = userID;

  if (checkTwitchUsername(toUserID_))
    await _getUser(sym, toUserID_).then((u) => {
      toUserID_ = u.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "whisper")}${joinUrlQuery(
        ["from_user_id", "to_user_id"],
        [fromUserID_, toUserID_],
        true
      )}`,
      {
        method: urls._method("twitch", "whisper"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          message: message,
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "whisper"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
