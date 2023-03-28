import _ from "lodash";

export function isValidObject(object: any) {
  return (
    !_.isNull(object) &&
    !_.isUndefined(object) &&
    object !== "" &&
    !_.isEmpty(object)
  );
}

export function isNotEmptyArray(array: any[]) {
  return !_.isEmpty(array);
}
