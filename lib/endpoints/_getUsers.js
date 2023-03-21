const _validatetoken = require("./_validatetoken");
const i = require("..");
const getUsers = require("./getUsers");
const { correctChannelName } = require("oberknecht-utils");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function _getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));
        logins = ((logins ?? undefined) && !Array.isArray(logins) ? [logins] : logins ?? []).map(a => correctChannelName(a).replace(/^#/g, "")?.toLowerCase());
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
            logins: {},
            ids: {},
            details: {}
        };

        let requestnew = [];

        if (i.apiclientData[sym]?._options?.saveIDs) {
            await Promise.all(logins.map(async login => {
                return await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["logins", login], true)
                    .then(async u => {
                        if (u) {
                            r.logins[login] = u;
                            r.ids[u] = login;
                            r.details[u] = await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["details", u], true);
                            if (!r.details[u]) requestnew.push(u);
                            logins.splice(logins.indexOf(login), 1);
                        };
                    });
            }));

            await Promise.all(ids.map(async id => {
                return await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["ids", id], true)
                    .then(async u => {
                        if (u) {
                            r.logins[u] = id;
                            r.ids[id] = u;
                            r.details[id] = await i.apiclientData[sym]?.jsonsplitters?.users?.getKey(["details", id], true);
                            if (!r.details[u]) requestnew.push(id);
                            ids.splice(ids.indexOf(id), 1);
                        };
                    });
            }));
        };

        if (requestnew.length > 0) {
            await getUsers(sym, [], requestnew)
                .then(users => {
                    Object.keys(users.details).forEach(a => r.details[a] = users.details[a]);
                })
                .catch();
        };

        if (logins.length === 0 && ids.length === 0) return resolve(r);

        getUsers(sym, logins, ids)
            .then(async dat => {
                Object.keys(dat.details).forEach(a => {
                    let b = dat.details[a];

                    r.ids[b.id] = b.login;
                    r.logins[b.login] = b.id;
                    r.details[b.id] = b;
                });

                return resolve(r);
            })
            .catch(e => {
                return reject(Error("Could not get users", { "cause": e }));
            });
    });
};

module.exports = _getUsers;