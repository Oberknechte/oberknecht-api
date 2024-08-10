"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTwitchUsername = checkTwitchUsername;
const oberknecht_utils_1 = require("oberknecht-utils");
const __1 = require("..");
function checkTwitchUsername(u) {
    return !(0, oberknecht_utils_1.isNullUndefined)(u) && !__1.i.regex.numregex().test(u) && __1.i.regex.twitch.usernamereg().test(u);
}
