import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {LoginComponent} from "../../pages/login/login.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../auth.service";
import { HttpClient } from "@angular/common/http";
import {LocationService} from "../../location.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LoginComponent,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {


  showLogin: boolean = false;
  auth = inject(AuthService);
  signOut() {
    this.auth.signOut();
  }
  latitudeValue: number = 0;
  longitudeValue: number = 0;
  temperature: string | undefined;
  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef, private http: HttpClient) {}


  @ViewChild('burgerBar') burgerBar: ElementRef | undefined;
  ngAfterViewInit() {
    const temp = sessionStorage.getItem('temp');
    if (temp !== null) {
      this.temperature = JSON.parse(temp);
    }

    this.showLogin = !sessionStorage.getItem('loggedInUser');
    this.cdr.detectChanges(); // Déclenche manuellement la détection de changement
    this.burgerBar?.nativeElement.addEventListener('click', (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      // Sélectionnez les éléments à afficher/cacher par leur classe ou id
      document.querySelectorAll('.text-header-2, .text-header').forEach((element) => {
        element.classList.toggle('hidden'); // Basculer la classe 'hidden'
      });
    });
  }
  // Méthode pour gérer le clic sur le bouton Historique
  historyPanelVisible: boolean = false;

  toggleHistoryPanel() {
    this.historyPanelVisible = !this.historyPanelVisible;
  }

  SaveLocation() {
    this.locationService.getCurrentLocation().then(coords => {
      this.locationService.sendLocationRequest(coords);
    }).catch(error => {
      console.error('Error getting location:', error);
    });
  }


}

