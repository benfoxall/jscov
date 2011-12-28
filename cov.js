// Intrument js files to detect coverage
(function(window, document){
  
  
  // this will be called from the instrumented js files
  var _$_cov = window._$_cov = function(key,from,to){

    if(!_$_cov.store[key]){
      _$_cov.store[key] = [];
    }

    _$_cov.store[key].push([from,to]);
  }
  _$_cov.store={};
  _$_cov.files={};
  
  var toInstrument = [];
  
  for (var i=0; i < document.scripts.length; i++) {
    var script = document.scripts[i];
    
    if(script.type == 'text/x-cov-javascript'){
      toInstrument.push(script);
    }
  }
  
  for (var i=0; i < toInstrument.length; i++) {
    var script = toInstrument[i];
    var cb = function(oscript){
      return function(){
        var scriptElement = document.createElement('script');
        // console.log(this.responseText)
        scriptElement.innerHTML = convert(this.responseText, oscript.src);
        oscript.parentNode.insertBefore(scriptElement, oscript);
      };
    }(script);
    
    loadFile(script.src, cb);
  }
  
  function loadFile (sURL, fCallback) {  
    var aPassArgs = Array.prototype.slice.call(arguments, 2),
        oXHR = new XMLHttpRequest();
    oXHR.onreadystatechange = function() {  
      if (oXHR.readyState === 4) { fCallback.apply(oXHR, aPassArgs); }  
    };  
    oXHR.open("GET", sURL, false);// synchronously
    oXHR.send(null);  
  }
  
  // TODO (the main part) convert the script so that it keeps track of the lines called
  function convert(scriptsrc, key){
    // store the lines on this file
    _$_cov.files[key] = scriptsrc.split("\n");
    
    var lines = scriptsrc.split("\n");
    var lasti = -1;
    for (var i=0; i < lines.length; i++) {
      
      if(lines[i].match(';[ ]*$') || 
         lines[i].match('[^:][ ]*\{[ ]*$') ||
         lines[i].match('^[ ]*$') ){
        
        var log = ';_$_cov("'+key+'",'+(lasti+1)+','+(i+1)+');';
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
  }
  
  
  
  
  // Report the code coverage in the page (very hacked together at the moment)
  _$_cov.report = function(){
    
    
    // Add in some styles
    var styles = document.createElement('style');
    styles.innerHTML = '.covFile{font-family: Arial, "MS Trebuchet", sans-serif;}.covFile h2{border-top:1px solid #ccc;}.covFile h2 span{font-size:.6em;color:#777;font-weight:normal;}.covFile li{color:#ccc;font-size:.8em;font-family: courier, monospace;white-space:pre;background-color:#fdd;}.covFile li.called{background-color:#cfc;}.covFile li span{color:#000;}.covFile li .count{color:#000;width:20px;display:inline-block;}';
    document.head.appendChild(styles);
    
    
    
    for(var k in _$_cov.files){
      var lines = _$_cov.files[k].slice(0);
      var counts = new Array(lines.length);
      for (var i=0; i < _$_cov.store[k].length; i++) {
        var fromto = _$_cov.store[k][i]
        for(var l = fromto[0]; l < fromto[1]; l++){
          counts[l] = (counts[l] || 0) + 1;
        }
      };
      var covered = 0;
      for (var i=0; i < lines.length; i++) {
        if(counts[i]){
          covered++;
        }
      };
      var coverage_text = ' ' + covered + ' of ' + lines.length + ' lines (' + Math.round((covered / lines.length)*10000)/100 + '%)';

      var file = document.createElement('div'); file.setAttribute('class','covFile')

      var title = document.createElement('h2'); title.innerHTML = k; file.appendChild(title);
      
      var coverage = document.createElement('span'); coverage.innerHTML = coverage_text;
      title.appendChild(coverage);

      var linelist = document.createElement('ol');

      for (var i=0; i < lines.length; i++) {
        var line = document.createElement('li');

        var line_count = document.createElement('span'); line_count.setAttribute('class','count');
        line_count.innerHTML = counts[i]||0;
        var line_value = document.createElement('span');
        line_value.innerHTML = lines[i];

        line.appendChild(line_count);
        line.appendChild(line_value);

        if(counts[i]){
          line.setAttribute('class','called')
        }

        linelist.appendChild(line);
      };
      
      // clicking the title displays the code listing
      title.onclick = (function(toggle){
        var displayed = true;
        var change = function(){
          displayed = ! displayed;
          toggle.style.display = displayed ? 'block' : 'none';
        }
        // change();
        return change;
      })(linelist)

      file.appendChild(linelist);

      document.body.appendChild(file);
    }
  };


  
})(window, document);