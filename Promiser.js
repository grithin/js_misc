///provides a promise which relies on the fulfullment of a changeable array
Promiser = function(options){

	options = options || {}

	this.done = false

	///add to promises
	this.add = function(promise){
		this.promises.push(promise)
		promise.then(function(){
			this.get()
		}.bind(this))

		//if the this.promise is resolve, make a new one
		if(!this.promise || this.promise.isFulfilled()){
			//remake the promise
			this.makePromise()
		}
	}

	this.makePromise = function(){
		this.promise = new Promise(function(resolve){
			this.resolve = resolve	}.bind(this))
	}


	///resolve if all promises are resolved
	this.get = function(){
		var resolved = true
		this.promises.forEach(function(value){
			if(!value.isFulfilled()){
				resolved = false	}
		})
		if(resolved){
			debug('resolved')
			var thens = this.thens
			//clear out the thens
			this.thens = []
			this.promises = []

			//run the resolver on the custom thens
			this.resolver(thens)

			//anything that is relying directly on the promise goes last
			this.resolve()		}	}

	this.thens = []
	this.then = function(fn){
		if(this.thens.length > 10){
			throw new Error('thens')
		}
		this.thens.push(fn)
		this.get()	}

	this.resolver = options.resolver || Promiser.resolveLeft


	//set the initial promise
	this.promises = []
	if(options.promises){
		_.each(options.promises,this.add.bind(this))}
}
///go through the thens in normal left to right order
Promiser.resolveLeft = function(thens){
	_.each(thens,function(then){then()})
}
///go through the thens in reverse order
Promiser.resolveRight = function(thens){
	_.forEachRight(thens,function(then){then()})
}