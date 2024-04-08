import { Component, inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private router = inject(Router);

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '1043280726080-2kjputaaed6b03r443rqf9o3e5takbvp.apps.googleusercontent.com',
      callback: (resp: any) => this.handleGoogleLogin(resp)
    });
    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangular'
    });
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
    // Définir l'utilisateur en mode visiteur
    sessionStorage.setItem('loggedInUser', 'visiteur');
    location.reload();
  }
}
