import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editProfile() {
    alert('Функція редагування профілю в розробці');
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
