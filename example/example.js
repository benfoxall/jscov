var Menu = function(prefs){
  this.prefs = prefs;
};

Menu.prototype.food = function(){
  var problems = {yup:'couldn\'t',
      work:'now'};
      
  problems.x = 'YO!'
    
  
  if(this.prefs.likesBacon){
    return "Bacon!";
  } else {
    return "Bacon?";
  }
};

Menu.prototype.drink = function(){
  return "Milkshakes";
};


function nevercalled(){
  
}

var alsoNeverCalled = function(){
  
}


// The way that the code is instrumented will mean that 
// this will return 'problem' instead of 'cool'
function f1(){
  if(false)
    return "problem";
  return "cool";
};

// which can kind of be fixed
function f2(){
  if(false){
    return "problem";
  } else {
    return "cool";
  }
};