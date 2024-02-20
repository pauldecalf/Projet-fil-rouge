import {Component} from '@angular/core';
import {HttpClientModule} from '@angular/common/http'; // Importez HttpClientModule
import {MapComponent} from "../../composants/map/map.component";
import {HeaderComponent} from "../../composants/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule, // Ajoutez HttpClientModule aux imports
    MapComponent,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Corrigez ici : 'styleUrls' au lieu de 'styleUrl'
})
export class HomeComponent {
  constructor() {
  }


}
