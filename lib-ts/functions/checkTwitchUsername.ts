import { i } from "..";

export function checkTwitchUsername(u) {
  return !i.regex.numregex().test(u) && i.regex.twitch.usernamereg().test(u);
}
