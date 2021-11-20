var currentDate = new Date();
currentDate = currentDate.toLocaleDateString();
var submitBtnEl = document.querySelector('.submit-btn');
var citySearchBtnsList = document.querySelector('#search-buttons-list');
var searchCities = [];

var getWeatherData = function(cityName) {
    var currentCityDate = document.querySelector('#city-date');
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=03bb68255464b077b300ee6581abfffb&units=imperial';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                var iconCode = data.weather[0].icon;
                //console.log(iconCode);
                var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                //console.log(iconUrl);
                var weatherIconEl = document.querySelector('#wicon');
                currentCityDate.textContent = cityName + " (" + currentDate + ")";
                weatherIconEl.setAttribute("src", iconUrl);
                weatherIconEl.setAttribute("style", "display: block");
                document.querySelector('#current-temp').textContent = "Temp: " + data.main.temp;
                document.querySelector('#current-wind').textContent = "Wind: " + data.wind.speed + " MPH";
                document.querySelector('#current-humidity').textContent = "Humidity: " + data.main.humidity + " %";
                var cityLat = data.coord.lat;
                var cityLon = data.coord.lon;
                getUV(cityLat, cityLon);
            });
        }
    });

};

var getUV = function(lat, lon) {
    console.log(lat + " " + lon);
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=03bb68255464b077b300ee6581abfffb';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var currentUVI = data.current.uvi;
                document.querySelector('#current-uvi').textContent = currentUVI;
                var currentUVIDiv = document.querySelector('#uvi');
                if (currentUVI < 3) {
                    currentUVIDiv.classList.add("favorable");
                } else if (currentUVI <= 5) {
                    currentUVIDiv.classList.add("moderate");
                } else {
                    currentUVIDiv.classList.add("severe");
                }
                getDailyForecast(data);
            });
        }
    });
};

var getDailyForecast = function(data) {
    var currentDayPlusOne = new Date();
    //console.log(currentDayPlusOne.toLocaleDateString());
    currentDayPlusOne.setDate(currentDayPlusOne.getDate() + 1);
    //console.log(currentDayPlusOne.toLocaleDateString());
    var currentDayPlusTwo = currentDayPlusOne;
    currentDayPlusTwo.setDate(currentDayPlusTwo.getDate() + 1);
    //console.log(currentDayPlusTwo.toLocaleDateString());
    var currentDayPlusThree = currentDayPlusTwo;
    currentDayPlusThree.setDate(currentDayPlusThree.getDate() + 1);
    //console.log(currentDayPlusThree.toLocaleDateString());
    var currentDayPlusFour = currentDayPlusThree;
    currentDayPlusFour.setDate(currentDayPlusFour.getDate() + 1);
    //console.log(currentDayPlusFour.toLocaleDateString());
    var currentDayPlusFive = currentDayPlusFour;
    currentDayPlusFive.setDate(currentDayPlusFive.getDate() + 1);
    //console.log(currentDayPlusFive.toLocaleDateString());

    document.querySelector('#day-1-date').textContent = currentDayPlusOne.toLocaleDateString();
    document.querySelector('#day-2-date').textContent = currentDayPlusTwo.toLocaleDateString();
    document.querySelector('#day-3-date').textContent = currentDayPlusThree.toLocaleDateString();
    document.querySelector('#day-4-date').textContent = currentDayPlusFour.toLocaleDateString();
    document.querySelector('#day-5-date').textContent = currentDayPlusFive.toLocaleDateString();

    //console.log(data);
    for (var i = 1; i < 6; i++) {
        document.querySelector('#day-'+ i + '-temp').textContent = "Temp: " + data.daily[i].temp.max;
        document.querySelector('#day-'+ i + '-wind').textContent = "Wind: " + data.daily[i].wind_gust + " MPH";
        document.querySelector('#day-'+ i + '-humidity').textContent = "Humidity: " + data.daily[i].humidity + " %";
        var iconCode = data.daily[i].weather[0].icon;
        //console.log(iconCode);
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        //console.log(iconUrl);
        var weatherIconEl = document.querySelector('#wicon-' + i);
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconEl.setAttribute("style", "display: block");
    }

};


var getSearchCity = function(event) {
    event.preventDefault();
    //console.log("function reached");
    var inputCity;
    if (event.target.classList.contains("submit-btn")) {
        inputCity = document.querySelector("#city-search").value;
        //console.log(inputCity);
    } else {
        inputCity = event.target.textContent;
        console.log(inputCity);
        document.querySelector('#city-' + inputCity).remove();
    }
    if(searchCities) {
        var index = searchCities.indexOf(inputCity);
        if (index > -1) {
            searchCities.splice(index, 1);
        }
    }
    
    if (inputCity) {
        var cityBtnEl = document.createElement("button");
        cityBtnEl.classList.add("city-search-btn");
        cityBtnEl.setAttribute("id", "city-" + inputCity);
        cityBtnEl.textContent = inputCity;
        document.querySelector('#search-buttons-list').appendChild(cityBtnEl);
        searchCities.push(inputCity);
        getWeatherData(inputCity);
    }
    
}

submitBtnEl.addEventListener("click", getSearchCity);
citySearchBtnsList.addEventListener("click", getSearchCity);

//save data
//load data
//add comments
//README