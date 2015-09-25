var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prompt = Promise.promisifyAll(require('prompt'));
var join = Promise.join;

prompt.start();

prompt.getAsync(['city']).then( 
    
    function (result) {
        
        return getEverything(result);
    }
);
    
function getCity(result){    
    
    return request("https://maps.googleapis.com/maps/api/geocode/json?address="+result.city).spread(
        
        function(res, body){
            var cityLocation = JSON.parse(body).results[0].geometry.location;
            return cityLocation;
        }
    );
}    
    
function getIss(){
    
    return request("http://api.open-notify.org/iss-now.json").spread( 
        
        function(res, body) {
            var issLocation = JSON.parse(body).iss_position;
            return issLocation;
        }
    );
}   
    
function getEverything(yourCity){
    
    return join(getCity(yourCity), getIss(), 
        
        function(city,iss){
            
            Number.prototype.toRadians = function() { return this * Math.PI / 180 };
    
            var R = 6371000; // metres
            var φ1 = city.lat.toRadians();
            var φ2 = iss.latitude.toRadians();
            var Δφ = (iss.latitude-city.lat).toRadians();
            var Δλ = (iss.longitude-city.lng).toRadians();
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            
            console.log("You current location is: "+Math.floor(city.lat*100)/100+" x "+Math.floor(city.lng*100)/100);
            console.log("The ISS is now at: "+Math.floor(iss.latitude*100)/100+" x "+Math.floor(iss.longitude*100)/100);
            console.log("Your are now "+Math.floor(d/10)/100+"km away of the International Space Station.");
        }
    );
}