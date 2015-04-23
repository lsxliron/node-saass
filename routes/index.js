var express = require('express');


require('contextify');
require('jquery');
var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var router = express.Router();
var path = require('path')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/us', function(req, res, next){
	res.render('uploadStudy', {msg:"LIRON"});	
});

router.post('/test', function(req, res, next){
	// console.log(req)
	// return res.send({obj:'a', ob:'2'})
	var svg = req.body.svgHTML;
	var filename = req.body.filename;
	var dir = './public/tmp'
	//CREATE DIRECTORY IF NOT EXISTS
	if (!fs.existsSync(dir))
	    fs.mkdirSync(dir);
	
	fs.writeFile('./public/tmp/' + filename + '.svg', svg, function(err){if (err) {return console.log(err)}})
	console.log("\n\n\nSAVED FILENAME:\t " + filename + "\n\n\n")
	res.send({a:'a'});


})

router.get('/createStudy', function(req, res, next){
	res.render('createStudy');
});




module.exports = router;