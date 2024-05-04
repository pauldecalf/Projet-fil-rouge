import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '621d22b056a93fbeca5fa8b24b8198b8';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';


  constructor(private http: HttpClient) { }  // Injection de HttpClient ici

  getWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&lang=fr&units=metric`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données météorologiques:', error);
        throw error;
      })
    );
  }
  getDailyForecast(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${this.apiKey}&lang=fr&units=metric`;
    return this.http.get(url);
  }


}
