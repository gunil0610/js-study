"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////

const apiUrl = "https://restcountries.com/v2";

const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

// old way
// const getCountryAndNeighbor = function (country) {
//   // AJAX call country 1
//   const request = new XMLHttpRequest();
//   request.open("GET", `${apiUrl}/name/${country}`);
//   request.send();

//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     // Render country 1
//     renderCountry(data);

//     // Get neighbor country (2)
//     const [neighbor] = data.borders;
//     console.log(neighbor);

//     if (!neighbor) return;

//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `${apiUrl}/alpha/${neighbor}`);
//     request2.send();

//     request2.addEventListener("load", function () {
//       const data2 = JSON.parse(this.responseText);
//       renderCountry(data2, "neighbor");
//     });
//   });
// };

// getCountryAndNeighbor("france");
// getCountryAndNeighbor("usa");

// callback hell
// setTimeout(() => {
//   console.log("1 second passed");
//   setTimeout(() => {
//     console.log("2 second passed");
//     setTimeout(() => {
//       console.log("3 second passed");
//       setTimeout(() => {
//         console.log("4 second passed");
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

// Promises and the fetch app
const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(errorMsg);
    }

    return res.json();
  });
};

const getCountryAndNeighbor = function (country) {
  // Country 1
  getJSON(`${apiUrl}/name/${country}`, "Country not found")
    .then((data) => {
      renderCountry(data[0]);
      if (!data[0].borders) throw new Error("No neighbour found!");

      const neighbor = data[0].borders[0];

      // Country 2
      return getJSON(`${apiUrl}/alpha/${neighbor}`, "Country not found");
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.log(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener("click", function () {
  getCountryAndNeighbor("france");
});

getCountryAndNeighbor("australia");
