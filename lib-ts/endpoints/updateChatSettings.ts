import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { _getuser } from "../operations/_getuser";
import { _validatetoken } from "./_validatetoken";
import { i } from "..";
import { cleanChannelName } from "oberknecht-utils";
import {
  chatSettingEntry,
  chatSettingKeyType,
  chatSettingsKeys,
  updateChatSettingsResponse,
} from "../types/endpoints/chatSettings";

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
  broadcaster_id: string | undefined,
  settings: chatSettingEntry,
  customtoken?: string
) {
  return new Promise<updateChatSettingsResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error(`sym and customtoken are undefined`));
    if (!(broadcaster_id ?? undefined) || !(settings ?? undefined))
      return reject(Error(`broadcaster_id and/or settings is undefined`));

    let clientid = i.apiclientData[sym]?._options?.clientid;
    let moderator_id = i.apiclientData[sym]?._options?.userid;
    let broadcaster_id_ = cleanChannelName(broadcaster_id);

    if (customtoken ?? undefined) {
      await _validatetoken(undefined, customtoken)
        .then((a) => {
          moderator_id = a.user_id;
          clientid = a.client_id;
          if (!broadcaster_id_) broadcaster_id_ = a.user_id;
        })
        .catch(reject);
    }

    if (
      !i.regex.numregex().test(broadcaster_id_) &&
      i.regex.twitch.usernamereg().test(broadcaster_id_)
    ) {
      await _getuser(sym, broadcaster_id_)
        .then((u) => {
          broadcaster_id_ = u[1];
        })
        .catch(reject);
    }

    broadcaster_id_ = broadcaster_id_ ?? i.apiclientData[sym]?._options?.userid;

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

    request(
      `${urls._url(
        "twitch",
        "updateChatSettings"
      )}?broadcaster_id=${broadcaster_id_}&moderator_id=${moderator_id}`,
      {
        method: urls._method("twitch", "createPrediction"),
        headers: urls.twitch._headers(sym, customtoken, clientid),
        body: JSON.stringify(reqbody),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "updateChatSettings"))
          return reject(Error(e ?? r.data));

        
        return resolve(r.data);
      }
    );
  });
}
