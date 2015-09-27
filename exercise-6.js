var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');
var Table = require('cli-table');

function letsHaveFun(){
    
    var URL = ["noun","verb","adjective"];
    
    URL.map( function(randUrl){
        
        return request("http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech="+randUrl+"&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=20&maxDictionaryCount=-1&minLength=3&maxLength=8&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5").spread(
            
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
                   
            var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
            });
            
            for(var i = 0 ; i < 2 ; i++){
                
                table.push( ["Random word:" .bgYellow.black,results[i].word.charAt(0).toUpperCase()+results[i].word.slice(1) .trap] );

                if(results[i].response.noun !== undefined){
                
                    var nounSyn = results[i].response.noun.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", \n");
                    table.push( ["Noun synonyms:" .bgRed.black, nounSyn] );
                }
                if(results[i].response.verb !== undefined){
                    
                    var verbSyn = results[i].response.verb.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", \n");
                    table.push( ["Verb synonyms:" .bgGreen.black, verbSyn] );
                }
                if(results[i].response.adjective !== undefined){
                    
                     var adjSyn = results[i].response.adjective.syn.map(function(x){return x[0].toUpperCase() + x.slice(1);}).join(", \n");
                     table.push( ["Adjective synonyms:" .bgBlue.black, adjSyn] );
                }
            }
            console.log(table.toString());
            
        }).catch( function(err) {
            
            return err;
        });
    });
}

letsHaveFun();