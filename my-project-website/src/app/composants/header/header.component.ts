import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {DatePipe, formatDate, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../auth.service";
import {LocationService} from "../../location.service";
import { Router } from '@angular/router';
import {WeatherService} from "../../weather.service";
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LoginComponent,
    NgIf,
    DatePipe,
    NgForOf,
    KeyValuePipe,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userAccount = {
    email: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: ''
  };
  dailyForecast: any[] = [];
  weatherData: any;
  weatherIconUrl: any;
  showLogin: boolean = false;
  temperature: string | undefined;
  data: any;
  historyPanelVisible: boolean = false;
  accountPanelVisible: boolean = false;
  notificationPanelVisible: boolean = false;
  aujourdhuiPanelVisible: boolean = false;
  searchPanelVisible: boolean = false;
  weatherDataUser: any[] = [];
  weatherDataByDay: { [key: string]: any[] } = {}; // Déclaration de la propriété weatherDataByDay

  constructor(private authService: AuthService,
              private router: Router,
              private locationService: LocationService,
              private cdr: ChangeDetectorRef,
              private weatherService: WeatherService,
              private http: HttpClient) {}

  @ViewChild('burgerBar') burgerBar: ElementRef | undefined;

  ngOnInit() {
    this.getWeatherData();
    this.checkSessionStorage();
    this.getHistoricalUser();

  }

   async getHistoricalUser() {
     this.weatherDataUser = await this.http.get<any>('https://api-de-paul.freeboxos.fr:30000/openweather/user/' + sessionStorage.getItem('userEmail')).toPromise();
  }




  getWeatherIcon(description: string): string {
    return `/assets/img/${description.toLowerCase()}.png`;
  }

  getDailyWeatherForecast() {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      const lon = coords.longitude;
      const lat = coords.latitude;

      this.weatherService.getDailyForecast(lat, lon).subscribe(
        (data) => {
          this.dailyForecast = data.daily;  // Mettez à jour dailyForecast ici
        },
        (error) => {
          console.error('Error fetching daily weather forecast:', error);
        }
      );
    });
  }

  getWeatherData() {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      const lon = coords.longitude;
      const lat = coords.latitude;

      this.weatherService.getWeather(lat, lon).subscribe(
        (data) => {
          this.weatherData = data;
          this.weatherIconUrl = 'https://openweathermap.org/img/w/' + this.weatherData.weather[0].icon + '.png';
        },
        (error) => {
          console.error('Error fetching weather data:', error);
        }
      );
    });
  }

  checkSessionStorage() {
    const temp = sessionStorage.getItem('temp');
    if (temp !== null) {
      this.temperature = JSON.parse(temp);
    }

    this.showLogin = !sessionStorage.getItem('loggedInUser');
    this.cdr.detectChanges();

    this.burgerBar?.nativeElement.addEventListener('click', (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      document.querySelectorAll('.text-header-2, .text-header').forEach((element) => {
        element.classList.toggle('hidden');
      });
    });

    const storedUser = sessionStorage.getItem('loggedInUser');

    if (storedUser !== null && storedUser !== 'visiteur') {
      let userObj = JSON.parse(storedUser);
      this.userAccount.email = userObj.email;
      this.userAccount.name = userObj.name;
      this.userAccount.picture = userObj.picture;
    }
  }

  toggleHistoryPanel() {
    this.historyPanelVisible = !this.historyPanelVisible;
    if (this.historyPanelVisible) {
      this.aujourdhuiPanelVisible = false;
      this.notificationPanelVisible = false;
      this.accountPanelVisible = false;
      this.searchPanelVisible = false;
    }
  }

  toggleAujourdhuiPanel() {
    this.aujourdhuiPanelVisible = !this.aujourdhuiPanelVisible;
    if (this.aujourdhuiPanelVisible) {
      this.historyPanelVisible = false;
      this.notificationPanelVisible = false;
      this.accountPanelVisible = false;
      this.searchPanelVisible = false;
    }
  }

  toggleNotificationPanel() {
    this.notificationPanelVisible = !this.notificationPanelVisible;
    if (this.notificationPanelVisible) {
      this.historyPanelVisible = false;
      this.aujourdhuiPanelVisible = false;
      this.accountPanelVisible = false;
      this.searchPanelVisible = false;
    }
  }

  toggleAccountPanel() {
    this.accountPanelVisible = !this.accountPanelVisible;
    if (this.accountPanelVisible) {
      this.historyPanelVisible = false;
      this.notificationPanelVisible = false;
      this.aujourdhuiPanelVisible = false;
      this.searchPanelVisible = false;
    }
  }

  toggleSearchPanel() {
    this.searchPanelVisible = !this.searchPanelVisible;
    if (this.searchPanelVisible) {
      this.historyPanelVisible = false;
      this.notificationPanelVisible = false;
      this.aujourdhuiPanelVisible = false;
      this.accountPanelVisible = false;
    }
  }

  SaveLocation() {
    this.locationService.sendLocationRequest({ lat: 123, lng: 456 });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/']);
    location.reload();
  }
  changeLogin() {
    sessionStorage.removeItem('loggedInUser')
    window.location.reload();
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/w/${icon}.png`;
  }

  getWeatherDescription(weather: any): string {
    return weather?.weather[0]?.description || '';
  }

  protected readonly Date = Date;
  protected readonly formatDate = formatDate;


  protected readonly sessionStorage = sessionStorage;
}
