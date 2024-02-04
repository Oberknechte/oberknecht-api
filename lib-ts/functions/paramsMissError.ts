import {
  convertToArray,
  getVariableName,
  isNullUndefined,
} from "oberknecht-utils";

export function paramsMissError(
  paramValues: any | any[],
  paramNames: any | any[],
  allUndefined?: boolean
) {
  let paramValues_ = convertToArray(paramValues, false, true);
  let paramNames_ = convertToArray(paramNames, false);
  let missingParams = [];
  paramValues_.forEach((a, i) => {
    if (isNullUndefined(a)) missingParams.push(paramNames_[i]);
  });

  if (
    missingParams.length === 0 ||
    (allUndefined && missingParams.length !== paramValues_.length)
  )
    return undefined;

  return Error(
    `Missing values on ${missingParams.join(allUndefined ? " or " : ", ")}`
  );
}
