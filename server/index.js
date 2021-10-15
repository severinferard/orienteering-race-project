/**
 * DORA Server entry point
 *
 * @summary DORA Server entry point
 * @author Séverin Férard
 *
 * Created at     : 2021-10-06 18:23:48 
 * Last modified  : 2021-10-15 11:41:05
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const dgram = require('dgram');
const Netmask = require('netmask').Netmask
const os = require('os');

const APP_PORT = process.env.PORT || 5000;
// const BROADCAST_ADDR = new Netmask(os.networkInterfaces()["en0"][0].cidr).broadcast;
const BROADCAST_ADDR = "10.0.60.255"
const BROADCAST_PORT = 6024;

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


// function broadcastNew() {
//     var message = Buffer.from("");
//     server.send(message, 0, message.length, BROADCAST_PORT, BROADCAST_ADDR, () => {
// 		// console.log("udp sent")
// 	});
// }

// console.log(BROADCAST_ADDR)
app.listen(APP_PORT, () => console.log('DORA is running on port 5000'))
// server.bind(function() {
//     server.setBroadcast(true);
//     setInterval(broadcastNew, 3000);
// });
