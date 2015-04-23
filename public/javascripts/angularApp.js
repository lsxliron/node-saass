var app = angular.module('saass', ['testModule', 'ui.bootstrap', 'ngRoute']);

// app.config(['$routeProvider', function($routeProvider){
// 	$routeProvider.when('/us', {
// 		templateUrl:'../../views/uploadStudy.ejs',
// 		controller:'UploadStudyCtrl'
// 	});


	// $routeProvider.when('/doWork.js', {
		// templateUrl:'doWork.js',
		// controller:'workerService'
	// });
// }]);


app.controller('UploadStudyCtrl', ['$scope', function($scope){
	$scope.msgAng = 'ANGULAR!!!';
}]);

app.controller('DicomDivCtrl', ['$scope', function($scope){

	var imageId = 'dicomweb:images/IMG0068.dcm';
	// var imageId = 'dicomweb:images/I74.png';
	// var el = document.getElementById('dd');

	var el = angular.element(document.getElementById('dd'))[0];
	// cornerstone.enable(el);
	cornerstone.enable(el);
	
	
	
	cornerstone.loadImage(imageId).then(function(image){
		cornerstone.displayImage(el, image);
	});



	$scope.ttest = function(){
		var ell = angular.element(document.getElementById('dd'))[0];
		console.log(cornerstone.getStoredPixels(ell,0,0,10,10));
	}

	

}]);

app.controller('TestCtrl', ['$scope', function($scope){
	$scope.ttest = function(){
		var el = angular.element(document.getElementById('dd'))[0];
		console.log(cornerstone.getStoredPixels(el,0,0,10,10));
	};

}]);

app.controller('ParseDicomCtrl', ['$scope', function($scope){
	// var reader = FileReader();
	// reader.onload = function(file){

	// }
}]);


app.controller('UploadFileCtrl', ['$scope', function($scope){
	$scope.parseFile = function(){
		var file = document.getElementById('fileSelector').files[0];
		var reader = new FileReader();
		var pixels;
		var rows;
		var cols;
		reader.onload = function(file){
			var arrayBuffer = reader.result;
			var byteArray = new Uint8Array(arrayBuffer);
			var dataSet = dicomParser.parseDicom(byteArray);
			pixels = new Uint16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset);
			rows = dataSet.uint16('x00280010');
			cols = dataSet.uint16('x00280011');
		};

		reader.readAsArrayBuffer(file);
		reader.onloadend = function(){
			if (pixels.length>0){alert('1')}
			var i=0
			var rPixels = []
			var gPixels = []
			var bPixels = []
			var p = new PNGlib(rows, cols, 256);
			var x = 0;
			var y = 0;
			while (i<pixels.length){
				rPixels.push(pixels[i]);
				gPixels.push(pixels[i+1]);
				bPixels.push(pixels[i+2]);
				p.buffer[p.index(x,y)]= p.color(pixels[i], pixels[i+1], pixels[i+2], 0);
				if (x==cols){y+=1;x=0}
				else{x+=1}
				i+=3;
			}
			document.write('<img src="data:image/png;base64,'+p.getBase64()+'">');
			

		}
	};
}]);





app.controller('TestSVGCtrl', ['$scope', function($scope){
	$scope.parseFile = function(){
		var file = document.getElementById('fileSelector').files[0];
		var reader = new FileReader();
		var rows;
		var cols;
		var pixels;

		reader.onload = function(file){
			var arrayBuffer = reader.result;
			var byteArray = new Uint8Array(arrayBuffer);
			var dataSet = dicomParser.parseDicom(byteArray);
			pixels = new Uint16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset);
			rows = dataSet.uint16('x00280010');
			cols = dataSet.uint16('x00280011');
			pixels = [].slice.call(pixels)
			console.log(pixels.length, rows, cols, Math.max(pixels));

			// for (i=0; i<10; i++)
			console.log(pixels);

			var i=0
			var SC=5;

			var svg = d3.select('#testSVG').attr('width', SC*cols).attr('height', SC*rows);
			var rectGroup = svg.append('g');
			// rectGroup.selectAll('rect').data(pixels).enter().append('rect')
			// 	.attr('x', function(d, i){ return Math.floor(i%cols)})
			// 	.attr('y', function(d, i){ return Math.floor(i/cols)})
			// 	.attr('width', 1)
			// 	.attr('height', 1)
			// 	.attr('fill', function(d, i){
			// 		var pixel = Math.round(d/8);

			// 		var rgb = (pixel*0x010101).toString(16);
			// 		return d3.rgb('#'+rgb);
			// 	})   //rect = svg.selectAll('rect').data([1]).enter().append('rect').attr('x',1).attr('y',1).attr('width',10).attr('height',10).attr('color','black')
			// 	.attr('transform','scale(5)')

			rectGroup.selectAll('line').data(pixels).enter().append('line')
				.attr('x1', function(d, i){ return Math.floor(i%cols)})
				.attr('x2', function(d, i){ return Math.floor(i%cols)+1})
				.attr('y1', function(d, i){ return Math.floor(i/cols)})
				.attr('y2', function(d, i){ return Math.floor(i/cols)+1})
				.attr('stroke-width', 5)
				// .attr('stroke','red')
				.attr('stroke', function(d, i){
					var pixel = Math.round(d/8);
					var rgb = (pixel*0x010101).toString(16);
					return d3.rgb('#'+rgb);
			})
				.attr('transform', 'scale('+SC+')');


			
		}

		reader.readAsArrayBuffer(file);
		

		// var i=0;
		
		
		// var svg = d3.select('testSVG');
		// $('#testSVG').width(cols);
		// $('#testSVG').height(rows);
		// svg.selectAll('rect').data(pixels).append('rect')
		// 	.attr('x', function(d, i){ return i%cols})
		// 	.attr('y', function(d, i){ return i%rows})
		// 	.attr('width', 1)
		// 	.attr('height', 1)
		// 	.attr('fill', function(d, i){
		// 		var pixel = Math.round(d/8);
		// 		var rgb = pixels*0x010101.toString(16);
		// 		return rgb;
		// 	});
	}
}]);


app.controller('NodeTestCtrl', ['$scope', '$http', function($scope, $http){
	$scope.js = "A"

	$scope.jsonTest = function(){
		// var svg = angular.element(document.getElementById('testSVG'));
		// var svg = angular.element($('#testSVG')).html();
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		console.log(svg);
		
		// var svg = angular.element(svgAng)[0];
		$http.post('/test', {svg:'<svg id="svg"</svg>',t:'t'}).success(function(res){$scope.js=res});
		// $scope.js = document.getElementById('testSVG').html;
	}

	

}]);

app.directive('dicom', function(){
	return{
		restrict: 'E',
		replace:true,
		templateUrl: 'javascripts/directives/dicomDiv.html',
		controller: 'DicomDivCtrl'

	};
});


