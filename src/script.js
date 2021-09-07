const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img");
backBtn = wrapper.querySelector("header i");

let api;

splitString = s_arr.split("8e");
let strConcat = splitString[0] + "8e" + splitString[1];
let lastString = ["2", "e", "8", "d"];
let reverse_string = lastString.reverse().join("");

backBtn.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    reqeustApi(inputField.value);
    inputField.blur();
  } else if (e.key == "Enter" && inputField.value == "") {
    infoTxt.innerHTML = "Please Enter City Name";
    infoTxt.classList.add("error");
  }
});

locationBtn.addEventListener("click", (e) => {
  if (navigator.geolocation) {
    //if the browser supports geolocation
    navigator.geolocation.getCurrentPosition(onSucces, onError);
  } else {
    alert("Your browser does not support geolocation api");
  }
});
function onSucces(position) {
  const Key = reverse_string + strConcat;
  const { latitude, longitude } = position.coords;
  api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${Key}`;
  fetchdata();
}
function onError(error) {
  infoTxt.innerHTML = error.message;
  infoTxt.classList.add("error");
}

function reqeustApi(city) {
  const Key = reverse_string + strConcat;
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${Key}`;
  fetchdata();
}

function fetchdata() {
  infoTxt.innerHTML = "Getting Weather details...";
  infoTxt.classList.add("pending");
  fetch(api).then((res) =>
    res
      .json()
      .then((result) => weatherDetails(result))
      .catch(() => {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerHTML = "Something went wrong";
      })
  );
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerHTML = `${inputField.value} is not found`;
    infoTxt.classList.add("error");
  } else {
    const city = info.name;
    let country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;
    for (i in countryList) {
      if (i == country) {
        country = countryList[i];
      }
    }

    const desc = description.split(" ");
    for (let i = 0; i < desc.length; i++) {
      desc[i] = desc[i][0].toUpperCase() + desc[i].substr(1);
    }
    const captilised_desk = desc.join(" ");

    if (id == 800) {
      wIcon.src = "/icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "/icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "/icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "/icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "/icons/cloud.svg";
    } else if ((id >= 300 && id <= 331) || (id >= 500 && id <= 531)) {
      wIcon.src = "/icons/rain.svg";
    }
    // lests pass those values to html
    wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
    wrapper.querySelector(".weather").innerHTML = captilised_desk;
    wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
    wrapper.querySelector(".humidity  span").innerHTML = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}
