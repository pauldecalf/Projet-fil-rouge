import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('burgerBar') burgerBar: ElementRef | undefined;
  ngAfterViewInit() {
    this.burgerBar?.nativeElement.addEventListener('click', (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      // Sélectionnez les éléments à afficher/cacher par leur classe ou id
      document.querySelectorAll('.text-header-2, .text-header').forEach((element) => {
        element.classList.toggle('hidden'); // Basculer la classe 'hidden'
      });
    });
  }
}
