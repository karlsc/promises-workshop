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
        var table = new Table({
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                 , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                 , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                 , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
        
        Date.prototype.customFormat = function(formatString){
        	var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
        	var dateObject = this;
        	YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
        	MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
        	MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
        	DD = (D=dateObject.getDate())<10?('0'+D):D;
        	DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
        	th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
        	formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
        
        	h=(hhh=dateObject.getHours());
        	if (h==0) h=24;
        	if (h>12) h-=12;
        	hh = h<10?('0'+h):h;
        	AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
        	mm=(m=dateObject.getMinutes())<10?('0'+m):m;
        	ss=(s=dateObject.getSeconds())<10?('0'+s):s;
        	return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
        };
        
        for(var i = 0 ; i < 7 ; i++){
            
            var dayToday = new Date(forecastInfo.daily.data[i].time*1000);
            var emoji;
            
            switch(forecastInfo.daily.data[i].icon){
                
                case "clear-day": emoji = "☀"; break;
                case "clear-night": emoji = "🌙️"; break;
                case "rain": emoji = "💧️"; break;
                case "snow": emoji = "❄"; break;
                case "sleet": emoji = "❄🌧"; break;
                case "wind": emoji = "💨"; break;
                case "fog": emoji = "🌁️"; break;
                case "cloudy": emoji = "☁️️"; break;
                case "partly-cloudy-day": emoji = "⛅️"; break;
                case "partly-cloudy-night": emoji = "🌙☁️"; break;
                default: emoji = "n/a";
            }

            table.push(
                [dayToday.customFormat("#DDDD# #DD##th#"), "Max: "+Math.round((forecastInfo.daily.data[i].temperatureMax-32)*(5/9))+"°C", "Min: "+Math.round((forecastInfo.daily.data[i].temperatureMin-32)*(5/9))+"°C",forecastInfo.daily.data[i].summary+" "+emoji]
            );
        }
         
        console.log(table.toString());
    });
}