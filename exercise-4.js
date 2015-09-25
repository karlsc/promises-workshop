var Promise = require('bluebird');
var colors = require('colors');
var request = Promise.promisify(require('request'));
var prompt = require('prompt');
Promise.promisifyAll(prompt);

prompt.start();

prompt.getAsync(['englishWord']).then( function (result) {
    
    return request('http://words.bighugelabs.com/api/2/11c036dfbb595f828a10c807a507e679/' + result.englishWord+"/json");
        
        
}).spread( function(res, body) {
    
    var format = JSON.parse(body);
    return format;

}).catch( function(err) {        
        
    var superError = "####### This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "This word is invalid! " .random + "#######" .random;
    
    console.log(superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+
                superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError+"\n"+superError);   
    return err;

}).then( function(formatObject) {
    
    if(formatObject.noun !== undefined){
        
        var nounSyn = formatObject.noun.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
        console.log("\nNoun synonyms:\n" .black.bgYellow +nounSyn .rainbow.bgWhite +".\n" .rainbow.bgWhite);
    }
    if(formatObject.verb !== undefined){
        
        var verbSyn = formatObject.verb.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
        console.log("Verb synonyms:\n" .black.bgYellow +verbSyn .rainbow.bgWhite +".\n" .rainbow.bgWhite);
    }
    if(formatObject.adjective !== undefined){
        
        var adjSyn = formatObject.adjective.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
        console.log("Adjective synonyms:\n" .black.bgYellow +adjSyn .rainbow.bgWhite +".\n" .rainbow.bgWhite);
    }
});