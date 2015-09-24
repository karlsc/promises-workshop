var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prompt = require('prompt');
Promise.promisifyAll(prompt);

var values = [];

prompt.start();

prompt.getAsync(['city']).then( function (result) {
    
        return result.city;
        
}).then( function(yourCity){

    return request("https://maps.googleapis.com/maps/api/geocode/json?address="+yourCity);

    
}).spread( function(res, body){
    
    var addressInfo = JSON.parse(body);
    values[0] = addressInfo.results[0].geometry.location.lat;
    values[1] = addressInfo.results[0].geometry.location.lng
    console.log("You current location is: "+Math.floor(addressInfo.results[0].geometry.location.lat*100)/100+" x "+Math.floor(addressInfo.results[0].geometry.location.lng*100)/100);
    return values;

    
}).then( function(){
    
    return request("http://api.open-notify.org/iss-now.json");
    
}).spread( function(res, body) {
    
    var issInfo = JSON.parse(body);
    values[2] = issInfo.iss_position.latitude;
    values[3] = issInfo.iss_position.longitude;
    console.log("The ISS is now at: "+Math.floor(issInfo.iss_position.latitude*100)/100+" x "+Math.floor(issInfo.iss_position.longitude*100)/100);
    return values;

}).then( function (){
    
    Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
    };
    
    var R = 6371000; // metres
    var φ1 = values[0].toRadians();
    var φ2 = values[2].toRadians();
    var Δφ = (values[2]-values[0]).toRadians();
    var Δλ = (values[3]-values[1]).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    
    console.log("Your are now "+Math.floor(d/10)/100+"km away of the International Space Station.");
});