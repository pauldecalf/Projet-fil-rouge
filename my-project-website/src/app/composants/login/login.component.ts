import { Component, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LocationService } from "../../location.service";

declare var google: any; // Déclaration de l'objet google

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(private locationService: LocationService, private router: Router) { }

  ngAfterViewInit() {
    const coords = { lat: 123, lng: 456 }; // Coordonnées à envoyer
    this.locationService.sendLocationRequest(coords);

    this.initializeGoogleLogin();
  }

  private initializeGoogleLogin() {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        clearInterval(interval); // Arrêter la vérification lorsque google est défini
        google.accounts.id.initialize({
          client_id: '1043280726080-2kjputaaed6b03r443rqf9o3e5takbvp.apps.googleusercontent.com',
          callback: (resp: any) => this.handleGoogleLogin(resp)
        });

        setTimeout(() => {
          google.accounts.id.renderButton(document.getElementById('google-btn'), {
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            text: 'Se connecter avec Google',
            width: '300px',
            customSize: false,
            customMargin: '10px 0',
            customPadding: '10px 20px',
            disabled: false,
            font: 'Roboto'
          });
        }, 0);
      }
    }, 100); // Vérifier toutes les 100 millisecondes
  }

  private decodeJwt(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  handleGoogleLogin(response: any) {
    if (response) {
      const payload = this.decodeJwt(response.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payload));
      location.reload();
    }
  }

  enterVisitorMode() {
    sessionStorage.setItem('loggedInUser', 'visiteur');
    location.reload();
  }

  showLegalText: boolean = false;
  showCGUText: boolean = false;
  showRGPDText: boolean = false;

  toggleLegalText() {
    this.showLegalText = !this.showLegalText;
    this.showCGUText = false;
    this.showRGPDText = false;
  }

  toggleCGUText() {
    this.showCGUText = !this.showCGUText;
    this.showLegalText = false;
    this.showRGPDText = false;
  }

  toggleRGPDText() {
    this.showRGPDText = !this.showRGPDText;
    this.showLegalText = false;
    this.showCGUText = false;
  }
}
