import {Component, Injectable} from '@angular/core';
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, throwError} from "rxjs";

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

  @Injectable({
    providedIn: 'root'
  })
  ngAfterViewInit(): void {
    this.getCurrentLocation();
    this.getCurrentLocationAndSendRequest();
  }
  getCurrentLocationAndSendRequest(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {lat: position.coords.latitude, lng: position.coords.longitude};
          this.sendLocationRequest(coords);
        },
        (error) => {
          console.error('Error getting location', error);
          // Fallback to default position
          const defaultCoords = {lat: 48.114384, lng: -1.669494};
          this.sendLocationRequest(defaultCoords);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to default position
      const defaultCoords = {lat: 48.114384, lng: -1.669494};
      this.sendLocationRequest(defaultCoords);
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {lat: position.coords.latitude, lng: position.coords.longitude};
        this.createMap(coords);
        this.addMarker({coords, text: "Vous êtes ici ", open: true});
        console.log('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);

      }, (error) => {
        console.error('Error getting location', error);
        // Fallback sur une position par défaut
        this.createMap({lat: 48.114384, lng: -1.669494});
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback sur une position par défaut
      this.createMap({lat: 48.114384, lng: -1.669494});
    }
  }

  createMap(coords: { lat: number; lng: number }) {
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

  addMarker({coords, text, open}: { coords: { lat: number; lng: number }; text: string; open: boolean }) {
    const marker = L.marker([coords.lat, coords.lng], {icon: this.smallIcon});
    marker.addTo(this.map).bindPopup(text, {autoClose: false});
    if (open) {
      marker.openPopup();
    }
  }

  private sendLocationRequest(coords: { lat: number; lng: number }): void {
    // URL pour requêter l'API OpenWeatherMap - Remplacez par votre propre clé API
    const weatherAPIUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=621d22b056a93fbeca5fa8b24b8198b8&units=metric`;

    this.http.get(weatherAPIUrl).pipe(
      catchError(error => throwError(() => new Error('Error fetching weather data: ' + error)))
    ).subscribe(
      (weatherResponse: any) => {
        console.log('Weather data fetched successfully:', weatherResponse);
        // Extraction des données météorologiques
        const weatherData = {
          temperature: weatherResponse.main.temp,
          pression: weatherResponse.main.pressure,
          humidite: weatherResponse.main.humidity,
          vitesseVent: weatherResponse.wind.speed,
          // Ajoutez d'autres données au besoin
        };

        sessionStorage.setItem('temp', weatherResponse.main.temp);


        // Préparation des données à envoyer à votre API backend
        const dataToSend = {
          userEmail: JSON.parse(sessionStorage.getItem("loggedInUser") || '{}').name, // Ajustez selon votre logique d'application
          lng: coords.lng,
          lat: coords.lat,
          // heureAppel est dérivée de dateAppel ou peut être spécifiée séparément si nécessaire
          // Information concernant l'appel API
          heureAppel: new Date().getTime(),

          // Information météo
          temperature: weatherData.temperature,
          pression: weatherData.pression,
          humidite: weatherData.humidite,
          vitesseVent: weatherData.vitesseVent,
        };

        // Envoi des données au backend
        this.http.post('http://localhost:3000/openweather', dataToSend).subscribe(
          (response) => {
            console.log('Location and weather data sent successfully:', response);
          },
          (error) => {
            console.error('Error sending location and weather data:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }
}
