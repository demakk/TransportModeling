import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  username = '';
  password = '';
  confirmPassword = '';


  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  register() {

    if (this.password !== this.confirmPassword) {
      this.toastService.show('Паролі не співпадають');
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/user']);
        this.toastService.show(`Ласкаво просимо, ${this.username}!`);
      }
    });
  }
}
