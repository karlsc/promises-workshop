var Promise = require('bluebird');
var join = Promise.join;

function delay(time){
    
    return new Promise(function(res,err){
        
        setTimeout(function(){
            
            res();
            
        },time);  
    });
}

function getFirstChar(myString){
    
   return delay(500).then(
        
        function(){
            
            return myString.charAt(0);
        }
    );
}

function getLastChar(myString){
    
    return delay(500).then(
        
        function(){
            
            return myString.charAt(myString.length-1);
       }
    );
}

function getFirstAndLastCharSeq(myString){
    
    var firstChar, lastChar;
    
    return getFirstChar(myString).then(
        
        function(value){
            
            firstChar = value;
            return getLastChar(myString);
        }
    ).then(
        
        function(value){
            
            lastChar = value;
            return firstChar + lastChar;
        }
    );
}

function getFirstAndLastCharParallel(myString){
    
    return join(getFirstChar(myString), getLastChar(myString), 
        
        function(firstChar,lastChar){
            
            return firstChar + lastChar;
        }
    );
}

// getFirstChar("This is a test");
// getLastChar("This is a test");
// getFirstAndLastCharSeq("This is a test");
getFirstAndLastCharParallel("This is a test");