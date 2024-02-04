"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTwitchUsername = void 0;
const __1 = require("..");
function checkTwitchUsername(u) {
    return !__1.i.regex.numregex().test(u) && __1.i.regex.twitch.usernamereg().test(u);
}
exports.checkTwitchUsername = checkTwitchUsername;
