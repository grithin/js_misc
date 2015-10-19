stat = {}

/**
requires
-	d3
*/

///take an array of objects and compile them into an object of arrays
/**
@param  rows  [{<key>:<value>},...]
@param  groupOn <key|f:optional>
@param  groupOn < fn(row) -> <t:string> >
@example
	fn(rows)
	fn(rows,'in')
	fn(rows,function(row){
		console.log('bob')
		return row.in.substr(0,10)  })

*/
stat.compile = function(rows,groupOn){
	var k,i,value
	//determine information about columns
	keys = {}
	if(rows && rows[0]){
		for(k in rows[0]){
		keys[k] = {}
		value = rows[0][k]
		if($.isNumeric(value)){
			keys[k].type = 'numeric'
		}else{
			keys[k].type = typeof(value)
		}
		}
	}

	var row, groupOnKey, target, flat = []
	for(i in rows){
		row = rows[i]
		if(groupOn){
			if(typeof(groupOn) == 'string'){
				groupOnKey = row[groupOn]
			}else{
				groupOnKey = groupOn(row) }
			if(!flat[groupOnKey]){
				flat[groupOnKey] = {} }

			target = flat[groupOnKey]
		}else{
			target = flat
		}
		for(k in row){
			if(!target[k]){
				target[k] = []
			}
			target[k].push(row[k])
		}
	}
	return flat
}
stat.summariseRows = function(rows,groupOn){
	return stat.summarise(stat.compile(rows,groupOn),groupOn)
}
stat.isNumeric = function(v){
	if(typeof(v) == typeof(1) || typeof(v) == typeof('1')){
		return (obj - parseFloat( obj ) + 1) >= 0;
	}
}

stat.summary = function(column){
	if(stat.isNumeric(column[0])){
		return {
			mean:d3.mean(column),
			max:d3.max(column),
			min:d3.min(column),
			sum:d3.sum(column),
			deviation:d3.deviation(column),
		}
	}
	return {count: d3.map(column, function(value) { return value; }).size() }
}


///get varius statistics about array data
/**
	@example
		var compiled _.compile(obj,'key')
		var summary = bf.obj.summarise(compiled,true)
*/
stat.summarise = function(obj,grouped){
	var k, k2, summary = {}
	if(grouped){
		for(k in obj){
			summary[k] = {}
			for(k2 in obj[k]){
				summary[k][k2] = stat.summary(obj[k][k2])
			}
		}
	}else{
		for(k in obj){
			summary[k] = stat.summary(obj[k])
		}
	}
	return summary
}