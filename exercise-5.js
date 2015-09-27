var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');

function letsHaveFun(){
    
    return request("http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=8&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5").spread(
        
        function(res, body){
            
            var words = JSON.parse(body);
            return words;
        
    }).map( function(x){
        
        return request('http://words.bighugelabs.com/api/2/11c036dfbb595f828a10c807a507e679/'+x.word+"/json").spread(
        
            function(res, body) {
        
                var format = JSON.parse(body);
                return {word: x.word, response: format};
            }
        );
    }).then( function(results){
        
        for(var i = 0 ; i < 5 ; i++){
                
            console.log("\n"+results[i].word.charAt(0).toUpperCase() .bgWhite.red.bold + results[i].word.slice(1) .bgWhite.red.bold);
            
            if(results[i].response.noun !== undefined && results[i].response.noun !== false){
                
                var nounSyn = results[i].response.noun.syn.map(function(x){return x.charAt(0).toUpperCase() + x.slice(1);}).join(", ");
                console.log("\nNoun synonyms:\n"+nounSyn+".");
            }
            if(results[i].response.verb !== undefined && results[i].response.verb !== false){
                
                var verbSyn = results[i].response.verb.syn.map(function(x){return x.charAt(0).toUpperCase() + x.slice(1);}).join(", ");
                console.log("\nVerb synonyms:\n"+verbSyn+".");
            }
            if(results[i].response.adjective !== undefined && results[i].response.adjective !== false){
                
                var adjSyn = results[i].response.adjective.syn.map(function(x){return x.charAt(0).toUpperCase() + x.slice(1);}).join(", ");
                console.log("\nAdjective synonyms:\n"+adjSyn+".");
            }
        }
    }).catch( function(err){
        
        return err;
    });
}

letsHaveFun();