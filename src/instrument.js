// instruments any linked scripts and then re-inserts them
var instrument = function(scriptsrc, key){
  // store the lines on this file
  window._$jscov.data.files[key] = scriptsrc.split("\n");
  
  // find the places that we can insert markers
  var blocks = _$jscov.instrumentalObjects(scriptsrc);
  // console.log(blocks);
  
  // queue up the blocks that we want to insert, 
  // {line:x, col:y, code:z}
  var toInsert = _(blocks).map(function(b,i){
    return b.name == 'function' ?
      {
        line:b.start.line,
        col:b.start.col,
        frag:'_$jscov.log("'+key+'",'+i+') || '
      } : 
      b.name == 'return' ? 
      {
        line:b.start.line,
        col:b.start.col + 'return '.length,
        frag:'_$jscov.log("'+key+'",'+i+') || '
      } :
      b.name == 'assign' ? 
      {
        line:b.end.line,
        col:b.end.col + 'return '.length,
        frag:';_$jscov.log("'+key+'",'+i+');'
      } :
      b.name == 'block' ? 
      {
        line:b.start.line,
        col:b.start.col + 1,
        frag:';_$jscov.log("'+key+'",'+i+');'
      } :
      {
        line:0,col:0,frag:''
      };
    
  });
  
  // group by line to insert
  var toInsertLines = _(toInsert).groupBy('line');
  
  for (var i = toInsertLines.length - 1; i >= 0; i--){
    toInsertLines[i] = _(toInsertLines[i]).sortBy(function(){
      return i.col * -1;
    })
  };
  
  // console.log(toInsert, toInsertLines);
  
  var lines = scriptsrc.split("\n");
  
  var ins = function(line, i, frag){
      return line.substr(0,i) + frag +  line.substr(i);
  };
  
  _(toInsertLines).each(function(inserts, line){
    _(inserts).each(function(obj){
      lines[line] = ins(lines[line], obj.col, obj.frag);
    })
  });
  
  // console.log(lines.join('\n'));
  
  return lines.join('\n');
  
  /*
  
  return scriptsrc;
  
  console.log(blocks);
  
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
  console.log(lines.join("\n"));
  return lines.join("\n");
  */
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
