let weather = {
    apiKey: "1fccbSbpjjWegfER_oBjrnf8AG4osS3ZtNMElytQ-GA", // Unsplash API key
    // weatherApiKey: "94d50e579fadab8872ebe421ede06e22", // OpenWeatherMap API key
    weatherApiKey: "a46c2532d4de0a8f71800fb649abdc2c",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.weatherApiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, feels_like, pressure, humidity, temp_min, temp_max } = data.main;
        const { speed } = data.wind;
        const { sunrise, sunset } = data.sys;

        // Format sunrise and sunset times from UNIX timestamps
        const sunriseTime = this.convertUnixTime(sunrise);
        const sunsetTime = this.convertUnixTime(sunset);

        // Update the DOM with the weather data
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".feels-like").innerText = "Feels like: " + feels_like + "°C"; // Display feels like temperature
        document.querySelector(".pressure").innerText = "Pressure: " + pressure + " mbar";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".temp_min").innerText = "Temp min: " + temp_min + "°C";
        document.querySelector(".temp_max").innerText = "Temp max: " + temp_max + "°C";
        // Display sunrise and sunset times
        document.querySelector(".sunrise").innerText = "Sunrise: " + sunriseTime;
        document.querySelector(".sunset").innerText = "Sunset: " + sunsetTime;

        // Hide loading animation once the weather data is fetched
        document.querySelector(".weather").classList.remove("loading");

        // Fetch image from Unsplash specific to the city
        this.fetchUnsplashImage(name);
    },

// Convert Unix timestamp to a 24-hour readable time format (h:mm)
convertUnixTime: function (timestamp) {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours; // No leading zero for hours
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for minutes if necessary
    return `${formattedHours}:${formattedMinutes}`;
},



    fetchUnsplashImage: function (city) {
        const encodedCity = encodeURIComponent(city);
        console.log("Fetching image for city:", city);
    
        fetch(`https://api.unsplash.com/photos/random?query=${encodedCity}&client_id=${this.apiKey}&w=1920&h=1080`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch image from Unsplash");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Unsplash API Response:", data);
    
                if (data.urls && data.urls.regular) {
                    const imageUrl = data.urls.regular;
                    console.log("Selected Image URL:", imageUrl);
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                } else {
                    console.log("No image found for the city.");
                }
            })
            .catch((error) => {
                console.error("Error fetching image:", error);
            });
    }
    
     
    ,
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

// Event listeners for search functionality
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

// Initial city fetch (optional)
weather.fetchWeather("Timisoara"); // Initial city fetch


