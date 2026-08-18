const userTab = document.querySelector("[data-UserWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".Weather-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-Info-container");
const  grantAccessContainer =
document.querySelector(".grantAccessContainer");

let currentTab = userTab;

const API_KEY = "7733806c4d8357ce4b5186d1776648d2";

userTab.classList.add("current-Tab");

getFromSessionStorage();

function switchTab(clickTab){

    if(clickTab != currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab = clickTab;
        currentTab.classList.add("current-Tab");

        if(!searchForm.classList.contains("active")){

        userInfoContainer.classList.remove("active");
        
        grantAccessContainer.classList.remove("active");
        
        searchForm.classList.add("active");
    }
    else{
        /* mai search tab par tha abb your weather visible  hai */
        searchForm.classList.remove("active");

        userInfoContainer.classList.remove("active");

        getFromSessionStorage();


    }

    }
    
}

userTab.addEventListener("click",() =>{
    /* Pass */
    switchTab(userTab);
});

searchTab.addEventListener("click" ,() =>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //agar local coordinates mile
        grantAccessContainer.classList.add("active");
        
    }
    else{
        const coordinates = localCoordinates? JSON.parse(localCoordinates) : null;
        
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    
    const {lat,lon} = coordinates;

    //Make grant container invisible

    grantAccessContainer.classList.remove("active");

    //Make loader visible

    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        RanDerWeatherInfo(data);
        
       
        }
       
         
        
    
    catch(err){

        loadingScreen.classList.remove("active");

        alert("Something went wrong. Please try again.");
        console.error(err);
        

    }

}
function RanDerWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-CityName]");

    const CountryIcon = document.querySelector("[data-countryIcon]");

    const Desc = document.querySelector("[data-WeatherDescription]");

    const WeatherIcon = document.querySelector("[data-WeatherIcon]");

    const temperature = document.querySelector("[data-temperature]");

    const WindSpeed = document.querySelector("[data-WindSpeed]");

    const Humidity = document.querySelector("[data-Humidity]");

    const CloudsNess = document.querySelector("[data-CloudNess]");


    //Fetch values from Weather object and put It in ui element

    cityName.innerText = weatherInfo?.name;
    CountryIcon.src = `https://flagcdn.com/48x36/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    Desc.innerText = weatherInfo?.weather?.[0]?.description;
    WeatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    WindSpeed.innerText = weatherInfo?.wind?.speed;
    Humidity.innerText = weatherInfo?.main?.humidity;
    CloudsNess.innerText = weatherInfo?.clouds?.all;
    
}

function getLocation(){
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("Geolocation is not supported by your browser.");

    }
}
function showPosition(position){
    const userCoordinate = {
         lat: position.coords.latitude,

         lon:  position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinate));
    fetchUserWeatherInfo(userCoordinate);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput =  document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === " ")
        return;
    else
        fetchWeatherInfo(cityName);
})

async function fetchWeatherInfo(cityName){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try{
        const  response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        )
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        RanDerWeatherInfo(data);
        }
    catch(error)
    {
        error('Weather info not available');
    }

}