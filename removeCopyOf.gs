// paste the folder id here and run "removeCopyOf"
// to remove all prefixes "Copy of" of copied files in the drive
const FOLDER_ID = "1k0zzC41366vG_9QfZozbxrcqbRnEiQ4A";

// a value of true means a list of files the starts with "Copy of" will be searched and displayed.
// no renaming of files is done; only gives a preview of what files will be renamed.
// a value of false means "Copy of" will be removed from the file name.
// [ true = safe operation/view files only, false = renames files, action cannot be undone]
const LIST_ONLY = false;

/**
 * Renames file by removing "Copy of " infront of file names.
 */
function removeCopyOf() {
  // removes "Copy of" from files within the root folder and all its subfolders.
  // (if searching under My Drive, set the FOLDER_ID to empty string)
  const rootFolder = (FOLDER_ID && DriveApp.getFolderById(FOLDER_ID)) || DriveApp.getRootFolder();
  const renamedFiles = recursivelyProcessSubfolder_(rootFolder);

  // display result
  const pluralNoun = renamedFiles != 1 && 's' || '';
  //const pluralVerb = !pluralNoun && 's' || '';
  Logger.log(`*** Found ${renamedFiles} file${pluralNoun} that starts with 'Copy of' ***`);
}

/**
 * Removes "Copy of" from file names.
 * Subfolders within the folder are also searched recursively for files to rename. 
 * Returns count of files that were renamed.
 * @param {DriveApp.Folder} rootFolder The folder where search is to start
 * @param {String} path The path to the folder relative to root folder
 * @returns {Number} The number of files what were renamed.
 */
function recursivelyProcessSubfolder_(rootFolder, path = "") {

  const folders = rootFolder.getFolders();
  path += "/" + rootFolder.getName();

  // check all subfolders of the current folder (we count number of renamed files)
  let renamedFiles = 0;
  while (folders.hasNext()) 
    renamedFiles += recursivelyProcessSubfolder_(folders.next(), path);

  Logger.log(path);
  const files = rootFolder.getFiles();

  // check all files of the current folder
  while (files.hasNext()) {
    const file = files.next();
    let fileName = file.getName();

    // check if filename starts with "Copy of"
    if (fileName.startsWith("Copy of ")) {
    //if (fileName.indexOf("Copy of ") > -1) {
      Logger.log("    ✔️ " + fileName);
      // last element of the array is the new filename
      fileName = fileName.split("Copy of ").pop();

      // remove "Copy of"
      !LIST_ONLY && file.setName(fileName);
      renamedFiles++;
    };
  }

  // return the number of files that were renamed
  return renamedFiles;
}
