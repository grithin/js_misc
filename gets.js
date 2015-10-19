gets = {gots:{}}
///get a promise for a resource.  Resource path prefixed with type! to load text intead of script
gets.script = function(paths){
	if(!Array.isArray(paths)){
		paths = [paths]
	}
	_.each(paths,function(path){
		if(gets.gots[path]){
			return gets.gots[path]
		}

		debug('loading script '+path)
		///load script file
		var promise = Promise.resolve($.getScript(path))
		promise.catch(gets.fail.arg(path))
		if(!gets.getting){
			gets.getting = new Promiser({resolver:Promiser.resolveRight,promises:[promise]})
		}else{
			debug('adding gets.gots')
			gets.getting.add(promise)
		}
		gets.gots[path] = gets.getting
	})
	return gets.getting
}
/**
expecs paths in the form
	templateId:pathToFile
*/
gets.template = function(paths,options){
	if(!Array.isArray(paths)){
		paths = [paths]
	}
	var promises = _.map(paths,function(path){
		parts =   path.split(':')
		templateId = parts.shift()
		path = parts.join(':')

		if(gets.templates[templateId]){
			return gets.templates[templateId]
		}

		var jqXHR = $.ajax(path,{mimeType: 'text/plain; charset=x-user-defined',//firefox tries to parse it first, so have to tell firefox it is plaintext
			dataType: 'text',
			processData: false,
			cache: false})
		var intermediate = Promise.resolve(jqXHR)
		intermediate.catch(gets.fail.arg(path))

		return new Promise(function(resolve){
			var id = templateId
			intermediate.then(function(html){
				$('script',$(html)).each(function(){
					gets.templates[$(this).attr('id')] = _.template($(this).html(),{variable:'data'})
				})
				resolve(gets.templates[id])
			})
		})
	})
	if(promises.length == 1){
		return promises[0]
	}
	return Promise.all(promises)
}
gets.templates = {}
gets.fail = function(path,e){
	console.log('gets failed to load path: '+path)
	log(e)}
///define a get resolution with some value
gets.got = function(path,value){
	gets.gots[path] = Promise.resolve(value)	}
