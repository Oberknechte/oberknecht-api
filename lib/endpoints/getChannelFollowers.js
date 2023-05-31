const request = require("request");
let i= require("../index");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");
const { cleanChannelName } = require("oberknecht-utils");

/** @param {Symbol} sym @param {string} broadcaster_id @param {string?} user_id @param {string?} customtoken */
async function getChannelFollowers(sym, broadcaster_id, user_id, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(broadcaster_id ?? undefined)) return reject(Error("broadcaster_id is undefined"));
        broadcaster_id = cleanChannelName(broadcaster_id);

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                })
                .catch();
        };

        request(`${urls._url("twitch", "channelfollowers")}?broadcaster_id=${broadcaster_id}${((user_id ?? undefined) ? `&user_id=${user_id}` : "")}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);

            return resolve(dat);
        });
    });
};

module.exports = getChannelFollowers;