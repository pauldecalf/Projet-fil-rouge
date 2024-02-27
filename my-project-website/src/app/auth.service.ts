import {Router} from "@angular/router";

declare var google: any;
import {inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
router = inject(Router);
  constructor() { }
  signOut() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }
}
