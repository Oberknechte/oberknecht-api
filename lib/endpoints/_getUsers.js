const i = require("..");
const getUsers = require("./getUsers");
const { cleanChannelName } = require("oberknecht-utils");
const { regex } = require("..");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function _getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));

        let idsinlogins = (logins?.filter(a => regex.numregex().test(a)) ?? []);
        if (!(ids ?? undefined) && (idsinlogins.length > 0)) {
            ids = idsinlogins; idsinlogins.forEach(a => logins.splice(logins.indexOf(a)));
        };

        logins = [...((logins ?? undefined) && !Array.isArray(logins) ? [logins] : logins ?? []).map(a => cleanChannelName(a))];
        ids = [...((ids ?? undefined) && !Array.isArray(ids) ? [ids] : ids ?? []).map(a => a?.toLowerCase())];

        let r = {
            logins: {},
            ids: {},
            details: {}
        };

        let requestnew = [];

        if (i.apiclientData[sym]?._options?.saveIDs) {
            logins.map(login => {
                let u = i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync(["logins", login]);
                if (u) {
                    let details = i.apiclientData[sym].jsonsplitters.users.getKeySync(["details", u]);
                    r.logins[login] = u;
                    r.ids[u] = login;
                    if (!details || !details._lastUpdated || (i.apiclientData[sym].maxcacheage?.getUsers && (details._lastUpdated < (Date.now() - i.apiclientData[sym].maxcacheage.getUsers)))) requestnew.push(u); else r.details[u] = details;
                    logins.splice(logins.indexOf(login), 1);
                };
            });

            ids.map(id => {
                let u = i.apiclientData[sym]?.jsonsplitters?.users?.getKeySync(["ids", id]);
                if (u) {
                    let details = i.apiclientData[sym].jsonsplitters.users.getKeySync(["details", id]);
                    r.logins[u] = id;
                    r.ids[id] = u;
                    if (!details || !details._lastUpdated || (i.apiclientData[sym].maxcacheage?.getUsers && (details._lastUpdated < (Date.now() - i.apiclientData[sym].maxcacheage.getUsers)))) requestnew.push(id); else r.details[id] = details;
                    ids.splice(ids.indexOf(id), 1);
                };
            });
        };

        if (requestnew.length > 0) {
            await getUsers(sym, [], requestnew)
                .then(users => {
                    Object.keys(users.details).forEach(a => r.details[a] = users.details[a]);
                })
                .catch();
        };

        if (logins.length === 0 && ids.length === 0) return resolve(r);

        getUsers(sym, logins, ids, customtoken)
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