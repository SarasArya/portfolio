const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  helper = require('sendgrid').mail;
const app = express();
const cors = require('cors');
const Feed = require('rss-to-json');
const sg = require('sendgrid')(sendgridAPIKey);

const whitelist = ['https://www.sarasarya.com', 'http://localhost:8000'];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

let sendgridAPIKey = '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';
let server = require('http').Server(app);
app.use;
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  bodyParser.text({
    type: 'text/plain'
  })
);

app.get('/', function(req, res, next) {
  res.sendStatus(200);
});

app.post('/contact', cors(corsOptions), function(req, res, next) {
  const from_email = new helper.Email('saras.arya@gmail.com');
  const to_email = new helper.Email('saras.arya@gmail.com');
  const subject = 'You have a new message from your website';
  const content = new helper.Content(
    'text/plain',
    `Somebody with name ${req.body.name} tried to contact you from $req.body.email} with the message ${
      req.body.message
    }`
  );
  const mail = new helper.Mail(from_email, subject, to_email, content);

  var requesBody = mail.toJSON();
  var request = sg.emptyRequest();
  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requesBody;
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    if (response.statusCode >= 200 && response.statusCode <= 299) res.sendStatus(200);
    console.log(response.body);
  });
});

app.get('/posts', async (req, res) => {
  Feed.load('https://medium.com/feed/@saras.arya', (err, rss) => {
    if (err) {
      throw err;
    }
    return res.status(200).send(rss);
  });
});

app.get('/download', function(req, res, next) {
  var file = __dirname + '/saras-arya.pdf';
  res.download(file, 'saras-arya.pdf', function(err) {
    if (err) throw err;
    else {
      console.log('Done download');
    }
  });
});
var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log('App is running on port ' + port);
});
