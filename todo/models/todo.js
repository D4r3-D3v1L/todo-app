const mongoose = require('mongoose')

const LolSchema = new mongoose.Schema({
	task:{
		type:String,
		require:true
	},
	time:{
		type:Date,
		default:Date.now

	}
});

const Todo = mongoose.model('Todo',LolSchema)
module.exports = Todo