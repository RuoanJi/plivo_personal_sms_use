var settings = require('app-settings');
var express = require('express');
var JsonDB = require('node-json-db');
var bodyParser = require('body-parser');
var plivo = require('plivo');

var app = express();
var db = new JsonDB('db/plivo', true, true);
var plivoClient = new plivo.Client(settings.plivo.auth_id, settings.plivo.auth_token);

app.use(bodyParser.urlencoded({extended: true}));

app.get('/plivo/view_sms/:number', function(req, res) {
	
	var messages = [];
	try {
		messages = db.getData('/plivo/n' + req.params.number);
	} catch (error) {
		console.log(error);
	}

	var htmlString = '<html><head></head><body>';

	htmlString += '<table border="1px"><tr><th>From</th><th>Text</th><th>Date</th></tr>';
	for (var i = 0; i < messages.length; i ++) {
		var message = messages[i];
		htmlString += '<tr><td>' + message.from + '</td><td>' + message.text + '</td><td class="timestamp" timestamp="' + message.timestamp + '"></td></tr>';
	}
	htmlString += '</table>';
	htmlString += `
		<script type='text/javascript'>
			var doms = document.getElementsByClassName('timestamp');
			for (var i = 0; i < doms.length; i ++) {
				doms[i].innerText = new Date(parseInt(doms[i].getAttribute('timestamp')));
			}
		</script>
	`;

	htmlString += '</body></html>';

	res.send(htmlString);
});

app.all('/plivo/receive_sms/', function(req, res) {
	var from_number = req.body.From || req.query.From;
	var to_number = req.body.To || req.query.To;
	var text = req.body.Text || req.query.Text;

	db.push('/plivo/n' + to_number + '[]', {
		from: from_number,
		text: text,
		timestamp: (new Date()).getTime()
	}, true);

	res.send('');
});

app.get('/plivo/send_sms', function(req, res) {
	var htmlString = `
		<html>
		<head>
		</head>
		<body>
			<form action="/plivo/send_sms" method="POST">
				From: <input name="from"></input><br />
				To: <input name="to"></input><br />
				Text: <input name="text"></input><br />
				<input type="submit"></input>
			</form>
		</body>
		</html>
	`;
	res.send(htmlString);
});

app.post('/plivo/send_sms', function(req, res) {
	plivoClient.messages.create(req.body.from, req.body.to, req.body.text).then(function() {
	});
	res.redirect('/plivo/send_sms');
})

app.listen(settings.server.port, function() {
	console.log('Server running at port ' + settings.server.port);
});
