var express = require('express');


require('contextify');
require('jquery');
var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var router = express.Router();
var path = require('path');


//DATABASE & MODELS
var mongoose = require('mongoose');
var SubStudy = mongoose.model('SubStudy');


// GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//TRASH!!!
router.get('/us', function(req, res, next){
	res.render('uploadStudy', {msg:"LIRON"});	
});


//SAVES SVG FILES LOCALLY
router.post('/saveDicomAsSVG', function(req, res, next){
	var svg = req.body.svgHTML;
	var filename = req.body.filename;
	var dir = './public/tmp'
	

	//CREATE DIRECTORY IF NOT EXISTS
	if (!fs.existsSync(dir))
	    fs.mkdirSync(dir);
	
	fs.writeFile('./public/tmp/' + filename + '.svg', svg, function(err){if (err) {return console.log(err)}})
	console.log("\n\n\nSAVED FILENAME:\t " + filename + "\n\n\n")
	res.send();
});


//CREATE STUDY OR SUB-STUDY TEMPLATE
router.get('/createStudy', function(req, res, next){
	res.render('createStudy');
});


//CREATES A SUBSTUDY IN THE DB
router.post('/addSubStudyToDBApi', function(req, res, next){
	
	//GET OBJECT
	var substudy = new SubStudy(req.body);
	
	//SAVE TO DB OR REPORT ERROR
	substudy.save(function(err, substudy){
		if(err){return next(err.stack)};
		res.send();
	});

});


module.exports = router;