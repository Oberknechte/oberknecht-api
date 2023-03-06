const request = require("request");
const urls = require("../variables/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _validatetoken = require("./_validatetoken");
const i = require("..");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));
        logins = ((logins ?? undefined) && !Array.isArray(logins) ? [logins] : logins ?? []);
        ids = ((ids ?? undefined) && !Array.isArray(ids) ? [ids] : ids ?? []);

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "users")}${_joinurlquery("login", logins, true)}${_joinurlquery("id", ids, ((logins ?? []).length == 0 ? true : false))}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);

            if (i.apiclientData[sym]?._options?.saveIDs) {
                dat.data.forEach(async a => {
                    await i.apiclientData[sym].jsonsplitters.users.addKey(["logins", a.login], a.id);
                    await i.apiclientData[sym].jsonsplitters.users.addKey(["ids", a.id], a.login);
                });
            };

            return resolve(dat);
        });
    });
};

module.exports = getUsers;