import { Component, Injectable } from '@angular/core';
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  // @ts-ignore
  private map: L.Map;
  private smallIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.createMap(coords);
          this.addMarker({ coords, text: "Vous êtes ici ", open: true });
          if (sessionStorage.getItem("loggedInUser")) {
            this.sendLocationRequest(coords);
          }
        },
        (error) => {
          console.error("Erreur lors de la récupération de la localisation:", error);
          // Fallback à une position par défaut en cas d'erreur
          const defaultCoords = { lat: 48.114384, lng: -1.669494 };
          this.createMap(defaultCoords);
          if (sessionStorage.getItem("loggedInUser")) {
            this.sendLocationRequest(defaultCoords);
          }
        }
      );
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
      // Fallback à une position par défaut en cas d'absence de support de géolocalisation
      const defaultCoords = { lat: 48.114384, lng: -1.669494 };
      this.createMap(defaultCoords);
      if (sessionStorage.getItem("loggedInUser")) {
        this.sendLocationRequest(defaultCoords);
      }
    }
  }



  createMap(coords: { lat: number; lng: number }): void {
    const zoomLevel = 17;
    this.map = L.map('map', {
      center: [coords.lat, coords.lng],
      zoom: zoomLevel
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 12,
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(<L.Map>this.map);

    // On utilise Promise.resolve().then() à la place de setTimeout
    Promise.resolve().then(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });
  }

  addMarker({ coords, text, open }: { coords: { lat: number; lng: number }; text: string; open: boolean }): void {
    const marker = L.marker([coords.lat, coords.lng], { icon: this.smallIcon });
    marker.addTo(this.map).bindPopup(text, { autoClose: false });
    if (open) {
      marker.openPopup();
    }
  }

  private sendLocationRequest(coords: { lat: number; lng: number }): void {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    let userEmail = '';

    if (loggedInUser !== 'visiteur') {
      try {
        const parsedUser = JSON.parse(loggedInUser || '');
        userEmail = parsedUser.name;
        sessionStorage.setItem('userEmail', userEmail);
      } catch (error) {
        console.error('Error parsing loggedInUser:', error);
      }
    }

    const currentTime = Date.now();  // save the current timestamp as Last Request Time in the sessionStorage
    const lastRequestTime = Number(sessionStorage.getItem('lastRequestTime'));
    if (loggedInUser != 'visiteur'  && (currentTime - lastRequestTime) < 300000) {
      // Si moins de 5 minutes se sont écoulées depuis la dernière requête, on ne fait rien
      return;
    }
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=621d22b056a93fbeca5fa8b24b8198b8&lang=fr&units=metric`;

    this.http.get(weatherAPIUrl).pipe(
      catchError(error => throwError(() => new Error('Error fetching weather data: ' + error)))
    ).subscribe(
      (weatherResponse: any) => {
        sessionStorage.setItem('temp', String(weatherResponse.main.temp));
        sessionStorage.setItem('lastRequestTime', String(Date.now()));  // save the current timestamp as Last Request Time in the sessionStorage

        if (loggedInUser != 'visiteur') {
          const dataToSend = {
            userEmail: userEmail,
            lng: coords.lng,
            lat: coords.lat,
            name: weatherResponse.name,
            temperature: weatherResponse.main.temp,
            pressure: weatherResponse.main.pressure,
            humidity: weatherResponse.main.humidity,
            windSpeed: weatherResponse.wind.speed,
            minTemperature: weatherResponse.main.temp_min,
            maxTemperature: weatherResponse.main.temp_max,
            pression: weatherResponse.main.pressure,
            vitesseVent: weatherResponse.wind.speed,
            weatherDescription: weatherResponse.weather[0].description,
            weatherIcon: weatherResponse.weather[0].icon,
            sunrise: new Date(weatherResponse.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' }),
            sunset: new Date(weatherResponse.sys.sunset * 1000).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' }),
            feelsLike: weatherResponse.main.feels_like,
            visibility: weatherResponse.visibility,
            uvIndex: weatherResponse.uvi,
            dewPoint: weatherResponse.main.dew_point,
            clouds: weatherResponse.clouds.all,
            rain: weatherResponse.rain ? weatherResponse.rain['1h'] : 0,
            snow: weatherResponse.snow ? weatherResponse.snow['1h'] : 0
          };

          this.http.post('https://5b10bc54cc99.ngrok.app/openweather', dataToSend).subscribe(
            (response) => {
            },
            (error) => {
              console.error('Error sending location and weather data:', error);
            }
          );


        }
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );


  }


}
