// some basic testing functions
function assert(pass, message){
	return pass || console.error(message);
}
function expect(value){
	var msg = 'expected "' + value + '"';
	return {
		toBe:function(other, message){
			assert(value === other, msg + ' to be "' + other + '" ' + (message || ''));
		},
		notToBe:function(other, message){
			assert(value !== other, msg + ' not to be "' + other + '" ' + (message || ''));
		}
	};
}
