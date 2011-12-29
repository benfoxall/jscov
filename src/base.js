// provides the callbacks for the instrumented js
var Jscov = function(){
  this.data = {
    files:{},
    calls:{}
  };
}

Jscov.prototype.log = function(key, from, to){
  if(!this.data.calls[key]){
    this.data.calls[key] = [];
  }
  this.data.calls[key].push([from, to]);
}

// expose jscov
window._$jscov = new Jscov;
