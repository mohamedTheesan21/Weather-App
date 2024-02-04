const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  console.log(cityName);

  const url_city =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=b212c1b0bd47240c9b2ab87a998db6dd";

  https.get(url_city, function (response) {
    response.on("data", function (data) {
      const cityData = JSON.parse(data);
      const lon = cityData[0].lon;
      const lat = cityData[0].lat;

      const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=b212c1b0bd47240c9b2ab87a998db6dd&units=metric";

      https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp;
          const weatherDescription = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const weatherIcon =
            "http://openweathermap.org/img/wn/" + icon + ".png";
          res.write(
            "<h1>The temperature in " +
              cityName +
              " is " +
              temp +
              " degrees Celcius.</h1>"
          );
          res.write(
            "<p>The weather is currently " + weatherDescription + "</p>"
          );
          res.write("<img src=" + weatherIcon + ">");
          res.send();
        });
      });
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
