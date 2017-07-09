(function(global) {//main wrapper
	
	var hideFunc="function() { /*Look at the scource code if you really want to see how this works! :p*/ }";
	function ret(val) {
		var f=function() {
			return val;
		};
		Object.defineProperty(f, 'toString', { get: function() { return ret(hideFunc); } });//prevents stackoverflow error by running ret() only when requested
		Object.defineProperty(f, 'toLocaleString', { get: function() { return ret(hideFunc); } });
		return f;
	}
	function applyDefaults(input,defaults) {
		if (typeof(defaults)==='undefined') {
			return input;
		}else if (typeof(input)==='undefined') {
			return defaults;
		}else if (typeof(input)!==typeof(defaults)) {
			return defaults;
		}
		var output=JSON.parse(JSON.stringify(input)),i;
		for(i in defaults) {
			output[i]=applyDefaults(input[i],defaults[i]);
		}
		output=JSON.parse(JSON.stringify(output));
		for(i in output) {
			output[i]=applyDefaults(input[i],defaults[i]);
		}
		return output;
	}

	(function(Learner) {//globaliser
		if (typeof module!=="undefined") {
			module=Learner;
		}else if(typeof define!=="undefined"){
			define("Learner",function() {
				return Learner;
			});
		}
		global.Learner=Learner;
	})((function() {//definer
		var Learner=function(e) {
			/*This function builds base constructor.
			  e is the settings for this instance of Learner
			*/
			e=applyDefaults(e,this.defaults);
			this.cores[e.core].apply(this,e.coreSettings);
			//passes e.coreSettings into the core function that is specified in e.core
		};
		Learner.toString=ret(hideFunc);
		Learner.prototype={
			//Nothing core specific is defined here, excluding .defaults and .cores
			constructor:Learner,
			toString:ret(null),
			toLocaleString:ret(null),
			defaults:{
				core:"default",   //determines what core is being used
				coreSettings:[],  //passed into core function that is specified above and are specific to the core, not the library in general
				think: true,	  //passes invalid output from bot back too the bot
				thinkInterval:100,//the amount of time between each thought in milliseconds, as it is passed directly to the second argument of setTimeout()
				thinkFilter:function(input) { return input;},//an oppertunity to change the thought to a proper input format, if needed.
			},
			cores:{
				/*All of the learning happens within these cores.
				  Each of these functions are only executed once per instalisation of the Learner object, and add, remove &/or edit the "this" object, as they are executed using the apply function on the this object in the Learner constructor function.
				  The values passed into these functions are dependant on the documentation of each core, and can be entirely different, however, they must be able to handle the default core function values (Learner.prototype.defaults.coreSettings)
				*/
				"default":function(e) {
					e=applyDefaults(e,{
						
					});
					console.log("Default core is being applied.");
					this.action=function() {
						/*user action*/
					};
					this.reinforcement=function() {
						/*user rewards or punishes (positive or negitive reinforcemnt)*/
					};
					
				},
				//"deep":function() {},
				//"Q":function() {},
			},
		}
		return Learner;
	})())

})(this)
