const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
//const Gpio = require('onoff').Gpio
const port = process.env.PORT || 5000;

//const LED = new Gpio(26, 'out')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.text());
app.use(cors())

const sessions = require('./routes/api/sessions')
const runs = require('./routes/api/runs')
const upload = require('./routes/api/upload')
const teacher = require('./routes/api/teacher')
const schools = require('./routes/api/schools')
const classes = require('./routes/api/classes').classes
// const router = require('./routes/api/upload')
const studentSummary = require('./routes/api/studentSummary')

app.use('/api/sessions', sessions)
app.use('/api/runs', runs)
app.use('/api/upload', upload)
app.use('/api/teacher', teacher)
app.use('/api/schools', schools)
app.use('/api/classes', classes)
app.use('/api/student-summary', studentSummary)
app.use('/atlas', express.static('atlas'))

//if (process.env.NODE_ENV === 'production') {
 if (true) {
    console.log('production')
    app.use(express.static(__dirname + '/public/'))
//    app.get(/.*/, (req, res) => {
 //       res.sendFile(__dirname  + '/public/index.html')
  //  });
}

//LED.writeSync(1)
app.listen(port, () => console.log('Server running on port 5000'))
