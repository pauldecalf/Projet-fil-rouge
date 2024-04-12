import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            resolve(coords);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  sendLocationRequest(coords: { lat: number; lng: number }): void {
    // Envoyer les coordonnées au serveur ici
    console.log('Sending location request:', coords);
  }
}
