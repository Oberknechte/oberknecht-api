import { userEntry } from "../types/endpoints/_getUsers";
import { _getUsers } from "./_getUsers";

export function _getUser(sym: string, user: string, refreshCache?: boolean) {
  return new Promise<userEntry>((resolve, reject) => {
    _getUsers(sym, user, undefined, undefined, undefined, refreshCache)
      .then((u) => {
        if (Object.keys(u.details).length == 0)
          return reject(Error("API didn't return any data on user"));

        return resolve(u.details[Object.keys(u.details)[0]]);
      })
      .catch((e) => {
        return reject(Error("Could not get user", { cause: e }));
      });
  });
}
