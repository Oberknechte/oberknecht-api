import { convertToArray, isNullUndefined } from "oberknecht-utils";

export function checkParams(params: any | any[], allUndefined?: boolean) {
  let params_ = convertToArray(params, false, true);
  return !allUndefined
    ? params_.some((a) => isNullUndefined(a))
    : params_.filter((a) => isNullUndefined(a)).length === params_.length;
}
