var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');

function letsHaveFun(){
    
    return request("http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=8&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5").spread(
        
        function(res, body){
            
            var words = JSON.parse(body);
            return words;
        
    }).then( function(result){
            
        result.map( function(x){
        
            return request('http://words.bighugelabs.com/api/2/11c036dfbb595f828a10c807a507e679/'+x.word+"/json").spread(
                
                function(res, body) {
                    
                    var format = JSON.parse(body);
                    console.log("\n"+x.word[0].toUpperCase() .bgWhite.red.bold + x.word.slice(1) .bgWhite.red.bold);
                    
                    if(format.noun !== undefined){
                    
                        var nounSyn = format.noun.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
                        console.log("\nNoun synonyms:\n"+nounSyn+".");
                    }
                    if(format.verb !== undefined){
                        
                        var verbSyn = format.verb.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
                        console.log("\nVerb synonyms:\n"+verbSyn+".");
                    }
                    if(format.adjective !== undefined){
                        
                        var adjSyn = format.adjective.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", ");
                        console.log("\nAdjective synonyms:\n"+adjSyn+".");
                    }
                }
            ).catch( function(err) {
                
                return err;
            });
        }); 
    });
}

letsHaveFun();