app = angular.module('testModule', []);


app.controller('UploadFilesCtrl', ['$scope', '$http', function($scope, $http, workerService){
		$scope.dynamic=0;
		
		
		

		$scope.uploadFiles = function(files){
			var filenames = []
			var filenames= [];
			
			for (i=0; i<files.length; i++){
				filenames.push({name:(files[i].name), status:0});
			}

			// $scope.dynamic=100;
			$scope.filenames = filenames;
			$scope.files = files;
			$scope.$apply();	
		};

		$scope.saveFilesToServer = function(){
			var reader = new FileReader();
			var pixels, rows, cols, svg, ready;
			var filename = 0;
			var ready = true;

			console.log($scope.files.length);
			reader.onload = function(file){
				//GET DICOM FILE DATA
				var arrayBuffer = reader.result;
				var byteArray = new Uint8Array(arrayBuffer);
				var dataSet = dicomParser.parseDicom(byteArray);
				pixels = new Uint16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset);
				pixels = [].slice.call(pixels)
				rows = dataSet.uint16('x00280010');
				cols = dataSet.uint16('x00280011');

				//CREATE SVG WITH AND ADD DICOM PIXEL DATA
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
				svg = d3.select(svg)
					    .attr('width', cols)
						.attr('height', rows);

				// var pixelsGroup = svg.append('g');


				svg.selectAll('line').data(pixels).enter().append('line')
					.attr('x1', function(d, i){ return Math.floor(i%cols)})
					.attr('x2', function(d, i){ return Math.floor(i%cols)+1})
					.attr('y1', function(d, i){ return Math.floor(i/cols)})
					.attr('y2', function(d, i){ return Math.floor(i/cols)+1})
					.attr('stroke-width', 5)
					.attr('stroke', function(d, i){
						var pixel = Math.round(d/8);
						var rgb = (pixel*0x010101).toString(16);
						return d3.rgb('#'+rgb);
					});				
			}

			reader.onloadend=function(){
					var ser = new XMLSerializer();
					var svgStr = ser.serializeToString(svg[0][0]);
					
					
					$http.post('/test', {svgHTML:svgStr, filename: (filename+1).toString()}).success(function(){
						//UPDATE PROGRESS BAR
						$scope.dynamic = Math.floor((filename/($scope.files.length))*100)
					

					});
					$scope.filenames[filename]['status']=1;
					filename += 1;
					
					if (filename<$scope.files.length){
						reader.readAsArrayBuffer($scope.files[filename]);
				}
			
			}

			reader.readAsArrayBuffer($scope.files[filename]);
		}
}]);




app.directive('fileSelector', function(){
	return{
		scope:{target:'='},
		restrict: 'E',
		templateUrl: 'javascripts/directives/fileUploader.html',
		replace: true,
		link: function(scope, element, attrs){
			element.bind('change', function(){
				var filesToUpload = element.find('input')[0].files;
				scope.$parent.uploadFiles(filesToUpload)});
		}
	}		
});