import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { i } from "..";
import { cleanChannelName, joinUrlQuery, recreate } from "oberknecht-utils";
import { getGames } from "./getGames";
import { channelData } from "../types/endpoints/updateChannel";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function updateChannel(
  sym: string,
  channelData: channelData,
  broadcasterID: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams([channelData], ["channelData"]);

  let channelData_ = recreate(channelData);

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  if (channelData.game_id && !i.regex.numregex().test(channelData.game_id))
    await getGames(sym, [], channelData.game_id).then((dat) => {
      if (dat.data?.[0]?.id) channelData_.game_id = dat.data[0]?.id;
    });

  return new Promise<void>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "updateChannel")}${joinUrlQuery(
        ["broadcaster_id"],
        [broadcasterID_],
        true
      )}`,
      {
        method: urls._method("twitch", "updateChannel"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify(channelData_),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "updateChannel"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve();
      }
    );
  });
}
