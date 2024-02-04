"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParams = void 0;
const oberknecht_utils_1 = require("oberknecht-utils");
function checkParams(params, allUndefined) {
    let params_ = (0, oberknecht_utils_1.convertToArray)(params, false, true);
    return !allUndefined
        ? params_.some((a) => (0, oberknecht_utils_1.isNullUndefined)(a))
        : params_.filter((a) => (0, oberknecht_utils_1.isNullUndefined)(a)).length === params_.length;
}
exports.checkParams = checkParams;
