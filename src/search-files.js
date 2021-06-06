const fs = require('fs');
const readline = require('readline');
const path = require('path');

/**
 * This function search all the files under provided directory and counts the occurence of words
 * @param {string} dirOrFile 
 * @param {string[]} words 
 */
async function searchFiles(dirOrFile, words){
    const filesList = [];
    await populateFilesList(dirOrFile, filesList);
    await Promise.all(filesList.map(file => searchFile(file, words)));
}

/**
 * This function traverse through directories and sub-directories and populates the list of files
 * @param {string} dirOrFile 
 * @param {string[]} filesList 
 */
async function populateFilesList(dirOrFile, filesList){
    const stat = await fs.promises.lstat(dirOrFile);
    if(stat.isFile()){
        filesList.push(dirOrFile);

    } else if(stat.isDirectory()){
        const files = await fs.promises.readdir(dirOrFile);
        await Promise.all(files.map(async file => populateFilesList(path.join(dirOrFile, file), filesList)));
    }
};

/**
 * This function search for words in the file and updates the counter
 * @param {string} file 
 * @param {string[]} words 
 * @returns 
 */
async function searchFile(file, words){
    return new Promise(
        (resolve, reject) => {
            const fileStream = fs.createReadStream(file);
            fileStream.on('error', (error) => {
                console.error(`Unable to read file: ${file}`);
                reject();
            });            
            const readLine = readline.createInterface(fileStream);
            readLine.on('line', (line) => {
                updateSearchWordsCount(line, words);
            });
            readLine.on('close', () => {
                resolve();
            });
            readLine.on('error', (error) => {
                console.error(error)
                reject();
            });

        }
    );
}

/**
 * This function counts the occurence of words in the provided line and updates the counter
 * @param {string} line 
 * @param {string[]} words 
 */
function updateSearchWordsCount(line, words) {
    for(const word in words){
        const pattern = new RegExp(`\\b${word}\\b`, "ig")
        words[word] = words[word] + ((line || '').match(pattern) || []).length;
    }
}

exports.searchFiles = searchFiles;