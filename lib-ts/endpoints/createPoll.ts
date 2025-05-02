import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import {
  choices as choices_,
  createPollResponse,
} from "../types/endpoints/poll";
import { validateTokenBR } from "../functions/validateTokenBR";
import { cleanChannelName, isNullUndefined } from "oberknecht-utils";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function createPoll(
  sym: string,
  title: string,
  choices: choices_ /* Min. 2, Max. 5 */,
  duration: number /* in Seconds, Min. 15, Max 1800 */,
  channelPointsVotingEnabled?: boolean,
  channelPointsPerVote?: number,
  broadcasterID?: undefined,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);
  checkThrowMissingParams(
    [title, choices, duration],
    ["title", "choices", "duration"]
  );

  let { clientID, accessToken, userID } = await validateTokenBR(
    sym,
    customToken
  );

  let broadcasterID_ = cleanChannelName(broadcasterID) ?? userID;

  return new Promise<createPollResponse>(async (resolve, reject) => {
    request(
      `${urls._url("twitch", "createPoll")}`,
      {
        method: urls._method("twitch", "createPoll"),
        headers: urls.twitch._headers(sym, accessToken, clientID),
        body: JSON.stringify({
          broadcaster_id: broadcasterID_,
          title: title,
          choices: choices,
          duration: duration,
          ...(!isNullUndefined(channelPointsVotingEnabled)
            ? { channel_points_voting_enabled: channelPointsVotingEnabled }
            : {}),
          ...(!isNullUndefined(channelPointsPerVote)
            ? { channel_points_per_vote: channelPointsPerVote }
            : {}),
        }),
      },
      (e, r) => {
        if (e || r.status !== urls._code("twitch", "createPoll"))
          return reject(Error(e?.stack ?? r?.data));

        return resolve(r.data);
      }
    );
  });
}
