const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const https = require('https');


const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));
app.set('view engine', 'ejs');


function apiUrl(pincode, date) {
    return 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode='+pincode+'&date='+date;
}


app.get('/', function(req, res) {
    res.render('home');
});

app.post('/', function(req, res) {
    const pincode = req.body.pincode;
    const date = req.body.date.slice(8, 10) + '-' + req.body.date.slice(5, 7) + '-' + req.body.date.slice(0, 4);
    // console.log(date);
    const url = apiUrl(pincode, date);

    https.get(url, function (response) {
        // console.log(response.statusCode);
        response.on("data", function (data) {
            const cowinData = JSON.parse(data);
            // console.log(cowinData);
            res.render('result', {cowin: cowinData});
        });
    });
});

let port = process.env.PORT;

if(port == null || port == '') {
    port = 3000;
}

app.listen(port, function() {
    console.log('Your server has started at http://localhost:'+port);
});