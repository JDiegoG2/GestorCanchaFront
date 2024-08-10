import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gestor-canchas-sinteticas';
  showNavbar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.router.navigate(['/login']);
    }
  
    this.updateNavbarVisibility(this.router.url);
  
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateNavbarVisibility(event.url);
      });
  }

  // Agrega esta función para manejar la visibilidad del navbar
  private updateNavbarVisibility(url: string): void {
    this.showNavbar = !['/login', '/register'].includes(url);
  }
}
