import {Component} from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  baseUrl: string = 'https://cors-anywhere.herokuapp.com/https://gis-zkh.ru';
  subjectsPart: string = '/upravlaushie-kompanii-rossii';
  subjects: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  companies: any[] = [];
  selectedCompanyInfo: Object = {};

  // загружаем субъекты
  // загружаем города и области субъекта
  // загружаем загружаем населенные пункты
  // загружаем организации каждого населенного пункта
  // todo: пагинация

  loadSubjects() {
    axios.get(this.baseUrl + this.subjectsPart)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let subjects = page.querySelectorAll('.bx_catalog_text_ul .bx_catalog_text_title');
        const arr = Array.from(subjects);
        this.subjects = arr.map(e => {
          const anchor = e.getElementsByTagName('a')[0];
          const span = e.getElementsByTagName('span')[0];
          return {
            href: anchor.getAttribute('href'),
            title: anchor.innerText,
            count: span.innerText.replace(/\(|\)/g, '')
          }
        });
      })
      .catch(e => console.log(e));
  }

  loadDistricts(subjectHref: string) {
    axios.get(this.baseUrl + subjectHref)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let districts = page.querySelectorAll('.bx_catalog_text_ul .bx_catalog_text_title');
        const arr = Array.from(districts);
        this.districts = arr.map(e => {
          const anchor = e.getElementsByTagName('a')[0];
          const span = e.getElementsByTagName('span')[0];
          return {
            href: anchor.getAttribute('href'),
            title: anchor.innerText,
            count: span.innerText.replace(/\(|\)/g, '')
          }
        });
      })
      .catch(e => console.log(e));
  }

  loadCities(subjectHref: string) {
    axios.get(this.baseUrl + subjectHref)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let cities = page.querySelectorAll('.bx_catalog_text_ul .bx_catalog_text_title');
        const arr = Array.from(cities);
        this.cities = arr.map(e => {
          const anchor = e.getElementsByTagName('a')[0];
          const span = e.getElementsByTagName('span')[0];
          return {
            href: anchor.getAttribute('href'),
            title: anchor.innerText,
            count: span.innerText.replace(/\(|\)/g, '')
          }
        });
      })
      .catch(e => console.log(e));
  }

  loadCompanies(cityHref: string) {
    axios.get(this.baseUrl + cityHref)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let companies = page.querySelectorAll('.catalog-section .data-table tr td a');
        const arr = Array.from(companies);
        this.companies = arr.map(e => {
          return {
            href: e.getAttribute('href'),
            title: e.innerHTML
          }
        });
      })
      .catch(e => console.log(e));
  }

  loadCompanyInfo(href: string) {
    axios.get(this.baseUrl + href)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let info = page.querySelectorAll('.company-info__block .ank-text b');
        const resultObject = {};
        const arr = Array.from(info);
        arr.forEach(e => {
          switch (e.innerHTML) {
                case 'Руководитель:': resultObject['chief'] = e.nextSibling.textContent.trim(); break;
                case 'Телефон:': resultObject['phone'] = e.nextSibling.textContent.trim(); break;
                case 'E-mail:': resultObject['email'] = e.nextSibling.textContent.trim(); break;
                case 'Сайт:': resultObject['site'] = e.nextSibling.textContent.trim(); break;
                case 'ИНН:': resultObject['inn'] = e.nextSibling.textContent.trim(); break;
                case 'ОГРН:': resultObject['ogrn'] = e.nextSibling.textContent.trim(); break;
                case 'Адрес:': resultObject['address'] = e.nextSibling.textContent.trim(); break;
                case 'Режим работы:': resultObject['workDays'] = e.nextSibling.textContent.trim(); break;
                case 'Телефон диспетчера:': resultObject['dispatcherPhone'] = e.nextSibling.textContent.trim(); break;
                case 'Тип компании:': resultObject['companyType'] = e.nextSibling.textContent.trim(); break;
                default:
                  break;
              }
        });
        this.selectedCompanyInfo = resultObject;
      })
      .catch(e => console.log(e));
  }

  onSubjectSelected(event: any) {
    this.loadDistricts(event.target.value);
  }

  onDistrictSelected(event: any) {
    this.loadCities(event.target.value);
  }

  onCitySelected(event: any) {
    this.loadCompanies(event.target.value);
  }

  onCompanySelected(event: any) {
    this.loadCompanyInfo(event.target.value);
  }
}
