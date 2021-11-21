// Gets the current Date and converts it to MM/DD/YYYY format
var currentDate = new Date();
currentDate = currentDate.toLocaleDateString();

// Selectors for the button elements
var submitBtnEl = document.querySelector('.submit-btn');
var citySearchBtnsList = document.querySelector('#search-buttons-list');

// variable to store the previously search cities to make buttons
var searchCities = [];

// Function to get the current weather for given city
var getWeatherData = function(cityName) {
    // gets the element for the heading of the weather section
    var currentCityDate = document.querySelector('#city-date');

    // stores the url to call the weather api using the city parameter
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=03bb68255464b077b300ee6581abfffb&units=imperial';
    // gets the data and checks that the response shows a success (200)
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            // processes the response into jason data
            response.json().then(function(data) {
                //creates a button for the previously searched city if the call was successful
                // creates the btn element
                var cityBtnEl = document.createElement("button");
                // adds the class and id to the btn element
                cityBtnEl.classList.add("city-search-btn");
                cityBtnEl.setAttribute("id", "city-" + cityName);
                // sets the btn to show the city name searched for
                cityBtnEl.textContent = cityName;
                // adds the btn to the list element on the page
                document.querySelector('#search-buttons-list').appendChild(cityBtnEl);
                // stores the city in the array of searched cities
                searchCities.push(cityName);
                // saves the data
                saveCities();

                //gets the weather icon
                var iconCode = data.weather[0].icon;
                // gets the image from the weather site
                var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                // gets the element from the page to store the icon
                var weatherIconEl = document.querySelector('#wicon');
                // shows the current city, date, and weather icon in the current weather heading
                currentCityDate.textContent = cityName + " (" + currentDate + ")";
                weatherIconEl.setAttribute("src", iconUrl);
                weatherIconEl.setAttribute("style", "display: block");
                // sets the temp, wind speed, and humidity in the current weather section
                document.querySelector('#current-temp').textContent = "Temp: " + data.main.temp;
                document.querySelector('#current-wind').textContent = "Wind: " + data.wind.speed + " MPH";
                document.querySelector('#current-humidity').textContent = "Humidity: " + data.main.humidity + " %";
                // gets the city latitude and longitude from the api to get the uv index for the city
                var cityLat = data.coord.lat;
                var cityLon = data.coord.lon;
                getUV(cityLat, cityLon);
            });
        } else {
            // if the response was unsuccesful, alerts the user that the city could not be found
            alert("Could not find the city. Please try again.");
        }
    });

};

// Function to get the UV index for the city based on latitude and longitude
var getUV = function(lat, lon) {
    // stores the api call url
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=03bb68255464b077b300ee6581abfffb';
    // calls the api and checks if the response was successful
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // gets the uv index from the data
                var currentUVI = data.current.uvi;
                // sets the element on the page to show the uv index
                document.querySelector('#current-uvi').textContent = currentUVI;
                // stores the element holding the uv index to change the background according to severity
                var currentUVIDiv = document.querySelector('#uvi');
                if (currentUVI < 3) {
                    currentUVIDiv.classList.add("favorable");
                } else if (currentUVI <= 5) {
                    currentUVIDiv.classList.add("moderate");
                } else {
                    currentUVIDiv.classList.add("severe");
                }
                // call the function to get the daily forecast
                getDailyForecast(data);
            });
        }
    });
};

var getDailyForecast = function(data) {
    // sets the date for the next 5 days
    var currentDayPlusOne = new Date();
    currentDayPlusOne.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-1-date').textContent = currentDayPlusOne.toLocaleDateString();
    
    var currentDayPlusTwo = currentDayPlusOne;
    currentDayPlusTwo.setDate(currentDayPlusTwo.getDate() + 1);
    document.querySelector('#day-2-date').textContent = currentDayPlusTwo.toLocaleDateString();
    
    var currentDayPlusThree = currentDayPlusTwo;
    currentDayPlusThree.setDate(currentDayPlusThree.getDate() + 1);
    document.querySelector('#day-3-date').textContent = currentDayPlusThree.toLocaleDateString();
    
    var currentDayPlusFour = currentDayPlusOne;
    currentDayPlusFour.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-4-date').textContent = currentDayPlusFour.toLocaleDateString();
    
    var currentDayPlusFive = currentDayPlusOne;
    currentDayPlusFive.setDate(currentDayPlusOne.getDate() + 1);
    document.querySelector('#day-5-date').textContent = currentDayPlusFive.toLocaleDateString();


    // for each day sets the temp, wind speed, humidity, and weather icon in the html element on the page
    for (var i = 1; i < 6; i++) {
        document.querySelector('#day-'+ i + '-temp').textContent = "Temp: " + data.daily[i].temp.max;
        document.querySelector('#day-'+ i + '-wind').textContent = "Wind: " + data.daily[i].wind_gust + " MPH";
        document.querySelector('#day-'+ i + '-humidity').textContent = "Humidity: " + data.daily[i].humidity + " %";
        var iconCode = data.daily[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        var weatherIconEl = document.querySelector('#wicon-' + i);
        weatherIconEl.setAttribute("src", iconUrl);
        weatherIconEl.setAttribute("style", "display: block");
    }

};

// saves the searched cities array to local storage
var saveCities = function() {
    localStorage.setItem("searchCities", JSON.stringify(searchCities));
};

// retrieves the data from local storage and creates the past search buttons
var loadCities = function() {
    var cities = JSON.parse(localStorage.getItem("searchCities"));

    // if local storage is empty it creates an empty array
    if (!cities) {
        cities = [];
    }

    // iterates through the cities array and creates a button on the page for each city previously searched for
    for (var i = 0; i < cities.length; i++) {
        var cityBtnEl = document.createElement("button");
        var inputCity = cities[i];
        cityBtnEl.classList.add("city-search-btn");
        cityBtnEl.setAttribute("id", "city-" + inputCity);
        cityBtnEl.textContent = inputCity;
        document.querySelector('#search-buttons-list').appendChild(cityBtnEl);
    }

    // saves the data into the searchCities array
    searchCities = cities;
};


// gets the city searched for based on which button was pressed
var getSearchCity = function(event) {
    // prevents default page reload
    event.preventDefault();
    // var to store the city
    var inputCity;
    // checks if the search button was pressed 
    if (event.target.classList.contains("submit-btn")) {
        // gets the data put into the search field
        var inputEl = document.querySelector('#city-search');
        inputCity = inputEl.value;
        // resets the input field to be blank
        inputEl.value = "";
    } else {
        // if the search button was not clicked, it was a previous searched city button
        // gets the city name stored in the button element
        inputCity = event.target.textContent;
        // removes the button to help prevent duplicates
        document.querySelector('#city-' + inputCity).remove();
    }
    
    // gets the weather data for the searched for city
    getWeatherData(inputCity);
    
};

// event listeners for button clicks
submitBtnEl.addEventListener("click", getSearchCity);
citySearchBtnsList.addEventListener("click", getSearchCity);
// loads the previous search data on page load
loadCities();

