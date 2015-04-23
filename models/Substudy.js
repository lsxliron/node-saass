// This model represents a substudy

var mongoose = require('mongoose');



var SubstudySchema = new mongoose.Schema({
	patientName: String,
	patientId: String,
	patientDOB: String,
	modality: String,
	studyDate: String
});

SubstudySchema.methods.getStudyID = function(){return this._id};


mongoose.model('SubStudy', SubstudySchema);

