const request = require("request");
let i= require("..");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");

/** @param {Symbol} sym @param {string} id @param {string?} customtoken */
async function getEventsubSubscriptions(sym, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined))) return reject(Error(`sym and customtoken is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "getEventsubSubscriptions")}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "getEventsubSubscriptions")) return reject(Error(e ?? r.body));

            return resolve(JSON.parse(r.body));
        });
    });
};

module.exports = getEventsubSubscriptions;