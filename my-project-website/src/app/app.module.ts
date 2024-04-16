import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HeaderComponent } from './composants/header/header.component';

// AppComponent sans 'standalone: true'
@Component({
  selector: 'app-root',
  template: `<h1>Hello world</h1><app-header></app-header>`, // Utilisez le sélecteur du HeaderComponent dans le template
})
export class AppComponent {}

@NgModule({
  declarations: [
    AppComponent, // Incluez l'AppComponent ici
    HeaderComponent // Incluez le HeaderComponent ici
  ],
  imports: [BrowserModule],
  bootstrap: [AppComponent] // L'AppComponent sera initialisé au lancement de l'application
})
export class AppModule {}
