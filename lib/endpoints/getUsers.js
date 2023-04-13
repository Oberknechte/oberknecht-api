const request = require("request");
const urls = require("../variables/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _chunkArray = require("../functions/_chunkArray");
const _validatetoken = require("./_validatetoken");
const i = require("..");
const { cleanChannelName } = require("oberknecht-utils");
const { regex } = require("..");
const convertToArray = require("oberknecht-utils/lib/utils/convertToArray");

/** @param {Symbol} sym @param {Array?} logins @param {Array?} ids @param {string?} customtoken */
async function getUsers(sym, logins, ids, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(sym ?? undefined) || (!(logins ?? undefined) && !(ids ?? undefined))) return reject(Error("sym or logins and ids undefined"));

        let logins_ = convertToArray((logins ?? []));
        let ids_ = convertToArray((ids ?? []));
        let idsinlogins = [...(logins_?.filter(a => regex.numregex().test(a)) ?? [])];
        if (!(ids ?? undefined) && (idsinlogins.length > 0)) {
            ids_ = [...ids_, idsinlogins]; idsinlogins.forEach(a => logins_.splice(logins_.indexOf(a)));
        };

        logins_ = convertToArray(logins_).map(a => cleanChannelName(a));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        let chunks = _chunkArray([...logins_, ...ids_], (i.apiclientData[sym]._options.use3rdparty?.getUsers ? 50 : 100));
        let ret = {
            logins: {},
            ids: {},
            details: {}
        };

        await Promise.all(
            chunks.map(chunk => {
                let chunkLogins = chunk.filter(a => logins_.includes(a));
                let chunkIDs = chunk.filter(a => ids_.includes(a));
                return new Promise((resolve2, reject2) => {
                    let url = `${urls._url("twitch", "users")}${_joinurlquery("login", chunkLogins, true)}${_joinurlquery("id", chunkIDs, (chunkLogins.length == 0 ? true : false))}`;
                    if (i.apiclientData[sym]._options?.use3rdparty?.getUsers) url = `${urls._url("ivrfitwitch", "users")}${(chunkLogins.length > 0 ? `?login=${chunkLogins}` : "")}${(chunkIDs.length > 0 ? `${(chunkLogins.length > 0 ? "&" : "?")}id=${chunkIDs}` : "")}`

                    request(url, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
                        if (e || (r.statusCode !== 200)) return reject2(Error(e ?? r.body));

                        let dat = JSON.parse(r.body);

                        let d = (i.apiclientData[sym]._options?.use3rdparty?.getUsers ? dat : dat.data);

                        if (i.apiclientData[sym]?._options?.saveIDs) {
                            d.forEach(async a => {
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["logins", a.login], a.id);
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["ids", a.id], a.login);

                                if (!i.apiclientData[sym].jsonsplitters.users.getKeySync(["details"], true)) i.apiclientData[sym].jsonsplitters.users.addKeySync(["details"], {});
                                i.apiclientData[sym].jsonsplitters.users.addKeySync(["details", a.id], {
                                    ...a,
                                    _lastUpdated: Date.now()
                                });
                            });
                        };

                        d.forEach(a => {
                            ret.logins[a.login] = a.id;
                            ret.ids[a.id] = a.login;
                            ret.details[a.id] = a;
                        });

                        return resolve2();
                    });
                });
            })
        )
            .then(() => {
                return resolve(ret);
            });
    });
};

module.exports = getUsers;