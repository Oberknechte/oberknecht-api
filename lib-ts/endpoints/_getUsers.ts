import {
  cleanChannelName,
  convertToArray,
  recreate,
  regex,
} from "oberknecht-utils";
import { i } from "..";
import { getUsers } from "./getUsers";
import { _getUsersResponse } from "../types/_getUsers";

export async function _getUsers(
  sym: string,
  logins?: string | string[],
  ids?: string | string[],
  noautofilterids?: Boolean /* Prevent filtering of number entries (ids) in logins */,
  customtoken?: string
) {
  return new Promise<_getUsersResponse>(async (resolve, reject) => {
    if (!(sym ?? undefined) && !(customtoken ?? undefined))
      return reject(Error("sym and customtoken is undefined"));
    if (!(logins ?? undefined) && !(ids ?? undefined))
      return reject(Error("logins and ids is undefined"));

    let logins_ = convertToArray(logins, false).map((a) => cleanChannelName(a));
    let ids_ = convertToArray(ids, false).map((a) => String(a).toLowerCase());

    if (!noautofilterids) {
      let idsinlogins = logins_.filter((a) => i.regex.numregex().test(a));
      if (idsinlogins.length > 0) {
        ids_ = [...ids_, ...idsinlogins];
        idsinlogins.forEach((a) => logins_.splice(logins_.indexOf(a)));
      }
    }

    let r = {
      logins: {},
      ids: {},
      details: {},
      loginsInvalid: [],
    } as _getUsersResponse;

    let requestnew = [];

    r.loginsInvalid = logins_.filter(
      (a) => !regex.twitch.usernamereg().test(a)
    );
    logins_ = logins_.filter((a) => regex.twitch.usernamereg().test(a));

    if (i.apiclientData[sym]?._options?.saveIDs) {
      recreate(logins_).forEach((login) => {
        let u = i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync([
          "logins",
          login,
        ]);
        if (u) {
          let details = i.apiclientData[sym].jsonsplitters.users.getKeySync([
            "details",
            u,
          ]);
          r.logins[login] = u;
          r.ids[u] = login;
          if (
            !details ||
            !details._lastUpdated ||
            (i.apiclientData[sym].maxcacheage?.getUsers &&
              details._lastUpdated <
                Date.now() - i.apiclientData[sym].maxcacheage.getUsers)
          )
            requestnew.push(u);
          else r.details[u] = details;
          logins_.splice(logins_.indexOf(login), 1);
        }
      });

      recreate(ids_).forEach((id) => {
        let u = i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync([
          "ids",
          id,
        ]);
        if (u) {
          let details = i.apiclientData[sym].jsonsplitters.users.getKeySync([
            "details",
            id,
          ]);
          r.logins[u] = id;
          r.ids[id] = u;
          if (
            !details ||
            !details._lastUpdated ||
            (i.apiclientData[sym].maxcacheage?.getUsers &&
              details._lastUpdated <
                Date.now() - i.apiclientData[sym].maxcacheage.getUsers)
          )
            requestnew.push(id);
          else r.details[id] = details;
          ids_.splice(ids_.indexOf(id), 1);
        }
      });
    }

    if (requestnew.length > 0) {
      await getUsers(sym, [], requestnew, true)
        .then((users) => {
          Object.keys(users.details).forEach(
            (a) => (r.details[a] = users.details[a])
          );
        })
        .catch();
    }

    if (logins_.length === 0 && ids_.length === 0) return resolve(r);

    getUsers(sym, logins_, ids_, noautofilterids, customtoken)
      .then(async (dat) => {
        Object.keys(dat.details).forEach((a) => {
          let b = dat.details[a];

          r.ids[b.id] = b.login;
          r.logins[b.login] = b.id;
          r.details[b.id] = b;
        });

        return resolve(r);
      })
      .catch((e) => {
        return reject(Error("Could not get users", { cause: e }));
      });
  });
}
