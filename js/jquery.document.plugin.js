// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/***************************
 * jQuery docPlugin
 * by alfredo cosco 2019
 **************************/
;(function ( $ ) {

/****************
 * docPlugin
 * options:
 * documentSelector: main document id
 * chapterbuttons: false|"top,prev,next"
 *******************/ 
	var globset={};
	
	$.fn.docPlugin= function(docOptions){
		
		var doc=this;

		if(!doc.selector){
			
			doc.selector="#document";
			}
			
		doc.docSettings= 
			$.extend({}, 
			$.fn.docPlugin.defaults,
			docOptions);

		globset['documentSelector']=doc.selector;
		
		$(doc.selector+' > div').each(function(index){
			var i=index+1;
			$(this).addClass('chapter').attr('id','chapter'+i);
			});	

		if(doc.docSettings.chapterfullpage){
				$('.chapter').fullpage();//.addClass('fullpage');		
			}
		
		if(doc.docSettings.chapterbuttons){
			var buttons = doc.docSettings.chapterbuttons.split(',');
			var btn={}
			for(var x=0;x<buttons.length;x++){
				btn[buttons[x]]=buttons[x];
				}
			
			$(doc.selector).find(".chapter h2").wrap('<div class="chapterbar scrollnav"/>');
			$(doc.selector).find(".chapterbar").append('<div class="buttonsbar pull-right"/>');
		//addClass('scrollnav');
			if(btn.top){
				$(doc.selector).find(".buttonsbar").append(' <a class="btn btn-default" href="'+doc.selector+'" title="Go to top"><span class="glyphicon glyphicon-arrow-up"/></a>')
				}
			
			if(btn.prev){
				$(doc.selector).find(".buttonsbar").append(' <a class="btn btn-default '+btn.prev+'" href="" title="Previus"><span class="glyphicon glyphicon-arrow-left"/></a>');
				
				$(doc.selector).find('.'+btn.prev).each(function(index){
					var i=index+1;
					
					if(index==0){$(this).hide()}
		
					var prevId=$('body').find(this).closest('.chapter').prev('.chapter').attr('id');
					$(this).attr("href","#"+prevId);				
				});
			}	
			
			if(btn.next){
				$(doc.selector).find(".buttonsbar").append(' <a class="btn btn-default '+btn.next+'" href="" title="Next"><span class="glyphicon glyphicon-arrow-right"/></a>') 
				$(doc.selector).find('.'+btn.next).each(function(index){
					var i=index+1;
		
					var nextId=$('body').find(this).closest('.chapter').next('.chapter').attr('id');
					
					if(!nextId){$(this).hide();}
					$(this).attr("href","#"+nextId);
			
				});	
			}
			
			
		}
		
		
		//prettify document
		if(doc.docSettings.prettify){
			$.fn.prettyPre();
			}
		
		//scroller
		if(doc.docSettings.scroller){
			$.fn.scroller({
				delta:doc.docSettings.scrollerdelta
				});
			}
		globset['scrollerdelta']=doc.docSettings.scrollerdelta;	
		
		//sort
		if(doc.docSettings.sortlist){
			$.fn.sortlist();
			}
		
			
		}

	
	$.fn.docPlugin.defaults={
		chapterfullpage: true,
		chapterbuttons: "top,prev,next",
		prettify:true,
		scroller:true,
		scrollerdelta:$('.navbar:first').height(),
		sortlist:true,
	};

/*****
 * Make a pretty 'pre' for your code
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 * source of inspiration 
 * http://stackoverflow.com/questions/4631646/how-to-preserve-whitespace-indentation-of-text-enclosed-in-html-pre-tags-exclu
 * https://perishablepress.com/perfect-pre-tags/
 * */
	$.fn.prettyPre = function (){
		
		var selector=''
		if(this.selector){
			selector=this.selector
			}
		else selector='pre';	
		
		$(selector).addClass('pretty-pre');
		
		var preEl=$('.pretty-pre');

		for (var i = 0; i < preEl.length; i++)
			{	
			var content = $(preEl[i]).html()
					.replace(/[<>]/g, function(m) { return {'<':'&lt;','>':'&gt;'}[m]})
					.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>')
					;						
			var tabs_to_remove = '';

			while (content.indexOf('\t') == '0')
			{			
			  tabs_to_remove += '\t';
			  content = content.substring(1);			  
			}
			var re = new RegExp('\n' + tabs_to_remove, 'g');
			content = content.replace(re, '\n');              
			$(preEl[i]).html(content);
			}	
		};

/***********************
 * Tocfy plugin
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 * 
 * Set options also by data-(option) in the
 * documentSelector, default: #document
 * 
 * options:
 *  deepness:'123456', //a string of numbers from 1 to 6 defines how deep is your menu
 *	tocside: right, //choose :right|left|top
 *	tocbehavior: scroll //choose:scroll|scrollFixed|fixed|offcanvas
 *  offcanvasBtn: '#main' //if set offcanvas toc prepend here the butto for the sliding
 * 	tocliststyle: "ul square" //options: ol (decimal numbered list),ul square|circle|disc (unordered list)
 **********************/
	$.fn.tocfy = function (options){
		
		if(this.selector){
			documentSelector=this.selector;
			}
		else if(this.jquery){
			if(options.documentSelector){
				documentSelector=options.selector;
				}
			else{
				documentSelector=globset.documentSelector;
				}
			}	
		else{
			documentSelector=$.fn.docPlugin.defaults.documentSelector;
			}
			
		$(documentSelector).addClass('tocfy');
		var tocfyarea=$('.tocfy');

		var defaultsOpt = {
				documentSelector: documentSelector,
				deepness:'123456',
				tocside : 'right',
				tocbehavior: 'scroll', 
				offcanvasBtn: '#main',
				tocliststyle: "ol",
				scrollerdelta:$('.navbar:first').height()
			};


        //Add defaults to options 
        var settings = $.extend({}, defaultsOpt, options);
        
        //Overwrite settings passed by plugin object with 
		//settings passed by data-* attribute
		var setByData=tocfyarea.data();
		var settings = $.extend({}, settings,setByData);
        
        /*if (toc.length > 1) {
            this.each(function() { $(this).pluginName(options) });
            return this;
        }*/
	
		var deepness=settings.deepness;
		var tocside=settings.tocside;
		var tocbehavior=settings.tocbehavior;
		var tocliststyle=settings.tocliststyle;
		
		tocliststyle=tocliststyle.split(' ');
		
		//Build the toc
		tocfyarea.wrap( '<div class="docrow row"></div>' )
		.before('<nav class="toc list-group hidden-print hidden-xs hidden-sm" />')
		.wrap('<div class="docmain" role="main" />');
		
		$('.toc').wrap('<div class="compl" role="complementary"/>');
		
		
		var preData={
			fixed:'',
			col1:'',
			col2:'',
			pull:'',
			rowoffcanvas:''
			};
		
		if(tocside=='top') 
			{
				preData.col1='12'; 
				preData.col2='12';
			}
		else  
			{
				preData.col1='9'; 
				preData.col2='3';
				
				var tocTop = tocfyarea.offset().top;
				var nh=0;
				if($('.navbar-fixed-top')[0]){
					nh=$('nav.navbar').outerHeight();
				}
				
				if(tocside=='right'){preData.pull='pull-right';}

				if(tocbehavior=='scrollFixed') {
					var menu = $('.toc'); 
					$(window).scroll(function() {
				    if ($(window).scrollTop() > tocTop-nh){
							menu.css({
					        'position': 'fixed',
					        'top': nh+5,
					        'z-index':1300,
					        //'width':cw+'px'
					      });
						}
					    else{
					      menu.css({
					        'position': 'relative',
					        'top': 'auto',
					        //'width':cw+'px'
					      });
					   }
					   
					   
					});					
					
				}				
				else 
				if(tocbehavior=='fixed') {
					preData.fixed={'data-spy': "affix"};
					$('.toc').css('top',nh);
					//$('.toc').css('width',cw);
					}
				else if(tocbehavior=='offcanvas') {
					preData.rowoffcanvas=" row-offcanvas row-offcanvas-"+tocside;
					preData.col1='12'; 
					preData.col2='6';
					
					var offcanvasButton = '<div id="offcanvas-button-container"><button type="button" class="offcanvas-button btn-mobile" data-toggle="offcanvas"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button></div>';
			
					$( settings.offcanvasBtn ).prepend(offcanvasButton);
		
					$('[data-toggle="offcanvas"]').click(function () {
						$('.row-offcanvas').toggleClass('active')
					});
					
				}		
			}
		
		//Post-build
		$('.docrow').addClass(preData.rowoffcanvas);
		$('.toc').attr(preData.fixed);
		$('.docmain').addClass("col-md-"+preData.col1);
		$('.compl').addClass("col-md-"+preData.col2);
		$('.compl').addClass(preData.pull);
		
		var cw=$('.compl').width();
		$('.toc').css('width',cw);

		var i=1;
		
		tocfyarea.find(':header' ).each(function() {
			var id = $(this).closest( ".tocfy" ).attr('id');
			$(this).attr('id', id+i++);
			$(this).addClass('toc-item');
			});
		
		var itemSelector = '.toc-item';
		var all = $(itemSelector);
		var nodes = []; 
		for(var i = all.length; i--; nodes.unshift(all[i]));
		var result = document.createElement(tocliststyle[0]);
		
		
		buildRec(nodes,result,2,deepness);
		
		$(result).addClass('scrollnav nav-stacked');//.css('list-style-type',tocliststyle[1]);
		
		
		if(tocliststyle[0]=='ul'){
			$($(result).find('ol').get().reverse()).each(function(){
				$(this).replaceWith($('<ul style="list-style-type:'+tocliststyle[1]+'">'+$(this).html()+'</ul>'))
			})
		}
		
		$(".toc").append(result);
		
	
		if(settings.scrollerdelta){
			$.fn.scroller({
					delta:settings.scrollerdelta
					});
				}
	
	};
	
/**********************
 * Build Toc Nodes
 * buildRec() source: http://jsfiddle.net/fA4EW/
 * *****************/
	function buildRec(nodes, elm, lv,tocatch) {
	    var node;
		var reg='^h['+tocatch+']';
		var reg = new RegExp(reg,"i");
		do {
			node = nodes.shift();  
			} 
	    while(node && !(reg.test(node.tagName)));
	    
	    // process the next node
	    
	    if(node) {
	        var ol, li, cnt;
	        var curLv = parseInt(node.tagName.substring(1));
		        if(curLv == lv) { // same level append an il
		            cnt = 0;
		        } else if(curLv < lv) { // walk up then append il
		            cnt = 0;
		            do {
		                elm = elm.parentNode.parentNode;
		                cnt--;
		            } while(cnt > (curLv - lv));
		        } else if(curLv > lv) { // create children then append il
		            cnt = 0;
		            do {
		                li = elm.lastChild;
		                if(li == null)
		                    li = elm.appendChild(document.createElement("li"));
		                elm = li.appendChild(document.createElement("ol"));
		                cnt++;
		            } while(cnt < (curLv - lv));
		        }
		        li = elm.appendChild(document.createElement("li"));
		        
		        // set anchors
		        li.innerHTML = '<a href="#'+node.id+'" role="menuitem">'+node.innerText+'</a>';
		        // recursive call
		        buildRec(nodes, elm, lv + cnt,tocatch);
	    }
	}	

/*********************
 * Scroller
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 ********************/
	$.fn.scroller = function (options){
		
		if(this.selector){
			options.selector=this.selector
			}
		
		var defaults = {
			selector : '.scrollnav',
            delta: 0,    
        };
        var settings = $.extend({}, defaults, options);
		
		var selector=settings.selector;

		var delta=settings.delta;

		//$(this).each(function(){
			$(selector).find("a[href^='#']").on('click', function(e) {
			// prevent default anchor click behavior
			e.preventDefault();
			history.pushState({}, '', this.href);
			// store hash
			var hash = this.hash;

		   //create and define the target
		   var target;
		   if(hash=='#home') target=0;
		   else target = $(hash).offset().top;
	   
	   // animate
	   $('html, body').animate({
	       scrollTop: target-delta
	     }, 1000);
	
		});
	//});
	}

/***********************
 * Tabfy plugin
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 * options:
 * 	selector: the class for the items you want to tab
 * 	tabnav: tab|pill : according to bootstrap spec you can choose tab or pill
 * 	tabfade: true|false : add a fading effect to tabs
 **********************/
	$.fn.tabfy = function (options){
		if(this.selector){$(this.selector).addClass('tabfy');}
		
		var obj=$('.tabfy');
		
		var defaults = {
			tabnav : 'tab',
			tabfade : true
        };
        
        var settings = $.extend({}, defaults, options);
		
		
		$(obj).each(function(index){
		var labels = [];
		var contents = [];
		var i=0;	

		$(this).wrapInner('<div class="original-text" />')
		.prepend('<ul class="nav autotabs" role="tablist" />')
		.find('ul.nav').after('<div class="tab-content" />');

		var data=$(this).data();
		var settings = $.extend({}, data, settings);
		
		var nav=settings.tabnav;
		var fade=settings.tabfade;
		
		var fading='';
		if(fade==true) {fading='fade';}

		$(this).find('.nav').addClass('nav-'+nav+'s');
		
		$(this).find('.tabitem').each(function(index) {
			
			var connector= $(this).text();
			
			connector=connector.replace(/ /g, '');
			var first='';
			if(index==0){first='class="active"';}
			
			var label = '<li role="presentation"><a href="#'+connector+'" aria-controls="'+connector+'" role="tab" data-toggle="'+nav+'">'+$(this).text()+'</a></li>';		
			var content= '<div role="tabpanel" class="tab-pane '+fading+'" id="'+connector+'">'+$(this).next().html()+'</div>';	
			labels.push(label);
			contents.push(content);
			i++
		});
		
		var tabs = labels.join('');
		var tcont = contents.join('');

		$(this).find('ul.nav.autotabs').append(tabs);
		$(this).find('.tab-content').append(tcont);	
		
		//
		
		//$(this).find('ul.nav.autotabs a:first').tab('show');
		
		$(this).find( 'ul.nav.autotabs a:first' ).click();
		$(this).find('ul.nav.autotabs li:first').addClass('active');
		$(this).find( ".original-text" ).remove();
		});
		
	}	

/***********************
 * Fullpage plugin
 * set element min-height to 100% of page
 * should be combined with css background:cover
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 **********************/
	$.fn.fullpage = function (options){
		
		if(!options){var options={};}
			
		var defaults = {
			
            delta: 0,
        };
        
        var settings = $.extend({}, defaults, options);

		var wh = $(window).height();
		
		if(this.selector){
			$(this.selector).css('min-height',(wh-settings.delta));
		}
		else{
			$('.fullpage').css('min-height',(wh-settings.delta));
		}
	
	}	
		
/*********************
 * Footnotes
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 ********************/
	$.fn.footnotes = function (options){
		
		//default options.
        var settings = $.extend({
            viewNotes: true, // true,false,'collapse',	
            buttonLabel: "See footnotes",
            //popover settings
            popover: true,
            container: $.fn.docPlugin.defaults.documentSelector,
            html : true,
            trigger: "hover",
			placement: "auto bottom"
        }, options );
		
		var i=1;
		
		//Show/hide the footnotes block	
		if(!settings.viewNotes) {
			settings.popover=true;
			$('#footnotes').hide();
			settings.trigger='click';
			}

		
		var content=[];
		//Build footnotes and backref
		$('#footnotes > div').not('.clearfix').each(function(index){
			var i=index+1
			content.push($(this).html());
			$(this).attr('id','footnote'+i).addClass('scrollnav');
			$(this).prepend('<a class="doc-footnote" style="float:left" href="#doc-footnote'+i+'">'+i+'. </a>');
		});	
		
			
		//Build references
		$('span.footnote').each(function(index){
			var i=index+1;
			if(settings.viewNotes){
				$(this).addClass('scrollnav');
				}
			$(this).append('<sup>[<a id="doc-footnote'+i+'" class="footnotelink" href="#footnote'+i+'"><sup>'+i+'</a>]</sup>');
			if(settings.popover){
				$(this).data('content', content[index]);
				$(this).popover({
					animation:true,
					container: settings.container,
					html : settings.html,
					trigger: settings.trigger,
					placement: settings.placement
					});
			}
			
			
			
		});
		
		$('.footnotelink').on('click', function(e) {
				e.preventDefault();
				var fid=$(this).attr('id');
				fid=fid.replace("doc-",'');
				$("#footnotes > div").removeClass('selected');
				$('#'+fid).addClass('selected');
				
			});
			
		
			
		if(settings.viewNotes=="collapse"){	
			
			$('#footnotes').addClass('collapse').before('<a class="btn btn-primary" data-toggle="collapse" href="#footnotes" aria-expanded="false" aria-controls="footnotes">'+settings.buttonLabel+'</a>');
			
			$('.doc-footnote').on('click', function(e) {
				e.preventDefault();
				$('#footnotes.collapse').removeClass('in');
			});

			
			$('.footnotelink').on('click', function(e) {
				e.preventDefault();
				$('#footnotes.collapse').addClass('in');
			});
		}

		$.fn.scroller({
			delta:globset.scrollerdelta
			})		
	}

/*********************
 * Sortlist
 * sort any list in a container with class .sorted 
 * by Alfredo Cosco 2019
 * @orazio_nelson
 * alfredo.cosco@gmail.com
 ********************/
	$.fn.sortlist = function(options){
		
		var selector='';
		if(this.selector){
			selector=this.selector;
			}
		else selector = '.sorted';
		
		var defaults = {			
            sort: 'asc',
        };
        
        var settings = $.extend({}, defaults, options);

		$(selector).each(function(){
			var dataSort=$(this).data();
			
			var settings = $.extend({}, settings, dataSort);
			
			var mylist=$(this);
			var listitems = $(this).find('li').get();

			if(settings.sort=='desc'){
				sortDesc(listitems)
				}
			else {
				sortAsc(listitems)
				}
				
			$.each(listitems, function(idx, itm) { 
				mylist.append(itm); });
		});	
	}
	//Private methods for sorting
	function sortAsc(items){
		items.sort(function(a, b) {
				return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
			})
		}

	function sortDesc(items){
		items.sort(function(a, b) {
				return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
			}).reverse()
		}

}( jQuery ));

