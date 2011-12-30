// Report the code coverage in the page (very hacked together at the moment)
Jscov.prototype.report = function(){
  
  
  // Add in some styles
  var styles = document.createElement('style');
  styles.innerHTML = '.covFile{font-family: Arial, "MS Trebuchet", sans-serif;}.covFile h2{border-top:1px solid #ccc;}.covFile h2 span{font-size:.6em;color:#777;font-weight:normal;}.covFile li{color:#ccc;font-size:.8em;font-family: courier, monospace;white-space:pre;background-color:#fdd;}.covFile li.called{background-color:#cfc;}.covFile li span{color:#000;}.covFile li .count{color:#000;width:20px;display:inline-block;}div.lines{white-space:pre}div.lines span{border:1px dotted #000; background-color:#fdd} div.lines span.called{background-color:#cfc}';
  document.head.appendChild(styles);
  
  for(var k in this.data.files){
    
    var src = this.data.files[k].join('\n');
    
    // window.tparse =  parser.parse(src, false, true);
    // var blocks = _(tparse).chain().flatten().filter(function(x){return x && x.name}).value();
    
    var calls = this.data.calls[k];

    
    var blocks = _$jscov.instrumentalObjects(src);
    var starts = _(blocks).chain().map(function(k,i){
                        // console.log(_(calls).include(i));
                        var s = _(k.start).clone(); 
                        s.tagType = 'start';
                        s.name = k.name;
                        s.called = _(calls).include(i);
                        return s}).value();

    var ends = _(blocks).chain().map(function(k){
                        var s = _(k.end).clone(); 
                        s.tagType = 'end';
                        s.name = k.name;
                        return s}).value()

    var all = _.flatten([starts, ends]);
    
    var byLine = _(all).groupBy(function(stop){
      return stop.line;
    });
    _(byLine).each(function(line,k){
      byLine[k] = _(line).sortBy(function(i){
        return (i.col*-1) - (i.tagType == 'end' ? 0.1 : 0);// - (i.tagType -= 'end' ? 0.1 : 0);
      });
    });
    
    // console.log(byLine);
    var ins = function(str1, i, str2){
       return str1.substr(0,i) + str2 +  str1.substr(i);
    };
    // put in the tags
    var lines = this.data.files[k].slice(0);
    var htl = _(lines).map(function(line, i){
      _(byLine[i]).each(function(p){
        // var called = _$jscov.data.calls
        lines[i] = ins(lines[i], p.col, p.tagType == 'start' ? '<span class="blk '+p.name + (p.called ? ' called' : '')+'">' : '<!--'+p.name+'--></span>');
        // console.log(p);
      });
    });
    // console.log(lines.join('\n'));
    var xlines = lines;
    // 
    // console.log(starts, ends, all, _(all).groupBy(function(stop){
    //   return stop.line;
    // }));
    // 
    
    
    
    var file = document.createElement('div'); file.setAttribute('class','covFile')

    var title = document.createElement('h2'); title.innerHTML = k; file.appendChild(title);
    
    
    var linediv = document.createElement('div');
    linediv.innerHTML = xlines.join('\n'); linediv.setAttribute('class','lines');
    file.appendChild(linediv);

    document.body.appendChild(file);
  }
};