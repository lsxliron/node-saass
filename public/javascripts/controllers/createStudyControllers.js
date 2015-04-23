app = angular.module('testModule', []);


app.controller('UploadFilesCtrl', ['$scope', '$http', function($scope, $http, workerService){
		$scope.dynamic=0;
		$scope.type="primary";
		
		
		
		//UPDATES THE SCOPE TO SO FILES WILL BE DISPLAYED IN THE TABLE.
		$scope.uploadFiles = function(files){
			var filenames = [];
			
			for (i=0; i<files.length; i++){
				filenames.push({name:(files[i].name), status:0});
			}

			
			$scope.filenames = filenames;
			$scope.files = files;
			$scope.$apply();	
		};


		//GENERATES SVG AND SEND A POST REQUEST TO THE SERVER TO SAVE THE FILE LOCALLY.
		$scope.saveFilesToServer = function(){
			var reader = new FileReader();
			var pixels, rows, cols, svg;
			var filename = 0;
			
			
			reader.onload = function(file){
				//GET DICOM FILE DATA
				var arrayBuffer = reader.result;
				var byteArray = new Uint8Array(arrayBuffer);
				var dataSet = dicomParser.parseDicom(byteArray);
				
				// EXTRACT RELEVANT DATA FROM THE DATASET
				pixels = new Uint16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset);
				pixels = [].slice.call(pixels)
				rows = dataSet.uint16('x00280010');
				cols = dataSet.uint16('x00280011');

				//CREATE SVG WITH AND ADD DICOM PIXEL DATA
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
				svg = d3.select(svg)
					    .attr('width', cols)
						.attr('height', rows);

				

				// CREATE SVG RAW HTML
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
					// GET RAW HTML OF THE SVG AND POST IT TO THE SERVER
					var ser = new XMLSerializer();
					var svgStr = ser.serializeToString(svg[0][0]);
					
					$http.post('/saveDicomAsSVG', {svgHTML:svgStr, filename: (filename+1).toString()}).success(function(){
						
						// UPDATE PROGRESS BAR
						$scope.dynamic = Math.floor((filename/($scope.files.length))*100)
					});

					// UPDATES GLYPH FOR FILE STATUS
					$scope.filenames[filename]['status']=1;
					filename += 1;
					
					// READ NEXT FILE IF EXISTS
					if (filename<$scope.files.length){
						reader.readAsArrayBuffer($scope.files[filename]);
				}
			
			}

			reader.readAsArrayBuffer($scope.files[filename]);
		}


	$scope.saveFilesToServerAsJson = function(){
		var reader = new FileReader();
		var pixels, rows, cols;
		var filename = 0;
			
			
		reader.onload = function(file){
			//GET DICOM FILE DATA
			var arrayBuffer = reader.result;
			var byteArray = new Uint8Array(arrayBuffer);
			var dataSet = dicomParser.parseDicom(byteArray);
			
			// EXTRACT RELEVANT DATA FROM THE DATASET
			pixels = new Uint16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset);
			pixels = [].slice.call(pixels)
			rows = dataSet.uint16('x00280010');
			cols = dataSet.uint16('x00280011');
		};


		reader.onloadend=function(){
			var dicomData = {
				data: pixels,
				cols: cols,
				rows: rows
			};
					
			$http.post('/saveDicomAsJSON', {data:dicomData, filename:(filename+1).toString()}).success(function(){
						
			// UPDATE PROGRESS BAR
			$scope.dynamic = Math.floor((filename/($scope.files.length))*100)
		});

			// UPDATES GLYPH FOR FILE STATUS
			$scope.filenames[filename]['status']=1;
			filename += 1;
					
			// READ NEXT FILE IF EXISTS
			if (filename<$scope.files.length){
				reader.readAsArrayBuffer($scope.files[filename]);
			}
		}

		reader.readAsArrayBuffer($scope.files[filename]);

	}


	// INSERT A RECORD OF A SUB- STUDY TO THE DATABASE.
	// SINCE ALL THE FILES BELONGS TO THE SAME SUB- THE DATA IS 
	// TAKEN FROM THE FIRSY ONE
	$scope.addSubStudyToDB = function(){
		var reader = new FileReader();
		

		reader.onload = function(){
			//GET DATA FROM DICOM
			var arrayBuffer = reader.result;
			var byteArray = new Uint8Array(arrayBuffer);
			var dataset = dicomParser.parseDicom(byteArray);
		
			//CREATE A SUB-STUDY MODEL
			var subStudy = {
					patientId: dataset.string('x00100020'),
					patientName: dataset.string('x00100010'),
					patientDOB: dataset.string('x00100030'),
					modality: dataset.string('x00080060'),
					studyDate: dataset.string('x00080020')
			}

			//POST MODEL TO THE SERVER TO SAVE IT
			$http.post('/addSubStudyToDBApi', subStudy)
				 .success(function(){'STUDY CREATED'})
				 .error(function(err){console.log(err.stack)});
		}
		reader.readAsArrayBuffer($scope.files[0]);	
	};
}]);





//DIRECTIVES
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