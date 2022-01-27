var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var os = require("os");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var apiKey = "91632cc63d317f4570bb12bdd18c029d";

app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile(__dirname + "/" + "index.html");
});

app.post('/process_post', urlencodedParser, async function (req, res) {
   const resp = await fetch('https://api.themoviedb.org/3/search/tv?api_key=' + apiKey + '&language=en-US&page=1&query=' + JSON.stringify(req.body.query) + '&include_adult=false');
   const body = await resp.text();

   console.log('Sorted by: ' + req.body.sortOrder);
   let myJSON = JSON.parse(body).results;

   if (myJSON.length === 0) {
      console.log("No results!");
      res.write("No results!");
   }
   else {
      // Sort based on sortOrder
      if (req.body.sortOrder === 'popularity') {
         myJSON.sort((a, b) => b.popularity - a.popularity);
      }
      else if (req.body.sortOrder === 'first_air_date') {
         myJSON.sort((a, b) => new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime());
      }

      console.log(myJSON);
      myJSON.forEach(entry => res.write(JSON.stringify(entry) + os.EOL + os.EOL));
   }
   res.end();
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("TMDB app listening at http://%s:%s", host, port)
});