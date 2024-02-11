import { isNullUndefined } from "oberknecht-utils";
import { i } from "..";

export function checkTwitchUsername(u) {
  return !isNullUndefined(u) && !i.regex.numregex().test(u) && i.regex.twitch.usernamereg().test(u);
}
