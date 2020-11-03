const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const db = require('./mongdb')
const bodyParser = require('body-parser')
const User = require('./moodel/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extened:false}))


app.get('/', async (req,res)=> {
	const tokenck = req.headers.cookie;
	if (tokenck != undefined) {
        const token = tokenck.split('=')[1];
        const dec = jwt.verify(token, 'K1ll3rwh4l3');
        const user = await User.findById(dec.id);
        res.render('task', {
            name: user.name,
            email: user.email
        });
    }
    res.render('login')
})

app.get('/reg', async (req,res)=> {
	const tokenck = req.headers.cookie;
	if (tokenck != undefined) {
        const token = tokenck.split('=')[1];
        const dec = jwt.verify(token, 'K1ll3rwh4l3');
        const user = await User.findById(dec.id);
        res.redirect('/')
    
	}
	res.render('register')
})	

app.post('/register', async (req,res)=> {

    const { name, email, password } = req.body
    const Hpass = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: Hpass })
  try{
    await user.save()
    res.redirect('/')
  } catch (err) {
  	res.redirect('/reg')
  }
})

app.post('/', async (req, res) => {
  try {
    const { email, password } = req.body
    const useer = await User.find({ email })
    const Resp = await bcrypt.compare(password, useer[0].password)
    if (Resp) {
    	const token = jwt.sign({ id: useer[0]._id }, 'K1ll3rwh4l3', {
    		expiresIn: '24h'
    })
    	res.cookie('token', token)
    	res.render('task', {
      name: useer[0].name,
      email: useer[0].email,
    })
  }else {
        res.status(400).send('Invalid Login')
      }
  } catch (error) {
    res.status(400).send('Invalid Login')
  }
})

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.listen(3030,()=>{
	console.log('Listening...')
})