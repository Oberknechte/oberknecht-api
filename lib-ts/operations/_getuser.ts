import { i } from "..";
import { _getUsers } from "../endpoints/_getUsers";

export async function _getuser(sym: string, user: string) {
  return new Promise<[string, string, Object]>((resolve, reject) => {
    if (!(sym ?? undefined) || !(user ?? undefined))
      return reject(Error("no sym or users defined"));
    if (!i.apiclientData[sym].cache) i.apiclientData[sym].cache = {};
    if (!i.apiclientData[sym].cache.twitch)
      i.apiclientData[sym].cache.twitch = {};
    if (!i.apiclientData[sym].cache.twitch.userids)
      i.apiclientData[sym].cache.twitch.userids = { logins: {}, ids: {} };

    // let clientDataCacheTwitchUserids =
    //   i.apiclientData[sym].cache.twitch.userids;
    // if (clientDataCacheTwitchUserids.logins[user]) {
    //   return resolve(clientDataCacheTwitchUserids.logins[user]);
    // } else if (clientDataCacheTwitchUserids.ids[user]) {
    //   return resolve(clientDataCacheTwitchUserids.ids[user]);
    // }

    _getUsers(sym, user)
      .then((u) => {
        if (Object.keys(u.details).length == 0)
          return reject(Error("API didn't return any data on user"));

        let ch = u.details[Object.keys(u.details)[0]];
        // clientDataCacheTwitchUserids.logins[ch.login] = ch.id;
        // clientDataCacheTwitchUserids.ids[ch.id] = ch.login;

        return resolve([ch.login, ch.id, ch]);

        // return resolve(class {
        //     static _raw = ch;
        //     static login = ch.login;
        //     static id = ch.id;
        // });
      })
      .catch((e) => {
        return reject(Error("Could not get user", { cause: e }));
      });
  });
}
