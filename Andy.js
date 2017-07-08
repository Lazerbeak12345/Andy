(function(global) {//main wrapper

  (function(Andy) {//globaliser
    if (typeof module!=="undefined") {
      module=Andy;
    }else if(typeof define!=="undefined"){
      define("Andy",function() {
        return Andy;
      });
    }
    global.Andy=Andy;
  })((function() {//definer
    function retNull() {
      return null;
    }
    function retHideFunc() {
      return "function() { (Look at the code if you really want to see how this works! :p) }"
    }
    var Andy=function(e) {//builds
      //logic (e=enviroment)
    }
    Andy.toString=retHideFunc;
    Andy.prototype={
      action:function() {},//user action
      reinforcement:function() {},//user rewards or punishes (positive or negitive reinforcemnt)
      //Basics
      constructor:Andy,
      toString:retNull,
      toLocaleString:retNull,
    }
    return Andy;
  })())

})(this)
