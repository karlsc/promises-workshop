var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prompt = Promise.promisifyAll(require('prompt'));
var Table = require('cli-table');

getCity();
    
function getCity(){
    
    return prompt.getAsync(['city']).then( function (result) {
    
        return request("https://maps.googleapis.com/maps/api/geocode/json?address="+result.city);
            
    }).spread( function(res, body){
            
        return JSON.parse(body).results[0].geometry.location;
        
    }).then( function(locations){
        
        return request("https://api.forecast.io/forecast/9cefef474c591d3e1ae766e338942cd9/"+locations.lat+","+locations.lng);
        

        
    }).spread ( function(res, body){
        
        var forecastInfo = JSON.parse(body);
        
        // console.log(forecastInfo.daily.summary);
        
        var table = new Table({
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                 , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                 , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                 , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
         
        table.push(
            ["Tommorow", "Max: "+Math.round(forecastInfo.daily.data[0].temperatureMax)+"°F", "Min: "+Math.round(forecastInfo.daily.data[0].temperatureMin)+"°F",forecastInfo.daily.data[0].summary,forecastInfo.daily.data[0].icon]
        );
         
        console.log(table.toString());
    });
}