if(this.postal){

	///amusing myself as a standard
	news = postal

	///postal does not provide a useful 'this' within the callback, so provide one
	/**
	allows for this.subscription.unsubscribe()
	*/
	news.sub = function(topic,callback){
		var manager = {}
		manager.subscription = news.subscribe({topic:topic,callback:callback.bind(manager)})
		return manager.subscription	}
	///get one published item, then opt out
	news.optout = function(topic,callback){
		var wrapper = function(data){
			callback(data)
			this.subscription.unsubscribe()	}
		return news.sub(topic, wrapper)	}
	///shorthand
	news.pub = function(topic,data){
		news.publish({topic:topic,data:data})	}

	///get a deferred promise that will resolve upon an event
	news.promise = function(topic){
		var promise = Promise.later()
		news.optout(topic,promise.resolve)
		return promise	}
	

}
