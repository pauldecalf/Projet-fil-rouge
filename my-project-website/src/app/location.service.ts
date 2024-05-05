import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  sendLocationRequest(coords: { lat: number; lng: number }): void {}
}
