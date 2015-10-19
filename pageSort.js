//+	pageSorting {
pageSort = {}
/**
ex
	situattions
		first page is already got, do
	setup
		have a
			<div id="pagingControl"></div>
		on the page
		or define the pagingControl key

		then do
			pageSort.start({
				url:'dataUrl',
				dataHandler: function(rows){ console.log(rows); },
				pullHandler: function(rows){ console.log(rows);
				menuHandler: function(rows){ console.log(rows); }
				})

	url json post should respond with json result of View::$json['data'] = SortPage::page(); View::endStdJson();

@note	if you don't want to run the pullHandler, just use ps.menuHandler
*/


///set defaults and run the pullHanlder
pageSort.start = function(current){
	var defaults = {url:window.location,pagingControl:$('#pagingControl'),
		page:1,
		menuHandler:pageSort.menuHandler,
		pullHandler:pageSort.pullHandler}
	current = _.defaults(current||{}, defaults)
	current.pullHandler(current)	}

/**
@param	current	{
	changed:<force an update once (will reset)>
	page:x,
	pages:x
	sort:x,
	url:x
	handlers:x	}
*/
pageSort.get = function(current,update){
	var changed = false;
	if(update.page && current.page != update.page){
		current.page = update.page
		changed = true	}
	if(update.sort && current.sort != update.sort){
		current.sort = update.sort
		changed = true	}
	if(changed){
		current.pullHandler(current)	}	}

///account for defaults, and split order and field
pageSort.parseSort = function(sort){
	var order = sort.substring(0,1)
	var field
	if(order != '-' && order != '+'){
		order = '+'
		field = sort
	}else{
		field = sort.substring(1)	}
	return {order:order,field:field}	}
///arrange the arrows according to sorts
pageSort.headerArrows = function(){
	//direct  the arrows according to the sorts
	var sort, column
	for(var i in bf.sorts){
		sort = pageSort.parseSort(bf.sorts[i])
		column = $('.sortContainer [data-field="'+sort.field+'"]')
		if(sort.order == '+'){
			column.addClass('sortAsc')
		}else{
			column.addClass('sortDesc')	}	}	}
///shift clicks on sort header
pageSort.appendSort = function(newField){
	var sort
	for(var i in bf.sorts){
		sort = pageSort.parseSort(bf.sorts[i])
		if(newField == sort.field){
			sort.order = bf.toggle(sort.order,['+','-'])
			bf.sorts[i] = sort.order + sort.field
			return	}	}
	bf.sorts.push('+'+newField)	}
///non-shift clicks on sort header
pageSort.changeSort = function(newField){
	var sort
	for(var i in bf.sorts){
		sort = pageSort.parseSort(bf.sorts[i])
		if(newField == sort.field){
			sort.order = bf.toggle(sort.order,['+','-'])
			bf.sorts = [sort.order + sort.field]
			return	}	}
	bf.sorts = ['+'+newField]	}

///runs the dataHandler, then the menuHandler, then issues view:change event
/**
@param	data	[<item>, ...]
@param	current	<paging object>
*/
pageSort.apply = function(data, current){
	current.dataHandler(data,current)
	current.menuHandler(current)
	news.pub('view:change')	}

pageSort.pullHandler = function(current){
	$.ajax({
		url:current.url,
		contentType:'application/json',
		data:JSON.stringify(current),
		dataType:'json',
		method:'POST',
		success:function(json){
			current.pages = json.meta.pages
			pageSort.apply(json.data,current)	}	})
}

pageSort.menuHandlerMore = function(current){
	if(!current.pages || current.pages < 2){
		return;	}

	//ensure currect format
	current.pages = parseInt(current.pages)
	current.page = parseInt(current.page)

	//++ resolve containers {
	if(!current.pagingControl.hasClass('pagingControl')){
		var actualPagingControl = $('.pagingControl',current.pagingControl)
		//may have already been added
		if(!actualPagingControl.size()){
			actualPagingControl = $('<div class="pagingControl"></div>')
			current.pagingControl.append(actualPagingControl)	}
		current.pagingControl = actualPagingControl	}

	//++ }
	current.pagingControl.html('')

	if(current.page >= current.pages){
		return
	}
	var moreButton = $('<div class="ln loadMore">Load More</div>')
	moreButton.click(function(){
		var page = current.page + 1
		pageSort.get(current,{page:page})	})
	current.pagingControl.append(moreButton)
}

/**
see getSorPage for param
*/
pageSort.menuHandler = function(current){
	if(!current.pages || current.pages < 2){
		return;	}

	//ensure currect format
	current.pages = parseInt(current.pages)
	current.page = parseInt(current.page)

	//++ resolve containers {
	if(!current.pagingControl.hasClass('pagingControl')){
		var actualPagingControl = $('.pagingControl',current.pagingControl)
		//may have already been added
		if(!actualPagingControl.size()){
			actualPagingControl = $('<div class="pagingControl"></div>')
			current.pagingControl.append(actualPagingControl)	}
		current.pagingControl = actualPagingControl	}
	var paginaterDiv = $('.paginater',current.pagingControl)

	if(!paginaterDiv.size()){
		paginaterDiv = $("<div class='paginater'></div>")
		current.pagingControl.append(paginaterDiv)	}
	//empty out the paginater for update
	paginaterDiv.html('')
	//++ }

	//++	center the current page if possible {
	var context = 2;//only  show context * 2 + 1 page buttons
	var start = Math.max((current.page - context),1)
	var end = Math.min((current.page + context),current.pages)
	var extraContext = context - (current.page - start)
	if(extraContext){
		end = Math.min(end + extraContext,current.pages)
	}else{
		extraContext = context - (end - current.page)
		if(extraContext){
			start = Math.max(start - extraContext,1)	}	}
	//++	}

	//++ complete the paginater {
	if(current.page != 1){
		paginaterDiv.append('<div class="clk first">&lt;&lt;</div><div class="clk prev">&nbsp;&lt;&nbsp;</div>')	}

	for(var i=start;i <= end; i++){
		var currentClass = i == current.page ? ' current' : ''
		paginaterDiv.append('<div class="clk pg'+currentClass+'">'+i+'</div>')	}
	if(current.page != current.pages){
		paginaterDiv.append('<div class="clk next">&nbsp;&gt;&nbsp;</div><div class="clk last">&gt;&gt;</div>')	}
	paginaterDiv.append("<div class='direct'>"+
				"<input title='Total of "+current.pages+"' type='text' name='directPg' value='"+current.page+"'/>"+
				"<div class='clk go'>Go</div>"+
			"</div>")
	//++	}

	//clicks
	$('.clk:not(.disabled)',paginaterDiv).click(function(e){
		var page,
			target = $(this)
		if(target.hasClass('pg')){
			page = target.text()
		}else if(target.hasClass('next')){
			page = current.page + 1
		}else if(target.hasClass('last')){
			page = current.pages
		}else if(target.hasClass('first')){
			page = 1
		}else if(target.hasClass('prev')){
			page = current.page - 1
		}else if(target.hasClass('go')){
			var parent = target.parents('.paginater')
			page = Math.abs($('input',parent).val())	}
		pageSort.get(current,{page:page})	})

	//ensure enter on "go" field changes page, not some other form
	$('input',paginaterDiv).keypress(function(e){
		if (e.which == 13) {
			e.preventDefault();
			$('.go',paginaterDiv).click();	}	});	}

//+	}