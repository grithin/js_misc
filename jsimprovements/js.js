///add arg method for prepending arguments to a function call.  Used instead of "bind" to maintain the "this" context present where the function is called.
Function.prototype.arg = function() {
	if (typeof this !== "function")
		throw new TypeError("Function.prototype.arg needs to be called on a function");
	//the use of Array.prototype.slice is the accepted way to turn array-like objects ("arguments") into arrays
	var slice = Array.prototype.slice,
		args = slice.call(arguments),
		fn = this,
		partial = function() {
			return fn.apply(this, args.concat(slice.call(arguments)));
		};
	partial.prototype = Object.create(this.prototype);
	return partial;
}
///return an object where "this" is the prototype and available in property "parent"
/**
Used in cases where you want to override the constructed object props and methods, but, still want access to them as this.prototype...
*/
Function.prototype.inherit = function(){
	this.apply(this, arguments)
	var that = this
	//The prototype property of an object is used when creating new child objects of that object. Changing it does not reflect in the object itself, rather is reflected when that objected is used as a constructor for other objects, and has no use in changing the prototype of an existing object.
	generic = function(){}
	generic.prototype = this

	var child = new generic()
	//instead of local calls to Object.getPrototypeOf(this)
	child.parent = this
	return child
}

String.prototype.repeat = function(num){
	return new Array( num + 1 ).join( this );
}

///escape special characters from a string for regex
/// ex: new RegExp('' + RegExp.quote(input) + '');
RegExp.quote = function(str) {
	return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

/*
Ex
var today = new Date();
if (today.dst()) { alert ("Daylight savings time!"); }
*/
Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());///dst always back one hour in compaarison
}

Date.prototype.dst = function() {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
}