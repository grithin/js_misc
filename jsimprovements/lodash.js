// override potential underscore
if(this.lodash){
	_ = lodash
}

///filter a value out of an array
/**
@param	absoluteMatch <whether to use != or !== >
*/
_.without = function(array, value, absoluteMatch){
	var filter,newArray = []
	absoluteMatch = absoluteMatch || false
	if(absoluteMatch){
		filter = function(element){
			return element !== value	}
	}else{
		filter = function(element){
			return element != value	}	}
	return array.filter(filter)
}

///Add, but only if unique
_.addUnique = function(v,a){
	if(_.indexOf(a,v) === -1){
		a[a.length] = v;	}	}
///get the first available key in a sequential array (where potentially some have been deteted
_.firstAvailableKey = function(a){
	for(var i = 0; i < a.length; i++){
		if(typeof(a[i]) == 'undefined'){
			return i;	}	}
	return a.length;	}
///insert on first available key in a sequential array.  Returns key.
_.onAvailable = function(v,a){
	var key = _.firstAvailableKey(a)
	a[key] = v;
	return key;	}

///get key of first existing element
_.firstKey = function(a){
	for(var i = 0; i < a.length; i++){
		if(typeof(a[i]) != 'undefined'){
			return i;	}	}
	return false;	}
///get first existing element
_.firstValue = function(a){
	var key = _.firstKey(a)
	return a[key];	}

///ignore unset elements (since deleted values still count towards length)
_.count = function(a){
	count = 0;
	for(var i in a){
		count += 1;	}
	return count;	}

/// see jquery
_.isNumeric = function(v){
	if(typeof(v) == typeof(1) || typeof(v) == typeof('1')){
		return (obj - parseFloat( obj ) + 1) >= 0;
	}
}

///set arbitrarily deep path to value use standard http form array input semantics
/**
ex
	setValue('interest[1][name]','test',data);  => { interest: { '1': { name: 'test' } } }
*/
_.setValue = function(name,value,obj){
	nameParts = name.replace(/\]/g,'').split(/\[/)
	current = obj
	for(var i = 0; i < nameParts.length - 1; i++){
		if(!current[nameParts[i]]){
			current[nameParts[i]] = {}	}
		//since objs are moved by reference, this obj attribute of parent obj still points to parent attribute obj
		current = current[nameParts[i]]	}
	current[nameParts[nameParts.length - 1]] = value	}


///Binary to decimal
_.bindec = function(bin){
	bin = (bin+'').split('').reverse();
	var dec = 0;
	for(var i = 0; i < bin.length; i++){
		if(bin[i] == 1){
			dec += Math.pow(2,i);	}	}
	return dec;	}
///Decimal to binary
_.decbin = function(dec){
	var bits = '';
	for(var into = dec; into >= 1; into = Math.floor(into / 2)){
		bits += into % 2;	}
	var lastBit = Math.ceil(into);
	if(lastBit){
		bits += lastBit;	}
	return bits.split('').reverse().join('');	}
_.toInt = function(s){
	if(typeof(s) == 'string'){
		s = s.replace(/[^0-9]+/g,' ');
		s = s.replace(/^ +/g,'');
		s = s.replace(/^0+/g,'');
		s = s.split(' ');
		num = parseInt(s[0]);
	}else{
		num = parseInt(s);
	}
	if(isNaN(num)){
		return 0;
	}
	return num;
}


///round with some precision
_.round = function(num, precision){
	var divider = Number(_.pad(1,precision+1,'0','right'))
	return Math.round(num * divider) / divider;	}
///will render string according to php rules
/**
@note	no apparent alternative in underscore or my using String
*/
_.toStr = function(str){
	if(typeof(str) == 'number'){
		return str+'';	}
	if(!str){
		return '';	}
	return str;	}
///pad a string
_.pad = function(str,len,padChar,type){
	str = str+'';
	if(!padChar){
		padChar = '0';	}
	if(!type){
		type = 'left';	}
	if(type == 'left'){
		while (str.length < len){
			str = padChar + str;	}
	}else{
		while (str.length < len){
			str = str + padChar;	}	}
	return str;	}

///set words to upper case
_.ucwords = function(string){
	if(string){
		string = string.split(' ');
		var newString = Array();
		var i = 0;
		$.each(string,function(){
			newString[newString.length] = this.substr(0,1).toUpperCase()+this.substr(1,this.length)	});
		return newString.join(' ');	}	}
///set first charracter to uppercase
_.capitalize = function(string){
	return string.charAt(0).toUpperCase() + string.slice(1);	}

_.decimals = function(string, precision){
	string = _.round(string, precision)+''
	var parts = string.split('.')
	if(parts.length === 2){
		var remaining = precision - parts[1].length
		return string+'0'.repeat(remaining)
	}else if(precision > 0){
		return string + '.' + '0'.repeat(precision)
	}else{
		return string
	}
}
///htmlspecialchars() - for escaping text
_.hsc = function(string){
	if(string === null){
		return ''	}
	return $('<a></a>').text(string).html()	}
_.nl2br = function(string){
	return string.replace(/(?:\r\n|\r|\n)/g, '<br />')	}


// http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
_.kUnflatten = function(data) {
		"use strict";
		if (Object(data) !== data || Array.isArray(data))
			return data;
		var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
			resultholder = {};
		for (var p in data) {
			var cur = resultholder,
				prop = "",
				m;
			while (m = regex.exec(p)) {
				cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
				prop = m[2] || m[1];
			}
			cur[prop] = data[p];
		}
		return resultholder[""] || resultholder;
};
// flatten keys of object with . separation
_.flatten_keys = function(data) {
	var result = {};
	function recurse (cur, prop) {
		if (Object(cur) !== cur || Array.isArray(cur)) {
			result[prop] = cur;
		}else{
			var isEmpty = true;
			for (var p in cur) {
				isEmpty = false;
				recurse(cur[p], prop ? prop+"."+p : p);
			}
			if (isEmpty && prop){
				result[prop] = {}	}	}	}

	recurse(data, "");
	return result;
}


/// turn a js object into flat {} of conventional input names
_.flatten_keys_input = _.kBracketFlatten = function(data){
	var flat = _.flatten_keys(data)
	var bracketFlat = {}
	var name;
	// remove the "." separation
	for(var k in flat){
		name = k
		// add "[]" to array values
		if(Array.isArray(flat[k])){
			name += '[]'
		}
		parts = name.split('.')
		if(parts.length > 1){
			//first key is not bracketted: ex: bob[bill]
			first = parts.shift()
			parts = parts.map(function(v){ return "["+v+"]" })
			newKey = first+parts.join('')
			bracketFlat[newKey] = flat[k]
		}else{
			bracketFlat[name] = flat[k]
		}
	}

	return bracketFlat
}

// take an object and turn it into an array of arrays like [[<key>,<value>], ...]
_.dekey = function(data){
	var pairs = []
	for(var key in data){
		pairs.push([key, data[key]])
	}
	return pairs
}

// like map, but maintains and returns obj instead of array
_.morph = function(obj, fn){
	for(var key in obj){
		obj[key] = fn(obj[key])
	}
	return obj
}