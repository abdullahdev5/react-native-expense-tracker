export {};

declare global {
    interface String {
        capitalizeFirstLetter(): string;
        getFilePathFromUrl(bucketName: string): string;
    }
}


/* String Extension functions */

String.prototype.capitalizeFirstLetter = function(this: string): string {
  if (!this) return "";
  const lowerCaseString = this.toLowerCase();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}


String.prototype.getFilePathFromUrl = function (
    bucketName: string,
    this: string
): string {
    const { pathname } = new URL(this);
    const filePath = pathname.split(`${bucketName}/`)[1];

    return decodeURIComponent(filePath);
}