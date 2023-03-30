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

export function encodeBase64(string: string) {
  return Buffer.from(string).toString("base64");
}

export function decodeBase64(string: string) {
  return Buffer.from(string, "base64").toString();
}
