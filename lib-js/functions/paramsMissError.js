"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsMissError = paramsMissError;
const oberknecht_utils_1 = require("oberknecht-utils");
function paramsMissError(paramValues, paramNames, allUndefined) {
    let paramValues_ = (0, oberknecht_utils_1.convertToArray)(paramValues, false, true);
    let paramNames_ = (0, oberknecht_utils_1.convertToArray)(paramNames, false);
    let missingParams = [];
    paramValues_.forEach((a, i) => {
        if ((0, oberknecht_utils_1.isNullUndefined)(a))
            missingParams.push(paramNames_[i]);
    });
    if (missingParams.length === 0 ||
        (allUndefined && missingParams.length !== paramValues_.length))
        return undefined;
    return Error(`Missing values on ${missingParams.join(allUndefined ? " or " : ", ")}`);
}
