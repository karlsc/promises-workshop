var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prompt = Promise.promisifyAll(require('prompt'));

getEverything();
    
function getCity(){
    
    return prompt.getAsync(['city']).then( function (result) {
    
        return request("https://maps.googleapis.com/maps/api/geocode/json?address="+result.city);
            
    }).spread( function(res, body){
            
        return JSON.parse(body).results[0].geometry.location;
    });
}

function getIss(){
    
    return request("http://api.open-notify.org/iss-now.json").spread( function(res, body) {
            
        return JSON.parse(body).iss_position;
    });
}   
    
function getEverything(){
    
    return Promise.join(getCity(), getIss(), function(city,iss){
            
        var R = 6371000; // metres
        var φ1 = city.lat* Math.PI / 180;
        var φ2 = iss.latitude* Math.PI / 180;
        var Δφ = (iss.latitude-city.lat)* Math.PI / 180;
        var Δλ = (iss.longitude-city.lng)* Math.PI / 180;
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        
        console.log("You current location is: "+Math.floor(city.lat*100)/100+" x "+Math.floor(city.lng*100)/100);
        console.log("The ISS is now at: "+Math.floor(iss.latitude*100)/100+" x "+Math.floor(iss.longitude*100)/100);
        console.log("Your are now "+Math.floor(d/10)/100+"km away of the International Space Station.");
    });
}