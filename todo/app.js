const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const TodoModel = require('./models/todo')


mongoose.connect('mongodb://localhost/todo', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extened:false}))

app.get('/',async(req,res)=>{
	const tasks = await TodoModel.find().sort({time:"desc"})
	res.render('index',{tasks:tasks})
})

app.get('/add',(req,res)=>{
	res.render('add')
})

app.post('/save',async(req,res)=>{
	let newTask = new TodoModel({
		task: req.body.task
	})
	try {
		task = await newTask.save()
		res.redirect(`/`)
	} catch (e){
		res.redirect('/add')
	}
})

app.get('/edit/:id',async(req,res)=>{
	const task = await TodoModel.findById(req.params.id)
	res.render('edit',{tasks:task})

})

app.post('/update/:id',(req,res)=>{
	TodoModel.findByIdAndUpdate(req.params.id,{task:req.body.task},
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/');
      }
    })
})
app.get('/delete/:id',(req,res)=>{
	TodoModel.findByIdAndDelete(req.params.id,
	function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/');
      }
    })
})

app.listen(2020,()=>{
	console.log('Listening...')
})