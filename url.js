Url = {}
//get query string request variable
Url.var = function(name,decode){
	decode = decode != null ? decode : true;
	url = window.location+'';
	if(/\?/.test(url)){
		var uriParts = Url.split('?');
		regexName = name.replace(/(\[|\])/g,"\\$1");
		var regex = new RegExp('(^|&)'+regexName+'=(.*?)(&|$)','g');
		var match = regex.exec(uriParts[1]);
		if(match){
			if(decode){
				return decodeURIComponent(match[2]);
			}
			return match[2];
		}
	}
	return false;
}

///take a url and break it up in to page/path and key value pairs
Url.parts = function(options){
	options = _.extend({url:window.location+'',decode:true},options)

	var retPairs = []
	var urlParts = options.Url.split('?');
	if(urlParts[1]){
		var pairs = urlParts[1].split('&');
		if(pairs.length > 0){
			for(var i in pairs){
				var pair = pairs[i]
				var retPair = pair.split('=');
				if(options.decode){
					retPair[0] = decodeURIComponent(retPair[0])
					retPair[1] = decodeURIComponent(retPair[1])
				}
				retPairs.push(retPair)
			}
		}
	}
	return {page:urlParts[0],pairs:retPairs}
}
///make a url from page and key value pairs
Url.fromParts = function(parts,encode){
	encode = encode != null ? encode : true;
	url = parts.page
	if(parts.pairs.length > 0){
		var pairs = []
		for(var i in parts.pairs){
			var pair = parts.pairs[i]
			if(encode){
				pair[0] = encodeURIComponent(pair[0])
				pair[1] = encodeURIComponent(pair[1])
			}
			pairs.push(pair[0]+'='+pair[1])
		}
		query = pairs.join('&')
		url = url+'?'+query
	}
	return url
}

///for removing parts from the url
/**
will remove exactly one matched token if regex is a string
*/
Url.queryFilter = function(regex,options){
	options = _.extend({url:window.location+'',decode:true},options)

	var parts = Url.parts(options)

	if(regex.constructor != RegExp){
		if(regex.constructor == String){
			regex = new RegExp('^'+RegExp.quote(regex)+'$','g');
		}else{
			//replace all
			regex = new RegExp('.*','g');
		}
	}
	if(parts.pairs.length > 0){
		var newPairs = []
		var foundPair = false
		for(var i in parts.pairs){
			var pair = parts.pairs[i]
			if(!pair[0].match(regex)){
				newPairs.push(pair)
			}
		}
		parts.pairs = newPairs
	}
	return Url.fromParts(parts, options.decode)
}

///for adding variables to URL query string
Url.append = function(name,value,options){
	options = _.extend({replace:true},options)
	if(options.replace){
		options.url = Url.queryFilter(name,options)
	}
	var parts = Url.parts(options)
	parts.pairs.push([name,value])
	return Url.fromParts(parts)
}

///for adding multiple varibles to query string
/**
@param	pairs	either in form [[key,val],[key,val]] or {key:val,key:val}
*/
Url.appends = function(pairs,options){
	options = _.extend({replace:true},options)
	var key, val
	for(var i in pairs){
		if(typeof(pairs[i]) == 'object'){
			key = pairs[i][0]
			val = pairs[i][1]
		}else{
			key = i
			val = pairs[i]
		}
		options.url = Url.append(key,val,options);
	}
	return options.url;
}
///get the primary id from the url
Url.primaryId = function(url){
	url = url || (window.location + '')
	var id = Url.var('id')
	if(!id){
		id = Url.split('?')[0].split('/').pop()
	}
	return id;
}