import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {NgIf} from "@angular/common";
import {AuthService} from "../../auth.service";
import {LocationService} from "../../location.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LoginComponent,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // Définir l'objet utilisateur avec des propriétés initiales
  userAccount = {
    email: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: ''
  };

  showLogin: boolean = false;
  auth = inject(AuthService);
  temperature: string | undefined;
  constructor(private authService: AuthService,
              private router: Router,
              private locationService: LocationService,
              private cdr: ChangeDetectorRef,
              private mapService: LocationService) {}

  @ViewChild('burgerBar') burgerBar: ElementRef | undefined;
  ngOnInit() {

    this.RecuperationDesDonnees();


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
RecuperationDesDonnees() {
  // Récupérer les informations utilisateur du sessionStorage
  const storedUser = sessionStorage.getItem('loggedInUser');

  // S'assurer que les informations ont été correctement récupérées
  if (storedUser) {
    // Les informations sont stockées sous forme de chaîne, nous devons les convertir en objet
    let userObj = JSON.parse(storedUser);

    // Remplir les informations de l'utilisateur
    this.userAccount.email = userObj.email;
    this.userAccount.name = userObj.name;
    this.userAccount.picture = userObj.picture;
  }
}


// Méthode pour gérer le clic sur le bouton Historique
  historyPanelVisible: boolean = false;
  toggleHistoryPanel() {
    this.historyPanelVisible = !this.historyPanelVisible;
    if (this.historyPanelVisible) {
      this.aujourdhuiPanelVisible = false;
      this.notificationPanelVisible = false;
    }
  }

// Méthode pour gérer le clic sur le bouton Aujourd'hui
  aujourdhuiPanelVisible: boolean = false;
  toggleAujourdhuiPanel() {
    this.aujourdhuiPanelVisible = !this.aujourdhuiPanelVisible;
    if (this.aujourdhuiPanelVisible) {
      this.historyPanelVisible = false;
      this.notificationPanelVisible = false;
      this.accountPanelVisible = false;
    }
  }

// Méthode pour gérer le clic sur le bouton de Notification
  notificationPanelVisible: boolean = false;
  toggleNotificationPanel() {
    this.notificationPanelVisible = !this.notificationPanelVisible;
    if (this.notificationPanelVisible) {
      this.historyPanelVisible = false;
      this.aujourdhuiPanelVisible = false;
      this.accountPanelVisible = false;
    }
  }

  // Méthode pour gérer le clic sur le bouton "Account"
  accountPanelVisible: boolean = false;
  toggleAccountPanel() {
    this.accountPanelVisible = !this.accountPanelVisible;
    if (this.accountPanelVisible) {
      this.historyPanelVisible = false;
      this.notificationPanelVisible = false;
      this.aujourdhuiPanelVisible = false;
    }
  }

  SaveLocation() {
    this.locationService.sendLocationRequest({ lat: 123, lng: 456 });
  }

  signOut() {
    this.authService.signOut();  // Utilisation de `this.authService` et non de `this.auth`
    this.router.navigate(['/']); // rediriger vers la page de connexion ou l'accueil
    location.reload(); // recharger la page
  }

}

