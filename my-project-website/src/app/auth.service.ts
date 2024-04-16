import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  signOut() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/']);
  }

  setUser(user: any) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getUser() {
    // @ts-ignore
    return JSON.parse(sessionStorage.getItem('loggedInUser'));
  }
}
