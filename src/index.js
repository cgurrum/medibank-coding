const { searchFiles } = require('./search-files');

const extractArguments = ()=> {
    //E.g., node src <file_path> word1 word2
    if(process.argv.length>3){
        const args = process.argv.splice(2);
        const words = {};
        
        //form object with search words as keys and 0 as initial count
        args.splice(1).forEach(inputStr => {
            words[inputStr] = 0
         })
        return {
           dir: args[0],
           words
        }
    }else{
        throw new Error('Invalid arguments. Please refer read me file..');
    }
};

const { dir, words } = extractArguments();

searchFiles(dir, words).
    then(() => {
        // convert object into array and sort by word count
        const wordsArr = Object.entries(words);
        wordsArr.sort((a, b) => (b[1] - a[1]));
        wordsArr.forEach((word)=>{
            //output results to console
            console.log(`${word[0]} ${word[1]}`);
        });
    }, (error)=>{
        console.error(error);
    });


