const request = require("request");
let i= require("../index");
const urls = require("../variables/urls");
const _validatetoken = require("./_validatetoken");
const { joinUrlQuery, convertToArray } = require("oberknecht-utils");

/** @param {Symbol} sym @param {string?} customtoken @param {string?} user_id @param {string?} first @param {string?} after @param {string?} before */
async function getBroadcasterSubscriptions(sym, customtoken, user_id, first, after, before) {
    return new Promise(async (resolve, reject) => {

        let broadcaster_id;
        let clientid = i.apiclientData[sym]?._options?.clientid;
        let user_id_ = convertToArray(user_id);

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    clientid = a.client_id;
                    broadcaster_id = a.user_id;
                })
                .catch();
        } else {
            broadcaster_id = i.apiclientData[sym]?._options?.userid;
        };

        request(`${urls._url("twitch", "getBroadcasterSubscriptions")}${joinUrlQuery(["broadcaster_id", "user_id", "first", "after", "before"], [broadcaster_id, user_id_, first, after, before], true)}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);

            return resolve(dat);
        });
    });
};

module.exports = getBroadcasterSubscriptions;