// provides the callbacks for the instrumented js
var Jscov = function(){
  this.data = {
    files:{},
    calls:{}
  };
}

Jscov.prototype.log = function(key, block){
  if(!this.data.calls[key]){
    this.data.calls[key] = [];
  }
  this.data.calls[key].push(block);
  return false;
}

// expose jscov
window._$jscov = new Jscov;
