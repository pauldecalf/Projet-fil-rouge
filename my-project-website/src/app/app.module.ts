import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HeaderComponent } from './composants/header/header.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {WeatherService} from "./weather.service";
import {HomeComponent} from "./pages/home/home.component";

// AppComponent sans 'standalone: true'
@Component({
  selector: 'app-root',
  template: `<app-home></app-home>`, // Utilisez le sélecteur du HeaderComponent dans le template
})
export class AppComponent {}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [BrowserModule, HttpClientModule, HeaderComponent, HomeComponent],
  providers: [WeatherService, HttpClient], // Ajoutez HttpClient ici
  bootstrap: [AppComponent]
})
export class AppModule {}
