import { paramsMissError } from "./paramsMissError";

export function checkThrowMissingParams(
  paramValues: any | any[],
  paramNames: any | any[],
  allUndefined?: boolean
) {
  let err = paramsMissError(paramValues, paramNames, allUndefined);
  if (err) throw err;
}
