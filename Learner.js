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
	function hide(f) {
		f.toString=ret(hideFunc);
		f.toLocaleString=ret(hideFunc);
	}
	function applyDefaults(input,defaults) { //I don't know if I want to keep this function the way it is right now, I may want it to be closer in simmilarity to the corrisponding function in jQuery (it's probabbly not by the same name as what is used here)
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
			module=Learner;//for Node.js
		}else if(typeof define!=="undefined"){
			define("Learner",function() {
				return Learner;//for Require.js and similar tools
			});
		}
		global.Learner=Learner;//For all web browsers (or the like)
	})((function() {//definer
		var Learner=function(e) {
			/*This function builds base constructor.
			  e is the settings for this instance of Learner 
			*/
			e=applyDefaults(e,this.defaults);// uses Learner.prototype.defaults for the defaults
			this.cores[e.core].apply(this,e.coreSettings);
			//passes e.coreSettings (Learner.prototype.defaults.coreSettings) into the core function that is specified in e.core (Learner.prototype.defaults.core)
		};
		hide(Learner);
		
		Learner.prototype={
			//Nothing core specific is defined here, excluding things in the .cores obj
			constructor:Learner,
			toString:ret(null),
			toLocaleString:ret(null),
			database:null,
			defaults:{
				core:"default",   //determines what core is being used
				coreSettings:[],  //passed into core function that is specified in the line above and are specific to the core, not the library in general
			},
			cores:{
				/*All of the learning happens within these cores.
				  Each of these functions are only executed once per instalisation of the Learner object, and are expected to edit the "this" object, as they are executed using the apply function on the this object in the Learner constructor function.
				  The values passed into these functions are dependant on the documentation of each core, and can be entirely different, however, they must be able to handle the default core function values (found @ Learner.prototype.defaults.coreSettings)
				  Note that extensions of this library can add learning cores to this object.
				*/
				"default":function(e) {
					e=applyDefaults(e,{
						thinkInterval:100,//the amount of time between each thought in milliseconds, as it is passed directly to the second argument of setTimeout(). If thinkInterval===false, the bot can't think before it does anything.
						thinkFilter:function(input) { return "thought:"+input;},//an oppertunity to change the thought to a proper input format, if needed.
						reinforcementDecay:.875;//see "this.reinforcement" as defined in this function
						reinforcementDecayLimit:.5;//see "this.reinforcement" as defined in this function
						actionMap:{
							think:function(str) {
								if (!this.thinkInterval) return;
								setTimeout(function() {
									this.action(this.thinkFilter(str));
								},this.thinkInterval);
							},
						},
					});
					
					var self_esteem=0;//The greater the number, the more self-esteem the bot is estimated to have
					Object.defineProperty(this, 'self_esteem', { get: function() { return self_esteem; }, });
					
					this.action=function(e0) {
						/*called on user action, or other enviromential changes*/
					};
					hide(this.action);
					
					this.reinforcement=function(e1) {
						/*user rewards or punishes (positive or negitive reinforcemnt)*/
						
						e1=applyDefaults(e1,{
							val:1,//the value to apply to each string and substring
							reinforcementDecay:e.reinforcementDecay;//before working on an older string, "val" is multiplied by this number
							reinforcementDecayLimit:e.reinforcementDecayLimit;//the limit for how close "val" can be to zero before aborting "recursive" history reinforcement
						});
					};
					hide(this.reinforcement);
				},
				
				"__brickWall__":function(e) {
					e=applyDefaults(e,{
						act:function(str) {//bot acts
							console.log(str);
						},
					});
					this.action=function(str) {//user acts
						e.act(str);
					};
				},
				//"deep":function() {},
				//"Q":function() {},
			},
		};
		return Learner;
	})());

})(this);
