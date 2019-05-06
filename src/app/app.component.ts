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

  loadSubjects() {
    axios.get(this.baseUrl + this.subjectsPart)
      .then(response => {
        let page = document.createElement('html');
        page.innerHTML = response.data;
        let districts = page.querySelectorAll('.bx_catalog_text .bx_catalog_text_title');
        const arr = Array.from(districts);
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
        let districts = page.querySelectorAll('.bx_catalog_text .bx_catalog_text_title');
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

  onSubjectSelected(event: any) {
    this.loadDistricts(event.target.value);
  }

  onDistrictSelected(event: any) {
    console.log(event.target.value);
  }
}
