const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/task2', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
