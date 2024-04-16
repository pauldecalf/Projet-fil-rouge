import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  sendLocationRequest(coords: { lat: number; lng: number }): void {
    // Envoyer les coordonnées au serveur ici
    console.log('Sending location request:', coords);
  }
}
