import {Component} from '@angular/core';

import axios from 'axios';
import * as XLSX from 'xlsx';

class CompanyInfo {
  chief: string;
  phone: string;
  email: string;
  site: string;
  inn: string;
  ogrn: string;
  address: string;
  workDays: string;
  dispatcherPhone: string;
  companyType: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  baseUrl = 'https://cors-anywhere.herokuapp.com/https://gis-zkh.ru';
  subjectsPart = '/upravlaushie-kompanii-rossii';
  subjects: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  companies: any[] = [];
  selectedCompanyInfo: CompanyInfo = new CompanyInfo();

  // загружаем субъекты
  // загружаем города и области субъекта
  // загружаем загружаем населенные пункты
  // загружаем организации каждого населенного пункта
  // todo: пагинация
  // todo: название компании
  // todo: разбить по субъектам
  // todo: возможно, стоит добавить для каждого населенного пункта заголовок

  private parseData(href: string, callback: (array: any[]) => void) {
    axios.get(this.baseUrl + href)
      .then(response => {
        const page = document.createElement('html');
        page.innerHTML = response.data;
        const elements = page.querySelectorAll('.bx_catalog_text_ul .bx_catalog_text_title');
        const elementsArray = Array.from(elements);
        const result = elementsArray.map(e => {
          const anchor = e.getElementsByTagName('a')[0];
          const span = e.getElementsByTagName('span')[0];
          return {
            href: anchor.getAttribute('href'),
            title: anchor.innerText,
            count: span.innerText.replace(/\(|\)/g, '')
          };
        });
        callback(result);
      })
      .catch(e => console.log('Error while scrabbling data from url ' + this.baseUrl + href, e));
  }
  loadSubjects() {
    this.parseData(this.subjectsPart, (result) => this.subjects = result);
  }

  loadDistricts(href: string) {
    this.parseData(href, (result) => this.districts = result);
  }

  loadCities(href: string) {
    this.parseData(href, (result) => this.cities = result);
  }

  loadCompanies(cityHref: string) {
    axios.get(this.baseUrl + cityHref)
      .then(response => {
        const page = document.createElement('html');
        page.innerHTML = response.data;
        const companies = page.querySelectorAll('.catalog-section .data-table tr td a');
        const arr = Array.from(companies);
        this.companies = arr.map(e => {
          return {
            href: e.getAttribute('href'),
            title: e.innerHTML
          };
        });
      })
      .catch(e => console.log(e));
  }

  loadCompanyInfo(href: string) {
    axios.get(this.baseUrl + href)
      .then(response => {
        const page = document.createElement('html');
        page.innerHTML = response.data;
        const info = page.querySelectorAll('.company-info__block .ank-text b');
        const resultObject: CompanyInfo = new CompanyInfo();
        const arr = Array.from(info);
        arr.forEach(e => {
          switch (e.innerHTML) {
                case 'Руководитель:': resultObject.chief = e.nextSibling.textContent.trim(); break;
                case 'Телефон:': resultObject.phone = e.nextSibling.textContent.trim(); break;
                case 'E-mail:': resultObject.email = e.nextSibling.textContent.trim(); break;
                case 'Сайт:': resultObject.site = e.nextSibling.textContent.trim(); break;
                case 'ИНН:': resultObject.inn = e.nextSibling.textContent.trim(); break;
                case 'ОГРН:': resultObject.ogrn = e.nextSibling.textContent.trim(); break;
                case 'Адрес:': resultObject.address = e.nextSibling.textContent.trim(); break;
                case 'Режим работы:': resultObject.workDays = e.nextSibling.textContent.trim(); break;
                case 'Телефон диспетчера:': resultObject.dispatcherPhone = e.nextSibling.textContent.trim(); break;
                case 'Тип компании:': resultObject.companyType = e.nextSibling.textContent.trim(); break;
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

  onGenerateXlsxButtonClickHandler(repeat: number) {
    console.log(Object.values(this.selectedCompanyInfo));
    const arr = new Array(repeat);
    const data = arr.fill(Object.values(this.selectedCompanyInfo));
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
}
