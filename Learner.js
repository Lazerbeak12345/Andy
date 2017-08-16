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
	function defOneWayVar(str,v) {
		Object.defineProperty(this,str,{get:function(){return v;}});// no changes to the varuble unless done internally via this core
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
						reinforcementDecay:0.875,//see "this.reinforcement" as defined in this core
						reinforcementDecayLimit:0.5,//see "this.reinforcement" as defined in this core
						actionMap:{
							think:function(str) {
								if (!this.thinkInterval) return;
								setTimeout(function() {
									this.action(this.thinkFilter(str));
								},this.thinkInterval);
							},
						},
					});
					
					var selfEsteem=0,//The greater the number, the more self-esteem the bot is estimated to have
					myHistory=[],//a list of outputs that the bot has sent to a method in the action map
					envHistory=[],//a list of enviromential updates
					allHistory=[],//a list of all enviromential updates and outputs that the bot has sent to a method in the action map
					words={};//all of the sub-strings that have a value asociated with them
					
					//make all of these varubles acccesssable to the enviroment, but not changeable
					def.call(this,'selfEsteem',selfEsteem);//as this number would be more usefull in the enviroment the underscores marking that it is internal is unneccicary
					def.call(this,'__myHistory__',myHistory);
					def.call(this,'__envHistory__',envHistory);
					def.call(this,'__allHistory__',allHistory);
					def.call(this,'__words__',words);
					
					this.action=function(e0) {
						/*called on user action, or other enviromential changes*/
					};
					hide(this.action);
					
					this.reinforcement=function f(e1) {
						/*user rewards or punishes (positive or negitive reinforcemnt)*/
						
						e1=applyDefaults(e1,{
							val:0,//the value to apply to each string and substring - <0 is a punishment >0 is a reward zero does nothing
							reinforcementDecay:e.reinforcementDecay,//before working on an older string, "val" is multiplied by this number
							reinforcementDecayLimit:e.reinforcementDecayLimit,//the limit for how close "val" can be to zero before aborting "recursive" history reinforcement
						});
						
						var i,len,index,part;//prevents a varuble from being redefined at every iteration of a loop, these varubles will be defined via their first usage
						
						for (i=myHistory.length; (i>=0&&e1.val<e1.reinforcementDecayLimit); i--) {//every item in the output history, as long as the reinforcementDecayLimit allows, then leave the loop if the criteria doesn't fit anymore
							
							for (len=(myHistory[i].length); len>1; len--){//the length of the sub-string
								for (index=0; index<(myHistory[i].length-len); index++) {//the position of the sub-string
								
									part=myHistory[i].substr(index,len);//this is the actual sub-string
									
									/*if the sub-string has not been incountered before, make a spot for it to go*/
									if(typeof words[len]==="undefined"){
										words[len]={};
									}
									if(typeof words[len][part]==="undefined"){
										words[len][part]=el.val;
										continue;//in this case it would be a waste of prossessing to set it to zero now then change it later, so just go on to the next sub-string
									}
									
									words[len][part]+=el.val;//this is where the value is actually changed
								}
							}
							
							el.val*=e1.reinforcementDecay;
						}
					};
					hide(this.reinforcement);
				},
				
				"__brickWall__":function(e) {//this can be used as a template for the more simple cores, but if this is an unsatisfactory example, look at the default core.
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
