let weather = {
    apiKey: "1fccbSbpjjWegfER_oBjrnf8AG4osS3ZtNMElytQ-GA", // Replace with your Unsplash API key
    weatherApiKey: "94d50e579fadab8872ebe421ede06e22", // Replace with your OpenWeatherMap API key
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
        const { temp, pressure, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".pressure").innerText =
            "Pressure: " + pressure + "mbar";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        // Fetch image from Unsplash specific to the city
        this.fetchUnsplashImage(name);
    },
    fetchUnsplashImage: function (city) {
        // Make a request to Unsplash to get images related to the city
        fetch(`https://api.unsplash.com/photos/random?query=${city}&client_id=${this.apiKey}&w=1920&h=1080`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch image from Unsplash");
                }
                return response.json();
            })
            .then((data) => {
                if (data.length > 0) {
                    // Use the first image that matches the city
                    const imageUrl = data[0].urls.full; // Full resolution image (best quality)
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                } else {
                    console.log("No images found for the city.");
                }
            })
            .catch((error) => {
                console.error("Error fetching image:", error);
            });
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

weather.fetchWeather("Frankfurt"); // Initial city fetch
