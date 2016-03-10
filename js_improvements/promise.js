if(this.Promise){

///reduce a stack of promises to one
Promise.dig = function(promise){
	var resolve, reject
	var resolver = function(value){
		if(typeof(value) == 'object' && value.then){
			value.then(resolver)
		}else{
			resolve(value)
		}
	}
	var rejecter = function(value){
		if(typeof(value) == 'object' && value.then){
			value.then(rejecter)
		}else{
			reject(value)
		}
	}
	return new Promise(function(lresolve,lreject){
		resolve = lresolve
		reject = lreject
		promise.success(resolver).error(rejecter)	})
}


///return a promise that has a resolve and reject method (such that it can resolve itself)
/**
@param	fn	<f:optional>
*/
Promise.later = function(fn){
	var resolve, reject
	var promise = new Promise(function(lresolve,lreject){
		resolve = lresolve
		reject = lreject
		if(fn){
			fn(resolve,reject)	}	})
	promise.resolve = resolve
	promise.reject = reject
	return promise
}

}