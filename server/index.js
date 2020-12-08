const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.text());
app.use(cors())

const sessions = require('./routes/api/sessions')
const runs = require('./routes/api/runs')
const upload = require('./routes/api/upload')
const teacher = require('./routes/api/teacher')
const schools = require('./routes/api/schools')
// const router = require('./routes/api/upload')
const studentSummary = require('./routes/api/studentSummary')

app.use('/api/sessions', sessions)
app.use('/api/runs', runs)
app.use('/api/upload', upload)
app.use('/api/teacher', teacher)
app.use('/api/schools', schools)
app.use('/api/student-summary', studentSummary)

// if (process.env.NODE_ENV === 'production') {
//   console.log('production')
//   app.use(express.static(__dirname + '/public/'))
//   app.get(/.*/, (req, res) => {
//     res.sendFile(__dirname + '/public/index.html')
//   })
// }

app.listen(5000, () => console.log('Server running on port 5000'))
