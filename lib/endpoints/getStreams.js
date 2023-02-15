const request = require("request");
const i = require("../index");
const urls = require("../var/urls");
const _joinurlquery = require("../functions/_joinurlquery");
const _validatetoken = require("./_validatetoken");
const getStreamsFilters = require("../arguments/getStreamsFilters");

/** @param {Symbol} sym @param {getStreamsFilters?} filters @param {string?} customtoken */
async function getStreams(sym, filters, customtoken) {
    return new Promise(async (resolve, reject) => {
        if (!(filters ?? undefined)) return reject(Error("filters is undefined"));

        let clientid = i.apiclientData[sym]?._options?.clientid;

        if ((customtoken ?? undefined)) {
            await _validatetoken(undefined, customtoken)
                .then(a => {
                    moderator_id = a.user_id;
                    clientid = a.client_id;
                })
                .catch();
        };

        let reqqueryparams = "";

        Object.keys(filters).forEach(filter => {
            reqqueryparams += _joinurlquery(filter, filters[filter], (reqqueryparams.length === 0 ? true : false));
        });

        request(`${urls._url("twitch", "streams")}${reqqueryparams}`, { headers: urls.twitch._headers(sym, customtoken, clientid) }, (e, r) => {
            if (e || (r.statusCode !== 200)) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};

module.exports = getStreams;