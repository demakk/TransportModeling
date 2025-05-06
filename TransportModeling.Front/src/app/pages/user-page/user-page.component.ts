import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserPageMainPartComponent } from '../../components/user-page-main-part/user-page-main-part.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, UserPageMainPartComponent],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent {
  selectedBlock: 'graphs' | 'modeling' | null = null;
  
  role: string | null = null;
  constructor(private authService: AuthService) {
    this.role = this.authService.getUserRole();
    console.log("Role:   " + this.role)
  }

  selectGraphs() {
    this.selectedBlock = 'graphs';
  }

  selectModeling() {
    this.selectedBlock = 'modeling';
  }

  canAccessMainParts(): boolean {
    return this.role === 'user' || this.role === 'admin';
  }
}
