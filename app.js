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

app.post('/result', function(req, res) {
    const pincode = req.body.pincode;
    const date = req.body.date.slice(8, 10) + '-' + req.body.date.slice(5, 7) + '-' + req.body.date.slice(0, 4);
    const url = apiUrl(pincode, date);

    https.get(url, (resp) => {
        let data = '';

    // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

    // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // console.log(JSON.parse(data));
            const cowinData = JSON.parse(data);
            res.render('result', {cowin: cowinData});
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});

let port = process.env.PORT;

if(port == null || port == '') {
    port = 3000;
}

app.listen(port, function() {
    console.log('Your server has started at http://localhost:'+port);
});