var ThreeDArray = function(inputArr, dims){

	// Add error handler for dims
	// for now require length and width.
	var arr = new Array();
	arr[0] = new Array();
	arr[0][0] = new Array();

	var l = dims.length;
	var c = dims.width;
	
	var j=0;

	for (var i=0; i<inputArr.length; i+=l){
		var partial = inputArr.slice(i, i+l);
		console.log('INPUT:', partial);
		arr[0][j] = partial;
		j += 1;
	}
	this.arr = arr;
}


// var NdArray = class({
// 	initialize: function(inputArr, dims){
// 		var arr = new Array();
// 		arr[0] = new Array();
// 		arr[0][0] = new Array();

// 		var l = dims.length;
// 		var c = dims.width;
		
// 		var j=0;

// 		for (var i=0; i<inputArr.length; i+=l){
// 			var partial = inputArr.slice(i, i+l);
// 			arr[j].concat(partial);
// 			j += 1;
// 		}
// 		this.arr = arr;
// 	}
// 	// toString: function(){
// 		// for (var i=0; i<this.length; i++)
// 			// process.stdout.write(a)
// 	// }
// })




