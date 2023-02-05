import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(inputCountriesCheck, DEBOUNCE_DELAY));

function inputCountriesCheck() {
  const trimValue = input.value.trim();
  clearCountry();
  if (trimValue !== '') {
    fetchCountries(trimValue).then(findedData => {
      if (findedData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (findedData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (findedData.length > 2 && findedData.length <= 10) {
        countriesMaker(findedData);
      } else if (findedData.length === 1) {
        oneCountryMaker(findedData);
      }
    });
  }
}

function countriesMaker(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item"><img src="${country.flags.svg}" alt=" Flag of ${country.name.official}" width="80"><b>${country.name.official}</b></li>`;
    })
    .join('');

  countryList.insertAdjacentHTML('beforeend', markup);
}

function oneCountryMaker(countries) {
  const markup = countries
    .map(country => {
      if (
        country.name.official === 'Russian Federation' ||
        country.name.official === 'Republic of Belarus'
      ) {
        return `<div><img src="https://media.tenor.com/kbQv5cIBq8IAAAAC/the-office-steve-carell.gif" alt="you so dumb ass" width="450"></div> `;
      }
      return `<div class="country-info__item"><img src="${country.flags.svg}" alt="Flag of${
        country.name.official
      }" width="45"><h2 class="country-info__header">${country.name.official}</h2></div><div class="info"><p><b>Capital:</b> ${
        country.capital
      }</p><p><b>Population:</b> ${country.population}</p><p><b>Languages:</b> ${Object.values(
        country.languages
      )}</p></div>`;
    })
    .join('');

  countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearCountry() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = "";
}
