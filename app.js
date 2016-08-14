let express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    helper = require('sendgrid').mail;
let app = express();
let sendgridAPIKey = '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';
let server = require('http').Server(app);

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text({
    type: "text/plain"
}));

app.get('/', function(req, res, next) {
    res.sendStatus(200);
});

app.get('/blog.html', function(req, res, next) {
    res.sendFile(path.join(__dirname + "/blog.html"));
});

app.post('/contact', function(req, res, next) {
    from_email = new helper.Email('saras.arya@gmail.com');
    to_email = new helper.Email("saras.arya@gmail.com");
    subject = "You have a new message from your website";
    content = new helper.Content("text/plain", `Somebody with name ${req.body.name} tried to contact you from $req.body.email} with the message ${req.body.message}`);
    mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')(sendgridAPIKey);
    var requesBody = mail.toJSON();
    var request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requesBody;
    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        if (response.statusCode >= 200 && response.statusCode <= 299)
            res.sendStatus(200);
        console.log(response.body);
    });
});

app.get('/download', function(req, res, next) {
    var file = __dirname + '/saras-arya.pdf';
    res.download(file, 'saras-arya.pdf', function(err) {
        if (err)
            throw err;
        else {
            console.log("Done download");
        }
    });
});
var port = process.env.PORT || 8000;
server.listen(port, function() {
    console.log("App is running on port " + port);
});
