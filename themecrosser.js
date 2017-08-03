(function(window) {
  var old$=window.jQuery||{};
  (function(new$) {
	if (window.$==window.jQuery) {
		window.$=new$;
	}
	window.jQuery=new$;
  })((function($) {
    var classMap={
		//other
			"ui-state-active":"active",
			//"ui-state-focus":"",
			
			"active":"ui-state-active",
		//accordion
			"ui-accordion-header":"card-header",
			"ui-accordion-header-collapsed":"rounded",
			"ui-accordion-content":"card-block",
	    //btn
			"btn":"ui-button",
			"btn&btn-primary":"ui-button .ui-priority-primary",
			"btn&btn-secondary":"ui-button .ui-priority-secondary",
			"btn&btn-warning":"ui-button .ui-state-highlight",
			"btn&btn-danger":"ui-button .ui-state-error",
			
			"ui-button":"btn btn-primary!card",
			"ui-button&.ui-state-highlight":"btn btn-warning!btn-primary",
			"ui-button&.ui-state-error":"btn btn-danger!btn-primary",
			"ui-button&.ui-priority-primary":"btn btn-primary",
			"ui-button&.ui-priority-secondary":"btn btn-secondary!btn-primary",
		//checkboxradio
			"ui-checkboxradio-label":"form-check-label",
			"ui-checkboxradio":"form-check-input",
			
			"form-check-label":"ui-checkboxradio-label",
			"form-check-input":"ui-checkboxradio",
		//controlgroup
			"ui-controlgroup":"btn-group",
		//corners
			"ui-corner-all":"rounded",
			"ui-corner-top":"rounded-top",
			"ui-corner-bottom":"rounded-bottom",
			"ui-corner-left":"rounded-left",
			"ui-corner-right":"rounded-right",

			"rounded":"ui-corner-all",
			"rounded-top":"ui-corner-top",
			"rounded-bottom":"ui-corner-bottom",
			"rounded-left":"ui-corner-left",
			"rounded-right":"ui-corner-right",
		//dialog
			"ui-dialog":"modal-dialog",
			"ui-dialog-titlebar":"modal-header",
			"ui-dialog-title":"modal-title",
			//"ui-dialog-titlebar-close":"close",//won't work in reverse
			"ui-dialog-content":"modal-body",
			"ui-dialog-buttonpane":"modal-footer",
			
			"modal-dialog":"ui-dialog",
			"modal-header":"ui-dialog-titlebar",
			"modal-title":"ui-dialog-title",
			"modal-body":"ui-dialog-content",
			"modal-footer":"ui-dialog-buttonpane",
			//ui-resizable-handle does nothing at the current time.
		//menu
			"ui-menu":"dropdown-menu!card-block",
			"ui-menu-item":"dropdown-item",
			"ui-menu-divider":"dropdown-divider",
			
			"dropdown-menu":"ui-menu",
			"dropdown-item":"ui-menu-item",
			"dropdown-divider":"ui-menu-divider",
		//progressbar
			"ui-progressbar":"card!card-block",
		//selectmenu
			//selectmenu doesn't work yet
		//slider
			"ui-slider-handle":"btn btn-secondary btn-sm",
			"ui-slider-handle":"btn btn-primary btn-sm",
		//sr
			"ui-helper-hidden-accessible":"sr-only",
			
			"sr-only":"ui-helper-hidden-accessible",
		//tabs
			"ui-tabs-nav":"nav nav-tabs",//card-header-tabs used to be here
			"ui-tabs-tab":"nav-item nav-link",
			//"ui-tabs-anchor":"nav-link",
		//Widget-card
			"ui-widget":"card",
			"ui-widget-header":"card-header",
			"ui-widget-content":"card-block",

			"card":"ui-widget!rounded rounded-bottom rounded-left rounded-right rounded-top",
			"card-header":"ui-widget-header!rounded rounded-bottom rounded-left rounded-right rounded-top",
			"card-block":"ui-widget-content!rounded rounded-bottom rounded-left rounded-right rounded-top",
	};//"class-name&and-others or-others":"new classes!remove"
	function uniqueArray(names) {
		//var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
		var uniqueNames = [];
		$.each(names, function(i, el){
			if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		return uniqueNames;
	}
    function mod(classes) {
	    	var i,
		    ii,
		    rlist=[],
			nClasses=classes.toString();
		for (ii in classMap) {
			var q=uniqueArray(ii.split(/[\,\s]/g));
			for (var iii=0; iii<q.length; iii++) {
				var qq=uniqueArray(q[iii].split(/&/g)),
					total=0;
				for (var iiii=0; iiii<qq.length; iiii++) {
					var input=uniqueArray(nClasses.split(/[\,\s]/g));
					for (i=0; i<input.length; i++) {
						if (input[i]===q[iiii]) {
							total++;
						}
					}
				}
				if (total===qq.length) {
					var thing=classMap[ii].split("!");//does not need to be linted by uniqueArray()
					nClasses+=" "+thing[0];
					if (thing.length>1) {
						rlist.push.apply(rlist,uniqueArray(thing[1].split(/[\,\s]/g)));
					}
				}
			}
      	}
		rlist=uniqueArray(rlist);
		for (i=0; i<rlist.length; i++) {
			var list=nClasses.split(/[\,\s]/g);
			for(ii=0; ii<list.length; ii++) {
				if (list[ii]==rlist[i]) {
					list[ii]="";
				}
			}
			nClasses=list.join(" ");
			//nClasses=nClasses.replace(new RegExp(rlist[i], "g"),"");//"g" is the global flag for dynamic regexps
		}
    	return nClasses;
    }
    $.fn.extend({
      toggleClass:( function( orig ) {
            return function(value,$switch,duration,easing,complete) {
              var newVal=mod(value);
              orig.call( this, newVal,$switch,duration,easing,complete);
            };
       })( $.fn.toggleClass ),
      addClass:( function( orig ) {
            return function(value,duration,easing,complete) {
              var newVal=mod(value);
              orig.call( this, newVal,duration,easing,complete);
            };
       })( $.fn.addClass ),
      removeClass:( function( orig ) {
            return function(value,duration,easing,complete) {
              var newVal=mod(value);
              orig.call( this, newVal,duration,easing,complete);
            };
       })( $.fn.removeClass ),
      switchClass:( function( orig ) {
            return function(value1,value2,duration,easing,complete) {
              var newVal1=mod(value1),
                  newVal2=mod(value2);
              orig.call( this, newVal1,newVal2,duration,easing,complete);
            };
       })( $.fn.switchClass ),
    });
    return $;
  })(window.jQuery));
})(this);
