let express = require('express'),
    path = require('path'),
     bodyParser = require('body-parser');
let app = express();
let server = require('http').Server(app);
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	host : 'smtp.gmail.com',
	port : 465,
	auth : {
		user : "saras.arya@gmail.com",
		pass : "9987989650"
	},
	logger : true,
	secure : true
});
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
    var mailOptions = {
    from: '"Saras Arya 👥" <saras.arya@gmail.com>', // sender address
    to: 'saras.arya@gmail.com', // list of receivers
    subject: 'Light it up ✔', // Subject line
    text: `Message ${req.body.message}`, // plaintext body
    html: `Message ${req.body.message}` // html body
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    res.sendStatus(200);
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
