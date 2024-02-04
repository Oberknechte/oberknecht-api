import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { cleanChannelName, joinUrlQuery } from "oberknecht-utils";
import {
  chatSettingEntry,
  chatSettingKeyType,
  chatSettingsKeys,
  updateChatSettingsResponse,
} from "../types/endpoints/chatSettings";
import { checkTwitchUsername } from "../functions/checkTwitchUsername";
import { _getUser } from "./_getUser";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

const ignoredIfFalsy = {
  slow_mode: "slow_mode_wait_time",
  follower_mode: "follower_mode_duration",
  non_moderator_chat_delay: "non_moderator_chat_delay_duration",
};

const correctedSettings = {
  slow_mode_wait_time: {
    matches: [0, "0"],
    key: "slow_mode",
    value: false,
    skip: true,
  },
  // ↑ Sets key slow_mode to false if inputted wait_time is 0 and doesn't append key slow_mode_wait_time on request body
};

export async function updateChatSettings(
  sym: string,
  broadcasterID: string | undefined,
  settings: chatSettingEntry,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([settings], ["settings"]);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let moderatorID = userID;
  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (checkTwitchUsername(broadcasterID_))
    await _getUser(sym, broadcasterID_).then((u) => {
      broadcasterID_ = u.id;
    });

  let reqbody = {};

  Object.keys(settings).forEach((setting: chatSettingKeyType) => {
    let settingValue = settings[setting];
    if (
      reqbody[setting] ||
      !chatSettingsKeys.includes(setting) ||
      (Object.values(ignoredIfFalsy).includes(setting) &&
        settings[
          Object.keys(ignoredIfFalsy)[
            Object.values(ignoredIfFalsy).indexOf(setting)
          ]
        ] === false)
    )
      return;
    let correctedSetting = correctedSettings[setting];
    if (correctedSetting && correctedSetting.matches.includes(settingValue)) {
      reqbody[correctedSetting.key] = correctedSetting.value;
      if (correctedSetting.skip) return;
    }

    reqbody[setting] = settingValue;
  });

  return new Promise<updateChatSettingsResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "updateChatSettings")}${joinUrlQuery(
        ["broadcaster_id", "moderator_id"],
        [broadcasterID_, moderatorID],
        true
      )}`,
      {
        method: urls._method("twitch", "updateChatSettings"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify(reqbody),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "updateChatSettings"))
          return reject(Error(e.stack ?? r.data));

        return resolve(r.data);
      }
    );
  });
}
