if(this.grithin){
	this.grithin.browser = true
}else{
	this.grithin = {}
}

if(this.localStorage){
	localStorage.get = function(key){
		var value = localStorage.getItem(key)
		if(value !== null){
			return JSON.parse(value)
		}
		return null
	}
	localStorage.set = function(key,value){
		localStorage.setItem(key,JSON.stringify(value))
	}
}


grithin.setCookie = function(name, value, exp){
	var c = name + "=" +escape( value )+";path=/;";
	if(exp){
		var expire = new Date();
		expire.setTime( expire.getTime() + exp);
		c += "expires=" + expire.toGMTString();
	}
	document.cookie = c;
}
grithin.readCookie = function(name) {
	name = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
	}
	return null;
}


//get user location
grithin.ipLocation = function(){
	return Promise.resolve($.ajax( {
		url: '//freegeoip.net/json/',
		type: 'POST',
		dataType: 'jsonp'
	}))	}
///return a promise for the location
/**
@note	will attempt to get location from the browser.  If that fails, try the freegeoip service

@return	{latitude:<>, longitude:<>, time:<time location was got>}
*/
grithin.getLocation = function(){
	var location = localStorage.get('location')
	if(location && location.time > grithin.time.unix() - 86400){
		console.log(location)
		return Promise.resolve(location)
	}

	if("geolocation" in navigator){
		var promise = Promise.later()
		var error = function(){
			grithin.ipLocation().then(promise.resolve)
		}
		var success = promise.resolve
		navigator.geolocation.getCurrentPosition(success, error)

		var after = grithin.saveLocation
		return promise.then(after)
	}else{
		return grithin.ipLocation()
	}
}
grithin.saveLocation = function(location){
	location = _.pick(location,['latitude','longitude','type'])
	location.time = grithin.time.unix()
	localStorage.set('location',location)
	return location
}
