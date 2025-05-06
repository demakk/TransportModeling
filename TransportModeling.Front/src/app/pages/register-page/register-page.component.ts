import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  username = '';
  password = '';
  confirmPassword = '';

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  register() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.toastService.show('Паролі не співпадають.');
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/user']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.toastService.show('Користувач з таким ім\'ям вже існує.');
        } else {
          this.toastService.show('Сталася невідома помилка під час реєстрації');
        }
      }
    });
  }
}
