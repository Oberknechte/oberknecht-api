import { request } from "oberknecht-request";
import { urls } from "../variables/urls";
import { i } from "..";
import {
  chunkArray,
  cleanChannelName,
  convertToArray,
  firstCap,
  isNaM,
  joinUrlQuery,
  regex,
} from "oberknecht-utils";
import { getUsersResolveType } from "../types/endpoints/_getUsers";
import { validateTokenBR } from "../functions/validateTokenBR";
import { checkThrowMissingParams } from "../functions/checkThrowMissingParams";

export async function getUsers(
  sym: string,
  logins?: string | string[],
  ids?: string | string[],
  noautofilterids?: Boolean /* Prevent filtering of number entries (ids) in logins */,
  customToken?: string
) {
  checkThrowMissingParams([sym, customToken], ["sym", "customToken"], true);

  let logins_ = convertToArray(logins, false).map((a) => cleanChannelName(a));
  let ids_ = convertToArray(ids, false).filter(
    (a) => typeof a === "number" || regex.numregex().test(a.toString())
  );

  let { clientID, accessToken } = await validateTokenBR(sym, customToken);

  if (!(noautofilterids ?? false)) {
    let idsinlogins = logins_.filter((a) => regex.numregex().test(a));
    if (idsinlogins.length > 0) {
      ids_ = [...ids_, ...idsinlogins];
      logins_ = logins_.filter((a) => !regex.numregex().test(a));
    }
  }

  let loginsInvalid = logins_.filter(
    (a) => !regex.twitch.usernamereg().test(a)
  );
  logins_ = logins_.filter((a) => regex.twitch.usernamereg().test(a));

  let chunks = chunkArray(
    [...logins_, ...ids_],
    i.apiclientData[sym]._options.use3rdparty?.getUsers ? 50 : 100
  );
  let ret: getUsersResolveType = {
    logins: {},
    ids: {},
    details: {},
    loginsInvalid: loginsInvalid,
  };

  return new Promise<getUsersResolveType>(async (resolve, reject) => {
    await Promise.all(
      chunks.map((chunk: string[]) => {
        let chunkLogins = chunk.filter((a) => logins_.includes(a));
        let chunkIDs = chunk.filter((a) => ids_.includes(a));
        return new Promise<void>((resolve2, reject2) => {
          let urlPath = ["twitch", "users"];
          let url = `${urls._url(...urlPath)}${joinUrlQuery(
            ["login", "id"],
            [chunkLogins, chunkIDs],
            true
          )}`;
          if (i.apiclientData[sym]._options?.use3rdparty?.getUsers) {
            urlPath = ["ivrfitwitch", "users"];
            url = `${urls._url(...urlPath)}${
              chunkLogins.length > 0 ? `?login=${chunkLogins}` : ""
            }${
              chunkIDs.length > 0
                ? `${chunkLogins.length > 0 ? "&" : "?"}id=${chunkIDs}`
                : ""
            }`;
          }

          request(
            url,
            {
              method: urls._method(...urlPath),
              headers: urls.twitch._headers(sym, accessToken, clientID),
            },
            (e, r) => {
              if (e || r.status !== urls._code(...urlPath))
                return reject2(Error(e.stack ?? r.data));

              let d = i.apiclientData[sym]._options?.use3rdparty?.getUsers
                ? r.data
                : r.data.data;

              d.forEach((a) => {
                let b = {
                  ...a,
                  _lastUpdated: Date.now(),
                  displayNameParsed: !isNaM(a.display_name)
                    ? a.display_name
                    : firstCap(a.login),
                };

                if (i.apiclientData[sym]?._options?.saveIDs) {
                  i.apiclientData[sym].jsonsplitters.users.addKeySync(
                    ["logins", a.login],
                    a.id
                  );
                  i.apiclientData[sym].jsonsplitters.users.addKeySync(
                    ["ids", a.id],
                    a.login
                  );

                  if (
                    !i.apiclientData[sym].jsonsplitters.users.getKeySync(
                      ["details"],
                      true
                    )
                  )
                    i.apiclientData[sym].jsonsplitters.users.addKeySync(
                      ["details"],
                      {}
                    );
                  i.apiclientData[sym].jsonsplitters.users.addKeySync(
                    ["details", a.id],
                    b
                  );
                }

                ret.logins[a.login] = a.id;
                ret.ids[a.id] = a.login;
                ret.details[a.id] = b;
              });

              return resolve2();
            }
          );
        });
      })
    ).then(() => {
      return resolve(ret);
    });
  });
}
