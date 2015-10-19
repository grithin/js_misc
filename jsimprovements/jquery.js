if(Meteor.isClient){


///get the data from a single form as an arbitrarily deep object
$.fn.asObjectdata = function(){
	var data = {}
	///anything that has a name, but is not specified as ignored
	$('[name]', $(this)).each(function(){
		var name = $(this).attr('name')

		if($(this).attr('type') == 'checkbox'){
			_.setValue(name,$(this).prop('checked'),data)
		}else{
			_.setValue(name,$(this).val(),data)	}

		})
	return data
}


// turn form into flat an object of keyed values like:
// {"start[bob]":"",  "start[sue]":"",  "end":"", ...}

// http://stackoverflow.com/users/66617/tobias-cohen
$.fn.serializeObject = function(){
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
};

$.fn.hasAttr = function(name) {
	if (typeof(this.attr(name)) !== typeof(undefined) && this.attr(name) !== false){
		return true	}
	return false	}

///jquery ajax post for json request and response.  the laziness is  strong with this one
$.json = function(options){
	var defaults = {contentType:'application/json',dataType:'json',method:'POST'}
	if(options.data && typeof(options.data) != 'string'){
		options.data = JSON.stringify(options.data)
	}
	for(var key in defaults){
		if(typeof(options[key]) == 'undefined'){
			options[key] = defaults[key]
		}
	}
	return $.ajax(options)
}
///jquery ajax file post for json request and response
/**
@param	fileInputs	can be array of elements, or a
*/
$.file = function(options,fileInputs){
	var data = new FormData()
	if(options.data){
		data.append('_json', JSON.stringify(options.data));
	}
	fileInputs.map(function(file,what){
		data.append($(file).attr('name'), file.files[0])	})

	//jquery doesn't handle setting boundary, so use basic javascript
	options.url = options.url || window.location
	var xhr = new XMLHttpRequest();
	xhr.open('POST',options.url)
	xhr.send(data)
	return xhr

	//xhr.setRequestHeader("X_FILENAME", file.name);
}


//apply fn to each ele matching selector (good for using bound arguments for later calls using bf.run)
/**
news.subscribe(
	'view-change',
	$.eachApply.arg('[data-timeAgo]',bf.view.ele.timeAgo))
*/
$.eachApply = function(selector,fn){
	$(selector).each(fn)
}


///causes  form to submit when pressing enter on an type="input" element (since without submit button, doesn't behave this way by default)
/**
@ex	$('form').setEnterSubmit()
*/
$.fn.setEnterSubmit = function(){
	$('input',$(this)).keypress(function(e){
			if (e.which == 13) {
				$(this).submit()	}	})	}


///fill the inputs in a form with the keyed data provided
$.fn.fillInputs = function(obj, options){
	options = options || {}
	$('[name]:not([type="submit"])',form).each(function(){
		var value = values[$(this).attr('name')]
		if(value || !options.ignoreFalse){
			bf.view.form.fillInput($(this),value)	}	})
}

$.fn.fillInput = function(value){
	if(input.attr('type')=='checkbox'){
		if(value && value != '0'){
			input.prop('checked',true)	}
	}else{
		input.val(value || '')
	}
}

$.fn.clearForm = function(){
	$('[name]', $(this)).val('')
	$('textarea, input:not(input[type="button"], input[type="submit"]), select', $(this)).val('')
	$('input[type="checkbox"], input[type="radio"]', $(this)).prop('checked',false)
}

}