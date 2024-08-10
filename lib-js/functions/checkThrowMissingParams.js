"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkThrowMissingParams = checkThrowMissingParams;
const paramsMissError_1 = require("./paramsMissError");
function checkThrowMissingParams(paramValues, paramNames, allUndefined) {
    let err = (0, paramsMissError_1.paramsMissError)(paramValues, paramNames, allUndefined);
    if (err)
        throw err;
}
