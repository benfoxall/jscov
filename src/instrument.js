// instruments any linked scripts and then re-inserts them

var instrument = function(scriptsrc, key){
  // store the lines on this file
  window._$jscov.data.files[key] = scriptsrc.split("\n");
  
  var lines = scriptsrc.split("\n");
  var lasti = -1;
  for (var i=0; i < lines.length; i++) {
    
    if(lines[i].match(';[ ]*$') || 
       lines[i].match('[^:][ ]*\{[ ]*$') ||
       lines[i].match('^[ ]*$') ){
      
      var log = ';_$jscov.log("'+key+'",'+(lasti+1)+','+(i+1)+');';
      lasti = i;
      
      if(lines[i].match('(return|break|continue|throw|//)')){
        // put before
        lines[i] = log + lines[i];
      } else {
        // put after
        lines[i] = lines[i] + log;
      }
    }
    
  }
  return lines.join("\n");
};


var replaceScript = function(script){
  
  var callback = function(scriptContent){
    var scriptElement = document.createElement('script');
        scriptElement.setAttribute('type','text/javascript');
        
    scriptElement.innerHTML = instrument(this.responseText, script.src);
    
    script.parentNode.insertBefore(scriptElement, script);
  }
  
  
  var oXHR = new XMLHttpRequest();
  oXHR.onreadystatechange = function() {  
    if (oXHR.readyState === 4) { callback.apply(oXHR); }  
  };  
  oXHR.open("GET", script.src, false);// synchronously
  oXHR.send(null);
  
}

// go backwards through the scripts (so that inserting scripts won't cause misses)
for(var i = document.scripts.length - 1; i >= 0; i--){
  var script = document.scripts[i];
  
  if(script.type == 'text/x-cov-javascript'){
    replaceScript(script);
  }
}
