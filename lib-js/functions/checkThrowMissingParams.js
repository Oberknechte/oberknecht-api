"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkThrowMissingParams = void 0;
const paramsMissError_1 = require("./paramsMissError");
function checkThrowMissingParams(paramValues, paramNames, allUndefined) {
    let err = (0, paramsMissError_1.paramsMissError)(paramValues, paramNames, allUndefined);
    if (err)
        throw err;
}
exports.checkThrowMissingParams = checkThrowMissingParams;
