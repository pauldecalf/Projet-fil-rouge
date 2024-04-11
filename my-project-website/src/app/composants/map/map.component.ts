import { Component, Injectable } from '@angular/core';
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, throwError } from "rxjs";

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
          // Traitement normal si la géolocalisation est autorisée
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.createMap(coords);
          this.addMarker({ coords, text: "Vous êtes ici ", open: true });
          console.log('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);
          if (sessionStorage.getItem("loggedInUser")) {
            this.sendLocationRequest(coords);
          }
        },
        (error) => {
          if (error.code === 1) {
            // L'utilisateur a refusé la géolocalisation, afficher un message d'erreur
            console.error('L\'utilisateur a refusé la géolocalisation');
          } else {
            // Autre erreur de géolocalisation, gérer selon les besoins de votre application
            console.error('Error getting location', error);
          }
          // Fallback to default position
          const defaultCoords = { lat: 48.114384, lng: -1.669494 };
          this.createMap(defaultCoords);
          if (sessionStorage.getItem("loggedInUser")) {
            this.sendLocationRequest(defaultCoords);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to default position
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
    }).addTo(this.map);
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
    let userEmail = 'visiteur';

    if (loggedInUser !== 'visiteur') {
      try {
        const parsedUser = JSON.parse(loggedInUser || '');
        userEmail = parsedUser.name;
      } catch (error) {
        console.error('Error parsing loggedInUser:', error);
      }
    }

    const currentTime = new Date().getTime();
    const lastRequestTime = Number(sessionStorage.getItem('lastRequestTime-'+userEmail));
    if (userEmail !== 'visiteur' && lastRequestTime && (currentTime - lastRequestTime) < 300000) {
      // Si moins de 5 minutes se sont écoulées depuis la dernière requête, on ne fait rien
      return;
    }

    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=621d22b056a93fbeca5fa8b24b8198b8&units=metric`;

    this.http.get(weatherAPIUrl).pipe(
      catchError(error => throwError(() => new Error('Error fetching weather data: ' + error)))
    ).subscribe(
      (weatherResponse: any) => {
        console.log('Weather data fetched successfully:', weatherResponse);
        const weatherData = {
          temperature: weatherResponse.main.temp,
          pressure: weatherResponse.main.pressure,
          humidity: weatherResponse.main.humidity,
          windSpeed: weatherResponse.wind.speed,
        };

        sessionStorage.setItem('temp', String(weatherResponse.main.temp));
        sessionStorage.setItem('lastRequestTime-' + userEmail, String(currentTime));  // save the current time as Last Request Time in the sesssionStorage

        if (userEmail !== 'visiteur') {
          const dataToSend = {
            userEmail,
            lng: coords.lng,
            lat: coords.lat,
            heureAppel: currentTime,
            temperature: weatherData.temperature,
            pressure: weatherData.pressure,
            humidity: weatherData.humidity,
            windSpeed: weatherData.windSpeed,
          };

          this.http.post('http://localhost:3000/openweather', dataToSend).subscribe(
            (response) => {
              console.log('Location and weather data sent successfully:', response);
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
