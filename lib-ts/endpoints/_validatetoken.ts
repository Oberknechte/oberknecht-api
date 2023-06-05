import request from "request";
import { i } from "..";
import { validateTokenResponse } from "../types/endpoints/validateToken";

export async function _validatetoken(sym: string | undefined, customtoken?: string) {
    return new Promise<validateTokenResponse>((resolve, reject) => {
        let customtoken_ = customtoken;
        if (!customtoken) {
            customtoken_ = sym;
            sym = undefined;
        };

        request(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `OAuth ${customtoken_ ?? i.apiclientData[sym]?._options?.token}`
            }
        }, (e, r) => {
            if (e || r.statusCode !== 200) return reject(Error(e ?? r.body));

            let dat = JSON.parse(r.body);
            return resolve(dat);
        });
    });
};