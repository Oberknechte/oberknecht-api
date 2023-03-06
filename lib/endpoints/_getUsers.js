const _validatetoken = require("./_validatetoken");
const i = require("..");
const getUsers = require("./getUsers");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function _getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));
        logins = ((logins ?? undefined) && !Array.isArray(logins) ? [logins] : logins ?? []).map(a => a?.toLowerCase());
        ids = ((ids ?? undefined) && !Array.isArray(ids) ? [ids] : ids ?? []).map(a => a?.toLowerCase());

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch(reject);
        };

        let r = {
            "logins": {},
            "ids": {}
        };

        if (i.apiclientData[sym]?._options?.saveIDs) {
            await Promise.all(logins.map(async login => {
                return await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["logins", login], true)
                    .then(u => {
                        if (u) {
                            r.logins[login] = u;
                            r.ids[u] = login;
                            logins.splice(logins.indexOf(login), 1);
                        };
                    });
            }));

            await Promise.all(ids.map(async id => {
                return await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["ids", id], true)
                    .then(u => {
                        if (u) {
                            r.logins[u] = id;
                            r.ids[id] = u;
                            ids.splice(ids.indexOf(id), 1);
                        };
                    });
            }));
        };

        if (logins.length == 0 && ids.length == 0) return resolve(r);

        getUsers(sym, logins, ids)
            .then(dat => {
                dat.data.forEach(a => {
                    r.ids[a.id] = a.login;
                    r.logins[a.login] = a.id;
                });

                return resolve(r);
            })
            .catch(e => {
                return reject(Error("could not get users", { "cause": e }));
            });
    });
};

module.exports = _getUsers;