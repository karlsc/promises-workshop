var Promise = require('bluebird');

function delay(time){
    
    return new Promise(function(res,err){
        
        setTimeout(function(){
            
            res();
            
        },time);  
    });
}

delay(1000).then(
    function() {
        console.log("ONE");
        return delay(1000);
    }
).then(
    function() {
        console.log("TWO");
        return delay(1000);
    }
).then(
    function() {
        console.log("THREE");
        return delay(1000);
    }
).then(
    function() {
        console.log("...LIFTOFF!");
        return delay(1000);
    }
);