import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserPageMainPartComponent } from '../../components/user-page-main-part/user-page-main-part.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, UserPageMainPartComponent, FooterComponent],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {
  selectedBlock: 'graphs' | 'modeling' | null = null;
  
  role: string | null = null;
  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getUserRole();
    console.log("Role:   " + this.role)
  }

  selectGraphs() {
    this.selectedBlock = 'graphs';
    this.router.navigate(['/transport-load']);
  }

  selectModeling() {
    this.selectedBlock = 'modeling';
    this.router.navigate(['/economic-modeling']);
  }

  canAccessMainParts(): boolean {
    return this.role === 'user' || this.role === 'admin';
  }
}
