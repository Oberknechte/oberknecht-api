const request = require("request");
let i= require("..");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");
const { joinUrlQuery } = require("oberknecht-utils");

/** @param {Symbol} sym @param {string} id @param {string?} customtoken */
async function deleteEventsubSubscription(sym, id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || !(id ?? undefined)) return reject(Error(`sym and customtoken or id is undefined`));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "deleteEventsubSubscription")}${joinUrlQuery("id", id, true)}`, { method: urls.twitch.deleteEventsubSubscription.method, headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            // if (e || r.statusCode !== urls._code("twitch", "deleteEventsubSubscription")) return reject(Error("API returned Error", { "cause": (e ?? r.body) }));
            if (e || r.statusCode !== urls._code("twitch", "deleteEventsubSubscription")) return reject(Error(e ?? r.body));

            return resolve();
        });
    });
};

module.exports = deleteEventsubSubscription;