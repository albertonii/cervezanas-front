import _ from "lodash";
import { uuid } from "uuidv4";

export function isValidObject(object: any) {
  return object != null && object !== "" && !_.isEmpty(object);
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

export function generateDownloadableLink(blob: any, filename: string) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${decodeURIComponent(filename)}`);

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

export function generateFileName(fName: string) {
  if (!fName) return "";

  const fileExt = fName.split(".").pop();
  const fileName = `${uuid()}.${fileExt}`;
  const encodedFileName = encodeURIComponent(fileName);
  return encodedFileName;
}

export function generateFileNameExtension(fName: string) {
  if (!fName) return "";
  const fileExt = fName.split(".").pop();
  const fileNameExtension = `.${fileExt}`;
  const encodedFileName = encodeURIComponent(fileNameExtension);
  return encodedFileName;
}

export function isFileEmpty(file: FileList) {
  return file.length === 0;
}

export function cleanObject(obj: any) {
  const cleanedObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] && (obj[key].id !== false || obj[key].id.length > 1)) {
      cleanedObj[key] = obj[key];
    }
  });
  return cleanedObj;
}

// Used in input search fields -> Products, international distribution, etc
export function filterSearchInputQuery(
  list: any[],
  query: string,
  currentPage: number,
  resultsPerPage: number
) {
  const listToDisplay = list?.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return slicePaginationResults(listToDisplay, currentPage, resultsPerPage);
}

export function slicePaginationResults(
  list: any[],
  currentPage: number,
  resultsPerPage: number
) {
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  return list?.slice(startIndex, endIndex);
}
