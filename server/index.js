/**
 * DORA Server entry point
 *
 * @summary DORA Server entry point
 * @author Séverin Férard
 *
 * Created at     : 2021-10-06 18:23:48 
 * Last modified  : 2021-10-15 20:54:57
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const APP_PORT = process.env.PORT || 5000;

const app = express()
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.text());
app.use(cors())

const server = dgram.createSocket("udp4");

app.use('/api/sessions',		require('./routes/api/sessions'))
app.use('/api/runs',			require('./routes/api/runs'))
app.use('/api/upload', 			require('./routes/api/upload'))
app.use('/api/teacher',			require('./routes/api/teacher'))
app.use('/api/schools',			require('./routes/api/schools'))
app.use('/api/classes',			require('./routes/api/classes').classes)
app.use('/api/student-summary',	require('./routes/api/studentSummary'))
app.use('/api/targetSession', 	require('./routes/api/targetSession'))
app.use('/api/excel',			require('./routes/api/excelCreator'))
app.use('/api/setTime',			require('./routes/api/setTime'))

app.use('/atlas',				express.static(__dirname + '/atlases/paris_18/'))
app.use('/atlas',				express.static(__dirname + '/atlases/altas/'))
app.use('/atlas',				express.static(__dirname + '/atlases/hauts_de_seine_17/'))
app.use('/atlas',				express.static(__dirname + '/atlases/parc_de_la_courneuve_18/'))
app.use('/atlas',				express.static(__dirname + '/atlases/parc_de_choisy_18/'))
app.use('/atlas',				express.static(__dirname + '/atlases/versailles_18/'))
// app.get('/client', (req, res) => {
// 	res.sendFile(__dirname  + '/routes/client.html')
// })

app.use(express.static(__dirname + '/public/'))
app.get(/.*/, (req, res) => {
	res.sendFile(__dirname  + '/public/index.html')
});

app.listen(APP_PORT, () => console.log('DORA is running on port 5000'))
