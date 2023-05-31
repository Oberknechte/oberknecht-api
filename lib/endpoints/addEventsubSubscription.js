const request = require("request");
let i= require("..");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");
const eventsubSubscriptionTypes = require("../arguments/endpoints/eventsub.subscriptionTypes");

/** @param {Symbol} sym @param {string} type @param {string | undefined} version @param {string} condition @param {string} transport @param {string?} customtoken */
async function eventsubSubscriptions(sym, type, version, condition, transport, customtoken) {
    return new Promise(async (resolve, reject) => {
        if ((!(sym ?? undefined) && !(customtoken ?? undefined)) || (!(type ?? undefined) || !(condition ?? undefined) || !(transport ?? undefined))) return reject(Error(`sym and customtoken or type, condition and transport is undefined`));
        if (!(version ?? undefined)) version = eventsubSubscriptionTypes.filter(a => a[1] == type)[0][2];

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        let body = {
            type: type,
            version: version,
            condition: condition,
            transport: transport
        };
        
        request(`${urls._url("twitch", "eventsubSubscriptions")}`, { method: urls.twitch.eventsubSubscriptions.method, headers: urls.twitch._headers(sym, customtoken, clientid), body: JSON.stringify(body) }, (e, r) => {
            if (e || r.statusCode !== urls._code("twitch", "eventsubSubscriptions")) return reject(Error(e ?? r.body));

            return resolve(JSON.parse(r.body));
        });
    });
};

module.exports = eventsubSubscriptions;