export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toLowerCase(string: string) {
  return string.toLowerCase();
}

export function getFileExtensionByName(fileName: string) {
  return fileName.split(".").pop();
}
