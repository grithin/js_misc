this.grithin = this.grithin || {}

grithin.kmPerMile = 1.60934
///get distance, in km, between two points on earth
grithin.distance = function(point1,point2){
	var latR1 = Math.PI * point1.latitude/180;
	var latR2 = Math.PI * point2.latitude/180;
	var lonR1 = Math.PI * point1.longitude/180;
	var lonR2 = Math.PI * point2.longitude/180;
	var dLat = latR1 - latR2;
	var dLon = lonR1 - lonR2;
	var a = Math.pow(Math.sin(dLat/2),2) + Math.cos(latR1) * Math.cos(latR2) * Math.pow(Math.sin(dLon/2),2);
	return 12742 * Math.atan(Math.sqrt(a)/Math.sqrt(1 - a));
}


// * Found here: https://gist.github.com/vaiorabbit/5657561
grithin.hash = grithin.hashFnv32a = function(str, seed) {
		/*jshint bitwise:false */
		var i, l,
			hval = (seed === undefined) ? 0x811c9dc5 : seed;

		for (i = 0, l = str.length; i < l; i++) {
			hval ^= str.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}

		// Convert to 8 digit hex string
		return ("0000000" + (hval >>> 0).toString(16)).substr(-8);

}

grithin.dom = {}

sort_on_second = function(v){ return v[1] }
// turn an object into array compatible with $.fn.fillOptions
grithin.dom.sorted_options = function(obj){
	return _.sortBy(_.dekey(obj), sort_on_second)
}
// turn an object into sorted array compatible with $.fn.fillOptions
grithin.dom.sorted_capped_options = function(obj){
	return _.sortBy(_.dekey(_.morph(obj, _.ucwords)), sort_on_second)
}
// turn an object into array compatible with $.fn.fillOptions
grithin.dom.capped_options = function(obj){
	return _.dekey(_.morph(obj, _.ucwords))
}