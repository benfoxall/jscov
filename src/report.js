// Report the code coverage in the page (very hacked together at the moment)
Jscov.prototype.report = function(){
  
  
  // Add in some styles
  var styles = document.createElement('style');
  styles.innerHTML = '.covFile{font-family: Arial, "MS Trebuchet", sans-serif;}.covFile h2{border-top:1px solid #ccc;}.covFile h2 span{font-size:.6em;color:#777;font-weight:normal;}.covFile li{color:#ccc;font-size:.8em;font-family: courier, monospace;white-space:pre;background-color:#fdd;}.covFile li.called{background-color:#cfc;}.covFile li span{color:#000;}.covFile li .count{color:#000;width:20px;display:inline-block;}';
  document.head.appendChild(styles);
  
  for(var k in this.data.files){
    var lines = this.data.files[k].slice(0);
    var counts = new Array(lines.length);
    for (var i=0; i < this.data.calls[k].length; i++) {
      var fromto = this.data.calls[k][i]
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